import axios from 'axios';
import { User, Property, Review, Booking, Message } from '../types';
import { BookingRequest } from '../types/booking';

const API_BASE_URL = 'http://localhost:8080/moove/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API
export const userApi = {
  getAllUsers: () => api.get<User[]>('/users'),
  getUserById: (userId: string) => api.get<User>(`/users/${userId}`),
  getUserByEmail: (email: string) => api.get<User>(`/users/email/${email}`),
  createUser: (user: Omit<User, 'userId'>) => api.post<User>('/users', user),
  deleteUser: (userId: string) => api.delete(`/users/${userId}`),
};

// Property API
export const propertyApi = {
  getAllProperties: () => api.get<Property[]>('/property'),
  getPropertyById: (id: number) => api.get<Property>(`/property/${id}`),
  createProperty: (property: Omit<Property, 'propertyId'>) => api.post<Property>('/property', property),
  deleteProperty: (id: number) => api.delete(`/property/${id}`),
};

// Review API
export const reviewApi = {
  getAllReviews: () => api.get<Review[]>('/reviews'),
  getReviewById: (id: number) => api.get<Review>(`/reviews/${id}`),
  getReviewsByProperty: (propertyId: number) => api.get<Review[]>(`/reviews/property/${propertyId}`),
  createReview: (review: Omit<Review, 'reviewId' | 'createdAt'>) => api.post<Review>('/reviews', review),
  updateReview: (id: number, review: Partial<Review>) => api.put<Review>(`/reviews/${id}`, review),
  deleteReview: (id: number) => api.delete(`/reviews/${id}`),
};

// Booking API
export const bookingApi = {
  getAllBookings: () => api.get<Booking[]>('/bookings'),
  getBookingById: (id: number) => api.get<Booking>(`/bookings/${id}`),
  createBooking: (booking: Omit<Booking, 'bookingId'>) => api.post<Booking>('/bookings', booking),
  cancelBooking: (id: number) => api.put(`/bookings/cancel/${id}`),
  
  // Booking Request endpoints
  getAllBookingRequests: () => api.get<BookingRequest[]>('/booking-requests'),
  getBookingRequestById: (id: number) => api.get<BookingRequest>(`/booking-requests/${id}`),
  createBookingRequest: (request: Omit<BookingRequest, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post<BookingRequest>('/booking-requests', request),
  updateBookingRequestStatus: (id: number, status: BookingRequest['status']) => 
    api.put(`/booking-requests/${id}/status`, { status }),
  cancelBookingRequest: (id: number) => api.put(`/booking-requests/${id}/cancel`),
};

// Message API
export const messageApi = {
  getConversation: (senderId: number, receiverId: number) => 
    api.get<Message[]>(`/messages/conversation?senderId=${senderId}&receiverId=${receiverId}`),
  sendMessage: (message: Omit<Message, 'id' | 'sentAt'>) => api.post<Message>('/messages', message),
};

export default api;