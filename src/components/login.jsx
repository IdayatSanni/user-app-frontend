import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
// LocalStorage helpers
function setToken(token) {
  localStorage.setItem("authToken", token);
}
// function removeToken() {
//   localStorage.removeItem('authToken');
// }

const Login = () => {
  // -------------------- Hooks and State --------------------
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  // -------------------- Handle Input Change --------------------
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // -------------------- Handle Login --------------------
  /**
   * Handles user login: sends credentials to backend, stores token in localStorage, and redirects on success.
   * @param {Event} e - Form submit event
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to backend
      const response = await axios.post(
        "http://localhost:8080/api/user/login",
        user
      );
      // If token is returned, store in localStorage
      if (response.data && response.data.token) {
        setToken(response.data.token);
      }
      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Error Login user:", error);
    }
  };

  // Call this function on logout to remove the token
  // removeToken();

  // -------------------- Render UI --------------------
  return (
    <div className='max-w-lg mx-auto mt-16 bg-white/90 shadow-2xl rounded-2xl p-10 border border-gray-200 backdrop-blur-md'>
      {/* Login Heading */}
      <h2 className='text-3xl font-bold mb-8 text-gray-800 text-center tracking-tight flex items-center justify-center gap-2'>
        Login
      </h2>
      {/* Login Form */}
      <form onSubmit={handleLogin} className='space-y-7'>
        {/* Username Field */}
        <div>
          <label className='block text-base font-semibold mb-2 text-gray-700'>
            Username
          </label>
          <input
            type='text'
            name='username'
            value={user.username}
            onChange={handleChange}
            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder:text-gray-400 transition'
            required
            placeholder='Enter username here'
          />
        </div>
        {/* Password Field */}
        <div>
          <label className='block text-base font-semibold mb-2 text-gray-700'>
            Password
          </label>
          <input
            type='password'
            name='password'
            value={user.password}
            onChange={handleChange}
            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder:text-gray-400 transition'
            required
            placeholder='enter password here'
          />
        </div>
        {/* Register Link */}
        <div className='flex justify-center items-center pt-2'>
          <span className='text-sm text-gray-600'>
            Don't have an account?{" "}
            <a
              href='/register'
              className='text-blue-600 hover:underline font-semibold'>
              Register
            </a>
          </span>
        </div>
        {/* Form Actions */}
        <div className='flex gap-4 justify-center pt-4'>
          <button
            type='submit'
            className='bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2'>
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
