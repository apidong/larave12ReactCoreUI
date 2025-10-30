import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add CSRF token if available
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    if (token) {
      config.headers['X-CSRF-TOKEN'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
