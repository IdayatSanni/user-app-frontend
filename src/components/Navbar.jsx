import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { removeToken } from "../api";

// Responsive Navbar with hamburger menu for mobile
const Navbar = ({ user }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Handle logout and redirect
  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <nav className='bg-white border-b border-gray-200 shadow-md sticky top-0 z-50'>
      <div className='max-w-2xl mx-auto px-4 flex items-center justify-between h-16'>
        {/* Logo or App Name */}
        <Link to='/home' className='text-xl font-bold text-indigo-700'>
          UserApp
        </Link>
        {/* Hamburger for mobile */}
        <button
          className='md:hidden flex items-center px-3 py-2 border rounded text-indigo-700 border-indigo-700 hover:text-indigo-900 hover:border-indigo-900'
          onClick={() => setOpen(!open)}
          aria-label='Toggle menu'>
          <svg
            className='h-6 w-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </button>
        {/* Menu items */}
        <div
          className={`flex-col md:flex-row md:flex md:items-center md:space-x-8 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent border-b md:border-none border-gray-200 transition-all duration-200 ${
            open ? "flex" : "hidden"
          }`}>
          <Link
            to='/home'
            className='block px-4 py-2 text-gray-700 hover:text-indigo-700'
            onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link
            to='/profile'
            className='block px-4 py-2 text-gray-700 hover:text-indigo-700'
            onClick={() => setOpen(false)}>
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className='block px-4 py-2 text-gray-700 hover:text-red-600 w-full text-left md:w-auto md:inline'>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
