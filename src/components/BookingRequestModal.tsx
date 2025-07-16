import React, { useState } from 'react';
import { X, Calendar, Upload, FileText, User, DollarSign, AlertCircle } from 'lucide-react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import { bookingApi } from '../services/api';

interface BookingRequestModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingRequestModal: React.FC<BookingRequestModalProps> = ({
  property,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    moveInDate: '',
    moveOutDate: '',
    message: '',
  });
  
  const [documents, setDocuments] = useState<{
    id: File | null;
    incomeProof: File | null;
    reference: File | null;
  }>({
    id: null,
    incomeProof: null,
    reference: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (type: keyof typeof documents, file: File | null) => {
    setDocuments(prev => ({ ...prev, [type]: file }));
  };

  const validateForm = () => {
    if (!formData.moveInDate || !formData.moveOutDate) {
      setError('Please select both move-in and move-out dates');
      return false;
    }
    
    const moveIn = new Date(formData.moveInDate);
    const moveOut = new Date(formData.moveOutDate);
    const today = new Date();
    
    if (moveIn < today) {
      setError('Move-in date cannot be in the past');
      return false;
    }
    
    if (moveOut <= moveIn) {
      setError('Move-out date must be after move-in date');
      return false;
    }
    
    if (!formData.message.trim()) {
      setError('Please include a message to the landlord');
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
      const bookingData = {
        propertyId: property.propertyId,
        tenantId: user.userId,
        landlordId: property.user.userId,
        moveInDate: formData.moveInDate,
        moveOutDate: formData.moveOutDate,
        message: formData.message,
        status: 'PENDING' as const,
      };

      await bookingApi.createBookingRequest(bookingData);
      
      // TODO: Upload documents if provided
      // TODO: Send notification to landlord
      
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to submit booking request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book Property</h2>
            <p className="text-gray-600 mt-1">{property.propertyName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Property Info */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center space-x-4">
              <img
                src={property.propertyImageUrl || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=200'}
                alt={property.propertyName}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{property.propertyName}</h3>
                <p className="text-gray-600">{property.propertyType}</p>
                <p className="text-primary-600 font-bold">${property.propertyPrice}/month</p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Move-in Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  name="moveInDate"
                  value={formData.moveInDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Move-out Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  name="moveOutDate"
                  value={formData.moveOutDate}
                  onChange={handleInputChange}
                  min={formData.moveInDate || new Date().toISOString().split('T')[0]}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to Landlord *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="input-field pl-10 resize-none"
                placeholder="Tell the landlord about yourself, your rental history, and why you're interested in this property..."
                required
              />
            </div>
          </div>

          {/* Document Uploads */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Supporting Documents</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ID Document */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Document
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('id', e.target.files?.[0] || null)}
                    className="hidden"
                    id="id-upload"
                  />
                  <label htmlFor="id-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {documents.id ? documents.id.name : 'Upload ID'}
                    </p>
                  </label>
                </div>
              </div>

              {/* Income Proof */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Income Proof
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('incomeProof', e.target.files?.[0] || null)}
                    className="hidden"
                    id="income-upload"
                  />
                  <label htmlFor="income-upload" className="cursor-pointer">
                    <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {documents.incomeProof ? documents.incomeProof.name : 'Upload Income Proof'}
                    </p>
                  </label>
                </div>
              </div>

              {/* References */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  References
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('reference', e.target.files?.[0] || null)}
                    className="hidden"
                    id="reference-upload"
                  />
                  <label htmlFor="reference-upload" className="cursor-pointer">
                    <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {documents.reference ? documents.reference.name : 'Upload References'}
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary py-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary py-3"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingRequestModal;