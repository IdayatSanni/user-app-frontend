// This component provides a form for users to reset their password using a reset token (usually from an email link).
// The user enters a new password and confirms it. The token is extracted from the URL query string.
// On submit, the new password and token are sent to the backend to complete the reset process.

import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  // React Router hook to access the current URL (for extracting the token)
  const location = useLocation();
  // React Router hook to programmatically navigate to other pages
  const navigate = useNavigate();
  // State for the new password input
  const [password, setPassword] = useState("");
  // State for the confirm password input
  const [confirmPassword, setConfirmPassword] = useState("");
  // State for status messages (success or error)
  const [status, setStatus] = useState("");

  // Helper function to extract the reset token from the URL query string
  const getTokenFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("token");
  };

  // Handles form submission for resetting the password
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents default form submission (page reload)
    setStatus(""); // Clear any previous status messages
    // Check if passwords match
    if (password !== confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }
    // Get the reset token from the URL
    const token = getTokenFromQuery();
    if (!token) {
      setStatus("Invalid or missing reset token.");
      return;
    }
    try {
      // Send the new password and token to the backend to reset the password
      await axios.post("http://localhost:8080/api/user/reset", {
        password,
        token,
      });
      setStatus("Password reset successful! Redirecting to login...");
      // Redirect to login after a short delay
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      // Show an error message if the reset fails
      setStatus(
        "Error resetting password. The link may have expired or is invalid."
      );
    }
  };

  // Render the reset password form UI
  return (
    <div className='max-w-md mx-auto mt-24 bg-white/90 shadow-2xl rounded-2xl p-10 border border-gray-200 text-center'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>Reset Password</h2>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* New password input field */}
        <input
          type='password'
          className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder:text-gray-400 transition'
          placeholder='New password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* Confirm new password input field */}
        <input
          type='password'
          className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder:text-gray-400 transition'
          placeholder='Confirm new password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {/* Submit button */}
        <button
          type='submit'
          className='bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:from-indigo-600 hover:to-blue-700 transition-all duration-200'>
          Reset Password
        </button>
      </form>
      {/* Status message for user feedback */}
      {status && <p className='mt-4 text-indigo-700'>{status}</p>}
    </div>
  );
};

export default ResetPassword;
