import { useCallback, useEffect, useRef, useState } from 'react';
import warning from 'warning';
import { merge } from 'lodash-es';

import { browserSupports } from '../utils/componentUtilityFunctions';

const defaultOptions = {
  /**
   * the maximum number of elements to load. This is used to determine if the there are multiple
   * items to show
   */
  maxToLoad: 1,
  /* maximum number of items to load in each batch */
  loadBatchSize: 20,
  /* options passed to IntersectionObserver, see: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API */
  intersectionObserverOptions: {
    rootMargin: '100px 0px 100px 0px',
  },
};

/**
 * A simple hook to return a bool telling if the given element is visible on the screen. It can be
 * used to load a single item or multiple items. If maxToLoad is greater than 1, the first item in
 * the returned array will be an array of booleans telling how many of the items are to be loaded. The
 * loadBatchSize prop determines how many new items to mark as visible each time the reference element
 * is visible on screen. For example, if the loadBatchSize is 20 and you're scrolling down a table,
 * when the reference row becomes visible it will update the isVisible array to contain 20 new true
 * booleans.
 *
 * @param {*} ref html element to check if it's visible before rendering more items
 * @param {object} options
 * @returns Array an array containing [isVisible: bool | arrayOf(bool), moreToLoad: bool]
 */
const useVisibilityLoader = (ref, options) => {
  if (!browserSupports('IntersectionObserver')) {
    warning(
      !__DEV__,
      'The current browser does not support IntersectionObserver. You will need to include a IntersectionObserver polyfill for this component to function properly.'
    );
    return [true, false];
  }

  const { maxToLoad, loadBatchSize, intersectionObserverOptions } = merge(
    {},
    defaultOptions,
    options
  );

  /* eslint-disable react-hooks/rules-of-hooks */
  const observerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(maxToLoad > 1 ? [] : false);
  const [moreToLoad, setMoreToLoad] = useState(true);
  const [nextVisibleIndex, setNextVisibleIndex] = useState(0);
  const intersectionCallback = useCallback(
    (entries, ob) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const nextBatchSize = Math.max(0, Math.min(loadBatchSize, maxToLoad - nextVisibleIndex));
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
    [isVisible, loadBatchSize, maxToLoad, nextVisibleIndex, ref]
  );

  useEffect(() => {
    setMoreToLoad(nextVisibleIndex < maxToLoad);
  }, [maxToLoad, nextVisibleIndex]);

  useEffect(() => {
    if (ref.current && !observerRef.current && moreToLoad) {
      observerRef.current = new IntersectionObserver(
        intersectionCallback,
        intersectionObserverOptions
      );

      observerRef.current.observe(ref.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [
    isVisible,
    nextVisibleIndex,
    maxToLoad,
    ref,
    loadBatchSize,
    moreToLoad,
    intersectionObserverOptions,
    intersectionCallback,
  ]);
  /* eslint-enable react-hooks/rules-of-hooks */

  return [isVisible, moreToLoad];
};

export default useVisibilityLoader;
