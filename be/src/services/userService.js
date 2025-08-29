require('dotenv').config();

const db = require("../models/index.js");
const userRepository = db.User;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(10);

const createUserService = async (name, email, password) => {
  try {
    const user = await userRepository.findOne({ where: { email: email } });
    if (user) {
      console.log('User already exists');
      return null;
    }

    const hashPassword = await bcrypt.hash(password, salt);
    const data = await userRepository.create({
      name,
      email,
      password: hashPassword,
      roleId: 'user',
    });
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

const loginService = async (email, password) => {
  try {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      console.log('User not found');
      return null;
    }
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return {
        EC: 2,
        EM: 'email or password not valid',
      }
    }
    const payload = {
      email: user.email,
      roleId: user.roleId
    }
    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
    return {
      EC: 0,
      access_token,
      user: {
        email: user.email,
        roleId: user.roleId
      }
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    return null;
  }
}

const getUserService = async () => {
  try {
    const result = await userRepository.findAll({
      attributes: { exclude: ['password'] }
    });
    console.log({result});
    
    return {
      EC: 0,
      EM: 'Get user successfully',
      data: result
    }
  } catch (error) {
    console.error('Error getting users:', error);
    return {
      EC: 1,
      EM: 'Error getting users'
    }
  }
}

module.exports = {
  createUserService, loginService, getUserService
}