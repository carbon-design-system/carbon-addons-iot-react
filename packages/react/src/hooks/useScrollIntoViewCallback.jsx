import { useRef, useCallback, useEffect } from 'react';

/**
 *
 * @param {Function} callback - required callback function to call when intersecting
 * @param {Boolean} loading - optional loading boolean to return without setting up observer
 * @returns {Object} scrollItemRef
 * @example const { scrollItemRef } = useScrollIntoViewCallback(callback, loading);
 */
export default function useScrollIntoViewCallback(callback, loading) {
  const observer = useRef();
  useEffect(
    () => () => {
      // Disconnect from any old observers
      if (observer.current) {
        observer.current.disconnect();
      }
    },
    []
  );

  const scrollItemRef = useCallback(
    (node) => {
      // If loading just return
      if (loading) {
        return;
      }
      // Disconnect from any old observers
      if (observer.current) {
        observer.current.disconnect();
      }
      // Create a new observer
      observer.current = new IntersectionObserver((entries) => {
        // If scrollItemRef is in veiwport call callback function
        if (entries[0].isIntersecting) {
          callback();
        }
      });
      // Once component mounts tell our observer to observe it
      if (node && observer.current) {
        observer.current.observe(node);
      }
    },
    [loading, callback]
  );

  return { scrollItemRef };
}
