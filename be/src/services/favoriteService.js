import Favorite from '../models/favorite.js';

export const addFavoriteService = async (userId, productId) => {
  const exists = await Favorite.findOne({ user: userId, product: productId });
  if (exists) {
    throw new Error('Sản phẩm đã có trong danh sách yêu thích');
  }

  return await Favorite.create({ user: userId, product: productId });
};

export const removeFavoriteService = async (userId, productId) => {
  const deleted = await Favorite.findOneAndDelete({
    user: userId,
    product: productId,
  });
  if (!deleted) {
    throw new Error('Không tìm thấy trong danh sách yêu thích');
  }
  return deleted;
};

export const getFavoritesService = async (userId) => {
  const favorites = await Favorite.find({ user: userId })
    .populate('product')
    .sort({ createdAt: -1 });

  return {
    content: favorites,
    totalElements: favorites.length,
    totalPages: 1,
  };
};

export const countFavoritesService = async (productId) => {
  return await Favorite.countDocuments({ product: productId });
};
