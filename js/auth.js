// Authentication Management
class AuthManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.initializeAuth();
    }

    initializeAuth() {
        // Update UI based on authentication state
        this.updateAuthUI();
        
        // Set up event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Modal event listeners
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    this.closeModal(activeModal.id);
                }
            }
        });
    }

    // Get current user from localStorage
    getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    // Set current user
    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
        this.updateAuthUI();
    }

    // Clear current user
    clearCurrentUser() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.updateAuthUI();
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Check if user is landlord
    isLandlord() {
        return this.currentUser && this.currentUser.userRole === 'LANDLORD';
    }

    // Check if user is tenant
    isTenant() {
        return this.currentUser && this.currentUser.userRole === 'TENANT';
    }

    // Update UI based on authentication state
    updateAuthUI() {
        const navAuth = document.querySelector('.nav-auth');
        const userDashboard = document.getElementById('userDashboard');
        
        if (this.isLoggedIn()) {
            // Update navigation for logged-in user
            navAuth.innerHTML = `
                <button class="btn-secondary" onclick="authManager.openDashboard()">
                    <i class="fas fa-tachometer-alt"></i>
                    Dashboard
                </button>
                <button class="btn-primary" onclick="authManager.logout()">
                    <i class="fas fa-sign-out-alt"></i>
                    Logout
                </button>
            `;

            // Update dashboard user info
            if (userDashboard) {
                const userName = document.getElementById('userName');
                const userRole = document.getElementById('userRole');
                const userAvatar = document.getElementById('userAvatar');

                if (userName) userName.textContent = this.currentUser.username;
                if (userRole) userRole.textContent = this.currentUser.userRole;
                
                // Show/hide navigation based on role
                const landlordNav = document.getElementById('landlordNav');
                const tenantNav = document.getElementById('tenantNav');
                
                if (landlordNav) {
                    landlordNav.style.display = this.isLandlord() ? 'block' : 'none';
                }
                if (tenantNav) {
                    tenantNav.style.display = this.isTenant() ? 'block' : 'none';
                }
            }
        } else {
            // Update navigation for guest user
            navAuth.innerHTML = `
                <button class="btn-secondary" onclick="authManager.openModal('loginModal')">Login</button>
                <button class="btn-primary" onclick="authManager.openModal('registerModal')">Sign Up</button>
            `;
        }
    }

    // Open modal
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Close modal
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Handle login
    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        try {
            this.showLoading('Logging in...');
            
            // Try to find user by email or username
            let user;
            try {
                user = await apiService.getUserByEmail(email);
            } catch (error) {
                try {
                    user = await apiService.getUserByUsername(email);
                } catch (error2) {
                    throw new Error('User not found');
                }
            }

            // In a real application, you would verify the password here
            // For demo purposes, we'll accept any password
            
            this.setCurrentUser(user);
            this.closeModal('loginModal');
            this.showNotification(`Welcome back, ${user.username}!`, 'success');
            
            // Clear form
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
            
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Invalid credentials. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Handle registration
    async handleRegister(event) {
        event.preventDefault();
        
        const formData = {
            username: document.getElementById('registerUsername').value,
            userEmail: document.getElementById('registerEmail').value,
            userPhone: document.getElementById('registerPhone').value,
            userAddress: document.getElementById('registerAddress').value,
            userPassword: document.getElementById('registerPassword').value,
            userRole: document.getElementById('registerRole').value
        };

        // Validation
        if (!formData.username || !formData.userEmail || !formData.userPhone || 
            !formData.userAddress || !formData.userPassword || !formData.userRole) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!this.isValidEmail(formData.userEmail)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        if (!this.isValidPhone(formData.userPhone)) {
            this.showNotification('Please enter a valid phone number', 'error');
            return;
        }

        try {
            this.showLoading('Creating account...');
            
            // Check if user already exists
            try {
                await apiService.getUserByEmail(formData.userEmail);
                throw new Error('User with this email already exists');
            } catch (error) {
                if (error.message !== 'User not found') {
                    throw error;
                }
            }

            try {
                await apiService.getUserByUsername(formData.username);
                throw new Error('Username already taken');
            } catch (error) {
                if (error.message !== 'User not found') {
                    throw error;
                }
            }

            // Create new user
            const newUser = await apiService.createUser(formData);
            
            this.setCurrentUser(newUser);
            this.closeModal('registerModal');
            this.showNotification(`Welcome to Moove, ${newUser.username}!`, 'success');
            
            // Clear form
            this.clearRegisterForm();
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showNotification(error.message || 'Registration failed. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Clear registration form
    clearRegisterForm() {
        document.getElementById('registerUsername').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPhone').value = '';
        document.getElementById('registerAddress').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('registerRole').value = '';
    }

    // Handle logout
    logout() {
        this.clearCurrentUser();
        this.closeDashboard();
        this.showNotification('You have been logged out successfully', 'success');
        
        // Redirect to home page
        window.location.hash = '#home';
    }

    // Open dashboard
    openDashboard() {
        if (!this.isLoggedIn()) {
            this.openModal('loginModal');
            return;
        }

        const dashboard = document.getElementById('userDashboard');
        if (dashboard) {
            dashboard.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Load default dashboard section
            this.showDashboardSection('overview');
        }
    }

    // Close dashboard
    closeDashboard() {
        const dashboard = document.getElementById('userDashboard');
        if (dashboard) {
            dashboard.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Show dashboard section
    showDashboardSection(sectionName) {
        // Update active navigation
        const navItems = document.querySelectorAll('.dashboard-nav .nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        
        const activeItem = document.querySelector(`[onclick="showDashboardSection('${sectionName}')"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        // Update dashboard title
        const dashboardTitle = document.getElementById('dashboardTitle');
        const titles = {
            overview: 'Dashboard Overview',
            profile: 'My Profile',
            properties: 'My Properties',
            'add-property': 'Add New Property',
            bookings: 'Booking Requests',
            'my-bookings': 'My Bookings',
            favorites: 'Favorite Properties',
            messages: 'Messages'
        };
        
        if (dashboardTitle) {
            dashboardTitle.textContent = titles[sectionName] || 'Dashboard';
        }

        // Load section content
        this.loadDashboardSection(sectionName);
    }

    // Load dashboard section content
    async loadDashboardSection(sectionName) {
        const sectionsContainer = document.getElementById('dashboardSections');
        if (!sectionsContainer) return;

        try {
            let content = '';
            
            switch (sectionName) {
                case 'overview':
                    content = await this.getOverviewContent();
                    break;
                case 'profile':
                    content = await this.getProfileContent();
                    break;
                case 'properties':
                    content = await this.getPropertiesContent();
                    break;
                case 'add-property':
                    content = await this.getAddPropertyContent();
                    break;
                case 'bookings':
                    content = await this.getBookingsContent();
                    break;
                case 'my-bookings':
                    content = await this.getMyBookingsContent();
                    break;
                case 'favorites':
                    content = await this.getFavoritesContent();
                    break;
                case 'messages':
                    content = await this.getMessagesContent();
                    break;
                default:
                    content = '<p>Section not found</p>';
            }
            
            sectionsContainer.innerHTML = content;
            
            // Initialize section-specific functionality
            this.initializeSectionFunctionality(sectionName);
            
        } catch (error) {
            console.error('Error loading dashboard section:', error);
            sectionsContainer.innerHTML = '<p>Error loading content. Please try again.</p>';
        }
    }

    // Get overview content
    async getOverviewContent() {
        const stats = await this.getDashboardStats();
        
        return `
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-home"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${stats.properties}</h3>
                        <p>Properties</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-calendar"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${stats.bookings}</h3>
                        <p>Bookings</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${stats.messages}</h3>
                        <p>Messages</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${stats.reviews}</h3>
                        <p>Reviews</p>
                    </div>
                </div>
            </div>
            
            <div class="recent-activity">
                <h3>Recent Activity</h3>
                <div class="activity-list">
                    <div class="activity-item">
                        <i class="fas fa-plus-circle"></i>
                        <div class="activity-content">
                            <p>New property listing created</p>
                            <span class="activity-time">2 hours ago</span>
                        </div>
                    </div>
                    <div class="activity-item">
                        <i class="fas fa-message"></i>
                        <div class="activity-content">
                            <p>New message received</p>
                            <span class="activity-time">5 hours ago</span>
                        </div>
                    </div>
                    <div class="activity-item">
                        <i class="fas fa-calendar-check"></i>
                        <div class="activity-content">
                            <p>Booking request approved</p>
                            <span class="activity-time">1 day ago</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Get profile content
    async getProfileContent() {
        const user = this.currentUser;
        
        return `
            <div class="profile-section">
                <form class="profile-form" onsubmit="authManager.updateProfile(event)">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Username</label>
                            <input type="text" id="profileUsername" value="${user.username}" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="profileEmail" value="${user.userEmail}" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Phone</label>
                            <input type="tel" id="profilePhone" value="${user.userPhone}" required>
                        </div>
                        <div class="form-group">
                            <label>Role</label>
                            <input type="text" value="${user.userRole}" disabled>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Address</label>
                        <textarea id="profileAddress" rows="3" required>${user.userAddress}</textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Update Profile</button>
                        <button type="button" class="btn-secondary" onclick="authManager.changePassword()">Change Password</button>
                    </div>
                </form>
            </div>
        `;
    }

    // Get dashboard stats
    async getDashboardStats() {
        try {
            const properties = this.isLandlord() ? 
                (await apiService.getAllProperties()).filter(p => p.user.userId === this.currentUser.userId) : 
                [];
            const bookings = await apiService.getAllBookings();
            const messages = await apiService.getConversation(this.currentUser.userId, 'any');
            
            return {
                properties: properties.length,
                bookings: bookings.length,
                messages: messages.length,
                reviews: 0 // Placeholder
            };
        } catch (error) {
            return { properties: 0, bookings: 0, messages: 0, reviews: 0 };
        }
    }

    // Validation helpers
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^\+94[0-9]{9}$/;
        return phoneRegex.test(phone);
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="notification-icon ${icons[type]}"></i>
                <div class="notification-text">
                    <h4>${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                    <p>${message}</p>
                </div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Loading system
    showLoading(message = 'Loading...') {
        const loading = document.createElement('div');
        loading.id = 'loadingOverlay';
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loading);
    }

    hideLoading() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) {
            loading.remove();
        }
    }

    // Initialize section functionality
    initializeSectionFunctionality(sectionName) {
        switch (sectionName) {
            case 'add-property':
                this.initializeAddPropertyForm();
                break;
            case 'properties':
                this.initializePropertiesManagement();
                break;
            // Add more cases as needed
        }
    }

    // Placeholder methods for dashboard sections
    async getPropertiesContent() {
        return '<p>Properties content will be loaded here</p>';
    }

    async getAddPropertyContent() {
        return '<p>Add property form will be loaded here</p>';
    }

    async getBookingsContent() {
        return '<p>Bookings content will be loaded here</p>';
    }

    async getMyBookingsContent() {
        return '<p>My bookings content will be loaded here</p>';
    }

    async getFavoritesContent() {
        return '<p>Favorites content will be loaded here</p>';
    }

    async getMessagesContent() {
        return '<p>Messages content will be loaded here</p>';
    }

    initializeAddPropertyForm() {
        // Placeholder for add property form initialization
    }

    initializePropertiesManagement() {
        // Placeholder for properties management initialization
    }
}

// Initialize authentication manager
const authManager = new AuthManager();

// Global functions for HTML onclick handlers
function openModal(modalId) {
    authManager.openModal(modalId);
}

function closeModal(modalId) {
    authManager.closeModal(modalId);
}

function handleLogin(event) {
    authManager.handleLogin(event);
}

function handleRegister(event) {
    authManager.handleRegister(event);
}

function logout() {
    authManager.logout();
}

function showDashboardSection(sectionName) {
    authManager.showDashboardSection(sectionName);
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.authManager = authManager;
}