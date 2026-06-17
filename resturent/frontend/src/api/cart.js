import api from './axios';

export const cartAPI = {
  getCart: () => api.get('/cart/'),
  addToCart: (data) => api.post('/cart/add/', data),
  updateCartItem: (id, data) => api.patch(`/cart/items/${id}/`, data),
  removeCartItem: (id) => api.delete(`/cart/items/${id}/remove/`),
  clearCart: () => api.delete('/cart/clear/'),
};
