import axios from "axios"

const baseURL = "https://task-xq93.onrender.com"

export const api = axios.create({
  baseURL,
})

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token")
   
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)
