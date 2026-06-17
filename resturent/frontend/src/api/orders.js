import api from './axios';

export const ordersAPI = {
  getOrders: () => api.get('/orders/'),
  getMyOrders: () => api.get('/orders/my-orders/'),
  getOrder: (id) => api.get(`/orders/${id}/`),
  createOrder: (data) => api.post('/orders/', data),
  cancelOrder: (id) => api.post(`/orders/${id}/cancel/`),
  updateOrderStatus: (id, data) => api.patch(`/orders/${id}/status/`, data),
};
