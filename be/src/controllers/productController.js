import { ApiResponseListDto } from '../common/api-response-list.js';
import { ApiResponse } from '../common/api-response.js';
import {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  getViewedProductsService,
  addViewedProductService,
  searchProductsService,
  getSimilarProductsService,
  deleteViewedProductService,
} from '../services/productService.js';

export const createProduct = async (req, res) => {
  try {
    const product = await createProductService(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  const start = Date.now();
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    const productsData = await getAllProductsService(page, size);

    const response = new ApiResponseListDto({
      result: true,
      data: productsData,
      message: 'Get all products successfully',
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });

    res.json(response);
  } catch (error) {
    const response = new ApiResponseListDto({
      result: false,
      data: null,
      message: error.message,
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.status(500).json(response);
  }
};

export const getProductById = async (req, res) => {
  const start = Date.now();
  try {
    const product = await getProductByIdService(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const response = new ApiResponseListDto({
      result: true,
      data: product,
      message: 'Get product successfully',
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.json(response);
  } catch (error) {
    const response = new ApiResponseListDto({
      result: false,
      data: null,
      message: error.message,
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.status(500).json(response);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await updateProductService(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await deleteProductService(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addViewedProduct = async (req, res) => {
  const start = Date.now();

  try {
    const { productId } = req.body;
    const userId = req.user.id;
    await addViewedProductService(userId, productId);
    const response = new ApiResponse({
      result: true,
      message: 'Add viewed product successfully',
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.json(response);
  } catch (error) {
    const response = new ApiResponse({
      result: false,
      message: error.message,
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.status(500).json(response);
  }
};

export const getViewedProducts = async (req, res) => {
  const start = Date.now();
  try {
    const userId = req.user.id;
    const data = await getViewedProductsService(userId);
    const response = new ApiResponseListDto({
      result: true,
      data: data,
      message: 'Get all products successfully',
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.json(response);
  } catch (error) {
    const response = new ApiResponseListDto({
      result: false,
      message: error.message,
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.status(500).json(response);
  }
};

export const deleteViewedProduct = async (req, res) => {
  const start = Date.now();

  try {
    const { productId } = req.params;
    const userId = req.user.id;
    await deleteViewedProductService(userId, productId);
    const response = new ApiResponse({
      result: true,
      message: 'Delete viewed product successfully',
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.json(response);
  } catch (error) {
    const response = new ApiResponse({
      result: false,
      message: error.message,
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.status(500).json(response);
  }
};

export const searchProducts = async (req, res) => {
  const start = Date.now();
  try {
    const productsData = await searchProductsService(req.query);

    const response = new ApiResponseListDto({
      result: true,
      data: productsData,
      message: 'Search products successfully',
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });

    res.json(response);
  } catch (error) {
    const response = new ApiResponseListDto({
      result: false,
      data: null,
      message: error.message,
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.status(500).json(response);
  }
};

export const getSimilarProducts = async (req, res) => {
  const start = Date.now();
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 4;

    const productsData = await getSimilarProductsService(id, page, size);

    const response = new ApiResponseListDto({
      result: true,
      data: productsData,
      message: 'Get similar products successfully',
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });

    res.json(response);
  } catch (error) {
    const response = new ApiResponseListDto({
      result: false,
      data: null,
      message: error.message,
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.status(500).json(response);
  }
};
