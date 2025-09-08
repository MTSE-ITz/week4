require('dotenv').config();

const db = require("../models/index.js");
const productRepository = db.Product;
const { client } = require('../config/elastic');

const create = async (data) => {
  try {
    const product = await productRepository.create(data);

    // create index if not exist
    await ensureIndex()

    await client.index({
      index: 'products',
      id: product.id.toString(),
      document: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        isFeatured: product.isFeatured,
        quantity: product.quantity,
        image: product.image,
        createdAt: product.createdAt
      }
    });
    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
}

const get = async (id) => {
  try {
    return await productRepository.findOne({id: id});
  } catch (error) {
    console.error('Error get product:', error);
    return null;
  }
}

const list = async ({ page, limit }) => {
  try {
    const offset = (page - 1) * limit;
    const { count, rows } = await productRepository.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      items: rows,
    };
  } catch (error) {
    console.error('Error listing products:', error);
    return null;
  }
}

const search = async ({ q, category, minPrice, maxPrice, page = 1, limit = 20 }) => {
  try {
    // create index if not exist
    await ensureIndex()

    const must = [];
    const filter = [];

    if (q) {
      must.push({
        multi_match: {
          query: q,
          fields: ['name^3', 'category^2', 'description'],
          fuzziness: 'AUTO'
        }
      });
    }

    if (category) {
      filter.push({
        match: { category }
      });
    }

    if (minPrice || maxPrice) {
      const range = {};
      if (minPrice) range.gte = minPrice;
      if (maxPrice) range.lte = maxPrice;
      filter.push({ range: { price: range } });
    }

    const from = (page - 1) * limit;

    const { hits } = await client.search({
      index: 'products',
      from,
      size: limit,
      query: {
        bool: {
          must,
          filter
        }
      },
      sort: [{ createdAt: 'desc' }]
    });
    const total = typeof hits.total === 'number' ? hits.total : hits.total.value;
    return {
      success: true,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      items: hits.hits.map(hit => hit._source)
    };
  } catch (error) {
    console.error('Error searching products:', error);
    return null;
  }
}

async function ensureIndex() {
  const index = "products";
  const exists = await client.indices.exists({ index });
  if (!exists) {
    await client.indices.create({
      index,
      body: {
        mappings: {
          properties: {
            name: { type: "text" },
            description: { type: "text" },
            price: { type: "float" },
            createdAt: { type: "date" }
          }
        }
      }
    });
    console.log(`Created index ${index}`);
  }
}

const syncData = async() => {
  try {
    const products = await productRepository.findAll();

    for (const product of products) {
      await client.index({
        index: "products",
        id: product.id.toString(),
        document: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          isFeatured: product.isFeatured,
          quantity: product.quantity,
          image: product.image,
          createdAt: product.createdAt,
        },
      });
    }

    return {
      success: true,
      message: "Đã sync toàn bộ sản phẩm từ DB sang Elasticsearch",
      total: products.length,
    };
  } catch (error) {
    console.error("❌ Error syncing products:", error);
    throw new Error("Lỗi khi sync dữ liệu: " + error.message);
  }
}

module.exports = {
  create, get, list, search, syncData
}