import axios from 'axios'

const http = axios.create({
  baseURL: '/api',
  timeout: 8000,
})

// 响应拦截器：统一处理错误
http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API 请求失败:', error.message)
    return Promise.reject(error)
  },
)

export default http
