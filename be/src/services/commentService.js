const db = require('../models/index.js');
const commentRepository = db.Comment;
const productRepository = db.Product;
const userRepository = db.User;

const add = async (userId, productId, content) => {
  try {
    const user = await userRepository.findByPk(userId);
    if (!user) throw new Error('User not found');

    const product = await productRepository.findByPk(productId);
    if (!product) throw new Error('Product not found');

    const comment = await commentRepository.create({
      userId,
      productId,
      content
    });

    return comment;
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
};

const remove = async (id) => {
  try {
    const comment = await commentRepository.findByPk(id);
    if (!comment) return null;

    await comment.destroy();
    return { message: 'Comment removed successfully' };
  } catch (error) {
    console.error('Error removing comment:', error);
    return null;
  }
};

const listByProduct = async (productId, { page = 1, size = 20 } = {}) => {
  try {
    const limit = parseInt(size, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    const { count, rows } = await commentRepository.findAndCountAll({
      where: { productId },
      include: [
        { model: userRepository, as: 'user', attributes: ['id', 'name', 'email'] }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      items: rows
    };
  } catch (error) {
    console.error('Error listing comments:', error);
    return null;
  }
};

module.exports = {
  add,
  remove,
  listByProduct,
};
