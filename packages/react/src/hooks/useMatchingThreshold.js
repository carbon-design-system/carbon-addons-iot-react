import { isNil } from 'lodash-es';

const useMatchingThreshold = ({ thresholds, value }) => {
  if (!thresholds?.length) {
    return null;
  }

  return thresholds
    .filter((t) => {
      if (typeof t.comparison === 'function') {
        return t.comparison(value);
      }

      switch (t.comparison) {
        case '<':
          return !isNil(value) && value < t.value;
        case '>':
          return value > t.value;
        case '=':
          return value === t.value;
        case '<=':
          return !isNil(value) && value <= t.value;
        case '>=':
          return value >= t.value;
        default:
          return false;
      }
    })
    .concat([null])[0];
};

export default useMatchingThreshold;
