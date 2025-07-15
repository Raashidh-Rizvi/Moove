// Property Management
class PropertyManager {
    constructor() {
        this.properties = [];
        this.filteredProperties = [];
        this.currentFilters = {};
        this.favorites = this.loadFavorites();
    }

    // Load all properties
    async loadProperties() {
        try {
            showLoading('properties-loading');
            this.properties = await propertyAPI.getAllProperties();
            this.filteredProperties = [...this.properties];
            this.renderProperties();
            this.updatePropertiesCount();
        } catch (error) {
            console.error('Error loading properties:', error);
            showToast(error.message || ERROR_MESSAGES.GENERIC_ERROR, TOAST_TYPES.ERROR);
        } finally {
            hideLoading('properties-loading');
        }
    }

    // Search properties with filters
    async searchProperties(filters) {
        try {
            showLoading('properties-loading');
            this.currentFilters = filters;
            this.filteredProperties = propertyAPI.filterProperties(this.properties, filters);
            this.renderProperties();
            this.updatePropertiesCount();
        } catch (error) {
            console.error('Error searching properties:', error);
            showToast(error.message || ERROR_MESSAGES.GENERIC_ERROR, TOAST_TYPES.ERROR);
        } finally {
            hideLoading('properties-loading');
        }
    }

    // Create new property
    async createProperty(propertyData) {
        try {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                throw new Error('You must be logged in to add a property');
            }

            if (!isLandlord()) {
                throw new Error('Only landlords can add properties');
            }

            // Validate property data
            this.validatePropertyData(propertyData);

            // Add user to property data
            const propertyWithUser = {
                ...propertyData,
                user: currentUser,
                propertyReview: ''
            };

            const newProperty = await propertyAPI.createProperty(propertyWithUser);
            
            // Add to local properties array
            this.properties.unshift(newProperty);
            this.filteredProperties = propertyAPI.filterProperties(this.properties, this.currentFilters);
            
            this.renderProperties();
            this.updatePropertiesCount();
            
            showToast(SUCCESS_MESSAGES.PROPERTY_CREATED, TOAST_TYPES.SUCCESS);
            showSection('home');
            
            return newProperty;
        } catch (error) {
            console.error('Error creating property:', error);
            throw error;
        }
    }

    // Update property
    async updateProperty(propertyId, propertyData) {
        try {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                throw new Error('You must be logged in to update a property');
            }

            // Find the property
            const property = this.properties.find(p => p.propertyId === propertyId);
            if (!property) {
                throw new Error('Property not found');
            }

            // Check if user owns the property
            if (property.user.userId !== currentUser.userId) {
                throw new Error('You can only update your own properties');
            }

            // Validate property data
            this.validatePropertyData(propertyData);

            // Update property
            const updatedPropertyData = {
                ...property,
                ...propertyData
            };

            const updatedProperty = await propertyAPI.updateProperty(propertyId, updatedPropertyData);
            
            // Update local properties array
            const index = this.properties.findIndex(p => p.propertyId === propertyId);
            if (index !== -1) {
                this.properties[index] = updatedProperty;
                this.filteredProperties = propertyAPI.filterProperties(this.properties, this.currentFilters);
                this.renderProperties();
            }
            
            showToast(SUCCESS_MESSAGES.PROPERTY_UPDATED, TOAST_TYPES.SUCCESS);
            return updatedProperty;
        } catch (error) {
            console.error('Error updating property:', error);
            throw error;
        }
    }

    // Delete property
    async deleteProperty(propertyId) {
        try {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                throw new Error('You must be logged in to delete a property');
            }

            // Find the property
            const property = this.properties.find(p => p.propertyId === propertyId);
            if (!property) {
                throw new Error('Property not found');
            }

            // Check if user owns the property
            if (property.user.userId !== currentUser.userId) {
                throw new Error('You can only delete your own properties');
            }

            if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
                return;
            }

            await propertyAPI.deleteProperty(propertyId);
            
            // Remove from local properties array
            this.properties = this.properties.filter(p => p.propertyId !== propertyId);
            this.filteredProperties = propertyAPI.filterProperties(this.properties, this.currentFilters);
            
            this.renderProperties();
            this.updatePropertiesCount();
            
            showToast(SUCCESS_MESSAGES.PROPERTY_DELETED, TOAST_TYPES.SUCCESS);
        } catch (error) {
            console.error('Error deleting property:', error);
            showToast(error.message || ERROR_MESSAGES.GENERIC_ERROR, TOAST_TYPES.ERROR);
        }
    }

    // Get property by ID
    getPropertyById(propertyId) {
        return this.properties.find(p => p.propertyId === propertyId);
    }

    // Toggle favorite
    toggleFavorite(propertyId) {
        const index = this.favorites.indexOf(propertyId);
        if (index === -1) {
            this.favorites.push(propertyId);
        } else {
            this.favorites.splice(index, 1);
        }
        this.saveFavorites();
        this.renderProperties(); // Re-render to update favorite buttons
    }

    // Check if property is favorite
    isFavorite(propertyId) {
        return this.favorites.includes(propertyId);
    }

    // Load favorites from localStorage
    loadFavorites() {
        try {
            const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
            return favorites ? JSON.parse(favorites) : [];
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }

    // Save favorites to localStorage
    saveFavorites() {
        try {
            localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }

    // Validate property data
    validatePropertyData(propertyData) {
        const errors = [];

        // Name validation
        if (!propertyData.propertyName || propertyData.propertyName.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
            errors.push(`Property name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters long`);
        }

        // Description validation
        if (!propertyData.propertyDescription || propertyData.propertyDescription.trim().length < VALIDATION_RULES.DESCRIPTION_MIN_LENGTH) {
            errors.push(`Description must be at least ${VALIDATION_RULES.DESCRIPTION_MIN_LENGTH} characters long`);
        }

        // Price validation
        const price = parseFloat(propertyData.propertyPrice);
        if (isNaN(price) || price < VALIDATION_RULES.PRICE_MIN) {
            errors.push('Please enter a valid price');
        }

        // Size validation
        const size = parseFloat(propertyData.propertySize);
        if (isNaN(size) || size < VALIDATION_RULES.SIZE_MIN) {
            errors.push('Please enter a valid size');
        }

        // Bedrooms validation
        const bedrooms = parseInt(propertyData.bedroomsAvailable);
        if (isNaN(bedrooms) || bedrooms < VALIDATION_RULES.ROOMS_MIN) {
            errors.push('Please enter a valid number of bedrooms');
        }

        // Bathrooms validation
        const bathrooms = parseInt(propertyData.bathroomsAvailable);
        if (isNaN(bathrooms) || bathrooms < VALIDATION_RULES.ROOMS_MIN) {
            errors.push('Please enter a valid number of bathrooms');
        }

        // Property type validation
        if (!propertyData.propertyType || !Object.keys(PROPERTY_TYPES).includes(propertyData.propertyType)) {
            errors.push('Please select a valid property type');
        }

        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }
    }

    // Render properties grid
    renderProperties() {
        const grid = document.getElementById('properties-grid');
        const noProperties = document.getElementById('no-properties');
        
        if (!grid) return;

        if (this.filteredProperties.length === 0) {
            grid.style.display = 'none';
            if (noProperties) noProperties.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        if (noProperties) noProperties.style.display = 'none';

        grid.innerHTML = this.filteredProperties.map(property => this.createPropertyCard(property)).join('');
    }

    // Create property card HTML
    createPropertyCard(property) {
        const currentUser = getCurrentUser();
        const isOwner = currentUser && currentUser.userId === property.user.userId;
        const isFav = this.isFavorite(property.propertyId);
        
        const imageUrl = property.propertyImageUrl || APP_CONFIG.DEFAULT_PROPERTY_IMAGE;
        const formattedPrice = this.formatPrice(property.propertyPrice);

        return `
            <div class="property-card" onclick="showPropertyDetail(${property.propertyId})">
                <div class="property-card-image">
                    <img src="${imageUrl}" alt="${property.propertyName}" loading="lazy">
                    <div class="property-badge">${PROPERTY_TYPES[property.propertyType] || property.propertyType}</div>
                    <div class="property-price">${formattedPrice}/mo</div>
                    <button class="property-favorite ${isFav ? 'active' : ''}" 
                            onclick="event.stopPropagation(); propertyManager.toggleFavorite(${property.propertyId})"
                            title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
                        <i class="fas fa-heart"></i>
                    </button>
                    ${isOwner ? `
                        <div class="property-actions" style="position: absolute; bottom: 1rem; left: 1rem; display: flex; gap: 0.5rem; opacity: 0; transition: opacity 0.3s;">
                            <button class="property-action" onclick="event.stopPropagation(); showPropertyDetail(${property.propertyId})" title="View">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="property-action" onclick="event.stopPropagation(); editProperty(${property.propertyId})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="property-action danger" onclick="event.stopPropagation(); propertyManager.deleteProperty(${property.propertyId})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
                <div class="property-content">
                    <h3 class="property-title">${property.propertyName}</h3>
                    <p class="property-description">${property.propertyDescription}</p>
                    <div class="property-features">
                        <div class="property-feature">
                            <i class="fas fa-bed"></i>
                            <span>${property.bedroomsAvailable} beds</span>
                        </div>
                        <div class="property-feature">
                            <i class="fas fa-bath"></i>
                            <span>${property.bathroomsAvailable} baths</span>
                        </div>
                        <div class="property-feature">
                            <i class="fas fa-expand-arrows-alt"></i>
                            <span>${property.propertySize} sqft</span>
                        </div>
                    </div>
                    <div class="property-footer">
                        <div class="property-rating">
                            <i class="fas fa-star"></i>
                            <span>4.5 (12 reviews)</span>
                        </div>
                        <button class="btn btn-primary" onclick="event.stopPropagation(); showPropertyDetail(${property.propertyId})">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Format price
    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    }

    // Update properties count
    updatePropertiesCount() {
        const countElement = document.getElementById('properties-count');
        if (countElement) {
            const count = this.filteredProperties.length;
            countElement.textContent = `${count} ${count === 1 ? 'property' : 'properties'} found`;
        }
    }
}

// Initialize property manager
const propertyManager = new PropertyManager();

// Global property functions
function loadProperties() {
    return propertyManager.loadProperties();
}

function searchProperties(filters) {
    return propertyManager.searchProperties(filters);
}

function createProperty(propertyData) {
    return propertyManager.createProperty(propertyData);
}

function updateProperty(propertyId, propertyData) {
    return propertyManager.updateProperty(propertyId, propertyData);
}

function deleteProperty(propertyId) {
    return propertyManager.deleteProperty(propertyId);
}

function getPropertyById(propertyId) {
    return propertyManager.getPropertyById(propertyId);
}

function showPropertyDetail(propertyId) {
    const property = propertyManager.getPropertyById(propertyId);
    if (!property) {
        showToast('Property not found', TOAST_TYPES.ERROR);
        return;
    }

    const modal = document.getElementById('property-modal');
    const modalBody = document.getElementById('property-modal-body');
    const modalTitle = document.getElementById('modal-property-title');

    if (!modal || !modalBody || !modalTitle) return;

    modalTitle.textContent = property.propertyName;
    
    const imageUrl = property.propertyImageUrl || APP_CONFIG.DEFAULT_PROPERTY_IMAGE;
    const formattedPrice = propertyManager.formatPrice(property.propertyPrice);
    const currentUser = getCurrentUser();
    const canContact = currentUser && currentUser.userId !== property.user.userId;

    modalBody.innerHTML = `
        <div class="property-detail">
            <img src="${imageUrl}" alt="${property.propertyName}" class="property-detail-image">
            
            <div class="property-detail-header">
                <div class="property-detail-info">
                    <h3>${property.propertyName}</h3>
                    <div class="property-detail-features">
                        <div class="property-feature">
                            <i class="fas fa-bed"></i>
                            <span>${property.bedroomsAvailable} beds</span>
                        </div>
                        <div class="property-feature">
                            <i class="fas fa-bath"></i>
                            <span>${property.bathroomsAvailable} baths</span>
                        </div>
                        <div class="property-feature">
                            <i class="fas fa-expand-arrows-alt"></i>
                            <span>${property.propertySize} sqft</span>
                        </div>
                        <div class="property-feature">
                            <i class="fas fa-home"></i>
                            <span>${PROPERTY_TYPES[property.propertyType] || property.propertyType}</span>
                        </div>
                    </div>
                </div>
                <div class="property-detail-price">
                    <div class="price">${formattedPrice}</div>
                    <div class="period">per month</div>
                </div>
            </div>
            
            <div class="property-detail-description">
                <h4>Description</h4>
                <p>${property.propertyDescription}</p>
            </div>
            
            <div class="property-detail-owner">
                <div class="owner-avatar">${property.user.username.charAt(0).toUpperCase()}</div>
                <div class="owner-info">
                    <h4>${property.user.username}</h4>
                    <p>Property Owner</p>
                    <p><i class="fas fa-envelope"></i> ${property.user.userEmail}</p>
                    <p><i class="fas fa-phone"></i> ${property.user.userPhone}</p>
                </div>
            </div>
            
            ${canContact ? `
                <div class="property-detail-actions">
                    <button class="btn btn-secondary" onclick="closeModal('property-modal')">Close</button>
                    <button class="btn btn-primary" onclick="showContactModal(${property.propertyId})">
                        <i class="fas fa-envelope"></i> Contact Owner
                    </button>
                </div>
            ` : `
                <div class="property-detail-actions">
                    <button class="btn btn-primary" onclick="closeModal('property-modal')">Close</button>
                </div>
            `}
        </div>
    `;

    showModal('property-modal');
}

function showContactModal(propertyId) {
    const property = propertyManager.getPropertyById(propertyId);
    if (!property) return;

    closeModal('property-modal');
    showModal('contact-modal');
    
    // Store property ID for form submission
    document.getElementById('contact-form').dataset.propertyId = propertyId;
}

function editProperty(propertyId) {
    // This would open an edit form - for now, just show a message
    showToast('Edit functionality would be implemented here', TOAST_TYPES.INFO);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        propertyManager,
        loadProperties,
        searchProperties,
        createProperty,
        updateProperty,
        deleteProperty,
        getPropertyById,
        showPropertyDetail
    };
}