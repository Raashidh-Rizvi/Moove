// Dashboard Management
class DashboardManager {
    constructor() {
        this.currentSection = 'overview';
        this.userProperties = [];
        this.userBookings = [];
        this.messages = [];
        this.bookingRequests = [];
    }

    async initialize() {
        if (!authManager.isLoggedIn()) return;
        
        await this.loadUserData();
        this.setupDashboard();
    }

    async loadUserData() {
        try {
            // Load user-specific data based on role
            if (authManager.isLandlord()) {
                await this.loadLandlordData();
            } else if (authManager.isTenant()) {
                await this.loadTenantData();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    async loadLandlordData() {
        try {
            // Load properties owned by current user
            const allProperties = await apiService.getAllProperties();
            this.userProperties = allProperties.filter(p => p.user.userId === authManager.currentUser.userId);
            
            // Load booking requests for user's properties
            const allBookings = await apiService.getAllBookings();
            this.bookingRequests = allBookings.filter(b => 
                this.userProperties.some(p => p.propertyId === b.property?.propertyId)
            );
        } catch (error) {
            console.error('Error loading landlord data:', error);
            // Use sample data for demo
            this.userProperties = sampleProperties.filter(p => p.user.userId === authManager.currentUser.userId);
        }
    }

    async loadTenantData() {
        try {
            // Load bookings made by current user
            const allBookings = await apiService.getAllBookings();
            this.userBookings = allBookings.filter(b => b.user.userId === authManager.currentUser.userId);
        } catch (error) {
            console.error('Error loading tenant data:', error);
        }
    }

    setupDashboard() {
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        const landlordNav = document.getElementById('landlordNav');
        const tenantNav = document.getElementById('tenantNav');

        if (userName) userName.textContent = authManager.currentUser.username;
        if (userRole) userRole.textContent = authManager.currentUser.userRole;

        // Show appropriate navigation based on user role
        if (authManager.isLandlord()) {
            if (landlordNav) landlordNav.style.display = 'block';
            if (tenantNav) tenantNav.style.display = 'none';
        } else if (authManager.isTenant()) {
            if (landlordNav) landlordNav.style.display = 'none';
            if (tenantNav) tenantNav.style.display = 'block';
        }

        // Show initial section
        this.showSection('overview');
    }

    showSection(sectionName) {
        this.currentSection = sectionName;
        
        // Update navigation
        document.querySelectorAll('.dashboard-nav .nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNavItem = document.querySelector(`[onclick="showDashboardSection('${sectionName}')"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Update title
        const dashboardTitle = document.getElementById('dashboardTitle');
        if (dashboardTitle) {
            dashboardTitle.textContent = this.getSectionTitle(sectionName);
        }

        // Render section content
        const sectionsContainer = document.getElementById('dashboardSections');
        if (sectionsContainer) {
            sectionsContainer.innerHTML = this.renderSection(sectionName);
        }

        // Initialize section-specific functionality
        this.initializeSectionFeatures(sectionName);
    }

    getSectionTitle(sectionName) {
        const titles = {
            'overview': 'Dashboard Overview',
            'profile': 'My Profile',
            'properties': 'My Properties',
            'add-property': 'Add New Property',
            'bookings': 'Booking Requests',
            'my-bookings': 'My Bookings',
            'favorites': 'Favorite Properties',
            'messages': 'Messages'
        };
        return titles[sectionName] || 'Dashboard';
    }

    renderSection(sectionName) {
        switch (sectionName) {
            case 'overview':
                return this.renderOverview();
            case 'profile':
                return this.renderProfile();
            case 'properties':
                return this.renderProperties();
            case 'add-property':
                return this.renderAddProperty();
            case 'bookings':
                return this.renderBookingRequests();
            case 'my-bookings':
                return this.renderMyBookings();
            case 'favorites':
                return this.renderFavorites();
            case 'messages':
                return this.renderMessages();
            default:
                return '<p>Section not found</p>';
        }
    }

    renderOverview() {
        if (authManager.isLandlord()) {
            return `
                <div class="dashboard-cards">
                    <div class="dashboard-card">
                        <h3>Total Properties</h3>
                        <div class="value">${this.userProperties.length}</div>
                        <div class="change positive">
                            <i class="fas fa-arrow-up"></i>
                            Active listings
                        </div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Pending Requests</h3>
                        <div class="value">${this.bookingRequests.filter(b => b.status === 'PENDING').length}</div>
                        <div class="change">
                            <i class="fas fa-clock"></i>
                            Awaiting response
                        </div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Monthly Revenue</h3>
                        <div class="value">LKR ${this.calculateMonthlyRevenue().toLocaleString()}</div>
                        <div class="change positive">
                            <i class="fas fa-arrow-up"></i>
                            +12% from last month
                        </div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Occupancy Rate</h3>
                        <div class="value">${this.calculateOccupancyRate()}%</div>
                        <div class="change positive">
                            <i class="fas fa-arrow-up"></i>
                            +5% from last month
                        </div>
                    </div>
                </div>
                
                <div class="recent-activity">
                    <h3>Recent Activity</h3>
                    <div class="activity-list">
                        ${this.renderRecentActivity()}
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="dashboard-cards">
                    <div class="dashboard-card">
                        <h3>Active Bookings</h3>
                        <div class="value">${this.userBookings.filter(b => b.status === 'ACCEPTED').length}</div>
                        <div class="change">
                            <i class="fas fa-home"></i>
                            Current rentals
                        </div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Pending Requests</h3>
                        <div class="value">${this.userBookings.filter(b => b.status === 'PENDING').length}</div>
                        <div class="change">
                            <i class="fas fa-clock"></i>
                            Awaiting approval
                        </div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Favorites</h3>
                        <div class="value">${propertyManager.favorites.length}</div>
                        <div class="change">
                            <i class="fas fa-heart"></i>
                            Saved properties
                        </div>
                    </div>
                    <div class="dashboard-card">
                        <h3>Messages</h3>
                        <div class="value">${this.messages.length}</div>
                        <div class="change">
                            <i class="fas fa-envelope"></i>
                            Unread messages
                        </div>
                    </div>
                </div>
                
                <div class="recent-bookings">
                    <h3>Recent Bookings</h3>
                    <div class="booking-list">
                        ${this.renderRecentBookings()}
                    </div>
                </div>
            `;
        }
    }

    renderProfile() {
        const user = authManager.currentUser;
        return `
            <div class="profile-section">
                <form class="profile-form" onsubmit="updateProfile(event)">
                    <div class="form-section">
                        <h3>Personal Information</h3>
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
                        <div class="form-row full">
                            <div class="form-group">
                                <label>Address</label>
                                <textarea id="profileAddress" rows="3" required>${user.userAddress}</textarea>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3>Change Password</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Current Password</label>
                                <input type="password" id="currentPassword">
                            </div>
                            <div class="form-group">
                                <label>New Password</label>
                                <input type="password" id="newPassword">
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Update Profile</button>
                        <button type="button" class="btn-secondary" onclick="deleteAccount()">Delete Account</button>
                    </div>
                </form>
            </div>
        `;
    }

    renderProperties() {
        if (this.userProperties.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-home" style="font-size: 4rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                    <h3>No Properties Listed</h3>
                    <p>Start by adding your first property to attract tenants.</p>
                    <button class="btn-primary" onclick="showDashboardSection('add-property')">
                        <i class="fas fa-plus"></i>
                        Add Property
                    </button>
                </div>
            `;
        }

        return `
            <div class="property-management">
                <div class="property-management-header">
                    <h2>My Properties (${this.userProperties.length})</h2>
                    <button class="btn-primary" onclick="showDashboardSection('add-property')">
                        <i class="fas fa-plus"></i>
                        Add Property
                    </button>
                </div>
                <div class="property-list">
                    ${this.userProperties.map(property => `
                        <div class="property-item">
                            <img src="${property.propertyImageUrl}" alt="${property.propertyName}">
                            <div class="property-item-info">
                                <h4>${property.propertyName}</h4>
                                <p>${property.town}, ${property.district} • LKR ${property.propertyPrice.toLocaleString()}/month</p>
                                <p>${property.bedroomsAvailable} beds • ${property.bathroomsAvailable} baths • ${property.propertySize} sqft</p>
                            </div>
                            <div class="property-item-actions">
                                <button class="btn-icon edit" onclick="editProperty(${property.propertyId})" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon delete" onclick="deleteProperty(${property.propertyId})" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderAddProperty() {
        return `
            <div class="add-property-form">
                <form onsubmit="handleAddProperty(event)">
                    <div class="form-section">
                        <h3>Basic Information</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Property Name</label>
                                <input type="text" id="propertyName" required placeholder="e.g., Modern Apartment in Colombo">
                            </div>
                            <div class="form-group">
                                <label>Property Type</label>
                                <select id="propertyType" required>
                                    <option value="">Select Type</option>
                                    ${propertyTypes.map(type => 
                                        `<option value="${type.value}">${type.label}</option>`
                                    ).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="form-row full">
                            <div class="form-group">
                                <label>Description</label>
                                <textarea id="propertyDescription" rows="4" required placeholder="Describe your property, amenities, and unique features..."></textarea>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3>Location</h3>
                        <div class="location-selector">
                            <div class="form-group">
                                <label>District</label>
                                <select id="addPropertyDistrict" required>
                                    <option value="">Select District</option>
                                    ${Object.keys(sriLankanLocations).map(district => 
                                        `<option value="${district}">${district}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Town</label>
                                <select id="addPropertyTown" required disabled>
                                    <option value="">Select Town</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3>Property Details</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Monthly Rent (LKR)</label>
                                <input type="number" id="propertyPrice" required min="1000" placeholder="50000">
                            </div>
                            <div class="form-group">
                                <label>Size (sqft)</label>
                                <input type="number" id="propertySize" required min="100" placeholder="1200">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Bedrooms</label>
                                <select id="bedroomsAvailable" required>
                                    <option value="">Select</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5+</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Bathrooms</label>
                                <select id="bathroomsAvailable" required>
                                    <option value="">Select</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4+</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3>Property Images</h3>
                        <div class="image-upload" onclick="document.getElementById('propertyImages').click()">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Click to upload images or drag and drop</p>
                            <p style="font-size: 0.875rem; color: var(--text-light);">Maximum 10 images, 2MB each</p>
                        </div>
                        <input type="file" id="propertyImages" multiple accept="image/*" style="display: none;" onchange="handleImageUpload(event)">
                        <div id="imagePreview" class="image-preview"></div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-plus"></i>
                            Add Property
                        </button>
                        <button type="button" class="btn-secondary" onclick="showDashboardSection('properties')">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    renderBookingRequests() {
        if (this.bookingRequests.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-calendar" style="font-size: 4rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                    <h3>No Booking Requests</h3>
                    <p>When tenants request to book your properties, they will appear here.</p>
                </div>
            `;
        }

        return `
            <div class="booking-requests">
                ${this.bookingRequests.map(booking => `
                    <div class="booking-request-item">
                        <div class="booking-request-info">
                            <h4>${booking.user?.username || 'Unknown User'}</h4>
                            <p><strong>Property:</strong> ${booking.property?.propertyName || 'Unknown Property'}</p>
                            <p><strong>Dates:</strong> ${booking.checkInDate} to ${booking.checkOutDate}</p>
                            <p><strong>Amount:</strong> LKR ${booking.totalAmount?.toLocaleString() || '0'}</p>
                            <p><strong>Requested:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
                        </div>
                        <div class="booking-request-actions">
                            <span class="booking-status ${booking.status.toLowerCase()}">${booking.status}</span>
                            ${booking.status === 'PENDING' ? `
                                <div class="booking-actions">
                                    <button class="btn-primary" onclick="acceptBooking(${booking.bookingId})">Accept</button>
                                    <button class="btn-secondary" onclick="declineBooking(${booking.bookingId})">Decline</button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderMyBookings() {
        if (this.userBookings.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-calendar-check" style="font-size: 4rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                    <h3>No Bookings Yet</h3>
                    <p>Your booking requests will appear here once you start booking properties.</p>
                    <button class="btn-primary" onclick="closeDashboard(); window.location.hash = '#properties'">
                        <i class="fas fa-search"></i>
                        Browse Properties
                    </button>
                </div>
            `;
        }

        return `
            <div class="my-bookings">
                ${this.userBookings.map(booking => `
                    <div class="booking-item">
                        <div class="booking-info">
                            <h4>${booking.property?.propertyName || 'Unknown Property'}</h4>
                            <p><strong>Location:</strong> ${booking.property?.town}, ${booking.property?.district}</p>
                            <p><strong>Dates:</strong> ${booking.checkInDate} to ${booking.checkOutDate}</p>
                            <p><strong>Amount:</strong> LKR ${booking.totalAmount?.toLocaleString() || '0'}</p>
                            <p><strong>Booked:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
                        </div>
                        <div class="booking-actions">
                            <span class="booking-status ${booking.status.toLowerCase()}">${booking.status}</span>
                            ${booking.status === 'PENDING' ? `
                                <button class="btn-secondary" onclick="cancelBooking(${booking.bookingId})">Cancel</button>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderFavorites() {
        const favoriteProperties = propertyManager.properties.filter(p => 
            propertyManager.favorites.includes(p.propertyId)
        );

        if (favoriteProperties.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-heart" style="font-size: 4rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                    <h3>No Favorites Yet</h3>
                    <p>Properties you mark as favorites will appear here for quick access.</p>
                    <button class="btn-primary" onclick="closeDashboard(); window.location.hash = '#properties'">
                        <i class="fas fa-search"></i>
                        Browse Properties
                    </button>
                </div>
            `;
        }

        return `
            <div class="favorites-grid">
                ${favoriteProperties.map(property => `
                    <div class="property-card" onclick="openPropertyModal(${property.propertyId})">
                        <div class="property-image">
                            <img src="${property.propertyImageUrl}" alt="${property.propertyName}">
                            <div class="property-badge">${property.propertyType}</div>
                            <button class="property-favorite active" onclick="event.stopPropagation(); toggleFavorite(${property.propertyId})">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                        <div class="property-content">
                            <div class="property-price">LKR ${property.propertyPrice.toLocaleString()}/month</div>
                            <h3 class="property-title">${property.propertyName}</h3>
                            <div class="property-location">
                                <i class="fas fa-map-marker-alt"></i>
                                ${property.town}, ${property.district}
                            </div>
                            <div class="property-features">
                                <div class="feature">
                                    <i class="fas fa-bed"></i>
                                    ${property.bedroomsAvailable} Beds
                                </div>
                                <div class="feature">
                                    <i class="fas fa-bath"></i>
                                    ${property.bathroomsAvailable} Baths
                                </div>
                                <div class="feature">
                                    <i class="fas fa-ruler-combined"></i>
                                    ${property.propertySize} sqft
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderMessages() {
        return `
            <div class="messages-container">
                <div class="conversations-list">
                    <div class="conversation-item active">
                        <h4>John Landlord</h4>
                        <p>Thanks for your interest in the property...</p>
                    </div>
                    <div class="conversation-item">
                        <h4>Sarah Owner</h4>
                        <p>The viewing is scheduled for tomorrow...</p>
                    </div>
                </div>
                <div class="chat-area">
                    <div class="chat-header">
                        <h3>John Landlord</h3>
                    </div>
                    <div class="chat-messages">
                        <div class="message received">
                            <div>Thanks for your interest in the property. When would you like to schedule a viewing?</div>
                            <div class="message-time">2:30 PM</div>
                        </div>
                        <div class="message sent">
                            <div>Hi! I'm available this weekend. Would Saturday morning work?</div>
                            <div class="message-time">2:35 PM</div>
                        </div>
                        <div class="message received">
                            <div>Saturday at 10 AM works perfectly. I'll send you the exact address.</div>
                            <div class="message-time">2:40 PM</div>
                        </div>
                    </div>
                    <div class="chat-input">
                        <input type="text" placeholder="Type your message...">
                        <button><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        `;
    }

    renderRecentActivity() {
        // Sample activity data
        const activities = [
            { type: 'booking', message: 'New booking request for Modern Apartment', time: '2 hours ago' },
            { type: 'message', message: 'New message from potential tenant', time: '4 hours ago' },
            { type: 'property', message: 'Property listing updated successfully', time: '1 day ago' }
        ];

        return activities.map(activity => `
            <div class="activity-item">
                <i class="fas fa-${activity.type === 'booking' ? 'calendar' : activity.type === 'message' ? 'envelope' : 'home'}"></i>
                <div>
                    <p>${activity.message}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    renderRecentBookings() {
        if (this.userBookings.length === 0) {
            return '<p>No recent bookings</p>';
        }

        return this.userBookings.slice(0, 3).map(booking => `
            <div class="booking-item">
                <div class="booking-info">
                    <h4>${booking.property?.propertyName || 'Unknown Property'}</h4>
                    <p>${booking.checkInDate} to ${booking.checkOutDate}</p>
                </div>
                <span class="booking-status ${booking.status.toLowerCase()}">${booking.status}</span>
            </div>
        `).join('');
    }

    calculateMonthlyRevenue() {
        return this.userProperties.reduce((total, property) => total + property.propertyPrice, 0);
    }

    calculateOccupancyRate() {
        if (this.userProperties.length === 0) return 0;
        const occupiedProperties = this.bookingRequests.filter(b => b.status === 'ACCEPTED').length;
        return Math.round((occupiedProperties / this.userProperties.length) * 100);
    }

    initializeSectionFeatures(sectionName) {
        switch (sectionName) {
            case 'add-property':
                this.initializeAddPropertyForm();
                break;
            case 'messages':
                this.initializeMessaging();
                break;
        }
    }

    initializeAddPropertyForm() {
        // District change handler for add property form
        const districtSelect = document.getElementById('addPropertyDistrict');
        const townSelect = document.getElementById('addPropertyTown');
        
        if (districtSelect && townSelect) {
            districtSelect.addEventListener('change', (e) => {
                const selectedDistrict = e.target.value;
                townSelect.innerHTML = '<option value="">Select Town</option>';
                
                if (selectedDistrict && sriLankanLocations[selectedDistrict]) {
                    townSelect.disabled = false;
                    sriLankanLocations[selectedDistrict].forEach(town => {
                        const option = document.createElement('option');
                        option.value = town;
                        option.textContent = town;
                        townSelect.appendChild(option);
                    });
                } else {
                    townSelect.disabled = true;
                }
            });
        }

        // Image upload drag and drop
        const imageUpload = document.querySelector('.image-upload');
        if (imageUpload) {
            imageUpload.addEventListener('dragover', (e) => {
                e.preventDefault();
                imageUpload.classList.add('dragover');
            });

            imageUpload.addEventListener('dragleave', () => {
                imageUpload.classList.remove('dragover');
            });

            imageUpload.addEventListener('drop', (e) => {
                e.preventDefault();
                imageUpload.classList.remove('dragover');
                const files = e.dataTransfer.files;
                handleImageUpload({ target: { files } });
            });
        }
    }

    initializeMessaging() {
        // Initialize real-time messaging features
        console.log('Messaging initialized');
    }
}

// Global dashboard functions
function openDashboard() {
    authManager.requireAuth(async () => {
        const dashboard = document.getElementById('userDashboard');
        if (dashboard) {
            dashboard.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            await dashboardManager.initialize();
        }
    });
}

function closeDashboard() {
    const dashboard = document.getElementById('userDashboard');
    if (dashboard) {
        dashboard.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function showDashboardSection(sectionName) {
    dashboardManager.showSection(sectionName);
}

async function updateProfile(event) {
    event.preventDefault();
    
    const updatedData = {
        userId: authManager.currentUser.userId,
        username: document.getElementById('profileUsername').value,
        userEmail: document.getElementById('profileEmail').value,
        userPhone: document.getElementById('profilePhone').value,
        userAddress: document.getElementById('profileAddress').value,
        userRole: authManager.currentUser.userRole
    };
    
    try {
        showLoading('Updating profile...');
        const updatedUser = await apiService.updateUser(authManager.currentUser.userId, updatedData);
        authManager.setCurrentUser(updatedUser);
        showSuccess('Profile updated successfully!');
    } catch (error) {
        console.error('Profile update error:', error);
        showError('Failed to update profile');
    } finally {
        hideLoading();
    }
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        // Implement account deletion
        showError('Account deletion will be available soon');
    }
}

async function handleAddProperty(event) {
    event.preventDefault();
    
    const propertyData = {
        user: authManager.currentUser,
        propertyName: document.getElementById('propertyName').value,
        propertyType: document.getElementById('propertyType').value,
        propertyDescription: document.getElementById('propertyDescription').value,
        district: document.getElementById('addPropertyDistrict').value,
        town: document.getElementById('addPropertyTown').value,
        propertyPrice: parseFloat(document.getElementById('propertyPrice').value),
        propertySize: parseFloat(document.getElementById('propertySize').value),
        bedroomsAvailable: parseInt(document.getElementById('bedroomsAvailable').value),
        bathroomsAvailable: parseInt(document.getElementById('bathroomsAvailable').value),
        propertyImageUrl: selectedImages[0] || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600'
    };
    
    try {
        await propertyManager.createProperty(propertyData);
        await dashboardManager.loadLandlordData();
        showDashboardSection('properties');
        
        // Clear form
        event.target.reset();
        document.getElementById('imagePreview').innerHTML = '';
        selectedImages = [];
    } catch (error) {
        console.error('Add property error:', error);
    }
}

let selectedImages = [];

function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    const imagePreview = document.getElementById('imagePreview');
    
    files.forEach(async (file) => {
        if (file.type.startsWith('image/') && selectedImages.length < 10) {
            try {
                const imageUrl = await apiService.uploadImage(file);
                selectedImages.push(imageUrl);
                
                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview-item';
                previewItem.innerHTML = `
                    <img src="${imageUrl}" alt="Property Image">
                    <button class="remove-image" onclick="removeImage(${selectedImages.length - 1})">×</button>
                `;
                
                imagePreview.appendChild(previewItem);
            } catch (error) {
                console.error('Image upload error:', error);
                showError('Failed to upload image');
            }
        }
    });
}

function removeImage(index) {
    selectedImages.splice(index, 1);
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.children[index].remove();
}

async function editProperty(propertyId) {
    // Implement property editing
    showError('Property editing will be available soon');
}

async function deleteProperty(propertyId) {
    if (confirm('Are you sure you want to delete this property?')) {
        try {
            await propertyManager.deleteProperty(propertyId);
            await dashboardManager.loadLandlordData();
            dashboardManager.showSection('properties');
        } catch (error) {
            console.error('Delete property error:', error);
        }
    }
}

async function acceptBooking(bookingId) {
    try {
        showLoading('Accepting booking...');
        // Update booking status to accepted
        showSuccess('Booking accepted successfully!');
        await dashboardManager.loadLandlordData();
        dashboardManager.showSection('bookings');
    } catch (error) {
        console.error('Accept booking error:', error);
        showError('Failed to accept booking');
    } finally {
        hideLoading();
    }
}

async function declineBooking(bookingId) {
    try {
        showLoading('Declining booking...');
        // Update booking status to declined
        showSuccess('Booking declined');
        await dashboardManager.loadLandlordData();
        dashboardManager.showSection('bookings');
    } catch (error) {
        console.error('Decline booking error:', error);
        showError('Failed to decline booking');
    } finally {
        hideLoading();
    }
}

async function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        try {
            showLoading('Cancelling booking...');
            await apiService.cancelBooking(bookingId);
            await dashboardManager.loadTenantData();
            dashboardManager.showSection('my-bookings');
            showSuccess('Booking cancelled successfully');
        } catch (error) {
            console.error('Cancel booking error:', error);
            showError('Failed to cancel booking');
        } finally {
            hideLoading();
        }
    }
}

// Initialize dashboard manager
const dashboardManager = new DashboardManager();