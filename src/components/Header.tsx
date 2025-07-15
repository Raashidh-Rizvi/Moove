import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, LogOut, MessageCircle, Calendar, Plus, Menu, X, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <Home className="w-7 h-7 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold text-gradient">Moove</span>
              <p className="text-xs text-gray-500 -mt-1">Premium Rentals</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Properties
            </Link>
            {isAuthenticated && user?.userRole === 'LANDLORD' && (
              <Link to="/add-property" className="nav-link">
                List Property
              </Link>
            )}
            {isAuthenticated && (
              <>
                <Link to="/bookings" className="nav-link">
                  My Bookings
                </Link>
                <Link to="/messages" className="nav-link">
                  Messages
                </Link>
              </>
            )}
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.userRole === 'LANDLORD' && (
                  <Link
                    to="/add-property"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Property</span>
                  </Link>
                )}
                
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/messages" 
                    className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Link>
                  <Link 
                    to="/bookings" 
                    className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                  >
                    <Calendar className="w-5 h-5" />
                  </Link>
                  <Link 
                    to="/profile" 
                    className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-semibold text-sm">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden xl:block">
                    <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.userRole}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn-secondary">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 slide-in-up">
            <div className="space-y-2">
              <Link 
                to="/" 
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Properties
              </Link>
              
              {isAuthenticated && user?.userRole === 'LANDLORD' && (
                <Link 
                  to="/add-property" 
                  className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  List Property
                </Link>
              )}
              
              {isAuthenticated && (
                <>
                  <Link 
                    to="/bookings" 
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <Link 
                    to="/messages" 
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Messages
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              )}
              
              <div className="pt-4 border-t border-gray-100">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    {user?.userRole === 'LANDLORD' && (
                      <Link
                        to="/add-property"
                        className="block btn-primary text-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Add Property
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full btn-secondary text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link 
                      to="/login" 
                      className="block btn-secondary text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register" 
                      className="block btn-primary text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;