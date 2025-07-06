import axios from 'axios';
import { useEffect } from 'react';

export const useAxiosInstance = () => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
  });

  useEffect(() => {
    const reqInterceptor = axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      axiosInstance.interceptors.request.eject(reqInterceptor);
    };
  }, [axiosInstance]);

  return axiosInstance;
};
