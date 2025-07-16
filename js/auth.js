// Authentication Management
class AuthManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.initializeAuth();
    }

    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
        this.updateUI();
    }

    clearCurrentUser() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.updateUI();
    }

    initializeAuth() {
        this.updateUI();
    }

    updateUI() {
        const navAuth = document.querySelector('.nav-auth');
        const userDashboard = document.getElementById('userDashboard');
        
        if (this.currentUser) {
            // User is logged in
            navAuth.innerHTML = `
                <div class="user-menu">
                    <button class="btn-secondary" onclick="openDashboard()">
                        <i class="fas fa-user"></i>
                        ${this.currentUser.username}
                    </button>
                    <button class="btn-outline" onclick="authManager.logout()">
                        <i class="fas fa-sign-out-alt"></i>
                        Logout
                    </button>
                </div>
            `;
        } else {
            // User is not logged in
            navAuth.innerHTML = `
                <button class="btn-secondary" onclick="openModal('loginModal')">Login</button>
                <button class="btn-primary" onclick="openModal('registerModal')">Sign Up</button>
            `;
        }
    }

    async login(credentials) {
        try {
            showLoading('Logging in...');
            
            // Use API service for login
            const result = await apiService.login(credentials);
            
            if (result.success) {
                this.setCurrentUser(result.user);
                closeModal('loginModal');
                showSuccess('Login successful!');
                
                // Open dashboard after successful login
                setTimeout(() => {
                    openDashboard();
                }, 1000);
                
                return true;
            } else {
                showError(result.error || 'Login failed');
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Login failed. Please try again.');
            return false;
        } finally {
            hideLoading();
        }
    }

    async register(userData) {
        try {
            showLoading('Creating account...');
            
            // Use API service for registration
            const result = await apiService.register(userData);
            
            if (result.success) {
                this.setCurrentUser(result.user);
                closeModal('registerModal');
                showSuccess('Account created successfully!');
                
                // Open dashboard after successful registration
                setTimeout(() => {
                    openDashboard();
                }, 1000);
                
                return true;
            } else {
                showError(result.error || 'Registration failed');
                return false;
            }
        } catch (error) {
            console.error('Registration error:', error);
            showError('Registration failed. Please try again.');
            return false;
        } finally {
            hideLoading();
        }
    }

    logout() {
        this.clearCurrentUser();
        apiService.logout();
        closeDashboard();
        showSuccess('Logged out successfully!');
        
        // Redirect to home
        window.location.hash = '#home';
        document.querySelector('.nav-link.active').classList.remove('active');
        document.querySelector('a[href="#home"]').classList.add('active');
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

    requireAuth(callback) {
        if (this.isLoggedIn()) {
            callback();
        } else {
            showError('Please login to continue');
            openModal('loginModal');
        }
    }

    requireLandlord(callback) {
        if (this.isLandlord()) {
            callback();
        } else if (this.isLoggedIn()) {
            showError('This feature is only available for landlords');
        } else {
            showError('Please login as a landlord to continue');
            openModal('loginModal');
        }
    }

    requireTenant(callback) {
        if (this.isTenant()) {
            callback();
        } else if (this.isLoggedIn()) {
            showError('This feature is only available for tenants');
        } else {
            showError('Please login as a tenant to continue');
            openModal('loginModal');
        }
    }
}

// Form handlers
async function handleLogin(event) {
    event.preventDefault();
    
    const emailOrUsername = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!emailOrUsername || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    const credentials = {
        emailOrUsername,
        password
    };
    
    await authManager.login(credentials);
}

async function handleRegister(event) {
    event.preventDefault();
    
    const formData = {
        username: document.getElementById('registerName').value.trim(),
        userEmail: document.getElementById('registerEmail').value.trim(),
        userPhone: document.getElementById('registerPhone').value.trim(),
        userAddress: document.getElementById('registerAddress').value.trim(),
        userPassword: document.getElementById('registerPassword').value,
        userRole: document.getElementById('registerRole').value
    };
    
    // Validation
    if (!formData.username || !formData.userEmail || !formData.userPhone || 
        !formData.userAddress || !formData.userPassword || !formData.userRole) {
        showError('Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(formData.userEmail)) {
        showError('Please enter a valid email address');
        return;
    }
    
    if (!isValidPhone(formData.userPhone)) {
        showError('Please enter a valid phone number');
        return;
    }
    
    if (formData.userPassword.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }
    
    await authManager.register(formData);
}

// Validation helpers
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^(\+94|0)[0-9]{9}$/;
    return phoneRegex.test(phone);
}

// Initialize auth manager
const authManager = new AuthManager();

// Guest access functions
function browseAsGuest() {
    // Allow browsing properties without login
    window.location.hash = '#properties';
    document.querySelector('.nav-link.active').classList.remove('active');
    document.querySelector('a[href="#properties"]').classList.add('active');
}

function promptLogin(message = 'Please login to continue') {
    showError(message);
    openModal('loginModal');
}

// Social login placeholders (for future implementation)
function loginWithGoogle() {
    showError('Google login will be available soon');
}

function loginWithFacebook() {
    showError('Facebook login will be available soon');
}

// Password reset placeholder
function resetPassword() {
    const email = document.getElementById('loginEmail').value.trim();
    if (!email) {
        showError('Please enter your email address first');
        return;
    }
    
    showSuccess('Password reset instructions have been sent to your email');
    // In a real application, you would send a password reset email
}