import useResizeObserver from 'use-resize-observer';
import warning from 'warning';

import { browserSupports } from '../utils/componentUtilityFunctions';

const useSizeObserver = (ref) => {
  if (!browserSupports('ResizeObserver')) {
    warning(
      !__DEV__,
      'The current browser does not support ResizeObserver. You will need to include a ResizeObserver polyfill for this component to function properly.'
    );
    return [{ height: 0, width: 0 }, ref];
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { height = 0, width = 0 } = useResizeObserver({
    ref,
  });

  return [{ height, width }, ref];
};

export default useSizeObserver;
