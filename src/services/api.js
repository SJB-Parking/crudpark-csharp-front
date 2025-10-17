import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/dashboard/metrics', // Replace with backend URL
  timeout: 8000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response?.data || error.message)
    throw error
  }
)
export default api;
