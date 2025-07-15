import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bed, Bath, Square, Star, Calendar, MessageCircle, ArrowLeft, Heart } from 'lucide-react';
import { Property, Review } from '../types';
import { propertyApi, reviewApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PropertyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [property, setProperty] = useState<Property | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);

    useEffect(() => {
        if (id) {
            fetchPropertyDetails();
            fetchReviews();
        }
    }, [id]);

    const fetchPropertyDetails = async () => {
        try {
            const response = await propertyApi.getPropertyById(Number(id));
            setProperty(response.data);
        } catch (err) {
            setError('Failed to fetch property details');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await reviewApi.getReviewsByProperty(Number(id));
            setReviews(response.data);
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
        }
    };

    const handleBooking = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setShowBookingModal(true);
    };

    const handleContactOwner = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/messages');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'Property not found'}</p>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Back to Properties
                    </button>
                </div>
            </div>
        );
    }

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Properties</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Property Images */}
                        <div className="relative">
                            <img
                                src={property.propertyImageUrl || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                                alt={property.propertyName}
                                className="w-full h-96 object-cover rounded-xl"
                            />
                            <div className="absolute top-4 left-4">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                  {property.propertyType}
                </span>
                            </div>
                            <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                                <Heart className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Property Info */}
                        <div className="card p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {property.propertyName}
                                    </h1>
                                    <div className="flex items-center space-x-4 text-gray-600">
                                        <div className="flex items-center space-x-1">
                                            <Bed className="w-4 h-4" />
                                            <span>{property.bedroomsAvailable} beds</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Bath className="w-4 h-4" />
                                            <span>{property.bathroomsAvailable} baths</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Square className="w-4 h-4" />
                                            <span>{property.propertySize} sqft</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-primary-600">
                                        ${property.propertyPrice}
                                    </div>
                                    <div className="text-gray-600">per month</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 mb-6">
                                <div className="flex items-center space-x-1">
                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                    <span className="font-medium">{averageRating.toFixed(1)}</span>
                                    <span className="text-gray-600">({reviews.length} reviews)</span>
                                </div>
                            </div>

                            <div className="prose max-w-none">
                                <h3 className="text-lg font-semibold mb-3">Description</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {property.propertyDescription}
                                </p>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="card p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Reviews ({reviews.length})
                            </h3>

                            {reviews.length === 0 ? (
                                <p className="text-gray-600">No reviews yet. Be the first to review this property!</p>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review.reviewId} className="border-b border-gray-200 pb-4 last:border-b-0">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {review.user.username.charAt(0).toUpperCase()}
                          </span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="font-medium">{review.user.username}</span>
                                                        <div className="flex items-center">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${
                                                                        i < review.rating
                                                                            ? 'text-yellow-400 fill-current'
                                                                            : 'text-gray-300'
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600">{review.comment}</p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Booking Card */}
                        <div className="card p-6 sticky top-24">
                            <div className="text-center mb-6">
                                <div className="text-2xl font-bold text-primary-600 mb-1">
                                    ${property.propertyPrice}/month
                                </div>
                                <p className="text-gray-600">Available for rent</p>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleBooking}
                                    className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
                                >
                                    <Calendar className="w-5 h-5" />
                                    <span>Book Now</span>
                                </button>

                                <button
                                    onClick={handleContactOwner}
                                    className="w-full btn-secondary flex items-center justify-center space-x-2 py-3"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    <span>Contact Owner</span>
                                </button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="font-semibold mb-3">Property Owner</h4>
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium">
                      {property.user.username.charAt(0).toUpperCase()}
                    </span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{property.user.username}</p>
                                        <p className="text-sm text-gray-600">Property Owner</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Property Features */}
                        <div className="card p-6">
                            <h4 className="font-semibold mb-4">Property Features</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Property Type</span>
                                    <span className="font-medium">{property.propertyType}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Size</span>
                                    <span className="font-medium">{property.propertySize} sqft</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Bedrooms</span>
                                    <span className="font-medium">{property.bedroomsAvailable}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Bathrooms</span>
                                    <span className="font-medium">{property.bathroomsAvailable}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Book Property</h3>
                        <p className="text-gray-600 mb-4">
                            Contact the property owner to discuss booking details and availability.
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="flex-1 btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowBookingModal(false);
                                    handleContactOwner();
                                }}
                                className="flex-1 btn-primary"
                            >
                                Contact Owner
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyDetailPage;