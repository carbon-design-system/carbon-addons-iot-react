import { useEffect, useLayoutEffect, useState } from 'react';
import warning from 'warning';

import { browserSupports } from '../utils/componentUtilityFunctions';

const useVisibilityLoader = (ref, { maxToLoad = 1, loadBatchSize = 20 } = {}) => {
  if (!browserSupports('IntersectionObserver')) {
    warning(
      !__DEV__,
      'The current browser does not support ResizeObserver. You will need to include a ResizeObserver polyfill for this component to function properly.'
    );
    return [true, false];
  }

  /* eslint-disable react-hooks/rules-of-hooks */
  const [isVisible, setIsVisible] = useState(maxToLoad > 1 ? [] : false);
  const [moreToLoad, setMoreToLoad] = useState(true);
  const [nextVisibleIndex, setNextVisibleIndex] = useState(0);

  useEffect(() => {
    setMoreToLoad(nextVisibleIndex < maxToLoad);
  }, [maxToLoad, nextVisibleIndex]);

  useLayoutEffect(() => {
    if (ref.current && moreToLoad) {
      const observer = new IntersectionObserver(
        (entries, ob) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const nextBatchSize = Math.max(
                0,
                Math.min(loadBatchSize, maxToLoad - nextVisibleIndex)
              );
              const nextBatch = Array(nextBatchSize)
                .fill()
                .reduce((carry, _, index) => {
                  if (nextVisibleIndex + index <= maxToLoad) {
                    return {
                      ...carry,
                      [nextVisibleIndex + index]: true,
                    };
                  }

                  return carry;
                }, {});

              setIsVisible(Object.assign([], isVisible, nextBatch));
              setNextVisibleIndex((prev) => prev + nextBatchSize);

              if (nextVisibleIndex === maxToLoad) {
                ob.unobserve(ref.current);
              }
            }
          });
        },
        {
          rootMargin: '300px 0px 300px 0px',
        }
      );

      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      };
    }

    return () => {};
  }, [isVisible, nextVisibleIndex, maxToLoad, ref, loadBatchSize, moreToLoad]);
  /* eslint-enable react-hooks/rules-of-hooks */

  return [isVisible, moreToLoad];
};

export default useVisibilityLoader;
