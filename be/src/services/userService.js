import dotenv, { config } from 'dotenv';
import User from '../models/user.js';
config();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../config/elastic.js';

const saltRounds = 10;

const createUserService = async (name, email, password) => {
  try {
    const user = await User.findOne({ email });
    if (user) {
      console.log(
        `>>>>>> Email existed, choose another email different from: ${email}`
      );
      return null;
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);

    let result = await User.create({
      name: name,
      email: email,
      password: hashPassword,
      role: 'User',
    });

    await client.index({
      index: 'users',
      id: result._id.toString(),
      document: {
        name: result.name,
        email: result.email,
        role: result.role,
      },
    });

    return result;
  } catch (error) {
    console.log('🚀 ~ createUserService ~ error:', error.message);
  }
};

const loginService = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return { EC: 2, EM: 'Email or password is invalid' };
      } else {
        const payload = {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });

        return {
          EC: 0,
          accessToken,
          user: { email: user.email, name: user.name },
        };
      }
    } else {
      return { EC: 1, EM: 'Email or password is invalid' };
    }
  } catch (error) {
    console.log('🚀 ~ loginService ~ error:', error);
    return null;
  }
};

const getUserService = async (page, size, q) => {
  try {
    const skip = (page - 1) * size;

    const query = {};

    if (q && typeof q === 'object') {
      if (q.name && q.name.trim() !== '') {
        query.name = { $regex: q.name, $options: 'i' };
      }

      if (q.email && q.email.trim() !== '') {
        query.email = { $regex: q.email, $options: 'i' };
      }

      if (q.role && q.role.trim() !== '') {
        query.role = q.role.toLowerCase();
      }
    }

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .skip(skip)
      .limit(size)
      .sort({ createdAt: -1 });

    return { data: users, total };
  } catch (error) {
    console.error('🚀 ~ getUserService ~ error:', error);
    return { data: [], total: 0 };
  }
};

const getAccountService = (req, res) => {
  return res.status(200).json(req.user);
};

export { createUserService, loginService, getUserService, getAccountService };
