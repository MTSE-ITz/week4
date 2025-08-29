const express = require('express');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');

const routerAPI = express.Router();

routerAPI.all("/{*any}", auth);

routerAPI.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API!' });
});

routerAPI.post('/register', createUser);
routerAPI.post('/login', handleLogin);
routerAPI.get('/user', getUser);
routerAPI.get('/account', delay, getAccount);

module.exports = routerAPI;