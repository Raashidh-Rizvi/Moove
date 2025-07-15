// UI Management and Utilities
class UIManager {
    constructor() {
        this.currentSection = 'home';
        this.modals = new Map();
        this.toasts = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormHandlers();
        this.setupModalHandlers();
    }

    // Setup global event listeners
    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Handle escape key for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    // Setup form handlers
    setupFormHandlers() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
            this.setupRoleSelection();
        }

        // Search form
        const searchForm = document.getElementById('search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', this.handleSearch.bind(this));
        }

        // Add property form
        const addPropertyForm = document.getElementById('add-property-form');
        if (addPropertyForm) {
            addPropertyForm.addEventListener('submit', this.handleAddProperty.bind(this));
        }

        // Profile form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', this.handleProfileUpdate.bind(this));
        }

        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
        }
    }

    // Setup modal handlers
    setupModalHandlers() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            this.modals.set(modal.id, modal);
        });
    }

    // Setup role selection for registration
    setupRoleSelection() {
        const roleOptions = document.querySelectorAll('.role-option');
        roleOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                roleOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }

    // Toggle mobile menu
    toggleMobileMenu() {
        const nav = document.getElementById('nav');
        const toggle = document.getElementById('mobile-menu-toggle');
        
        if (nav && toggle) {
            const isOpen = nav.classList.contains('mobile-open');
            
            if (isOpen) {
                nav.classList.remove('mobile-open');
                toggle.innerHTML = '<i class="fas fa-bars"></i>';
            } else {
                nav.classList.add('mobile-open');
                toggle.innerHTML = '<i class="fas fa-times"></i>';
            }
        }
    }

    // Handle window resize
    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth >= BREAKPOINTS.LG) {
            const nav = document.getElementById('nav');
            const toggle = document.getElementById('mobile-menu-toggle');
            
            if (nav) nav.classList.remove('mobile-open');
            if (toggle) toggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }

    // Show section
    showSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => section.classList.remove('active'));

        // Show target section
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }

        // Close mobile menu
        const nav = document.getElementById('nav');
        const toggle = document.getElementById('mobile-menu-toggle');
        if (nav) nav.classList.remove('mobile-open');
        if (toggle) toggle.innerHTML = '<i class="fas fa-bars"></i>';

        // Load section-specific data
        this.loadSectionData(sectionId);
    }

    // Load section-specific data
    loadSectionData(sectionId) {
        switch (sectionId) {
            case 'home':
                if (propertyManager.properties.length === 0) {
                    loadProperties();
                }
                break;
            case 'profile':
                authManager.updateProfileSection();
                break;
        }
    }

    // Show modal
    showModal(modalId) {
        const modal = this.modals.get(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Close modal
    closeModal(modalId) {
        const modal = this.modals.get(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Close all modals
    closeAllModals() {
        this.modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    // Show loading
    showLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'flex';
        }
    }

    // Hide loading
    hideLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    }

    // Show toast notification
    showToast(message, type = TOAST_TYPES.INFO, duration = APP_CONFIG.TOAST_DURATION) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        const container = document.getElementById('toast-container');
        if (container) {
            container.appendChild(toast);
            this.toasts.push(toast);

            // Auto remove after duration
            setTimeout(() => {
                this.removeToast(toast);
            }, duration);

            // Click to remove
            toast.addEventListener('click', () => {
                this.removeToast(toast);
            });
        }
    }

    // Get toast icon based on type
    getToastIcon(type) {
        switch (type) {
            case TOAST_TYPES.SUCCESS:
                return 'check-circle';
            case TOAST_TYPES.ERROR:
                return 'exclamation-circle';
            case TOAST_TYPES.WARNING:
                return 'exclamation-triangle';
            default:
                return 'info-circle';
        }
    }

    // Remove toast
    removeToast(toast) {
        if (toast && toast.parentNode) {
            toast.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
                const index = this.toasts.indexOf(toast);
                if (index > -1) {
                    this.toasts.splice(index, 1);
                }
            }, 300);
        }
    }

    // Toggle password visibility
    togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const button = input?.nextElementSibling;
        
        if (input && button) {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            button.innerHTML = `<i class="fas fa-${isPassword ? 'eye-slash' : 'eye'}"></i>`;
        }
    }

    // Form handlers
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            await login(email, password);
            this.showSection('home');
        } catch (error) {
            this.showToast(error.message, TOAST_TYPES.ERROR);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const formData = {
            username: document.getElementById('register-name').value,
            userEmail: document.getElementById('register-email').value,
            userPhone: document.getElementById('register-phone').value,
            userAddress: document.getElementById('register-address').value,
            userPassword: document.getElementById('register-password').value,
            userRole: document.querySelector('.role-option.active')?.dataset.role || USER_ROLES.CLIENT
        };

        const confirmPassword = document.getElementById('register-confirm-password').value;

        if (formData.userPassword !== confirmPassword) {
            this.showToast('Passwords do not match', TOAST_TYPES.ERROR);
            return;
        }

        try {
            await register(formData);
            this.showSection('home');
        } catch (error) {
            this.showToast(error.message, TOAST_TYPES.ERROR);
        }
    }

    async handleSearch(e) {
        e.preventDefault();
        
        const filters = {
            location: document.getElementById('search-location').value,
            propertyType: document.getElementById('search-type').value,
            minPrice: document.getElementById('search-min-price').value,
            maxPrice: document.getElementById('search-max-price').value,
            bedrooms: document.getElementById('search-bedrooms').value
        };

        await searchProperties(filters);
    }

    async handleAddProperty(e) {
        e.preventDefault();
        
        const propertyData = {
            propertyName: document.getElementById('property-name').value,
            propertyDescription: document.getElementById('property-description').value,
            propertyPrice: parseFloat(document.getElementById('property-price').value),
            propertyType: document.getElementById('property-type').value,
            propertySize: parseFloat(document.getElementById('property-size').value),
            bedroomsAvailable: parseInt(document.getElementById('property-bedrooms').value),
            bathroomsAvailable: parseInt(document.getElementById('property-bathrooms').value),
            propertyImageUrl: document.getElementById('property-image').value || ''
        };

        try {
            await createProperty(propertyData);
            e.target.reset();
        } catch (error) {
            this.showToast(error.message, TOAST_TYPES.ERROR);
        }
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        
        const userData = {
            username: document.getElementById('profile-name').value,
            userEmail: document.getElementById('profile-email').value,
            userPhone: document.getElementById('profile-phone').value,
            userAddress: document.getElementById('profile-address').value
        };

        try {
            await updateProfile(userData);
            this.toggleEditProfile();
        } catch (error) {
            this.showToast(error.message, TOAST_TYPES.ERROR);
        }
    }

    async handleContactSubmit(e) {
        e.preventDefault();
        
        const propertyId = e.target.dataset.propertyId;
        const message = document.getElementById('contact-message').value;
        
        if (!propertyId || !message.trim()) {
            this.showToast('Please enter a message', TOAST_TYPES.ERROR);
            return;
        }

        try {
            // In a real app, this would send a message through the API
            this.showToast(SUCCESS_MESSAGES.MESSAGE_SENT, TOAST_TYPES.SUCCESS);
            this.closeModal('contact-modal');
            document.getElementById('contact-message').value = '';
        } catch (error) {
            this.showToast(error.message, TOAST_TYPES.ERROR);
        }
    }

    // Toggle profile edit mode
    toggleEditProfile() {
        const form = document.getElementById('profile-form');
        const inputs = form.querySelectorAll('input');
        const editBtn = document.getElementById('edit-profile-btn');
        const saveBtn = document.getElementById('save-profile-btn');
        const cancelBtn = document.getElementById('cancel-edit-btn');

        const isEditing = !inputs[0].readOnly;

        inputs.forEach(input => {
            input.readOnly = isEditing;
        });

        if (isEditing) {
            // Switch to view mode
            editBtn.style.display = 'inline-flex';
            saveBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
        } else {
            // Switch to edit mode
            editBtn.style.display = 'none';
            saveBtn.style.display = 'inline-flex';
            cancelBtn.style.display = 'inline-flex';
        }
    }

    // Cancel profile edit
    cancelEditProfile() {
        authManager.updateProfileSection();
        this.toggleEditProfile();
    }
}

// Initialize UI manager
const uiManager = new UIManager();

// Global UI functions
function showSection(sectionId) {
    uiManager.showSection(sectionId);
}

function showModal(modalId) {
    uiManager.showModal(modalId);
}

function closeModal(modalId) {
    uiManager.closeModal(modalId);
}

function showLoading(elementId) {
    uiManager.showLoading(elementId);
}

function hideLoading(elementId) {
    uiManager.hideLoading(elementId);
}

function showToast(message, type, duration) {
    uiManager.showToast(message, type, duration);
}

function togglePassword(inputId) {
    uiManager.togglePassword(inputId);
}

function toggleEditProfile() {
    uiManager.toggleEditProfile();
}

function cancelEditProfile() {
    uiManager.cancelEditProfile();
}

function saveProfile() {
    const form = document.getElementById('profile-form');
    if (form) {
        form.dispatchEvent(new Event('submit'));
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        uiManager,
        showSection,
        showModal,
        closeModal,
        showLoading,
        hideLoading,
        showToast,
        togglePassword,
        toggleEditProfile,
        cancelEditProfile,
        saveProfile
    };
}