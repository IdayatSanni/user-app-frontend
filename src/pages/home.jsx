import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../api";

// Helper to get username from localStorage token (assuming JWT)
function getUsernameFromToken() {
  const token = localStorage.getItem("authToken");
  if (!token) return "";
  try {
    // JWT: header.payload.signature, payload is base64 encoded JSON
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || payload.username || "";
  } catch {
    return "";
  }
}

const Home = () => {
  const [username, setUsername] = useState("");
  const [post, setPost] = useState("");
  const [feeds, setFeeds] = useState([
    { user: "alice", content: "Hello world!" },
    { user: "bob", content: "Just joined this app!" },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(getUsernameFromToken());
  }, []);

  const handlePost = (e) => {
    e.preventDefault();
    if (post.trim()) {
      setFeeds([{ user: username, content: post }, ...feeds]);
      setPost("");
    }
  };

  // Logout function: removes token and navigates to login
  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div className='max-w-2xl mx-auto mt-10 relative'>
      {/* Logout button top right */}
      <button
        onClick={handleLogout}
        className='absolute top-0 right-0 mt-2 mr-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow'>
        Logout
      </button>
      <h1 className='text-3xl font-bold mb-4 text-indigo-700'>
        Welcome {username}!
      </h1>
      <form onSubmit={handlePost} className='mb-6'>
        <textarea
          className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder:text-gray-400 transition resize-none'
          rows={3}
          placeholder="What's on your mind?"
          value={post}
          onChange={(e) => setPost(e.target.value)}
        />
        <button
          type='submit'
          className='mt-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-indigo-600 hover:to-blue-700 transition-all duration-200'>
          Post
        </button>
      </form>
      <div>
        <h2 className='text-xl font-semibold mb-2 text-gray-800'>Feeds</h2>
        <div className='space-y-4'>
          {feeds.map((feed, idx) => (
            <div key={idx} className='bg-white p-4 rounded-lg shadow border'>
              <span className='font-bold text-indigo-600'>{feed.user}</span>
              <p className='mt-1 text-gray-700'>{feed.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
