const db = require('../models/index.js');
const orderRepository = db.Order;
const productRepository = db.Product;
const userRepository = db.User;

const add = async (userId, productId, quantity = 1) => {
  try {
    const user = await userRepository.findByPk(userId);
    if (!user) throw new Error('User not found');

    const product = await productRepository.findByPk(productId);
    if (!product) throw new Error('Product not found');

    const order = await orderRepository.create({
      userId,
      productId,
      quantity
    });

    return order;
  } catch (error) {
    console.error('Error adding order:', error);
    return null;
  }
};

const remove = async (id) => {
  try {
    const order = await orderRepository.findByPk(id);
    if (!order) return null;

    await order.destroy();
    return { message: 'Order removed successfully' };
  } catch (error) {
    console.error('Error removing order:', error);
    return null;
  }
};

const listByUser = async (userId, { page = 1, size = 20 } = {}) => {
  try {
    const limit = parseInt(size, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    const { count, rows } = await orderRepository.findAndCountAll({
      where: { userId },
      include: [
        { model: productRepository, as: 'product' }
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
    console.error('Error listing orders:', error);
    return null;
  }
};

const getById = async (id) => {
  try {
    const order = await orderRepository.findByPk(id, {
      include: [
        { model: productRepository, as: 'product' },
        { model: userRepository, as: 'user' }
      ]
    });
    return order || null;
  } catch (error) {
    console.error('Error getting order by id:', error);
    return null;
  }
};

module.exports = {
  add,
  remove,
  listByUser,
  getById
};
