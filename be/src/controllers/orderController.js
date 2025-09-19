import {
  countUniqueUsersByProductService,
  createOrderService,
  getUserOrdersService,
} from '../services/orderService.js';
import { ApiResponseListDto } from '../common/api-response-list.js';
import { ApiResponse } from '../common/api-response.js';

export const countUniqueUsersByProduct = async (req, res) => {
  const start = Date.now();
  try {
    const { productId } = req.params;
    const totalPurchases = await countUniqueUsersByProductService(productId);

    const response = new ApiResponseListDto({
      result: true,
      message: 'Count purchase successfully',
      data: { productId, totalPurchases },
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ result: false, message: error.message });
  }
};

export const createOrder = async (req, res) => {
  const start = Date.now();
  try {
    const userId = req.user.id;
    const { products } = req.body;

    const order = await createOrderService(userId, products);

    const response = new ApiResponseListDto({
      result: true,
      message: 'Create order successfully',
      data: order,
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });

    res.status(201).json(response);
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

export const getUserOrders = async (req, res) => {
  const start = Date.now();
  try {
    const userId = req.user.id;

    const orders = await getUserOrdersService(userId);

    const response = new ApiResponseListDto({
      result: true,
      data: orders,
      message: 'Get order list successfully',
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
