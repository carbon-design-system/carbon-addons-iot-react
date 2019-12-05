import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
};

const defaultProps = {
  children: null,
};

/** Supports our default render decisions for primitive values */
const TableCellRenderer = ({ children }) =>
  typeof children === 'string' || typeof children === 'number' ? (
    <span title={children}>{children}</span>
  ) : typeof children === 'boolean' ? ( // handle booleans
    <span title={children.toString()}>{children.toString()}</span>
  ) : (
    children
  );

TableCellRenderer.propTypes = propTypes;
TableCellRenderer.defaultProps = defaultProps;

export default TableCellRenderer;
