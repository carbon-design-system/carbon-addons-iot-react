import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { TableBody as CarbonTableBody } from 'carbon-components-react';

import {
  ExpandedRowsPropTypes,
  TableRowsPropTypes,
  TableColumnsPropTypes,
  RowActionsStatePropTypes,
  CellTextOverflowPropType,
} from '../TablePropTypes';
import deprecate from '../../../internal/deprecate';
import { findRow, tableTraverser } from '../tableUtilities';

import TableBodyRowRenderer from './TableBodyRowRenderer';

const propTypes = {
  /** The unique id of the table */
  tableId: PropTypes.string.isRequired,
  rows: TableRowsPropTypes,
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
  inProgressText: PropTypes.string,
  /** I18N label for action failed */
  actionFailedText: PropTypes.string,
  /** I18N label for learn more */
  learnMoreText: PropTypes.string,
  /** I18N label for dismiss */
  dismissText: PropTypes.string,
  /** I18N label for load more */
  loadMoreText: PropTypes.string,
  /** since some columns might not be currently visible */
  totalColumns: PropTypes.number,
  hasRowSelection: PropTypes.oneOf(['multi', 'single', false]),
  hasRowExpansion: PropTypes.bool,
  hasRowNesting: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      /** If the hierarchy only has 1 nested level of children */
      hasSingleNestedHierarchy: PropTypes.bool,
    }),
  ]),
  hasRowActions: PropTypes.bool,
  cellTextOverflow: CellTextOverflowPropType,
  /** the current state of the row actions */
  rowActionsState: RowActionsStatePropTypes,
  shouldExpandOnRowClick: PropTypes.bool,
  shouldLazyRender: PropTypes.bool,
  locale: PropTypes.string,

  actions: PropTypes.shape({
    onRowSelected: PropTypes.func,
    onRowClicked: PropTypes.func,
    onApplyRowActions: PropTypes.func,
    onRowExpanded: PropTypes.func,
    onRowLoadMore: PropTypes.func,
  }).isRequired,
  /** What column ordering is currently applied to the table */
  ordering: PropTypes.arrayOf(
    PropTypes.shape({
      columnId: PropTypes.string.isRequired,
      /* Visibility of column in table, defaults to false */
      isHidden: PropTypes.bool,
    })
  ).isRequired,
  rowEditMode: PropTypes.bool,
  singleRowEditButtons: PropTypes.element,
  /**
   * direction of document
   */
  langDir: PropTypes.oneOf(['ltr', 'rtl']),
  /** shows an additional column that can expand/shrink as the table is resized  */
  showExpanderColumn: PropTypes.bool,
  // TODO: remove deprecated 'testID' in v3
  // eslint-disable-next-line react/require-default-props
  testID: deprecate(
    PropTypes.string,
    `The 'testID' prop has been deprecated. Please use 'testId' instead.`
  ),
  testId: PropTypes.string,
  /** Array with rowIds that are with loading active */
  loadingMoreIds: PropTypes.arrayOf(PropTypes.string),
  /** use white-space: pre; css when true */
  preserveCellWhiteSpace: PropTypes.bool,
  /**
   * the size passed to the table to set row height
   */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
};

const defaultProps = {
  expandedIds: [],
  selectedIds: [],
  loadingMoreIds: [],
  selectRowAria: 'Select row',
  overflowMenuAria: 'More actions',
  clickToExpandAria: 'Click to expand.',
  clickToCollapseAria: 'Click to collapse.',
  locale: null,
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
  rowEditMode: false,
  singleRowEditButtons: null,
  langDir: 'ltr',
  showExpanderColumn: false,
  testId: '',
  cellTextOverflow: null,
  preserveCellWhiteSpace: false,
  loadMoreText: 'Load more...',
  learnMoreText: 'Learn more',
  inProgressText: 'In progress',
  dismissText: 'Dismiss',
  actionFailedText: 'Action failed',
  size: undefined,
};

const TableBody = ({
  tableId,
  rows,
  columns,
  expandedIds,
  expandedRows,
  selectedIds,
  loadingMoreIds,
  selectRowAria,
  overflowMenuAria,
  clickToExpandAria,
  clickToCollapseAria,
  inProgressText,
  learnMoreText,
  dismissText,
  actionFailedText,
  loadMoreText,
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
  cellTextOverflow,
  locale,
  rowEditMode,
  singleRowEditButtons,
  langDir,
  // TODO: remove deprecated 'testID' in v3
  testID,
  testId,
  showExpanderColumn,
  preserveCellWhiteSpace,
  size,
}) => {
  // Need to merge the ordering and the columns since the columns have the renderer function
  const orderingMap = useMemo(
    () =>
      ordering.map((col) => ({
        ...col,
        ...columns.find((column) => column.id === col.columnId),
      })),
    [columns, ordering]
  );

  const findAllAncestorRows = (childId, myRows) => {
    const result = [];
    const applyFunc = (row, ancestors) => {
      const lastChildId = result[result.length - 1]?.id || childId;
      const currentRowIsParent = row.children?.filter((child) => child.id === lastChildId).length;
      if (currentRowIsParent) {
        ancestors.push(row);
      }
    };
    tableTraverser(myRows, applyFunc, result);
    return result;
  };

  const findAllChildRowIds = ({ children = [] }) => {
    const result = [];
    tableTraverser(children, (row, aggr) => aggr.push(row.id), result);
    return result;
  };

  const updateChildIdSelection = (triggeringRowId, myRows, selection) => {
    const row = findRow(triggeringRowId, myRows);
    const childRowIds = findAllChildRowIds(row);
    const triggeringRowSelected = selection.includes(triggeringRowId);

    return triggeringRowSelected
      ? [...new Set(selection.concat(childRowIds))]
      : selection.filter((id) => !childRowIds.includes(id));
  };

  const updateAncestorSelection = (allAncestorRows, selection) => {
    const newSelection = [...selection];
    allAncestorRows.forEach((ancestorRow) => {
      if (ancestorRow.children.every((child) => newSelection.includes(child.id))) {
        newSelection.push(ancestorRow.id);
      } else if (newSelection.includes(ancestorRow.id)) {
        newSelection.splice(newSelection.indexOf(ancestorRow.id), 1);
      }
    });
    return newSelection;
  };

  const onRowSelected = (rowId, selected) => {
    if (hasRowSelection === 'single') {
      actions.onRowSelected(rowId, selected, selected ? [rowId] : []);
    } else {
      const allAncestorRows = findAllAncestorRows(rowId, rows) || [];
      const withNewSelection = selected
        ? [...selectedIds, rowId]
        : selectedIds.filter((id) => id !== rowId);
      const withUpdatedAncestors = updateAncestorSelection(allAncestorRows, withNewSelection);
      const withUpdatedChildren = updateChildIdSelection(rowId, rows, withUpdatedAncestors);
      actions.onRowSelected(rowId, selected, withUpdatedChildren.sort());
    }
  };

  const getIndeterminateRowSelectionIds = (myRows, mySelectedIds) => {
    const result = [];
    if (hasRowNesting && mySelectedIds.length) {
      const applyFunc = (row, indeterminateList) => {
        const allChildren = findAllChildRowIds(row);
        const allAreSelected = allChildren.every((childId) => mySelectedIds.includes(childId));
        const someAreSelected =
          !allAreSelected && allChildren.some((childId) => mySelectedIds.includes(childId));
        if (someAreSelected) {
          indeterminateList.push(row.id);
        }
      };
      tableTraverser(myRows, applyFunc, result);
    }
    return result;
  };

  return (
    <CarbonTableBody data-testid={testID || testId}>
      {rows.map((row) => (
        <TableBodyRowRenderer
          key={row.id}
          actionFailedText={actionFailedText}
          actions={{
            ...actions,
            onRowSelected,
          }}
          clickToCollapseAria={clickToCollapseAria}
          clickToExpandAria={clickToExpandAria}
          columns={columns}
          dismissText={dismissText}
          expandedIds={expandedIds}
          expandedRows={expandedRows}
          hasRowActions={hasRowActions}
          hasRowExpansion={hasRowExpansion}
          hasRowNesting={hasRowNesting}
          hasRowSelection={hasRowSelection}
          indeterminateSelectionIds={getIndeterminateRowSelectionIds(rows, selectedIds)}
          inProgressText={inProgressText}
          langDir={langDir}
          learnMoreText={learnMoreText}
          loadingMoreIds={loadingMoreIds}
          loadMoreText={loadMoreText}
          locale={locale}
          ordering={orderingMap}
          overflowMenuAria={overflowMenuAria}
          preserveCellWhiteSpace={preserveCellWhiteSpace}
          row={row}
          rowActionsState={rowActionsState}
          rowEditMode={rowEditMode}
          selectedIds={selectedIds}
          selectRowAria={selectRowAria}
          shouldExpandOnRowClick={shouldExpandOnRowClick}
          shouldLazyRender={shouldLazyRender}
          showExpanderColumn={showExpanderColumn}
          singleRowEditButtons={singleRowEditButtons}
          size={size}
          someRowHasSingleRowEditMode={rowActionsState.some((rowAction) => rowAction.isEditMode)}
          tableId={tableId}
          testId={testID || testId}
          totalColumns={totalColumns}
          cellTextOverflow={cellTextOverflow}
        />
      ))}
    </CarbonTableBody>
  );
};

TableBody.propTypes = propTypes;
TableBody.defaultProps = defaultProps;

export default TableBody;
