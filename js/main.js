// Main Application Logic
class MooveApp {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupContactForm();
        this.initializeAnimations();
    }

    setupEventListeners() {
        // Mobile navigation toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // Search button functionality
        const searchBtn = document.querySelector('.btn-search');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                if (typeof searchProperties === 'function') {
                    searchProperties();
                }
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupNavigation() {
        // Update active navigation link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const updateActiveNav = () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', updateActiveNav);
        updateActiveNav(); // Initial call
    }

    setupScrollEffects() {
        // Navbar background on scroll
        const navbar = document.querySelector('.navbar');
        
        const handleScroll = () => {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.property-card, .feature, .contact-item');
        animateElements.forEach(el => observer.observe(el));
    }

    setupContactForm() {
        // Contact form submission
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
        }
    }

    async handleContactForm(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = {
            name: formData.get('name') || event.target.querySelector('input[type="text"]').value,
            email: formData.get('email') || event.target.querySelector('input[type="email"]').value,
            message: formData.get('message') || event.target.querySelector('textarea').value
        };

        if (!data.name || !data.email || !data.message) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        try {
            this.showLoading('Sending message...');
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            event.target.reset();
            
        } catch (error) {
            console.error('Contact form error:', error);
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    initializeAnimations() {
        // Add staggered animation delays
        const propertyCards = document.querySelectorAll('.property-card');
        propertyCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });

        const features = document.querySelectorAll('.feature');
        features.forEach((feature, index) => {
            feature.style.animationDelay = `${index * 0.2}s`;
        });
    }

    // Utility methods
    showNotification(message, type = 'info') {
        if (typeof authManager !== 'undefined' && authManager.showNotification) {
            authManager.showNotification(message, type);
        } else {
            // Fallback notification
            alert(message);
        }
    }

    showLoading(message = 'Loading...') {
        if (typeof authManager !== 'undefined' && authManager.showLoading) {
            authManager.showLoading(message);
        }
    }

    hideLoading() {
        if (typeof authManager !== 'undefined' && authManager.hideLoading) {
            authManager.hideLoading();
        }
    }

    // Utility function to format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    // Utility function to format date
    formatDate(date) {
        return new Intl.DateTimeFormat('en-LK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }

    // Utility function to validate email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Utility function to validate phone
    isValidPhone(phone) {
        const phoneRegex = /^\+94[0-9]{9}$/;
        return phoneRegex.test(phone);
    }

    // Debounce function for search
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Global functions for HTML onclick handlers
function submitContactForm(event) {
    if (typeof mooveApp !== 'undefined') {
        mooveApp.handleContactForm(event);
    }
}

// Initialize the application
let mooveApp;

document.addEventListener('DOMContentLoaded', () => {
    mooveApp = new MooveApp();
    
    // Initialize other managers
    if (typeof apiService === 'undefined') {
        initializeApiService();
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden
        console.log('Page hidden');
    } else {
        // Page is visible
        console.log('Page visible');
        // Refresh data if needed
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('Back online');
    if (typeof authManager !== 'undefined') {
        authManager.showNotification('Connection restored', 'success');
    }
});

window.addEventListener('offline', () => {
    console.log('Gone offline');
    if (typeof authManager !== 'undefined') {
        authManager.showNotification('Connection lost. Some features may not work.', 'warning');
    }
});

// Handle errors globally
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // You could send error reports to a logging service here
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // You could send error reports to a logging service here
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.mooveApp = mooveApp;
}