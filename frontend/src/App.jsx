import React, { useState } from "react";
import ProfileTabs from "./components/ProfileTabs";
import SearchForm from "./components/SearchForm";
import { SkeletonLoader } from "./components/LoadingSpinner";
import ErrorDisplay, { ErrorBoundary } from "./components/ErrorDisplay";

function SearchResults({ results, onSelect, loading }) {
  if (loading) {
    return <SkeletonLoader type="search" />;
  }
  
  if (!results.length) {
    return (
      <ErrorDisplay 
        type="search" 
        showRetry={false}
      />
    );
  }
  
  return (
    <div className="mt-8 w-full max-w-7xl mx-auto px-4">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        🔍 Search Results
        <span className="text-sm font-normal text-gray-400">({results.length} found)</span>
      </h2>
      
      {/* Mobile List View */}
      <div className="block lg:hidden">
        <ul className="bg-gray-800 rounded-xl shadow divide-y divide-gray-700">
          {results.map(w => (
            <li key={w.id}>
              <button
                className="w-full text-left px-6 py-4 hover:bg-pink-600/30 transition text-white font-medium flex items-center justify-between group"
                onClick={() => onSelect(w.id)}
              >
                <div className="flex flex-col items-start">
                  <span className="text-white font-medium">{w.name}</span>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                    {w.birthplace && <span>📍 {w.birthplace.split(',')[0]}</span>}
                    {w.rating && w.rating !== "0" && <span>⭐ {w.rating}</span>}
                    {w.votes > 0 && <span className="text-pink-400 font-medium">🗳️ {w.votes}</span>}
                  </div>
                </div>
                <span className="text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Desktop Grid View */}
      <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map(w => (
          <button
            key={w.id}
            onClick={() => onSelect(w.id)}
            className="bg-gray-800 rounded-xl p-6 hover:bg-pink-600/20 hover:border-pink-500 border border-gray-700 transition-all duration-200 text-left group hover:scale-105 transform"
          >
            <div className="flex flex-col h-full">
              <h3 className="text-white font-bold text-lg mb-3 group-hover:text-pink-300 transition-colors line-clamp-2">
                {w.name}
              </h3>
              
              <div className="space-y-2 flex-1">
                {w.birthplace && (
                  <div className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-blue-400">📍</span>
                    <span className="line-clamp-2">{w.birthplace}</span>
                  </div>
                )}
                
                {w.rating && w.rating !== "0" && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-yellow-300 font-medium">{w.rating}/10</span>
                  </div>
                )}
              </div>
              
              {w.votes > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Community Votes</span>
                    <span className="text-pink-400 font-bold text-lg">{w.votes.toLocaleString()}</span>
                  </div>
                </div>
              )}
              
              <div className="mt-4 text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                View Profile →
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function WrestlerProfile({ profile, onBack, loading }) {
  if (loading) {
    return (
      <div className="mt-10 w-full">
        <button
          className="mb-6 text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-2"
          onClick={onBack}
        >
          ← Back to results
        </button>
        <SkeletonLoader type="profile" />
      </div>
    );
  }

  return (
    <div className="mt-10 w-full">
      <button
        className="mb-6 text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-2 font-medium"
        onClick={onBack}
      >
        ← Back to results
      </button>
      <ProfileTabs profile={profile} />
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState("general");

  const searchWrestlers = async (searchQuery, filters = {}) => {
    if (!searchQuery.trim()) return;
    
    setQuery(searchQuery);
    setLoading(true);
    setError("");
    setErrorType("general");
    setProfile(null);
    setResults([]);
    
    try {
      let url = `http://localhost:8000/api/search/${encodeURIComponent(searchQuery.trim())}`;
      
      // Add filters as query parameters
      const params = new URLSearchParams();
      if (filters.minVotes) params.append('minVotes', filters.minVotes);
      if (filters.minRating) params.append('minRating', filters.minRating);
      if (filters.birthplace) params.append('birthplace', filters.birthplace);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const resp = await fetch(url);
      
      if (!resp.ok) {
        if (resp.status === 404) {
          setErrorType("search");
          setError(`No wrestlers found for "${searchQuery}"`);
        } else {
          setErrorType("network");
          setError("Unable to connect to the wrestling database.");
        }
        return;
      }
      
      const data = await resp.json();
      
      if (!data || data.length === 0) {
        setErrorType("search");
        setError(`No wrestlers found for "${searchQuery}"`);
      } else {
        setResults(data);
      }
    } catch (err) {
      setErrorType("network");
      setError("Unable to connect to the wrestling database.");
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (id) => {
    setProfileLoading(true);
    setError("");
    setErrorType("general");
    
    try {
      const resp = await fetch(`http://localhost:8000/api/wrestler/${id}`);
      
      if (!resp.ok) {
        if (resp.status === 404) {
          setErrorType("profile");
          setError("Wrestler profile not found.");
        } else {
          setErrorType("network");
          setError("Unable to load wrestler profile.");
        }
        return;
      }
      
      const data = await resp.json();
      setProfile(data);
      setResults([]); // Clear search results when viewing profile
    } catch (err) {
      setErrorType("network");
      setError("Unable to connect to the wrestling database.");
      console.error('Profile fetch error:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 font-sans">
      <header className="flex flex-col items-center py-8 bg-gradient-to-r from-pink-600 to-yellow-500 shadow-lg">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-6">Wrestler Stats</h1>
        <SearchForm
          onSearch={searchWrestlers}
          loading={loading}
          initialQuery={query}
        />
      </header>
      <main className="flex flex-col items-center px-4 pb-16">
        <ErrorBoundary>
          {error && (
            <ErrorDisplay 
              error={error}
              type={errorType}
              onRetry={() => {
                setError("");
                if (errorType === "search") {
                  const form = document.querySelector('form');
                  if (form) form.requestSubmit();
                } else if (profile) {
                  // Retry profile fetch
                  const currentProfile = profile;
                  setProfile(null);
                  fetchProfile(currentProfile.id || results[0]?.id);
                }
              }}
            />
          )}
          
          {!error && !profile && results.length > 0 && (
            <SearchResults 
              results={results} 
              onSelect={fetchProfile} 
              loading={loading}
            />
          )}
          
          {!error && profile && (
            <WrestlerProfile 
              profile={profile} 
              onBack={() => {
                setProfile(null);
                setError("");
              }}
              loading={profileLoading}
            />
          )}
          
          {!loading && !error && !profile && results.length === 0 && query && (
            <div className="mt-16 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">Ready to Search</h3>
              <p className="text-gray-500">Enter a wrestler's name above to get started</p>
            </div>
          )}
        </ErrorBoundary>
      </main>
      <footer className="flex flex-col items-center gap-4 px-5 py-8 text-center bg-gray-900 mt-10">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a className="text-gray-400 text-base hover:text-pink-400 transition" href="#">About</a>
          <a className="text-gray-400 text-base hover:text-pink-400 transition" href="#">Contact</a>
          <a className="text-gray-400 text-base hover:text-pink-400 transition" href="#">Terms of Service</a>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#"><span className="text-gray-400 hover:text-pink-400 transition">Twitter</span></a>
          <a href="#"><span className="text-gray-400 hover:text-pink-400 transition">Instagram</span></a>
        </div>
        <p className="text-gray-400 text-base">@2024 Wrestler Stats. All rights reserved.</p>
      </footer>
    </div>
  );
}
