import React from 'react';
import PropTypes from 'prop-types';
import { TableCell, TableRow } from 'carbon-components-react';

import { settings } from '../../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  options: PropTypes.shape({
    hasRowExpansion: PropTypes.bool,
    hasRowSelection: PropTypes.oneOf(['multi', 'single', false]), // TODO: don't duplicate this one
    hasRowActions: PropTypes.bool,
  }),
  tableState: PropTypes.shape({
    aggregations: PropTypes.shape({
      label: PropTypes.string,
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          /** id of the column that should have its values aggregated */
          id: PropTypes.string.isRequired,
          /** the value to be displayed */
          value: PropTypes.string,
        })
      ),
    }),
    /** TODO: Move this prop out and reuse in TableHead */
    /** What column ordering is currently applied to the table */
    ordering: PropTypes.arrayOf(
      PropTypes.shape({
        columnId: PropTypes.string.isRequired,
        isHidden: PropTypes.bool,
      })
    ).isRequired,
  }),
  testId: PropTypes.string,
};

const defaultProps = {
  options: {},
};

const TableFoot = ({
  testId,
  options: { hasRowExpansion, hasRowSelection, hasRowActions },
  tableState: { aggregations, ordering },
}) => {
  const visibleColumns = ordering.filter((col) => !col.isHidden);

  return (
    <tfoot data-testid={testId}>
      <TableRow>
        {hasRowExpansion ? <TableCell key="row-expansion" /> : null}
        {hasRowSelection === 'multi' ? <TableCell key="row-selection" /> : null}
        {visibleColumns.map((orderedCol, index) => {
          const aggregated = aggregations.columns.find(
            (col) => orderedCol.columnId === col.id
          );
          const isLabelCell = !aggregated && index === 0;
          const cellTestId = `${testId}-aggregation-${orderedCol.columnId}`;
          const cellKey = `${orderedCol.columnId}${index}`;

          return isLabelCell ? (
            <TableCell
              className={`${iotPrefix}-table-foot--label`}
              data-testid={cellTestId}
              key={cellKey}>
              {aggregations.label}
            </TableCell>
          ) : aggregated ? (
            <TableCell data-testid={cellTestId} key={cellKey}>
              {aggregated.value}
            </TableCell>
          ) : (
            <TableCell data-testid={cellTestId} key={cellKey}>
              -
            </TableCell>
          );
        })}
        {hasRowActions ? <TableCell /> : null}
      </TableRow>
    </tfoot>
  );
};

TableFoot.propTypes = propTypes;
TableFoot.defaultProps = defaultProps;

export default TableFoot;
