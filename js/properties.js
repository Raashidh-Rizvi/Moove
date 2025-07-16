// Property Management
class PropertyManager {
    constructor() {
        this.properties = [];
        this.filteredProperties = [];
        this.currentPage = 1;
        this.propertiesPerPage = 6;
        this.currentFilters = {};
        this.favorites = this.getFavorites();
        this.initializeProperties();
    }

    async initializeProperties() {
        await this.loadProperties();
        this.setupEventListeners();
        this.populateLocationDropdowns();
    }

    async loadProperties() {
        try {
            // Try to load from API first, fallback to sample data
            try {
                this.properties = await apiService.getAllProperties();
            } catch (error) {
                console.log('Using sample data for properties');
                this.properties = sampleProperties;
            }
            
            this.filteredProperties = [...this.properties];
            this.renderProperties();
        } catch (error) {
            console.error('Error loading properties:', error);
            showError('Failed to load properties');
        }
    }

    setupEventListeners() {
        // District change handler
        const districtSelect = document.getElementById('districtSelect');
        if (districtSelect) {
            districtSelect.addEventListener('change', this.handleDistrictChange.bind(this));
        }

        // Price range handler
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.addEventListener('input', this.handlePriceChange.bind(this));
        }

        // Filter handlers
        const bedroomFilter = document.getElementById('bedroomFilter');
        const bathroomFilter = document.getElementById('bathroomFilter');
        
        if (bedroomFilter) {
            bedroomFilter.addEventListener('change', this.applyFilters.bind(this));
        }
        
        if (bathroomFilter) {
            bathroomFilter.addEventListener('change', this.applyFilters.bind(this));
        }

        // Search button handler
        const searchButton = document.querySelector('.btn-search');
        if (searchButton) {
            searchButton.addEventListener('click', this.handleSearch.bind(this));
        }
    }

    populateLocationDropdowns() {
        const districtSelect = document.getElementById('districtSelect');
        if (districtSelect) {
            // Clear existing options
            districtSelect.innerHTML = '<option value="">Select District</option>';
            
            // Add districts
            Object.keys(sriLankanLocations).forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        }
    }

    handleDistrictChange(event) {
        const selectedDistrict = event.target.value;
        const townSelect = document.getElementById('townSelect');
        
        if (townSelect) {
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
        }
        
        this.applyFilters();
    }

    handlePriceChange(event) {
        const priceValue = document.getElementById('priceValue');
        if (priceValue) {
            priceValue.textContent = `LKR ${parseInt(event.target.value).toLocaleString()}`;
        }
        this.applyFilters();
    }

    handleSearch() {
        this.applyFilters();
    }

    applyFilters() {
        const district = document.getElementById('districtSelect')?.value || '';
        const town = document.getElementById('townSelect')?.value || '';
        const maxPrice = parseInt(document.getElementById('priceRange')?.value || '200000');
        const minBedrooms = parseInt(document.getElementById('bedroomFilter')?.value || '0');
        const minBathrooms = parseInt(document.getElementById('bathroomFilter')?.value || '0');

        this.currentFilters = {
            district,
            town,
            maxPrice,
            minBedrooms,
            minBathrooms
        };

        this.filteredProperties = this.properties.filter(property => {
            return (
                (!district || property.district === district) &&
                (!town || property.town === town) &&
                (property.propertyPrice <= maxPrice) &&
                (property.bedroomsAvailable >= minBedrooms) &&
                (property.bathroomsAvailable >= minBathrooms)
            );
        });

        this.currentPage = 1;
        this.renderProperties();
    }

    renderProperties() {
        const propertiesGrid = document.getElementById('propertiesGrid');
        if (!propertiesGrid) return;

        if (this.filteredProperties.length === 0) {
            propertiesGrid.innerHTML = `
                <div class="no-properties">
                    <i class="fas fa-home" style="font-size: 4rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                    <h3>No Properties Found</h3>
                    <p>Try adjusting your search filters to find more properties.</p>
                </div>
            `;
            return;
        }

        const startIndex = (this.currentPage - 1) * this.propertiesPerPage;
        const endIndex = startIndex + this.propertiesPerPage;
        const propertiesToShow = this.filteredProperties.slice(0, endIndex);

        propertiesGrid.innerHTML = propertiesToShow.map(property => 
            this.createPropertyCard(property)
        ).join('');

        // Update load more button
        const loadMoreButton = document.querySelector('.load-more button');
        if (loadMoreButton) {
            if (endIndex >= this.filteredProperties.length) {
                loadMoreButton.style.display = 'none';
            } else {
                loadMoreButton.style.display = 'block';
            }
        }
    }

    createPropertyCard(property) {
        const isFavorite = this.favorites.includes(property.propertyId);
        const favoriteClass = isFavorite ? 'active' : '';
        
        return `
            <div class="property-card" onclick="openPropertyModal(${property.propertyId})">
                <div class="property-image">
                    <img src="${property.propertyImageUrl}" alt="${property.propertyName}">
                    <div class="property-badge">${property.propertyType}</div>
                    <button class="property-favorite ${favoriteClass}" onclick="event.stopPropagation(); toggleFavorite(${property.propertyId})">
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
                    <div class="property-actions">
                        <button class="btn-primary" onclick="event.stopPropagation(); openBookingModal(${property.propertyId})">
                            <i class="fas fa-calendar"></i>
                            Book Now
                        </button>
                        <button class="btn-outline" onclick="event.stopPropagation(); contactLandlord('${property.user.userPhone}')">
                            <i class="fas fa-phone"></i>
                            Contact
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getFavorites() {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    }

    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    toggleFavorite(propertyId) {
        const index = this.favorites.indexOf(propertyId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(propertyId);
        }
        this.saveFavorites();
        this.renderProperties();
    }

    getPropertyById(propertyId) {
        return this.properties.find(p => p.propertyId === propertyId);
    }

    async createProperty(propertyData) {
        try {
            showLoading('Creating property...');
            
            const newProperty = await apiService.createProperty(propertyData);
            this.properties.push(newProperty);
            this.applyFilters();
            
            showSuccess('Property created successfully!');
            return newProperty;
        } catch (error) {
            console.error('Error creating property:', error);
            showError('Failed to create property');
            throw error;
        } finally {
            hideLoading();
        }
    }

    async updateProperty(propertyId, propertyData) {
        try {
            showLoading('Updating property...');
            
            const updatedProperty = await apiService.updateProperty(propertyId, propertyData);
            const index = this.properties.findIndex(p => p.propertyId === propertyId);
            if (index > -1) {
                this.properties[index] = updatedProperty;
                this.applyFilters();
            }
            
            showSuccess('Property updated successfully!');
            return updatedProperty;
        } catch (error) {
            console.error('Error updating property:', error);
            showError('Failed to update property');
            throw error;
        } finally {
            hideLoading();
        }
    }

    async deleteProperty(propertyId) {
        try {
            showLoading('Deleting property...');
            
            await apiService.deleteProperty(propertyId);
            this.properties = this.properties.filter(p => p.propertyId !== propertyId);
            this.applyFilters();
            
            showSuccess('Property deleted successfully!');
        } catch (error) {
            console.error('Error deleting property:', error);
            showError('Failed to delete property');
            throw error;
        } finally {
            hideLoading();
        }
    }
}

// Global functions for property interactions
function openPropertyModal(propertyId) {
    const property = propertyManager.getPropertyById(propertyId);
    if (!property) return;

    const modalTitle = document.getElementById('propertyModalTitle');
    const modalContent = document.getElementById('propertyModalContent');

    modalTitle.textContent = property.propertyName;
    modalContent.innerHTML = `
        <div class="property-modal-content">
            <img src="${property.propertyImageUrl}" alt="${property.propertyName}" class="property-modal-image">
            
            <div class="property-modal-details">
                <div class="property-modal-info">
                    <h3>Property Details</h3>
                    <p><strong>Type:</strong> ${property.propertyType}</p>
                    <p><strong>Price:</strong> LKR ${property.propertyPrice.toLocaleString()}/month</p>
                    <p><strong>Size:</strong> ${property.propertySize} sqft</p>
                    <p><strong>Bedrooms:</strong> ${property.bedroomsAvailable}</p>
                    <p><strong>Bathrooms:</strong> ${property.bathroomsAvailable}</p>
                    <p><strong>Location:</strong> ${property.town}, ${property.district}</p>
                </div>
                
                <div class="property-modal-info">
                    <h3>Landlord Information</h3>
                    <p><strong>Name:</strong> ${property.user.username}</p>
                    <p><strong>Email:</strong> ${property.user.userEmail}</p>
                    <p><strong>Phone:</strong> ${property.user.userPhone}</p>
                </div>
            </div>
            
            <div class="property-modal-description">
                <h3>Description</h3>
                <p>${property.propertyDescription}</p>
            </div>
            
            <div class="property-modal-actions">
                <button class="btn-primary" onclick="closeModal('propertyModal'); openBookingModal(${property.propertyId})">
                    <i class="fas fa-calendar"></i>
                    Book Now
                </button>
                <button class="btn-outline" onclick="contactLandlord('${property.user.userPhone}')">
                    <i class="fas fa-phone"></i>
                    Contact Landlord
                </button>
                <button class="btn-secondary" onclick="toggleFavorite(${property.propertyId})">
                    <i class="fas fa-heart"></i>
                    ${propertyManager.favorites.includes(property.propertyId) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
            </div>
        </div>
    `;

    openModal('propertyModal');
}

function openBookingModal(propertyId) {
    authManager.requireAuth(() => {
        const property = propertyManager.getPropertyById(propertyId);
        if (!property) return;

        // Store property ID for booking
        document.getElementById('bookingModal').dataset.propertyId = propertyId;
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('checkinDate').min = today;
        document.getElementById('checkoutDate').min = today;
        
        // Update total amount when dates change
        const checkinDate = document.getElementById('checkinDate');
        const checkoutDate = document.getElementById('checkoutDate');
        
        const updateTotal = () => {
            if (checkinDate.value && checkoutDate.value) {
                const checkin = new Date(checkinDate.value);
                const checkout = new Date(checkoutDate.value);
                const days = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
                
                if (days > 0) {
                    const total = days * property.propertyPrice;
                    document.getElementById('totalAmount').textContent = `LKR ${total.toLocaleString()}`;
                }
            }
        };
        
        checkinDate.addEventListener('change', updateTotal);
        checkoutDate.addEventListener('change', updateTotal);
        
        openModal('bookingModal');
    });
}

async function handleBooking(event) {
    event.preventDefault();
    
    const propertyId = parseInt(document.getElementById('bookingModal').dataset.propertyId);
    const property = propertyManager.getPropertyById(propertyId);
    
    if (!property || !authManager.currentUser) return;
    
    const bookingData = {
        user: authManager.currentUser,
        property: property,
        checkInDate: document.getElementById('checkinDate').value,
        checkOutDate: document.getElementById('checkoutDate').value,
        checkInTime: document.getElementById('checkinTime').value,
        checkOutTime: document.getElementById('checkoutTime').value,
        totalAmount: calculateBookingTotal(property, document.getElementById('checkinDate').value, document.getElementById('checkoutDate').value),
        bookingDate: new Date().toISOString(),
        status: 'PENDING',
        checkedByOwner: false,
        conformedByOwner: false
    };
    
    try {
        showLoading('Submitting booking request...');
        await apiService.createBooking(bookingData);
        closeModal('bookingModal');
        showSuccess('Booking request submitted successfully!');
        
        // Clear form
        document.getElementById('checkinDate').value = '';
        document.getElementById('checkoutDate').value = '';
        document.getElementById('checkinTime').value = '';
        document.getElementById('checkoutTime').value = '';
        document.getElementById('bookingMessage').value = '';
        document.getElementById('totalAmount').textContent = 'LKR 0';
    } catch (error) {
        console.error('Booking error:', error);
        showError('Failed to submit booking request');
    } finally {
        hideLoading();
    }
}

function calculateBookingTotal(property, checkinDate, checkoutDate) {
    if (!checkinDate || !checkoutDate) return 0;
    
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const days = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    
    return days > 0 ? days * property.propertyPrice : 0;
}

function contactLandlord(phone) {
    if (phone) {
        window.open(`tel:${phone}`, '_self');
    } else {
        showError('Phone number not available');
    }
}

function toggleFavorite(propertyId) {
    propertyManager.toggleFavorite(propertyId);
}

function loadMoreProperties() {
    propertyManager.currentPage++;
    propertyManager.renderProperties();
}

// Initialize property manager
const propertyManager = new PropertyManager();