import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import { Table as CarbonTable, TableContainer } from 'carbon-components-react';
import isNil from 'lodash/isNil';
import classNames from 'classnames';

import { defaultFunction } from '../../utils/componentUtilityFunctions';
import { settings } from '../../constants/Settings';

import {
  TableColumnsPropTypes,
  TableRowPropTypes,
  ExpandedRowsPropTypes,
  EmptyStatePropTypes,
  TableSearchPropTypes,
  I18NPropTypes,
  RowActionsStatePropTypes,
} from './TablePropTypes';
import TableHead from './TableHead/TableHead';
import TableToolbar from './TableToolbar/TableToolbar';
import EmptyTable from './EmptyTable/EmptyTable';
import TableSkeletonWithHeaders from './TableSkeletonWithHeaders/TableSkeletonWithHeaders';
import TableBody from './TableBody/TableBody';
import Pagination from './Pagination';

const { iotPrefix } = settings;

const propTypes = {
  /** DOM ID for component */
  id: PropTypes.string,
  /** Displays smaller title in header */
  secondaryTitle: PropTypes.string,
  tooltip: PropTypes.node,
  /** render zebra stripes or not */
  useZebraStyles: PropTypes.bool,
  /**  lighter styling where regular table too visually heavy */
  lightweight: PropTypes.bool,
  /** Specify the properties of each column in the table */
  columns: TableColumnsPropTypes.isRequired,
  /** Row value data for the body of the table */
  data: TableRowPropTypes.isRequired,
  /** Expanded data for the table details */
  expandedData: ExpandedRowsPropTypes,
  /** Optional properties to customize how the table should be rendered */
  options: PropTypes.shape({
    hasPagination: PropTypes.bool,
    hasRowSelection: PropTypes.oneOf(['multi', 'single', false]),
    hasRowExpansion: PropTypes.bool,
    hasRowNesting: PropTypes.bool,
    hasRowActions: PropTypes.bool,
    hasFilter: PropTypes.bool,
    /** if true, the data prop will be assumed to only represent the currently visible page */
    hasOnlyPageData: PropTypes.bool,
    /** has simple search capability */
    hasSearch: PropTypes.bool,
    hasColumnSelection: PropTypes.bool,
    hasColumnSelectionConfig: PropTypes.bool,
    shouldLazyRender: PropTypes.bool,
    hasRowCountInHeader: PropTypes.bool,
    hasResize: PropTypes.bool,
    /** If true removes the "table-layout: fixed" for resizable tables  */
    useAutoTableLayoutForResize: PropTypes.bool,
  }),

  /** Initial state of the table, should be updated via a local state wrapper component implementation or via a central store/redux see StatefulTable component for an example */
  view: PropTypes.shape({
    pagination: PropTypes.shape({
      pageSize: PropTypes.number,
      pageSizes: PropTypes.arrayOf(PropTypes.number),
      page: PropTypes.number,
      totalItems: PropTypes.number,
      isItemPerPageHidden: PropTypes.bool,
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
      /** optional content to render inside the toolbar  */
      customToolbarContent: PropTypes.node,
      /** Specify which batch actions to render in the batch action bar. If empty, no batch action toolbar will display */
      batchActions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          labelText: PropTypes.string.isRequired,
          icon: PropTypes.element,
          iconDescription: PropTypes.string,
        })
      ),
      /** Simple search state */
      search: TableSearchPropTypes,
      /** is the toolbar currently disabled */
      isDisabled: PropTypes.bool,
    }),
    table: PropTypes.shape({
      isSelectAllSelected: PropTypes.bool,
      isSelectAllIndeterminate: PropTypes.bool,
      selectedIds: PropTypes.arrayOf(PropTypes.string),
      sort: PropTypes.shape({
        columnId: PropTypes.string,
        direction: PropTypes.oneOf(['NONE', 'ASC', 'DESC']),
      }),
      /** Specify column ordering and visibility */
      ordering: PropTypes.arrayOf(
        PropTypes.shape({
          columnId: PropTypes.string.isRequired,
          /* Visibility of column in table, defaults to false */
          isHidden: PropTypes.bool,
        })
      ),
      /** what is the current state of the row actions */
      rowActions: RowActionsStatePropTypes,
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
      /** Download the table contents */
      onDownloadCSV: PropTypes.func,
    }),
    /** table wide actions */
    table: PropTypes.shape({
      onRowSelected: PropTypes.func,
      onRowClicked: PropTypes.func,
      onRowExpanded: PropTypes.func,
      onSelectAll: PropTypes.func,
      onChangeSort: PropTypes.func,
      /** callback if a row action is clicked called with the id of the action then the id of the row if you return a promise from apply row action the stateful table will assume you're asynchronous and give a spinner */
      onApplyRowAction: PropTypes.func,
      onClearRowError: PropTypes.func,
      onEmptyStateAction: PropTypes.func,
      onChangeOrdering: PropTypes.func,
      onColumnSelectionConfig: PropTypes.func,
      onColumnResize: PropTypes.func,
    }).isRequired,
  }),
  i18n: I18NPropTypes,
};

export const defaultProps = baseProps => ({
  id: 'Table',
  useZebraStyles: false,
  lightweight: false,
  title: null,
  tooltip: null,
  secondaryTitle: null,
  options: {
    hasPagination: false,
    hasRowSelection: false,
    hasRowExpansion: false,
    hasRowActions: false,
    hasRowNesting: false,
    hasFilter: false,
    hasOnlyPageData: false,
    hasSearch: false,
    hasColumnSelection: false,
    hasColumnSelectionConfig: false,
    hasResize: false,
    useAutoTableLayoutForResize: false,
    shouldLazyRender: false,
  },
  view: {
    pagination: {
      pageSize: 10,
      pageSizes: [10, 20, 30],
      page: 1,
      totalItems: baseProps.data && baseProps.data.length,
      isItemPerPageHidden: false,
    },
    filters: [],
    toolbar: {
      batchActions: [],
      search: {},
    },
    table: {
      expandedIds: [],
      isSelectAllSelected: false,
      selectedIds: [],
      rowActions: [],
      sort: {},
      ordering: baseProps.columns && baseProps.columns.map(i => ({ columnId: i.id })),
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
      onColumnSelectionConfig: defaultFunction('actions.table.onColumnSelectionConfig'),
      onColumnResize: defaultFunction('actions.table.onColumnResize'),
    },
  },
  i18n: {
    /** pagination */
    pageBackwardAria: 'Previous page',
    pageForwardAria: 'Next page',
    pageNumberAria: 'Page Number',
    itemsPerPage: 'Items per page:',
    itemsRange: (min, max) => `${min}–${max} items`,
    currentPage: page => `page ${page}`,
    itemsRangeWithTotal: (min, max, total) => `${min}–${max} of ${total} items`,
    pageRange: (current, total) => `${current} of ${total} pages`,
    /** table body */
    overflowMenuAria: 'More actions',
    clickToExpandAria: 'Click to expand content',
    clickToCollapseAria: 'Click to collapse content',
    selectAllAria: 'Select all items',
    selectRowAria: 'Select row',
    /** toolbar */
    clearAllFilters: 'Clear all filters',
    columnSelectionButtonAria: 'Column Selection',
    columnSelectionConfig: 'Manage Columns',
    filterButtonAria: 'Filters',
    searchLabel: 'Search',
    searchPlaceholder: 'Search',
    clearFilterAria: 'Clear filter',
    filterAria: 'Filter',
    openMenuAria: 'Open menu',
    closeMenuAria: 'Close menu',
    clearSelectionAria: 'Clear selection',
    batchCancel: 'Cancel',
    itemsSelected: 'items selected',
    itemSelected: 'item selected',
    rowCountInHeader: totalRowCount => `Results: ${totalRowCount}`,
    /** empty state */
    emptyMessage: 'There is no data',
    emptyMessageWithFilters: 'No results match the current filters',
    emptyButtonLabel: 'Create some data',
    emptyButtonLabelWithFilters: 'Clear all filters',
    downloadIconDescription: 'Download table content',
    filterNone: 'Unsort rows by this header',
    filterAscending: 'Sort rows by this header in ascending order',
    filterDescending: 'Sort rows by this header in descending order',
  },
});

const Table = props => {
  const {
    id,
    columns,
    data,
    expandedData,
    view,
    actions,
    options,
    lightweight,
    className,
    style,
    i18n,
    // Table Toolbar props
    secondaryTitle,
    tooltip,
    ...others
  } = merge({}, defaultProps(props), props);

  const handleClearFilters = () => {
    if (actions.toolbar && actions.toolbar.onClearAllFilters) {
      actions.toolbar.onClearAllFilters();
    }
    if (actions.toolbar && actions.toolbar.onApplySearch) {
      actions.toolbar.onApplySearch('');
    }
  };

  const minItemInView =
    options.hasPagination && !options.hasOnlyPageData && view.pagination
      ? (view.pagination.page - 1) * view.pagination.pageSize
      : 0;
  const maxItemInView =
    options.hasPagination && !options.hasOnlyPageData && view.pagination
      ? view.pagination.page * view.pagination.pageSize
      : data.length;
  const visibleData = data.slice(minItemInView, maxItemInView);

  const visibleColumns = columns.filter(
    c => !(view.table.ordering.find(o => o.columnId === c.id) || { isHidden: false }).isHidden
  );
  const totalColumns =
    visibleColumns.length +
    (options.hasRowSelection === 'multi' ? 1 : 0) +
    (options.hasRowExpansion ? 1 : 0) +
    (options.hasRowActions ? 1 : 0);

  const isFiltered =
    view.filters.length > 0 ||
    (!isNil(view.toolbar) &&
      !isNil(view.toolbar.search) &&
      !isNil(view.toolbar.search.value) &&
      view.toolbar.search.value !== '');

  return (
    <TableContainer
      style={style}
      className={classNames(className, `${iotPrefix}--table-container`)}
    >
      {/* If there is no items being rendered in the toolbar, don't render the toolbar */
      options.hasFilter ||
      options.hasSearch ||
      options.hasRowActions ||
      options.hasRowCountInHeader ||
      options.hasColumnSelection ||
      actions.toolbar.onDownloadCSV ||
      secondaryTitle ||
      tooltip ? (
        <TableToolbar
          tableId={id}
          secondaryTitle={secondaryTitle}
          tooltip={tooltip}
          i18n={{
            clearAllFilters: i18n.clearAllFilters,
            columnSelectionButtonAria: i18n.columnSelectionButtonAria,
            filterButtonAria: i18n.filterButtonAria,
            searchLabel: i18n.searchLabel,
            searchPlaceholder: i18n.searchPlaceholder,
            batchCancel: i18n.batchCancel,
            itemsSelected: i18n.itemsSelected,
            itemSelected: i18n.itemSelected,
            filterNone: i18n.filterNone,
            filterAscending: i18n.filterAscending,
            filterDescending: i18n.filterDescending,
            downloadIconDescription: i18n.downloadIconDescription,
            rowCountInHeader: i18n.rowCountInHeader,
          }}
          actions={pick(
            actions.toolbar,
            'onCancelBatchAction',
            'onApplyBatchAction',
            'onClearAllFilters',
            'onToggleColumnSelection',
            'onToggleFilter',
            'onApplySearch',
            'onDownloadCSV'
          )}
          options={pick(
            options,
            'hasColumnSelection',
            'hasFilter',
            'hasSearch',
            'hasRowSelection',
            'hasRowCountInHeader'
          )}
          tableState={{
            totalSelected: view.table.selectedIds.length,
            totalFilters: view.filters ? view.filters.length : 0,
            totalItemsCount: view.pagination.totalItems,
            ...pick(
              view.toolbar,
              'batchActions',
              'search',
              'activeBar',
              'customToolbarContent',
              'isDisabled'
            ),
          }}
        />
      ) : null}
      <div className="addons-iot-table-container">
        <CarbonTable
          className={classNames({
            [`${iotPrefix}--data-table--fixed`]:
              options.hasResize && !options.useAutoTableLayoutForResize,
          })}
          {...others}
        >
          <TableHead
            {...others}
            i18n={i18n}
            lightweight={lightweight}
            options={pick(
              options,
              'hasRowSelection',
              'hasRowExpansion',
              'hasRowActions',
              'hasColumnSelectionConfig',
              'hasResize',
              'useAutoTableLayoutForResize'
            )}
            columns={columns}
            filters={view.filters}
            actions={{
              ...pick(actions.toolbar, 'onApplyFilter'),
              ...pick(
                actions.table,
                'onSelectAll',
                'onChangeSort',
                'onChangeOrdering',
                'onColumnSelectionConfig',
                'onColumnResize'
              ),
            }}
            selectAllText={i18n.selectAllAria}
            clearFilterText={i18n.clearFilterAria}
            filterText={i18n.filterAria}
            clearSelectionText={i18n.clearSelectionAria}
            openMenuText={i18n.openMenuAria}
            closeMenuText={i18n.closeMenuAria}
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
              tableId={id}
              rows={visibleData}
              rowActionsState={view.table.rowActions}
              expandedRows={expandedData}
              columns={visibleColumns}
              expandedIds={view.table.expandedIds}
              selectedIds={view.table.selectedIds}
              {...pick(
                i18n,
                'overflowMenuAria',
                'clickToExpandAria',
                'clickToCollapseAria',
                'inProgressText',
                'actionFailedText',
                'learnMoreText',
                'dismissText',
                'selectRowAria'
              )}
              totalColumns={totalColumns}
              {...pick(
                options,
                'hasRowSelection',
                'hasRowExpansion',
                'hasRowActions',
                'hasRowNesting',
                'shouldExpandOnRowClick',
                'shouldLazyRender'
              )}
              ordering={view.table.ordering}
              actions={pick(
                actions.table,
                'onRowSelected',
                'onApplyRowAction',
                'onClearRowError',
                'onRowExpanded',
                'onRowClicked'
              )}
            />
          ) : (
            <EmptyTable
              id={id}
              totalColumns={totalColumns}
              isFiltered={isFiltered}
              emptyState={
                // only show emptyState if no filters or search is applied
                view.table.emptyState && !isFiltered
                  ? view.table.emptyState
                  : {
                      message: i18n.emptyMessage,
                      messageWithFilters: i18n.emptyMessageWithFilters,
                      buttonLabel: i18n.emptyButtonLabel,
                      buttonLabelWithFilters: i18n.emptyButtonLabelWithFilters,
                    }
              }
              onEmptyStateAction={
                isFiltered ? handleClearFilters : actions.table.onEmptyStateAction
              }
            />
          )}
        </CarbonTable>
      </div>
      {options.hasPagination &&
      !view.table.loadingState.isLoading &&
      visibleData &&
      visibleData.length ? ( // don't show pagination row while loading
        <Pagination
          {...view.pagination}
          onChange={actions.pagination.onChangePage}
          backwardText={i18n.pageBackwardAria}
          forwardText={i18n.pageForwardAria}
          pageNumberText={i18n.pageNumberAria}
          itemsPerPageText={i18n.itemsPerPage}
          itemText={i18n.itemsRange}
          itemRangeText={i18n.itemsRangeWithTotal}
          pageText={i18n.currentPage}
          pageRangeText={i18n.pageRange}
        />
      ) : null}
    </TableContainer>
  );
};

Table.propTypes = propTypes;
Table.defaultProps = defaultProps({});

export default Table;
