import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, SkeletonText, TableRow, TableCell } from 'carbon-components-react';


import { settings } from '../../../../constants/Settings';
import Button from '../../../Button';

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
  return (
    <TableRow isSelected={false}>
      {isLoadingMore ? (
        Array.from(Array(totalColumns)).map((_, index) => (
          <TableCell key={`emptycell-${index}`} data-testid={`${testId}-${id}-skeleton`}>
            <SkeletonText />
          </TableCell>
        ))
      ) : (
        <TableCell
          key={`${tableId}-${id}-row-load-more-cell`}
          colSpan={totalColumns}
          className={`${iotPrefix}--load-more-cell`}
          data-testid={`${testId}-${id}-load-more`}
        >
          <Button
            className={`${iotPrefix}--load-more-cell--content`}
            onClick={() => onRowLoadMore(id)}
            kind="ghost"
            loading={isLoadingMore}
          >
            {loadMoreText}
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};

TableBodyLoadMoreRow.propTypes = propTypes;

export default TableBodyLoadMoreRow;
