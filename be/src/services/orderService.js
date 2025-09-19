import Order from '../models/order.js';

export const countUniqueUsersByProductService = async (productId) => {
  const orders = await Order.find({ 'products.product': productId }).select(
    'user'
  );

  return orders.length;
};

export const createOrderService = async (userId, products) => {
  if (!products || !products.length) {
    throw new Error('Danh sách sản phẩm là bắt buộc');
  }

  const order = new Order({
    user: userId,
    products: products.map((p) => ({
      product: p.productId,
      quantity: p.quantity || 1,
    })),
    status: 'pending',
  });

  await order.save();
  return order;
};

export const getUserOrdersService = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate('products.product', 'name price images')
    .sort({ createdAt: -1 });

  const totalElements = await Order.countDocuments({ user: userId });
  const totalPages = Math.ceil(totalElements);

  return {
    content: orders,
    totalPages,
    totalElements,
  };
};
