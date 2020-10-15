import useResizeObserver from 'use-resize-observer';
import warning from 'warning';

import { browserSupports } from '../utils/componentUtilityFunctions';

export const useResize = (resizeRef) => {
  if (!browserSupports('ResizeObserver')) {
    warning(
      !__DEV__,
      'The current browser does not support ResizeObserver. You will need to include a ResizeObserver polyfill for this component to function properly.'
    );
    return null;
  }

  /**
   * use-resize-observer currently crashes if it is unsupported
   * we need to conditionally set this hook for now until it is fixed in the library
   */
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useResizeObserver({
    useDefaults: false,
    ref: resizeRef,
  });

  return resizeRef;
};
