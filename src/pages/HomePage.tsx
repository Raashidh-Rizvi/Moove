import React, { useState, useEffect } from 'react';
import { propertyApi } from '../services/api';
import { Property } from '../types';
import SearchFilters from '../components/SearchFilters';
import PropertyCard from '../components/PropertyCard';
import { Loader2 } from 'lucide-react';

const HomePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyApi.getAllProperties();
      setProperties(response.data);
      setFilteredProperties(response.data);
    } catch (err) {
      setError('Failed to fetch properties');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters: any) => {
    let filtered = properties;

    if (filters.propertyType) {
      filtered = filtered.filter(p => p.propertyType === filters.propertyType);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(p => p.propertyPrice >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.propertyPrice <= parseFloat(filters.maxPrice));
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(p => p.bedroomsAvailable >= parseInt(filters.bedrooms));
    }

    if (filters.location) {
      filtered = filtered.filter(p => 
        p.propertyName.toLowerCase().includes(filters.location.toLowerCase()) ||
        p.propertyDescription.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredProperties(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          <span className="text-gray-600">Loading properties...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchProperties} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Find Your Perfect Home
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              Discover amazing properties for rent in your desired location
            </p>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <SearchFilters onSearch={handleSearch} />
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Available Properties
          </h2>
          <span className="text-gray-600">
            {filteredProperties.length} properties found
          </span>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your search filters to find more properties.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.propertyId} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;