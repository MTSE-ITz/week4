import { ApiResponseListDto } from '../common/api-response-list.js';
import {
  createUserService,
  loginService,
  getUserService,
} from '../services/userService.js';

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const data = await createUserService(name, email, password);
  return res.status(200).json(data);
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await loginService(email, password);

  return res.status(200).json(data);
};
const getUser = async (req, res) => {
  const start = Date.now();
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const q = req.query || {};

    const { data: users, total } = await getUserService(page, size, q);

    const totalPages = Math.ceil(total / size);
    const response = new ApiResponseListDto({
      result: true,
      data: {
        content: users,
        totalPages,
        totalElements: total,
      },
      message: 'Get users successfully',
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });

    return res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponseListDto({
      result: false,
      data: null,
      message: error.message || 'Internal server error',
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    return res.status(500).json(response);
  }
};
const getAccount = async (req, res) => {
  return res.status(200).json(req.user);
};

export { createUser, handleLogin, getUser, getAccount };
