import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';
import { PropertyLocation } from '../types/booking';

interface MapSelectorProps {
  value: PropertyLocation;
  onChange: (location: PropertyLocation) => void;
  height?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const MapSelector: React.FC<MapSelectorProps> = ({ 
  value, 
  onChange, 
  height = '400px' 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = () => {
      if (!window.google || !mapRef.current) return;

      // Default center (Colombo, Sri Lanka)
      const defaultCenter = { lat: 6.9271, lng: 79.8612 };
      const center = value.latitude && value.longitude 
        ? { lat: value.latitude, lng: value.longitude }
        : defaultCenter;

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: value.latitude && value.longitude ? 15 : 10,
        center,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      setMap(mapInstance);

      // Add marker if coordinates exist
      if (value.latitude && value.longitude) {
        const markerInstance = new window.google.maps.Marker({
          position: center,
          map: mapInstance,
          draggable: true,
          title: 'Property Location',
        });

        setMarker(markerInstance);

        // Handle marker drag
        markerInstance.addListener('dragend', () => {
          const position = markerInstance.getPosition();
          updateLocation(position.lat(), position.lng());
        });
      }

      // Handle map clicks
      mapInstance.addListener('click', (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        
        if (marker) {
          marker.setPosition(event.latLng);
        } else {
          const newMarker = new window.google.maps.Marker({
            position: event.latLng,
            map: mapInstance,
            draggable: true,
            title: 'Property Location',
          });

          setMarker(newMarker);

          newMarker.addListener('dragend', () => {
            const position = newMarker.getPosition();
            updateLocation(position.lat(), position.lng());
          });
        }

        updateLocation(lat, lng);
      });

      // Initialize autocomplete
      if (searchInputRef.current) {
        const autocompleteInstance = new window.google.maps.places.Autocomplete(
          searchInputRef.current,
          {
            componentRestrictions: { country: 'lk' }, // Restrict to Sri Lanka
            fields: ['place_id', 'geometry', 'name', 'formatted_address'],
          }
        );

        setAutocomplete(autocompleteInstance);

        autocompleteInstance.addListener('place_changed', () => {
          const place = autocompleteInstance.getPlace();
          if (place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            
            mapInstance.setCenter({ lat, lng });
            mapInstance.setZoom(15);
            
            if (marker) {
              marker.setPosition({ lat, lng });
            } else {
              const newMarker = new window.google.maps.Marker({
                position: { lat, lng },
                map: mapInstance,
                draggable: true,
                title: 'Property Location',
              });

              setMarker(newMarker);

              newMarker.addListener('dragend', () => {
                const position = newMarker.getPosition();
                updateLocation(position.lat(), position.lng());
              });
            }

            updateLocation(lat, lng, place.formatted_address);
          }
        });
      }

      setIsLoading(false);
    };

    // Load Google Maps API if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = initializeMap;
      document.head.appendChild(script);

      script.onerror = () => {
        setError('Failed to load Google Maps. Please check your API key.');
        setIsLoading(false);
      };
    } else {
      initializeMap();
    }
  }, []);

  const updateLocation = async (lat: number, lng: number, address?: string) => {
    try {
      let formattedAddress = address;
      
      if (!formattedAddress && window.google) {
        const geocoder = new window.google.maps.Geocoder();
        const response = await new Promise((resolve, reject) => {
          geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
            if (status === 'OK' && results[0]) {
              resolve(results[0].formatted_address);
            } else {
              reject(new Error('Geocoding failed'));
            }
          });
        });
        formattedAddress = response as string;
      }

      onChange({
        ...value,
        latitude: lat,
        longitude: lng,
        formattedAddress,
      });
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          if (map) {
            map.setCenter({ lat, lng });
            map.setZoom(15);
          }
          
          setIsLoading(false);
        },
        (error) => {
          setError('Unable to get your location. Please select manually on the map.');
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  if (error) {
    return (
      <div className="border-2 border-red-200 rounded-lg p-8 text-center">
        <MapPin className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Reload Map
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="input-field pl-10 pr-20"
          placeholder="Search for an address in Sri Lanka..."
        />
        <button
          type="button"
          onClick={getCurrentLocation}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          title="Use current location as starting point"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Map Container */}
      <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        
        <div
          ref={mapRef}
          style={{ height }}
          className="w-full"
        />
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How to set your property location:</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Search for your property address in the search box above</li>
              <li>• Click on the map to place a marker at your property location</li>
              <li>• Drag the marker to fine-tune the exact position</li>
              <li>• Use "Current Location" button to zoom to your area (then adjust to property)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Selected Location Display */}
      {value.latitude && value.longitude && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-green-800 mb-1">Selected Location:</p>
              <p className="text-green-700">
                {value.formattedAddress || `${value.latitude.toFixed(6)}, ${value.longitude.toFixed(6)}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapSelector;