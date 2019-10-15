import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'carbon-components-react';
import VisibilitySensor from 'react-visibility-sensor';
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
  /** The unique id of the table */
  tableId: PropTypes.string.isRequired,
  rows: TableRowPropTypes,
  expandedRows: ExpandedRowsPropTypes,
  columns: TableColumnsPropTypes,
  expandedIds: PropTypes.arrayOf(PropTypes.string),
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  /** internationalized label */
  selectRowAria: PropTypes.string,
  /** internationalized label */
  overflowMenuAria: PropTypes.string,
  /** internationalized label */
  clickToExpandAria: PropTypes.string,
  /** internationalized label */
  clickToCollapseAria: PropTypes.string,
  /** I18N label for in progress */
  inProgressText: PropTypes.string, // eslint-disable-line
  /** I18N label for action failed */
  actionFailedText: PropTypes.string, // eslint-disable-line
  /** I18N label for learn more */
  learnMoreText: PropTypes.string, // eslint-disable-line
  /** I18N label for dismiss */
  dismissText: PropTypes.string, // eslint-disable-line
  /** since some columns might not be currently visible */
  totalColumns: PropTypes.number,
  hasRowSelection: PropTypes.oneOf(['multi', 'single', false]),
  hasRowExpansion: PropTypes.bool,
  hasRowNesting: PropTypes.bool,
  hasRowActions: PropTypes.bool,
  /** the current state of the row actions */
  rowActionsState: RowActionsStatePropTypes,
  shouldExpandOnRowClick: PropTypes.bool,
  shouldLazyRender: PropTypes.bool,

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
  selectRowAria: 'Select row',
  overflowMenuAria: 'More actions',
  clickToExpandAria: 'Click to expand.',
  clickToCollapseAria: 'Click to collapse.',
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
  shouldLazyRender: false,
};

const TableBody = ({
  tableId,
  rows,
  columns,
  expandedIds,
  expandedRows,
  selectedIds,
  selectRowAria,
  overflowMenuAria,
  clickToExpandAria,
  clickToCollapseAria,
  inProgressText,
  learnMoreText,
  dismissText,
  actionFailedText,
  totalColumns,
  actions,
  rowActionsState,
  hasRowActions,
  hasRowSelection,
  hasRowExpansion,
  hasRowNesting,
  shouldExpandOnRowClick,
  shouldLazyRender,
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
        isSelectable={row.isSelectable}
        isSelected={selectedIds.includes(row.id)}
        rowDetails={
          isRowExpanded && expandedRows.find(j => j.rowId === row.id)
            ? expandedRows.find(j => j.rowId === row.id).content
            : null
        }
        rowActionsError={myRowActionState ? myRowActionState.error : null}
        isRowActionRunning={myRowActionState ? myRowActionState.isRunning : null}
        ordering={orderingMap}
        selectRowAria={selectRowAria}
        overflowMenuAria={overflowMenuAria}
        clickToCollapseAria={clickToCollapseAria}
        clickToExpandAria={clickToExpandAria}
        inProgressText={inProgressText}
        actionFailedText={actionFailedText}
        learnMoreText={learnMoreText}
        dismissText={dismissText}
        columns={columns}
        tableId={tableId}
        id={row.id}
        totalColumns={totalColumns}
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
          'onRowClicked',
          'onClearRowError'
        )}
        rowActions={row.rowActions}
        values={row.values}
      />
    );
    return shouldShowChildren
      ? [rowElement].concat(row.children.map(childRow => renderRow(childRow, nestingLevel + 1)))
      : rowElement;
  };

  return (
    <CarbonTableBody>
      {rows.map(row => {
        return shouldLazyRender ? (
          <VisibilitySensor
            key={`visibilitysensor-${row.id}`}
            scrollCheck
            partialVisibility
            resizeCheck
          >
            {({ isVisible }) => (isVisible ? renderRow(row) : <tr />)}
          </VisibilitySensor>
        ) : (
          renderRow(row)
        );
      })}
    </CarbonTableBody>
  );
};

TableBody.propTypes = propTypes;
TableBody.defaultProps = defaultProps;

export default TableBody;
