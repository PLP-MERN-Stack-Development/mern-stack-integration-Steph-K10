// PostContext.jsx - Post management context

import React, { createContext, useState, useContext } from 'react';
import { postService, categoryService } from '../services/api';

const PostContext = createContext();

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Post operations
  const fetchPosts = async (page = 1, limit = 10, category = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.getAllPosts(page, limit, category);
      setPosts(response.data);
      return response;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch posts');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async (idOrSlug) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.getPost(idOrSlug);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.createPost(postData);
      setPosts(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id, postData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.updatePost(id, postData);
      setPosts(prev => prev.map(post => 
        post._id === id ? response.data : post
      ));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await postService.deletePost(id);
      setPosts(prev => prev.filter(post => post._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (postId, commentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.addComment(postId, commentData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add comment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchPosts = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.searchPosts(query);
      setPosts(response.data);
      return response;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to search posts');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Category operations
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch categories');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    posts,
    categories,
    loading,
    error,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    addComment,
    searchPosts,
    fetchCategories,
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};