import api from './api';

export const reportService = {
  generate: async (params) => {
    const response = await api.get('/reports/generate.php', { params });
    return response.data;
  },

  getSummary: async () => {
    const response = await api.get('/reports/summary.php');
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/reports/dashboard.php');
    return response.data;
  },
};
