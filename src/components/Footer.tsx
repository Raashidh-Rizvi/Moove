import React from 'react';
import { Home, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Moove</h3>
                <p className="text-gray-400 text-sm">Premium Rentals</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted property rental platform connecting landlords and tenants across Sri Lanka.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+94 11 234 5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@moove.lk</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Colombo, Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* For Tenants */}
          <div>
            <h4 className="text-lg font-semibold mb-4">For Tenants</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/properties" className="hover:text-white transition-colors">Browse Properties</a></li>
              <li><a href="/help/how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="/help/tenant-guide" className="hover:text-white transition-colors">Tenant Guide</a></li>
              <li><a href="/help/booking-process" className="hover:text-white transition-colors">Booking Process</a></li>
              <li><a href="/help/tenant-rights" className="hover:text-white transition-colors">Tenant Rights</a></li>
              <li><a href="/help/payment-methods" className="hover:text-white transition-colors">Payment Methods</a></li>
              <li><a href="/help/safety-guidelines" className="hover:text-white transition-colors">Safety Guidelines</a></li>
            </ul>
          </div>

          {/* For Landlords */}
          <div>
            <h4 className="text-lg font-semibold mb-4">For Landlords</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/add-property" className="hover:text-white transition-colors">List Property</a></li>
              <li><a href="/help/landlord-guide" className="hover:text-white transition-colors">Landlord Resources</a></li>
              <li><a href="/help/property-management" className="hover:text-white transition-colors">Property Management</a></li>
              <li><a href="/help/tenant-screening" className="hover:text-white transition-colors">Tenant Screening</a></li>
              <li><a href="/help/legal-requirements" className="hover:text-white transition-colors">Legal Requirements</a></li>
              <li><a href="/help/pricing-strategies" className="hover:text-white transition-colors">Pricing Strategies</a></li>
              <li><a href="/help/tax-information" className="hover:text-white transition-colors">Tax Information</a></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400 mb-6">
              <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="/videos" className="hover:text-white transition-colors">Video Tutorials</a></li>
            </ul>

            <h5 className="text-md font-semibold mb-3">Legal</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="/accessibility" className="hover:text-white transition-colors">Accessibility</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter & Social */}
        <div className="py-8 border-t border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Stay Updated</h4>
              <p className="text-gray-400 text-sm mb-4">
                Get the latest property listings and rental tips delivered to your inbox.
              </p>
              <form className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Social Media & Apps */}
            <div className="text-center lg:text-right">
              <h4 className="text-lg font-semibold mb-3">Connect With Us</h4>
              <div className="flex justify-center lg:justify-end space-x-4 mb-4">
                <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-gray-800 hover:bg-primary-600 rounded-lg transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
              
              {/* Mobile App Links */}
              <div className="space-y-2">
                <p className="text-sm text-gray-400 mb-2">Download Our App</p>
                <div className="flex justify-center lg:justify-end space-x-2">
                  <a href="#" className="inline-block">
                    <img 
                      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                      alt="Download on App Store" 
                      className="h-10"
                    />
                  </a>
                  <a href="#" className="inline-block">
                    <img 
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                      alt="Get it on Google Play" 
                      className="h-10"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 Moove. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <span>Language:</span>
                <select className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm">
                  <option value="en">English</option>
                  <option value="si">සිංහල</option>
                  <option value="ta">தமிழ்</option>
                </select>
              </div>
              
              <div className="text-xs">
                Made with ❤️ in Sri Lanka
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;