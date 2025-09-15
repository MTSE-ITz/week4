const { add, remove, listByUser } = require('../services/favouriteService');

const addFavorite = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const data = await add(userId, productId);
    if (!data) return res.status(400).json({ message: 'Cannot add favorite' });
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in addFavorite:', error);
    return res.status(500).json({ message: error.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params; 
    const data = await remove(id);
    if (!data) return res.status(404).json({ message: 'Favorite not found' });
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in removeFavorite:', error);
    return res.status(500).json({ message: error.message });
  }
};

const listFavorites = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, size = 20 } = req.query;
    console.log(page, size);
    
    const data = await listByUser(userId, { page, size });
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in listFavorites:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  listFavorites
};
