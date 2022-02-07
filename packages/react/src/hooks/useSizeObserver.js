import useResizeObserver from 'use-resize-observer';
import warning from 'warning';

import { browserSupports } from '../utils/componentUtilityFunctions';

/**
 * A wrapper hook around useResizeObserver to throw a warning if the environment does not support
 * ResizeObserver.
 *
 * @param {Object} object An optional object containing initialHeight, initialWidth, and a ref. ie. {initialHeight: 0, initialWidth: 0, ref}
 * @returns Array an array containing an object with height and width, and the ref. ie. [{height, width}, ref]
 */
const useSizeObserver = ({ initialHeight = 0, initialWidth = 0, ref = undefined } = {}) => {
  if (!browserSupports('ResizeObserver')) {
    warning(
      !__DEV__,
      'The current browser does not support ResizeObserver. You will need to include a ResizeObserver polyfill for this component to function properly.'
    );
    return [{ height: initialHeight, width: initialWidth }, ref];
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { height = initialHeight, width = initialWidth, ref: observerRef } = useResizeObserver({
    ref,
  });

  return [{ height, width }, observerRef];
};

export default useSizeObserver;
