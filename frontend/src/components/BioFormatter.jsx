import React, { useState } from 'react';

const BioFormatter = ({ bio, maxLength = 500 }) => {
  const [expanded, setExpanded] = useState(false);

  if (!bio) return null;

  // Clean and format the bio text
  const cleanBio = bio
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/\n+/g, '\n') // Multiple newlines to single newline
    .trim();

  // Split into paragraphs
  const paragraphs = cleanBio.split('\n').filter(p => p.trim());

  // Check if bio needs truncation
  const needsTruncation = cleanBio.length > maxLength;
  const truncatedBio = needsTruncation ? cleanBio.substring(0, maxLength) : cleanBio;

  // Format text with basic markdown-like formatting
  const formatText = (text) => {
    return text
      .split('\n')
      .map((paragraph, index) => {
        // Handle bold text (wrap with **)
        let formatted = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Handle italic text (wrap with *)
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Handle dates (DD.MM.YYYY format)
        formatted = formatted.replace(/(\d{1,2}\.\d{1,2}\.\d{4})/g, '<span class="text-pink-400 font-medium">$1</span>');
        
        // Handle wrestling promotions (common ones)
        const promotions = ['WWE', 'AEW', 'WCW', 'ECW', 'TNA', 'IMPACT', 'ROH', 'NJPW', 'PWG'];
        promotions.forEach(promotion => {
          const regex = new RegExp(`\\b(${promotion})\\b`, 'gi');
          formatted = formatted.replace(regex, '<span class="text-yellow-400 font-medium">$1</span>');
        });

        return (
          <p 
            key={index} 
            className="mb-3 last:mb-0" 
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      });
  };

  if (!needsTruncation) {
    return (
      <div className="text-gray-300 leading-relaxed">
        {formatText(cleanBio)}
      </div>
    );
  }

  return (
    <div className="text-gray-300 leading-relaxed">
      {!expanded ? (
        <>
          {formatText(truncatedBio)}
          <button
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-1 mt-2 text-pink-400 hover:text-pink-300 transition-colors font-medium"
          >
            <span>Read more</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </>
      ) : (
        <>
          {formatText(cleanBio)}
          <button
            onClick={() => setExpanded(false)}
            className="inline-flex items-center gap-1 mt-2 text-pink-400 hover:text-pink-300 transition-colors font-medium"
          >
            <span>Show less</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default BioFormatter;