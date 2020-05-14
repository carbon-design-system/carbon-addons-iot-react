/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useState, useLayoutEffect, createRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DataTable, Checkbox } from 'carbon-components-react';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import classnames from 'classnames';

import {
  TableColumnsPropTypes,
  I18NPropTypes,
  defaultI18NPropTypes,
  ActiveTableToolbarPropType,
} from '../TablePropTypes';
import TableCellRenderer from '../TableCellRenderer/TableCellRenderer';
import { tableTranslateWithId } from '../../../utils/componentUtilityFunctions';
import { settings } from '../../../constants/Settings';

import ColumnHeaderRow from './ColumnHeaderRow/ColumnHeaderRow';
import FilterHeaderRow from './FilterHeaderRow/FilterHeaderRow';
import TableHeader from './TableHeader';
import ColumnResize from './ColumnResize';
import {
  createNewWidthsMap,
  calculateWidthsOnToggle,
  adjustLastColumnWidth,
} from './columnWidthUtilityFunctions';

const { iotPrefix } = settings;

const { TableHead: CarbonTableHead, TableRow, TableExpandHeader } = DataTable;

const propTypes = {
  /** Important table options that the head needs to know about */
  options: PropTypes.shape({
    hasRowExpansion: PropTypes.bool,
    hasRowSelection: PropTypes.oneOf(['multi', 'single', false]),
    hasRowActions: PropTypes.bool,
    hasResize: PropTypes.bool,
    wrapCellText: PropTypes.oneOf(['always', 'never', 'auto']).isRequired,
    truncateCellText: PropTypes.bool.isRequired,
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
    /** Which toolbar is currently active */
    activeBar: ActiveTableToolbarPropType,
    /** What's currently selected in the table? */
    selection: PropTypes.shape({
      isSelectAllIndeterminate: PropTypes.bool,
      isSelectAllSelected: PropTypes.bool,
    }).isRequired,
    /** What sorting is currently applied */
    sort: PropTypes.shape({ direction: PropTypes.string, column: PropTypes.string }).isRequired,
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
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
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
  }).isRequired,
  /** lightweight  */
  lightweight: PropTypes.bool,
  i18n: I18NPropTypes,
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
};

const StyledCustomTableHeader = styled(TableHeader)`
  &&& {
    ${props => {
      const { width } = props;
      return width !== undefined
        ? `
       .bx--table-header-label { 
          min-width: ${width};
          max-width: ${width};
          white-space: nowrap;
          overflow-x: hidden;
          overflow-y: hidden;
          text-overflow: ellipsis;
        }
      `
        : '';
    }}

    vertical-align: middle;

    &
  }
`;

const generateOrderedColumnRefs = ordering =>
  ordering.map(col => col.columnId).reduce((acc, id) => ({ ...acc, [id]: createRef() }), {});

const TableHead = ({
  options,
  options: { hasRowExpansion, hasRowSelection, hasResize, wrapCellText, truncateCellText },
  columns,
  tableState: {
    selection: { isSelectAllIndeterminate, isSelectAllSelected },
    sort,
    activeBar,
    ordering,
    filters,
  },
  actions: {
    onSelectAll,
    onChangeSort,
    onApplyFilter,
    onChangeOrdering,
    onColumnSelectionConfig,
    onColumnResize,
  },
  selectAllText,
  clearFilterText,
  filterText,
  clearSelectionText,
  openMenuText,
  closeMenuText,
  lightweight,
  i18n,
}) => {
  const filterBarActive = activeBar === 'filter';
  const rowEditBarActive = activeBar === 'rowEdit';
  const initialColumnWidths = {};
  const columnRef = generateOrderedColumnRefs(ordering);
  const columnResizeRefs = generateOrderedColumnRefs(ordering);
  const [currentColumnWidths, setCurrentColumnWidths] = useState({});

  if (isEmpty(currentColumnWidths)) {
    columns.forEach(col => {
      initialColumnWidths[col.id] = col.width;
    });
  }

  const forwardMouseEvent = e => {
    Object.entries(columnResizeRefs).forEach(([, ref]) => {
      if (ref.current) {
        ref.current.forwardMouseEvent(e);
      }
    });
  };

  const measureColumnWidths = useCallback(
    () => {
      return ordering
        .filter(col => !col.isHidden)
        .map(col => {
          const ref = columnRef[col.columnId];
          return {
            id: col.columnId,
            width: ref.current && ref.current.getBoundingClientRect().width,
          };
        });
    },
    [ordering, columnRef]
  );

  const updateColumnWidths = newColumnWidths => {
    const updatedColumns = columns.map(col => ({
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

  const onManualColumnResize = modifiedColumnWidths => {
    const newColumnWidths = createNewWidthsMap(ordering, currentColumnWidths, modifiedColumnWidths);
    updateColumnWidths(newColumnWidths);
  };

  const onColumnToggle = (columnId, newOrdering) => {
    if (hasResize) {
      const toggleArgs = { currentColumnWidths, newOrdering, columnId, columns };
      const newColumnWidths = calculateWidthsOnToggle(toggleArgs);
      updateColumnWidths(newColumnWidths);
    }
    onChangeOrdering(newOrdering);
  };

  useLayoutEffect(
    () => {
      if (hasResize && columns.length && isEmpty(currentColumnWidths)) {
        const measuredWidths = measureColumnWidths();
        const adjustedWidths = adjustLastColumnWidth(ordering, columns, measuredWidths);
        const newWidthsMap = createNewWidthsMap(ordering, currentColumnWidths, adjustedWidths);
        setCurrentColumnWidths(newWidthsMap);
      }
    },
    [hasResize, columns, ordering, currentColumnWidths, measureColumnWidths]
  );

  const lastVisibleColumn = ordering.filter(col => !col.isHidden).slice(-1)[0];

  return (
    <CarbonTableHead
      className={classnames({ lightweight })}
      onMouseMove={hasResize ? forwardMouseEvent : null}
      onMouseUp={hasResize ? forwardMouseEvent : null}
    >
      <TableRow>
        {hasRowExpansion ? (
          <TableExpandHeader
            className={classnames({ [`${iotPrefix}--table-expand-resize`]: hasResize })}
          />
        ) : null}
        {hasRowSelection === 'multi' ? (
          <TableHeader
            className={classnames(`${iotPrefix}--table-header-checkbox`, {
              [`${iotPrefix}--table-header-checkbox-resize`]: hasResize,
            })}
            translateWithId={(...args) => tableTranslateWithId(...args)}
          >
            {/* TODO: Replace checkbox with TableSelectAll component when onChange bug is fixed
                    https://github.com/IBM/carbon-components-react/issues/1088 */}
            <Checkbox
              disabled={rowEditBarActive}
              id="select-all"
              labelText={selectAllText}
              hideLabel
              indeterminate={isSelectAllIndeterminate}
              checked={isSelectAllSelected}
              onChange={() => onSelectAll(!isSelectAllSelected)}
            />
          </TableHeader>
        ) : null}

        {ordering.map(item => {
          const matchingColumnMeta = columns.find(column => column.id === item.columnId);
          const hasSort = matchingColumnMeta && sort && sort.columnId === matchingColumnMeta.id;
          const align =
            matchingColumnMeta && matchingColumnMeta.align ? matchingColumnMeta.align : 'start';
          return !item.isHidden && matchingColumnMeta ? (
            <StyledCustomTableHeader
              width={initialColumnWidths[matchingColumnMeta.id]}
              id={`column-${matchingColumnMeta.id}`}
              key={`column-${matchingColumnMeta.id}`}
              data-column={matchingColumnMeta.id}
              isSortable={matchingColumnMeta.isSortable && !rowEditBarActive}
              isSortHeader={hasSort}
              ref={columnRef[matchingColumnMeta.id]}
              thStyle={{
                width:
                  currentColumnWidths[matchingColumnMeta.id] &&
                  currentColumnWidths[matchingColumnMeta.id].width,
              }}
              onClick={() => {
                if (matchingColumnMeta.isSortable && onChangeSort) {
                  onChangeSort(matchingColumnMeta.id);
                }
              }}
              translateWithId={(...args) => tableTranslateWithId(i18n, ...args)}
              sortDirection={hasSort ? sort.direction : 'NONE'}
              align={align}
              className={classnames(`table-header-label-${align}`, {
                'table-header-sortable': matchingColumnMeta.isSortable,
                [`${iotPrefix}--table-header-resize`]: hasResize,
              })}
            >
              <TableCellRenderer
                wrapText={wrapCellText}
                truncateCellText={truncateCellText}
                allowTooltip={false}
              >
                {matchingColumnMeta.name}
              </TableCellRenderer>
              {hasResize && item !== lastVisibleColumn ? (
                <ColumnResize
                  onResize={onManualColumnResize}
                  ref={columnResizeRefs[matchingColumnMeta.id]}
                  currentColumnWidths={currentColumnWidths}
                  columnId={matchingColumnMeta.id}
                  ordering={ordering}
                />
              ) : null}
            </StyledCustomTableHeader>
          ) : null;
        })}
        {options.hasRowActions ? (
          <TableHeader className={`${iotPrefix}--table-header-row-action-column`} />
        ) : null}
      </TableRow>
      {filterBarActive && (
        <FilterHeaderRow
          columns={columns.map(column => ({
            ...column.filter,
            id: column.id,
            isFilterable: !isNil(column.filter),
            width: column.width,
          }))}
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
        />
      )}
      {activeBar === 'column' && (
        <ColumnHeaderRow
          columns={columns.map(column => ({
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
        />
      )}
    </CarbonTableHead>
  );
};

TableHead.propTypes = propTypes;
TableHead.defaultProps = defaultProps;

export default TableHead;
