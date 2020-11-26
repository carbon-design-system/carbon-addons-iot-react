'use strict';

// This is a custom Jest transformer turning style imports into empty objects.
// https://jestjs.io/docs/en/webpack
module.exports = {
  process() {
    return 'module.exports = {};';
  },
  getCacheKey() {
    // The output is always the same.
    return 'cssTransform';
  },
};
