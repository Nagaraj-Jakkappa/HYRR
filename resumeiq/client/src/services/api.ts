import axios from 'axios';

// --- AXIOS INITIALIZATION ---
// withCredentials: true ensures cookies are sent/received with every request
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Response Interceptor for Token Refresh (cookie-based, no localStorage)
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (!err.response) return Promise.reject(err);

    // Skip refresh logic for auth endpoints — let the caller handle these 401s directly
    const url = originalRequest.url || '';
    const isAuthEndpoint = url.includes('/auth/me') || url.includes('/auth/refresh')
      || url.includes('/auth/login') || url.includes('/auth/register');

    if (isAuthEndpoint) {
      return Promise.reject(err);
    }

    // If unauthorized on a protected endpoint and we haven't tried to refresh yet
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint — refresh token cookie is sent automatically
        await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        // Retry the original request with the new access token cookie
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
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
  updateProfile: (data: any) => api.put('/auth/profile', data),
  deleteAccount: () => api.delete('/auth/account'),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (data: { email: string }) => api.post('/auth/forgot-password', data),
  resetPassword: (token: string, data: { password: string }) => api.put(`/auth/reset-password/${token}`, data),
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

  // --- Cover Letter Generation Pipeline ---
  generateCoverLetter: (data: { resumeData: any; companyName: string; jobTitle: string }) =>
    api.post('/resumes/cover-letter', data),

  // --- View resume file (blob for new-tab viewing) ---
  viewFile: (id: string) =>
    api.get(`/resumes/${id}/view`, { responseType: 'blob' }),
};

// --- Magic Rewrite AI Call ---
export const magicRewriteAPI = async (text: string, jobTitle?: string) => {
  const validJobTitle = jobTitle && jobTitle.trim().length >= 2 ? jobTitle.trim() : "General Role";
  const response = await api.post('/resumes/rewrite', { text, jobTitle: validJobTitle });
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
  updateRole: (id: string, data: { role?: string }) => api.patch(`/admin/users/${id}/role`, data),
  updatePlan: (id: string, data: { plan: string }) => api.patch(`/admin/users/${id}/plan`, data),
  toggleStatus: (id: string) => api.put(`/admin/users/${id}/status`),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getAllScans: (page = 1) => api.get(`/admin/scans?page=${page}`),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.put('/admin/settings', data),
};

export default api;