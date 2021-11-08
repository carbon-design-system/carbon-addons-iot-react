import { useEffect, useState } from 'react';

const useHasTextOverflow = (elementRef) => {
  const [isOverflowed, setIsOverflowed] = useState(false);

  useEffect(() => {
    const overFlowing =
      elementRef.current &&
      (elementRef.current.scrollHeight > elementRef.current.clientHeight ||
        elementRef.current.scrollWidth > elementRef.current.clientWidth);
    setIsOverflowed(overFlowing);
  }, [elementRef]);

  return isOverflowed;
};

export default useHasTextOverflow;
