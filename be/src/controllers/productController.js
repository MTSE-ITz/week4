const { create, get, list, search, syncData } = require('../services/productService');

const createProduct = async (req, res) => {
  const data = await create(req.body);
  return res.status(200).json(data);
}

const getProduct = async (req, res) => {
  const id = await get(req.query);
  return res.status(200).json(id);
}

const listProducts = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const data = await list({ page, limit });
  return res.status(200).json(data);
}

const searchProducts = async (req, res) => {
  const { q, category, minPrice, maxPrice, page, limit } = req.query;
  const data = await search({ q, category, minPrice, maxPrice, page, limit });
  return res.status(200).json(data);
}

const syncProducts = async (req, res) => {
  const data = await syncData();
  return res.status(200).json(data);
}

module.exports = { createProduct, getProduct, listProducts, searchProducts, syncProducts }