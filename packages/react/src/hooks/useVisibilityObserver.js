import { useEffect, useRef, useState } from 'react';
import warning from 'warning';

import { browserSupports } from '../utils/componentUtilityFunctions';

import { usePrevious } from './usePrevious';

const observers = new Map();

const removeObserver = (element) => {
  if (observers.has(element)) {
    const observer = observers.get(element);
    observer.disconnect();
    observers.delete(element);
  }
};

const getObserver = (element, { setIsVisible, unobserveAfterVisible, ...options }) => {
  if (!observers.has(element)) {
    observers.set(
      element,
      new IntersectionObserver(([entry], observer) => {
        setIsVisible(entry.isIntersecting);

        if (unobserveAfterVisible && entry.isIntersecting) {
          observer.unobserve(element);
          removeObserver(element);
        }
      }, options)
    );
  }

  return observers.get(element);
};

const defaultOptions = {
  /** a callback that will be triggered when the ref element visibility changes */
  // eslint-disable-next-line no-unused-vars
  onChange: ({ isVisible }) => {},

  /**
   * what percentage of the element must be visible for onChange to be called (0.0 through 1.0)
   * 0.0 means any pixel is visible
   * 1.0 means all pixels are visible
   * */
  threshold: 0.0,

  /**
   * The element, relative to the element being observed, that determines if it is visible.
   * For example, if this is left null the element is tracked against the window, but if a scrollable
   * div is given, the visibility is checked against that scrollable area instead.
   */
  container: null,

  /**
   * A string, in the form of a css margin (ie. `100px 0px 100px 0px`, units MUST be included), that
   * sets the bounds of the visible area. If you want this to expand to trigger visibility outside
   * of the root element, simply give it a large padding. In the example above, `100px 0px 100px 0`
   * expands the visible area 100px above and below the container, so any elements that come within
   * 100px of the top or bottom of the container will be treated as visible. This allows elements to
   * be pre-loaded off screen as a user is scrolling.
   */
  padding: '50% 0px 50% 0px',

  /**
   * If true, stop tracking the element after it has become visible otherwise, it will continue to
   * track the element and trigger onChange each time it changes visibility
   */
  unobserveAfterVisible: false,
};

/**
 * A simple hook to return a bool telling if the given element is visible on the screen. It can be
 * used to load a single item or multiple items.
 *
 * @param {*} elementRef html element to check if it's visible
 * @param {object} options see defaultOptions above
 * @returns Array an array containing [isVisible: bool]
 */
const useVisibilityObserver = (elementRef, options) => {
  if (!browserSupports('IntersectionObserver')) {
    warning(
      !__DEV__,
      'The current browser does not support IntersectionObserver. You will need to include a IntersectionObserver polyfill for this component to function properly.'
    );
    return [true];
  }

  const { onChange, threshold, container, padding, unobserveAfterVisible } = {
    ...defaultOptions,
    ...options,
  };

  /* eslint-disable react-hooks/rules-of-hooks */
  const observerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const previousIsVisible = usePrevious(isVisible, false);

  useEffect(() => {
    if (isVisible !== previousIsVisible) {
      onChange({ isVisible });
    }
  }, [isVisible, onChange, previousIsVisible]);

  useEffect(() => {
    const { current: elementToObserve } = elementRef;
    if (elementToObserve) {
      observerRef.current = getObserver(elementToObserve, {
        setIsVisible,
        unobserveAfterVisible,
        root: container,
        rootMargin: padding,
        threshold,
      });

      observerRef.current.observe(elementToObserve);
    }

    return () => {
      if (observerRef.current) {
        removeObserver(elementToObserve);
      }
    };
  }, [container, elementRef, padding, threshold, unobserveAfterVisible]);
  /* eslint-enable react-hooks/rules-of-hooks */

  return [isVisible];
};

export default useVisibilityObserver;
