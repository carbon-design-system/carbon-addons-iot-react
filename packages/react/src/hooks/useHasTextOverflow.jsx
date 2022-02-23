import { useEffect, useState } from 'react';

const useHasTextOverflow = (elementRef, text = '') => {
  const [isOverflowed, setIsOverflowed] = useState(false);

  useEffect(() => {
    const overFlowing =
      elementRef.current &&
      (elementRef?.current?.scrollHeight > elementRef?.current?.clientHeight ||
        elementRef?.current?.scrollWidth > elementRef?.current?.clientWidth);
    setIsOverflowed(overFlowing);
    /* disabling to not put the ref in dep array */
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [
    elementRef?.current?.clientHeight,
    elementRef?.current?.clientWidth,
    elementRef?.current?.scrollHeight,
    elementRef?.current?.scrollWidth,
    text,
  ]);

  return isOverflowed;
};

export default useHasTextOverflow;
