import api from './api';

export const chatApi = {
  getMessages: async () => {
    try {
      const response = await api.get('/messages');
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error.response?.data || error.message);
      throw error;
    }
  },

  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/messages', messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      throw error;
    }
  },

  getMessagesByUser: async (userId) => {
    try {
      const response = await api.get(`/messages/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user messages:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteMessage: async (messageId) => {
    try {
      const response = await api.delete(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error.response?.data || error.message);
      throw error;
    }
  }
}; 