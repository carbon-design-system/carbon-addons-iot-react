import { useEffect, useState } from 'react';

// import { useResize } from '../internal/UseResizeObserver';

/* eslint-disable no-else-return, no-useless-return */
const useHasTextOverflow = (elementRef) => {
  const [isOverflowed, setIsOverflowed] = useState(false);
  // useResize(elementRef);

  useEffect(() => {
    if (
      elementRef.current &&
      (elementRef.current.scrollHeight > elementRef.current.clientHeight ||
        elementRef.current.scrollWidth > elementRef.current.clientWidth)
    ) {
      setIsOverflowed(true);
    } else {
      setIsOverflowed(false);
    }
  });

  return isOverflowed;
};

export default useHasTextOverflow;
