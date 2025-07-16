// Dashboard Management
class DashboardManager {
    constructor() {
        this.currentSection = 'overview';
        this.properties = [];
        this.bookings = [];
        this.messages = [];
        this.initialize();
    }

    initialize() {
        // Dashboard will be initialized when opened
    }

    // Get properties content for landlord dashboard
    async getPropertiesContent() {
        if (!authManager.isLandlord()) {
            return '<p>Access denied. This section is for landlords only.</p>';
        }

        try {
            const allProperties = await apiService.getAllProperties();
            this.properties = allProperties.filter(p => p.user.userId === authManager.currentUser.userId);

            if (this.properties.length === 0) {
                return `
                    <div class="empty-state">
                        <i class="fas fa-home" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                        <h3>No Properties Listed</h3>
                        <p>You haven't listed any properties yet. Start by adding your first property.</p>
                        <button class="btn-primary" onclick="showDashboardSection('add-property')">
                            <i class="fas fa-plus"></i>
                            Add Your First Property
                        </button>
                    </div>
                `;
            }

            return `
                <div class="properties-management">
                    <div class="section-header">
                        <h3>My Properties</h3>
                        <button class="btn-primary" onclick="showDashboardSection('add-property')">
                            <i class="fas fa-plus"></i>
                            Add New Property
                        </button>
                    </div>
                    
                    <div class="properties-grid">
                        ${this.properties.map(property => this.createPropertyManagementCard(property)).join('')}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading properties:', error);
            return '<p>Error loading properties. Please try again.</p>';
        }
    }

    // Create property management card
    createPropertyManagementCard(property) {
        const formattedPrice = property.propertyPrice.toLocaleString();
        const imageUrl = property.propertyImageUrl || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600';
        
        return `
            <div class="property-management-card">
                <div class="property-image">
                    <img src="${imageUrl}" alt="${property.propertyName}">
                    <div class="property-status active">Active</div>
                </div>
                <div class="property-content">
                    <h4>${property.propertyName}</h4>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${property.town}, ${property.district}
                    </div>
                    <div class="property-price">LKR ${formattedPrice}/month</div>
                    <div class="property-features">
                        <span><i class="fas fa-bed"></i> ${property.bedroomsAvailable}</span>
                        <span><i class="fas fa-bath"></i> ${property.bathroomsAvailable}</span>
                        <span><i class="fas fa-ruler-combined"></i> ${property.propertySize} sqft</span>
                    </div>
                    <div class="property-stats">
                        <div class="stat">
                            <span class="stat-value">0</span>
                            <span class="stat-label">Views</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">0</span>
                            <span class="stat-label">Inquiries</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">0</span>
                            <span class="stat-label">Bookings</span>
                        </div>
                    </div>
                    <div class="property-actions">
                        <button class="btn-outline" onclick="dashboardManager.editProperty(${property.propertyId})">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>
                        <button class="btn-outline" onclick="dashboardManager.viewProperty(${property.propertyId})">
                            <i class="fas fa-eye"></i>
                            View
                        </button>
                        <button class="btn-outline danger" onclick="dashboardManager.deleteProperty(${property.propertyId})">
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Get add property content
    async getAddPropertyContent() {
        if (!authManager.isLandlord()) {
            return '<p>Access denied. This section is for landlords only.</p>';
        }

        return `
            <div class="add-property-section">
                <form class="property-form" onsubmit="dashboardManager.handleAddProperty(event)">
                    <div class="form-section">
                        <h3><i class="fas fa-info-circle"></i> Basic Information</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Property Name *</label>
                                <input type="text" id="propertyName" required placeholder="e.g., Modern Apartment in Colombo">
                            </div>
                            <div class="form-group">
                                <label>Property Type *</label>
                                <select id="propertyType" required>
                                    <option value="">Select Type</option>
                                    ${propertyTypes.map(type => `<option value="${type.value}">${type.label}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Description *</label>
                            <textarea id="propertyDescription" rows="4" required placeholder="Describe your property, its features, and amenities..."></textarea>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3><i class="fas fa-map-marker-alt"></i> Location</h3>
                        <div class="location-selector">
                            <div class="form-group">
                                <label>District *</label>
                                <select id="propertyDistrict" required>
                                    <option value="">Select District</option>
                                    ${Object.keys(sriLankanLocations).map(district => 
                                        `<option value="${district}">${district}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Town/City *</label>
                                <select id="propertyTown" required disabled>
                                    <option value="">Select Town</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3><i class="fas fa-dollar-sign"></i> Pricing & Details</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Monthly Rent (LKR) *</label>
                                <input type="number" id="propertyPrice" required min="1000" placeholder="50000">
                            </div>
                            <div class="form-group">
                                <label>Property Size (sqft) *</label>
                                <input type="number" id="propertySize" required min="100" placeholder="1200">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Bedrooms *</label>
                                <select id="bedroomsAvailable" required>
                                    <option value="">Select</option>
                                    ${[1,2,3,4,5,6].map(num => `<option value="${num}">${num}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Bathrooms *</label>
                                <select id="bathroomsAvailable" required>
                                    <option value="">Select</option>
                                    ${[1,2,3,4,5,6].map(num => `<option value="${num}">${num}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3><i class="fas fa-images"></i> Property Images</h3>
                        <div class="image-upload-section">
                            <div class="image-upload-area" onclick="document.getElementById('propertyImages').click()">
                                <div class="upload-icon">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                </div>
                                <div class="upload-text">Click to upload images or drag and drop</div>
                                <div class="upload-hint">Supported formats: JPG, PNG, WebP (Max 2MB each, up to 10 images)</div>
                            </div>
                            <input type="file" id="propertyImages" multiple accept="image/*" style="display: none;">
                            <div class="image-preview" id="imagePreview"></div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="showDashboardSection('properties')">
                            Cancel
                        </button>
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-plus"></i>
                            Add Property
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    // Get bookings content for landlord
    async getBookingsContent() {
        if (!authManager.isLandlord()) {
            return '<p>Access denied. This section is for landlords only.</p>';
        }

        try {
            const allBookings = await apiService.getAllBookings();
            const myProperties = await apiService.getAllProperties();
            const myPropertyIds = myProperties
                .filter(p => p.user.userId === authManager.currentUser.userId)
                .map(p => p.propertyId);
            
            this.bookings = allBookings.filter(b => myPropertyIds.includes(b.property?.propertyId));

            if (this.bookings.length === 0) {
                return `
                    <div class="empty-state">
                        <i class="fas fa-calendar" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                        <h3>No Booking Requests</h3>
                        <p>You don't have any booking requests yet. Once tenants book your properties, they'll appear here.</p>
                    </div>
                `;
            }

            return `
                <div class="bookings-management">
                    <div class="section-header">
                        <h3>Booking Requests</h3>
                        <div class="booking-filters">
                            <select onchange="dashboardManager.filterBookings(this.value)">
                                <option value="all">All Requests</option>
                                <option value="PENDING">Pending</option>
                                <option value="ACCEPTED">Accepted</option>
                                <option value="DECLINED">Declined</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="bookings-list">
                        ${this.bookings.map(booking => this.createBookingCard(booking)).join('')}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading bookings:', error);
            return '<p>Error loading bookings. Please try again.</p>';
        }
    }

    // Create booking card
    createBookingCard(booking) {
        const statusClass = booking.status.toLowerCase();
        const checkinDate = new Date(booking.checkInDate).toLocaleDateString();
        const checkoutDate = new Date(booking.checkOutDate).toLocaleDateString();
        const bookingDate = new Date(booking.bookingDate).toLocaleDateString();
        
        return `
            <div class="booking-card">
                <div class="booking-header">
                    <div class="booking-info">
                        <h4>${booking.property?.propertyName || 'Property'}</h4>
                        <p class="booking-tenant">
                            <i class="fas fa-user"></i>
                            ${booking.user?.username || 'Unknown User'}
                        </p>
                    </div>
                    <div class="booking-status">
                        <span class="status-badge status-${statusClass}">${booking.status}</span>
                    </div>
                </div>
                
                <div class="booking-details">
                    <div class="booking-dates">
                        <div class="date-item">
                            <i class="fas fa-calendar-plus"></i>
                            <div>
                                <span class="date-label">Check-in</span>
                                <span class="date-value">${checkinDate} at ${booking.checkInTime}</span>
                            </div>
                        </div>
                        <div class="date-item">
                            <i class="fas fa-calendar-minus"></i>
                            <div>
                                <span class="date-label">Check-out</span>
                                <span class="date-value">${checkoutDate} at ${booking.checkOutTime}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="booking-amount">
                        <span class="amount-label">Total Amount:</span>
                        <span class="amount-value">LKR ${booking.totalAmount?.toLocaleString() || '0'}</span>
                    </div>
                    
                    ${booking.message ? `
                        <div class="booking-message">
                            <h5>Message from tenant:</h5>
                            <p>${booking.message}</p>
                        </div>
                    ` : ''}
                </div>
                
                <div class="booking-actions">
                    <div class="booking-meta">
                        <small>Requested on ${bookingDate}</small>
                    </div>
                    <div class="action-buttons">
                        ${booking.status === 'PENDING' ? `
                            <button class="btn-outline success" onclick="dashboardManager.acceptBooking(${booking.bookingId})">
                                <i class="fas fa-check"></i>
                                Accept
                            </button>
                            <button class="btn-outline danger" onclick="dashboardManager.declineBooking(${booking.bookingId})">
                                <i class="fas fa-times"></i>
                                Decline
                            </button>
                        ` : ''}
                        <button class="btn-outline" onclick="dashboardManager.contactTenant('${booking.user?.userPhone}')">
                            <i class="fas fa-phone"></i>
                            Contact
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Get my bookings content for tenant
    async getMyBookingsContent() {
        if (!authManager.isTenant()) {
            return '<p>Access denied. This section is for tenants only.</p>';
        }

        try {
            const allBookings = await apiService.getAllBookings();
            this.bookings = allBookings.filter(b => b.user?.userId === authManager.currentUser.userId);

            if (this.bookings.length === 0) {
                return `
                    <div class="empty-state">
                        <i class="fas fa-calendar-check" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                        <h3>No Bookings Yet</h3>
                        <p>You haven't made any booking requests yet. Browse properties and book your ideal home!</p>
                        <button class="btn-primary" onclick="authManager.closeDashboard(); document.getElementById('properties').scrollIntoView()">
                            <i class="fas fa-search"></i>
                            Browse Properties
                        </button>
                    </div>
                `;
            }

            return `
                <div class="my-bookings">
                    <div class="section-header">
                        <h3>My Bookings</h3>
                    </div>
                    
                    <div class="bookings-list">
                        ${this.bookings.map(booking => this.createMyBookingCard(booking)).join('')}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading my bookings:', error);
            return '<p>Error loading bookings. Please try again.</p>';
        }
    }

    // Create my booking card for tenant
    createMyBookingCard(booking) {
        const statusClass = booking.status.toLowerCase();
        const checkinDate = new Date(booking.checkInDate).toLocaleDateString();
        const checkoutDate = new Date(booking.checkOutDate).toLocaleDateString();
        const bookingDate = new Date(booking.bookingDate).toLocaleDateString();
        
        return `
            <div class="booking-card">
                <div class="booking-header">
                    <div class="booking-info">
                        <h4>${booking.property?.propertyName || 'Property'}</h4>
                        <p class="booking-landlord">
                            <i class="fas fa-user-tie"></i>
                            ${booking.property?.user?.username || 'Unknown Landlord'}
                        </p>
                    </div>
                    <div class="booking-status">
                        <span class="status-badge status-${statusClass}">${booking.status}</span>
                    </div>
                </div>
                
                <div class="booking-details">
                    <div class="booking-dates">
                        <div class="date-item">
                            <i class="fas fa-calendar-plus"></i>
                            <div>
                                <span class="date-label">Check-in</span>
                                <span class="date-value">${checkinDate} at ${booking.checkInTime}</span>
                            </div>
                        </div>
                        <div class="date-item">
                            <i class="fas fa-calendar-minus"></i>
                            <div>
                                <span class="date-label">Check-out</span>
                                <span class="date-value">${checkoutDate} at ${booking.checkOutTime}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="booking-amount">
                        <span class="amount-label">Total Amount:</span>
                        <span class="amount-value">LKR ${booking.totalAmount?.toLocaleString() || '0'}</span>
                    </div>
                </div>
                
                <div class="booking-actions">
                    <div class="booking-meta">
                        <small>Requested on ${bookingDate}</small>
                    </div>
                    <div class="action-buttons">
                        ${booking.status === 'PENDING' ? `
                            <button class="btn-outline danger" onclick="dashboardManager.cancelMyBooking(${booking.bookingId})">
                                <i class="fas fa-times"></i>
                                Cancel Request
                            </button>
                        ` : ''}
                        <button class="btn-outline" onclick="dashboardManager.contactLandlord('${booking.property?.user?.userPhone}')">
                            <i class="fas fa-phone"></i>
                            Contact Landlord
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Handle add property form submission
    async handleAddProperty(event) {
        event.preventDefault();
        
        const formData = {
            propertyName: document.getElementById('propertyName').value,
            propertyType: document.getElementById('propertyType').value,
            propertyDescription: document.getElementById('propertyDescription').value,
            district: document.getElementById('propertyDistrict').value,
            town: document.getElementById('propertyTown').value,
            propertyPrice: parseFloat(document.getElementById('propertyPrice').value),
            propertySize: parseFloat(document.getElementById('propertySize').value),
            bedroomsAvailable: parseInt(document.getElementById('bedroomsAvailable').value),
            bathroomsAvailable: parseInt(document.getElementById('bathroomsAvailable').value),
            propertyImageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600' // Default image
        };

        // Validation
        if (!formData.propertyName || !formData.propertyType || !formData.propertyDescription ||
            !formData.district || !formData.town || !formData.propertyPrice || 
            !formData.propertySize || !formData.bedroomsAvailable || !formData.bathroomsAvailable) {
            authManager.showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            authManager.showLoading('Adding property...');
            
            await apiService.createProperty(formData);
            
            authManager.showNotification('Property added successfully!', 'success');
            showDashboardSection('properties');
            
        } catch (error) {
            console.error('Error adding property:', error);
            authManager.showNotification('Failed to add property. Please try again.', 'error');
        } finally {
            authManager.hideLoading();
        }
    }

    // Initialize add property form
    initializeAddPropertyForm() {
        // District change handler
        const districtSelect = document.getElementById('propertyDistrict');
        const townSelect = document.getElementById('propertyTown');
        
        if (districtSelect && townSelect) {
            districtSelect.addEventListener('change', (e) => {
                const selectedDistrict = e.target.value;
                this.updatePropertyTownSelector(selectedDistrict, townSelect);
            });
        }

        // Image upload handler
        const imageInput = document.getElementById('propertyImages');
        if (imageInput) {
            imageInput.addEventListener('change', this.handleImageUpload.bind(this));
        }

        // Drag and drop for images
        const uploadArea = document.querySelector('.image-upload-area');
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                this.handleImageFiles(files);
            });
        }
    }

    // Update town selector for property form
    updatePropertyTownSelector(district, townSelect) {
        townSelect.innerHTML = '<option value="">Select Town</option>';
        townSelect.disabled = !district;

        if (district && sriLankanLocations[district]) {
            sriLankanLocations[district].forEach(town => {
                const option = document.createElement('option');
                option.value = town;
                option.textContent = town;
                townSelect.appendChild(option);
            });
        }
    }

    // Handle image upload
    handleImageUpload(event) {
        const files = event.target.files;
        this.handleImageFiles(files);
    }

    // Handle image files
    handleImageFiles(files) {
        const preview = document.getElementById('imagePreview');
        if (!preview) return;

        Array.from(files).forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" class="preview-image">
                        <button type="button" class="preview-remove" onclick="this.parentElement.remove()">×</button>
                        ${index === 0 ? '<div class="main-image-indicator">Main Image</div>' : ''}
                    `;
                    preview.appendChild(previewItem);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Edit property
    async editProperty(propertyId) {
        try {
            const property = await apiService.getPropertyById(propertyId);
            
            // Switch to add property section with pre-filled data
            showDashboardSection('add-property');
            
            // Wait for form to load then populate it
            setTimeout(() => {
                document.getElementById('propertyName').value = property.propertyName;
                document.getElementById('propertyType').value = property.propertyType;
                document.getElementById('propertyDescription').value = property.propertyDescription;
                document.getElementById('propertyDistrict').value = property.district;
                
                // Update town selector and set value
                this.updatePropertyTownSelector(property.district, document.getElementById('propertyTown'));
                document.getElementById('propertyTown').value = property.town;
                
                document.getElementById('propertyPrice').value = property.propertyPrice;
                document.getElementById('propertySize').value = property.propertySize;
                document.getElementById('bedroomsAvailable').value = property.bedroomsAvailable;
                document.getElementById('bathroomsAvailable').value = property.bathroomsAvailable;
                
                // Change form title and button text
                const formTitle = document.querySelector('.form-section h3');
                if (formTitle) formTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Property';
                
                const submitBtn = document.querySelector('.property-form button[type="submit"]');
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Property';
                    submitBtn.onclick = (e) => this.handleUpdateProperty(e, propertyId);
                }
            }, 100);
            
        } catch (error) {
            console.error('Error loading property for edit:', error);
            authManager.showNotification('Error loading property details', 'error');
        }
    }

    // Handle update property
    async handleUpdateProperty(event, propertyId) {
        event.preventDefault();
        
        const formData = {
            propertyName: document.getElementById('propertyName').value,
            propertyType: document.getElementById('propertyType').value,
            propertyDescription: document.getElementById('propertyDescription').value,
            district: document.getElementById('propertyDistrict').value,
            town: document.getElementById('propertyTown').value,
            propertyPrice: parseFloat(document.getElementById('propertyPrice').value),
            propertySize: parseFloat(document.getElementById('propertySize').value),
            bedroomsAvailable: parseInt(document.getElementById('bedroomsAvailable').value),
            bathroomsAvailable: parseInt(document.getElementById('bathroomsAvailable').value)
        };

        try {
            authManager.showLoading('Updating property...');
            
            await apiService.updateProperty(propertyId, formData);
            
            authManager.showNotification('Property updated successfully!', 'success');
            showDashboardSection('properties');
            
        } catch (error) {
            console.error('Error updating property:', error);
            authManager.showNotification('Failed to update property. Please try again.', 'error');
        } finally {
            authManager.hideLoading();
        }
    }

    // View property
    viewProperty(propertyId) {
        authManager.closeDashboard();
        if (propertyManager) {
            propertyManager.showPropertyDetails(propertyId);
        }
    }

    // Delete property
    async deleteProperty(propertyId) {
        if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
            return;
        }

        try {
            authManager.showLoading('Deleting property...');
            
            await apiService.deleteProperty(propertyId);
            
            authManager.showNotification('Property deleted successfully!', 'success');
            showDashboardSection('properties'); // Refresh the properties list
            
        } catch (error) {
            console.error('Error deleting property:', error);
            authManager.showNotification('Failed to delete property. Please try again.', 'error');
        } finally {
            authManager.hideLoading();
        }
    }

    // Accept booking
    async acceptBooking(bookingId) {
        try {
            authManager.showLoading('Accepting booking...');
            
            // In a real app, you'd have an accept booking endpoint
            // For now, we'll simulate it
            authManager.showNotification('Booking accepted successfully!', 'success');
            showDashboardSection('bookings'); // Refresh bookings
            
        } catch (error) {
            console.error('Error accepting booking:', error);
            authManager.showNotification('Failed to accept booking. Please try again.', 'error');
        } finally {
            authManager.hideLoading();
        }
    }

    // Decline booking
    async declineBooking(bookingId) {
        try {
            authManager.showLoading('Declining booking...');
            
            // In a real app, you'd have a decline booking endpoint
            authManager.showNotification('Booking declined.', 'success');
            showDashboardSection('bookings'); // Refresh bookings
            
        } catch (error) {
            console.error('Error declining booking:', error);
            authManager.showNotification('Failed to decline booking. Please try again.', 'error');
        } finally {
            authManager.hideLoading();
        }
    }

    // Cancel my booking (for tenant)
    async cancelMyBooking(bookingId) {
        if (!confirm('Are you sure you want to cancel this booking request?')) {
            return;
        }

        try {
            authManager.showLoading('Cancelling booking...');
            
            await apiService.cancelBooking(bookingId);
            
            authManager.showNotification('Booking cancelled successfully!', 'success');
            showDashboardSection('my-bookings'); // Refresh bookings
            
        } catch (error) {
            console.error('Error cancelling booking:', error);
            authManager.showNotification('Failed to cancel booking. Please try again.', 'error');
        } finally {
            authManager.hideLoading();
        }
    }

    // Contact tenant
    contactTenant(phone) {
        if (phone) {
            window.open(`tel:${phone}`, '_self');
        } else {
            authManager.showNotification('Phone number not available', 'warning');
        }
    }

    // Contact landlord
    contactLandlord(phone) {
        if (phone) {
            window.open(`tel:${phone}`, '_self');
        } else {
            authManager.showNotification('Phone number not available', 'warning');
        }
    }

    // Filter bookings
    filterBookings(status) {
        // This would filter the bookings display
        // Implementation depends on how bookings are stored and displayed
        console.log('Filtering bookings by status:', status);
    }
}

// Initialize dashboard manager
const dashboardManager = new DashboardManager();

// Update authManager to use dashboardManager methods
if (typeof authManager !== 'undefined') {
    // Override dashboard content methods
    authManager.getPropertiesContent = () => dashboardManager.getPropertiesContent();
    authManager.getAddPropertyContent = () => dashboardManager.getAddPropertyContent();
    authManager.getBookingsContent = () => dashboardManager.getBookingsContent();
    authManager.getMyBookingsContent = () => dashboardManager.getMyBookingsContent();
    
    // Override section initialization
    const originalInitializeSectionFunctionality = authManager.initializeSectionFunctionality;
    authManager.initializeSectionFunctionality = function(sectionName) {
        originalInitializeSectionFunctionality.call(this, sectionName);
        
        if (sectionName === 'add-property') {
            dashboardManager.initializeAddPropertyForm();
        }
    };
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.dashboardManager = dashboardManager;
}