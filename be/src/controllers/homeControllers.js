const db = require("../models/index");
const CRUDService = require("../services/CRUDService");

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render('homepage.ejs', {
      data: JSON.stringify(data)
    });
  } catch (e) {
    console.log(e);
  }
}

let getAboutPage = (req, res) => {
  return res.render('about.ejs');
}

let getCRUD = (req, res) => {
  return res.render('crud.ejs');
}

let getFindAllCrud = async (req, res) => {
  try {
    let data = await CRUDService.getAllUser();
    return res.render('user/findAllUser.ejs', {
      dataTable: data
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error fetching users");
  }
}

let postCRUD = async (req, res) => {
  try {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.redirect('Post crud to server');
  } catch (e) {
    console.log(e);
    return res.send('Error occurred while creating user');
  }
}

let getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await CRUDService.getUserById(userId);
    return res.render('user/editCRUD.ejs', {
      data: userData
    });
  } else {
    return res.send('User not found!');
  }
}

let putCRUD = async (req, res) => {
  let data = req.body;
  let data1 = await CRUDService.updateUser(data);
  return res.render('user/findAllUser.ejs', {
    dataTable: data1
  });
}

let deleteCRUD = async (req, res) => {
  let id = req.query.id;
  if (id) {
    await CRUDService.deleteUserById(id);
    return res.send(`Delete user with id ${id}`);
  } else {
    return res.send('Not found user');
  }
}

module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  getFindAllCrud: getFindAllCrud,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD
}