import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">ToolSwap</Link>
        <div className="flex items-center">
          {user ? (
            <>
              <span className="text-gray-800 font-semibold mr-4">
                Welcome, {user.name}!
              </span>

              <Link to="/add-tool" className="mr-4 text-gray-700 hover:text-blue-600">List a Tool</Link>
              <button onClick={handleLogout} className="mr-4 text-gray-700 hover:text-blue-600">Logout</button>
              
              {/* --- THIS IS THE MISSING PART --- */}
              <Link to="/profile" title="My Profile">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </Link>
              {/* --- END OF MISSING PART --- */}

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