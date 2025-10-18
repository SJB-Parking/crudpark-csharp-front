import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5229/api', // Replace with backend URL
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response?.data || error.message)
    throw error
  }
)
export default api;
