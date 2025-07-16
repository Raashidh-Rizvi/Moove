import axios from 'axios';
import { BookingRequest, RequestDocument, Notification } from '../types/booking';

const API_BASE_URL = 'http://localhost:8080/moove/api';

const bookingApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Booking Request API
export const bookingRequestApi = {
  // Get all booking requests
  getAllBookingRequests: () => bookingApi.get<BookingRequest[]>('/booking-requests'),
  
  // Get booking request by ID
  getBookingRequestById: (id: number) => bookingApi.get<BookingRequest>(`/booking-requests/${id}`),
  
  // Get booking requests by property
  getBookingRequestsByProperty: (propertyId: number) => 
    bookingApi.get<BookingRequest[]>(`/booking-requests/property/${propertyId}`),
  
  // Get booking requests by tenant
  getBookingRequestsByTenant: (tenantId: string) => 
    bookingApi.get<BookingRequest[]>(`/booking-requests/tenant/${tenantId}`),
  
  // Get booking requests by landlord
  getBookingRequestsByLandlord: (landlordId: string) => 
    bookingApi.get<BookingRequest[]>(`/booking-requests/landlord/${landlordId}`),
  
  // Create booking request
  createBookingRequest: (request: Omit<BookingRequest, 'id' | 'createdAt' | 'updatedAt'>) => 
    bookingApi.post<BookingRequest>('/booking-requests', request),
  
  // Update booking request status
  updateBookingRequestStatus: (id: number, status: BookingRequest['status']) => 
    bookingApi.put(`/booking-requests/${id}/status`, { status }),
  
  // Update booking request
  updateBookingRequest: (id: number, request: Partial<BookingRequest>) => 
    bookingApi.put<BookingRequest>(`/booking-requests/${id}`, request),
  
  // Delete booking request
  deleteBookingRequest: (id: number) => bookingApi.delete(`/booking-requests/${id}`),
  
  // Cancel booking request
  cancelBookingRequest: (id: number) => 
    bookingApi.put(`/booking-requests/${id}/cancel`),
};

// Request Documents API
export const requestDocumentApi = {
  // Get documents by request ID
  getDocumentsByRequest: (requestId: number) => 
    bookingApi.get<RequestDocument[]>(`/request-documents/request/${requestId}`),
  
  // Upload document
  uploadDocument: (requestId: number, file: File, documentType: RequestDocument['documentType']) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('requestId', requestId.toString());
    formData.append('documentType', documentType);
    
    return bookingApi.post<RequestDocument>('/request-documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Delete document
  deleteDocument: (id: number) => bookingApi.delete(`/request-documents/${id}`),
  
  // Download document
  downloadDocument: (id: number) => 
    bookingApi.get(`/request-documents/${id}/download`, { responseType: 'blob' }),
};

// Notifications API
export const notificationApi = {
  // Get notifications by user
  getNotificationsByUser: (userId: string) => 
    bookingApi.get<Notification[]>(`/notifications/user/${userId}`),
  
  // Get unread notifications count
  getUnreadCount: (userId: string) => 
    bookingApi.get<{ count: number }>(`/notifications/user/${userId}/unread-count`),
  
  // Mark notification as read
  markAsRead: (id: number) => 
    bookingApi.put(`/notifications/${id}/read`),
  
  // Mark all notifications as read
  markAllAsRead: (userId: string) => 
    bookingApi.put(`/notifications/user/${userId}/read-all`),
  
  // Create notification
  createNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => 
    bookingApi.post<Notification>('/notifications', notification),
  
  // Delete notification
  deleteNotification: (id: number) => bookingApi.delete(`/notifications/${id}`),
};

// Location API (for Sri Lankan districts and towns)
export const locationApi = {
  // Get all districts
  getDistricts: () => bookingApi.get('/locations/districts'),
  
  // Get towns by district
  getTownsByDistrict: (districtId: number) => 
    bookingApi.get(`/locations/districts/${districtId}/towns`),
  
  // Search locations
  searchLocations: (query: string) => 
    bookingApi.get(`/locations/search?q=${encodeURIComponent(query)}`),
};

export default {
  bookingRequestApi,
  requestDocumentApi,
  notificationApi,
  locationApi,
};