import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dc_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 - clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dc_admin_token');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Blog API ────────────────────────────────────────────────────────────────

export const blogApi = {
  list: () => api.get('/blog'),
  listAll: () => api.get('/blog/admin/all'),
  get: (slug: string) => api.get(`/blog/${slug}`),
  create: (data: unknown) => api.post('/blog', data),
  update: (id: number, data: unknown) => api.put(`/blog/${id}`, data),
  delete: (id: number) => api.delete(`/blog/${id}`),
  upload: (formData: FormData) => api.post('/blog/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// ─── Auth API ────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

// ─── Contact API ──────────────────────────────────────────────────────────────

export const contactApi = {
  submit: (data: { name: string; email: string; message: string }) =>
    api.post('/contact', data),
};
