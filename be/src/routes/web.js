const express = require('express');
const homeControllers = require('../controllers/homeControllers.js');

let router = express.Router();

let initWebRoutes = (app) => {
  router.get('/', (req, res) => {
    return res.send("Hello world");
  });

  router.get('/home', homeControllers.getHomePage);
  router.get('/about', homeControllers.getAboutPage);
  router.get('/crud', homeControllers.getCRUD);
  router.post('/post-crud', homeControllers.postCRUD);
  router.get('/get-crud', homeControllers.getFindAllCrud);
  router.get('/edit-crud', homeControllers.getEditCRUD);
  router.post('/put-crud', homeControllers.putCRUD);
  router.get('/delete-crud', homeControllers.deleteCRUD);

  return app.use('/', router);
};

module.exports = initWebRoutes;