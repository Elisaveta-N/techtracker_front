import axios from 'axios';

// https://nodejs-web-server2.onrender.com
// 'http://localhost:3500'
const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:3500',
  // You can add other default configs here, like headers
});

export default api;