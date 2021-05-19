import { useState, useEffect, useRef } from 'react';

const DEBOUNCE_TIMEOUT = 300;

const useWindowSize = (debounceDelay = DEBOUNCE_TIMEOUT) => {
  const [windowSize, setWindowSize] = useState({
    width: window?.innerWidth,
    height: window?.innerHeight,
  });
  const timer = useRef(null);

  const debounce = (fn, delay) => {
    return (...args) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

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
      clearTimeout(timer.current);
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, [debounceDelay]);

  return windowSize;
};

export default useWindowSize;
