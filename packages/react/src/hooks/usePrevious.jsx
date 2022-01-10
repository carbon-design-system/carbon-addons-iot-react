import { useEffect, useRef } from 'react';

/**
 * Store a value between renders and return what it was assigned previously.
 *
 * @param {*} value something you want to store the value of between renders to do comparisons against
 * @returns * the value passed to the hook on the previous render
 */
export function usePrevious(value, initialValue) {
  const ref = useRef(initialValue);

  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
