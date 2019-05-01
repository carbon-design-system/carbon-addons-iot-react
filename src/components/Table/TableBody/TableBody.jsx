import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'carbon-components-react';
import pick from 'lodash/pick';

import {
  ExpandedRowsPropTypes,
  TableRowPropTypes,
  TableColumnsPropTypes,
  RowActionsStatePropTypes,
} from '../TablePropTypes';

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
  selectRowText: PropTypes.string,
  /** internationalized label */
  overflowMenuText: PropTypes.string,
  /** internationalized label */
  clickToExpandText: PropTypes.string,
  /** internationalized label */
  clickToCollapseText: PropTypes.string,
  /** since some columns might not be currently visible */
  totalColumns: PropTypes.number,
  hasRowSelection: PropTypes.oneOf(['multi', 'single', false]),
  hasRowExpansion: PropTypes.bool,
  hasRowNesting: PropTypes.bool,
  hasRowActions: PropTypes.bool,
  /** the current state of the row actions */
  rowActionsState: RowActionsStatePropTypes,
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
  selectRowText: 'Select row',
  overflowMenuText: 'More actions',
  clickToExpandText: 'Click to expand.',
  clickToCollapseText: 'Click to collapse.',
  rows: [],
  expandedRows: [],
  rowActionsState: [],
  columns: [],
  totalColumns: 0,
  hasRowSelection: false,
  hasRowExpansion: false,
  hasRowNesting: false,
  hasRowActions: false,
  shouldExpandOnRowClick: false,
};

const TableBody = ({
  id,
  rows,
  columns,
  expandedIds,
  expandedRows,
  selectedIds,
  selectRowText,
  overflowMenuText,
  clickToExpandText,
  clickToCollapseText,
  totalColumns,
  actions,
  rowActionsState,
  hasRowActions,
  hasRowSelection,
  hasRowExpansion,
  hasRowNesting,
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

  const renderRow = (row, nestingLevel = 0) => {
    const isRowExpanded = expandedIds.includes(row.id);
    const shouldShowChildren =
      hasRowNesting && isRowExpanded && row.children && row.children.length > 0;
    const myRowActionState = rowActionsState.find(rowAction => rowAction.rowId === row.id);
    const rowElement = (
      <TableBodyRow
        key={row.id}
        isExpanded={isRowExpanded}
        isSelected={selectedIds.includes(row.id)}
        rowDetails={
          isRowExpanded && expandedRows.find(j => j.rowId === row.id)
            ? expandedRows.find(j => j.rowId === row.id).content
            : null
        }
        rowActionsError={myRowActionState ? myRowActionState.error : null}
        isRowActionRunning={myRowActionState ? myRowActionState.isRunning : null}
        ordering={orderingMap}
        selectRowText={selectRowText}
        overflowMenuText={overflowMenuText}
        clickToCollapseText={clickToCollapseText}
        clickToExpandText={clickToExpandText}
        columns={columns}
        id={row.id}
        totalColumns={totalColumns}
        tableId={id}
        options={{
          hasRowSelection,
          hasRowExpansion,
          hasRowNesting,
          hasRowActions,
          shouldExpandOnRowClick,
        }}
        nestingLevel={nestingLevel}
        nestingChildCount={row.children ? row.children.length : 0}
        tableActions={pick(
          actions,
          'onRowSelected',
          'onApplyRowAction',
          'onRowExpanded',
          'onRowClicked'
        )}
        rowActions={row.rowActions}
        values={row.values}
      />
    );
    return shouldShowChildren
      ? [rowElement].concat(row.children.map(childRow => renderRow(childRow, nestingLevel + 1)))
      : rowElement;
  };

  return <CarbonTableBody>{rows.map(row => renderRow(row))}</CarbonTableBody>;
};

TableBody.propTypes = propTypes;
TableBody.defaultProps = defaultProps;

export default TableBody;
