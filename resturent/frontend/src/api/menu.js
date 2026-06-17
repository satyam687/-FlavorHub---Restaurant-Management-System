import api from './axios';

export const menuAPI = {
  getCategories: (params) => api.get('/menu/categories/', { params }),
  getCategory: (slug) => api.get(`/menu/categories/${slug}/`),
  createCategory: (data) => api.post('/menu/categories/', data),
  updateCategory: (slug, data) => api.patch(`/menu/categories/${slug}/`, data),
  deleteCategory: (slug) => api.delete(`/menu/categories/${slug}/`),
  getMenuItems: (params) => api.get('/menu/items/', { params }),
  getMenuItem: (slug) => api.get(`/menu/items/${slug}/`),
  getFeaturedItems: () => api.get('/menu/items/featured/'),
  createMenuItem: (data) => api.post('/menu/items/', data),
  updateMenuItem: (slug, data) => api.patch(`/menu/items/${slug}/`, data),
  deleteMenuItem: (slug) => api.delete(`/menu/items/${slug}/`),
};
