// API Service Layer
class ApiService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.headers = API_CONFIG.DEFAULT_HEADERS;
    }

    // Generic HTTP request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.headers,
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            // Handle different response status codes
            if (response.status === 404) {
                throw new Error(ERROR_MESSAGES.NOT_FOUND);
            }
            
            if (response.status === 403) {
                throw new Error(ERROR_MESSAGES.PERMISSION_DENIED);
            }
            
            if (!response.ok) {
                if (response.status >= 500) {
                    throw new Error(ERROR_MESSAGES.SERVER_ERROR);
                } else {
                    throw new Error(ERROR_MESSAGES.VALIDATION_ERROR);
                }
            }

            // Handle empty responses
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return null;
            }
        } catch (error) {
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
            }
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
}

// User API
class UserAPI extends ApiService {
    constructor() {
        super();
        this.endpoint = API_CONFIG.ENDPOINTS.USERS;
    }

    async getAllUsers() {
        return this.get(this.endpoint);
    }

    async getUserById(userId) {
        return this.get(`${this.endpoint}/${userId}`);
    }

    async getUserByEmail(email) {
        return this.get(`${this.endpoint}/email/${encodeURIComponent(email)}`);
    }

    async getUserByPhone(phone) {
        return this.get(`${this.endpoint}/userPhone/${encodeURIComponent(phone)}`);
    }

    async getUserByUsername(username) {
        return this.get(`${this.endpoint}/username/${encodeURIComponent(username)}`);
    }

    async createUser(userData) {
        return this.post(this.endpoint, userData);
    }

    async updateUser(userData) {
        return this.post(this.endpoint, userData);
    }

    async deleteUser(userId) {
        return this.delete(`${this.endpoint}/${userId}`);
    }
}

// Property API
class PropertyAPI extends ApiService {
    constructor() {
        super();
        this.endpoint = API_CONFIG.ENDPOINTS.PROPERTIES;
    }

    async getAllProperties() {
        return this.get(this.endpoint);
    }

    async getPropertyById(propertyId) {
        return this.get(`${this.endpoint}/${propertyId}`);
    }

    async createProperty(propertyData) {
        return this.post(this.endpoint, propertyData);
    }

    async updateProperty(propertyId, propertyData) {
        return this.put(`${this.endpoint}/${propertyId}`, propertyData);
    }

    async deleteProperty(propertyId) {
        return this.delete(`${this.endpoint}/${propertyId}`);
    }

    async searchProperties(filters) {
        // Since the backend doesn't have a search endpoint, we'll filter on the frontend
        const properties = await this.getAllProperties();
        return this.filterProperties(properties, filters);
    }

    filterProperties(properties, filters) {
        if (!properties || !Array.isArray(properties)) return [];

        return properties.filter(property => {
            // Location filter (search in name and description)
            if (filters.location) {
                const location = filters.location.toLowerCase();
                const matchesLocation = 
                    property.propertyName.toLowerCase().includes(location) ||
                    property.propertyDescription.toLowerCase().includes(location);
                if (!matchesLocation) return false;
            }

            // Property type filter
            if (filters.propertyType && property.propertyType !== filters.propertyType) {
                return false;
            }

            // Price range filter
            if (filters.minPrice && property.propertyPrice < parseFloat(filters.minPrice)) {
                return false;
            }
            if (filters.maxPrice && property.propertyPrice > parseFloat(filters.maxPrice)) {
                return false;
            }

            // Bedrooms filter
            if (filters.bedrooms && property.bedroomsAvailable < parseInt(filters.bedrooms)) {
                return false;
            }

            return true;
        });
    }
}

// Review API
class ReviewAPI extends ApiService {
    constructor() {
        super();
        this.endpoint = API_CONFIG.ENDPOINTS.REVIEWS;
    }

    async getAllReviews() {
        return this.get(this.endpoint);
    }

    async getReviewById(reviewId) {
        return this.get(`${this.endpoint}/${reviewId}`);
    }

    async getReviewsByProperty(propertyId) {
        return this.get(`${this.endpoint}/property/${propertyId}`);
    }

    async createReview(reviewData) {
        return this.post(this.endpoint, reviewData);
    }

    async updateReview(reviewId, reviewData) {
        return this.put(`${this.endpoint}/${reviewId}`, reviewData);
    }

    async deleteReview(reviewId) {
        return this.delete(`${this.endpoint}/${reviewId}`);
    }
}

// Booking API
class BookingAPI extends ApiService {
    constructor() {
        super();
        this.endpoint = API_CONFIG.ENDPOINTS.BOOKINGS;
    }

    async getAllBookings() {
        return this.get(this.endpoint);
    }

    async getBookingById(bookingId) {
        return this.get(`${this.endpoint}/${bookingId}`);
    }

    async createBooking(bookingData) {
        return this.post(this.endpoint, bookingData);
    }

    async cancelBooking(bookingId) {
        return this.put(`${this.endpoint}/cancel/${bookingId}`);
    }
}

// Message API
class MessageAPI extends ApiService {
    constructor() {
        super();
        this.endpoint = API_CONFIG.ENDPOINTS.MESSAGES;
    }

    async getConversation(senderId, receiverId) {
        return this.get(`${this.endpoint}/conversation?senderId=${senderId}&receiverId=${receiverId}`);
    }

    async sendMessage(messageData) {
        return this.post(this.endpoint, messageData);
    }
}

// Initialize API instances
const userAPI = new UserAPI();
const propertyAPI = new PropertyAPI();
const reviewAPI = new ReviewAPI();
const bookingAPI = new BookingAPI();
const messageAPI = new MessageAPI();

// Export API instances
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        userAPI,
        propertyAPI,
        reviewAPI,
        bookingAPI,
        messageAPI
    };
}