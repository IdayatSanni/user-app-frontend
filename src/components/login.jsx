import React, { useState } from 'react';
// Eye icons as SVG
const EyeIcon = ({ open }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.36-2.7A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.043 5.306M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
);
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
// LocalStorage helpers
function setToken(token) {
  localStorage.setItem('authToken', token);
}
// function removeToken() {
//   localStorage.removeItem('authToken');
// }

const Login = () => {
  // -------------------- Hooks and State --------------------
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);


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
      console.log('Attempting login with:', user);
      const response = await axios.post('http://localhost:8080/api/user/login', user);
      // The JWT is in the headers, e.g. 'jwt-token' or similar
      const token = response.headers['jwt-token'] || response.headers['authorization'];
      if (token) {
        setToken(token);
        console.log('Token set from header, navigating to /home');
        navigate('/home');
      } else {
        console.warn('No token received in headers:', response.headers);
      }
    } catch (error) {
      console.error('Error Login user:', error);
      if (error.response) {
        console.error('Backend error response:', error.response.data);
      }
    }
  };

  // Call this function on logout to remove the token
  // removeToken();

  // -------------------- Render UI --------------------
  return (
    <div className="max-w-lg mx-auto mt-16 bg-white/90 shadow-2xl rounded-2xl p-10 border border-gray-200 backdrop-blur-md">
      {/* Login Heading */}
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center tracking-tight flex items-center justify-center gap-2">
        Login
      </h2>
      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-7">
        {/* Username Field */}
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder:text-gray-400 transition"
            required
            placeholder="Enter username here"
          />
        </div>
        {/* Password Field */}
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={user.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder:text-gray-400 transition pr-12"
              required
              placeholder="enter password here"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>
        {/* Register & Forgot Password Links */}
        <div className="flex flex-col items-center pt-2 gap-1">
          <span className="text-sm text-gray-600">Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline font-semibold">Register</a>
          </span>
          <a href="/forgot-password" className="text-blue-600 hover:underline font-semibold">Forgot your password?{' '}
          </a>
        </div>
        {/* Form Actions */}
        <div className="flex gap-4 justify-center pt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
