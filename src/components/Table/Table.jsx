import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import { Table as CarbonTable, TableContainer } from 'carbon-components-react';
import isNil from 'lodash/isNil';
import classnames from 'classnames';
import { useLangDirection } from 'use-lang-direction';

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
  ActiveTableToolbarPropType,
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
    hasFilter: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.oneOf(['onKeyPress', 'onEnterAndBlur']),
    ]),
    /** if true, the data prop will be assumed to only represent the currently visible page */
    hasOnlyPageData: PropTypes.bool,
    /** has simple search capability */
    hasSearch: PropTypes.bool,
    hasColumnSelection: PropTypes.bool,
    hasColumnSelectionConfig: PropTypes.bool,
    shouldLazyRender: PropTypes.bool,
    hasRowCountInHeader: PropTypes.bool,
    hasResize: PropTypes.bool,
    hasSingleRowEdit: PropTypes.bool,
    /** If true removes the "table-layout: fixed" for resizable tables  */
    useAutoTableLayoutForResize: PropTypes.bool,
    wrapCellText: PropTypes.oneOf(['always', 'never', 'auto']),
  }),

  /** Initial state of the table, should be updated via a local state wrapper component implementation or via a central store/redux see StatefulTable component for an example */
  view: PropTypes.shape({
    pagination: PropTypes.shape({
      pageSize: PropTypes.number,
      pageSizes: PropTypes.arrayOf(PropTypes.number),
      page: PropTypes.number,
      totalItems: PropTypes.number,
      /** Number of pages rendered in pagination */
      maxPages: PropTypes.number,
      isItemPerPageHidden: PropTypes.bool,
    }),
    filters: PropTypes.arrayOf(
      PropTypes.shape({
        columnId: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
      })
    ),
    toolbar: PropTypes.shape({
      /** Specify which header row to display, will display default header row if null */
      activeBar: ActiveTableToolbarPropType,
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
      /** buttons to be shown with when activeBar is 'rowEdit' */
      rowEditBarButtons: PropTypes.node,
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
      singleRowEditButtons: PropTypes.element,
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
      onShowRowEdit: PropTypes.func,
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
  /** what locale should we use to format table values if left empty no locale formatting happens */
  locale: PropTypes.string,
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
    hasSingleRowEdit: false,
    useAutoTableLayoutForResize: false,
    shouldLazyRender: false,
    wrapCellText: 'always',
  },
  view: {
    pagination: {
      pageSize: 10,
      pageSizes: [10, 20, 30],
      page: 1,
      totalItems: baseProps.data && baseProps.data.length,
      maxPages: 100,
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
      singleRowEditButtons: null,
    },
  },
  actions: {
    pagination: { onChangePage: defaultFunction('actions.pagination.onChangePage') },
    toolbar: {
      onToggleFilter: defaultFunction('actions.toolbar.onToggleFilter'),
      onShowRowEdit: defaultFunction('actions.toolbar.onShowRowEdit'),
      onToggleColumnSelection: defaultFunction('actions.toolbar.onToggleColumnSelection'),
      onApplyBatchAction: defaultFunction('actions.toolbar.onApplyBatchAction'),
      onCancelBatchAction: defaultFunction('actions.toolbar.onCancelBatchAction'),
    },
    table: {
      onChangeSort: defaultFunction('actions.table.onChangeSort'),
      onRowExpanded: defaultFunction('actions.table.onRowExpanded'),
      onRowClicked: defaultFunction('actions.table.onRowClicked'),
      onApplyRowAction: defaultFunction('actions.table.onApplyRowAction'),
      onEmptyStateAction: null,
      onChangeOrdering: defaultFunction('actions.table.onChangeOrdering'),
      onColumnSelectionConfig: defaultFunction('actions.table.onColumnSelectionConfig'),
      onColumnResize: defaultFunction('actions.table.onColumnResize'),
    },
  },
  locale: null,
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
    editButtonAria: 'Edit rows',
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
    locale,
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
  const { maxPages, ...paginationProps } = view.pagination;
  const langDir = useLangDirection();

  const [, forceUpdateCellTextWidth] = useState(0);

  const useCellTextTruncate = useMemo(
    () =>
      options
        ? options.wrapCellText !== 'always' &&
          ((options.hasResize && !options.useAutoTableLayoutForResize) ||
            columns.some(col => col.hasOwnProperty('width')))
        : undefined,
    [options, columns]
  );

  const handleClearFilters = () => {
    if (actions.toolbar && actions.toolbar.onClearAllFilters) {
      actions.toolbar.onClearAllFilters();
    }
    if (actions.toolbar && actions.toolbar.onApplySearch) {
      actions.toolbar.onApplySearch('');
    }
  };

  const handleOnColumnResize = resizedCols => {
    if (actions.table && actions.table.onColumnResize) {
      actions.table.onColumnResize(resizedCols);
    }
    forceUpdateCellTextWidth(n => !n);
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

  const rowEditMode = view.toolbar.activeBar === 'rowEdit';
  const singleRowEditMode = !!view.table.rowActions.find(action => action.isEditMode);

  return (
    <TableContainer
      style={style}
      className={classnames(className, `${iotPrefix}--table-container`)}
    >
      {/* If there is no items being rendered in the toolbar, don't render the toolbar */
      options.hasFilter ||
      options.hasSearch ||
      options.hasRowActions ||
      options.hasRowCountInHeader ||
      options.hasColumnSelection ||
      options.hasRowEdit ||
      actions.toolbar.onDownloadCSV ||
      secondaryTitle ||
      view.toolbar.customToolbarContent ||
      tooltip ? (
        <TableToolbar
          tableId={id}
          secondaryTitle={secondaryTitle}
          tooltip={tooltip}
          i18n={{
            clearAllFilters: i18n.clearAllFilters,
            columnSelectionButtonAria: i18n.columnSelectionButtonAria,
            filterButtonAria: i18n.filterButtonAria,
            editButtonAria: i18n.editButtonAria,
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
            'onShowRowEdit',
            'onApplySearch',
            'onDownloadCSV'
          )}
          options={{
            ...pick(
              options,
              'hasColumnSelection',

              'hasSearch',
              'hasRowSelection',
              'hasRowCountInHeader',
              'hasRowEdit'
            ),
            hasFilter: Boolean(options?.hasFilter),
          }}
          tableState={{
            totalSelected: view.table.selectedIds.length,
            totalFilters: view.filters ? view.filters.length : 0,
            totalItemsCount: view.pagination.totalItems,
            isDisabled: singleRowEditMode || view.toolbar.isDisabled,
            ...pick(
              view.toolbar,
              'batchActions',
              'search',
              'activeBar',
              'customToolbarContent',
              'rowEditBarButtons'
            ),
          }}
          data={data}
        />
      ) : null}
      <div className="addons-iot-table-container">
        <CarbonTable
          className={classnames({
            [`${iotPrefix}--data-table--resize`]: options.hasResize,
            [`${iotPrefix}--data-table--fixed`]:
              options.hasResize && !options.useAutoTableLayoutForResize,
            [`${iotPrefix}--data-table--row-actions`]: options.hasRowActions,
          })}
          {...others}
        >
          <TableHead
            {...others}
            i18n={i18n}
            lightweight={lightweight}
            options={{
              ...pick(
                options,
                'hasRowSelection',
                'hasRowExpansion',
                'hasRowActions',
                'hasColumnSelectionConfig',
                'hasResize',
                'useAutoTableLayoutForResize',
                'hasSingleRowEdit'
              ),
              wrapCellText: options.wrapCellText,
              truncateCellText: useCellTextTruncate,
            }}
            columns={columns}
            filters={view.filters}
            actions={{
              ...pick(actions.toolbar, 'onApplyFilter'),
              ...pick(
                actions.table,
                'onSelectAll',
                'onChangeSort',
                'onChangeOrdering',
                'onColumnSelectionConfig'
              ),
              onColumnResize: handleOnColumnResize,
            }}
            selectAllText={i18n.selectAllAria}
            clearFilterText={i18n.clearFilterAria}
            filterText={i18n.filterAria}
            clearSelectionText={i18n.clearSelectionAria}
            openMenuText={i18n.openMenuAria}
            closeMenuText={i18n.closeMenuAria}
            tableState={{
              isDisabled: rowEditMode || singleRowEditMode,
              activeBar: view.toolbar.activeBar,
              filters: view.filters,
              ...view.table,
              selection: {
                isSelectAllSelected: view.table.isSelectAllSelected,
                isSelectAllIndeterminate: view.table.isSelectAllIndeterminate,
              },
            }}
            hasFastFilter={options?.hasFilter === 'onKeyPress'}
          />
          {view.table.loadingState.isLoading ? (
            <TableSkeletonWithHeaders
              columns={visibleColumns}
              {...pick(options, 'hasRowSelection', 'hasRowExpansion', 'hasRowActions')}
              rowCount={view.table.loadingState.rowCount}
            />
          ) : visibleData && visibleData.length ? (
            <TableBody
              langDir={langDir}
              tableId={id}
              rows={visibleData}
              locale={locale}
              rowActionsState={view.table.rowActions}
              singleRowEditButtons={view.table.singleRowEditButtons}
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
              wrapCellText={options.wrapCellText}
              truncateCellText={useCellTextTruncate}
              ordering={view.table.ordering}
              rowEditMode={rowEditMode}
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
                isFiltered && i18n.emptyButtonLabelWithFilters
                  ? handleClearFilters // show clear filters
                  : !isFiltered && actions.table.onEmptyStateAction
                  ? actions.table.onEmptyStateAction
                  : undefined // if not filtered then show normal empty state
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
          pageSize={paginationProps.pageSize}
          pageSizes={paginationProps.pageSizes}
          page={paginationProps.page}
          isItemPerPageHidden={paginationProps.isItemPerPageHidden}
          totalItems={
            paginationProps.totalItems < maxPages * paginationProps.pageSize
              ? paginationProps.totalItems
              : maxPages * paginationProps.pageSize
          }
          onChange={actions.pagination.onChangePage}
          backwardText={i18n.pageBackwardAria}
          forwardText={i18n.pageForwardAria}
          pageNumberText={i18n.pageNumberAria}
          itemsPerPageText={i18n.itemsPerPage}
          itemText={i18n.itemsRange}
          itemRangeText={i18n.itemsRangeWithTotal}
          pageText={i18n.currentPage}
          pageRangeText={i18n.pageRange}
          preventInteraction={rowEditMode || singleRowEditMode}
        />
      ) : null}
    </TableContainer>
  );
};

Table.propTypes = propTypes;
Table.defaultProps = defaultProps({});

export default Table;
