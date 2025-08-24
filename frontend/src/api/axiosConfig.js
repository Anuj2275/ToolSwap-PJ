import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Your backend URL
});

// Interceptor to add the token to every request if the user is logged in
api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export default api;