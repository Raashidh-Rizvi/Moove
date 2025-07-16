import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, User, Home, MessageCircle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BookingRequest } from '../types/booking';
import { bookingApi } from '../services/api';

const BookingDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'requests' | 'active' | 'history'>('requests');
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookingRequests();
  }, []);

  const fetchBookingRequests = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.getAllBookingRequests();
      // Filter based on user role
      const userRequests = response.data.filter(request => 
        user?.userRole === 'LANDLORD' 
          ? request.landlordId === user.userId
          : request.tenantId === user.userId
      );
      setBookingRequests(userRequests);
    } catch (err) {
      setError('Failed to fetch booking requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'ACCEPTED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'DECLINED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'EXPIRED':
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'DECLINED':
        return 'bg-red-100 text-red-800';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRequestAction = async (requestId: number, action: 'ACCEPTED' | 'DECLINED') => {
    try {
      await bookingApi.updateBookingRequestStatus(requestId, action);
      fetchBookingRequests(); // Refresh the list
    } catch (err) {
      console.error('Failed to update request status:', err);
    }
  };

  const filteredRequests = bookingRequests.filter(request => {
    switch (activeTab) {
      case 'requests':
        return request.status === 'PENDING';
      case 'active':
        return request.status === 'ACCEPTED';
      case 'history':
        return ['DECLINED', 'EXPIRED'].includes(request.status);
      default:
        return true;
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please log in to view your booking dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchBookingRequests} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user.userRole === 'LANDLORD' ? 'Property Bookings' : 'My Bookings'}
          </h1>
          <p className="text-gray-600 mt-2">
            {user.userRole === 'LANDLORD' 
              ? 'Manage booking requests for your properties'
              : 'Track your property booking requests and reservations'
            }
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {user.userRole === 'LANDLORD' ? 'Incoming Requests' : 'My Requests'}
                {bookingRequests.filter(r => r.status === 'PENDING').length > 0 && (
                  <span className="ml-2 bg-primary-100 text-primary-600 py-0.5 px-2 rounded-full text-xs">
                    {bookingRequests.filter(r => r.status === 'PENDING').length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('active')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'active'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {user.userRole === 'LANDLORD' ? 'Active Tenants' : 'Active Bookings'}
                {bookingRequests.filter(r => r.status === 'ACCEPTED').length > 0 && (
                  <span className="ml-2 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs">
                    {bookingRequests.filter(r => r.status === 'ACCEPTED').length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                History
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {filteredRequests.length === 0 ? (
          <div className="card p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'requests' && 'No pending requests'}
              {activeTab === 'active' && 'No active bookings'}
              {activeTab === 'history' && 'No booking history'}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'requests' && user.userRole === 'LANDLORD' && 'New booking requests will appear here.'}
              {activeTab === 'requests' && user.userRole === 'CLIENT' && 'Your booking requests will appear here.'}
              {activeTab === 'active' && 'Active bookings will be shown here.'}
              {activeTab === 'history' && 'Past bookings will be displayed here.'}
            </p>
            {user.userRole === 'CLIENT' && activeTab === 'requests' && (
              <a href="/" className="btn-primary">
                Browse Properties
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRequests.map((request) => (
              <div key={request.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={request.property?.propertyImageUrl || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=200'}
                        alt={request.property?.propertyName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.property?.propertyName}
                      </h3>
                      <p className="text-gray-600">
                        {user.userRole === 'LANDLORD' 
                          ? `Request from ${request.tenant?.username}`
                          : `Request to ${request.landlord?.username}`
                        }
                      </p>
                      <p className="text-sm text-gray-500">
                        Submitted {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(request.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Move-in Date</p>
                      <p className="font-medium">{new Date(request.moveInDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Move-out Date</p>
                      <p className="font-medium">{new Date(request.moveOutDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Home className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Property Type</p>
                      <p className="font-medium">{request.property?.propertyType}</p>
                    </div>
                  </div>
                </div>

                {request.message && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Message:</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{request.message}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>
                        {user.userRole === 'LANDLORD' 
                          ? request.tenant?.username
                          : request.landlord?.username
                        }
                      </span>
                    </div>
                    
                    {request.documents && request.documents.length > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FileText className="w-4 h-4" />
                        <span>{request.documents.length} documents</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="btn-secondary text-sm flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                    
                    {user.userRole === 'LANDLORD' && request.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleRequestAction(request.id, 'DECLINED')}
                          className="btn-secondary text-red-600 hover:bg-red-50 text-sm"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleRequestAction(request.id, 'ACCEPTED')}
                          className="btn-primary text-sm"
                        >
                          Accept
                        </button>
                      </>
                    )}
                    
                    {user.userRole === 'CLIENT' && request.status === 'PENDING' && (
                      <button className="btn-secondary text-red-600 hover:bg-red-50 text-sm">
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDashboardPage;