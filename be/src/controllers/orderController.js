const { add, remove, listByUser, getById } = require('../services/orderService');

const addOrder = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const data = await add(userId, productId, quantity);
    if (!data) return res.status(400).json({ message: 'Cannot create order' });
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in addOrder:', error);
    return res.status(500).json({ message: error.message });
  }
};

const removeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await remove(id);
    if (!data) return res.status(404).json({ message: 'Order not found' });
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in removeOrder:', error);
    return res.status(500).json({ message: error.message });
  }
};

const listOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, size = 20 } = req.query;

    const data = await listByUser(userId, { page, size });
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in listOrdersByUser:', error);
    return res.status(500).json({ message: error.message });
  }
};

const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getById(id);
    if (!data) return res.status(404).json({ message: 'Order not found' });
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in getOrderDetail:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrder,
  removeOrder,
  listOrdersByUser,
  getOrderDetail,
};
