import { useEffect, useState } from 'react';

const useHasTextOverflow = (elementRef = {}) => {
  const [isOverflowed, setIsOverflowed] = useState(false);

  useEffect(() => {
    if (elementRef.current && elementRef.current.clientWidth < elementRef.current.scrollWidth) {
      setIsOverflowed(true);
    } else {
      setIsOverflowed(false);
    }
  });

  return isOverflowed;
};

export default useHasTextOverflow;
