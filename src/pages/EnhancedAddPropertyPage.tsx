import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, DollarSign, Square, Bed, Bath, FileText, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { propertyApi } from '../services/api';
import LocationSelector from '../components/LocationSelector';
import MapSelector from '../components/MapSelector';
import ImageUpload from '../components/ImageUpload';
import { PropertyLocation } from '../types/booking';

const EnhancedAddPropertyPage: React.FC = () => {
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
  });
  
  const [location, setLocation] = useState<PropertyLocation>({
    district: '',
    town: '',
    area: '',
    latitude: undefined,
    longitude: undefined,
    formattedAddress: '',
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMap, setShowMap] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.propertyName.trim()) {
      setError('Property name is required');
      return false;
    }
    
    if (!formData.propertyDescription.trim() || formData.propertyDescription.length < 10) {
      setError('Property description must be at least 10 characters long');
      return false;
    }
    
    if (!formData.propertyPrice || parseFloat(formData.propertyPrice) <= 0) {
      setError('Please enter a valid price');
      return false;
    }
    
    if (!formData.propertySize || parseFloat(formData.propertySize) <= 0) {
      setError('Please enter a valid property size');
      return false;
    }
    
    if (!formData.bedroomsAvailable || parseInt(formData.bedroomsAvailable) < 0) {
      setError('Please enter a valid number of bedrooms');
      return false;
    }
    
    if (!formData.bathroomsAvailable || parseInt(formData.bathroomsAvailable) < 0) {
      setError('Please enter a valid number of bathrooms');
      return false;
    }
    
    if (!location.district || !location.town) {
      setError('Please select both district and town');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Create property data
      const propertyData = {
        ...formData,
        propertyPrice: parseFloat(formData.propertyPrice),
        propertySize: parseFloat(formData.propertySize),
        bedroomsAvailable: parseInt(formData.bedroomsAvailable),
        bathroomsAvailable: parseInt(formData.bathroomsAvailable),
        user: user,
        propertyReview: '',
        // Add location data
        district: location.district,
        town: location.town,
        area: location.area,
        latitude: location.latitude,
        longitude: location.longitude,
        formattedAddress: location.formattedAddress,
        // Use first image as main image URL (in real app, upload to cloud storage)
        propertyImageUrl: images.length > 0 ? URL.createObjectURL(images[0]) : '',
      };

      await propertyApi.createProperty(propertyData);
      
      // TODO: Upload images to cloud storage
      // TODO: Create property_images records
      
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
            <p className="text-gray-600 mt-2">Fill in the details to list your property</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h2>
              
              <div>
                <label htmlFor="propertyName" className="block text-sm font-medium text-gray-700 mb-2">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label htmlFor="propertyPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent (LKR) *
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="propertySize" className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label htmlFor="bedroomsAvailable" className="block text-sm font-medium text-gray-700 mb-2">
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
                  <label htmlFor="bathroomsAvailable" className="block text-sm font-medium text-gray-700 mb-2">
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

              <div>
                <label htmlFor="propertyDescription" className="block text-sm font-medium text-gray-700 mb-2">
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
            </div>

            {/* Location */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 flex-1">
                  Location
                </h2>
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className="btn-secondary text-sm ml-4"
                >
                  {showMap ? 'Hide Map' : 'Show Map'}
                </button>
              </div>
              
              <LocationSelector
                value={location}
                onChange={setLocation}
              />
              
              {showMap && (
                <MapSelector
                  value={location}
                  onChange={setLocation}
                  height="400px"
                />
              )}
            </div>

            {/* Images */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Property Images
              </h2>
              
              <ImageUpload
                images={images}
                onChange={setImages}
                maxImages={10}
                maxFileSize={2}
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 btn-secondary py-3 flex items-center justify-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary py-3 flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Adding Property...' : 'Add Property'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAddPropertyPage;