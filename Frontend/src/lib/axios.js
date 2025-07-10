import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    timeout: 30000
});

axiosInstance.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
