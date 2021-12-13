import { useMemo } from 'react';
import { merge } from 'lodash-es';

const useMerged = (...args) => {
  return useMemo(() => merge({}, ...args), [args]);
};

export default useMerged;
