import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request Interceptor for Auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor for Token Refresh
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (!err.response) return Promise.reject(err);

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  changePassword: (data: any) => api.post('/auth/change-password', data),
  logout: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return api.post('/auth/logout', { refreshToken });
  },
  getMe: () => api.get('/auth/me'),
};

export const resumeAPI = {
  upload: (formData: FormData) =>
    api.post('/resumes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getAll: () => api.get('/resumes'),
  delete: (id: string) => api.delete(`/resumes/${id}`),
};

export const scanAPI = {
  create: (data: any) => api.post('/scans', data),
  getAll: (page = 1) => api.get(`/scans?page=${page}`),
  getOne: (id: string) => api.get(`/scans/${id}`),
  getById: (id: string) => api.get(`/scans/${id}`),
  getDashboardStats: () => api.get('/scans/stats/dashboard'),
  getPublicReport: (id: string) => api.get(`/scans/report/${id}`),
};

export default api;