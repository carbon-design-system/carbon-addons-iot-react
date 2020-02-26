/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useState, useEffect, useLayoutEffect, createRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DataTable, Checkbox } from 'carbon-components-react';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import classnames from 'classnames';

import { TableColumnsPropTypes, I18NPropTypes, defaultI18NPropTypes } from '../TablePropTypes';
import TableCellRenderer from '../TableCellRenderer/TableCellRenderer';
import { tableTranslateWithId } from '../../../utils/componentUtilityFunctions';
import { settings } from '../../../constants/Settings';

import ColumnHeaderRow from './ColumnHeaderRow/ColumnHeaderRow';
import FilterHeaderRow from './FilterHeaderRow/FilterHeaderRow';
import TableHeader from './TableHeader';
import ColumnResize from './ColumnResize';

const { iotPrefix } = settings;

const { TableHead: CarbonTableHead, TableRow, TableExpandHeader } = DataTable;

const propTypes = {
  /** Important table options that the head needs to know about */
  options: PropTypes.shape({
    hasRowExpansion: PropTypes.bool,
    hasRowSelection: PropTypes.oneOf(['multi', 'single', false]),
    hasRowActions: PropTypes.bool,
    hasResize: PropTypes.bool,
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
    activeBar: PropTypes.oneOf(['column', 'filter']),
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
        value: PropTypes.string.isRequired,
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

const TableHead = ({
  options,
  options: { hasRowExpansion, hasRowSelection, hasResize },
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
  const initialColumnWidths = {};
  const columnRef = ordering.map(() => createRef());
  const columnResizeRefs = ordering.map(() => createRef());

  const [currentColumnWidths, setCurrentColumnWidths] = useState({});
  const [emitUpdatedColumnWidths, setEmitUpdatedColumnWidths] = useState(false);

  if (isEmpty(currentColumnWidths)) {
    columns.forEach(col => {
      initialColumnWidths[col.id] = col.width;
    });
  }

  const forwardMouseEvent = e => {
    columnResizeRefs.forEach(ref => {
      if (ref.current) {
        ref.current.forwardMouseEvent(e);
      }
    });
  };

  const getRenderedWidths = useCallback(
    () => {
      return columnRef.map(ref => ref.current && ref.current.getBoundingClientRect().width);
    },
    [columnRef]
  );

  const updateColumnWidthsAfterResize = modifiedColumnWidths => {
    setCurrentColumnWidths(prevColumnWidths => {
      const merged = { ...prevColumnWidths };
      modifiedColumnWidths.forEach(modCol => {
        merged[modCol.id].width = modCol.width;
      });
      return merged;
    });
    if (onColumnResize) {
      setEmitUpdatedColumnWidths(true);
    }
  };

  useEffect(() => {
    if (emitUpdatedColumnWidths) {
      const updatedColumns = getRenderedWidths().map((width, index) => ({
        ...columns[index],
        width,
      }));
      onColumnResize(updatedColumns);
      setEmitUpdatedColumnWidths(false);
    }
  });

  useLayoutEffect(
    () => {
      if (hasResize && columns.length && isEmpty(currentColumnWidths)) {
        setCurrentColumnWidths(() => {
          const widths = getRenderedWidths();
          const widthsMap = {};

          ordering.forEach((orderedColumn, index) => {
            widthsMap[orderedColumn.columnId] = {
              width: widths[index],
              index,
              id: orderedColumn.columnId,
              visible: !orderedColumn.isHidden,
            };
          });
          return widthsMap;
        });
      }
    },
    [hasResize, columns, currentColumnWidths, ordering, getRenderedWidths]
  );

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
              id="select-all"
              labelText={selectAllText}
              hideLabel
              indeterminate={isSelectAllIndeterminate}
              checked={isSelectAllSelected}
              onChange={() => onSelectAll(!isSelectAllSelected)}
            />
          </TableHeader>
        ) : null}

        {ordering.map((item, i) => {
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
              isSortable={matchingColumnMeta.isSortable}
              isSortHeader={hasSort}
              ref={columnRef[i]}
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
              <TableCellRenderer>{matchingColumnMeta.name}</TableCellRenderer>
              {hasResize && i < ordering.length - 1 ? (
                <ColumnResize
                  onResize={updateColumnWidthsAfterResize}
                  ref={columnResizeRefs[i]}
                  allColumns={currentColumnWidths}
                  columnId={matchingColumnMeta.id}
                />
              ) : null}
            </StyledCustomTableHeader>
          ) : null;
        })}
        {options.hasRowActions ? <TableHeader>&nbsp;</TableHeader> : null}
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
          key={JSON.stringify(filters)}
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
