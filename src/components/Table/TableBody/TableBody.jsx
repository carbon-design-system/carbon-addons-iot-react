import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'carbon-components-react';
import pick from 'lodash/pick';

import { ExpandedRowsPropTypes, TableRowPropTypes, TableColumnsPropTypes } from '../TablePropTypes';

import TableBodyRow from './TableBodyRow/TableBodyRow';

const { TableBody: CarbonTableBody } = DataTable;

const propTypes = {
  /** id of the table */
  id: PropTypes.string.isRequired,
  rows: TableRowPropTypes,
  expandedRows: ExpandedRowsPropTypes,
  columns: TableColumnsPropTypes,
  expandedIds: PropTypes.arrayOf(PropTypes.string),
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  /** internationalized label */
  selectRowLabel: PropTypes.string,
  /** internationalized label */
  overflowMenuLabel: PropTypes.string,
  /** internationalized label */
  clickToExpandLabel: PropTypes.string,
  /** internationalized label */
  clickToCollapseLabel: PropTypes.string,
  /** since some columns might not be currently visible */
  totalColumns: PropTypes.number,
  hasRowSelection: PropTypes.bool,
  hasRowExpansion: PropTypes.bool,
  shouldExpandOnRowClick: PropTypes.bool,

  actions: PropTypes.shape({
    onRowSelected: PropTypes.func,
    onRowClicked: PropTypes.func,
    onApplyRowActions: PropTypes.func,
    onRowExpanded: PropTypes.func,
  }).isRequired,
  /** What column ordering is currently applied to the table */
  ordering: PropTypes.arrayOf(
    PropTypes.shape({
      columnId: PropTypes.string.isRequired,
      /* Visibility of column in table, defaults to false */
      isHidden: PropTypes.bool,
    })
  ).isRequired,
};

const defaultProps = {
  expandedIds: [],
  selectedIds: [],
  selectRowLabel: 'Select row',
  overflowMenuLabel: 'More actions',
  clickToExpandLabel: 'Click to expand.',
  clickToCollapseLabel: 'Click to collapse.',
  rows: [],
  expandedRows: [],
  columns: [],
  totalColumns: 0,
  hasRowSelection: false,
  hasRowExpansion: false,
  shouldExpandOnRowClick: false,
};

const TableBody = ({
  id,
  rows,
  columns,
  expandedIds,
  expandedRows,
  selectedIds,
  selectRowLabel,
  overflowMenuLabel,
  clickToExpandLabel,
  clickToCollapseLabel,
  totalColumns,
  actions,
  hasRowSelection,
  hasRowExpansion,
  shouldExpandOnRowClick,
  ordering,
}) => {
  // Need to merge the ordering and the columns since the columns have the renderer function
  const orderingMap = useMemo(
    () =>
      ordering.map(col => ({
        ...col,
        ...columns.find(column => column.id === col.columnId),
      })),
    [columns, ordering]
  );

  return (
    <CarbonTableBody>
      {rows.map(row => {
        const isRowExpanded = expandedIds.includes(row.id);
        return (
          <TableBodyRow
            key={row.id}
            isExpanded={isRowExpanded}
            isSelected={selectedIds.includes(row.id)}
            rowDetails={
              isRowExpanded && expandedRows.find(j => j.rowId === row.id)
                ? expandedRows.find(j => j.rowId === row.id).content
                : null
            }
            ordering={orderingMap}
            selectRowLabel={selectRowLabel}
            overflowMenuLabel={overflowMenuLabel}
            clickToCollapseLabel={clickToCollapseLabel}
            clickToExpandLabel={clickToExpandLabel}
            columns={columns}
            id={row.id}
            totalColumns={totalColumns}
            tableId={id}
            options={{ hasRowSelection, hasRowExpansion, shouldExpandOnRowClick }}
            tableActions={pick(
              actions,
              'onRowSelected',
              'onApplyRowAction',
              'onRowExpanded',
              'onRowClicked'
            )}
            rowActions={row.rowActions}>
            {row.values}
          </TableBodyRow>
        );
      })}
    </CarbonTableBody>
  );
};

TableBody.propTypes = propTypes;
TableBody.defaultProps = defaultProps;

export default TableBody;
