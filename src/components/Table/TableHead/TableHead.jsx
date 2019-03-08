import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, Checkbox } from 'carbon-components-react';
import isNil from 'lodash/isNil';

import TableCellRenderer from '../TableCellRenderer/TableCellRenderer';

import ColumnHeaderRow from './ColumnHeaderRow/ColumnHeaderRow';
import FilterHeaderRow from './FilterHeaderRow/FilterHeaderRow';

const { TableHead: CarbonTableHead, TableRow, TableExpandHeader, TableHeader } = DataTable;

const propTypes = {
  /** Important table options that the head needs to know about */
  options: PropTypes.shape({
    hasRowExpansion: PropTypes.bool,
    hasRowSelection: PropTypes.bool,
    hasRowActions: PropTypes.bool,
  }),
  /** List of columns */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      isSortable: PropTypes.bool,
      filter: PropTypes.shape({
        placeholderText: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
          })
        ),
      }),
    })
  ).isRequired,

  /** Current state of the table */
  tableState: PropTypes.shape({
    /** Which toolbar is currently active */
    activeBar: PropTypes.oneOf(['column', 'filter']),
    /** What's currently selected in the table? */
    selection: PropTypes.shape({
      isSelectAllIndeterminate: PropTypes.bool,
      isSelectAllSelected: PropTypes.bool,
    }),
    /** What sorting is currently applied */
    sort: PropTypes.shape({ direction: PropTypes.string, column: PropTypes.string }),
    /** What column ordering is currently applied to the table */
    ordering: PropTypes.arrayOf(
      PropTypes.shape({
        columnId: PropTypes.string.isRequired,
        /* Visibility of column in table, defaults to false */
        isHidden: PropTypes.bool,
      })
    ),
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
    onApplyFilter: PropTypes.func,
  }).isRequired,
};

const defaultProps = {
  options: {},
};

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
  actions: { onSelectAll, onChangeSort, onApplyFilter, onChangeOrdering },
}) => {
  const filterBarActive = activeBar === 'filter';
  const filterBarActiveStyle = { paddingTop: 16 };
  return (
    <CarbonTableHead>
      <TableRow>
        {hasRowExpansion ? <TableExpandHeader /> : null}
        {hasRowSelection ? (
          <TableHeader
            style={Object.assign(
              { paddingBottom: '0.5rem' },
              filterBarActive ? filterBarActiveStyle : {}
            )}>
            {/* TODO: Replace checkbox with TableSelectAll component when onChange bug is fixed
                    https://github.com/IBM/carbon-components-react/issues/1088 */}
            <Checkbox
              id="select-all"
              labelText="Select All"
              hideLabel
              indeterminate={isSelectAllIndeterminate}
              checked={isSelectAllSelected}
              onChange={() => onSelectAll(!isSelectAllSelected)}
            />
          </TableHeader>
        ) : null}
        {columns
          .filter(
            column => !ordering.find(columnOrder => columnOrder.columnId === column.id).isHidden
          ) // only render visible columns
          .map(column => {
            const hasSort = sort && sort.columnId === column.id;
            return (
              <TableHeader
                id={`column-${column.id}`}
                key={`column-${column.id}`}
                data-column={column.id}
                style={filterBarActive === true ? filterBarActiveStyle : {}}
                isSortable={column.isSortable}
                isSortHeader={hasSort}
                onClick={() => {
                  if (column.isSortable && onChangeSort) {
                    onChangeSort(column.id);
                  }
                }}
                sortDirection={hasSort ? sort.direction : 'NONE'}>
                <TableCellRenderer>{column.name}</TableCellRenderer>
              </TableHeader>
            );
          })}
        {options.hasRowActions ? <TableHeader>&nbsp;</TableHeader> : null}
      </TableRow>
      {filterBarActive && (
        <FilterHeaderRow
          columns={columns.map(column => ({
            ...column.filter,
            id: column.id,
            isFilterable: !isNil(column.filter),
          }))}
          ordering={ordering}
          key={JSON.stringify(filters)}
          filters={filters}
          tableOptions={options}
          onApplyFilter={onApplyFilter}
        />
      )}
      {activeBar === 'column' && (
        <ColumnHeaderRow
          columns={columns.map(column => ({
            id: column.id,
            name: column.name,
          }))}
          ordering={ordering}
          tableOptions={options}
          onChangeOrdering={onChangeOrdering}
        />
      )}
    </CarbonTableHead>
  );
};

TableHead.propTypes = propTypes;
TableHead.defaultProps = defaultProps;

export default TableHead;
