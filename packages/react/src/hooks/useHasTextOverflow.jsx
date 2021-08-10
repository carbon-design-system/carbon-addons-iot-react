import { useEffect, useState } from 'react';

/* eslint-disable no-else-return, no-useless-return */
const useHasTextOverflow = (elementRef) => {
  const [isOverflowed, setIsOverflowed] = useState(false);

  useEffect(() => {
    const overFlowing =
      elementRef.current &&
      (elementRef.current.scrollHeight > elementRef.current.clientHeight ||
        elementRef.current.scrollWidth > elementRef.current.clientWidth);
    setIsOverflowed(overFlowing);
  });

  return isOverflowed;
};

export default useHasTextOverflow;
