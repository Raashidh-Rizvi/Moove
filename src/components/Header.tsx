import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, LogOut, MessageCircle, Calendar, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                            <Home className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Moove</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                            Properties
                        </Link>
                        {isAuthenticated && user?.userRole === 'LANDLORD' && (
                            <Link to="/add-property" className="text-gray-600 hover:text-primary-600 transition-colors">
                                Add Property
                            </Link>
                        )}
                        {isAuthenticated && (
                            <>
                                <Link to="/bookings" className="text-gray-600 hover:text-primary-600 transition-colors">
                                    Bookings
                                </Link>
                                <Link to="/messages" className="text-gray-600 hover:text-primary-600 transition-colors">
                                    Messages
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center space-x-4">
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

                                <div className="flex items-center space-x-3">
                                    <Link to="/messages" className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                                        <MessageCircle className="w-5 h-5" />
                                    </Link>
                                    <Link to="/bookings" className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                                        <Calendar className="w-5 h-5" />
                                    </Link>
                                    <Link to="/profile" className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                                        <User className="w-5 h-5" />
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                                    </div>
                                    <span className="text-sm text-gray-700">{user?.username}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="btn-secondary">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;