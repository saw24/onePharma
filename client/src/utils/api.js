import axios from 'axios'

const api = axios.create({
  baseURL:
    import.meta.env.MODE === 'development'
      ? 'http://192.168.1.196:3000/api' // ton IP locale pour le dev
      : 'https://ton-domaine-production.com/api', // pour la prod
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  response => response,
  error => {
    console.log('API Error Response:', error.response?.data)
    return Promise.reject(error)
  }
)

export default api
