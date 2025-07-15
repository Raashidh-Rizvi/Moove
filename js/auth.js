// Authentication Management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Load user from localStorage on initialization
        this.loadUserFromStorage();
        this.updateUI();
    }

    // Load user from localStorage
    loadUserFromStorage() {
        try {
            const userData = localStorage.getItem(STORAGE_KEYS.USER);
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        } catch (error) {
            console.error('Error loading user from storage:', error);
            localStorage.removeItem(STORAGE_KEYS.USER);
        }
    }

    // Save user to localStorage
    saveUserToStorage(user) {
        try {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        } catch (error) {
            console.error('Error saving user to storage:', error);
        }
    }

    // Remove user from localStorage
    removeUserFromStorage() {
        localStorage.removeItem(STORAGE_KEYS.USER);
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Check if user is landlord
    isLandlord() {
        return this.currentUser && this.currentUser.userRole === USER_ROLES.LANDLORD;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Login user
    async login(email, password) {
        try {
            // Find user by email
            const user = await userAPI.getUserByEmail(email);
            
            if (!user) {
                throw new Error('User not found');
            }

            // Check password (in a real app, this would be handled securely on the backend)
            if (user.userPassword !== password) {
                throw new Error('Invalid password');
            }

            // Set current user
            this.currentUser = user;
            this.saveUserToStorage(user);
            this.updateUI();

            showToast(SUCCESS_MESSAGES.LOGIN_SUCCESS, TOAST_TYPES.SUCCESS);
            return user;
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Invalid email or password');
        }
    }

    // Register user
    async register(userData) {
        try {
            // Validate user data
            this.validateUserData(userData);

            // Check if user already exists
            try {
                const existingUser = await userAPI.getUserByEmail(userData.userEmail);
                if (existingUser) {
                    throw new Error('User with this email already exists');
                }
            } catch (error) {
                // If user not found, that's good - we can proceed
                if (!error.message.includes('not found')) {
                    throw error;
                }
            }

            // Create user
            const newUser = await userAPI.createUser(userData);
            
            // Set current user
            this.currentUser = newUser;
            this.saveUserToStorage(newUser);
            this.updateUI();

            showToast(SUCCESS_MESSAGES.REGISTER_SUCCESS, TOAST_TYPES.SUCCESS);
            return newUser;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    // Logout user
    logout() {
        this.currentUser = null;
        this.removeUserFromStorage();
        this.updateUI();
        showToast(SUCCESS_MESSAGES.LOGOUT_SUCCESS, TOAST_TYPES.SUCCESS);
        showSection('home');
    }

    // Update user profile
    async updateProfile(userData) {
        try {
            if (!this.currentUser) {
                throw new Error('User not authenticated');
            }

            // Merge with current user data
            const updatedUserData = {
                ...this.currentUser,
                ...userData
            };

            // Validate updated data
            this.validateUserData(updatedUserData, false);

            // Update user
            const updatedUser = await userAPI.updateUser(updatedUserData);
            
            // Update current user
            this.currentUser = updatedUser;
            this.saveUserToStorage(updatedUser);
            this.updateUI();

            showToast(SUCCESS_MESSAGES.PROFILE_UPDATED, TOAST_TYPES.SUCCESS);
            return updatedUser;
        } catch (error) {
            console.error('Profile update error:', error);
            throw error;
        }
    }

    // Delete user account
    async deleteAccount() {
        try {
            if (!this.currentUser) {
                throw new Error('User not authenticated');
            }

            if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                return;
            }

            await userAPI.deleteUser(this.currentUser.userId);
            
            this.logout();
            showToast(SUCCESS_MESSAGES.ACCOUNT_DELETED, TOAST_TYPES.SUCCESS);
        } catch (error) {
            console.error('Account deletion error:', error);
            throw error;
        }
    }

    // Validate user data
    validateUserData(userData, isRegistration = true) {
        const errors = [];

        // Name validation
        if (!userData.username || userData.username.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
            errors.push(`Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters long`);
        }

        // Email validation
        if (!userData.userEmail || !VALIDATION_RULES.EMAIL.test(userData.userEmail)) {
            errors.push('Please enter a valid email address');
        }

        // Phone validation
        if (!userData.userPhone || !VALIDATION_RULES.PHONE.test(userData.userPhone)) {
            errors.push('Please enter a valid phone number');
        }

        // Address validation
        if (!userData.userAddress || userData.userAddress.trim().length < 5) {
            errors.push('Please enter a valid address');
        }

        // Password validation (only for registration)
        if (isRegistration) {
            if (!userData.userPassword || userData.userPassword.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
                errors.push(`Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`);
            }
        }

        // Role validation
        if (!userData.userRole || !Object.values(USER_ROLES).includes(userData.userRole)) {
            errors.push('Please select a valid user role');
        }

        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }
    }

    // Update UI based on authentication state
    updateUI() {
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        const userName = document.getElementById('user-name');
        const userRole = document.getElementById('user-role');
        const userAvatar = document.getElementById('user-avatar');
        
        // Get all elements that should be shown/hidden based on auth state
        const authOnlyElements = document.querySelectorAll('.auth-only');
        const landlordOnlyElements = document.querySelectorAll('.landlord-only');

        if (this.isAuthenticated()) {
            // Show user menu, hide auth buttons
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) userMenu.style.display = 'flex';
            
            // Update user info
            if (userName) userName.textContent = this.currentUser.username;
            if (userRole) userRole.textContent = this.currentUser.userRole;
            if (userAvatar) userAvatar.textContent = this.currentUser.username.charAt(0).toUpperCase();
            
            // Show auth-only elements
            authOnlyElements.forEach(element => {
                element.style.display = element.tagName.toLowerCase() === 'a' ? 'inline' : 'block';
            });
            
            // Show/hide landlord-only elements
            landlordOnlyElements.forEach(element => {
                element.style.display = this.isLandlord() ? 
                    (element.tagName.toLowerCase() === 'a' ? 'inline' : 'block') : 'none';
            });
        } else {
            // Show auth buttons, hide user menu
            if (authButtons) authButtons.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
            
            // Hide auth-only elements
            authOnlyElements.forEach(element => {
                element.style.display = 'none';
            });
            
            // Hide landlord-only elements
            landlordOnlyElements.forEach(element => {
                element.style.display = 'none';
            });
        }

        // Update profile section if visible
        this.updateProfileSection();
    }

    // Update profile section
    updateProfileSection() {
        if (!this.currentUser) return;

        const profileElements = {
            avatar: document.getElementById('profile-avatar'),
            username: document.getElementById('profile-username'),
            role: document.getElementById('profile-role'),
            name: document.getElementById('profile-name'),
            email: document.getElementById('profile-email'),
            phone: document.getElementById('profile-phone'),
            address: document.getElementById('profile-address'),
            statLabel1: document.getElementById('stat-label-1'),
            statLabel2: document.getElementById('stat-label-2')
        };

        // Update profile header
        if (profileElements.avatar) {
            profileElements.avatar.textContent = this.currentUser.username.charAt(0).toUpperCase();
        }
        if (profileElements.username) {
            profileElements.username.textContent = this.currentUser.username;
        }
        if (profileElements.role) {
            profileElements.role.textContent = this.currentUser.userRole;
        }

        // Update profile form
        if (profileElements.name) profileElements.name.value = this.currentUser.username;
        if (profileElements.email) profileElements.email.value = this.currentUser.userEmail;
        if (profileElements.phone) profileElements.phone.value = this.currentUser.userPhone;
        if (profileElements.address) profileElements.address.value = this.currentUser.userAddress;

        // Update stat labels based on user role
        if (profileElements.statLabel1) {
            profileElements.statLabel1.textContent = this.isLandlord() ? 'Properties Listed' : 'Bookings Made';
        }
        if (profileElements.statLabel2) {
            profileElements.statLabel2.textContent = this.isLandlord() ? 'Total Bookings' : 'Reviews Written';
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Global auth functions
function login(email, password) {
    return authManager.login(email, password);
}

function register(userData) {
    return authManager.register(userData);
}

function logout() {
    authManager.logout();
}

function getCurrentUser() {
    return authManager.getCurrentUser();
}

function isAuthenticated() {
    return authManager.isAuthenticated();
}

function isLandlord() {
    return authManager.isLandlord();
}

function updateProfile(userData) {
    return authManager.updateProfile(userData);
}

function deleteAccount() {
    return authManager.deleteAccount();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        authManager,
        login,
        register,
        logout,
        getCurrentUser,
        isAuthenticated,
        isLandlord,
        updateProfile,
        deleteAccount
    };
}