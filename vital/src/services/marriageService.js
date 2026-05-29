import api from './api';

export const marriageService = {
  getAll: async (params = {}) => {
    const response = await api.get('/marriage/index.php', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/marriage/show.php?id=${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/marriage/create.php', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/marriage/update.php?id=${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/marriage/delete.php?id=${id}`);
    return response.data;
  },

  generateCertificate: async (id) => {
    const response = await api.get(`/marriage/certificate.php?id=${id}`);
    return response.data;
  },
};
