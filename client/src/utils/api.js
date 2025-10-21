import axios from 'axios'

const api = axios.create({
  /*baseURL:
    import.meta.env.MODE === 'development'
      ? 'http://192.168.1.196:3000/api' // ton IP locale pour le dev
      : 'http://37.60.232.230:5252/api', // pour la prod*/
  baseURL: import.meta.env.VITE_API_URL,
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
