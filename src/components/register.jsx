import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Register = () => {
  // -------------------- Hooks and State --------------------
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    phoneNumber: "",
    email: "",
  });

  // -------------------- Fetch user Data if Editing --------------------
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8080/api/user/${id}`)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, [id]);

  // -------------------- Handle Input Change --------------------
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // -------------------- Handle Form Submit --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:8080/api/user/${id}`, user);
      } else {
        await axios.post("http://localhost:8080/api/user/signup", user);
      }
      navigate("/");
    } catch (error) {
      console.error("Error creating users:", error);
    }
  };

  // -------------------- Render UI --------------------
  return (
    <div className='max-w-lg mx-auto mt-16 bg-white/90 shadow-2xl rounded-2xl p-10 border border-gray-200 backdrop-blur-md'>
      {/* Form Heading */}
      <h2 className='text-3xl font-bold mb-8 text-gray-800 text-center tracking-tight flex items-center justify-center gap-2'>
        {id ? "Edit User" : "Register"}
      </h2>
      {/* User Form */}
      <form onSubmit={handleSubmit} className='space-y-7'>
        {/* Title Field */}
        <div>
          <label className='block text-base font-semibold mb-2 text-gray-700'>
            First Name
          </label>
          <input
            type='text'
            name='firstName'
            value={user.firstName}
            onChange={handleChange}
            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder:text-gray-400 transition'
            required
            placeholder='Enter first name'
          />
        </div>
        <div>
          <label className='block text-base font-semibold mb-2 text-gray-700'>
            Last Name
          </label>
          <input
            type='text'
            name='lastName'
            value={user.lastName}
            onChange={handleChange}
            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder:text-gray-400 transition'
            required
            placeholder='Enter last name here'
          />
        </div>
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
        {/* User Field */}
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
        <div>
          <label className='block text-base font-semibold mb-2 text-gray-700'>
            Phone Number
          </label>
          <input
            type='phone'
            name='phoneNumber'
            value={user.phoneNumber}
            onChange={handleChange}
            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder:text-gray-400 transition'
            required
            placeholder='Enter username here'
          />
        </div>
        <div>
          <label className='block text-base font-semibold mb-2 text-gray-700'>
            Email
          </label>
          <input
            type='email'
            name='email'
            value={user.email}
            onChange={handleChange}
            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder:text-gray-400 transition'
            required
            placeholder='Enter email here'
          />
        </div>
        {/* Login Link */}
        <div className='flex justify-center items-center pt-2'>
          <span className='text-sm text-gray-600'>
            Already have an account?{" "}
            <a
              href='/login'
              className='text-blue-600 hover:underline font-semibold'>
              Login
            </a>
          </span>
        </div>
        {/* Form Actions */}
        <div className='flex gap-4 justify-center pt-4'>
          <button
            type='submit'
            className='bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2'>
            Register
          </button>
        </div>
      </form>
    </div>
  );
};
export default Register;
