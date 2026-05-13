import React, { useState, useEffect } from 'react';

export default function GoToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show the button when the user scrolls down 300px from the top
  const handleScroll = () => {
    const mainContainer = document.getElementById('main-container');
    const scrollTop = mainContainer ? mainContainer.scrollTop : document.body.scrollTop;
    
    if (scrollTop > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    const mainContainer = document.getElementById('main-container');
    if (mainContainer) {
      mainContainer.scrollTop = 0;
    } else {
      document.body.scrollTop = 0;
    }
  };

  useEffect(() => {
    const mainContainer = document.getElementById('main-container');
    
    // Add event listeners only if elements exist
    if (mainContainer) {
      mainContainer.addEventListener('scroll', handleScroll);
    }
    document.body.addEventListener('scroll', handleScroll);
  
    return () => {
      // Remove event listeners only if elements exist
      if (mainContainer) {
        mainContainer.removeEventListener('scroll', handleScroll);
      }
      document.body.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="go-to-top">
      {isVisible && (
        <button onClick={scrollToTop} className="top-button">
          ↑ Go to Top
        </button>
      )}
    </div>
  );
};
