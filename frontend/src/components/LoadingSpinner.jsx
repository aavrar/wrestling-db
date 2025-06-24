import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div className="h-full w-full rounded-full border-4 border-gray-600 border-t-pink-500"></div>
      </div>
      {text && (
        <p className="mt-4 text-gray-400 text-sm">{text}</p>
      )}
    </div>
  );
};

export const SkeletonLoader = ({ type = 'profile' }) => {
  if (type === 'profile') {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 animate-pulse">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          {/* Image skeleton */}
          <div className="w-48 h-48 bg-gray-700 rounded-2xl"></div>
          
          {/* Content skeleton */}
          <div className="flex-1 space-y-4">
            <div className="h-12 bg-gray-700 rounded w-3/4"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 bg-gray-700 rounded"></div>
              <div className="h-20 bg-gray-700 rounded"></div>
              <div className="h-20 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
        
        {/* Bio skeleton */}
        <div className="mt-8 space-y-3">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (type === 'search') {
    return (
      <div className="mt-8 w-full max-w-xl mx-auto animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="bg-gray-800 rounded-xl divide-y divide-gray-700">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6">
              <div className="h-5 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <LoadingSpinner />;
};

export default LoadingSpinner;