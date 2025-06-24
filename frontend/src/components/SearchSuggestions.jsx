import React, { useState, useEffect } from 'react';
import { FiClock, FiSearch, FiTrendingUp } from 'react-icons/fi';

const SearchSuggestions = ({ query, onSelect, onSearch }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches] = useState([
    'John Cena', 'The Rock', 'Stone Cold', 'The Undertaker', 'Hulk Hogan',
    'Triple H', 'Shawn Michaels', 'Brock Lesnar', 'CM Punk', 'Daniel Bryan'
  ]);

  useEffect(() => {
    const stored = localStorage.getItem('wrestlerSearchHistory');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  const addToHistory = (searchTerm) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('wrestlerSearchHistory', JSON.stringify(updated));
  };

  const handleSearchSelect = (searchTerm) => {
    addToHistory(searchTerm);
    onSelect(searchTerm);
    onSearch(searchTerm);
  };

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('wrestlerSearchHistory');
  };

  if (!query || query.length < 2) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
        {recentSearches.length > 0 && (
          <div className="p-3 border-b border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <FiClock className="w-4 h-4" />
                Recent Searches
              </h3>
              <button
                onClick={clearHistory}
                className="text-xs text-gray-500 hover:text-pink-400 transition-colors"
              >
                Clear
              </button>
            </div>
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSearchSelect(search)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <FiClock className="w-3 h-3 text-gray-500" />
                {search}
              </button>
            ))}
          </div>
        )}
        
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <FiTrendingUp className="w-4 h-4" />
            Popular Searches
          </h3>
          {popularSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => handleSearchSelect(search)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <FiSearch className="w-3 h-3 text-gray-500" />
              {search}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default SearchSuggestions;