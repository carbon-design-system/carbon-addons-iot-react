import { useMemo } from 'react';
import { merge } from 'lodash-es';

const useMerged = (...args) => {
  // since the spread args is an array, we don't need to wrap it in another array. Doing so breaks
  // the useMemo because a new array would be created with each render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => merge({}, ...args), args);
};

export default useMerged;
