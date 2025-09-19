import { ApiResponseListDto } from '../common/api-response-list.js';
import { ApiResponse } from '../common/api-response.js';
import {
  addCommentService,
  countUniqueCommentersService,
  deleteCommentService,
  getCommentsByProductService,
  toggleDislikeCommentService,
  toggleLikeCommentService,
} from '../services/commentService.js';

export const getProductCommentersCount = async (req, res) => {
  try {
    const { id } = req.params;
    const count = await countUniqueCommentersService(id);
    res.json({ productId: id, commenters: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCommentsByProduct = async (req, res) => {
  const start = Date.now();

  try {
    const comments = await getCommentsByProductService(req.params.id);
    const response = new ApiResponseListDto({
      result: true,
      data: comments,
      message: 'Get list comment successfully',
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.json(response);
  } catch (error) {
    const response = new ApiResponse({
      result: false,
      message: error.message,
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.status(500).json(response);
  }
};

export const addComment = async (req, res) => {
  const start = Date.now();
  try {
    const { content } = req.body;
    const userId = req.user.id;
    const { id: productId } = req.params;
    if (!content)
      return res.status(400).json({ message: 'Nội dung comment là bắt buộc' });

    await addCommentService(productId, userId, content);
    const response = new ApiResponse({
      result: true,
      message: 'Add comment successfully',
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.status(201).json(response);
  } catch (error) {
    const response = new ApiResponse({
      result: false,
      message: error.message,
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.status(500).json(response);
  }
};

export const deleteComment = async (req, res) => {
  const start = Date.now();

  try {
    const userId = req.user.id;
    const { id } = req.params;
    await deleteCommentService(id, userId);

    const response = new ApiResponse({
      result: true,
      message: 'Delete comment successfully',
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.status(200).json(response);
  } catch (error) {
    const response = new ApiResponse({
      result: false,
      message: error.message,
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.status(500).json(response);
  }
};

export const toggleLikeComment = async (req, res) => {
  const start = Date.now();
  try {
    const { id: commentId } = req.params;
    const userId = req.user.id;

    const updatedComment = await toggleLikeCommentService(commentId, userId);

    const response = new ApiResponseListDto({
      result: true,
      message: 'Toggle like comment successfully',
      data: {
        _id: updatedComment._id,
        likes: updatedComment.likes.length,
        dislikes: updatedComment.dislikes.length,
      },
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });

    res.json(response);
  } catch (error) {
    const response = new ApiResponse({
      result: false,
      message: error.message,
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.status(500).json(response);
  }
};

export const toggleDislikeComment = async (req, res) => {
  const start = Date.now();
  try {
    const { id: commentId } = req.params;
    const userId = req.user.id;

    const updatedComment = await toggleDislikeCommentService(commentId, userId);

    const response = new ApiResponseListDto({
      result: true,
      message: 'Toggle dislike comment successfully',
      data: {
        _id: updatedComment._id,
        likes: updatedComment.likes.length,
        dislikes: updatedComment.dislikes.length,
      },
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });

    res.json(response);
  } catch (error) {
    const response = new ApiResponse({
      result: false,
      message: error.message,
      path: req.originalUrl,
      takenTime: Date.now() - start,
    });
    res.status(500).json(response);
  }
};
