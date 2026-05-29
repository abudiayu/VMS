import api from './api';

export const userService = {
  getAll: async () => {
    const response = await api.get('/users/index.php');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/users/show.php?id=${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/users/create.php', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/users/update.php?id=${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/users/delete.php?id=${id}`);
    return response.data;
  },

  toggleStatus: async (id, status) => {
    const response = await api.patch(`/users/toggle-status.php?id=${id}`, { status });
    return response.data;
  },
};
