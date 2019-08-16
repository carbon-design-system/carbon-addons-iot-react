import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, SkeletonText } from 'carbon-components-react';
import styled from 'styled-components';

import { COLORS } from '../../../styles/styles';

const { TableBody, TableCell, TableRow } = DataTable;

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

const StyledLoadingTableRow = styled(TableRow)`
  &&& {
    pointer-events: none;

    &:hover td {
      border: 1px solid ${COLORS.lightGrey};
      background: inherit;
    }
  }
`;

/** This component is exactly like the DataTableSkeleton component from carbon, but it shows your headers while it loads */
const TableSkeletonWithHeaders = ({
  hasRowSelection,
  hasRowExpansion,
  hasRowActions,
  columns,
  rowCount,
}) => (
  <TableBody>
    <StyledLoadingTableRow>
      {hasRowSelection === 'multi' ? <TableCell /> : null}
      {hasRowExpansion ? <TableCell /> : null}
      {columns.map(column => (
        <TableCell key={`skeletonCol-${column.id}`}>
          <SkeletonText />
        </TableCell>
      ))}
      {hasRowActions ? <TableCell /> : null}
    </StyledLoadingTableRow>
    {[...Array(rowCount > 0 ? rowCount - 1 : 0)].map((row, index) => (
      <StyledLoadingTableRow key={`skeletonRow-${index}` /*eslint-disable-line*/}>
        {hasRowSelection === 'multi' ? <TableCell /> : null}
        {hasRowExpansion ? <TableCell /> : null}
        {columns.map(column => (
          <TableCell key={`emptycell-${column.id}`} />
        ))}
        {hasRowActions ? <TableCell /> : null}
      </StyledLoadingTableRow>
    ))}
  </TableBody>
);

TableSkeletonWithHeaders.propTypes = propTypes;
TableSkeletonWithHeaders.defaultProps = defaultProps;

export default TableSkeletonWithHeaders;
