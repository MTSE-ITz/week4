import axios from './axios.customize';

const createUserApi = (name, email, password) => {
  const URL_API = '/v1/api/register';
  const data = { name, email, password };
  return axios.post(URL_API, data);
};

const loginApi = (email, password) => {
  const URL_API = '/v1/api/login';
  const data = { email, password };
  return axios.post(URL_API, data);
};

const getUserApi = (page = 1, size = 10, q = {}) => {
  const filteredQ = Object.fromEntries(
    Object.entries(q).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ''
    )
  );

  const params = {
    page,
    size,
    ...filteredQ,
  };

  return axios.get('/v1/api/user', { params });
};

const getProductApi = ({ page = 1, size = 8 }) => {
  return axios.get('/v1/api/products', {
    params: {
      page,
      size,
    },
  });
};

const getProductDetailApi = (id) => {
  return axios.get(`/v1/api/product/${id}`);
};

const getProductSimilar = ({ id, page = 1, size = 4 }) => {
  return axios.get(`/v1/api/product/${id}/similar`, {
    params: {
      page,
      size,
    },
  });
};

const getFavoriteProducts = () => {
  return axios.get('/v1/api/favorites');
};

const addFavoriteProduct = (productId) => {
  return axios.post('/v1/api/favorite/add', {
    productId,
  });
};

const deleteFavoriteProduct = (productId) => {
  return axios.delete(`/v1/api/favorite/${productId}`);
};

const getViewedProducts = () => {
  return axios.get('/v1/api/product/viewed/list');
};

const addViewedProduct = (productId) => {
  return axios.post('/v1/api/product/viewed/add', {
    productId,
  });
};

const deleteViewedProduct = (productId) => {
  return axios.delete(`/v1/api/product/viewed/${productId}`);
};

const addComment = (productId, content) => {
  return axios.post(`/v1/api/product/${productId}/comment`, {
    content,
  });
};

const deleteComment = (id) => {
  return axios.delete(`/v1/api/product/comment/${id}`);
};

const getComments = (productId) => {
  return axios.get(`/v1/api/product/${productId}/comments`);
};

const toggleLikeComment = (id) => {
  return axios.put(`/v1/api/product/comment/${id}/like`);
};

const toggleDislikeComment = (id) => {
  return axios.put(`/v1/api/product/comment/${id}/dislike`);
};

const countProductPurchase = (productId) => {
  return axios.get(`/v1/api/order/count/${productId}`);
};

export {
  createUserApi,
  loginApi,
  getUserApi,
  getProductApi,
  getProductDetailApi,
  getProductSimilar,
  addFavoriteProduct,
  getFavoriteProducts,
  deleteFavoriteProduct,
  getViewedProducts,
  addViewedProduct,
  deleteViewedProduct,
  addComment,
  deleteComment,
  getComments,
  toggleLikeComment,
  toggleDislikeComment,
  countProductPurchase,
};
