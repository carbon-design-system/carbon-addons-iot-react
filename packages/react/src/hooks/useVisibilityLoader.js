import { useCallback, useEffect, useRef, useState } from 'react';
import warning from 'warning';
import { merge } from 'lodash-es';

import { browserSupports } from '../utils/componentUtilityFunctions';

const defaultOptions = {
  /** are there more items available to load */
  hasMoreToLoad: true,
  /** is the application already loading new data */
  isLoading: false,
  keepObservingAfterVisible: false,
  /** a callback that will be triggered when the ref element becomes visible */
  onVisible: null,
  /* options passed to IntersectionObserver, see: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API */
  intersectionObserverOptions: {
    rootMargin: '0px',
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

  const {
    hasMoreToLoad,
    isLoading,
    onVisible,
    intersectionObserverOptions,
    keepObservingAfterVisible,
  } = merge({}, defaultOptions, options);

  /* eslint-disable react-hooks/rules-of-hooks */
  const observerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const intersectionCallback = useCallback(
    (entries, ob) => {
      if (isLoading) {
        return;
      }

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (typeof onVisible === 'function') {
            onVisible();
          }
          setIsVisible(true);

          // need to check that the visibility ref item is still available in the dom, because
          // it may have been removed by the application code after all items were loaded.
          if (ref.current && !keepObservingAfterVisible) {
            ob.unobserve(ref.current);
          }
        } else {
          setIsVisible(false);
        }
      });
    },
    [isLoading, keepObservingAfterVisible, onVisible, ref]
  );

  useEffect(() => {
    if (ref.current && !observerRef.current && hasMoreToLoad) {
      observerRef.current = new IntersectionObserver(
        intersectionCallback,
        intersectionObserverOptions
      );

      if (ref.current instanceof Element) {
        observerRef.current.observe(ref.current);
      } else {
        warning(!__DEV__, `The ref passed to useVisibleLoader must be an Element.`);
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [isVisible, intersectionObserverOptions, intersectionCallback, hasMoreToLoad, ref]);
  /* eslint-enable react-hooks/rules-of-hooks */

  return [isVisible];
};

export default useVisibilityLoader;
