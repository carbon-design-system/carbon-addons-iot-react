const React = require('react');

module.exports = React.forwardRef((props, ref) =>
  React.createElement('div', { id: 'mock-area-chart', ref })
);
