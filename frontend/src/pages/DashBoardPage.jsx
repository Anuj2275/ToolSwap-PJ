import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import Loader from '../components/Loader';

const DashboardPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket();

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

  useEffect(() => {
    if (socket) {
      const handleNewRequest = (newBooking) => {
        setBookings(prevBookings => [newBooking.bookingDetails, ...prevBookings]);
      };

      const handleStatusUpdate = (updatedBooking) => {
        setBookings(prevBookings => 
          prevBookings.map(b => b._id === updatedBooking.bookingDetails._id ? updatedBooking.bookingDetails : b)
        );
      };

      socket.on('new_booking_request', handleNewRequest);
      socket.on('booking_status_updated', handleStatusUpdate);

      return () => {
        socket.off('new_booking_request', handleNewRequest);
        socket.off('booking_status_updated', handleStatusUpdate);
      };
    }
  }, [socket]);
  
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
  
  const bookingsAsOwner = bookings.filter(b => b.owner._id === user._id);
  const bookingsAsBorrower = bookings.filter(b => b.borrower._id === user._id);

  const formatDateTime = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      
      {/* Requests for Your Tools */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Requests for Your Tools</h2>
        {bookingsAsOwner.length > 0 ? (
          <ul>
            {bookingsAsOwner.map(booking => (
              <li key={booking._id} className="border-b py-3 flex justify-between items-center">
                <div>
                  <p><span className="font-semibold">{booking.borrower.name}</span> wants to borrow <span className="font-semibold">{booking.tool.name}</span></p>
                  <p className="text-sm text-gray-500">Status: {booking.status}</p>
                  <p className="text-xs text-gray-400">
                    From: {formatDateTime(booking.startDate)} to {formatDateTime(booking.endDate)}
                  </p>
                </div>
                {booking.status === 'pending' && (
                  <div>
                    <button onClick={() => handleStatusUpdate(booking._id, 'approved')} className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600">Approve</button>
                    <button onClick={() => handleStatusUpdate(booking._id, 'declined')} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Decline</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : <p>No one has requested your tools yet.</p>}
      </div>

      {/* Your Borrowing Requests */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Your Borrowing Requests</h2>
        {bookingsAsBorrower.length > 0 ? (
           <ul>
            {bookingsAsBorrower.map(booking => (
              <li key={booking._id} className="border-b py-3">
                <p>You requested to borrow <span className="font-semibold">{booking.tool.name}</span> from <span className="font-semibold">{booking.owner.name}</span></p>
                <p className="text-sm text-gray-500">Status: {booking.status}</p>
                 <p className="text-xs text-gray-400">
                    From: {formatDateTime(booking.startDate)} to {formatDateTime(booking.endDate)}
                  </p>
              </li>
            ))}
          </ul>
        ) : <p>You haven't requested any tools yet.</p>}
      </div>
    </div>
  );
};

export default DashboardPage;