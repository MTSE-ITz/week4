const express = require('express');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const { createProduct, getProduct, listProducts, searchProducts, syncProducts } = require('../controllers/productController');

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

module.exports = routerAPI;