import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  // Get the current location (for query params) and navigation helper
  const location = useLocation();
  const navigate = useNavigate();
  // State to track verification status and message to display
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState("");

  // Helper function to extract the token from the URL query string
  const getTokenFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("token");
  };

  // Effect runs on mount and when location or navigate changes
  useEffect(() => {
    // Get the token from the URL
    const token = getTokenFromQuery();
    if (!token) {
      // If no token, show error
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }
    // Call backend to verify email, sending token in Authorization header
    axios
      .get("http://localhost:8080/api/user/verify/email", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        // On success, show message and redirect to login after 3 seconds
        setStatus("success");
        setMessage(
          "Your email has been successfully verified! You can now log in."
        );
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch((error) => {
        // On error, show error message from backend or a default message
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Verification failed. The link may have expired or is invalid."
        );
      });
  }, [location, navigate]);

  // Render UI based on verification status
  return (
    <div className='max-w-md mx-auto mt-24 bg-white/90 shadow-2xl rounded-2xl p-10 border border-gray-200 text-center'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>
        Email Verification
      </h2>
      {/* Show different messages based on status */}
      {status === "verifying" && (
        <p className='text-gray-700'>Verifying your email, please wait...</p>
      )}
      {status === "success" && (
        <p className='text-green-600 font-semibold'>{message}</p>
      )}
      {status === "error" && (
        <p className='text-red-600 font-semibold'>{message}</p>
      )}
    </div>
  );
};

export default VerifyEmail;
