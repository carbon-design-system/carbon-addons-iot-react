/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useState, useEffect, createRef } from 'react';
import PropTypes from 'prop-types';
import { DataTable, Checkbox } from 'carbon-components-react';
import isNil from 'lodash/isNil';
import styled from 'styled-components';
import classnames from 'classnames';

import { TableColumnsPropTypes, I18NPropTypes, defaultI18NPropTypes } from '../TablePropTypes';
import TableCellRenderer from '../TableCellRenderer/TableCellRenderer';
import { tableTranslateWithId } from '../../../utils/componentUtilityFunctions';

import ColumnHeaderRow from './ColumnHeaderRow/ColumnHeaderRow';
import FilterHeaderRow from './FilterHeaderRow/FilterHeaderRow';
import TableHeader from './TableHeader';

const { TableHead: CarbonTableHead, TableRow, TableExpandHeader } = DataTable;

const propTypes = {
  /** Important table options that the head needs to know about */
  options: PropTypes.shape({
    hasRowExpansion: PropTypes.bool,
    hasRowSelection: PropTypes.oneOf(['multi', 'single', false]),
    hasRowActions: PropTypes.bool,
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
  }).isRequired,
  /** lightweight  */
  lightweight: PropTypes.bool,
  i18n: I18NPropTypes,
  hasResize: PropTypes.bool,
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
  hasResize: true,
};

const StyledCheckboxTableHeader = styled(TableHeader)`
  && {
    vertical-align: middle;

    & > span {
      padding: 0;
    }
`;

const StyledCarbonTableHead = styled(({ lightweight, ...others }) => (
  <CarbonTableHead {...others} />
))`
  th {
    height: 3rem;
    border-top: none;
    border-bottom: none;
  }
`;

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
  options: { hasRowExpansion, hasRowSelection },
  columns,
  tableState: {
    selection: { isSelectAllIndeterminate, isSelectAllSelected },
    sort,
    activeBar,
    ordering,
    filters,
  },
  actions: { onSelectAll, onChangeSort, onApplyFilter, onChangeOrdering, onColumnSelectionConfig },
  selectAllText,
  clearFilterText,
  filterText,
  clearSelectionText,
  openMenuText,
  closeMenuText,
  lightweight,
  i18n,
  hasResize,
}) => {
  const filterBarActive = activeBar === 'filter';
  const [columnWidth, setColumnWidth] = useState({});
  const columnRef = ordering.map(() => createRef());
  const columnVar = {
    index: 0,
    element: Node,
    startX: 0,
    move: 0,
    direction: 0,
  };
  const mousemoveCallback = e => {
    const mousePosition = e.clientX + columnVar.startX;
    columnVar.direction = e.clientX > columnVar.move ? 'right' : 'left';
    const minColumnWidth = 50;
    const rightBound = columnWidth[columnVar.index];
    const leftBound = columnWidth[columnVar.index + 1] - minColumnWidth;
    if (
      document.dir !== 'rtl' &&
      ((columnVar.direction === 'left' && mousePosition > minColumnWidth) ||
        (columnVar.direction === 'right' && mousePosition < rightBound + leftBound))
    ) {
      columnVar.element.style.left = `${mousePosition}px`;
    } else if (
      document.dir === 'rtl' &&
      ((columnVar.direction === 'left' && mousePosition > -leftBound) ||
        (columnVar.direction === 'right' && mousePosition < rightBound - minColumnWidth))
    ) {
      columnVar.element.style.left = `${mousePosition}px`;
    } else {
      document.onmousemove = null;
    }
  };
  const mouseupCallback = () => {
    const resizePosition = columnVar.element.offsetLeft + columnVar.element.clientWidth;
    setColumnWidth(cols => ({
      ...cols,
      [columnVar.index]:
        document.dir === 'rtl' ? columnWidth[columnVar.index] - resizePosition : resizePosition,
      [columnVar.index + 1]:
        document.dir === 'rtl'
          ? columnWidth[columnVar.index + 1] + resizePosition
          : columnWidth[columnVar.index + 1] + columnWidth[columnVar.index] - resizePosition,
    }));
    document.onmouseup = null;
    document.onmousemove = null;
    columnVar.element.style.left = null;
  };
  const onMouseDownCallback = (e, index) => {
    columnVar.element = e.target;
    columnVar.index = index;
    columnVar.startX = columnVar.element.offsetLeft - e.clientX;
    columnVar.move = e.clientX;
    document.onmouseup = mouseupCallback;
    document.onmousemove = mousemoveCallback;
  };
  useEffect(
    () => {
      const nextWidth = columnRef.map(
        ref => ref.current && ref.current.getBoundingClientRect().width
      );
      setColumnWidth(nextWidth);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <StyledCarbonTableHead lightweight={`${lightweight}`}>
      <TableRow>
        {hasRowExpansion ? <TableExpandHeader /> : null}
        {hasRowSelection === 'multi' ? (
          <StyledCheckboxTableHeader translateWithId={(...args) => tableTranslateWithId(...args)}>
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
          </StyledCheckboxTableHeader>
        ) : null}

        {ordering.map((item, i) => {
          const matchingColumnMeta = columns.find(column => column.id === item.columnId);
          const hasSort = matchingColumnMeta && sort && sort.columnId === matchingColumnMeta.id;
          const align =
            matchingColumnMeta && matchingColumnMeta.align ? matchingColumnMeta.align : 'start';
          return !item.isHidden && matchingColumnMeta ? (
            <StyledCustomTableHeader
              id={`column-${matchingColumnMeta.id}`}
              key={`column-${matchingColumnMeta.id}`}
              data-column={matchingColumnMeta.id}
              isSortable={matchingColumnMeta.isSortable}
              isSortHeader={hasSort}
              ref={columnRef[i]}
              thStyle={{ width: columnWidth[i] }}
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
              })}
            >
              <TableCellRenderer>{matchingColumnMeta.name}</TableCellRenderer>
              {hasResize && i < ordering.length - 1 ? (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <div
                  id={`resize-${matchingColumnMeta.id}`}
                  className="column-resize-wrapper"
                  onMouseDown={e => onMouseDownCallback(e, i)}
                  onClick={e => e.stopPropagation()}
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
    </StyledCarbonTableHead>
  );
};

TableHead.propTypes = propTypes;
TableHead.defaultProps = defaultProps;

export default TableHead;
