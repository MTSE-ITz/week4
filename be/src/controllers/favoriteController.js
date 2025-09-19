import { ApiResponseListDto } from '../common/api-response-list.js';
import { ApiResponse } from '../common/api-response.js';
import {
  addFavoriteService,
  countFavoritesService,
  getFavoritesService,
  removeFavoriteService,
} from '../services/favoriteService.js';

export const addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('🚀 ~ addFavorite ~ userId:', userId);
    const { productId } = req.body;

    const favorite = await addFavoriteService(userId, productId);
    res.status(201).json({ message: 'Đã thêm vào yêu thích', favorite });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const removeFavorite = async (req, res) => {
  const start = Date.now();
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const response = new ApiResponse({
      result: true,
      message: 'Delete favorite successfully',
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    await removeFavoriteService(userId, productId);
    res.json(response);
  } catch (err) {
    const response = new ApiResponse({
      result: true,
      message: err.message,
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.status(400).json(response);
  }
};

export const getFavorites = async (req, res) => {
  const start = Date.now();
  try {
    const userId = req.user.id;
    const favorites = await getFavoritesService(userId);
    const response = new ApiResponseListDto({
      result: true,
      data: favorites,
      message: 'Get list favorite successfully',
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.json(response);
  } catch (err) {
    const response = new ApiResponse({
      result: true,
      message: err.message,
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.status(500).json(response);
  }
};

export const countFavorites = async (req, res) => {
  const start = Date.now();
  try {
    const { productId } = req.params;
    const count = await countFavoritesService(productId);
    const response = new ApiResponseListDto({
      result: true,
      data: { productId, totalFavorites: count },
      message: 'Get list favorite successfully',
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.json(response);
  } catch (err) {
    const response = new ApiResponse({
      result: true,
      message: err.message,
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.status(500).json(response);
  }
};
