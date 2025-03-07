import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [postInput, setPostInput] = useState({ title: '', body: '' });

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const response = await axios.get(API_URL);
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePost() {
    try {
      const response = await axios.post(API_URL, postInput);
      setPosts([response.data, ...posts]);
      setShowForm(false);
      setPostInput({ title: '', body: '' });
    } catch (err) {
      setError('Failed to create post');
    }
  }

  async function handleUpdatePost() {
    if (!editingPost) return;
    try {
      const response = await axios.put(`${API_URL}/${editingPost.id}`, postInput);
      setPosts(posts.map((p) => (p.id === editingPost.id ? response.data : p)));
      setEditingPost(null);
      setShowForm(false);
      setPostInput({ title: '', body: '' });
    } catch (err) {
      setError('Failed to update post');
    }
  }

  async function handleDeletePost(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      setError('Failed to delete post');
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <h1>CRUD Operations with JSONPlaceholder</h1>
      <button className="new-post-button" onClick={() => setShowForm(true)}>New Post</button>
      {error && <p className="error">{error}</p>}

      {showForm && (
        <div className="popup-form">
          <input
            type="text"
            placeholder="Title"
            value={postInput.title}
            onChange={(e) => setPostInput({ ...postInput, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Body"
            value={postInput.body}
            onChange={(e) => setPostInput({ ...postInput, body: e.target.value })}
          />
          <button onClick={editingPost ? handleUpdatePost : handleCreatePost}>
            {editingPost ? 'Update' : 'Create'}
          </button>
          <button onClick={() => { setShowForm(false); setEditingPost(null); }}>Cancel</button>
        </div>
      )}

      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <button onClick={() => { setEditingPost(post); setPostInput({ title: post.title, body: post.body }); setShowForm(true); }}>Update</button>
            <button className="delete" onClick={() => handleDeletePost(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;