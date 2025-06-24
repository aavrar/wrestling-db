import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ src, alt, className, fallback, placeholder }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  return (
    <div ref={imgRef} className={className}>
      {!inView && (
        <div className={`${className} bg-gray-700 animate-pulse flex items-center justify-center`}>
          {placeholder || (
            <div className="text-gray-500">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      )}
      
      {inView && !error && (
        <>
          {!loaded && (
            <div className={`${className} bg-gray-700 animate-pulse flex items-center justify-center absolute`}>
              <div className="text-gray-500">
                <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            onLoad={handleLoad}
            onError={handleError}
          />
        </>
      )}
      
      {(inView && error) && (
        fallback || (
          <div className={`${className} bg-gradient-to-br from-pink-600 to-yellow-500 flex items-center justify-center`}>
            <span className="text-white font-bold text-2xl">
              {alt?.charAt(0) || '?'}
            </span>
          </div>
        )
      )}
    </div>
  );
};

export default LazyImage;