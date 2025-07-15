import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Star } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="card overflow-hidden group">
      <div className="relative">
        <img
          src={property.propertyImageUrl || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={property.propertyName}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-primary-600 text-white px-2 py-1 rounded-md text-xs font-medium">
            {property.propertyType}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-white text-gray-900 px-2 py-1 rounded-md text-sm font-semibold">
            ${property.propertyPrice}/month
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {property.propertyName}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {property.propertyDescription}
        </p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
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
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">4.5 (12 reviews)</span>
          </div>
          
          <Link
            to={`/property/${property.propertyId}`}
            className="btn-primary text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;