const express = require('express');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const { createProduct, getProduct, listProducts, searchProducts, syncProducts } = require('../controllers/productController');
const { addFavorite, removeFavorite, listFavorites } = require('../controllers/favouriteController');
const { addComment, removeComment, listCommentsByProduct} = require('../controllers/commentController');
const { addOrder, removeOrder, listOrdersByUser, getOrderDetail } = require('../controllers/orderController');

const routerAPI = express.Router();

routerAPI.all("/{*any}", auth);

routerAPI.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API!' });
});

routerAPI.post('/register', createUser);
routerAPI.post('/login', handleLogin);
routerAPI.get('/user', getUser);
routerAPI.get('/account', delay, getAccount);

// product
routerAPI.post('/product/create', createProduct);
routerAPI.get('/product/get/:id', getProduct);
routerAPI.get('/product/list', listProducts);
routerAPI.get('/product/search', searchProducts);
routerAPI.get('/product/sync', syncProducts);

// favorite
routerAPI.post('/favorite/create', addFavorite);
routerAPI.get('/favorite/delete/:id', removeFavorite);
routerAPI.get('/favorite/list/:userId', listFavorites);

// comment
routerAPI.post('/comment/create', addComment);
routerAPI.get('/comment/delete/:id', removeComment);
routerAPI.get('/comment/list/:productId', listCommentsByProduct);

// order
routerAPI.post('/create', addOrder);
routerAPI.get('/delete/:id', removeOrder);
routerAPI.get('/list/:userId', listOrdersByUser);
routerAPI.get('/get/:id', getOrderDetail);

module.exports = routerAPI;