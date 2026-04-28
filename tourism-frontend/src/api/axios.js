import axios from 'axios';

// ── Axios instance 
const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor — attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // You attach the token to the request header.
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — handle 401 globally 
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth 
export const register = (data) => API.post('/auth/register', data);
export const login    = (data) => API.post('/auth/login', data);
export const getMe    = ()     => API.get('/auth/me');

// ── Cities 
export const getCities   = ()   => API.get('/cities');
export const getCityById = (id) => API.get(`/cities/${id}`);

// ── Services 
export const getServices    = (params) => API.get('/services', { params });
export const getServiceById = (id)     => API.get(`/services/${id}`);

// ── Bookings 
export const createBooking  = (data) => API.post('/bookings', data);
export const getBookings    = ()     => API.get('/bookings');
export const cancelBooking  = (id)   => API.patch(`/bookings/${id}/cancel`);
export const confirmBooking = (id)   => API.patch(`/bookings/${id}/confirm`);

// ── Reviews 
export const createReview      = (data)      => API.post('/reviews', data);
export const getServiceReviews = (serviceId) => API.get(`/reviews/service/${serviceId}`);
export const deleteReview      = (id)        => API.delete(`/reviews/${id}`);

// ── Favorites 
export const addFavorite    = (data)      => API.post('/favorites', data);
export const getFavorites   = ()          => API.get('/favorites');
export const removeFavorite = (serviceId) => API.delete(`/favorites/${serviceId}`);

// ── Messages 
export const sendMessage     = (data)   => API.post('/messages', data);
export const getInbox        = ()       => API.get('/messages');
export const getConversation = (userId) => API.get(`/messages/${userId}`);

// ── Notifications 
export const getNotifications = ()   => API.get('/notifications');
export const markAllRead      = ()   => API.patch('/notifications/read-all');
export const markOneRead      = (id) => API.patch(`/notifications/${id}/read`);

// ── Provider 
export const getProviderServices = ()          => API.get('/provider/services');
export const createService      = (data)      => API.post('/provider/services', data);
export const updateService      = (id, data)  => API.put(`/provider/services/${id}`, data);
export const deleteService      = (id)        => API.delete(`/provider/services/${id}`);

// ── Admin 
export const getProviders    = ()   => API.get('/admin/providers');
export const approveProvider = (id) => API.patch(`/admin/providers/${id}/approve`);
export const rejectProvider  = (id) => API.patch(`/admin/providers/${id}/reject`);
export const getStats        = ()   => API.get('/admin/stats');

export default API;
