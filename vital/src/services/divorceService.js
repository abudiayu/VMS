import api from './api';

export const divorceService = {
  getAll: async (params = {}) => {
    const response = await api.get('/divorce/index.php', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/divorce/show.php?id=${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/divorce/create.php', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/divorce/update.php?id=${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/divorce/delete.php?id=${id}`);
    return response.data;
  },

  generateCertificate: async (id) => {
    const response = await api.get(`/divorce/certificate.php?id=${id}`);
    return response.data;
  },
};
