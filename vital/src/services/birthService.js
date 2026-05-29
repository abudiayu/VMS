import api from './api';

export const birthService = {
  getAll: async (params = {}) => {
    const response = await api.get('/birth/index.php', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/birth/show.php?id=${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/birth/create.php', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/birth/update.php?id=${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/birth/delete.php?id=${id}`);
    return response.data;
  },

  generateCertificate: async (id) => {
    const response = await api.get(`/birth/certificate.php?id=${id}`);
    return response.data;
  },
};
