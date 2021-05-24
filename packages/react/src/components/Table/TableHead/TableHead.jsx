/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useState, useLayoutEffect, createRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DataTable, Checkbox } from 'carbon-components-react';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import classnames from 'classnames';

import {
  TableColumnsPropTypes,
  I18NPropTypes,
  defaultI18NPropTypes,
  ActiveTableToolbarPropType,
  TableSortPropType,
} from '../TablePropTypes';
import TableCellRenderer from '../TableCellRenderer/TableCellRenderer';
import { tableTranslateWithId } from '../../../utils/componentUtilityFunctions';
import { settings } from '../../../constants/Settings';
import { OverflowMenu, OverflowMenuItem } from '../../../index';

import ColumnHeaderRow from './ColumnHeaderRow/ColumnHeaderRow';
import FilterHeaderRow from './FilterHeaderRow/FilterHeaderRow';
import TableHeader from './TableHeader';
import ColumnResize from './ColumnResize';
import {
  createNewWidthsMap,
  calculateWidthOnHide,
  calculateWidthsOnToggle,
  adjustLastColumnWidth,
  calculateWidthOnShow,
  visibleColumnsHaveWidth,
  getIDsOfAddedVisibleColumns,
  getIDsOfRemovedColumns,
  checkColumnWidthFormat,
} from './columnWidthUtilityFunctions';

const { iotPrefix } = settings;

const { TableHead: CarbonTableHead, TableRow, TableExpandHeader } = DataTable;

const propTypes = {
  tableId: PropTypes.string.isRequired,
  /** Important table options that the head needs to know about */
  options: PropTypes.shape({
    hasRowExpansion: PropTypes.bool,
    hasRowSelection: PropTypes.oneOf(['multi', 'single', false]),
    hasRowActions: PropTypes.bool,
    hasResize: PropTypes.bool,
    hasSingleRowEdit: PropTypes.bool,
    wrapCellText: PropTypes.oneOf(['always', 'never', 'auto', 'alwaysTruncate']).isRequired,
    truncateCellText: PropTypes.bool.isRequired,
    hasMultiSort: PropTypes.bool,
  }),
  /** List of columns */
  columns: TableColumnsPropTypes.isRequired,

  /** internationalized labels */
  selectAllText: PropTypes.string,
  clearFilterText: PropTypes.string,
  filterText: PropTypes.string,
  clearSelectionText: PropTypes.string,
  openMenuText: PropTypes.string,
  closeMenuText: PropTypes.string,

  /** Current state of the table */
  tableState: PropTypes.shape({
    /** is the tableHead currently disabled */
    isDisabled: PropTypes.bool,
    /** Which toolbar is currently active */
    activeBar: ActiveTableToolbarPropType,
    /** What's currently selected in the table? */
    selection: PropTypes.shape({
      isSelectAllIndeterminate: PropTypes.bool,
      isSelectAllSelected: PropTypes.bool,
    }).isRequired,
    /** What sorting is currently applied */
    sort: PropTypes.oneOfType([TableSortPropType, PropTypes.arrayOf(TableSortPropType)]).isRequired,
    /** What column ordering is currently applied to the table */
    ordering: PropTypes.arrayOf(
      PropTypes.shape({
        columnId: PropTypes.string.isRequired,
        /* Visibility of column in table, defaults to false */
        isHidden: PropTypes.bool,
      })
    ).isRequired,
    /** Optional list of applied column filters */
    filters: PropTypes.arrayOf(
      PropTypes.shape({
        columnId: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.bool,
          PropTypes.arrayOf(PropTypes.string),
        ]).isRequired,
      })
    ),
  }).isRequired,
  actions: PropTypes.shape({
    onSelectAll: PropTypes.func,
    onChangeSort: PropTypes.func,
    onChangeOrdering: PropTypes.func,
    onColumnSelectionConfig: PropTypes.func,
    onApplyFilter: PropTypes.func,
    onColumnResize: PropTypes.func,
    onOverflowItemClicked: PropTypes.func,
  }).isRequired,
  /** lightweight  */
  lightweight: PropTypes.bool,
  i18n: I18NPropTypes,
  /** should we filter on each keypress */
  hasFastFilter: PropTypes.bool,
  testID: PropTypes.string,
};

const defaultProps = {
  options: {},
  lightweight: false,
  selectAllText: 'Select all',
  clearFilterText: 'Clear filter',
  filterText: 'Filter',
  clearSelectionText: 'Clear selection',
  openMenuText: 'Open menu',
  closeMenuText: 'Close menu',
  i18n: {
    ...defaultI18NPropTypes,
  },
  hasFastFilter: true,
  testID: '',
};

const generateOrderedColumnRefs = (ordering) =>
  ordering.map((col) => col.columnId).reduce((acc, id) => ({ ...acc, [id]: createRef() }), {});

// This increases the min width of columns when the overflow button and sort is present
const PADDING_WITH_OVERFLOW = 24;
const PADDING_WITH_OVERFLOW_AND_SORT = 58;

const TableHead = ({
  testID,
  tableId,
  options,
  options: {
    hasRowExpansion,
    hasRowSelection,
    hasRowNesting,
    hasResize,
    wrapCellText,
    truncateCellText,
    hasSingleRowEdit,
    hasMultiSort,
  },
  columns,
  tableState: {
    selection: { isSelectAllIndeterminate, isSelectAllSelected },
    sort,
    activeBar,
    ordering,
    filters,
    isDisabled,
  },
  actions: {
    onSelectAll,
    onChangeSort,
    onApplyFilter,
    onChangeOrdering,
    onColumnSelectionConfig,
    onColumnResize,
    onOverflowItemClicked,
  },
  selectAllText,
  clearFilterText,
  filterText,
  clearSelectionText,
  openMenuText,
  closeMenuText,
  lightweight,
  i18n,
  hasFastFilter,
}) => {
  const filterBarActive = activeBar === 'filter';
  const initialColumnWidths = {};
  const columnRef = generateOrderedColumnRefs(ordering);
  const columnResizeRefs = generateOrderedColumnRefs(ordering);
  const [currentColumnWidths, setCurrentColumnWidths] = useState({});

  if (isEmpty(currentColumnWidths)) {
    columns.forEach((col) => {
      initialColumnWidths[col.id] = col.width;
    });
  }

  const forwardMouseEvent = (e) => {
    Object.entries(columnResizeRefs).forEach(([, ref]) => {
      if (ref.current) {
        ref.current.forwardMouseEvent(e);
      }
    });
  };

  const measureColumnWidths = useCallback(() => {
    return ordering
      .filter((col) => !col.isHidden)
      .map((col) => {
        const ref = columnRef[col.columnId];
        return {
          id: col.columnId,
          width: ref.current && ref.current.getBoundingClientRect().width,
        };
      });
  }, [ordering, columnRef]);

  const updateColumnWidths = (newColumnWidths) => {
    const updatedColumns = columns.map((col) => ({
      ...col,
      width:
        newColumnWidths[col.id].width !== undefined
          ? `${newColumnWidths[col.id].width}px`
          : col.width,
    }));
    setCurrentColumnWidths(newColumnWidths);
    if (onColumnResize) {
      onColumnResize(updatedColumns);
    }
  };

  const onManualColumnResize = (modifiedColumnWidths) => {
    const newColumnWidths = createNewWidthsMap(ordering, currentColumnWidths, modifiedColumnWidths);
    updateColumnWidths(newColumnWidths);
  };

  const onColumnToggle = (columnId, newOrdering) => {
    if (hasResize) {
      const toggleArgs = {
        currentColumnWidths,
        newOrdering,
        columnId,
        columns,
      };
      const newColumnWidths = calculateWidthsOnToggle(toggleArgs);
      updateColumnWidths(newColumnWidths);
    }
    onChangeOrdering(newOrdering);
  };

  const handleOverflowItemClick = (e, option) => {
    e.stopPropagation();

    if (onOverflowItemClicked) {
      onOverflowItemClicked(option.id);
    }
  };

  useLayoutEffect(() => {
    // An initial measuring is needed since there might not be an initial value from the columns prop
    // which means that the layout engine will have to set the widths dynamically
    // before we know what they are.
    if (hasResize && columns.length && isEmpty(currentColumnWidths)) {
      const measuredWidths = measureColumnWidths();
      const adjustedWidths = adjustLastColumnWidth(ordering, columns, measuredWidths);
      const newWidthsMap = createNewWidthsMap(ordering, currentColumnWidths, adjustedWidths);
      setCurrentColumnWidths(newWidthsMap);
    }
  }, [hasResize, columns, ordering, currentColumnWidths, measureColumnWidths]);

  useEffect(
    () => {
      // We need to update the currentColumnWidths (state) after the initial render
      // only if the widths of the column prop is updated or columns are added/removed .
      if (hasResize && columns.length && !isEmpty(currentColumnWidths)) {
        checkColumnWidthFormat(columns);

        const removedColumnIDs = getIDsOfRemovedColumns(ordering, currentColumnWidths);
        const addedVisibleColumnIDs = getIDsOfAddedVisibleColumns(ordering, currentColumnWidths);
        const adjustedForRemoved =
          removedColumnIDs.length > 0
            ? calculateWidthOnHide(currentColumnWidths, ordering, removedColumnIDs)
            : currentColumnWidths;
        const adjustedForRemovedAndAdded =
          addedVisibleColumnIDs.length > 0
            ? calculateWidthOnShow(adjustedForRemoved, ordering, addedVisibleColumnIDs, columns)
            : adjustedForRemoved;

        if (addedVisibleColumnIDs.length > 0 || removedColumnIDs.length > 0) {
          setCurrentColumnWidths(adjustedForRemovedAndAdded);
        } else if (visibleColumnsHaveWidth(ordering, columns)) {
          const propsColumnWidths = createNewWidthsMap(ordering, columns);
          if (!isEqual(currentColumnWidths, propsColumnWidths)) {
            setCurrentColumnWidths(propsColumnWidths);
          }
        }
      }
    },
    // We explicitly do NOT want to trigger this effect if currentColumnWidths is modified
    // since it would be directly overridden by the column props. This effect can be removed
    // with issue https://github.com/IBM/carbon-addons-iot-react/issues/1224
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasResize, columns, ordering]
  );

  const lastVisibleColumn = ordering.filter((col) => !col.isHidden).slice(-1)[0];

  return (
    <CarbonTableHead
      className={classnames({ lightweight })}
      onMouseMove={hasResize ? forwardMouseEvent : null}
      onMouseUp={hasResize ? forwardMouseEvent : null}
      data-testid={testID}
    >
      <TableRow>
        {hasRowExpansion || hasRowNesting ? (
          <TableExpandHeader
            data-testid={`${testID}-row-expansion-column`}
            className={classnames({
              [`${iotPrefix}--table-expand-resize`]: hasResize,
            })}
          />
        ) : null}

        {hasRowSelection === 'multi' ? (
          <TableHeader
            testID={`${testID}-row-selection-column`}
            className={classnames(`${iotPrefix}--table-header-checkbox`, {
              [`${iotPrefix}--table-header-checkbox-resize`]: hasResize,
            })}
            translateWithId={(...args) => tableTranslateWithId(...args)}
          >
            {/* TODO: Replace checkbox with TableSelectAll component when onChange bug is fixed
                    https://github.com/IBM/carbon-components-react/issues/1088 */}
            <Checkbox
              disabled={isDisabled}
              id={`${tableId}-head`}
              labelText={selectAllText}
              hideLabel
              indeterminate={isSelectAllIndeterminate}
              checked={isSelectAllSelected}
              onChange={() => onSelectAll(!isSelectAllSelected)}
            />
          </TableHeader>
        ) : null}
        {ordering.map((item, columnIndex) => {
          const matchingColumnMeta = columns.find((column) => column.id === item.columnId);
          const hasSingleSort =
            matchingColumnMeta && sort && sort.columnId === matchingColumnMeta.id;
          const multiSortColumn =
            hasMultiSort &&
            matchingColumnMeta &&
            Array.isArray(sort) &&
            sort.find((c) => c.columnId === matchingColumnMeta.id);
          const hasSort = hasSingleSort || hasMultiSort;
          const sortOrder =
            hasMultiSort && Array.isArray(sort)
              ? sort.findIndex((c) => c.columnId === matchingColumnMeta.id) + 1
              : -1;

          const sortDirection = hasSingleSort
            ? sort.direction
            : hasMultiSort && multiSortColumn?.direction
            ? multiSortColumn.direction
            : 'NONE';

          const align =
            matchingColumnMeta && matchingColumnMeta.align ? matchingColumnMeta.align : 'start';
          const hasOverflow = Array.isArray(matchingColumnMeta?.overflowMenuItems);

          // Increases the minimum width of the Header when the overflow button is present
          const paddingExtra = hasOverflow
            ? matchingColumnMeta.isSortable
              ? PADDING_WITH_OVERFLOW_AND_SORT
              : PADDING_WITH_OVERFLOW
            : 0;

          return !item.isHidden && matchingColumnMeta ? (
            <TableHeader
              testID={`${testID}-column-${matchingColumnMeta.id}`}
              width={initialColumnWidths[matchingColumnMeta.id]}
              initialWidth={initialColumnWidths[matchingColumnMeta.id]}
              id={`column-${matchingColumnMeta.id}`}
              key={`column-${matchingColumnMeta.id}`}
              data-column={matchingColumnMeta.id}
              isSortable={matchingColumnMeta.isSortable && !isDisabled}
              isSortHeader={hasSort}
              hasTooltip={!!matchingColumnMeta.tooltip}
              ref={columnRef[matchingColumnMeta.id]}
              thStyle={{
                width:
                  currentColumnWidths[matchingColumnMeta.id] &&
                  currentColumnWidths[matchingColumnMeta.id].width,
              }}
              style={{
                '--table-header-width': classnames(initialColumnWidths[matchingColumnMeta.id]),
              }}
              onClick={() => {
                if (matchingColumnMeta.isSortable && onChangeSort) {
                  onChangeSort(matchingColumnMeta.id);
                }
              }}
              translateWithId={(...args) => tableTranslateWithId(i18n, ...args)}
              sortDirection={sortDirection}
              align={align}
              className={classnames(`table-header-label-${align}`, {
                [`${iotPrefix}--table-head--table-header`]: initialColumnWidths !== undefined,
                'table-header-sortable': matchingColumnMeta.isSortable,
                [`${iotPrefix}--table-header-resize`]: hasResize,
                [`${iotPrefix}--table-head--table-header--with-overflow`]:
                  matchingColumnMeta.isSortable && hasOverflow,
              })}
              // data-floating-menu-container is a work around for this carbon issue: https://github.com/carbon-design-system/carbon/issues/4755
              data-floating-menu-container
            >
              <TableCellRenderer
                className={`${iotPrefix}--table-head--text`}
                wrapText={wrapCellText}
                truncateCellText={truncateCellText}
                allowTooltip={false}
                tooltip={matchingColumnMeta.tooltip}
              >
                {matchingColumnMeta.name}
              </TableCellRenderer>

              {hasOverflow || (hasMultiSort && matchingColumnMeta.isSortable) ? (
                <OverflowMenu
                  className={`${iotPrefix}--table-head--overflow`}
                  direction="bottom"
                  data-testid="table-head--overflow"
                  flipped={columnIndex === ordering.length - 1}
                  onClick={(e) => e.stopPropagation()}
                >
                  {hasOverflow &&
                    matchingColumnMeta.overflowMenuItems.map((menuItem) => (
                      <OverflowMenuItem
                        itemText={menuItem.text}
                        key={`${columnIndex}--overflow-item-${menuItem.id}`}
                        onClick={(e) => handleOverflowItemClick(e, menuItem)}
                      />
                    ))}
                  {hasMultiSort && (
                    <OverflowMenuItem
                      itemText={i18n.multiSortOverflowItem}
                      key={`${columnIndex}--overflow-item-multi-sort`}
                      onClick={(e) => handleOverflowItemClick(e, { id: 'multi-sort' })}
                    />
                  )}
                </OverflowMenu>
              ) : null}
              {sortOrder > 0 && (
                <span className={`${iotPrefix}--table-header-label__sort-order`}>{sortOrder}</span>
              )}
              {hasResize && item !== lastVisibleColumn ? (
                <ColumnResize
                  onResize={onManualColumnResize}
                  ref={columnResizeRefs[matchingColumnMeta.id]}
                  currentColumnWidths={currentColumnWidths}
                  columnId={matchingColumnMeta.id}
                  ordering={ordering}
                  paddingExtra={paddingExtra}
                />
              ) : null}
            </TableHeader>
          ) : null;
        })}
        {options.hasRowActions ? (
          <TableHeader
            testID={`${testID}-row-actions-column`}
            className={classnames(`${iotPrefix}--table-header-row-action-column`, {
              [`${iotPrefix}--table-header-row-action-column--extra-wide`]: hasSingleRowEdit,
            })}
          />
        ) : null}
      </TableRow>
      {filterBarActive && (
        <FilterHeaderRow
          testID={`${testID}-filter-header-row`}
          key={!hasFastFilter && JSON.stringify(filters)}
          columns={columns.map((column) => ({
            ...column.filter,
            id: column.id,
            isFilterable: !isNil(column.filter),
            isMultiselect: column.filter?.isMultiselect,
            width: column.width,
          }))}
          hasFastFilter={hasFastFilter}
          clearFilterText={clearFilterText}
          filterText={filterText}
          clearSelectionText={clearSelectionText}
          openMenuText={openMenuText}
          closeMenuText={closeMenuText}
          ordering={ordering}
          filters={filters}
          tableOptions={options}
          onApplyFilter={onApplyFilter}
          lightweight={lightweight}
          isDisabled={isDisabled}
        />
      )}
      {activeBar === 'column' && (
        <ColumnHeaderRow
          testID={`${testID}-column-header-row`}
          columns={columns.map((column) => ({
            id: column.id,
            name: column.name,
          }))}
          ordering={ordering}
          options={options}
          onChangeOrdering={onChangeOrdering}
          onColumnToggle={onColumnToggle}
          lightweight={lightweight}
          onColumnSelectionConfig={onColumnSelectionConfig}
          columnSelectionConfigText={i18n.columnSelectionConfig}
          isDisabled={isDisabled}
        />
      )}
    </CarbonTableHead>
  );
};

TableHead.propTypes = propTypes;
TableHead.defaultProps = defaultProps;

export default TableHead;
