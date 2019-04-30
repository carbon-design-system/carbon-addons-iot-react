import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import { PaginationV2, DataTable } from 'carbon-components-react';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import styled from 'styled-components';
import sizeMe from 'react-sizeme';

import { defaultFunction } from '../../utils/componentUtilityFunctions';

import {
  TableColumnsPropTypes,
  TableRowPropTypes,
  ExpandedRowsPropTypes,
  EmptyStatePropTypes,
  TableSearchPropTypes,
  I18NPropTypes,
} from './TablePropTypes';
import TableHead from './TableHead/TableHead';
import TableToolbar from './TableToolbar/TableToolbar';
import EmptyTable from './EmptyTable/EmptyTable';
import TableSkeletonWithHeaders from './TableSkeletonWithHeaders/TableSkeletonWithHeaders';
import TableBody from './TableBody/TableBody';

const { Table: CarbonTable, TableContainer } = DataTable;

const StyledTableDiv = styled.div`
  &&& {
    .bx--data-table-v2-container {
      min-width: unset;
    }
  }
`;

const StyledPagination = sizeMe({ noPlaceholder: true })(styled(PaginationV2)`
  &&& {
    .bx--pagination__left,
    .bx--pagination__text {
      display: ${props =>
        props.size && props.size.width && props.size.width < 600 ? 'none' : 'flex'};
    }
  }
`);

const propTypes = {
  /** DOM ID for component */
  id: PropTypes.string,
  /** render zebra stripes or not */
  zebra: PropTypes.bool,
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
    hasRowSelection: PropTypes.oneOf(['multi', 'single', '']),
    hasRowExpansion: PropTypes.bool,
    hasRowNesting: PropTypes.bool,
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
      /** optional content to render inside the toolbar  */
      customToolbarContent: PropTypes.node,
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
  i18n: I18NPropTypes,
};

export const defaultProps = baseProps => ({
  id: 'Table',
  zebra: false,
  lightweight: false,
  options: {
    hasPagination: false,
    hasRowSelection: '',
    hasRowExpansion: false,
    hasRowActions: false,
    hasRowNesting: false,
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
      search: {},
    },
    table: {
      expandedIds: [],
      isSelectAllSelected: false,
      selectedIds: [],
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
    filterButtonAria: 'Filters',
    searchPlaceholder: 'Search',
    clearFilterAria: 'Clear filter',
    filterAria: 'Filter',
    openMenuAria: 'Open menu',
    closeMenuAria: 'Close menu',
    clearSelectionAria: 'Clear selection',
    /** empty state */
    emptyMessage: 'There is no data',
    emptyMessageWithFilters: 'No results match the current filters',
    emptyButtonLabel: 'Create some data',
    emptyButtonLabelWithFilters: 'Clear all filters',
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
    <StyledTableDiv id={id} className={className} style={style}>
      <TableToolbar
        clearAllFiltersText={i18n.clearAllFilters}
        columnSelectionText={i18n.columnSelectionButtonAria}
        filterText={i18n.filterButtonAria}
        searchPlaceholderText={i18n.searchPlaceholder}
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
          hasRowSelection: view.table.hasRowSelection,
          totalFilters: view.filters ? view.filters.length : 0,
          ...pick(view.toolbar, 'batchActions', 'search', 'activeBar', 'customToolbarContent'),
        }}
      />
      <TableContainer>
        <CarbonTable {...others}>
          <TableHead
            {...others}
            lightweight={lightweight}
            options={pick(options, 'hasRowSelection', 'hasRowExpansion', 'hasRowActions')}
            columns={columns}
            filters={view.filters}
            actions={{
              ...pick(actions.toolbar, 'onApplyFilter'),
              ...pick(actions.table, 'onSelectAll', 'onChangeSort', 'onChangeOrdering'),
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
              id={id}
              rows={visibleData}
              expandedRows={expandedData}
              columns={visibleColumns}
              expandedIds={view.table.expandedIds}
              selectedIds={view.table.selectedIds}
              selectRowText={get(view, 'selection.selectRowText')}
              overflowMenuText={i18n.overflowMenuAria}
              clickToExpandText={i18n.clickToExpandAria}
              clickToCollapseText={i18n.clickToCollapseAria}
              totalColumns={totalColumns}
              {...pick(
                options,
                'hasRowSelection',
                'hasRowExpansion',
                'hasRowActions',
                'hasRowNesting',
                'shouldExpandOnRowClick'
              )}
              ordering={view.table.ordering}
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
      </TableContainer>

      {options.hasPagination &&
      !view.table.loadingState.isLoading &&
      visibleData &&
      visibleData.length ? ( // don't show pagination row while loading
        <StyledPagination
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
    </StyledTableDiv>
  );
};

Table.propTypes = propTypes;
Table.defaultProps = defaultProps({});

export default Table;
