import { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';

const DEBOUNCE_TIMEOUT = 300;

const useWindowSize = (debounceDelay = DEBOUNCE_TIMEOUT) => {
  const [windowSize, setWindowSize] = useState({
    width: window?.innerWidth,
    height: window?.innerHeight,
  });

  // Set new values according to the window object dimensions
  const handleResize = () => {
    setWindowSize({
      width: window?.innerWidth,
      height: window?.innerHeight,
    });
  };

  useEffect(() => {
    const debouncedHandleResize = debounce(handleResize, debounceDelay);
    // Resize event listener
    window.addEventListener('resize', debouncedHandleResize);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, [debounceDelay]);

  return windowSize;
};

export default useWindowSize;
