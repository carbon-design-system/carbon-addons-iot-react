import React, { useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { merge, pick, uniqueId } from 'lodash-es';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { Table as CarbonTable, TableContainer, Tag } from 'carbon-components-react';
import classnames from 'classnames';
import { useLangDirection } from 'use-lang-direction';
import warning from 'warning';

import { defaultFunction } from '../../utils/componentUtilityFunctions';
import { settings } from '../../constants/Settings';
import FilterTags from '../FilterTags/FilterTags';
import { RuleGroupPropType } from '../RuleBuilder/RuleBuilderPropTypes';
import experimental from '../../internal/experimental';
import deprecate from '../../internal/deprecate';

import { CELL_TEXT_OVERFLOW } from './tableConstants';
import {
  TableColumnsPropTypes,
  TableRowPropTypes,
  ExpandedRowsPropTypes,
  EmptyStatePropTypes,
  TableSearchPropTypes,
  I18NPropTypes,
  RowActionsStatePropTypes,
  ActiveTableToolbarPropType,
  TableSortPropType,
  TableColumnGroupPropType,
  TableOrderingPropType,
  TableFiltersPropType,
  TableToolbarActionsPropType,
} from './TablePropTypes';
import TableHead from './TableHead/TableHead';
import TableToolbar from './TableToolbar/TableToolbar';
import EmptyTable from './EmptyTable/EmptyTable';
import TableSkeletonWithHeaders from './TableSkeletonWithHeaders/TableSkeletonWithHeaders';
import TableBody from './TableBody/TableBody';
import Pagination from './Pagination';
import TableFoot from './TableFoot/TableFoot';
import TableMultiSortModal from './TableMultiSortModal/TableMultiSortModal';
import { useShowExpanderColumn } from './expanderColumnHook';
import ErrorTable from './ErrorTable/ErrorTable';

const { iotPrefix } = settings;

const propTypes = {
  /** DOM ID for component */
  id: PropTypes.string,
  /** Displays smaller title in header */
  secondaryTitle: PropTypes.string,
  tooltip: PropTypes.node,
  /** render zebra stripes or not */
  useZebraStyles: PropTypes.bool,
  /**  lighter styling where regular table too visually heavy. Deprecated. */
  lightweight: deprecate(
    PropTypes.bool,
    `The 'lightweight' prop has been deprecated and will be removed in the next major version.`
  ),
  /** Specify the properties of each column in the table */
  columns: TableColumnsPropTypes.isRequired,
  /** Specify the properties of each column group in the table. Defaults to empty array. */
  columnGroups: TableColumnGroupPropType,
  /** Row value data for the body of the table */
  data: TableRowPropTypes.isRequired,
  /** Expanded data for the table details */
  expandedData: ExpandedRowsPropTypes,

  /** Experimental: Turns on the carbon sticky-header feature. */
  stickyHeader: experimental('stickyHeader'),
  /** Optional properties to customize how the table should be rendered */
  options: PropTypes.shape({
    /** If true allows the table to aggregate values of columns in a special row */
    hasAggregations: PropTypes.bool,
    /** If true, search is applied as typed. If false, only after 'Enter' is pressed */
    hasFastSearch: PropTypes.bool,
    hasPagination: PropTypes.bool,
    hasRowSelection: PropTypes.oneOf(['multi', 'single', false]),
    /** True if the rows should be expandable */
    hasRowExpansion: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        /** True if any previously expanded rows should be collapsed when a new row is expanded */
        expandRowsExclusively: PropTypes.bool,
      }),
    ]),
    hasRowNesting: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        /** If the hierarchy only has 1 nested level of children */
        hasSingleNestedHierarchy: PropTypes.bool,
      }),
    ]),
    hasMultiSort: PropTypes.bool,
    hasRowActions: PropTypes.bool,
    hasFilter: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.oneOf(['onKeyPress', 'onEnterAndBlur']),
    ]),
    /* Turns on the Advanced Rule Builder Filtering. Is a boolean value */
    // eslint-disable-next-line consistent-return
    hasAdvancedFilter: (props, propName, componentName) => {
      if (__DEV__) {
        if (props?.hasFilter && props?.hasAdvancedFilter) {
          return new Error(
            `Only one of props 'options.hasFilter' or 'options.hasAdvancedFilter' can be specified in '${componentName}'.`
          );
        }

        if (![true, false, undefined].includes(props?.hasAdvancedFilter)) {
          return new Error(`'options.hasAdvancedFilter' should be a boolean or undefined.`);
        }
      }
    },
    /** if true, the data prop will be assumed to only represent the currently visible page */
    hasOnlyPageData: PropTypes.bool,
    /** has simple search capability */
    hasSearch: PropTypes.bool,
    hasColumnSelection: PropTypes.bool,
    hasColumnSelectionConfig: PropTypes.bool,
    shouldLazyRender: PropTypes.bool,
    hasRowCountInHeader: PropTypes.bool,
    /** If true enables the row edit toolbar button and functionality */
    hasRowEdit: PropTypes.bool,
    hasResize: PropTypes.bool,
    hasSingleRowEdit: PropTypes.bool,
    hasUserViewManagement: PropTypes.bool,
    /** Preserves the widths of existing columns when one or more columns are added, removed, hidden, shown or resized. */
    preserveColumnWidths: (props, propName, componentName) => {
      if (__DEV__) {
        if (props?.[propName] === false) {
          return new Error(
            `The \`${componentName}\` default is now to \`${propName}\`. The old behavior, triggered by setting \`${propName}\` to false, is deprecated.`
          );
        }
      }

      return '';
    },
    /* If true, fire the onRowExpanded callback with the rowId when a row is clicked */
    shouldExpandOnRowClick: PropTypes.bool,
    /** If true removes the "table-layout: fixed" for resizable tables  */
    useAutoTableLayoutForResize: PropTypes.bool,
    /**
     * auto - Wrap for tables with dynamic columns widths and truncate for tables with fixed or resizable columns
     * always - Wrap if needed for all table column configurations
     * never - Tables with dynamic columns widths grow larger and tables with fixed or resizable columns truncate.
     * alwaysTruncate - Always truncate if needed for all table column configurations
     */
    wrapCellText: PropTypes.oneOf(['always', 'never', 'auto', 'alwaysTruncate']),
    /** use white-space: pre; css when true */
    preserveCellWhiteSpace: PropTypes.bool,
  }),

  /** Size prop from Carbon to shrink row height (and header height in some instances) */
  size: function checkProps(props, propName, componentName) {
    if (['compact', 'short', 'normal', 'tall'].includes(props[propName])) {
      warning(
        false,
        `The value \`${props[propName]}\` has been deprecated for the ` +
          `\`${propName}\` prop on the ${componentName} component. It will be removed in the next major ` +
          `release. Please use 'xs', 'sm', 'md', 'lg', or 'xl' instead.`
      );
    }
  },

  /** Initial state of the table, should be updated via a local state wrapper component implementation or via a central store/redux see StatefulTable component for an example */
  view: PropTypes.shape({
    aggregations: PropTypes.shape({
      label: PropTypes.string,
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          /** id of the column that should have its values aggregated */
          id: PropTypes.string.isRequired,
          /** the primitive value or function that will receive an array of values and returns an aggregated value */
          value: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
          /** allow aligning the results the same as the column */
          align: PropTypes.oneOf(['start', 'center', 'end']),
          /** allows the aggregation to align with sortable columns extra padding */
          isSortable: PropTypes.bool,
        })
      ),
      /** hide the aggregation row without removing the aggregations object */
      isHidden: PropTypes.bool,
    }),
    pagination: PropTypes.shape({
      pageSize: PropTypes.number,
      pageSizes: PropTypes.arrayOf(PropTypes.number),
      page: PropTypes.number,
      totalItems: PropTypes.number,
      /** Number of pages rendered in pagination */
      maxPages: (props, propName, componentName) => {
        if (__DEV__) {
          if (typeof props[propName] !== 'number') {
            return new Error(
              `Invalid type of \`${propName}\` supplied to \`${componentName}\`. \`${propName}\` must be a positive integer.`
            );
          }
          if (props[propName] < 0 || !Number.isInteger(props[propName])) {
            const roundedStr = `${props[propName]} will be rounded to ${Math.ceil(
              props[propName]
            )}`;
            return new Error(
              `Invalid prop \`${propName}\` supplied to \`${componentName}\`. \`${propName}\` must be a positive integer. ${roundedStr}.`
            );
          }
        }

        return '';
      },
      isItemPerPageHidden: PropTypes.bool,
      /**
       * Specify the size of the Pagination buttons. Currently supports either `sm`, 'md' (default) or 'lg` as an option.
       */
      size: PropTypes.oneOf(['sm', 'md', 'lg']),
    }),
    filters: TableFiltersPropType,
    /** a stripped down version of the RuleBuilderFilterPropType */
    advancedFilters: PropTypes.arrayOf(
      PropTypes.shape({
        /** Unique id for particular filter */
        filterId: PropTypes.string.isRequired,
        /** Text for main title of page */
        filterTitleText: PropTypes.string.isRequired,
        filterRules: RuleGroupPropType.isRequired,
      })
    ),
    selectedAdvancedFilterIds: PropTypes.arrayOf(PropTypes.string),
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
      /** extra actions that can appear in an overflow menu in the toolbar (same menu as toggle aggregations) */
      toolbarActions: TableToolbarActionsPropType,
    }),
    table: PropTypes.shape({
      isSelectAllSelected: PropTypes.bool,
      isSelectAllIndeterminate: PropTypes.bool,
      selectedIds: PropTypes.arrayOf(PropTypes.string),
      sort: PropTypes.oneOfType([TableSortPropType, PropTypes.arrayOf(TableSortPropType)]),
      /** Specify the order, visibility and group belonging of the table columns */
      ordering: TableOrderingPropType,
      /** what is the current state of the row actions */
      rowActions: RowActionsStatePropTypes,
      singleRowEditButtons: PropTypes.element,
      expandedIds: PropTypes.arrayOf(PropTypes.string),
      emptyState: EmptyStatePropTypes,
      /** use custom error state or use error message directly */
      errorState: PropTypes.element,
      loadingState: PropTypes.shape({
        isLoading: PropTypes.bool,
        rowCount: PropTypes.number,
        columnCount: PropTypes.number,
      }),
      /* show the modal for selecting multi-sort columns */
      showMultiSortModal: PropTypes.bool,
      multiSortModal: PropTypes.shape({
        /**
         * The anticipatedColumn is used to add the most recently click columnId to the UI of the
         * MultiSort modal. This gives the user a better experience by preemptively adding the column
         * they clicked multi-sort on to the multisort modal without changing state. They still have to
         * click "Sort" to save it, or can click 'Cancel' or the 'X' to clear it.
         */
        anticipatedColumn: PropTypes.shape({
          columnId: PropTypes.string,
          direction: PropTypes.oneOf(['ASC', 'DESC']),
        }),
      }),
      /** Array with rowIds that are with loading active */
      loadingMoreIds: PropTypes.arrayOf(PropTypes.string),
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
      /** Specify a callback for when the user clicks toolbar button to clear all filters. Receives a parameter of the current filter values for each column */
      onClearAllFilters: PropTypes.func,
      onCancelBatchAction: PropTypes.func,
      onApplyBatchAction: PropTypes.func,
      /** Apply a search criteria to the table */
      onApplySearch: PropTypes.func,
      /** Download the table contents */
      onDownloadCSV: PropTypes.func,
      /** When advanced filters are applied */
      onApplyAdvancedFilter: PropTypes.func,
      /** Toggles the advanced filter flyout open */
      onToggleAdvancedFilter: PropTypes.func,
      /** Remove the selected advancedFilter from the table */
      onRemoveAdvancedFilter: PropTypes.func,
      /** Fired the 'create new advanced filter' button is clicked. */
      onCreateAdvancedFilter: PropTypes.func,
      /** Fired when then 'Cancel' button is clicked in the advanced filter flyout menu */
      onCancelAdvancedFilter: PropTypes.func,
      /** Fired when an advanced filter is selected or removed. */
      onChangeAdvancedFilter: PropTypes.func,
      /** fired when 'Toggle aggregations' is clicked in the overflow menu */
      onToggleAggregations: PropTypes.func,
      /** fired when clicking a 'toolbarAction' in the table toolbar */
      onApplyToolbarAction: PropTypes.func,
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
      onOverflowItemClicked: PropTypes.func,
      /* (multiSortedColumns) => {} */
      onSaveMultiSortColumns: PropTypes.func,
      /* () => {} */
      onCancelMultiSortColumns: PropTypes.func,
      /* () => {} */
      onClearMultiSortColumns: PropTypes.func,
      /* (index) => {} */
      onAddMultiSortColumn: PropTypes.func,
      /* (index) => {} */
      onRemoveMultiSortColumn: PropTypes.func,
      onTableErrorStateAction: PropTypes.func,

      /** call back function for when load more row is clicked  (rowId) => {} */
      onRowLoadMore: PropTypes.func,
    }).isRequired,
    /** callback for actions relevant for view management */
    onUserViewModified: PropTypes.func,
  }),
  /** what locale should we use to format table values if left empty no locale formatting happens */
  locale: PropTypes.string,
  i18n: I18NPropTypes,
  /** Specify the error message that need to be displayed by default.
   * Incase we use view.table.errorState property then the error state will be displayed instead of error message */
  error: PropTypes.string,

  testId: PropTypes.string,
};

export const defaultProps = (baseProps) => ({
  columnGroups: [],
  id: null,
  useZebraStyles: false,
  lightweight: undefined,
  title: null,
  tooltip: null,
  secondaryTitle: null,
  options: {
    hasAggregations: false,
    hasPagination: false,
    hasRowSelection: false,
    hasRowExpansion: false,
    hasRowActions: false,
    hasRowNesting: false,
    hasRowEdit: false,
    hasFilter: false,
    hasAdvancedFilter: false,
    hasOnlyPageData: false,
    hasFastSearch: true,
    hasSearch: false,
    hasColumnSelection: false,
    hasColumnSelectionConfig: false,
    hasResize: false,
    hasSingleRowEdit: false,
    hasUserViewManagement: false,
    preserveColumnWidths: true,
    useAutoTableLayoutForResize: false,
    shouldLazyRender: false,
    shouldExpandOnRowClick: false,
    wrapCellText: 'always',
    preserveCellWhiteSpace: false,
  },
  size: undefined,
  view: {
    aggregations: { columns: [] },
    pagination: {
      pageSize: 10,
      pageSizes: [10, 20, 30],
      page: 1,
      totalItems: baseProps.data && baseProps.data.length,
      maxPages: 100,
      isItemPerPageHidden: false,
      size: 'lg',
    },
    filters: [],
    advancedFilters: [],
    selectedAdvancedFilterIds: [],
    toolbar: {
      advancedFilterFlyoutOpen: false,
      batchActions: [],
      search: {},
    },
    table: {
      expandedIds: [],
      isSelectAllSelected: undefined,
      selectedIds: [],
      rowActions: [],
      sort: {},
      ordering: baseProps.columns && baseProps.columns.map((i) => ({ columnId: i.id })),
      loadingState: {
        rowCount: 5,
        columnCount: 5,
      },
      singleRowEditButtons: null,
      loadingMoreIds: [],
      showMultiSortModal: false,
      multiSortModal: undefined,
    },
  },
  actions: {
    pagination: {
      onChangePage: defaultFunction('actions.pagination.onChangePage'),
    },
    toolbar: {
      onToggleFilter: defaultFunction('actions.toolbar.onToggleFilter'),
      onShowRowEdit: defaultFunction('actions.toolbar.onShowRowEdit'),
      onToggleColumnSelection: defaultFunction('actions.toolbar.onToggleColumnSelection'),
      onApplyBatchAction: defaultFunction('actions.toolbar.onApplyBatchAction'),
      onCancelBatchAction: defaultFunction('actions.toolbar.onCancelBatchAction'),
      onApplyToolbarAction: defaultFunction('actions.toolbar.onApplyToolbarAction'),
      onRemoveAdvancedFilter: defaultFunction('actions.toolbar.onRemoveAdvancedFilter'),
      onCancelAdvancedFilter: defaultFunction('actions.toolbar.onCancelFilter'),
      onCreateAdvancedFilter: defaultFunction('actions.toolbar.onCreateAdvancedFilter'),
      onApplyAdvancedFilter: defaultFunction('actions.toolbar.onApplyAdvancedFilter'),
      onChangeAdvancedFilter: defaultFunction('actions.toolbar.onChangeAdvancedFilter'),
      onToggleAdvancedFilter: defaultFunction('actions.toolbar.onToggleAdvancedFilter'),
      onToggleAggregations: defaultFunction('actions.toolbar.onToggleAggregations'),
    },
    table: {
      onChangeSort: defaultFunction('actions.table.onChangeSort'),
      onRowExpanded: defaultFunction('actions.table.onRowExpanded'),
      onRowClicked: defaultFunction('actions.table.onRowClicked'),
      onApplyRowAction: defaultFunction('actions.table.onApplyRowAction'),
      onEmptyStateAction: null,
      onErrorStateAction: null,
      onChangeOrdering: defaultFunction('actions.table.onChangeOrdering'),
      onColumnSelectionConfig: defaultFunction('actions.table.onColumnSelectionConfig'),
      onColumnResize: defaultFunction('actions.table.onColumnResize'),
      onOverflowItemClicked: defaultFunction('actions.table.onOverflowItemClicked'),
      onSaveMultiSortColumns: defaultFunction('actions.table.onSaveMultiSortColumns'),
      onCancelMultiSortColumns: defaultFunction('actions.table.onCancelMultiSortColumns'),
      onAddMultiSortColumn: defaultFunction('actions.table.onAddMultiSortColumn'),
      onRemoveMultiSortColumn: defaultFunction('actions.table.onRemoveMultiSortColumn'),
    },
    onUserViewModified: null,
  },
  locale: null,
  i18n: {
    /** pagination */
    pageBackwardAria: 'Previous page',
    pageForwardAria: 'Next page',
    pageNumberAria: 'Page Number',
    itemsPerPage: 'Items per page:',
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
    itemsSelected: (selectedCount) => `${selectedCount} items selected`,
    itemSelected: (selectedCount) => `${selectedCount} item selected`,
    rowCountInHeader: (totalRowCount) => `Results: ${totalRowCount}`,
    toggleAggregations: 'Toggle aggregations',
    toolbarLabelAria: undefined,
    /** empty state */
    emptyMessage: 'There is no data',
    emptyMessageBody: '',
    emptyMessageWithFilters: 'No results match the current filters',
    emptyMessageWithFiltersBody: 'Try another search or use column filter criteria',
    emptyButtonLabel: 'Create some data',
    downloadIconDescription: 'Download table content',
    filterNone: 'Unsort rows by this header',
    filterAscending: 'Sort rows by this header in ascending order',
    filterDescending: 'Sort rows by this header in descending order',
    multiSortModalTitle: 'Select columns to sort',
    multiSortModalPrimaryLabel: 'Sort',
    multiSortModalSecondaryLabel: 'Cancel',
    multiSortModalClearLabel: 'Clear sorting',
    multiSortSelectColumnLabel: 'Select a column',
    multiSortSelectColumnSortByTitle: 'Sort by',
    multiSortSelectColumnThenByTitle: 'Then by',
    multiSortDirectionLabel: 'Select a direction',
    multiSortDirectionTitle: 'Sort order',
    multiSortAddColumn: 'Add column',
    multiSortRemoveColumn: 'Remove column',
    multiSortAscending: 'Ascending',
    multiSortDescending: 'Descending',
    multiSortOverflowItem: 'Multi-sort',
    multiSortDragHandle: 'Drag handle',
    // table error state
    tableErrorStateTitle: 'Unable to load the page',
    buttonLabelOnTableError: 'Refresh the page',
    /* table load more */
    loadMoreText: 'Load more...',
    learnMoreText: 'Learn more',
    inProgressText: 'In progress',
    dismissText: 'Dismiss',
    actionFailedText: 'Action failed',
    toolbarTooltipLabel: 'Toolbar tooltip',
  },
  error: null,
  // TODO: set default in v3. Leaving null for backwards compat. to match 'id' which was
  // previously used as testId.
  testId: null,
});

const Table = (props) => {
  const {
    id,
    columns,
    columnGroups,
    data,
    expandedData,
    locale,
    view,
    actions: { onUserViewModified },
    actions,
    options,
    lightweight,
    className,
    style,
    i18n,
    // Table Toolbar props
    secondaryTitle,
    tooltip,
    error,
    testId,
    size,
    ...others
  } = merge({}, defaultProps(props), props);

  // There is no way to access the current search value in the Table
  // so we need to track that for the save view functionality.
  const searchValue = useRef(view?.toolbar?.search?.defaultValue);

  const initialRendering = useRef(true);

  // The save/load view functionality needs access to the latest view configuration
  // and also needs to know when the configuration has changed for the StatefulTable.
  // This effect satisfies both those needs.
  useDeepCompareEffect(() => {
    if (options.hasUserViewManagement && onUserViewModified) {
      if (!initialRendering.current) {
        onUserViewModified({
          view,
          columns,
          state: {
            currentSearchValue: searchValue.current === undefined ? '' : searchValue.current,
          },
        });
      } else {
        initialRendering.current = false;
      }
    }
  }, [
    // Props of type React.Element or React.Node must not be included in
    // useDeepCompareEffect dependency arrays, their object signature is
    // massive and will throw out of memory errors if compared.
    // https://github.com/kentcdodds/use-deep-compare-effect/issues/7
    // https://twitter.com/dan_abramov/status/1104415855612432384
    view.pagination,
    view.filters,
    view.toolbar.activeBar,
    // Remove the icon as it's a React.Element which can not be compared
    view.toolbar.batchActions.map((action) => {
      const { icon, ...nonElements } = action;
      return nonElements;
    }),
    view.toolbar.initialDefaultSearch,
    view.toolbar.search,
    view.toolbar.isDisabled,
    view.table.isSelectAllSelected,
    view.table.isSelectAllIndeterminate,
    view.table.selectedIds,
    view.table.loadingMoreIds,
    view.table.sort,
    view.table.ordering,
    // Remove the error as it's a React.Element/Node which can not be compared
    view.table.rowActions.map((action) => {
      const { error: errorElement, ...nonElements } = action;
      return nonElements;
    }),
    view.table.expandedIds,
    view.table.loadingState,
    view.table.filteredData,
    columns,
    searchValue?.current,
  ]);

  const { maxPages, ...paginationProps } = view.pagination;
  const langDir = useLangDirection();
  const hasMultiSelect = options.hasRowSelection === 'multi';

  const [tableId] = useState(() => uniqueId('table-'));
  const [, forceUpdateCellTextWidth] = useState(0);

  const cellTextOverflow = useMemo(() => {
    const fixedTableLayout = !options?.useAutoTableLayoutForResize;
    const hasInitalColumnWidths = columns.some((col) => col.hasOwnProperty('width'));
    const hasCalculatedColumnWidths = options.hasResize && fixedTableLayout;
    const dynamicCellWidths = !hasInitalColumnWidths && !hasCalculatedColumnWidths;

    switch (options?.wrapCellText) {
      case 'alwaysTruncate':
        return CELL_TEXT_OVERFLOW.TRUNCATE;
      case 'never':
        return dynamicCellWidths ? CELL_TEXT_OVERFLOW.GROW : CELL_TEXT_OVERFLOW.TRUNCATE;
      case 'auto':
        return dynamicCellWidths ? CELL_TEXT_OVERFLOW.WRAP : CELL_TEXT_OVERFLOW.TRUNCATE;
      case 'always':
      default:
        return CELL_TEXT_OVERFLOW.WRAP;
    }
  }, [options, columns]);

  const handleClearFilters = () => {
    if (actions.toolbar && actions.toolbar.onClearAllFilters) {
      actions.toolbar.onClearAllFilters();
    }
    if (actions.toolbar && actions.toolbar.onApplySearch) {
      actions.toolbar.onApplySearch('');
    }
  };

  const handleOnColumnResize = (resizedCols) => {
    if (actions.table && actions.table.onColumnResize) {
      actions.table.onColumnResize(resizedCols);
    }
    forceUpdateCellTextWidth((n) => !n);
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
    (c) =>
      !(
        view.table.ordering.find((o) => o.columnId === c.id) || {
          isHidden: false,
        }
      ).isHidden
  );

  const aggregationsProp = view.aggregations;
  const getColumnNumbers = (tableData, columnId) =>
    tableData.map((row) => row.values[columnId]).filter((value) => Number.isFinite(value));

  const aggregationsAreHidden =
    aggregationsProp?.isHidden !== undefined ? aggregationsProp.isHidden : false;

  const aggregations = useMemo(() => {
    return options.hasAggregations && aggregationsProp.columns
      ? {
          label: aggregationsProp.label,
          columns: aggregationsProp.columns.map((col) => {
            let aggregatedValue;
            const isFunction = typeof col.value === 'function';
            const calculateValue = isFunction || col.value === undefined;

            if (calculateValue) {
              const numbers = getColumnNumbers(data, col.id);
              aggregatedValue = isFunction
                ? col.value(numbers)
                : numbers.reduce((total, num) => total + num, 0);
            }
            return calculateValue ? { ...col, value: aggregatedValue.toString() } : col;
          }),
          isHidden: aggregationsAreHidden,
        }
      : undefined;
  }, [
    options.hasAggregations,
    aggregationsProp.columns,
    aggregationsProp.label,
    aggregationsAreHidden,
    data,
  ]);

  const showExpanderColumn = useShowExpanderColumn({
    hasResize: options.hasResize,
    useAutoTableLayoutForResize: options.useAutoTableLayoutForResize,
    ordering: view.table.ordering,
    columns,
  });

  const totalColumns =
    visibleColumns.length +
    (hasMultiSelect ? 1 : 0) +
    (options.hasRowExpansion ? 1 : 0) +
    (options.hasRowActions ? 1 : 0) +
    (showExpanderColumn ? 1 : 0);

  const isFiltered =
    view.filters.length > 0 ||
    view.selectedAdvancedFilterIds.length ||
    (view?.toolbar?.search?.value ?? '') !== '' ||
    (view?.toolbar?.search?.defaultValue ?? '') !== '';

  const rowEditMode = view.toolbar.activeBar === 'rowEdit';
  const singleRowEditMode = !!view.table.rowActions.find((action) => action.isEditMode);

  const allRowsAreSelected = view.table.selectedIds.length === visibleData.length;
  const someRowsAreSelected = view.table.selectedIds.length > 0 && !allRowsAreSelected;

  const noSelectAllProp = view.table.isSelectAllSelected === undefined;
  const isSelectAllSelected = noSelectAllProp ? allRowsAreSelected : view.table.isSelectAllSelected;

  const noIndeterminateProp = view.table.isSelectAllIndeterminate === undefined;
  const isSelectAllIndeterminate =
    noIndeterminateProp && noSelectAllProp
      ? someRowsAreSelected
      : view.table.isSelectAllIndeterminate;

  const minHeaderSizeIsLarge = visibleColumns.some((col) => col.isSortable);

  if (__DEV__ && columnGroups.length && options.hasColumnSelection) {
    warning(
      false,
      'Column grouping (columnGroups) cannot be combined with the option hasColumnSelection:true'
    );
  }

  const multiSortColumns = useMemo(() => {
    const arrayifiedSort = Array.isArray(view.table.sort)
      ? view.table.sort
      : view.table.sort !== undefined
      ? [view.table.sort]
      : [];

    if (view.table.multiSortModal?.anticipatedColumn) {
      return [...arrayifiedSort, view.table.multiSortModal.anticipatedColumn];
    }

    return arrayifiedSort;
  }, [view.table.multiSortModal, view.table.sort]);

  return (
    <TableContainer
      style={style}
      data-testid={`${id || testId}-table-container`}
      className={classnames(className, `${iotPrefix}--table-container`)}
    >
      {
        /* If there is no items being rendered in the toolbar, don't render the toolbar */
        options.hasAggregations ||
        options.hasFilter ||
        options.hasAdvancedFilter ||
        options.hasSearch ||
        (hasMultiSelect && view.table.selectedIds.length > 0) ||
        options.hasRowCountInHeader ||
        options.hasColumnSelection ||
        options.hasRowEdit ||
        actions.toolbar.onDownloadCSV ||
        secondaryTitle ||
        view.toolbar.customToolbarContent ||
        tooltip ? (
          <TableToolbar
            tableId={id || tableId}
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
              toggleAggregations: i18n.toggleAggregations,
              toolbarLabelAria: i18n.toolbarLabelAria,
              toolbarTooltipLabel: i18n.toolbarTooltipLabel,
            }}
            actions={{
              ...pick(
                actions.toolbar,
                'onCancelBatchAction',
                'onApplyBatchAction',
                'onClearAllFilters',
                'onToggleColumnSelection',
                'onToggleFilter',
                'onShowRowEdit',
                'onDownloadCSV',
                'onApplyFilter',
                'onApplyAdvancedFilter',
                'onCancelAdvancedFilter',
                'onCreateAdvancedFilter',
                'onChangeAdvancedFilter',
                'onRemoveAdvancedFilter',
                'onToggleAdvancedFilter',
                'onApplyToolbarAction'
              ),
              onToggleAggregations: actions.toolbar.onToggleAggregations,
              onApplySearch: (value) => {
                searchValue.current = value;
                if (actions.toolbar?.onApplySearch) {
                  actions.toolbar.onApplySearch(value);
                }
              },
            }}
            options={{
              ...pick(
                options,
                'hasAggregations',
                'hasColumnSelection',
                'hasFastSearch',
                'hasSearch',
                'hasRowSelection',
                'hasRowCountInHeader',
                'hasRowEdit',
                'hasUserViewManagement'
              ),
              hasFilter: Boolean(options?.hasFilter),
              hasAdvancedFilter: Boolean(options?.hasAdvancedFilter),
            }}
            tableState={{
              totalSelected: view.table.selectedIds.length,
              totalFilters:
                (view.filters ? view.filters.length : 0) +
                (view.selectedAdvancedFilterIds.length ? view.selectedAdvancedFilterIds.length : 0),
              totalItemsCount: view.pagination.totalItems,
              isDisabled: singleRowEditMode || view.toolbar.isDisabled,
              ordering: view.table.ordering,
              columns,
              ...pick(view, 'filters', 'advancedFilters', 'selectedAdvancedFilterIds'),
              ...pick(
                view.toolbar,
                'batchActions',
                'search',
                'activeBar',
                'customToolbarContent',
                'rowEditBarButtons',
                'advancedFilterFlyoutOpen',
                'toolbarActions'
              ),
            }}
            data={data}
            // TODO: remove id in V3.
            testId={`${id || testId}-table-toolbar`}
          />
        ) : null
      }
      {view.selectedAdvancedFilterIds.length ? (
        <section className={`${iotPrefix}--table__advanced-filters-container`}>
          <FilterTags
            // TODO: remove id in V3.
            testId={`${id || testId}-filter-tags`}
          >
            {view.advancedFilters
              .filter((advFilter) => view.selectedAdvancedFilterIds.includes(advFilter.filterId))
              .map((advancedFilter) => {
                return (
                  <Tag
                    key={advancedFilter.filterId}
                    filter
                    title={advancedFilter.filterTitleText}
                    onClose={(e) => {
                      if (typeof actions?.toolbar?.onRemoveAdvancedFilter === 'function') {
                        actions.toolbar.onRemoveAdvancedFilter(e, advancedFilter.filterId);
                      }
                    }}
                    // TODO: remove id in V3.
                    data-testid={`${id || testId}-filter-tag-${advancedFilter.filterId}`}
                  >
                    {advancedFilter.filterTitleText}
                  </Tag>
                );
              })}
          </FilterTags>
        </section>
      ) : null}
      <div
        className={classnames('addons-iot-table-container', {
          // workaround hack to prevent double scrolling of the table and a filter dropdown
          // because the Dropdown and Multiselect components don't support opening the menu
          // items outside of the parent. This sets a minimum height for the table and applies
          // a max-height to the dropdown list container based on that minimum height to prevent
          // this issue.
          [`${iotPrefix}-table-container--dropdown-height-fix`]: options.hasFilter,
        })}
      >
        <CarbonTable
          id={id}
          // TODO: remove id in v3
          data-testid={id || testId}
          className={classnames({
            [`${iotPrefix}--data-table--column-groups`]: columnGroups.length,
            [`${iotPrefix}--data-table--column-groups--min-size-large`]:
              columnGroups.length && minHeaderSizeIsLarge,
            [`${iotPrefix}--data-table--resize`]: options.hasResize,
            [`${iotPrefix}--data-table--fixed`]:
              options.hasResize && !options.useAutoTableLayoutForResize,
            [`${iotPrefix}--data-table--row-actions`]: options.hasRowActions,
          })}
          size={size}
          {...others}
        >
          {columns.length ? (
            <TableHead
              size={size}
              {...others}
              i18n={i18n}
              lightweight={lightweight}
              options={{
                ...pick(
                  options,
                  'hasAggregations',
                  'hasColumnSelectionConfig',
                  'hasResize',
                  'hasRowActions',
                  'hasRowNesting',
                  'hasSingleRowEdit',
                  'hasRowSelection',
                  'useAutoTableLayoutForResize',
                  'hasMultiSort',
                  'preserveColumnWidths'
                ),
                cellTextOverflow,
                hasRowExpansion: !!options.hasRowExpansion,
              }}
              columns={columns}
              columnGroups={columnGroups}
              filters={view.filters}
              actions={{
                ...pick(actions.toolbar, 'onApplyFilter'),
                ...pick(
                  actions.table,
                  'onSelectAll',
                  'onChangeSort',
                  'onChangeOrdering',
                  'onColumnSelectionConfig',
                  'onOverflowItemClicked'
                ),
                onColumnResize: handleOnColumnResize,
              }}
              selectAllText={i18n.selectAllAria}
              clearFilterText={i18n.clearFilterAria}
              filterText={i18n.filterAria}
              clearSelectionText={i18n.clearSelectionAria}
              openMenuText={i18n.openMenuAria}
              closeMenuText={i18n.closeMenuAria}
              tableId={id || tableId}
              tableState={{
                isDisabled: rowEditMode || singleRowEditMode,
                activeBar: view.toolbar.activeBar,
                filters: view.filters,
                ...view.table,
                selection: { isSelectAllSelected, isSelectAllIndeterminate },
              }}
              hasFastFilter={options?.hasFilter === 'onKeyPress'}
              // TODO: remove id in v3
              testId={`${id || testId}-table-head`}
              showExpanderColumn={showExpanderColumn}
            />
          ) : null}

          {
            // Table contents
            view.table.loadingState.isLoading ? (
              <TableSkeletonWithHeaders
                columns={visibleColumns}
                {...pick(options, 'hasRowSelection', 'hasRowActions')}
                hasRowExpansion={!!options.hasRowExpansion}
                rowCount={view.table.loadingState.rowCount}
                columnCount={view.table.loadingState.columnCount}
                // TODO: remove 'id' in v3.
                testId={`${id || testId}-table-skeleton`}
                showExpanderColumn={showExpanderColumn}
              />
            ) : error ? (
              <ErrorTable
                id={id}
                testId={`${id || testId}-table-error-body`}
                i18n={i18n}
                totalColumns={totalColumns}
                error={error}
                errorState={view.table.errorState}
                onErrorStateAction={actions.table.onErrorStateAction}
              />
            ) : visibleData && visibleData.length ? (
              <TableBody
                langDir={langDir}
                tableId={id || tableId}
                rows={visibleData}
                locale={locale}
                rowActionsState={view.table.rowActions}
                singleRowEditButtons={view.table.singleRowEditButtons}
                expandedRows={expandedData}
                columns={visibleColumns}
                expandedIds={view.table.expandedIds}
                selectedIds={view.table.selectedIds}
                loadingMoreIds={view.table.loadingMoreIds}
                {...pick(
                  i18n,
                  'overflowMenuAria',
                  'clickToExpandAria',
                  'clickToCollapseAria',
                  'inProgressText',
                  'actionFailedText',
                  'learnMoreText',
                  'dismissText',
                  'selectRowAria',
                  'loadMoreText'
                )}
                totalColumns={totalColumns}
                {...pick(
                  options,
                  'hasRowSelection',
                  'hasRowActions',
                  'hasRowNesting',
                  'shouldExpandOnRowClick',
                  'shouldLazyRender',
                  'preserveCellWhiteSpace'
                )}
                cellTextOverflow={cellTextOverflow}
                hasRowExpansion={!!options.hasRowExpansion}
                ordering={view.table.ordering}
                rowEditMode={rowEditMode}
                actions={pick(
                  actions.table,
                  'onRowSelected',
                  'onApplyRowAction',
                  'onClearRowError',
                  'onRowExpanded',
                  'onRowClicked',
                  'onRowLoadMore'
                )}
                // TODO: remove 'id' in v3.
                testId={`${id || testId}-table-body`}
                showExpanderColumn={showExpanderColumn}
                size={size}
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
                        messageBody: i18n.emptyMessageBody,
                        messageWithFilters: i18n.emptyMessageWithFilters,
                        messageWithFiltersBody: i18n.emptyMessageWithFiltersBody,
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
                // TODO: remove 'id' in v3.
                testId={`${id || testId}-table-empty`}
              />
            )
          }

          {options.hasAggregations && !aggregationsAreHidden ? (
            <TableFoot
              options={{
                ...pick(options, 'hasRowSelection', 'hasRowActions', 'hasRowNesting'),
                hasRowExpansion: !!options.hasRowExpansion,
              }}
              tableState={{
                aggregations,
                ordering: view.table.ordering,
              }}
              testId={`${id || testId}-table-foot`}
              showExpanderColumn={showExpanderColumn}
            />
          ) : null}
        </CarbonTable>
      </div>
      {options.hasPagination && !view.table.loadingState.isLoading && visibleData?.length ? ( // don't show pagination row while loading
        <Pagination
          pageSize={paginationProps.pageSize}
          pageSizes={paginationProps.pageSizes}
          page={paginationProps.page}
          isItemPerPageHidden={paginationProps.isItemPerPageHidden}
          totalItems={
            paginationProps.totalItems < Math.ceil(maxPages * paginationProps.pageSize)
              ? paginationProps.totalItems
              : Math.ceil(maxPages * paginationProps.pageSize)
          }
          onChange={actions.pagination.onChangePage}
          backwardText={i18n.pageBackwardAria}
          forwardText={i18n.pageForwardAria}
          pageNumberText={i18n.pageNumberAria}
          itemsPerPageText={i18n.itemsPerPage}
          itemRangeText={i18n.itemsRangeWithTotal}
          pageRangeText={i18n.pageRange}
          preventInteraction={rowEditMode || singleRowEditMode}
          testId={`${id || testId}-table-pagination`}
          carbonSize={paginationProps.size}
        />
      ) : null}
      {options.hasMultiSort && (
        <TableMultiSortModal
          testId={`${id}-multi-sort-modal`}
          columns={columns}
          ordering={view.table.ordering}
          sort={multiSortColumns}
          actions={{
            ...pick(
              actions.table,
              'onSaveMultiSortColumns',
              'onCancelMultiSortColumns',
              'onAddMultiSortColumn',
              'onRemoveMultiSortColumn',
              'onClearMultiSortColumns'
            ),
          }}
          showMultiSortModal={view.table.showMultiSortModal}
          i18n={i18n}
        />
      )}
    </TableContainer>
  );
};

Table.propTypes = propTypes;
Table.defaultProps = defaultProps({});

export default Table;
