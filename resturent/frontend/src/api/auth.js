
import api from './axios';

export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  refreshToken: (refresh) => api.post('/auth/token/refresh/', { refresh }),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/', data),
  changePassword: (data) => api.put('/auth/change-password/', data),
  // Admin
  getUsers: () => api.get('/auth/admin/users/'),
  getUserDetail: (id) => api.get(`/auth/admin/users/${id}/`),
  updateUser: (id, data) => api.patch(`/auth/admin/users/${id}/`, data),
  deleteUser: (id) => api.delete(`/auth/admin/users/${id}/`),
};
