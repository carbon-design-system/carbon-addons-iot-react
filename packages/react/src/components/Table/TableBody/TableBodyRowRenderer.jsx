import React, { useRef } from 'react';
import { pick } from 'lodash-es';
import PropTypes from 'prop-types';

import useVisibilityObserver from '../../../hooks/useVisibilityObserver';
import {
  ExpandedRowsPropTypes,
  RowActionsStatePropTypes,
  TableColumnsPropTypes,
  TableRowPropTypes,
  TableRowsPropTypes,
} from '../TablePropTypes';

import TableBodyRow from './TableBodyRow/TableBodyRow';
import TableBodyLoadMoreRow from './TableBodyLoadMoreRow/TableBodyLoadMoreRow';
import SkeletonRow from './SkeletonRow';

const propTypes = {
  /** The unique id of the table */
  tableId: PropTypes.string.isRequired,
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
  /** show radio button on single selection */
  useRadioButtonSingleSelect: PropTypes.bool,
  hasRowExpansion: PropTypes.bool,
  hasRowNesting: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      /** If the hierarchy only has 1 nested level of children */
      hasSingleNestedHierarchy: PropTypes.bool,
    }),
  ]),
  hasRowActions: PropTypes.bool,
  wrapCellText: PropTypes.oneOf(['always', 'never', 'auto', 'alwaysTruncate']).isRequired,
  truncateCellText: PropTypes.bool.isRequired,
  /** the current state of the row actions */
  rowActionsState: RowActionsStatePropTypes,
  shouldExpandOnRowClick: PropTypes.bool,
  shouldLazyRender: PropTypes.bool,
  locale: PropTypes.string,

  actions: PropTypes.shape({
    onRowClicked: PropTypes.func,
    onRowSelected: PropTypes.func,
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
  testId: PropTypes.string,
  /** Array with rowIds that are with loading active */
  loadingMoreIds: PropTypes.arrayOf(PropTypes.string),
  /** use white-space: pre; css when true */
  preserveCellWhiteSpace: PropTypes.bool,
  /**
   * the size passed to the table to set row height
   */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  indeterminateSelectionIds: PropTypes.arrayOf(PropTypes.string),
  nestingLevel: PropTypes.number,
  someRowHasSingleRowEditMode: PropTypes.bool,
  row: TableRowPropTypes.isRequired,
  rows: TableRowsPropTypes,
  /** True if this row is the last child of a nested group */
  isLastChild: PropTypes.bool,
};

const defaultProps = {
  actionFailedText: 'Action failed',
  clickToCollapseAria: 'Click to collapse.',
  clickToExpandAria: 'Click to expand.',
  columns: [],
  dismissText: 'Dismiss',
  expandedIds: [],
  expandedRows: [],
  hasRowActions: false,
  hasRowExpansion: false,
  hasRowNesting: false,
  hasRowSelection: false,
  useRadioButtonSingleSelect: false,
  indeterminateSelectionIds: [],
  inProgressText: 'In progress',
  langDir: 'ltr',
  learnMoreText: 'Learn more',
  loadingMoreIds: [],
  loadMoreText: 'Load more...',
  locale: null,
  nestingLevel: 0,
  overflowMenuAria: 'More actions',
  preserveCellWhiteSpace: false,
  rowActionsState: [],
  rowEditMode: false,
  rows: [],
  selectedIds: [],
  selectRowAria: 'Select row',
  shouldExpandOnRowClick: false,
  shouldLazyRender: false,
  showExpanderColumn: false,
  singleRowEditButtons: null,
  size: undefined,
  someRowHasSingleRowEditMode: false,
  testId: '',
  totalColumns: 0,
  isLastChild: false,
};

const TableBodyRowRenderer = (props) => {
  const {
    actionFailedText,
    actions,
    clickToCollapseAria,
    clickToExpandAria,
    columns,
    dismissText,
    expandedIds,
    expandedRows,
    hasRowActions,
    hasRowExpansion,
    hasRowNesting,
    hasRowSelection,
    useRadioButtonSingleSelect,
    indeterminateSelectionIds,
    inProgressText,
    langDir,
    learnMoreText,
    loadingMoreIds,
    loadMoreText,
    locale,
    nestingLevel,
    ordering,
    overflowMenuAria,
    preserveCellWhiteSpace,
    row,
    rowActionsState,
    rowEditMode,
    selectedIds,
    selectRowAria,
    shouldExpandOnRowClick,
    shouldLazyRender,
    showExpanderColumn,
    singleRowEditButtons,
    size,
    someRowHasSingleRowEditMode,
    tableId,
    testId,
    totalColumns,
    truncateCellText,
    wrapCellText,
    isLastChild,
  } = props;
  const isRowExpanded = expandedIds.includes(row.id);
  const shouldShowChildren =
    hasRowNesting && isRowExpanded && row.children && row.children.length > 0;
  const myRowActionState = rowActionsState.find((rowAction) => rowAction.rowId === row.id);
  const rowHasSingleRowEditMode = !!(myRowActionState && myRowActionState.isEditMode);
  const isSelectable = rowEditMode || someRowHasSingleRowEditMode ? false : row.isSelectable;
  const rowVisibilityRef = useRef(null);
  const [isVisible] = useVisibilityObserver(rowVisibilityRef, {
    unobserveAfterVisible: true,
  });

  if (shouldLazyRender && !isVisible) {
    return (
      <SkeletonRow
        id={row.id}
        tableId={tableId}
        columns={columns}
        rowVisibilityRef={rowVisibilityRef}
        testId={`${tableId}-lazy-row-${row.id}`}
        hasRowActions={hasRowActions}
        hasRowExpansion={hasRowExpansion}
        hasRowNesting={hasRowNesting}
        hasRowSelection={hasRowSelection}
        showExpanderColumn={showExpanderColumn}
      />
    );
  }

  const rowElement = !row.isLoadMoreRow ? (
    <TableBodyRow
      langDir={langDir}
      key={row.id}
      isExpanded={isRowExpanded}
      isSelectable={isSelectable}
      isSelected={selectedIds.includes(row.id)}
      isIndeterminate={indeterminateSelectionIds.includes(row.id)}
      rowEditMode={rowEditMode}
      singleRowEditMode={rowHasSingleRowEditMode}
      singleRowEditButtons={singleRowEditButtons}
      rowDetails={
        isRowExpanded && expandedRows.find((j) => j.rowId === row.id)
          ? expandedRows.find((j) => j.rowId === row.id).content
          : null
      }
      rowActionsError={myRowActionState ? myRowActionState.error : null}
      isRowActionRunning={myRowActionState ? myRowActionState.isRunning : null}
      ordering={ordering}
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
      locale={locale}
      totalColumns={totalColumns}
      options={{
        hasRowSelection,
        hasRowExpansion,
        hasRowNesting,
        hasRowActions,
        shouldExpandOnRowClick,
        wrapCellText,
        truncateCellText,
        preserveCellWhiteSpace,
        useRadioButtonSingleSelect,
      }}
      nestingLevel={nestingLevel}
      nestingChildCount={row.children ? row.children.length : 0}
      tableActions={{
        ...pick(
          actions,
          'onApplyRowAction',
          'onRowExpanded',
          'onRowClicked',
          'onClearRowError',
          'onRowSelected'
        ),
      }}
      rowActions={row.rowActions}
      values={row.values}
      showExpanderColumn={showExpanderColumn}
      size={size}
      isLastChild={isLastChild}
    />
  ) : (
    <TableBodyLoadMoreRow
      id={row.id}
      key={`${row.id}--load-more`}
      tableId={tableId}
      testId={testId}
      rowVisibilityRef={rowVisibilityRef}
      onRowLoadMore={actions?.onRowLoadMore}
      loadMoreText={loadMoreText}
      hasRowActions={hasRowActions}
      hasRowExpansion={hasRowExpansion}
      hasRowNesting={hasRowNesting}
      hasRowSelection={hasRowSelection}
      showExpanderColumn={showExpanderColumn}
      columns={columns}
      totalColumns={totalColumns}
      isLoadingMore={loadingMoreIds.includes(row.id)}
    />
  );

  return shouldShowChildren
    ? [rowElement]
        .concat(
          row.children.map((childRow, i) => (
            <TableBodyRowRenderer
              key={`child-row-${childRow.id}`}
              {...props}
              row={childRow}
              nestingLevel={nestingLevel + 1}
              isLastChild={i === row.children.length - 1}
            />
          ))
        )
        .concat(
          row.hasLoadMore && row.children.length > 0 ? (
            <TableBodyRowRenderer
              {...props}
              key={`load-more-row-${row.id}`}
              row={{ id: row.id, isLoadMoreRow: true }}
              nestingLevel={nestingLevel}
            />
          ) : (
            []
          )
        )
    : rowElement;
};

TableBodyRowRenderer.defaultProps = defaultProps;
TableBodyRowRenderer.propTypes = propTypes;

export default TableBodyRowRenderer;
