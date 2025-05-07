import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

export const projectApi = {
  getAllProjects: async () => {
    try {
      console.log('Fetching all projects...');
      const response = await api.get('/projects');
      console.log('Projects response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  createProject: async (projectData) => {
    try {
      console.log('Creating project with data:', projectData);
      const response = await api.post('/projects', projectData);
      console.log('Create project response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  updateProject: async (id, projectData) => {
    try {
      console.log('Updating project:', id, projectData);
      const response = await api.put(`/projects/${id}`, projectData);
      console.log('Update project response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  deleteProject: async (id) => {
    try {
      console.log('Deleting project:', id);
      const response = await api.delete(`/projects/${id}`);
      console.log('Delete project response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },
};

export const taskApi = {
  getAllTasks: async () => {
    try {
      console.log('Fetching all tasks...');
      const response = await api.get('/tasks');
      console.log('Tasks response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  createTask: async (taskData) => {
    try {
      console.log('Creating task with data:', taskData);
      const response = await api.post('/tasks', taskData);
      console.log('Create task response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  updateTask: async (id, taskData) => {
    try {
      console.log('Updating task:', id, taskData);
      const response = await api.put(`/tasks/${id}`, taskData);
      console.log('Update task response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      console.log('Deleting task:', id);
      const response = await api.delete(`/tasks/${id}`);
      console.log('Delete task response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};

export const recentTaskApi = {
  getAllRecentTasks: async () => {
    try {
      console.log('Fetching recent tasks...');
      const response = await api.get('/recent-tasks');
      console.log('Recent tasks response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent tasks:', error);
      throw error;
    }
  },

  createRecentTask: async (taskData) => {
    try {
      console.log('Creating recent task with data:', taskData);
      const response = await api.post('/recent-tasks', taskData);
      console.log('Create recent task response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating recent task:', error);
      throw error;
    }
  },

  updateRecentTask: async (id, taskData) => {
    try {
      console.log('Updating recent task:', id, taskData);
      const response = await api.put(`/recent-tasks/${id}`, taskData);
      console.log('Update recent task response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating recent task:', error);
      throw error;
    }
  },

  deleteRecentTask: async (id) => {
    try {
      console.log('Deleting recent task:', id);
      const response = await api.delete(`/recent-tasks/${id}`);
      console.log('Delete recent task response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting recent task:', error);
      throw error;
    }
  }
};

export default api;