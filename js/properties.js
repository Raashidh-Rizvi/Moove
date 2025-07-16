// Property Management
class PropertyManager {
    constructor() {
        this.properties = [];
        this.filteredProperties = [];
        this.currentFilters = {
            district: '',
            town: '',
            propertyType: '',
            minPrice: 0,
            maxPrice: 200000,
            bedrooms: '',
            bathrooms: ''
        };
        this.currentPage = 1;
        this.propertiesPerPage = 6;
        this.initialize();
    }

    async initialize() {
        await this.loadProperties();
        this.initializeLocationSelectors();
        this.initializeFilters();
        this.renderProperties();
    }

    // Load properties from API
    async loadProperties() {
        try {
            this.properties = await apiService.getAllProperties();
            this.filteredProperties = [...this.properties];
        } catch (error) {
            console.error('Error loading properties:', error);
            this.properties = sampleProperties || [];
            this.filteredProperties = [...this.properties];
        }
    }

    // Initialize location selectors
    initializeLocationSelectors() {
        const districtSelect = document.getElementById('districtSelect');
        const townSelect = document.getElementById('townSelect');

        if (districtSelect) {
            // Populate districts
            Object.keys(sriLankanLocations).forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });

            // Handle district change
            districtSelect.addEventListener('change', (e) => {
                const selectedDistrict = e.target.value;
                this.updateTownSelector(selectedDistrict);
                this.currentFilters.district = selectedDistrict;
                this.currentFilters.town = '';
                this.applyFilters();
            });
        }

        if (townSelect) {
            townSelect.addEventListener('change', (e) => {
                this.currentFilters.town = e.target.value;
                this.applyFilters();
            });
        }
    }

    // Update town selector based on selected district
    updateTownSelector(district) {
        const townSelect = document.getElementById('townSelect');
        if (!townSelect) return;

        // Clear existing options
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

    // Initialize filters
    initializeFilters() {
        // Price range filter
        const priceRange = document.getElementById('priceRange');
        const priceValue = document.getElementById('priceValue');

        if (priceRange && priceValue) {
            priceRange.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                priceValue.textContent = `LKR ${value.toLocaleString()}`;
                this.currentFilters.maxPrice = value;
                this.applyFilters();
            });
        }

        // Bedroom filter
        const bedroomFilter = document.getElementById('bedroomFilter');
        if (bedroomFilter) {
            bedroomFilter.addEventListener('change', (e) => {
                this.currentFilters.bedrooms = e.target.value;
                this.applyFilters();
            });
        }

        // Bathroom filter
        const bathroomFilter = document.getElementById('bathroomFilter');
        if (bathroomFilter) {
            bathroomFilter.addEventListener('change', (e) => {
                this.currentFilters.bathrooms = e.target.value;
                this.applyFilters();
            });
        }

        // Property type filter in search
        const propertyTypeSelect = document.querySelector('.search-container select');
        if (propertyTypeSelect) {
            propertyTypeSelect.addEventListener('change', (e) => {
                this.currentFilters.propertyType = e.target.value;
                this.applyFilters();
            });
        }
    }

    // Apply filters to properties
    applyFilters() {
        this.filteredProperties = this.properties.filter(property => {
            // District filter
            if (this.currentFilters.district && property.district !== this.currentFilters.district) {
                return false;
            }

            // Town filter
            if (this.currentFilters.town && property.town !== this.currentFilters.town) {
                return false;
            }

            // Property type filter
            if (this.currentFilters.propertyType && property.propertyType !== this.currentFilters.propertyType) {
                return false;
            }

            // Price filter
            if (property.propertyPrice > this.currentFilters.maxPrice) {
                return false;
            }

            // Bedroom filter
            if (this.currentFilters.bedrooms && property.bedroomsAvailable < parseInt(this.currentFilters.bedrooms)) {
                return false;
            }

            // Bathroom filter
            if (this.currentFilters.bathrooms && property.bathroomsAvailable < parseInt(this.currentFilters.bathrooms)) {
                return false;
            }

            return true;
        });

        this.currentPage = 1;
        this.renderProperties();
    }

    // Render properties grid
    renderProperties() {
        const propertiesGrid = document.getElementById('propertiesGrid');
        if (!propertiesGrid) return;

        const startIndex = (this.currentPage - 1) * this.propertiesPerPage;
        const endIndex = startIndex + this.propertiesPerPage;
        const propertiesToShow = this.filteredProperties.slice(startIndex, endIndex);

        if (propertiesToShow.length === 0) {
            propertiesGrid.innerHTML = `
                <div class="no-properties">
                    <i class="fas fa-home" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                    <h3>No properties found</h3>
                    <p>Try adjusting your search filters to find more properties.</p>
                </div>
            `;
            return;
        }

        propertiesGrid.innerHTML = propertiesToShow.map(property => this.createPropertyCard(property)).join('');

        // Update load more button
        this.updateLoadMoreButton();
    }

    // Create property card HTML
    createPropertyCard(property) {
        const formattedPrice = property.propertyPrice.toLocaleString();
        const imageUrl = property.propertyImageUrl || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600';
        
        return `
            <div class="property-card" onclick="propertyManager.showPropertyDetails(${property.propertyId})">
                <div class="property-image">
                    <img src="${imageUrl}" alt="${property.propertyName}" loading="lazy">
                    <div class="property-badge">${property.propertyType}</div>
                    <button class="property-favorite" onclick="event.stopPropagation(); propertyManager.toggleFavorite(${property.propertyId})">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                <div class="property-content">
                    <div class="property-price">LKR ${formattedPrice}</div>
                    <h3 class="property-title">${property.propertyName}</h3>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${property.town}, ${property.district}
                    </div>
                    <div class="property-features">
                        <div class="feature">
                            <i class="fas fa-bed"></i>
                            <span>${property.bedroomsAvailable} Beds</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-bath"></i>
                            <span>${property.bathroomsAvailable} Baths</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-ruler-combined"></i>
                            <span>${property.propertySize} sqft</span>
                        </div>
                    </div>
                    <div class="property-actions">
                        <button class="btn-outline" onclick="event.stopPropagation(); propertyManager.contactLandlord('${property.user.userPhone}')">
                            <i class="fas fa-phone"></i>
                            Contact
                        </button>
                        <button class="btn-primary" onclick="event.stopPropagation(); propertyManager.bookProperty(${property.propertyId})">
                            <i class="fas fa-calendar"></i>
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Update load more button
    updateLoadMoreButton() {
        const loadMoreBtn = document.querySelector('.load-more button');
        if (!loadMoreBtn) return;

        const totalPages = Math.ceil(this.filteredProperties.length / this.propertiesPerPage);
        
        if (this.currentPage >= totalPages) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }

    // Load more properties
    loadMoreProperties() {
        this.currentPage++;
        
        const propertiesGrid = document.getElementById('propertiesGrid');
        const startIndex = (this.currentPage - 1) * this.propertiesPerPage;
        const endIndex = startIndex + this.propertiesPerPage;
        const propertiesToShow = this.filteredProperties.slice(startIndex, endIndex);

        const newCards = propertiesToShow.map(property => this.createPropertyCard(property)).join('');
        propertiesGrid.innerHTML += newCards;

        this.updateLoadMoreButton();
    }

    // Show property details modal
    async showPropertyDetails(propertyId) {
        try {
            const property = await apiService.getPropertyById(propertyId);
            const modal = document.getElementById('propertyModal');
            const modalTitle = document.getElementById('propertyModalTitle');
            const modalContent = document.getElementById('propertyModalContent');

            modalTitle.textContent = property.propertyName;
            modalContent.innerHTML = this.createPropertyDetailsHTML(property);

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

        } catch (error) {
            console.error('Error loading property details:', error);
            authManager.showNotification('Error loading property details', 'error');
        }
    }

    // Create property details HTML
    createPropertyDetailsHTML(property) {
        const formattedPrice = property.propertyPrice.toLocaleString();
        const imageUrl = property.propertyImageUrl || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600';
        
        return `
            <div class="property-details">
                <div class="property-gallery">
                    <img src="${imageUrl}" alt="${property.propertyName}" class="main-image">
                </div>
                
                <div class="property-info">
                    <div class="property-description">
                        <div class="property-header">
                            <h3>${property.propertyName}</h3>
                            <div class="property-price">LKR ${formattedPrice}/month</div>
                        </div>
                        
                        <div class="property-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${property.town}, ${property.district}
                        </div>
                        
                        <div class="property-features">
                            <div class="feature">
                                <i class="fas fa-bed"></i>
                                <span>${property.bedroomsAvailable} Bedrooms</span>
                            </div>
                            <div class="feature">
                                <i class="fas fa-bath"></i>
                                <span>${property.bathroomsAvailable} Bathrooms</span>
                            </div>
                            <div class="feature">
                                <i class="fas fa-ruler-combined"></i>
                                <span>${property.propertySize} sqft</span>
                            </div>
                            <div class="feature">
                                <i class="fas fa-home"></i>
                                <span>${property.propertyType}</span>
                            </div>
                        </div>
                        
                        <div class="property-description-text">
                            <h4>Description</h4>
                            <p>${property.propertyDescription}</p>
                        </div>
                    </div>
                    
                    <div class="property-sidebar">
                        <div class="property-specs">
                            <h4>Property Specifications</h4>
                            <div class="spec-item">
                                <span class="spec-label">Type:</span>
                                <span class="spec-value">${property.propertyType}</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Size:</span>
                                <span class="spec-value">${property.propertySize} sqft</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Bedrooms:</span>
                                <span class="spec-value">${property.bedroomsAvailable}</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Bathrooms:</span>
                                <span class="spec-value">${property.bathroomsAvailable}</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Monthly Rent:</span>
                                <span class="spec-value">LKR ${formattedPrice}</span>
                            </div>
                        </div>
                        
                        <div class="landlord-info">
                            <h4>Landlord Information</h4>
                            <div class="landlord-profile">
                                <img src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Landlord" class="landlord-avatar">
                                <div class="landlord-details">
                                    <h5>${property.user.username}</h5>
                                    <p>Property Owner</p>
                                </div>
                            </div>
                            
                            <div class="contact-buttons">
                                <button class="btn-secondary" onclick="propertyManager.contactLandlord('${property.user.userPhone}')">
                                    <i class="fas fa-phone"></i>
                                    Call
                                </button>
                                <button class="btn-secondary" onclick="propertyManager.emailLandlord('${property.user.userEmail}')">
                                    <i class="fas fa-envelope"></i>
                                    Email
                                </button>
                            </div>
                            
                            <button class="btn-primary btn-full" onclick="propertyManager.bookProperty(${property.propertyId})" style="margin-top: 1rem;">
                                <i class="fas fa-calendar"></i>
                                Book This Property
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Toggle favorite property
    toggleFavorite(propertyId) {
        if (!authManager.isLoggedIn()) {
            authManager.openModal('loginModal');
            return;
        }

        // Toggle favorite logic here
        const favoriteBtn = event.target.closest('.property-favorite');
        const icon = favoriteBtn.querySelector('i');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            favoriteBtn.classList.add('active');
            authManager.showNotification('Added to favorites', 'success');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            favoriteBtn.classList.remove('active');
            authManager.showNotification('Removed from favorites', 'success');
        }
    }

    // Contact landlord by phone
    contactLandlord(phone) {
        window.open(`tel:${phone}`, '_self');
    }

    // Email landlord
    emailLandlord(email) {
        window.open(`mailto:${email}`, '_self');
    }

    // Book property
    bookProperty(propertyId) {
        if (!authManager.isLoggedIn()) {
            authManager.openModal('loginModal');
            return;
        }

        // Store property ID for booking
        this.currentBookingPropertyId = propertyId;
        
        // Close property modal if open
        closeModal('propertyModal');
        
        // Open booking modal
        openModal('bookingModal');
        
        // Initialize booking form
        this.initializeBookingForm(propertyId);
    }

    // Initialize booking form
    async initializeBookingForm(propertyId) {
        try {
            const property = await apiService.getPropertyById(propertyId);
            
            // Set minimum dates (today for check-in, tomorrow for check-out)
            const today = new Date().toISOString().split('T')[0];
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];
            
            const checkinDate = document.getElementById('checkinDate');
            const checkoutDate = document.getElementById('checkoutDate');
            
            if (checkinDate) {
                checkinDate.min = today;
                checkinDate.addEventListener('change', this.updateBookingTotal.bind(this));
            }
            
            if (checkoutDate) {
                checkoutDate.min = tomorrowStr;
                checkoutDate.addEventListener('change', this.updateBookingTotal.bind(this));
            }
            
            // Store property for total calculation
            this.currentBookingProperty = property;
            
        } catch (error) {
            console.error('Error initializing booking form:', error);
        }
    }

    // Update booking total
    updateBookingTotal() {
        const checkinDate = document.getElementById('checkinDate').value;
        const checkoutDate = document.getElementById('checkoutDate').value;
        const totalAmountElement = document.getElementById('totalAmount');
        
        if (checkinDate && checkoutDate && this.currentBookingProperty) {
            const checkin = new Date(checkinDate);
            const checkout = new Date(checkoutDate);
            const days = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
            
            if (days > 0) {
                const total = days * this.currentBookingProperty.propertyPrice;
                totalAmountElement.textContent = `LKR ${total.toLocaleString()}`;
            } else {
                totalAmountElement.textContent = 'LKR 0';
            }
        }
    }

    // Handle booking submission
    async handleBooking(event) {
        event.preventDefault();
        
        if (!authManager.isLoggedIn()) {
            authManager.openModal('loginModal');
            return;
        }

        const formData = {
            propertyId: this.currentBookingPropertyId,
            checkInDate: document.getElementById('checkinDate').value,
            checkOutDate: document.getElementById('checkoutDate').value,
            checkInTime: document.getElementById('checkinTime').value,
            checkOutTime: document.getElementById('checkoutTime').value,
            message: document.getElementById('bookingMessage').value
        };

        // Validation
        if (!formData.checkInDate || !formData.checkOutDate || !formData.checkInTime || !formData.checkOutTime) {
            authManager.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const checkin = new Date(formData.checkInDate);
        const checkout = new Date(formData.checkOutDate);
        
        if (checkout <= checkin) {
            authManager.showNotification('Check-out date must be after check-in date', 'error');
            return;
        }

        try {
            authManager.showLoading('Submitting booking request...');
            
            // Calculate total amount
            const days = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
            const totalAmount = days * this.currentBookingProperty.propertyPrice;
            
            const bookingData = {
                ...formData,
                totalAmount,
                user: authManager.currentUser,
                property: this.currentBookingProperty
            };
            
            await apiService.createBooking(bookingData);
            
            closeModal('bookingModal');
            authManager.showNotification('Booking request submitted successfully!', 'success');
            
            // Clear form
            document.getElementById('checkinDate').value = '';
            document.getElementById('checkoutDate').value = '';
            document.getElementById('checkinTime').value = '';
            document.getElementById('checkoutTime').value = '';
            document.getElementById('bookingMessage').value = '';
            document.getElementById('totalAmount').textContent = 'LKR 0';
            
        } catch (error) {
            console.error('Booking error:', error);
            authManager.showNotification('Failed to submit booking request. Please try again.', 'error');
        } finally {
            authManager.hideLoading();
        }
    }

    // Search properties
    searchProperties() {
        const district = document.getElementById('districtSelect').value;
        const town = document.getElementById('townSelect').value;
        const propertyType = document.querySelector('.search-container select:nth-child(3)').value;

        this.currentFilters.district = district;
        this.currentFilters.town = town;
        this.currentFilters.propertyType = propertyType;

        this.applyFilters();

        // Scroll to properties section
        document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize property manager
let propertyManager;

document.addEventListener('DOMContentLoaded', () => {
    propertyManager = new PropertyManager();
});

// Global functions for HTML onclick handlers
function loadMoreProperties() {
    if (propertyManager) {
        propertyManager.loadMoreProperties();
    }
}

function handleBooking(event) {
    if (propertyManager) {
        propertyManager.handleBooking(event);
    }
}

function searchProperties() {
    if (propertyManager) {
        propertyManager.searchProperties();
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.propertyManager = propertyManager;
}