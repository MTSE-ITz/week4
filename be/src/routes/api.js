import express from 'express';

import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryProductCounts,
} from '../controllers/categoryController.js';

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addViewedProduct,
  getViewedProducts,
  searchProducts,
  getSimilarProducts,
  deleteViewedProduct,
} from '../controllers/productController.js';

import delay from '../middleware/delay.js';
import auth from '../middleware/auth.js';
import {
  createUser,
  getAccount,
  getUser,
  handleLogin,
} from '../controllers/userController.js';
import {
  addFavorite,
  countFavorites,
  getFavorites,
  removeFavorite,
} from '../controllers/favoriteController.js';
import {
  countUniqueUsersByProduct,
  createOrder,
  getUserOrders,
} from '../controllers/orderController.js';
import {
  addComment,
  deleteComment,
  getCommentsByProduct,
  getProductCommentersCount,
  toggleDislikeComment,
  toggleLikeComment,
} from '../controllers/commentController.js';

const routerAPI = express.Router();

// Auth middleware
routerAPI.use(auth);

// Basic route
routerAPI.get('/', (req, res) => {
  return res.status(200).json('22110447 - Lê Tấn Trụ');
});

// User routes
routerAPI.post('/register', createUser);
routerAPI.post('/login', handleLogin);
routerAPI.get('/user', getUser);
routerAPI.get('/account', delay, getAccount);

// Category routes
routerAPI.post('/category', auth, createCategory);
routerAPI.get('/categories', auth, getAllCategories);
routerAPI.get('/category/:id', auth, getCategoryById);
routerAPI.put('/category/:id', auth, updateCategory);
routerAPI.delete('/category/:id', auth, deleteCategory);
routerAPI.get('/categories/count-products', auth, getCategoryProductCounts);

// Product routes
routerAPI.post('/product', auth, createProduct);
routerAPI.get('/products', auth, getAllProducts);
routerAPI.get('/product/:id', auth, getProductById);
routerAPI.put('/product/:id', auth, updateProduct);
routerAPI.delete('/product/:id', auth, deleteProduct);
routerAPI.get('/product/:id/similar', auth, getSimilarProducts);
routerAPI.post('/product/viewed/add', auth, addViewedProduct);
routerAPI.get('/product/viewed/list', auth, getViewedProducts);
routerAPI.delete('/product/viewed/:productId', auth, deleteViewedProduct);
routerAPI.get('/products/search', auth, searchProducts);

// Favorite routes
routerAPI.post('/favorite/add', auth, addFavorite);
routerAPI.get('/favorites', auth, getFavorites);
routerAPI.delete('/favorite/:productId', auth, removeFavorite);
routerAPI.get('/favorite/:productId/count', auth, countFavorites);

// Comment routes
routerAPI.get('/product/:id/comment/count', auth, getProductCommentersCount);
routerAPI.get('/product/:id/comments', auth, getCommentsByProduct);
routerAPI.post('/product/:id/comment', auth, addComment);
routerAPI.delete('/product/comment/:id', auth, deleteComment);
routerAPI.put('/product/comment/:id/like', auth, toggleLikeComment);
routerAPI.put('/product/comment/:id/dislike', auth, toggleDislikeComment);

// Order routes
routerAPI.get('/order/count/:productId', auth, countUniqueUsersByProduct);
routerAPI.post('/order/create', auth, createOrder);
routerAPI.get('/order/list', auth, getUserOrders);

export default routerAPI;
