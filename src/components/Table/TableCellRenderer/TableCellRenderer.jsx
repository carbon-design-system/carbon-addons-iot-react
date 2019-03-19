import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const TableCellRenderer = ({ children = null }) =>
  typeof children === 'string' || typeof children === 'number' ? (
    <span title={children}>{children}</span>
  ) : (
    children
  );

TableCellRenderer.propTypes = propTypes;

export default TableCellRenderer;
