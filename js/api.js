// API Configuration
const API_BASE_URL = 'http://localhost:8080/moove/api';

// API Helper Functions
class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.currentUser = this.getCurrentUser();
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // GET request
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // User Management
    async getAllUsers() {
        return this.get('/users');
    }

    async getUserById(userId) {
        return this.get(`/users/${userId}`);
    }

    async getUserByEmail(email) {
        return this.get(`/users/email/${email}`);
    }

    async getUserByUsername(username) {
        return this.get(`/users/username/${username}`);
    }

    async createUser(userData) {
        return this.post('/users', userData);
    }

    async updateUser(userId, userData) {
        return this.put(`/users/${userId}`, userData);
    }

    async deleteUser(userId) {
        return this.delete(`/users/${userId}`);
    }

    // Property Management
    async getAllProperties() {
        return this.get('/property');
    }

    async getPropertyById(propertyId) {
        return this.get(`/property/${propertyId}`);
    }

    async createProperty(propertyData) {
        return this.post('/property', propertyData);
    }

    async updateProperty(propertyId, propertyData) {
        return this.put(`/property/${propertyId}`, propertyData);
    }

    async deleteProperty(propertyId) {
        return this.delete(`/property/${propertyId}`);
    }

    // Booking Management
    async getAllBookings() {
        return this.get('/bookings');
    }

    async getBookingById(bookingId) {
        return this.get(`/bookings/${bookingId}`);
    }

    async createBooking(bookingData) {
        return this.post('/bookings', bookingData);
    }

    async cancelBooking(bookingId) {
        return this.put(`/bookings/cancel/${bookingId}`);
    }

    // Review Management
    async getAllReviews() {
        return this.get('/reviews');
    }

    async getReviewById(reviewId) {
        return this.get(`/reviews/${reviewId}`);
    }

    async getReviewsByProperty(propertyId) {
        return this.get(`/reviews/property/${propertyId}`);
    }

    async createReview(reviewData) {
        return this.post('/reviews', reviewData);
    }

    async updateReview(reviewId, reviewData) {
        return this.put(`/reviews/${reviewId}`, reviewData);
    }

    async deleteReview(reviewId) {
        return this.delete(`/reviews/${reviewId}`);
    }

    // Message Management
    async getConversation(senderId, receiverId) {
        return this.get(`/messages/conversation?senderId=${senderId}&receiverId=${receiverId}`);
    }

    async sendMessage(messageData) {
        return this.post('/messages', messageData);
    }

    // Payment Management
    async getAllPayments() {
        return this.get('/payments');
    }

    async createPayment(paymentData) {
        return this.post('/payments', paymentData);
    }

    // Authentication helpers
    getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
    }

    clearCurrentUser() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    isLandlord() {
        return this.currentUser && this.currentUser.userRole === 'LANDLORD';
    }

    isTenant() {
        return this.currentUser && this.currentUser.userRole === 'TENANT';
    }
}

// Fallback API for development (when backend is not available)
class FallbackApiService extends ApiService {
    constructor() {
        super();
        this.properties = [...sampleProperties];
        this.users = [...users];
        this.bookings = [...bookings];
        this.messages = [...messages];
        this.reviews = [];
        this.payments = [];
    }

    // Simulate network delay
    async delay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // User Management (Fallback)
    async getAllUsers() {
        await this.delay();
        return this.users;
    }

    async getUserById(userId) {
        await this.delay();
        const user = this.users.find(u => u.userId === userId);
        if (!user) throw new Error('User not found');
        return user;
    }

    async getUserByEmail(email) {
        await this.delay();
        const user = this.users.find(u => u.userEmail === email);
        if (!user) throw new Error('User not found');
        return user;
    }

    async getUserByUsername(username) {
        await this.delay();
        const user = this.users.find(u => u.username === username);
        if (!user) throw new Error('User not found');
        return user;
    }

    async createUser(userData) {
        await this.delay();
        const newUser = {
            userId: `user_${Date.now()}`,
            ...userData
        };
        this.users.push(newUser);
        return newUser;
    }

    async updateUser(userId, userData) {
        await this.delay();
        const index = this.users.findIndex(u => u.userId === userId);
        if (index === -1) throw new Error('User not found');
        this.users[index] = { ...this.users[index], ...userData };
        return this.users[index];
    }

    async deleteUser(userId) {
        await this.delay();
        const index = this.users.findIndex(u => u.userId === userId);
        if (index === -1) throw new Error('User not found');
        this.users.splice(index, 1);
        return 'User deleted successfully';
    }

    // Property Management (Fallback)
    async getAllProperties() {
        await this.delay();
        return this.properties;
    }

    async getPropertyById(propertyId) {
        await this.delay();
        const property = this.properties.find(p => p.propertyId == propertyId);
        if (!property) throw new Error('Property not found');
        return property;
    }

    async createProperty(propertyData) {
        await this.delay();
        const newProperty = {
            propertyId: Date.now(),
            ...propertyData,
            user: this.currentUser
        };
        this.properties.push(newProperty);
        return newProperty;
    }

    async updateProperty(propertyId, propertyData) {
        await this.delay();
        const index = this.properties.findIndex(p => p.propertyId == propertyId);
        if (index === -1) throw new Error('Property not found');
        this.properties[index] = { ...this.properties[index], ...propertyData };
        return this.properties[index];
    }

    async deleteProperty(propertyId) {
        await this.delay();
        const index = this.properties.findIndex(p => p.propertyId == propertyId);
        if (index === -1) throw new Error('Property not found');
        this.properties.splice(index, 1);
        return 'Property deleted successfully';
    }

    // Booking Management (Fallback)
    async getAllBookings() {
        await this.delay();
        return this.bookings;
    }

    async getBookingById(bookingId) {
        await this.delay();
        const booking = this.bookings.find(b => b.bookingId == bookingId);
        if (!booking) throw new Error('Booking not found');
        return booking;
    }

    async createBooking(bookingData) {
        await this.delay();
        const newBooking = {
            bookingId: Date.now(),
            ...bookingData,
            user: this.currentUser,
            bookingDate: new Date(),
            status: 'PENDING'
        };
        this.bookings.push(newBooking);
        return newBooking;
    }

    async cancelBooking(bookingId) {
        await this.delay();
        const booking = this.bookings.find(b => b.bookingId == bookingId);
        if (!booking) throw new Error('Booking not found');
        booking.status = 'CANCELLED';
        return booking;
    }

    // Message Management (Fallback)
    async getConversation(senderId, receiverId) {
        await this.delay();
        return this.messages.filter(m => 
            (m.sender.userId === senderId && m.receiver.userId === receiverId) ||
            (m.sender.userId === receiverId && m.receiver.userId === senderId)
        ).sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
    }

    async sendMessage(messageData) {
        await this.delay();
        const newMessage = {
            id: Date.now(),
            ...messageData,
            sentAt: new Date()
        };
        this.messages.push(newMessage);
        return newMessage;
    }
}

// Initialize API service
let apiService;

// Try to use real API first, fallback to mock if needed
async function initializeApiService() {
    try {
        apiService = new ApiService();
        // Test connection
        await apiService.get('/users');
        console.log('Connected to backend API');
    } catch (error) {
        console.warn('Backend API not available, using fallback service');
        apiService = new FallbackApiService();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeApiService);

// Export for use in other files
if (typeof window !== 'undefined') {
    window.apiService = apiService;
}