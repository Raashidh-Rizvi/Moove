// API Configuration
const API_BASE_URL = 'http://localhost:8080/moove/api';

// API utility functions
class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.currentUser = this.getCurrentUser();
    }

    // Get current user from localStorage
    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    // Set current user in localStorage
    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
    }

    // Clear current user
    clearCurrentUser() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
    }

    // Generic API request method
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

    // User API methods
    async getAllUsers() {
        return await this.request('/users');
    }

    async getUserById(userId) {
        return await this.request(`/users/${userId}`);
    }

    async getUserByEmail(email) {
        return await this.request(`/users/email/${email}`);
    }

    async getUserByPhone(phone) {
        return await this.request(`/users/userPhone/${phone}`);
    }

    async getUserByUsername(username) {
        return await this.request(`/users/username/${username}`);
    }

    async createUser(userData) {
        return await this.request('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async updateUser(userId, userData) {
        return await this.request(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    async deleteUser(userId) {
        return await this.request(`/users/${userId}`, {
            method: 'DELETE'
        });
    }

    // Property API methods
    async getAllProperties() {
        return await this.request('/property');
    }

    async getPropertyById(propertyId) {
        return await this.request(`/property/${propertyId}`);
    }

    async createProperty(propertyData) {
        return await this.request('/property', {
            method: 'POST',
            body: JSON.stringify(propertyData)
        });
    }

    async updateProperty(propertyId, propertyData) {
        return await this.request(`/property/${propertyId}`, {
            method: 'PUT',
            body: JSON.stringify(propertyData)
        });
    }

    async deleteProperty(propertyId) {
        return await this.request(`/property/${propertyId}`, {
            method: 'DELETE'
        });
    }

    // Booking API methods
    async getAllBookings() {
        return await this.request('/bookings');
    }

    async getBookingById(bookingId) {
        return await this.request(`/bookings/${bookingId}`);
    }

    async createBooking(bookingData) {
        return await this.request('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    }

    async cancelBooking(bookingId) {
        return await this.request(`/bookings/cancel/${bookingId}`, {
            method: 'PUT'
        });
    }

    // Review API methods
    async getAllReviews() {
        return await this.request('/reviews');
    }

    async getReviewById(reviewId) {
        return await this.request(`/reviews/${reviewId}`);
    }

    async getReviewsByPropertyId(propertyId) {
        return await this.request(`/reviews/property/${propertyId}`);
    }

    async createReview(reviewData) {
        return await this.request('/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
    }

    async updateReview(reviewId, reviewData) {
        return await this.request(`/reviews/${reviewId}`, {
            method: 'PUT',
            body: JSON.stringify(reviewData)
        });
    }

    async deleteReview(reviewId) {
        return await this.request(`/reviews/${reviewId}`, {
            method: 'DELETE'
        });
    }

    // Message API methods
    async getConversation(senderId, receiverId) {
        return await this.request(`/messages/conversation?senderId=${senderId}&receiverId=${receiverId}`);
    }

    async sendMessage(messageData) {
        return await this.request('/messages', {
            method: 'POST',
            body: JSON.stringify(messageData)
        });
    }

    // Payment API methods
    async getAllPayments() {
        return await this.request('/payments');
    }

    async createPayment(paymentData) {
        return await this.request('/payments', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    }

    // Authentication methods (simulated)
    async login(credentials) {
        try {
            // Try to find user by email or username
            let user;
            try {
                user = await this.getUserByEmail(credentials.emailOrUsername);
            } catch (error) {
                try {
                    user = await this.getUserByUsername(credentials.emailOrUsername);
                } catch (error) {
                    throw new Error('User not found');
                }
            }

            // In a real application, you would verify the password here
            // For demo purposes, we'll assume the login is successful
            if (user) {
                this.setCurrentUser(user);
                return { success: true, user };
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async register(userData) {
        try {
            // Check if user already exists
            try {
                await this.getUserByEmail(userData.userEmail);
                throw new Error('User with this email already exists');
            } catch (error) {
                if (error.message !== 'User with this email already exists') {
                    // User doesn't exist, proceed with registration
                }
            }

            try {
                await this.getUserByUsername(userData.username);
                throw new Error('Username already taken');
            } catch (error) {
                if (error.message !== 'Username already taken') {
                    // Username is available, proceed
                }
            }

            // Create new user
            const newUser = await this.createUser(userData);
            this.setCurrentUser(newUser);
            return { success: true, user: newUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    logout() {
        this.clearCurrentUser();
    }

    // Utility methods
    isLoggedIn() {
        return this.currentUser !== null;
    }

    isLandlord() {
        return this.currentUser && this.currentUser.userRole === 'LANDLORD';
    }

    isTenant() {
        return this.currentUser && this.currentUser.userRole === 'TENANT';
    }

    // Image upload simulation (in real app, this would upload to cloud storage)
    async uploadImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                // In a real application, you would upload to a cloud service
                // For demo purposes, we'll return a data URL
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }

    // Search and filter methods
    async searchProperties(filters = {}) {
        try {
            let properties = await this.getAllProperties();
            
            // Apply filters
            if (filters.district) {
                properties = properties.filter(p => p.district === filters.district);
            }
            
            if (filters.town) {
                properties = properties.filter(p => p.town === filters.town);
            }
            
            if (filters.propertyType) {
                properties = properties.filter(p => p.propertyType === filters.propertyType);
            }
            
            if (filters.minPrice) {
                properties = properties.filter(p => p.propertyPrice >= filters.minPrice);
            }
            
            if (filters.maxPrice) {
                properties = properties.filter(p => p.propertyPrice <= filters.maxPrice);
            }
            
            if (filters.bedrooms) {
                properties = properties.filter(p => p.bedroomsAvailable >= filters.bedrooms);
            }
            
            if (filters.bathrooms) {
                properties = properties.filter(p => p.bathroomsAvailable >= filters.bathrooms);
            }
            
            return properties;
        } catch (error) {
            console.error('Search failed:', error);
            return [];
        }
    }
}

// Create global API service instance
const apiService = new ApiService();