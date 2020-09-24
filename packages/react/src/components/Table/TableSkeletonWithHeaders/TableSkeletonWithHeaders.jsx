import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, SkeletonText } from 'carbon-components-react';

import { settings } from '../../../constants/Settings';

const { TableBody, TableCell, TableRow } = DataTable;
const { iotPrefix } = settings;

const propTypes = {
  hasRowSelection: PropTypes.oneOf(['multi', 'single', false]),
  hasRowExpansion: PropTypes.bool,
  hasRowActions: PropTypes.bool,
  rowCount: PropTypes.number,
  columns: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })),
};

const defaultProps = {
  hasRowSelection: false,
  hasRowExpansion: false,
  hasRowActions: false,
  rowCount: 10,
  columns: [],
};

/** This component is exactly like the DataTableSkeleton component from carbon, but it shows your headers while it loads */
const TableSkeletonWithHeaders = ({
  hasRowSelection,
  hasRowExpansion,
  hasRowActions,
  columns,
  rowCount,
}) => (
  <TableBody>
    <TableRow className={`${iotPrefix}--table-skeleton-with-headers--table-row`}>
      {hasRowSelection === 'multi' ? <TableCell /> : null}
      {hasRowExpansion ? <TableCell /> : null}
      {columns.map(column => (
        <TableCell key={`skeletonCol-${column.id}`}>
          <SkeletonText />
        </TableCell>
      ))}
      {hasRowActions ? <TableCell /> : null}
    </TableRow>
    {[...Array(rowCount > 0 ? rowCount - 1 : 0)].map((row, index) => (
      <TableRow
        key={`skeletonRow-${index}`}
        className={`${iotPrefix}--table-skeleton-with-headers--table-row`}
      >
        {hasRowSelection === 'multi' ? <TableCell /> : null}
        {hasRowExpansion ? <TableCell /> : null}
        {columns.map(column => (
          <TableCell key={`emptycell-${column.id}`} />
        ))}
        {hasRowActions ? <TableCell /> : null}
      </TableRow>
    ))}
  </TableBody>
);

TableSkeletonWithHeaders.propTypes = propTypes;
TableSkeletonWithHeaders.defaultProps = defaultProps;

export default TableSkeletonWithHeaders;
