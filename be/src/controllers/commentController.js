const { add, remove, listByProduct } = require('../services/commentService');

const addComment = async (req, res) => {
  try {
    const { userId, productId, content } = req.body;
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Content cannot be empty' });
    }

    const data = await add(userId, productId, content);
    if (!data) return res.status(400).json({ message: 'Cannot add comment' });

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in addComment:', error);
    return res.status(500).json({ message: error.message });
  }
};

const removeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await remove(id);
    if (!data) return res.status(404).json({ message: 'Comment not found' });

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in removeComment:', error);
    return res.status(500).json({ message: error.message });
  }
};

const listCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, size = 20 } = req.query;

    const data = await listByProduct(productId, { page, size });
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in listCommentsByProduct:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  removeComment,
  listCommentsByProduct,
};
