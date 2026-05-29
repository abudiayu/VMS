import api from './api';

export const deathService = {
  getAll: async (params = {}) => {
    const response = await api.get('/death/index.php', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/death/show.php?id=${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/death/create.php', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/death/update.php?id=${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/death/delete.php?id=${id}`);
    return response.data;
  },

  generateCertificate: async (id) => {
    const response = await api.get(`/death/certificate.php?id=${id}`);
    return response.data;
  },
};
