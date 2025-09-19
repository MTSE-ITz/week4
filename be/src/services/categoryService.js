import Category from '../models/Category.js';
import Product from '../models/product.js';

export const createCategoryService = async (data) => {
  const category = new Category(data);
  return await category.save();
};

export const getAllCategoriesService = async () => {
  const totalElements = await Category.countDocuments();
  const products = await Category.find();
  const totalPages = Math.ceil(totalElements);

  return {
    content: products,
    totalPages,
    totalElements,
  };
};

export const getCategoryByIdService = async (id) => {
  return await Category.findById(id);
};

export const updateCategoryService = async (id, data) => {
  return await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteCategoryService = async (id) => {
  return await Category.findByIdAndDelete(id);
};

export const countProductsByCategoryService = async () => {
  const result = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        totalProducts: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $project: {
        _id: 0,
        categoryId: '$category._id',
        categoryName: '$category.name',
        totalProducts: 1,
      },
    },
  ]);

  return result;
};
