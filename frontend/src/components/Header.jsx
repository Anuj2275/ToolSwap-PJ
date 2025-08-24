import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../context/SocketContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('new_booking_request', (notification) => {
        alert(`New Request: ${notification.message}`);
      });
      
      socket.on('booking_status_updated', (notification) => {
        alert(`Update: ${notification.message}`);
      });
      
      return () => {
        socket.off('new_booking_request');
        socket.off('booking_status_updated');
      };
    }
  }, [socket]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">ToolSwap</Link>
        <div className="flex items-center"> {/* Use flexbox for alignment */}
          {user ? (
            <>
              {/* THIS IS THE NEW PART */}
              <span className="text-gray-800 font-semibold mr-4">
                Welcome, {user.name}!
              </span>

              <Link to="/dashboard" className="mr-4 text-gray-700 hover:text-blue-600">Dashboard</Link>
              <Link to="/add-tool" className="mr-4 text-gray-700 hover:text-blue-600">List a Tool</Link>
              <button onClick={handleLogout} className="text-gray-700 hover:text-blue-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4 text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-600">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;