const React = require('react');

module.exports = React.forwardRef((props, ref) =>
  React.createElement('div', { id: 'mock-stacked-area-chart', ref })
);
