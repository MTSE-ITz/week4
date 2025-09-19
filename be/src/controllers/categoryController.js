import { ApiResponseListDto } from '../common/api-response-list.js';
import {
  createCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
  countProductsByCategoryService,
} from '../services/categoryService.js';

export const createCategory = async (req, res) => {
  try {
    const category = await createCategoryService(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  const start = Date.now();
  try {
    const categories = await getAllCategoriesService();
    const response = new ApiResponseListDto({
      result: true,
      data: categories,
      message: 'Get all products successfully',
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

export const getCategoryById = async (req, res) => {
  try {
    const category = await getCategoryByIdService(req.params.id);
    if (!category)
      return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await updateCategoryService(req.params.id, req.body);
    if (!category)
      return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await deleteCategoryService(req.params.id);
    if (!category)
      return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryProductCounts = async (req, res) => {
  try {
    const counts = await countProductsByCategoryService();
    res.json(counts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
