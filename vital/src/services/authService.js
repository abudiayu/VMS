import api from './api';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login.php', { username, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout.php');
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password.php', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },
};
