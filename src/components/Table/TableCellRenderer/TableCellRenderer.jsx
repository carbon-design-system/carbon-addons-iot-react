import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {
  children: null,
};

const TableCellRenderer = ({ children }) =>
  typeof children === 'string' || typeof children === 'number' ? (
    <span title={children}>{children}</span>
  ) : (
    children
  );

TableCellRenderer.propTypes = propTypes;
TableCellRenderer.defaultProps = defaultProps;

export default TableCellRenderer;
