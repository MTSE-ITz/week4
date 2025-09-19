import mongoose from 'mongoose';
import Comment from '../models/comment.js';

export const countUniqueCommentersService = async (productId) => {
  const commenters = await Comment.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$user',
      },
    },
    {
      $count: 'uniqueCommenters',
    },
  ]);

  return commenters.length > 0 ? commenters[0].uniqueCommenters : 0;
};

export const getCommentsByProductService = async (productId) => {
  const comments = await Comment.find({ product: productId })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  const totalElements = await Comment.countDocuments({ product: productId });
  const totalPages = Math.ceil(totalElements);

  return {
    content: comments,
    totalPages,
    totalElements,
  };
};

export const addCommentService = async (productId, userId, content) => {
  const comment = new Comment({
    product: productId,
    user: userId,
    content,
  });
  return await comment.save();
};

export const deleteCommentService = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) return null;

  if (comment.user.toString() !== userId.toString()) {
    throw new Error('Bạn không có quyền xóa comment này');
  }

  await Comment.findByIdAndDelete(commentId);
  return comment;
};

export const toggleLikeCommentService = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error('Comment not found');

  const hasLiked = comment.likes.includes(userId);
  const hasDisliked = comment.dislikes.includes(userId);

  if (hasLiked) {
    comment.likes.pull(userId);
  } else {
    comment.likes.push(userId);
    if (hasDisliked) comment.dislikes.pull(userId);
  }

  await comment.save();
  return comment;
};

export const toggleDislikeCommentService = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error('Comment not found');

  const hasDisliked = comment.dislikes.includes(userId);
  const hasLiked = comment.likes.includes(userId);

  if (hasDisliked) {
    comment.dislikes.pull(userId);
  } else {
    comment.dislikes.push(userId);
    if (hasLiked) comment.likes.pull(userId);
  }

  await comment.save();
  return comment;
};
