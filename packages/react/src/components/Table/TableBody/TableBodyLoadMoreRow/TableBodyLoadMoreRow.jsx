import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, Loading } from 'carbon-components-react';

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
  /** boolean to decide if is in loading state or not */
  isLoadingMore: PropTypes.bool.isRequired,
};

const TableBodyLoadMoreRow = ({
  id,
  tableId,
  testId,
  onRowLoadMore,
  loadMoreText,
  totalColumns,
  isLoadingMore,
}) => {
  const tableCells = (
    <TableCell
      key={`${tableId}-${id}-row-load-more-cell`}
      colSpan={totalColumns}
      onClick={() => onRowLoadMore(id)}
      className={`${iotPrefix}--load-more-cell`}
      data-testid={`${testId}-${id}-load-more`}
    >
      <div className={`${iotPrefix}--load-more-cell--content`}>
        {isLoadingMore ? <Loading small withOverlay={false} /> : null}
        {loadMoreText}
      </div>
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
