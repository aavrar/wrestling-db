import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import SearchSuggestions from './SearchSuggestions';

const SearchForm = ({ onSearch, loading, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minVotes: '',
    minRating: '',
    birthplace: ''
  });
  const searchRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setShowSuggestions(false);
    onSearch(query.trim(), filters);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (selectedQuery) => {
    setQuery(selectedQuery);
    setShowSuggestions(false);
  };

  const handleSuggestionSearch = (searchQuery) => {
    onSearch(searchQuery, filters);
  };

  const clearFilters = () => {
    setFilters({
      minVotes: '',
      minRating: '',
      birthplace: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div ref={formRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={searchRef}
              className="w-full px-4 py-3 pl-12 rounded-l-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-pink-400 focus:border-transparent focus:outline-none transition-all"
              placeholder="Search for a wrestler (e.g., John Cena, The Rock)"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setShowSuggestions(true)}
              disabled={loading}
              required
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 border border-gray-700 transition-colors flex items-center gap-2 ${
              showFilters || hasActiveFilters
                ? 'bg-pink-600 text-white border-pink-600'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <FiFilter className="w-4 h-4" />
            {hasActiveFilters && <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>}
          </button>
          
          <button
            type="submit"
            className="px-6 py-3 rounded-r-xl bg-gradient-to-r from-pink-600 to-yellow-500 hover:from-pink-700 hover:to-yellow-600 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </>
            ) : (
              <>
                <FiSearch className="w-4 h-4" />
                Search
              </>
            )}
          </button>
        </div>
        
        {showSuggestions && (
          <SearchSuggestions
            query={query}
            onSelect={handleSuggestionSelect}
            onSearch={handleSuggestionSearch}
          />
        )}
      </form>
      
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-40 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">Advanced Filters</h3>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-1"
                >
                  <FiX className="w-3 h-3" />
                  Clear
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Min Votes</label>
              <input
                type="number"
                value={filters.minVotes}
                onChange={(e) => setFilters(prev => ({ ...prev, minVotes: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-1 focus:ring-pink-400 focus:border-transparent focus:outline-none"
                placeholder="e.g., 100"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Min Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={filters.minRating}
                onChange={(e) => setFilters(prev => ({ ...prev, minRating: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-1 focus:ring-pink-400 focus:border-transparent focus:outline-none"
                placeholder="e.g., 7.0"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Birthplace</label>
              <input
                type="text"
                value={filters.birthplace}
                onChange={(e) => setFilters(prev => ({ ...prev, birthplace: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-1 focus:ring-pink-400 focus:border-transparent focus:outline-none"
                placeholder="e.g., USA"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;