/**
 * @file useLangDirection.jsx
 * @description A React hook that tracks the text direction (LTR/RTL) of the HTML document
 * and updates when it changes.
 */
import { useEffect, useState, useRef } from 'react';

/**
 * React hook that returns the current language direction ('ltr' or 'rtl')
 * from the HTML element's 'dir' attribute and updates when it changes.
 *
 * @returns {string} The current language direction ('ltr' or 'rtl')
 */
export function useLangDirection() {
  const { current: isServerSide } = useRef(
    typeof window === 'undefined' || typeof document === 'undefined'
  );

  // Target the HTML element
  const element = document.getElementsByTagName('html')[0];
  // Lazy initialize direction
  const [direction, setDirection] = useState(() => {
    if (isServerSide) {
      return null;
    }
    // Set initial direction
    return element.getAttribute('dir') || 'ltr';
  });
  const observer = useRef(null);

  useEffect(() => {
    // Return early if in server environment
    if (isServerSide) {
      return;
    }
    // Callback function to execute when mutations are observed
    const callback = (mutationsList) => {
      // Use traditional for loop for better compatibility
      for (let i = 0; i < mutationsList.length; i += 1) {
        const mutation = mutationsList[i];
        // Check if the mutation was for the 'dir' attribute
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'dir' &&
          mutation.oldValue !== element.getAttribute('dir')
        ) {
          // Update the direction state
          setDirection(element.getAttribute('dir'));
        }
      }
    };

    // Disconnect any existing observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // Configure the observer to watch for attribute changes
    const config = {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['dir'],
    };

    // Create a new MutationObserver
    observer.current = new MutationObserver(callback);

    // Start observing the HTML element
    observer.current.observe(element, config);

    // Cleanup function to disconnect the observer on unmount
    // eslint-disable-next-line consistent-return
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [element, isServerSide]); // No dependencies needed as element is constant

  // Return the current direction, defaulting to 'ltr' if not set or in server environment
  return isServerSide.current ? 'ltr' : direction || 'ltr';
}

// Made with Bob
