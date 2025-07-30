// This component displays the current user's profile information.
// It fetches the user info from the JWT in localStorage and then loads full user details from the backend.
// The Navbar is included for navigation, and a logout button is provided.

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../api';
import Navbar from '../components/Navbar';


// Helper to get user info from JWT in localStorage
// Decodes the JWT and returns the payload (user info)
function getUserFromToken() {
  const token = localStorage.getItem('authToken');
  if (!token) return {};
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return {};
  }
}


const Profile = () => {
  // State for user info from JWT (not used in UI, but could be useful)
  const [user, setUser] = useState({});
  // State for user info fetched from backend
  const [backendUser, setBackendUser] = useState(null);
  // Loading state for async fetch
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On mount, get user info from JWT and fetch full user details from backend
  useEffect(() => {
    const jwtUser = getUserFromToken();
    setUser(jwtUser);
    // If username or sub (email) exists, fetch user from backend
    if (jwtUser.username || jwtUser.sub) {
      fetchUser(jwtUser.username || jwtUser.sub);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user details from backend using username or email
  const fetchUser = async (username) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get(`http://localhost:8080/api/user/${encodeURIComponent(username)}`,
        { headers: { Authorization: `Bearer ${token}` } });
      setBackendUser(res.data);
    } catch (err) {
      // If fetch fails, set backendUser to null
      setBackendUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout: remove token and redirect to login
  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  // Show loading message while fetching user
  if (loading) {
    return <div className="text-center mt-20 text-lg text-gray-600">Loading profile...</div>;
  }

  // Show error if user could not be loaded
  if (!backendUser) {
    return <div className="text-center mt-20 text-red-600">Unable to load user profile.</div>;
  }

  // Render the profile UI
  return (
    <>
      {/* Navbar for navigation */}
      <Navbar />
      <div className="max-w-md mx-auto mt-16 bg-white/90 shadow-2xl rounded-2xl p-10 border border-gray-200 text-center">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Profile</h2>
        <div className="mb-6">
          {/* Display username or email */}
          <div className="text-lg font-semibold text-gray-800 mb-2">{backendUser.username || backendUser.email}</div>
          {/* Display email */}
          <div className="text-gray-600">Email: {backendUser.email}</div>
          {/* Display user ID */}
          <div className="text-gray-600">User ID: {backendUser.userId}</div>
        </div>
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold shadow"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Profile;
