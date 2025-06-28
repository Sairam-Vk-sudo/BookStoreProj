import React, { useEffect } from 'react';
import { useState } from 'react';
// import jwt from 'jsonwebtoken';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('')
  const token = (localStorage.getItem('token'));

  useEffect(() => { 
    const verifyToken = () => {
      if (!token) return false;

      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
        const currentTime = Date.now() / 1000; 
        return decoded.exp > currentTime;
      } catch (error) {
        console.error('Token verification failed:', error);
        return false;
      }
    }

    const publicRoutes = ['/signup', '/login', '/showBook/:id', '/']
    const currentPath = window.location.pathname;

    if (!verifyToken() && !publicRoutes.includes(currentPath)) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername('');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-white text-xl font-bold">
            BookStore
          </Link>
          <div className="flex space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white">
              All Books
            </Link>
            {token && (
            <Link to="/myBooks" className="text-gray-300 hover:text-white">
              My Books
            </Link>
            )}
            {token && (
            <Link to="/wishlist" className="text-gray-300 hover:text-white">
              My Wishlist
            </Link>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {token && (
          <Link to="/addBook" className="text-gray-300 hover:text-white">
            <MdOutlineAddBox className="text-2xl" />
          </Link>
          )}
          {token ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;