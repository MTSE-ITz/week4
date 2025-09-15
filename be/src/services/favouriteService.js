const db = require('../models/index.js');
const favoriteRepository = db.Favorite;
const productRepository = db.Product;
const userRepository = db.User;

const add = async (userId, productId) => {
  try {
    const user = await userRepository.findByPk(userId);
    if (!user) throw new Error('User not found');

    const product = await productRepository.findByPk(productId);
    if (!product) throw new Error('Product not found');

    const existing = await favoriteRepository.findOne({ where: { userId, productId } });
    if (existing) return existing;

    const favorite = await favoriteRepository.create({ userId, productId });
    return favorite;
  } catch (error) {
    console.error('Error adding favorite:', error);
    return null;
  }
};

const remove = async (id) => {
  try {
    const favorite = await favoriteRepository.findByPk(id);
    if (!favorite) return null;

    await favorite.destroy();
    return { message: 'Favorite removed successfully' };
  } catch (error) {
    console.error('Error removing favorite:', error);
    return null;
  }
};

const listByUser = async (userId, { page = 1, size = 20 } = {}) => {
  try {
    const limit = parseInt(size, 20);
    const offset = (parseInt(page, 10) - 1) * limit;

    const { count, rows } = await favoriteRepository.findAndCountAll({
      where: { userId },
      include: [
        { model: productRepository, as: 'product' }
      ],
      limit: limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      items: rows
    };
  } catch (error) {
    console.error('Error listing favorites:', error);
    return null;
  }
};

const isFavorite = async (userId, productId) => {
  try {
    const favorite = await favoriteRepository.findOne({ where: { userId, productId } });
    return !!favorite;
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

module.exports = {
  add,
  remove,
  listByUser,
  isFavorite
};
