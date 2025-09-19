import mongoose from 'mongoose';
import Product from '../models/product.js';
import User from '../models/user.js';

export const createProductService = async (data) => {
  const product = new Product(data);
  return await product.save();
};

export const getAllProductsService = async (page = 1, size = 10) => {
  const skip = (page - 1) * size;

  const totalElements = await Product.countDocuments();

  const products = await Product.find()
    .populate('category', 'name description')
    .skip(skip)
    .limit(size);

  const totalPages = Math.ceil(totalElements / size);

  return {
    content: products,
    totalPages,
    totalElements,
  };
};

export const getProductByIdService = async (id) => {
  return await Product.findById(id).populate('category', 'name description');
};

export const updateProductService = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('category', 'name description');
};

export const deleteProductService = async (id) => {
  return await Product.findByIdAndDelete(id);
};

export const getSimilarProductsService = async (
  productId,
  page = 1,
  size = 4
) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Không tìm thấy sản phẩm');

  const skip = (page - 1) * size;

  const totalElements = await Product.countDocuments({
    category: product.category,
    _id: { $ne: product._id },
  });

  const products = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  })
    .populate('category', 'name description')
    .skip(skip)
    .limit(size);

  const totalPages = Math.ceil(totalElements / size);

  return {
    content: products,
    totalPages,
    totalElements,
  };
};

export const addViewedProductService = async (userId, productId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error('Invalid product ID');
  }

  const productExists = await Product.findById(productId);
  if (!productExists) throw new Error('Product not found');

  user.viewedProducts = user.viewedProducts.filter(
    (id) => id.toString() !== productId
  );

  user.viewedProducts.unshift(productId);

  if (user.viewedProducts.length > 10) {
    user.viewedProducts = user.viewedProducts.slice(0, 10);
  }

  await user.save();
  return user.viewedProducts;
};

export const getViewedProductsService = async (userId) => {
  const user = await User.findById(userId).populate({
    path: 'viewedProducts',
    populate: {
      path: 'category',
      select: 'name description',
    },
  });
  return {
    content: user.viewedProducts,
    totalElements: user.viewedProducts.length,
    totalPages: 1,
  };
};

export const deleteViewedProductService = async (userId, productId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Người dùng không tồn tại');

  const pid = new mongoose.Types.ObjectId(productId);

  user.viewedProducts = user.viewedProducts.filter((pId) => !pId.equals(pid));
  await user.save();
};

export const searchProductsService = async (filters) => {
  const query = {};

  if (filters.name) {
    query.name = { $regex: filters.name, $options: 'i' };
  }

  if (filters.brand) {
    query.brand = { $regex: filters.brand, $options: 'i' };
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }

  if (filters.inStock !== undefined) {
    query.inStock = filters.inStock === 'true';
  }

  if (filters.ram) {
    query['specifications.ram'] = filters.ram;
  }

  if (filters.os) {
    query['specifications.os'] = { $regex: filters.os, $options: 'i' };
  }

  const page = parseInt(filters.page) || 1;
  const size = parseInt(filters.size) || 10;
  const skip = (page - 1) * size;

  const totalElements = await Product.countDocuments(query);

  const products = await Product.find(query)
    .populate('category', 'name description')
    .skip(skip)
    .limit(size);

  const totalPages = Math.ceil(totalElements / size);

  return {
    content: products,
    totalPages,
    totalElements,
  };
};
