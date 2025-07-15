import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookingApi } from '../services/api';
import { Booking } from '../types';

const BookingsPage: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await bookingApi.getAllBookings();
            // Filter bookings for current user
            const userBookings = response.data.filter(booking => booking.user.userId === user?.userId);
            setBookings(userBookings);
        } catch (err) {
            setError('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId: number) => {
        try {
            await bookingApi.cancelBooking(bookingId);
            fetchBookings(); // Refresh the list
        } catch (err) {
            console.error('Failed to cancel booking:', err);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return <CheckCircle className="w-4 h-4" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Please log in to view your bookings.</p>
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
                    <button onClick={fetchBookings} className="btn-primary">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                    <p className="text-gray-600 mt-2">Manage your property bookings</p>
                </div>

                {bookings.length === 0 ? (
                    <div className="card p-8 text-center">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                        <p className="text-gray-600 mb-4">
                            You haven't made any bookings yet. Start exploring properties to make your first booking.
                        </p>
                        <a href="/" className="btn-primary">
                            Browse Properties
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking.bookingId} className="card p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Booking #{booking.bookingId}
                                            </h3>
                                            <p className="text-gray-600">
                                                Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                        <span>{booking.status}</span>
                    </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Check-in</p>
                                                <p className="font-medium">
                                                    {new Date(booking.checkInDate).toLocaleDateString()} at {booking.checkInTime}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Check-out</p>
                                                <p className="font-medium">
                                                    {new Date(booking.checkOutDate).toLocaleDateString()} at {booking.checkOutTime}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <User className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Guest</p>
                                                <p className="font-medium">{booking.user.username}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="w-5 h-5 text-gray-400">$</div>
                                            <div>
                                                <p className="text-sm text-gray-600">Total Amount</p>
                                                <p className="font-medium text-lg text-primary-600">
                                                    ${booking.totalAmount.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <div className="flex items-center space-x-1">
                                                <span>Owner Confirmation:</span>
                                                <span className={booking.conformedByOwner ? 'text-green-600' : 'text-yellow-600'}>
                          {booking.conformedByOwner ? 'Confirmed' : 'Pending'}
                        </span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <span>Owner Check:</span>
                                                <span className={booking.checkedByOwner ? 'text-green-600' : 'text-gray-600'}>
                          {booking.checkedByOwner ? 'Checked' : 'Not Checked'}
                        </span>
                                            </div>
                                        </div>

                                        {booking.status.toLowerCase() !== 'cancelled' && (
                                            <button
                                                onClick={() => handleCancelBooking(booking.bookingId)}
                                                className="text-red-600 hover:text-red-700 font-medium text-sm"
                                            >
                                                Cancel Booking
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

export default BookingsPage;