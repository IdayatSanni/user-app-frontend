import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

// Helper to get user info from JWT in localStorage
function getUserFromToken() {
  const token = localStorage.getItem("authToken");
  if (!token) return {};
  try {
    // JWT: header.payload.signature, payload is base64 encoded JSON
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return {};
  }
}

// Helper to convert a File object to a base64 string
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const Home = () => {
  // State for user info, post content, and feeds
  const [user, setUser] = useState({});
  const [post, setPost] = useState("");
  const [feeds, setFeeds] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [commentInputs, setCommentInputs] = useState({}); // { postId: commentText }
  const [imageFile, setImageFile] = useState(null); // For image upload

  // Handle like
  const handleLike = async (postId) => {
    const alreadyLiked = likedPosts[postId];
    const token = localStorage.getItem("authToken");
    try {
      if (!alreadyLiked) {
        await axios.post(
          `http://localhost:8080/api/posts/${postId}/like`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLikedPosts((prev) => ({ ...prev, [postId]: true }));
      } else {
        await axios.post(
          `http://localhost:8080/api/posts/${postId}/unlike`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLikedPosts((prev) => ({ ...prev, [postId]: false }));
      }
      fetchPosts(); // Refresh posts to update like count
    } catch (err) {
      console.error("Error liking/unliking post:", err);
    }
  };

  // Like and comment icons as SVG
  const LikeIcon = ({ filled }) =>
    filled ? (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-5 w-5 inline'
        fill='#ef4444'
        viewBox='0 0 24 24'
        stroke='currentColor'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z'
        />
      </svg>
    ) : (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-5 w-5 inline'
        fill='none'
        viewBox='0 0 24 24'
        stroke='#ef4444'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z'
        />
      </svg>
    );
  const CommentIcon = () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className='h-5 w-5 inline'
      fill='none'
      viewBox='0 0 24 24'
      stroke='#6366f1'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M8 10h.01M12 10h.01M16 10h.01M21 12c0 3.866-3.582 7-8 7a8.96 8.96 0 01-4-.93L3 21l1.07-3.21A7.963 7.963 0 013 12c0-3.866 3.582-7 8-7s8 3.134 8 7z'
      />
    </svg>
  );

  // Handle comment input change
  const handleCommentInput = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  // Handle comment submit (frontend only, for demo)
  const handleCommentSubmit = (postId, e) => {
    e.preventDefault();
    // For demo, just clear the input
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    // In a real app, send comment to backend here
    alert("Comment submitted: " + commentInputs[postId]);
  };

  // Fetch user info from token and all posts from backend on mount
  useEffect(() => {
    // Fetch user info from token and then get userId from backend
    const jwtUser = getUserFromToken();
    setUser(jwtUser);
    // If username/email is present, fetch userId from backend
    if (jwtUser.username || jwtUser.sub) {
      fetchUserId(jwtUser.username || jwtUser.sub);
    }
    fetchPosts();
  }, []);

  // Fetch userId from backend using username or email
  const fetchUserId = async (username) => {
    try {
      const token = localStorage.getItem("authToken");
      // Adjust endpoint as needed; assuming /api/user/username/{username}
      const res = await axios.get(
        `http://localhost:8080/api/user/${encodeURIComponent(username)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data && res.data.userId) {
        setUser((prev) => ({ ...prev, userId: res.data.userId }));
      }
    } catch (err) {
      console.error("Error fetching userId:", err);
    }
  };

  // Fetch all posts from backend with Bearer token
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:8080/api/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFeeds(res.data.reverse()); // Show newest first
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  // Handle new post submission with Bearer token
  const handlePost = async (e) => {
    e.preventDefault();
    if (post.trim()) {
      try {
        const token = localStorage.getItem("authToken");
        let imageBase64 = null;
        if (imageFile) {
          imageBase64 = await fileToBase64(imageFile);
        }
        // Prepare the post object to match the JPA entity (userId as Integer, content as String)
        const postObj = {
          userId: user.userId ? parseInt(user.userId) : undefined,
          content: post,
          image: imageBase64, // base64 string or null
          likesCount: 0, // Optional, backend can default this
          createdAt: null, // backend sets
          updatedAt: null, // backend sets
        };
        await axios.post("http://localhost:8080/api/posts/create", postObj, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setPost("");
        setImageFile(null);
        // Refresh posts
        fetchPosts();
      } catch (err) {
        console.error("Error creating post:", err);
      }
    }
  };

  // Handle post deletion with Bearer token
  const handleDelete = async (postId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh posts
      fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className='max-w-2xl mx-auto mt-10 relative'>
        {/* Welcome message */}
        <h1 className='text-3xl font-bold mb-4 text-indigo-700'>
          Welcome {user.sub || user.username || ""}!
        </h1>
        {/* Post form */}
        <form onSubmit={handlePost} className='mb-6'>
          <textarea
            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder:text-gray-400 transition resize-none'
            rows={3}
            placeholder="What's on your mind?"
            value={post}
            onChange={(e) => setPost(e.target.value)}
          />
          {/* Image upload input */}
          <input
            type='file'
            accept='image/*'
            className='mt-2'
            onChange={(e) => setImageFile(e.target.files[0] || null)}
          />
          {imageFile && (
            <div className='mt-2 text-sm text-gray-600'>
              Selected: {imageFile.name}
            </div>
          )}
          <button
            type='submit'
            className='mt-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-indigo-600 hover:to-blue-700 transition-all duration-200'>
            Post
          </button>
        </form>
        {/* Feeds section */}
        <div>
          <h2 className='text-xl font-semibold mb-2 text-gray-800'>Feeds</h2>
          <div className='space-y-4'>
            {feeds.map((feed) => (
              <div
                key={feed.postId}
                className='bg-white p-4 rounded-lg shadow border relative'>
                <span className='font-bold text-indigo-600'>
                  User {feed.userId}
                </span>
                <p className='mt-1 text-gray-700'>{feed.content}</p>
                {/* Show image if present */}
                {feed.image && (
                  <div className='mt-2'>
                    <img
                      src={feed.image}
                      alt='Post attachment'
                      className='max-h-64 max-w-full rounded-lg border border-gray-200 shadow-sm mx-auto'
                    />
                  </div>
                )}
                <div className='flex items-center gap-4 mt-2'>
                  {/* Like button */}
                  <button
                    onClick={() => handleLike(feed.postId)}
                    className={`flex items-center gap-1 ${
                      likedPosts[feed.postId] ? "text-red-600" : "text-red-500"
                    } hover:text-red-600 focus:outline-none`}
                    title={likedPosts[feed.postId] ? "Unlike" : "Like"}>
                    <LikeIcon filled={!!likedPosts[feed.postId]} />
                    <span className='text-sm'>{feed.likesCount || 0}</span>
                  </button>
                  {/* Comment icon */}
                  <span className='flex items-center gap-1 text-indigo-500'>
                    <CommentIcon />
                    <span className='text-sm'>Comment</span>
                  </span>
                </div>
                {/* Comment input */}
                <form
                  onSubmit={(e) => handleCommentSubmit(feed.postId, e)}
                  className='mt-2 flex gap-2'>
                  <input
                    type='text'
                    className='flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400'
                    placeholder='Write a comment...'
                    value={commentInputs[feed.postId] || ""}
                    onChange={(e) =>
                      handleCommentInput(feed.postId, e.target.value)
                    }
                  />
                  <button
                    type='submit'
                    className='bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-semibold'>
                    Post
                  </button>
                </form>
                {/* Show delete button only for posts by current user */}
                {(user.userId === feed.userId ||
                  user.id === feed.userId ||
                  user.user_id === feed.userId) && (
                  <button
                    onClick={() => handleDelete(feed.postId)}
                    className='absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs'>
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
