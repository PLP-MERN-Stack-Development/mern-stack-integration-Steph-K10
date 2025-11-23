// SearchBar.jsx - Search component

import React, { useState } from 'react';
import { usePosts } from '../context/PostContext';

const SearchBar = () => {
  const { searchPosts } = usePosts();
  const [query, setQuery] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      await searchPosts(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="flex-grow px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
        />
        <button
          type="submit"
          className="bg-white text-blue-600 px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-100"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;