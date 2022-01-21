import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import { boolean, text, number, select, object } from '@storybook/addon-knobs';
import { Add20, TrashCan16 } from '@carbon/icons-react';
import Arrow from '@carbon/icons-react/es/arrow--right/16';
import Add from '@carbon/icons-react/es/add/16';
import Edit from '@carbon/icons-react/es/edit/16';

import { Checkbox } from '../Checkbox';
import { TextInput } from '../TextInput';

const STATUS = {
  RUNNING: 'RUNNING',
  NOT_RUNNING: 'NOT_RUNNING',
  BROKEN: 'BROKEN',
};

const words = [
  'toyota',
  'helping',
  'whiteboard',
  'as',
  'can',
  'bottle',
  'eat',
  'chocolate',
  'pinocchio',
  'scott',
];
const getLetter = (index) =>
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(index % 62);
const getWord = (index, step = 1) => words[(step * index) % words.length];
const getSentence = (index) =>
  `${getWord(index, 1)} ${getWord(index, 2)} ${getWord(index, 3)} ${index}`;
const getString = (index, length) =>
  Array(length)
    .fill(0)
    .map((i, idx) => getLetter(index * (idx + 14) * (idx + 1)))
    .join('');

const getStatus = (idx) => {
  const modStatus = idx % 3;
  switch (modStatus) {
    case 1:
      return STATUS.NOT_RUNNING;
    case 2:
      return STATUS.BROKEN;
    case 0:
    default:
      return STATUS.RUNNING;
  }
};

const getBoolean = (index) => {
  return index % 2 === 0;
};

export const getSelectTextWrappingOptions = () => ['always', 'never', 'auto', 'alwaysTruncate'];

export const getSelectDataOptions = () => [
  {
    id: 'option-A',
    text: 'option-A',
  },
  {
    id: 'option-B',
    text: 'option-B',
  },
  {
    id: 'option-C',
    text: 'option-C',
  },
  {
    id: 'option-D',
    text: 'option-D',
  },
  {
    id: 'option-E',
    text: 'option-E',
  },
  {
    id: 'option-F',
    text: 'option-F',
  },
];

export const getTableActions = () => ({
  pagination: {
    /** Specify a callback for when the current page or page size is changed. This callback is passed an object parameter containing the current page and the current page size */
    onChangePage: action('onChangePage'),
  },
  toolbar: {
    onApplyFilter: action('onApplyFilter'),
    onToggleFilter: action('onToggleFilter'),
    onShowRowEdit: action('onShowRowEdit'),
    onToggleColumnSelection: action('onToggleColumnSelection'),
    /** Specify a callback for when the user clicks toolbar button to clear all filters. Recieves a parameter of the current filter values for each column */
    onClearAllFilters: action('onClearAllFilters'),
    onCancelBatchAction: action('onCancelBatchAction'),
    onApplyBatchAction: action('onApplyBatchAction'),
    onApplySearch: action('onApplySearch'),
    /** advanced filter actions */
    onCancelAdvancedFilter: action('onCancelAdvancedFilter'),
    onRemoveAdvancedFilter: action('onRemoveAdvancedFilter'),
    onCreateAdvancedFilter: action('onCreateAdvancedFilter'),
    onChangeAdvancedFilter: action('onChangeAdvancedFilter'),
    onApplyAdvancedFilter: action('onApplyAdvancedFilter'),
    onToggleAdvancedFilter: action('onToggleAdvancedFilter'),
    // TODO: removed to mimic the current state of consumers in the wild
    // since they won't be adding this prop to any of their components
    // can be readded in V3.
    // onToggleAggregations: action('onToggleAggregations'),
    onApplyToolbarAction: action('onApplyToolbarAction'),
  },
  table: {
    onRowClicked: action('onRowClicked'),
    onRowSelected: action('onRowSelected'),
    onSelectAll: action('onSelectAll'),
    onEmptyStateAction: action('onEmptyStateAction'),
    onErrorStateAction: action('onErrorStateAction'),
    onApplyRowAction: action('onApplyRowAction'),
    onRowExpanded: action('onRowExpanded'),
    onChangeOrdering: action('onChangeOrdering'),
    onColumnSelectionConfig: action('onColumnSelectionConfig'),
    onChangeSort: action('onChangeSort'),
    onColumnResize: action('onColumnResize'),
    onOverflowItemClicked: action('onOverflowItemClicked'),
    onSaveMultiSortColumns: action('onSaveMultiSortColumns'),
    onCancelMultiSortColumns: action('onCancelMultiSortColumns'),
    onAddMultiSortColumn: action('onAddMultiSortColumn'),
    onRemoveMultiSortColumn: action('onRemoveMultiSortColumn'),
  },
});

export const renderStatusIcon = ({ value: status }) => {
  switch (status) {
    case STATUS.NOT_RUNNING:
      return (
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="3" stroke="none" strokeWidth="1" fill="gray" />
        </svg>
      );
    case STATUS.BROKEN:
      return (
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="3" stroke="none" strokeWidth="1" fill="red" />
        </svg>
      );

    case STATUS.RUNNING:
    default:
      return (
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="3" stroke="none" strokeWidth="1" fill="green" />
        </svg>
      );
  }
};

// Example custom sort method for the status field.  Will sort the broken to the top, then the running, then the not_running
export const customColumnSort = ({ data, columnId, direction }) => {
  // clone inputData because sort mutates the array
  const sortedData = data.map((i) => i);
  sortedData.sort((a, b) => {
    let compare = -1;
    // same status
    if (a.values[columnId] === b.values[columnId]) {
      compare = 0;
    } else if (a.values[columnId] === STATUS.RUNNING && b.values[columnId] === STATUS.NOT_RUNNING) {
      compare = -1;
    } else if (a.values[columnId] === STATUS.NOT_RUNNING && b.values[columnId] === STATUS.RUNNING) {
      compare = 1;
    } else if (b.values[columnId] === STATUS.BROKEN) {
      compare = 1;
    } else if (a.values[columnId] === STATUS.BROKEN) {
      compare = -1;
    }

    return direction === 'ASC' ? compare : -compare;
  });
  return sortedData;
};

export const getTableColumns = () => [
  {
    id: 'string',
    name: 'String',
    filter: { placeholderText: 'enter a string' },
  },

  {
    id: 'date',
    name: 'Date',
    filter: { placeholderText: 'enter a date' },
  },
  {
    id: 'select',
    name: 'Select',
    filter: { placeholderText: 'pick an option', options: getSelectDataOptions() },
  },
  {
    id: 'secretField',
    name: 'Secret Information',
  },
  {
    id: 'status',
    name: 'Status',
    renderDataFunction: renderStatusIcon,
    sortFunction: customColumnSort,
  },
  {
    id: 'number',
    name: 'Number',
    filter: { placeholderText: 'enter a number' },
  },
  {
    id: 'boolean',
    name: 'Boolean',
    filter: { placeholderText: 'true or false' },
  },
  {
    id: 'node',
    name: 'React Node',
  },
  {
    id: 'object',
    name: 'Object Id',
    renderDataFunction: ({ value }) => {
      return value?.id;
    },
    sortFunction: ({ data, columnId, direction }) => {
      // clone inputData because sort mutates the array
      const sortedData = data.map((i) => i);
      sortedData.sort((a, b) => {
        const aId = a.values[columnId].id;
        const bId = b.values[columnId].id;
        const compare = aId.localeCompare(bId);

        return direction === 'ASC' ? compare : -compare;
      });

      return sortedData;
    },
    filter: {
      placeholderText: 'Filter object values...',
      filterFunction: (columnValue, filterValue) => {
        return columnValue.id.includes(filterValue);
      },
    },
  },
];

export const getTableToolbarActions = () => [
  {
    id: 'edit',
    labelText: 'Edit',
    renderIcon: 'edit',
    disabled: true,
    isOverflow: true,
  },
  {
    id: 'delete',
    labelText: 'Delete',
    isDelete: true,
    hasDivider: true,
    isOverflow: true,
    renderIcon: () => <TrashCan16 />,
  },
  {
    id: 'hidden',
    labelText: 'Hidden',
    hidden: true,
    isOverflow: true,
  },
];

export const getNewRow = (idx, suffix = '', withActions = false) => ({
  id: `row-${idx}${suffix ? `_${suffix}` : ''}`,
  values: {
    string: getSentence(idx) + suffix,
    date: new Date(100000000000 + 1000000000 * idx * idx).toISOString(),
    select: getSelectDataOptions()[idx % 3].id,
    secretField: getString(idx, 10) + suffix,
    number: idx % 3 === 0 ? null : idx * idx,
    status: getStatus(idx),
    boolean: getBoolean(idx),
    node: <Add20 />,
    object: { id: getString(idx, 5) },
  },
  rowActions: withActions
    ? [
        {
          id: 'drilldown',
          renderIcon: Arrow,
          iconDescription: 'Drill in',
          labelText: 'Drill in',
        },
        {
          id: 'Add',
          renderIcon: Add,
          iconDescription: 'Add',
          labelText: 'Add',
          isOverflow: true,
        },
      ]
    : undefined,
});

export const getTableData = () =>
  Array(100)
    .fill(0)
    .map((i, idx) => getNewRow(idx));

export const getRowActions = (index) =>
  [
    index % 4 !== 0
      ? {
          id: 'drilldown',
          renderIcon: Arrow,
          iconDescription: 'Drill in',
          labelText: 'Drill in to find out more after observing',
        }
      : null,
    {
      id: 'edit',
      renderIcon: Edit,
      labelText: 'Edit',
      isOverflow: true,
      iconDescription: 'Edit',
      isDelete: false,
      isEdit: true,
      disabled: true,
    },
    {
      id: 'Add',
      renderIcon: Add,
      iconDescription: 'Add',
      labelText: 'Add',
      isOverflow: true,
      hasDivider: true,
    },
    {
      id: 'delete',
      renderIcon: TrashCan16,
      labelText: 'Delete',
      isOverflow: true,
      iconDescription: 'Delete',
      isDelete: true,
    },
    {
      id: 'textOnly',
      labelText: 'Text only sample action',
      isOverflow: true,
    },
  ].filter((i) => i);

export const addRowAction = (row, hasSingleRowEdit, index) => ({
  ...row,
  rowActions: getRowActions(index).map((rowAction) =>
    rowAction.id === 'edit' && hasSingleRowEdit
      ? {
          ...rowAction,
          disabled: false,
        }
      : rowAction
  ),
});

export const addChildRows = (row, idx) => ({
  ...row,
  children:
    idx % 4 !== 0
      ? [getNewRow(idx, 'A', true), getNewRow(idx, 'B', true)]
      : idx === 4
      ? [
          getNewRow(idx, 'A', true),
          {
            ...getNewRow(idx, 'B'),
            children: [
              getNewRow(idx, 'B-1', true),
              {
                ...getNewRow(idx, 'B-2'),
                children: [getNewRow(idx, 'B-2-A', true), getNewRow(idx, 'B-2-B', true)],
              },
              getNewRow(idx, 'B-3', true),
            ],
          },
          getNewRow(idx, 'C', true),
          {
            ...getNewRow(idx, 'D', true),
            children: [
              getNewRow(idx, 'D-1', true),
              getNewRow(idx, 'D-2', true),
              getNewRow(idx, 'D-3', true),
            ],
          },
        ]
      : undefined,
});

export const getExpandedData = (data) =>
  data.map((row) => ({
    rowId: row.id,
    content: <div style={{ marginLeft: '64px' }}>Expanded demo content {row.id}</div>,
  }));

export const getDefaultOrdering = (tableColumns) =>
  tableColumns.map(({ id }) => ({
    columnId: id,
    isHidden: id === 'secretField',
  }));

export const getRowActionStates = () => [
  {
    rowId: 'row-1',
    isRunning: true,
  },
  {
    rowId: 'row-3',
    error: {
      title: 'Import failed',
      message: 'Contact your administrator',
    },
  },
];

// eslint-disable-next-line react/prop-types
export const getEditDataFunction = (onDataChange) => ({ value, columnId, rowId }) => {
  const id = `${columnId}-${rowId}`;
  return React.isValidElement(value) ? (
    value
  ) : typeof value === 'boolean' ? (
    <Checkbox
      defaultChecked={value}
      id={id}
      labelText=""
      hideLabel
      onChange={(e) => onDataChange(e, columnId, rowId)}
    />
  ) : (
    <TextInput
      id={id}
      onChange={(e) => onDataChange(e, columnId, rowId)}
      type="text"
      light
      defaultValue={value}
      labelText=""
      hideLabel
    />
  );
};

export const addColumnGroupIds = (col, index) => {
  return index === 1 || index === 2
    ? { ...col, columnGroupId: 'groupA' }
    : index === 5 || index === 6 || index === 7
    ? { ...col, columnGroupId: 'groupB' }
    : col;
};

export const getAdvancedFilters = () => [
  {
    filterId: 'story-filter',
    /** Text for main tilte of page */
    filterTitleText: 'date CONTAINS 19, boolean=true',
    /** Text for metadata for the filter */
    filterMetaText: `last updated: 2021-03-11 15:34:01`,
    /** tags associated with particular filter */
    filterTags: ['fav', 'other-tag'],
    /** users that have access to particular filter */
    filterAccess: [
      {
        username: 'Example-User',
        email: 'example@pal.com',
        name: 'Example User',
        access: 'edit',
      },
      {
        username: 'Other-User',
        email: 'other@pal.com',
        name: 'Other User',
        access: 'read',
      },
    ],
    /** All possible users that can be granted access */
    filterUsers: [
      {
        id: 'teams',
        name: 'Teams',
        groups: [
          {
            id: 'team-a',
            name: 'Team A',
            users: [
              {
                username: '@tpeck',
                email: 'tpeck@pal.com',
                name: 'Templeton Peck',
              },
              {
                username: '@jsmith',
                email: 'jsmith@pal.com',
                name: 'John Smith',
              },
            ],
          },
        ],
      },
      {
        username: 'Example-User',
        email: 'example@pal.com',
        name: 'Example User',
      },
      {
        username: 'Test-User',
        email: 'test@pal.com',
        name: 'Test User',
      },
      {
        username: 'Other-User',
        email: 'other@pal.com',
        name: 'Other User',
      },
    ],
    /**
     * the rules passed into the component. The RuleBuilder is a controlled component, so
     * this works the same as passing defaultValue to a controlled input component.
     */
    filterRules: {
      id: '14p5ho3pcu',
      groupLogic: 'ALL',
      rules: [
        {
          id: 'rsiru4rjba',
          columnId: 'date',
          operand: 'CONTAINS',
          value: '19',
        },
        {
          id: '34bvyub9jq',
          columnId: 'boolean',
          operand: 'EQ',
          value: 'true',
        },
      ],
    },
    filterColumns: getTableColumns(),
  },
  {
    filterId: 'next-filter',
    /** Text for main tilte of page */
    filterTitleText: 'select=Option c, boolean=false',
    /** Text for metadata for the filter */
    filterMetaText: `last updated: 2021-03-11 15:34:01`,
    /** tags associated with particular filter */
    filterTags: ['fav', 'other-tag'],
    /** users that have access to particular filter */
    filterAccess: [
      {
        username: 'Example-User',
        email: 'example@pal.com',
        name: 'Example User',
        access: 'edit',
      },
      {
        username: 'Other-User',
        email: 'other@pal.com',
        name: 'Other User',
        access: 'read',
      },
    ],
    /** All possible users that can be granted access */
    filterUsers: [
      {
        id: 'teams',
        name: 'Teams',
        groups: [
          {
            id: 'team-a',
            name: 'Team A',
            users: [
              {
                username: '@tpeck',
                email: 'tpeck@pal.com',
                name: 'Templeton Peck',
              },
              {
                username: '@jsmith',
                email: 'jsmith@pal.com',
                name: 'John Smith',
              },
            ],
          },
        ],
      },
      {
        username: 'Example-User',
        email: 'example@pal.com',
        name: 'Example User',
      },
      {
        username: 'Test-User',
        email: 'test@pal.com',
        name: 'Test User',
      },
      {
        username: 'Other-User',
        email: 'other@pal.com',
        name: 'Other User',
      },
    ],
    /**
     * the rules passed into the component. The RuleBuilder is a controlled component, so
     * this works the same as passing defaultValue to a controlled input component.
     */
    filterRules: {
      id: '14p5ho3pcu',
      groupLogic: 'ALL',
      rules: [
        {
          id: 'rsiru4rjba',
          columnId: 'select',
          operand: 'EQ',
          value: 'option-C',
        },
        {
          id: '34bvyub9jq',
          columnId: 'boolean',
          operand: 'EQ',
          value: 'false',
        },
      ],
    },
    filterColumns: getTableColumns(),
  },
];

export const getTableKnobs = (enableAllKnobs) => ({
  selectedTableType: select('Type of Table', ['Table', 'StatefulTable'], 'StatefulTable'),
  tableMaxWidth: select('Demo table max-width', ['300px', '600px', '900px', 'none'], 'none'),

  // Header
  secondaryTitle: text('Title shown in bar above header row (secondaryTitle)', 'Table playground'),
  tableTooltipText: text(
    'Table title toltip (tooltip)',
    enableAllKnobs ? 'I must be wrapped in a react node' : ''
  ),
  stickyHeader: boolean('Sticky header ☢️ (stickyHeader)', false),

  // Toolbar
  demoToolbarActions: boolean(
    'Demo toolbar actions on row selection (view.toolbar.toolbarActions)',
    enableAllKnobs
  ),
  demoCustomToolbarContent: boolean(
    'Demo custom toolbar content (view.toolbar.customToolbarContent) (',
    enableAllKnobs
  ),
  toolbarIsDisabled: boolean('Disable the table toolbar (view.toolbar.isDisabled)', false),

  // Row data rendering
  numerOfRows: select('Demo number of rows in data', [100, 50, 20, 5], 100),
  useZebraStyles: boolean('Alternate colors in table rows (useZebraStyles)', enableAllKnobs),
  size: select('Set row height (size)', ['xs', 'sm', 'md', 'lg', 'xl'], 'lg'),
  wrapCellText: select(
    'Cell text overflow strategy (options.wrapCellText)',
    getSelectTextWrappingOptions(),
    'always'
  ),
  cellTextAlignment: select(
    'Align cell text (columns[i].align)',
    ['start', 'center', 'end'],
    'start'
  ),
  locale: text('Locale used to format table values (locale)', ''),
  preserveCellWhiteSpace: boolean(
    'Keep extra whitespace within a table cell (options.preserveCellWhiteSpace)',
    false
  ),
  demoRenderDataFunction: boolean(
    'Demo custom data render function (columns[i].renderDataFunction)',
    true
  ),

  // Sorting
  demoSingleSort: boolean('Single dimension sorting (columns[i].isSortable)', enableAllKnobs),
  hasMultiSort: boolean('Enable multiple dimension sorting (options.hasMultiSort)', false),

  // Search
  hasSearch: boolean('Enable searching on the table values (options.hasSearch)', enableAllKnobs),
  hasFastSearch: boolean('Trigger search while typing (options.hasFastSearch)', enableAllKnobs),

  // Column resize
  demoInitialColumnSizes: boolean('Demo initial columns sizes', false),
  hasResize: boolean('Enable resizing of column widths (options.hasResize)', enableAllKnobs),
  preserveColumnWidths: boolean(
    'Preserve sibling widths on column resize/show/hide (options.preserveColumnWidths)',
    enableAllKnobs
  ),
  useAutoTableLayoutForResize: boolean(
    'Use CSS table-layout:auto (options.useAutoTableLayoutForResize)',
    false
  ),

  // Column configuration
  demoColumnTooltips: boolean('Demo column tooltips', enableAllKnobs),
  demoColumnGroupAssignments: boolean('Demo assigning columns to groups', enableAllKnobs),
  columnGroups: object('Column groups definition (columnGroups)', [
    {
      id: 'groupA',
      name: 'Group A that has a very long name that should be truncated',
    },
    { id: 'groupB', name: 'Group B' },
  ]),

  hasColumnSelection: boolean(
    'Enable legacy column management (options.hasColumnSelection)',
    false
  ),
  hasColumnSelectionConfig: boolean(
    'Show config button in legacy column management (options.hasColumnSelectionConfig)',
    false
  ),

  // Aggregation
  hasAggregations: boolean(
    'Aggregate column values in footer (options.hasAggregations)',
    enableAllKnobs
  ),
  aggregationLabel: text('Aggregation label (view.aggregations.label)', 'Total'),
  aggregationsColumns: object('Aggregations columns settings', [
    {
      id: 'number',
      align: 'start',
      isSortable: false,
    },
  ]),

  // Filtering
  hasFilter: select(
    'Enable filtering by column value (options.hasFilter)',
    ['onKeyPress', 'onEnterAndBlur', true, false],
    enableAllKnobs
  ),
  hasAdvancedFilter: boolean(
    'Enable advanced filters ☢️ (options.hasAdvancedFilter)',
    enableAllKnobs
  ),

  // Pagination
  hasPagination: boolean('Enable pagination (options.hasPagination)', enableAllKnobs),
  pageSizes: object('Selectable page sizes (view.pagination.pageSizes)', [10, 20, 30, 50]),
  maxPages: number('Upper limit for number of pages (view.pagination.maxPages)', 100),
  isItemPerPageHidden: boolean(
    'Hide items per page selection (options.pagination.isItemPerPageHidden)',
    false
  ),
  paginationSize: select(
    'Size of pagination buttons (options.pagination.size)',
    ['sm', 'md', 'lg'],
    'lg'
  ),
  hasOnlyPageData: boolean(
    'Data prop only represents the currently visible page (options.hasOnlyPageData)',
    enableAllKnobs
  ),

  // Nesting / Expansion
  hasRowExpansion: select(
    'Demo rows with additional expandable content (options.hasRowExpansion)',
    {
      true: true,
      false: false,
      '{ expandRowsExclusively: true }': { expandRowsExclusively: true },
    },
    false
  ),
  hasRowNesting: select(
    'Demo nested rows (options.hasRowNesting)',
    {
      true: true,
      false: false,
      '{ hasSingleNestedHierarchy: true }': { hasSingleNestedHierarchy: true },
    },
    enableAllKnobs
  ),
  shouldExpandOnRowClick: boolean(
    'Expand row on click (options.shouldExpandOnRowClick)',
    enableAllKnobs
  ),

  // Row selection
  hasRowSelection: select(
    'Enable row selection type (options.hasRowSelection)',
    ['multi', 'single', false],
    enableAllKnobs ? 'multi' : false
  ),
  selectionCheckboxEnabled: boolean('Row checkbox selectable (data[i].isSelectable)', true),

  // Row actions
  hasRowActions: boolean('Demo row actions (options.hasRowActions)', enableAllKnobs),

  // Data edit
  hasRowEdit: boolean(
    'Enables row editing for the entire table (options.hasRowEdit)',
    enableAllKnobs
  ),
  hasSingleRowEdit: boolean(
    'Enables row editing for a single row (options.hasSingleRowEdit)',
    enableAllKnobs
  ),

  // Loading and states
  shouldLazyRender: boolean(
    'Enable only loading table rows as they become visible (options.shouldLazyRender)',
    false
  ),
  tableIsLoading: boolean('Show table loading state (view.table.loadingState.isLoading)', false),
  demoEmptyColumns: boolean('Demo empty columns in loading state (columns)', false),
  loadingRowCount: number(
    'Number of additional rows in loading state (view.table.loadingState.rowCount)',
    7
  ),
  loadingColumnCount: number(
    'Number of columns in loading state (view.table.loadingState.columnCount)',
    6
  ),
  demoEmptyState: boolean('Demo empty state (view.table.emptyState)', false),
  demoCustomEmptyState: boolean('Demo custom empty state (view.table.emptyState)', false),
  demoCustomErrorState: boolean('Demo custom error state (view.table.errorState)', false),

  hasUserViewManagement: boolean(
    'Enables table to handle creating/saving/loading of user views (options.hasUserViewManagement)',
    false
  ),
});

export const getI18nKnobs = () => ({
  pageBackwardAria: text('i18n.pageBackwardAria', 'Previous page'),
  pageForwardAria: text('i18n.pageForwardAria', 'Next page'),
  pageNumberAria: text('i18n.pageNumberAria', 'Page Number'),
  itemsPerPage: text('i18n.itemsPerPage', 'Items per page:'),
  overflowMenuAria: text('i18n.overflowMenuAria', 'More actions'),
  clickToExpandAria: text('i18n.clickToExpandAria', 'Click to expand content'),
  clickToCollapseAria: text('i18n.clickToCollapseAria', 'Click to collapse content'),
  selectAllAria: text('i18n.selectAllAria', 'Select all items'),
  selectRowAria: text('i18n.selectRowAria', 'Select row'),
  /** toolbar */
  clearAllFilters: text('i18n.clearAllFilters', 'Clear all filters'),
  columnSelectionButtonAria: text('i18n.columnSelectionButtonAria', 'Column Selection'),
  columnSelectionConfig: text('i18n.columnSelectionConfig', 'Manage columns'),
  filterButtonAria: text('i18n.filterButtonAria', 'Filters'),
  editButtonAria: text('i18n.editButtonAria', 'Edit rows'),
  searchLabel: text('i18n.searchLabel', 'Search'),
  searchPlaceholder: text('i18n.searchPlaceholder', 'Search'),
  clearFilterAria: text('i18n.clearFilterAria', 'Clear filter'),
  filterAria: text('i18n.filterAria', 'Filter'),
  openMenuAria: text('i18n.openMenuAria', 'Open menu'),
  closeMenuAria: text('i18n.closeMenuAria', 'Close menu'),
  clearSelectionAria: text('i18n.clearSelectionAria', 'Clear selection'),
  batchCancel: text('i18n.batchCancel', 'Cancel'),
  applyButtonText: text('i18n.applyButtonText', 'Apply filters'),
  cancelButtonText: text('i18n.cancelButtonText', 'Cancel'),
  advancedFilterLabelText: text('i18n.advancedFilterLabelText', 'Select an existing filter or'),
  createNewAdvancedFilterText: text(
    'i18n.createNewAdvancedFilterText',
    'create a new advanced filter'
  ),
  advancedFilterPlaceholderText: text('i18n.advancedFilterPlaceholderText', 'Select a filter'),
  simpleFiltersTabLabel: text('i18n.simpleFiltersTabLabel', 'Simple filters'),
  advancedFiltersTabLabel: text('i18n.advancedFiltersTabLabel', 'Advanced filters'),
  emptyMessage: text('i18n.emptyMessage', 'There is no data'),
  emptyMessageWithFilters: text(
    'i18n.emptyMessageWithFilters',
    'No results match the current filters'
  ),
  emptyButtonLabel: text('i18n.emptyButtonLabel', 'Create some data'),
  emptyButtonLabelWithFilters: text('i18n.emptyButtonLabelWithFilters', 'Clear all filters'),
  filterNone: text('i18n.filterNone', 'Unsort rows by this header'),
  filterAscending: text('i18n.filterAscending', 'Sort rows by this header in ascending order'),
  filterDescending: text('i18n.filterDescending', 'Sort rows by this header in descending order'),
  toggleAggregations: text('i18n.toggleAggregations', 'Toggle aggregations'),
  multiSortModalTitle: text('i18n.multiSortModalTitle', 'Select columns to sort'),
  multiSortModalPrimaryLabel: text('i18n.multiSortModalPrimaryLabel', 'Sort'),
  multiSortModalSecondaryLabel: text('i18n.multiSortModalSecondaryLabel', 'Cancel'),
  multiSortSelectColumnLabel: text('i18n.multiSortSelectColumnLabel', 'Select a column'),
  multiSortSelectColumnSortByTitle: text('i18n.multiSortSelectColumnSortByTitle', 'Sort by'),
  multiSortSelectColumnThenByTitle: text('i18n.multiSortSelectColumnThenByTitle', 'Then by'),
  multiSortDirectionLabel: text('i18n.multiSortDirectionLabel', 'Select a direction'),
  multiSortDirectionTitle: text('i18n.multiSortDirectionTitle', 'Sort order'),
  multiSortAddColumn: text('i18n.multiSortAddColumn', 'Add column'),
  multiSortRemoveColumn: text('i18n.multiSortRemoveColumn', 'Remove column'),
  multiSortAscending: text('i18n.multiSortAscending', 'Ascending'),
  multiSortDescending: text('i18n.multiSortDescending', 'Descending'),
  multiSortCloseModal: text('i18n.multiSortCloseModal', 'Close'),
  multiSortOpenMenu: text('i18n.multiSortOpenMenu', 'Open menu'),
  multiSortCloseMenu: text('i18n.multiSortCloseMenu', 'Close menu'),
  multiSortDragHandle: text('i18n.multiSortDragHandle', 'Drag handle'),
  toolbarTooltipLabel: text('i18n.toolbarTooltipLabel', 'Toolbar tooltip'),
});
