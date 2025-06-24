import React from 'react';

const ErrorDisplay = ({ 
  error, 
  onRetry, 
  type = 'general',
  showRetry = true 
}) => {
  const getErrorContent = () => {
    switch (type) {
      case 'search':
        return {
          icon: '🔍',
          title: 'No Wrestlers Found',
          message: error || 'Try searching with a different name or check your spelling.',
          suggestions: [
            'Check the spelling of the wrestler\'s name',
            'Try searching with just the first or last name',
            'Use common wrestling names or nicknames'
          ]
        };
      case 'profile':
        return {
          icon: '👤',
          title: 'Profile Not Available',
          message: error || 'Unable to load wrestler profile data.',
          suggestions: [
            'The wrestler profile might be temporarily unavailable',
            'Try selecting a different wrestler',
            'Check your internet connection'
          ]
        };
      case 'network':
        return {
          icon: '🌐',
          title: 'Connection Problem',
          message: error || 'Unable to connect to the wrestling database.',
          suggestions: [
            'Check your internet connection',
            'The server might be temporarily down',
            'Try again in a few moments'
          ]
        };
      default:
        return {
          icon: '⚠️',
          title: 'Something Went Wrong',
          message: error || 'An unexpected error occurred.',
          suggestions: [
            'Try refreshing the page',
            'Check your internet connection',
            'Contact support if the problem persists'
          ]
        };
    }
  };

  const { icon, title, message, suggestions } = getErrorContent();

  return (
    <div className="max-w-md mx-auto mt-8 p-8 bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-500/30 rounded-2xl text-center">
      <div className="text-6xl mb-4">{icon}</div>
      
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      
      <p className="text-gray-300 mb-6 leading-relaxed">{message}</p>
      
      {suggestions && (
        <div className="text-left mb-6">
          <h4 className="text-sm font-semibold text-gray-200 mb-2">Try this:</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-pink-400 mt-0.5">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const handleError = (error) => {
      setHasError(true);
      setError(error);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  if (hasError) {
    return fallback || (
      <ErrorDisplay 
        error="The application encountered an unexpected error."
        onRetry={() => {
          setHasError(false);
          setError(null);
          window.location.reload();
        }}
        type="general"
      />
    );
  }

  return children;
};

export default ErrorDisplay;