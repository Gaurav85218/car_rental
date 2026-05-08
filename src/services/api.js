import axios from 'axios';

const API_BASE_URL = 'https://car-rental-e9te.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Car APIs
export const carAPI = {
  browseCars: () => api.get('/cars/browse'),
  getCarById: (id) => api.get(`/cars/${id}`),
  addCar: (formData) => api.post('/cars/host/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getHostCars: () => api.get('/cars/host/my-cars'),
  updateCar: (id, formData) => api.put(`/cars/host/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteCar: (id) => api.delete(`/cars/host/${id}`),
  removeImage: (carId, imageUrl) => api.delete(`/cars/host/${carId}/images`, {
    params: { imageUrl },
  }),
};

// Booking APIs
export const bookingAPI = {
  createBooking: (data) => api.post('/bookings/create', data),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getHostBookings: () => api.get('/bookings/host/bookings'),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
};

export default api;
