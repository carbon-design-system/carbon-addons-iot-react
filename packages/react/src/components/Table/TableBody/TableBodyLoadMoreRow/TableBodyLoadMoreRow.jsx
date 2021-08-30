import React from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'carbon-components-react';
import { ArrowDown16 } from '@carbon/icons-react';

import { settings } from '../../../../constants/Settings';

const { TableRow, TableCell } = DataTable;
const { iotPrefix } = settings;

const propTypes = {
  /** The unique row id */
  id: PropTypes.string.isRequired,
  /** The unique id for the table */
  tableId: PropTypes.string.isRequired,
  /** The unique id for the table test */
  testId: PropTypes.string.isRequired,
  /**  total columns has the overall total */
  totalColumns: PropTypes.number.isRequired,
  /** call back function for when load more row is clicked */
  onRowLoadMore: PropTypes.func.isRequired,
  /** I18N label for load more */
  loadMoreText: PropTypes.string.isRequired,
};

const TableBodyLoadMoreRow = ({
  id,
  tableId,
  testId,
  onRowLoadMore,
  loadMoreText,
  totalColumns,
}) => {
  const tableCells = (
    <TableCell
      key={`${tableId}-${id}-row-load-more-cell`}
      colSpan={totalColumns}
      onClick={() => onRowLoadMore(id)}
      className={`${iotPrefix}--load-more-cell`}
      data-testid={`${testId}-${id}-load-more`}
    >
      <span>
        {loadMoreText}
        <ArrowDown16 />
      </span>
    </TableCell>
  );

  return (
    <TableRow key={id} isSelected={false} isSelectable isEditMode={false}>
      {tableCells}
    </TableRow>
  );
};

TableBodyLoadMoreRow.propTypes = propTypes;

export default TableBodyLoadMoreRow;
