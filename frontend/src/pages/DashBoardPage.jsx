import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  // State for bookings
  const [bookings, setBookings] = useState([]);
  // Loading state
  const [loading, setLoading] = useState(true);
  // Access user info
  const { user } = useAuth();
  
  // Fetch user's bookings
  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/bookings/my-bookings');
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);
  
  // Handle booking status update
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const { data: updatedBooking } = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(bookings.map(b => b._id === bookingId ? updatedBooking : b));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  // Helper function for status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'declined':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-indigo-100 text-indigo-700';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-700';
      case 'expired':
        return 'bg-gray-100 text-gray-700';
      case 'pending':
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  if (loading || !user) {
    return <Loader />;
  }
  
  // Filter bookings
  const bookingsAsOwner = bookings.filter(b => b.owner?._id === user._id);
  const bookingsAsBorrower = bookings.filter(b => b.borrower?._id === user._id);

  const renderBookingItem = (booking, isOwnerView) => (
      <div 
        key={booking._id} 
        className="p-4 bg-white/70 rounded-lg flex justify-between items-center shadow-sm"
      >
        <Link to={`/tool/${booking.tool?._id}`} className="flex-1 min-w-0">
          <p className="text-gray-800 truncate">
            {isOwnerView 
              ? `Request from ` 
              : `You requested `}
              <span className="font-semibold text-indigo-700">{isOwnerView ? (booking.borrower?.name || 'Deleted User') : (booking.tool?.name || 'Deleted Tool')}</span>
              {isOwnerView ? ` for ${booking.tool?.name || 'Deleted Tool'}` : ''}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Dates: {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
          </p>
        </Link>
        
        <div className="flex items-center space-x-3 ml-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadge(booking.status)}`}>
            {booking.status} {/* Status badge */}
          </span>
          
          {/* Action buttons (Owner view only) */}
          {isOwnerView && booking.status === 'pending' && (
            <div className='flex space-x-2'>
              <button
                onClick={() => handleStatusUpdate(booking._id, 'approved')}
                className="interactive-button bg-green-500 text-white text-xs px-3 py-1 rounded-full hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusUpdate(booking._id, 'declined')}
                className="interactive-button bg-red-500 text-white text-xs px-3 py-1 rounded-full hover:bg-red-600"
              >
                Decline
              </button>
            </div>
          )}
        </div>
      </div>
  );

  return (
    <div className="max-w-6xl mx-auto mt-12 space-y-8"> {/* Main container */}
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800">Your Dashboard</h1> {/* Page title */}

      {/* Requests to Borrow (Borrower View) */}
      <div className="glass-card p-8 shadow-xl"> 
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Your Borrowing Requests</h2> {/* Section title */}
        <div className="space-y-4">
          {bookingsAsBorrower.length > 0 ? (
            bookingsAsBorrower.map(booking => renderBookingItem(booking, false))
          ) : (
            <p className="text-gray-500">You haven't requested any tools yet.</p>
          )}
        </div>
      </div>

      {/* Requests for Your Tools (Owner View) */}
      <div className="glass-card p-8 shadow-xl"> 
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Requests for Your Tools</h2> {/* Section title */}
        <div className="space-y-4">
          {bookingsAsOwner.length > 0 ? (
            bookingsAsOwner.map(booking => renderBookingItem(booking, true))
          ) : (
            <p className="text-gray-500">No requests for your listed tools yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;