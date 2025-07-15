// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/moove/api',
    ENDPOINTS: {
        USERS: '/users',
        PROPERTIES: '/property',
        REVIEWS: '/reviews',
        BOOKINGS: '/bookings',
        MESSAGES: '/messages'
    },
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Application Configuration
const APP_CONFIG = {
    APP_NAME: 'Moove',
    VERSION: '1.0.0',
    DEFAULT_PROPERTY_IMAGE: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
    TOAST_DURATION: 5000,
    DEBOUNCE_DELAY: 300,
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 12,
        MAX_PAGE_SIZE: 50
    }
};

// Property Types
const PROPERTY_TYPES = {
    APARTMENT: 'Apartment',
    HOUSE: 'House',
    ROOM: 'Room'
};

// User Roles
const USER_ROLES = {
    CLIENT: 'CLIENT',
    LANDLORD: 'LANDLORD'
};

// Toast Types
const TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

// Local Storage Keys
const STORAGE_KEYS = {
    USER: 'moove_user',
    FAVORITES: 'moove_favorites',
    SEARCH_FILTERS: 'moove_search_filters'
};

// Validation Rules
const VALIDATION_RULES = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^[\+]?[1-9][\d]{0,15}$/,
    PASSWORD_MIN_LENGTH: 6,
    NAME_MIN_LENGTH: 2,
    DESCRIPTION_MIN_LENGTH: 10,
    PRICE_MIN: 0,
    SIZE_MIN: 0,
    ROOMS_MIN: 0
};

// Error Messages
const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    AUTH_ERROR: 'Authentication failed. Please login again.',
    NOT_FOUND: 'The requested resource was not found.',
    PERMISSION_DENIED: 'You do not have permission to perform this action.',
    GENERIC_ERROR: 'Something went wrong. Please try again.'
};

// Success Messages
const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Welcome back! You have been logged in successfully.',
    REGISTER_SUCCESS: 'Account created successfully! Welcome to Moove.',
    LOGOUT_SUCCESS: 'You have been logged out successfully.',
    PROPERTY_CREATED: 'Property has been added successfully!',
    PROPERTY_UPDATED: 'Property has been updated successfully!',
    PROPERTY_DELETED: 'Property has been deleted successfully!',
    PROFILE_UPDATED: 'Your profile has been updated successfully!',
    MESSAGE_SENT: 'Your message has been sent successfully!',
    ACCOUNT_DELETED: 'Your account has been deleted successfully.'
};

// Animation Durations (in milliseconds)
const ANIMATION_DURATIONS = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    TOAST_SLIDE: 300,
    MODAL_FADE: 300,
    CARD_HOVER: 500
};

// Breakpoints (in pixels)
const BREAKPOINTS = {
    XS: 0,
    SM: 576,
    MD: 768,
    LG: 992,
    XL: 1200,
    XXL: 1400
};

// Export configuration for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_CONFIG,
        APP_CONFIG,
        PROPERTY_TYPES,
        USER_ROLES,
        TOAST_TYPES,
        STORAGE_KEYS,
        VALIDATION_RULES,
        ERROR_MESSAGES,
        SUCCESS_MESSAGES,
        ANIMATION_DURATIONS,
        BREAKPOINTS
    };
}