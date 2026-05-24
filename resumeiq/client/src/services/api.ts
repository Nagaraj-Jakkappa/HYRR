import axios from 'axios';

// --- AXIOS INITIALIZATION ---
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request Interceptor for Auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    // Ensures the "Bearer " prefix is sent for every request
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor for Token Refresh
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (!err.response) return Promise.reject(err);

    // If unauthorized and we haven't tried to refresh yet
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        // Call refresh endpoint
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });

        // Handle different possible backend response structures
        const newAccessToken = response.data?.data?.accessToken || response.data?.accessToken;

        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          // Update the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear everything and kick to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(err);
  }
);

// --- TYPE DEFINITIONS ---
export interface ScanPayload {
  resumeId: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
}

// --- API DOMAINS ---

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

  // --- LinkedIn Document Ingestion Processing ---
  importLinkedIn: (formData: FormData) =>
    api.post('/resumes/import-linkedin', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // --- NEW: Cover Letter Generation Pipeline ---
  generateCoverLetter: (data: { resumeData: any; companyName: string; jobTitle: string }) =>
    api.post('/resumes/cover-letter', data)
};

// --- Magic Rewrite AI Call ---
export const magicRewriteAPI = async (text: string, jobTitle?: string) => {
  const response = await api.post('/resumes/rewrite', { text, jobTitle });
  return response.data;
};

// --- ATS Scan Engine Actions ---
export const scanAPI = {
  create: (data: ScanPayload) => api.post('/scans', data),
  getAll: (page = 1) => api.get(`/scans?page=${page}`),
  getOne: (id: string) => api.get(`/scans/${id}`),
  getById: (id: string) => api.get(`/scans/${id}`),
  getDashboardStats: () => api.get('/scans/stats/dashboard'),
  getPublicReport: (id: string) => api.get(`/scans/report/${id}`),
};

// --- Admin Controls ---
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (page = 1, search = '') => api.get(`/admin/users?page=${page}&search=${search}`),
  updateRole: (id: string, data: { role?: string; plan?: string }) => api.patch(`/admin/users/${id}/role`, data),
  toggleStatus: (id: string) => api.put(`/admin/users/${id}/status`),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getAllScans: (page = 1) => api.get(`/admin/scans?page=${page}`),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.put('/admin/settings', data),
};

export default api;