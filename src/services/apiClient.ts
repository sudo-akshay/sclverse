// src/services/apiClient.ts
import axios from 'axios';
// Create Axios instance with environment variable for baseURL
const apiClient = axios.create({
  baseURL: 'https://7ea9-122-172-86-128.ngrok-free.app/api/', // Default fallback
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor (optional: for auth tokens, etc.)
apiClient.interceptors.request.use(
  (config) => {
    // Example: Add Authorization header
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
