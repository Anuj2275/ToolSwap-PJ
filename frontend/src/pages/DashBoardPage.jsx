import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const DashboardPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

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
  
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const { data: updatedBooking } = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(bookings.map(b => b._id === bookingId ? updatedBooking : b));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  if (loading || !user) {
    return <Loader />;
  }
  
  const bookingsAsOwner = bookings.filter(b => b.owner?._id === user._id);
  const bookingsAsBorrower = bookings.filter(b => b.borrower?._id === user._id);

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      {/* Your Borrowing Requests */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Your Borrowing Requests</h2>
        {bookingsAsBorrower.length > 0 ? (
           <ul>
            {bookingsAsBorrower.map(booking => (
              <li key={booking._id} className="border-b py-3">
                {/* --- THIS IS THE FIX --- */}
                <p>You requested to borrow <span className="font-semibold">{booking.tool?.name || 'Deleted Tool'}</span> from <span className="font-semibold">{booking.owner?.name || 'Deleted User'}</span></p>
                <p className="text-sm text-gray-500">Status: {booking.status}</p>
              </li>
            ))}
          </ul>
        ) : <p>You haven't requested any tools yet.</p>}
      </div>
    </div>
  );
};

export default DashboardPage;