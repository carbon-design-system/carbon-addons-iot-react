import React from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';
import styled from 'styled-components';
import { Button, PaginationV2, DataTable, Checkbox } from 'carbon-components-react';
import { iconFilter } from 'carbon-icons';

import { COLORS } from '../../styles/styles';
import { defaultFunction } from '../../utils/componentUtilityFunctions';

import FilterHeaderRow from './FilterHeaderRow/FilterHeaderRow';

const {
  Table: CarbonTable,
  TableBody,
  TableHead,
  TableHeader,
  TableExpandHeader,
  TableRow,
  TableExpandRow,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarAction,
  TableCell,
} = DataTable;

const propTypes = {
  /** Array with objects (id, name and size) */
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
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      values: PropTypes.object,
    })
  ).isRequired,
  options: PropTypes.shape({
    hasPagination: PropTypes.bool,
    hasRowSelection: PropTypes.bool,
    hasRowExpansion: PropTypes.bool,
    hasFilter: PropTypes.bool,
  }),
  view: PropTypes.shape({
    pagination: PropTypes.shape({
      pageSizes: PropTypes.arrayOf(PropTypes.number),
      totalItems: PropTypes.number.isRequired,
      page: PropTypes.number.isRequired,
    }),
    filters: PropTypes.arrayOf(
      PropTypes.shape({
        columnId: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ),
    toolbar: PropTypes.shape({
      /** Specify which header row to display, will display default header row if null */
      activeBar: PropTypes.oneOf(['filter'], ['column']),
      /** Specify which batch actions to render in the batch action bar. If empty, no batch action toolbar will display */
      batchActions: PropTypes.arrayOf(
        PropTypes.shape({
          labelText: PropTypes.string.isRequired,
          icon: PropTypes.oneOfType([
            PropTypes.shape({
              width: PropTypes.string,
              height: PropTypes.string,
              viewBox: PropTypes.string.isRequired,
              svgData: PropTypes.object.isRequired,
            }),
            PropTypes.string,
          ]),
          iconDescription: PropTypes.string,
          onClick: PropTypes.func,
        })
      ),
    }),
    table: PropTypes.shape({
      isSelectAllSelected: PropTypes.bool,
      isSelectIndeterminate: PropTypes.bool,
      selectedIds: PropTypes.arrayOf(PropTypes.string),
      sort: PropTypes.shape({
        columnId: PropTypes.string.isRequired,
        direction: PropTypes.oneOf(['NONE', 'ASC', 'DESC']),
      }),
      expandedRows: PropTypes.arrayOf(
        PropTypes.shape({
          rowId: PropTypes.string,
          content: PropTypes.element,
        })
      ),
    }),
  }),
  actions: PropTypes.shape({
    pagination: PropTypes.shape({
      /** Specify a callback for when the current page or page size is changed. This callback is passed an object parameter containing the current page and the current page size */
      onChange: PropTypes.func,
    }),
    toolbar: PropTypes.shape({
      onApplyFilter: PropTypes.func,
      onToggleFilter: PropTypes.func,
      /** Specify a callback for when the user clicks toolbar button to clear all filters. Recieves a parameter of the current filter values for each column */
      onClearAllFilters: PropTypes.func,
    }),
    table: PropTypes.shape({
      onRowSelected: PropTypes.func,
      onRowExpanded: PropTypes.func,
      onSelectAll: PropTypes.func,
      onSortChange: PropTypes.func,
    }).isRequired,
  }),
};

const defaultProps = {
  options: {},
  view: {
    pagination: { pageSizes: [10, 20, 30] },
    toolbar: {},
    table: {
      expandedRows: [],
      sort: {},
    },
  },
  actions: {
    pagination: { onChange: defaultFunction },
    toolbar: {},
    table: {
      onSortChange: defaultFunction,
    },
  },
};

const StyledTableExpandRow = styled(TableExpandRow)`
  &&& {
    cursor: pointer;
  }
`;

const StyledTableExpandRowExpanded = styled(TableExpandRow)`
  &&& {
    cursor: pointer;
    td {
      background-color: ${COLORS.blue};
      border-color: ${COLORS.blue};
      color: white;
      button {
        svg {
          fill: white;
        }
      }
      border-top: 1px solid ${COLORS.blue};
      :first-of-type {
        border-left: 1px solid ${COLORS.blue};
      }
      :last-of-type {
        border-right: 1px solid ${COLORS.blue};
      }
    }
  }
`;

const StyledExpansionTableRow = styled(TableRow)`
  &&& {
    td {
      background-color: inherit;
      border-left: 4px solid ${COLORS.blue};
      border-width: 0 0 0 4px;
    }
    :hover {
      border: inherit;
      background-color: inherit;
      td {
        background-color: inherit;
        border-left: solid ${COLORS.blue};
        border-width: 0 0 0 4px;
      }
    }
  }
`;

const Table = ({ columns, data, view, actions, options }) => {
  const minItemInView = view.pagination
    ? (view.pagination.page - 1) * view.pagination.pageSize + 1
    : 0;
  const maxItemInView = view.pagination
    ? view.pagination.page * view.pagination.pageSize
    : data.length;
  const visibleData = data.slice(minItemInView, maxItemInView);
  const filterBarActive = options.hasFilter && view.toolbar.activeBar === 'filter';
  const filterBarActiveStyle = { paddingTop: 16 };
  return (
    <div>
      {/* <Toolbar
          {...view.toolbar}
          selectedItemCount={view.table.selectedIds.length}
          {...actions.toolbar}
          hasFilters={view.filters && !!view.filters.length}
        /> */}
      <TableContainer title="DataTable with toolbar">
        <TableToolbar>
          <TableToolbarContent>
            {view.filters && !!view.filters.length ? ( // TODO: translate button
              <Button kind="secondary" onClick={actions.toolbar.onClearAllFilters} small>
                Clear All Filters
              </Button>
            ) : null}
            {options.hasFilter ? (
              <TableToolbarAction
                icon={iconFilter}
                iconDescription="Filter"
                onClick={actions.toolbar.onToggleFilter}
              />
            ) : null}
          </TableToolbarContent>
        </TableToolbar>

        <CarbonTable zebra={false}>
          <TableHead>
            <TableRow>
              {options.hasRowExpansion ? <TableExpandHeader /> : null}
              {options.hasRowSelection ? (
                <TableHeader style={filterBarActive === true ? filterBarActiveStyle : {}}>
                  {/* TODO: Replace checkbox with TableSelectAll component when onChange bug is fixed
                    https://github.com/IBM/carbon-components-react/issues/1088 */}
                  <Checkbox
                    id="select-all"
                    labelText="Select All"
                    hideLabel
                    indeterminate={view.table.isSelectIndeterminate}
                    checked={view.table.isSelectAllSelected}
                    onChange={() => actions.table.onSelectAll(!view.table.isSelectAllSelected)}
                  />
                </TableHeader>
              ) : null}
              {columns.map(column => {
                const hasSort =
                  view.table && view.table.sort && view.table.sort.columnId === column.id;
                return (
                  <TableHeader
                    key={`column-${column.id}`}
                    style={filterBarActive === true ? filterBarActiveStyle : {}}
                    isSortable={column.isSortable}
                    isSortHeader={hasSort}
                    onClick={() => {
                      if (column.isSortable && actions.table.onChangeSort) {
                        actions.table.onChangeSort(column.id);
                      }
                    }}
                    sortDirection={hasSort ? view.table.sort.direction : 'NONE'}>
                    {column.name}
                  </TableHeader>
                );
              })}
            </TableRow>
            {filterBarActive && (
              <FilterHeaderRow
                columns={columns.map(column => ({
                  ...column.filter,
                  id: column.id,
                  isFilterable: !isNil(column.filter),
                }))}
                key={JSON.stringify(view.filters)}
                filters={view.filters}
                tableOptions={options}
                onApplyFilter={actions.toolbar.onApplyFilter}
              />
            )}
          </TableHead>
          <TableBody>
            {visibleData.map(i => {
              const isRowExpanded =
                view.table.expandedRows && view.table.expandedRows.find(j => j.rowId === i.id);
              const rowSelectionCell = options.hasRowSelection ? (
                <TableCell>
                  {/* TODO: Replace checkbox with TableSelectRow component when onChange bug is fixed
                    https://github.com/IBM/carbon-components-react/issues/1088 */}
                  <Checkbox
                    id={`select-row-${i.id}`}
                    labelText="Select Row"
                    hideLabel
                    checked={view.table.selectedIds.includes(i.id)}
                    onChange={() =>
                      actions.table.onRowSelected(i.id, !view.table.selectedIds.includes(i.id))
                    }
                  />
                </TableCell>
              ) : null;
              return options.hasRowExpansion ? (
                isRowExpanded ? (
                  <React.Fragment>
                    <StyledTableExpandRowExpanded
                      key={i.id}
                      ariaLabel="Expand Row"
                      isExpanded
                      onExpand={() => actions.table.onRowExpanded(i.id, false)}
                      onClick={() => actions.table.onRowExpanded(i.id, false)}>
                      {rowSelectionCell}
                      {columns.map(col => (
                        <TableCell key={col.id}>{i.values[col.id]}</TableCell>
                      ))}
                    </StyledTableExpandRowExpanded>
                    <StyledExpansionTableRow key={`${i.id}-expanded-row`}>
                      <TableCell colSpan={columns.length + 1}>
                        {view.table.expandedRows.find(j => j.rowId === i.id).content}
                      </TableCell>
                    </StyledExpansionTableRow>
                  </React.Fragment>
                ) : (
                  <StyledTableExpandRow
                    key={i.id}
                    ariaLabel="Expand Row"
                    isExpanded={false}
                    onExpand={() => actions.table.onRowExpanded(i.id, true)}
                    onClick={() => actions.table.onRowExpanded(i.id, true)}>
                    {rowSelectionCell}
                    {columns.map(col => (
                      <TableCell key={col.id}>{i.values[col.id]}</TableCell>
                    ))}
                  </StyledTableExpandRow>
                )
              ) : (
                <TableRow key={i.id}>
                  {rowSelectionCell}
                  {columns.map(col => (
                    <TableCell key={col.id}>{i.values[col.id]}</TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </CarbonTable>
      </TableContainer>

      {options.hasPagination ? <PaginationV2 {...view.pagination} {...actions.pagination} /> : null}
    </div>
  );
};

Table.propTypes = propTypes;
Table.defaultProps = defaultProps;

export default Table;
