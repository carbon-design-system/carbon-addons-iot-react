import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import { PaginationV2, DataTable } from 'carbon-components-react';

import { defaultFunction } from '../../utils/componentUtilityFunctions';

import {
  TableColumnsPropTypes,
  TableDataPropTypes,
  ExpandedRowsPropTypes,
  EmptyStatePropTypes,
  TableSearchPropTypes,
} from './TablePropTypes';
import TableHead from './TableHead/TableHead';
import TableToolbar from './TableToolbar/TableToolbar';
import EmptyTable from './EmptyTable/EmptyTable';
import TableSkeletonWithHeaders from './TableSkeletonWithHeaders/TableSkeletonWithHeaders';
import TableBody from './TableBody/TableBody';

const { Table: CarbonTable, TableContainer } = DataTable;

const propTypes = {
  /** DOM ID for component */
  id: PropTypes.string,
  /** Specify the properties of each column in the table */
  columns: TableColumnsPropTypes.isRequired,
  /** Data for the body of the table */
  data: TableDataPropTypes.isRequired,
  /** Expanded data for the table details */
  expandedData: ExpandedRowsPropTypes,
  /** Optional properties to customize how the table should be rendered */
  options: PropTypes.shape({
    hasPagination: PropTypes.bool,
    hasRowSelection: PropTypes.bool,
    hasRowExpansion: PropTypes.bool,
    hasRowActions: PropTypes.bool,
    hasFilter: PropTypes.bool,
    /** has simple search capability */
    hasSearch: PropTypes.bool,
    hasColumnSelection: PropTypes.bool,
  }),
  /** Initial state of the table, should be updated via a local state wrapper component implementation or via a central store/redux see StatefulTable component for an example */
  view: PropTypes.shape({
    pagination: PropTypes.shape({
      pageSize: PropTypes.number,
      pageSizes: PropTypes.arrayOf(PropTypes.number),
      page: PropTypes.number,
      totalItems: PropTypes.number,
    }),
    filters: PropTypes.arrayOf(
      PropTypes.shape({
        columnId: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ),
    toolbar: PropTypes.shape({
      /** Specify which header row to display, will display default header row if null */
      activeBar: PropTypes.oneOf(['filter', 'column']),
      /** Specify which batch actions to render in the batch action bar. If empty, no batch action toolbar will display */
      batchActions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
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
        })
      ),
      /** Simple search state */
      search: TableSearchPropTypes,
    }),
    table: PropTypes.shape({
      isSelectAllSelected: PropTypes.bool,
      isSelectAllIndeterminate: PropTypes.bool,
      selectedIds: PropTypes.arrayOf(PropTypes.string),
      sort: PropTypes.shape({
        columnId: PropTypes.string,
        direction: PropTypes.oneOf(['NONE', 'ASC', 'DESC']),
      }),
      /* Specify column ordering and visibility */
      ordering: PropTypes.arrayOf(
        PropTypes.shape({
          columnId: PropTypes.string.isRequired,
          /* Visibility of column in table, defaults to false */
          isHidden: PropTypes.bool,
        })
      ),
      expandedIds: PropTypes.arrayOf(PropTypes.string),
      emptyState: EmptyStatePropTypes,
      loadingState: PropTypes.shape({
        isLoading: PropTypes.bool,
        rowCount: PropTypes.number,
      }),
    }),
  }),
  /** Callbacks for actions of the table, can be used to update state in wrapper component to update `view` props */
  actions: PropTypes.shape({
    pagination: PropTypes.shape({
      /** Specify a callback for when the current page or page size is changed. This callback is passed an object parameter containing the current page and the current page size */
      onChangePage: PropTypes.func,
    }),
    toolbar: PropTypes.shape({
      onApplyFilter: PropTypes.func,
      onToggleFilter: PropTypes.func,
      onToggleColumnSelection: PropTypes.func,
      /** Specify a callback for when the user clicks toolbar button to clear all filters. Recieves a parameter of the current filter values for each column */
      onClearAllFilters: PropTypes.func,
      onCancelBatchAction: PropTypes.func,
      onApplyBatchAction: PropTypes.func,
      /** Apply a search criteria to the table */
      onApplySearch: PropTypes.func,
    }),
    table: PropTypes.shape({
      onRowSelected: PropTypes.func,
      onRowClicked: PropTypes.func,
      onRowExpanded: PropTypes.func,
      onSelectAll: PropTypes.func,
      onChangeSort: PropTypes.func,
      onApplyRowAction: PropTypes.func,
      onEmptyStateAction: PropTypes.func,
      onChangeOrdering: PropTypes.func,
    }).isRequired,
  }),
};
const defaultProps = baseProps => ({
  id: 'Table',
  options: {
    hasPagination: false,
    hasRowSelection: false,
    hasRowExpansion: false,
    hasRowActions: false,
    hasFilter: false,
    hasSearch: false,
    hasColumnSelection: false,
  },
  view: {
    pagination: {
      pageSize: 10,
      pageSizes: [10, 20, 30],
      page: 1,
      totalItems: baseProps.data && baseProps.data.length,
    },
    filters: [],
    toolbar: {
      batchActions: [],
    },
    table: {
      expandedRows: [],
      isSelectAllSelected: false,
      selectedIds: [],
      sort: {},
      ordering: baseProps.columns && baseProps.columns.map(i => ({ columnId: i.id })),
      emptyState: {
        message: 'There is no data',
        messageWithFilters: 'No results match the current filters',
        buttonLabel: 'Create some data',
        buttonLabelWithFilters: 'Clear all filters',
      },
      loadingState: {
        rowCount: 5,
      },
    },
  },
  actions: {
    pagination: { onChangePage: defaultFunction('actions.pagination.onChangePage') },
    toolbar: {
      onToggleFilter: defaultFunction('actions.toolbar.onToggleFilter'),
      onToggleColumnSelection: defaultFunction('actions.toolbar.onToggleColumnSelection'),
      onApplyBatchAction: defaultFunction('actions.toolbar.onApplyBatchAction'),
      onCancelBatchAction: defaultFunction('actions.toolbar.onCancelBatchAction'),
    },
    table: {
      onChangeSort: defaultFunction('actions.table.onChangeSort'),
      onRowExpanded: defaultFunction('actions.table.onRowExpanded'),
      onRowClicked: defaultFunction('actions.table.onRowClicked'),
      onApplyRowAction: defaultFunction('actions.table.onApplyRowAction'),
      onEmptyStateAction: defaultFunction('actions.table.onEmptyStateAction'),
      onChangeOrdering: defaultFunction('actions.table.onChangeOrdering'),
    },
  },
});

const Table = props => {
  const { id, columns, data, expandedData, view, actions, options, className } = merge(
    {},
    defaultProps(props),
    props
  );

  const minItemInView =
    options.hasPagination && view.pagination
      ? (view.pagination.page - 1) * view.pagination.pageSize
      : 0;
  const maxItemInView =
    options.hasPagination && view.pagination
      ? view.pagination.page * view.pagination.pageSize
      : data.length;
  const visibleData = data.slice(minItemInView, maxItemInView);

  const visibleColumns = columns.filter(
    c => !(view.table.ordering.find(o => o.columnId === c.id) || { isHidden: false }).isHidden
  );
  const totalColumns =
    visibleColumns.length +
    (options.hasRowSelection ? 1 : 0) +
    (options.hasRowExpansion ? 1 : 0) +
    (options.hasRowActions ? 1 : 0);
  return (
    <div id={id} className={className}>
      <TableContainer>
        <TableToolbar
          actions={pick(
            actions.toolbar,
            'onCancelBatchAction',
            'onApplyBatchAction',
            'onClearAllFilters',
            'onToggleColumnSelection',
            'onToggleFilter',
            'onApplySearch'
          )}
          options={pick(options, 'hasColumnSelection', 'hasFilter', 'hasSearch')}
          tableState={{
            totalSelected: view.table.selectedIds.length,
            totalFilters: view.filters ? view.filters.length : 0,
            batchActions: view.toolbar.batchActions,
            search: view.toolbar.search,
          }}
        />
        <CarbonTable zebra={false}>
          <TableHead
            options={pick(options, 'hasRowSelection', 'hasRowExpansion', 'hasRowActions')}
            columns={columns}
            filters={view.filters}
            actions={{
              ...pick(actions.toolbar, 'onApplyFilter'),
              ...pick(actions.table, 'onSelectAll', 'onChangeSort', 'onChangeOrdering'),
            }}
            tableState={{
              activeBar: view.toolbar.activeBar,
              filters: view.filters,
              ...view.table,
              selection: {
                isSelectAllSelected: view.table.isSelectAllSelected,
                isSelectAllIndeterminate: view.table.isSelectAllIndeterminate,
              },
            }}
          />
          {view.table.loadingState.isLoading ? (
            <TableSkeletonWithHeaders
              columns={visibleColumns}
              {...pick(options, 'hasRowSelection', 'hasRowExpansion', 'hasRowActions')}
              rowCount={view.table.loadingState.rowCount}
            />
          ) : visibleData && visibleData.length ? (
            <TableBody
              id={id}
              rows={visibleData}
              expandedRows={expandedData}
              columns={visibleColumns}
              expandedIds={view.table.expandedIds}
              selectedIds={view.table.selectedIds}
              totalColumns={totalColumns}
              {...pick(options, 'hasRowSelection', 'hasRowExpansion')}
              actions={pick(
                actions.table,
                'onRowSelected',
                'onApplyRowAction',
                'onRowExpanded',
                'onRowClicked'
              )}
            />
          ) : (
            <EmptyTable
              totalColumns={totalColumns}
              isFiltered={view.filters.length > 0}
              emptyState={view.table.emptyState}
              onEmptyStateAction={actions.table.onEmptyStateAction}
            />
          )}
        </CarbonTable>
      </TableContainer>

      {options.hasPagination && !view.table.loadingState.isLoading ? ( // don't show pagination row while loading
        <PaginationV2 {...view.pagination} onChange={actions.pagination.onChangePage} />
      ) : null}
    </div>
  );
};

Table.propTypes = propTypes;
Table.defaultProps = defaultProps({});

export default Table;
