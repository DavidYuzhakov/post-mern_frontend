import axios from "axios";

// configuration
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
})

instance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('token')
  if (token !== null && config.headers?.authorization) {
    config.headers.authorization = token
  }

  return config
})

export default instance