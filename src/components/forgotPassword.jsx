// This component provides a "Forgot Password" form for users who have forgotten their password.
// The user enters their email address, and if it exists in the system, a password reset email is sent.
// The UI provides feedback to the user about the status of their request.

import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  // State to hold the user's email input
  const [email, setEmail] = useState("");
  // State to hold status messages for user feedback
  const [status, setStatus] = useState("");

  // Handles form submission when the user requests a password reset
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior (page reload)
    setStatus(""); // Clear any previous status messages
    try {
      // Send a GET request to the backend to trigger the password reset email
      await axios.get(
        `http://localhost:8080/api/user/reset/${encodeURIComponent(email)}`
      );
      // Show a success message regardless of whether the email exists (for security)
      setStatus(
        "A password reset email has been sent if the email exists in our system."
      );
    } catch (err) {
      // Show an error message if the request fails
      setStatus("Error sending reset email. Please try again.");
    }
  };

  // Render the forgot password form UI
  return (
    <div className='max-w-md mx-auto mt-24 bg-white/90 shadow-2xl rounded-2xl p-10 border border-gray-200 text-center'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>Forgot Password</h2>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Email input field */}
        <input
          type='email'
          className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder:text-gray-400 transition'
          placeholder='Enter your email address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* Submit button */}
        <button
          type='submit'
          className='bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:from-indigo-600 hover:to-blue-700 transition-all duration-200'>
          Send Reset Email
        </button>
      </form>
      {/* Status message for user feedback */}
      {status && <p className='mt-4 text-indigo-700'>{status}</p>}
    </div>
  );
};

export default ForgotPassword;
