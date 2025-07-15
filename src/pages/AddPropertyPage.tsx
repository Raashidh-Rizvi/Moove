import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, DollarSign, Square, Bed, Bath, FileText, Image } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { propertyApi } from '../services/api';

const AddPropertyPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        propertyName: '',
        propertyDescription: '',
        propertyPrice: '',
        propertyType: 'APARTMENT' as 'APARTMENT' | 'HOUSE' | 'ROOM',
        propertySize: '',
        bedroomsAvailable: '',
        bathroomsAvailable: '',
        propertyImageUrl: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError('');

        try {
            const propertyData = {
                ...formData,
                propertyPrice: parseFloat(formData.propertyPrice),
                propertySize: parseFloat(formData.propertySize),
                bedroomsAvailable: parseInt(formData.bedroomsAvailable),
                bathroomsAvailable: parseInt(formData.bathroomsAvailable),
                user: user,
                propertyReview: '',
            };

            await propertyApi.createProperty(propertyData);
            navigate('/');
        } catch (err) {
            setError('Failed to add property. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (user?.userRole !== 'LANDLORD') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Access denied. Only landlords can add properties.</p>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="card p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Home className="w-8 h-8 text-primary-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
                        <p className="text-gray-600 mt-2">Fill in the details to list your property</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Property Name */}
                        <div>
                            <label htmlFor="propertyName" className="block text-sm font-medium text-gray-700 mb-1">
                                Property Name *
                            </label>
                            <div className="relative">
                                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="propertyName"
                                    name="propertyName"
                                    type="text"
                                    required
                                    value={formData.propertyName}
                                    onChange={handleInputChange}
                                    className="input-field pl-10"
                                    placeholder="Enter property name"
                                />
                            </div>
                        </div>

                        {/* Property Type and Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                                    Property Type *
                                </label>
                                <select
                                    id="propertyType"
                                    name="propertyType"
                                    required
                                    value={formData.propertyType}
                                    onChange={handleInputChange}
                                    className="input-field"
                                >
                                    <option value="APARTMENT">Apartment</option>
                                    <option value="HOUSE">House</option>
                                    <option value="ROOM">Room</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="propertyPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                    Monthly Rent ($) *
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="propertyPrice"
                                        name="propertyPrice"
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.propertyPrice}
                                        onChange={handleInputChange}
                                        className="input-field pl-10"
                                        placeholder="Enter monthly rent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Size and Rooms */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="propertySize" className="block text-sm font-medium text-gray-700 mb-1">
                                    Size (sqft) *
                                </label>
                                <div className="relative">
                                    <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="propertySize"
                                        name="propertySize"
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.propertySize}
                                        onChange={handleInputChange}
                                        className="input-field pl-10"
                                        placeholder="Size"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="bedroomsAvailable" className="block text-sm font-medium text-gray-700 mb-1">
                                    Bedrooms *
                                </label>
                                <div className="relative">
                                    <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="bedroomsAvailable"
                                        name="bedroomsAvailable"
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.bedroomsAvailable}
                                        onChange={handleInputChange}
                                        className="input-field pl-10"
                                        placeholder="Beds"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="bathroomsAvailable" className="block text-sm font-medium text-gray-700 mb-1">
                                    Bathrooms *
                                </label>
                                <div className="relative">
                                    <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        id="bathroomsAvailable"
                                        name="bathroomsAvailable"
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.bathroomsAvailable}
                                        onChange={handleInputChange}
                                        className="input-field pl-10"
                                        placeholder="Baths"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Property Image URL */}
                        <div>
                            <label htmlFor="propertyImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                Property Image URL
                            </label>
                            <div className="relative">
                                <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="propertyImageUrl"
                                    name="propertyImageUrl"
                                    type="url"
                                    value={formData.propertyImageUrl}
                                    onChange={handleInputChange}
                                    className="input-field pl-10"
                                    placeholder="Enter image URL (optional)"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Leave empty to use a default image
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="propertyDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                Property Description *
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <textarea
                                    id="propertyDescription"
                                    name="propertyDescription"
                                    required
                                    rows={4}
                                    value={formData.propertyDescription}
                                    onChange={handleInputChange}
                                    className="input-field pl-10 resize-none"
                                    placeholder="Describe your property, amenities, location, etc."
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="flex-1 btn-secondary py-3"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 btn-primary py-3"
                            >
                                {loading ? 'Adding Property...' : 'Add Property'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPropertyPage;