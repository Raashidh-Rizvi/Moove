// Main Application Entry Point
class MooveApp {
    constructor() {
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                this.start();
            }
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showErrorState();
        }
    }

    async start() {
        try {
            console.log('🏠 Starting Moove App...');
            
            // Initialize core systems
            await this.initializeCore();
            
            // Load initial data
            await this.loadInitialData();
            
            // Setup global error handling
            this.setupErrorHandling();
            
            // Mark as initialized
            this.initialized = true;
            
            console.log('✅ Moove App initialized successfully');
            
            // Show welcome message for new users
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('Failed to start app:', error);
            this.showErrorState();
        }
    }

    async initializeCore() {
        // Auth manager is already initialized
        // UI manager is already initialized
        // Property manager is already initialized
        
        // Setup additional event listeners
        this.setupGlobalEventListeners();
        
        // Initialize tooltips and other UI enhancements
        this.initializeUIEnhancements();
    }

    async loadInitialData() {
        try {
            // Load properties on home page
            if (uiManager.currentSection === 'home') {
                await loadProperties();
            }
        } catch (error) {
            console.warn('Failed to load initial data:', error);
            // Don't throw - app can still function
        }
    }

    setupGlobalEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.section) {
                showSection(e.state.section);
            }
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            showToast('Connection restored', TOAST_TYPES.SUCCESS);
        });

        window.addEventListener('offline', () => {
            showToast('Connection lost. Some features may not work.', TOAST_TYPES.WARNING);
        });

        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.initialized) {
                // Refresh data when user returns to tab
                this.refreshData();
            }
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            showToast('An unexpected error occurred', TOAST_TYPES.ERROR);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            showToast('An unexpected error occurred', TOAST_TYPES.ERROR);
            e.preventDefault();
        });
    }

    initializeUIEnhancements() {
        // Add loading states to buttons
        this.enhanceButtons();
        
        // Add smooth scrolling
        this.enableSmoothScrolling();
        
        // Initialize lazy loading for images
        this.initializeLazyLoading();
        
        // Add keyboard navigation support
        this.enhanceKeyboardNavigation();
    }

    enhanceButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('button[type="submit"]') || e.target.closest('button[type="submit"]')) {
                const button = e.target.matches('button') ? e.target : e.target.closest('button');
                this.addButtonLoading(button);
            }
        });
    }

    addButtonLoading(button) {
        if (!button || button.disabled) return;
        
        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        // Remove loading state after a delay (form handlers will re-enable)
        setTimeout(() => {
            if (button.disabled) {
                button.disabled = false;
                button.innerHTML = originalText;
            }
        }, 5000);
    }

    enableSmoothScrolling() {
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            // Observe all images with loading="lazy"
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    enhanceKeyboardNavigation() {
        // Add focus indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    handleKeyboardShortcuts(e) {
        // Only handle shortcuts when not typing in inputs
        if (e.target.matches('input, textarea, select')) return;

        switch (e.key) {
            case 'h':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    showSection('home');
                }
                break;
            case 'l':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    if (isAuthenticated()) {
                        logout();
                    } else {
                        showSection('login');
                    }
                }
                break;
            case 'p':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    if (isAuthenticated()) {
                        showSection('profile');
                    }
                }
                break;
            case '/':
                e.preventDefault();
                const searchInput = document.getElementById('search-location');
                if (searchInput) {
                    searchInput.focus();
                }
                break;
        }
    }

    async refreshData() {
        try {
            if (uiManager.currentSection === 'home') {
                await loadProperties();
            }
        } catch (error) {
            console.warn('Failed to refresh data:', error);
        }
    }

    showWelcomeMessage() {
        // Show welcome message only for first-time visitors
        const hasVisited = localStorage.getItem('moove_has_visited');
        if (!hasVisited) {
            setTimeout(() => {
                showToast('Welcome to Moove! Find your perfect rental property.', TOAST_TYPES.INFO, 8000);
                localStorage.setItem('moove_has_visited', 'true');
            }, 1000);
        }
    }

    showErrorState() {
        const main = document.querySelector('.main');
        if (main) {
            main.innerHTML = `
                <div class="error-state" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 50vh;
                    text-align: center;
                    padding: 2rem;
                ">
                    <i class="fas fa-exclamation-triangle" style="
                        font-size: 4rem;
                        color: var(--error-500);
                        margin-bottom: 1rem;
                    "></i>
                    <h2 style="margin-bottom: 1rem;">Something went wrong</h2>
                    <p style="color: var(--gray-600); margin-bottom: 2rem;">
                        We're having trouble loading the application. Please try refreshing the page.
                    </p>
                    <button class="btn btn-primary" onclick="window.location.reload()">
                        <i class="fas fa-refresh"></i> Refresh Page
                    </button>
                </div>
            `;
        }
    }

    // Public methods for external use
    getVersion() {
        return APP_CONFIG.VERSION;
    }

    getStatus() {
        return {
            initialized: this.initialized,
            currentSection: uiManager.currentSection,
            isAuthenticated: isAuthenticated(),
            propertiesLoaded: propertyManager.properties.length > 0
        };
    }
}

// Initialize the application
const mooveApp = new MooveApp();

// Expose app instance globally for debugging
window.mooveApp = mooveApp;

// Add some helpful console messages
console.log(`
🏠 Moove - Premium Property Rentals
Version: ${APP_CONFIG.VERSION}
Environment: ${window.location.hostname === 'localhost' ? 'Development' : 'Production'}

Available global functions:
- showSection(sectionId)
- login(email, password)
- register(userData)
- logout()
- showToast(message, type)
- loadProperties()
- searchProperties(filters)

Keyboard shortcuts:
- Ctrl/Cmd + H: Home
- Ctrl/Cmd + L: Login/Logout
- Ctrl/Cmd + P: Profile
- /: Focus search
`);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mooveApp
    };
}