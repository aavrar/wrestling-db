import React, { useState, useMemo } from 'react';

const PaginatedMatchHistory = ({ matches, wrestlerName }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [matchesPerPage, setMatchesPerPage] = useState(25);
  const [filterPromotion, setFilterPromotion] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // newest, oldest

  // Get unique promotions for filter
  const promotions = useMemo(() => {
    const uniquePromotions = [...new Set(matches.map(match => match.promotion))].filter(Boolean);
    return uniquePromotions.sort();
  }, [matches]);

  // Filter and sort matches
  const filteredAndSortedMatches = useMemo(() => {
    let filtered = matches;

    // Filter by promotion
    if (filterPromotion) {
      filtered = filtered.filter(match => match.promotion === filterPromotion);
    }

    // Sort by date
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date.split('.').reverse().join('-')); // Convert DD.MM.YYYY to YYYY-MM-DD
      const dateB = new Date(b.date.split('.').reverse().join('-'));
      
      if (sortOrder === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    return filtered;
  }, [matches, filterPromotion, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedMatches.length / matchesPerPage);
  const startIndex = (currentPage - 1) * matchesPerPage;
  const endIndex = startIndex + matchesPerPage;
  const currentMatches = filteredAndSortedMatches.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterPromotion, sortOrder, matchesPerPage]);

  const getMatchResult = (match, wrestlerName) => {
    const matchLower = match.match.toLowerCase();
    const wrestlerNameLower = wrestlerName.toLowerCase();
    
    if (matchLower.includes(`${wrestlerNameLower} defeats`) || 
        (matchLower.startsWith(`${wrestlerNameLower} `) && matchLower.includes(" defeats "))) {
      return { result: 'win', color: 'text-green-400', icon: '✓' };
    } else if (matchLower.includes(` defeats ${wrestlerNameLower}`) ||
               matchLower.includes(`defeat ${wrestlerNameLower}`)) {
      return { result: 'loss', color: 'text-red-400', icon: '✗' };
    } else if (matchLower.includes("draw") || matchLower.includes("no contest")) {
      return { result: 'draw', color: 'text-yellow-400', icon: '—' };
    } else {
      return { result: 'unknown', color: 'text-gray-400', icon: '?' };
    }
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && setCurrentPage(page)}
            disabled={page === '...'}
            className={`px-3 py-2 text-sm rounded ${
              page === currentPage
                ? 'bg-pink-600 text-white'
                : page === '...'
                ? 'text-gray-500 cursor-default'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    );
  };

  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🥊</div>
        <h3 className="text-xl font-bold text-gray-300 mb-2">No Match History Available</h3>
        <p className="text-gray-500">Broadcasted match data will appear here when available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🥊 Match History
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {filteredAndSortedMatches.length} broadcasted matches total
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          {/* Promotion Filter */}
          <select
            value={filterPromotion}
            onChange={(e) => setFilterPromotion(e.target.value)}
            className="px-3 py-2 bg-gray-700 text-white rounded text-sm border border-gray-600 focus:border-pink-400 focus:outline-none"
          >
            <option value="">All Promotions</option>
            {promotions.map(promotion => (
              <option key={promotion} value={promotion}>{promotion}</option>
            ))}
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 bg-gray-700 text-white rounded text-sm border border-gray-600 focus:border-pink-400 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          {/* Matches per page */}
          <select
            value={matchesPerPage}
            onChange={(e) => setMatchesPerPage(parseInt(e.target.value))}
            className="px-3 py-2 bg-gray-700 text-white rounded text-sm border border-gray-600 focus:border-pink-400 focus:outline-none"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedMatches.length)} of {filteredAndSortedMatches.length} matches
        </div>
        <div>
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Matches list */}
      <div className="space-y-3">
        {currentMatches.map((match, index) => {
          const matchResult = getMatchResult(match, wrestlerName);
          
          return (
            <div
              key={startIndex + index}
              className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    {/* Match result indicator */}
                    <span className={`text-lg font-bold ${matchResult.color}`}>
                      {matchResult.icon}
                    </span>
                    
                    {/* Promotion */}
                    <span className="text-sm font-medium text-pink-400 bg-pink-400/20 px-2 py-1 rounded">
                      {match.promotion}
                    </span>
                    
                    {/* Date */}
                    <span className="text-sm text-gray-300">
                      {match.date}
                    </span>
                  </div>
                  
                  {/* Match description */}
                  <p className="text-white text-sm leading-relaxed">
                    {match.match}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <Pagination />

      {/* Summary stats for current page */}
      {currentMatches.length > 0 && (
        <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-700">
          Viewing {matchesPerPage > filteredAndSortedMatches.length ? 'all' : matchesPerPage} matches per page
          {filterPromotion && ` • Filtered by ${filterPromotion}`}
          {sortOrder === 'newest' ? ' • Newest first' : ' • Oldest first'}
        </div>
      )}
    </div>
  );
};

export default PaginatedMatchHistory;