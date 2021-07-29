import { useEffect, useState } from 'react';

import { useResize } from '../internal/UseResizeObserver';

/* eslint-disable no-else-return, no-useless-return */
const useHasTextOverflow = (elementRef) => {
  const [isOverflowed, setIsOverflowed] = useState(false);
  const currentRef = useResize(elementRef);

  useEffect(() => {
    if (
      currentRef.current &&
      (currentRef.current.scrollHeight > currentRef.current.clientHeight ||
        currentRef.current.scrollWidth > currentRef.current.clientWidth)
    ) {
      setIsOverflowed(true);
    } else {
      setIsOverflowed(false);
    }
  }, [currentRef, elementRef]);

  return isOverflowed;
};

export default useHasTextOverflow;
