'use strict';

const { createTransformer } = require('babel-jest');

module.exports = createTransformer({
  presets: ['env', 'stage-1', 'react', 'flow'],
});
