require('dotenv').config();

const db = require("../models/index.js");
const productRepository = db.Product;

const create = async (data) => {
  try {
    return await productRepository.create(data);
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

module.exports = {
  create, get, list
}