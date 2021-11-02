import React, { useState, useMemo, useEffect, useCallback, createElement } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, text, number, select, array, object } from '@storybook/addon-knobs';
import Arrow from '@carbon/icons-react/lib/arrow--right/16';
import Add from '@carbon/icons-react/lib/add/16';
import Edit from '@carbon/icons-react/lib/edit/16';
import { spacing03 } from '@carbon/layout';
import { Add20, TrashCan16 } from '@carbon/icons-react';
import cloneDeep from 'lodash/cloneDeep';
import assign from 'lodash/assign';
import isEqual from 'lodash/isEqual';
import { firstBy } from 'thenby';

import { TextInput, Checkbox, ToastNotification, Button, FormGroup, Form } from '../../index';
import { getSortedData } from '../../utils/componentUtilityFunctions';
import FullWidthWrapper from '../../internal/FullWidthWrapper';
import StoryNotice from '../../internal/StoryNotice';
import EmptyState from '../EmptyState';

import TableREADME from './Table.mdx';
import Table from './Table';
import StatefulTable from './StatefulTable';
import AsyncTable from './AsyncTable/AsyncTable';
import MockApiClient from './AsyncTable/MockApiClient';
import TableViewDropdown from './TableViewDropdown/TableViewDropdown';
import TableSaveViewModal from './TableSaveViewModal/TableSaveViewModal';
import TableManageViewsModal from './TableManageViewsModal/TableManageViewsModal';

const selectData = [
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

const STATUS = {
  RUNNING: 'RUNNING',
  NOT_RUNNING: 'NOT_RUNNING',
  BROKEN: 'BROKEN',
};

export const selectTextWrapping = ['always', 'never', 'auto', 'alwaysTruncate'];

const renderStatusIcon = ({ value: status }) => {
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
const customColumnSort = ({ data, columnId, direction }) => {
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

export const tableColumns = [
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
    filter: { placeholderText: 'pick an option', options: selectData },
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

export const tableColumnsWithAlignment = [
  {
    id: 'string',
    name: 'String',
    filter: { placeholderText: 'enter a string' },
    align: 'start',
    isSortable: true,
  },
  {
    id: 'date',
    name: 'Date',
    filter: { placeholderText: 'enter a date' },
    align: 'center',
    isSortable: true,
  },
  {
    id: 'select',
    name: 'Select',
    filter: { placeholderText: 'pick an option', options: selectData },
    align: 'end',
  },
  {
    id: 'secretField',
    name: 'Secret Information',
    align: 'start',
  },
  {
    id: 'status',
    name: 'Status',
    renderDataFunction: renderStatusIcon,
    align: 'center',
  },
  {
    id: 'number',
    name: 'Number',
    filter: { placeholderText: 'enter a number' },
    align: 'end',
    isSortable: true,
  },
];

export const tableColumnsFixedWidth = tableColumns.map((i) => ({
  ...i,
  name: `${i.name} long text should get truncated`,
  width:
    i.id === 'string'
      ? '50px'
      : i.id === 'date'
      ? '180px'
      : i.id === 'select'
      ? '120px'
      : i.id === 'secretField'
      ? '300px'
      : i.id === 'status'
      ? '100px'
      : i.id === 'number'
      ? '80px'
      : i.id === 'boolean'
      ? '80px'
      : undefined,
}));

export const tableColumnsWithOverflowMenu = [
  {
    id: 'string',
    name: 'String',
    isSortable: true,
    filter: { placeholderText: 'enter a string' },
    overflowMenuItems: selectData,
  },

  {
    id: 'date',
    name: 'Date',
    filter: { placeholderText: 'enter a date' },
    overflowMenuItems: selectData,
  },
  {
    id: 'select',
    name: 'Select',
    filter: { placeholderText: 'pick an option', options: selectData },
  },
  {
    id: 'secretField',
    name: 'Secret Information',
    overflowMenuItems: selectData,
  },
  {
    id: 'status',
    name: 'Status',
    renderDataFunction: renderStatusIcon,
    sortFunction: customColumnSort,
    overflowMenuItems: selectData,
  },
  {
    id: 'number',
    name: 'Number',
    filter: { placeholderText: 'enter a number' },
    overflowMenuItems: selectData,
    align: 'end',
  },
  {
    id: 'boolean',
    name: 'Boolean',
    filter: { placeholderText: 'true or false' },
    overflowMenuItems: selectData,
  },
  {
    id: 'node',
    name: 'React Node',
    overflowMenuItems: selectData,
  },
];

export const defaultOrdering = tableColumns.map((c) => ({
  columnId: c.id,
  isHidden: c.id === 'secretField',
}));

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

export const getNewRow = (idx, suffix = '', withActions = false) => ({
  id: `row-${idx}${suffix ? `_${suffix}` : ''}`,
  values: {
    string: getSentence(idx) + suffix,
    date: new Date(100000000000 + 1000000000 * idx * idx).toISOString(),
    select: selectData[idx % 3].id,
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

export const tableData = Array(100)
  .fill(0)
  .map((i, idx) => getNewRow(idx));

/** Sample expanded row component */
const RowExpansionContent = ({ rowId }) => (
  <div key={`${rowId}-expansion`} style={{ padding: 20 }}>
    <h3 key={`${rowId}-title`}>{rowId}</h3>
    <ul style={{ lineHeight: '22px' }}>
      {Object.entries(tableData.find((i) => i.id === rowId).values).map(([key, value]) => (
        <li key={`${rowId}-${key}`}>
          <b>{key}</b>:{' '}
          {!React.isValidElement(value) && typeof value === 'object' && value !== null
            ? JSON.stringify(value, null, 2)
            : value}
        </li>
      ))}
    </ul>
  </div>
);

export const tableActions = {
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
};

/** This would be loaded from your fetch */
export const initialState = {
  columns: tableColumns.map((i, idx) => ({
    ...i,
    isSortable: idx !== 1,
  })),
  data: tableData.map((i, idx) => ({
    ...i,
    rowActions: [
      idx % 4 !== 0
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
    ].filter((i) => i),
  })),
  expandedData: [
    {
      rowId: 'row-1',
      content: <div>HELLO CONTENT</div>,
    },
  ],
  options: {
    hasFilter: true,
    hasSearch: true,
    hasPagination: true,
    hasRowSelection: 'multi',
    hasRowExpansion: true,
    hasRowActions: true,
    hasColumnSelection: true,
    shouldExpandOnRowClick: false,
    hasRowEdit: true,
    wrapCellText: select(
      'Choose how text should wrap witin columns (options.wrapCellText)',
      selectTextWrapping,
      'always'
    ),
  },
  view: {
    filters: [
      {
        columnId: 'string',
        value: 'whiteboard',
      },
      {
        columnId: 'select',
        value: 'option-B',
      },
    ],
    pagination: {
      pageSize: 10,
      pageSizes: [10, 20, 30],
      page: 1,
    },
    table: {
      loadingMoreIds: [],
      isSelectAllSelected: false,
      selectedIds: [],
      sort: undefined,
      ordering: tableColumns.map(({ id }) => ({
        columnId: id,
        isHidden: id === 'secretField',
      })),
      expandedIds: [],
      rowActions: [],
      singleRowEditButtons: <span>singleRowEditButtons implementation needed</span>,
    },
    toolbar: {
      activeBar: 'filter',
      batchActions: [
        {
          id: 'delete',
          labelText: 'Delete',
          renderIcon: TrashCan16,
          iconDescription: 'Delete',
        },
      ],
      rowEditBarButtons: <div>App implementation of rowEdit bar buttons expected</div>,
    },
  },
};

export default {
  title: '1 - Watson IoT/Table/Table',

  parameters: {
    component: Table,
    docs: {
      page: TableREADME,
    },
  },

  excludeStories: [
    'tableColumns',
    'tableColumnsWithAlignment',
    'tableColumnsFixedWidth',
    'tableColumnsWithOverflowMenu',
    'initialState',
    'StatefulTableWithNestedRowItems',
    'tableActions',
    'selectTextWrapping',
    'getNewRow',
    'tableData',
    'tableColumns',
    'defaultOrdering',
  ],
};

export const BasicDumbTable = () => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'Table');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;

  const secondaryTitle = text(
    'Title shown in bar above header row (secondaryTitle)',
    'Basic `dumb` table'
  );
  const useZebraStyles = boolean('Alternate colors in table rows (useZebraStyles)', false);
  const hasColumnSelection = boolean(
    'Enables choosing which columns are visible or drag-and-drop reorder them (options.hasColumnSelection)',
    false
  );

  const hasColumnSelectionConfig = boolean(
    'Enables choosing which columns are visible or drag-and-drop reorder them and adds callback to manage which columns are available to the table (options.hasColumnSelectionConfig)',
    false
  );

  const hasMultiSort = boolean(
    'Enables sorting the table by multiple dimentions (options.hasMultiSort)',
    false
  );
  return (
    <MyTable
      id="table"
      secondaryTitle={secondaryTitle}
      useZebraStyles={useZebraStyles}
      tooltip={<div>Now with custom tooltip content!</div>}
      columns={
        hasMultiSort
          ? tableColumns.map((c, i) => ({
              ...c,
              isSortable: i !== 1,
            }))
          : tableColumns
      }
      data={tableData}
      actions={tableActions}
      size={select(
        'Sets the height of the table rows (size)',
        ['xs', 'sm', 'md', 'lg', 'xl'],
        'lg'
      )}
      options={{
        hasAggregations: boolean(
          'Aggregates column values and displays in a footer row (options.hasAggregations)',
          true
        ),
        hasColumnSelection,
        hasColumnSelectionConfig,
        hasFilter: select(
          'Enables filtering columns by value (options.hasFilter)',
          ['onKeyPress', 'onEnterAndBlur', true, false],
          true
        ),
        hasMultiSort,
        hasPagination: boolean('Enables pagination for the table (options.hasPagination)', false),
        hasResize: boolean('Enables resizing of column widths (options.hasResize)', false),
        hasRowExpansion: boolean(
          'Enables expanding rows to show additional content (options.hasRowExpansion)',
          false
        ),
        hasRowNesting: boolean(
          'Enables rows to have nested rows within (options.hasRowNesting)',
          false
        ),
        hasRowSelection: select(
          'Enable or Disable selecting single, multiple, or no rows (options.hasRowSelection)',
          ['multi', 'single', false],
          'multi'
        ),
        hasSearch: boolean('Enable searching on the table values (options.hasSearch)', false),
        hasSort: boolean('Enable sorting columns by a single dimension (options.hasSort)', false),
        preserveColumnWidths: boolean(
          'Preserve column widths when resizing (options.preserveColumnWidths)',
          false
        ),
        useAutoTableLayoutForResize: boolean(
          'Removes table-layout:fixed to allow resizable tables (options.useAutoTableLayoutForResize)',
          false
        ),
        wrapCellText: select(
          'Choose how text should wrap witin columns (options.wrapCellText)',
          selectTextWrapping,
          'always'
        ),
      }}
      view={{
        aggregations: {
          label: 'Total:',
          columns: [
            {
              id: 'number',
              align: 'start',
              isSortable: false,
            },
          ],
        },
        toolbar: {
          activeBar: hasColumnSelection || hasColumnSelectionConfig ? 'column' : undefined,
          isDisabled: boolean('Disable the table toolbar (view.toolbar.isDisabled)', false),
        },
        table: {
          loadingState: {
            isLoading: boolean(
              'Show the loading state for the table (view.table.loadingState.isLoading)',
              false
            ),
            rowCount: number(
              'The number of skeleton rows to be included in the loading state (view.table.loadingState.rowCount)',
              7
            ),
            columnCount: number(
              'The number of skeleton columns to be included in the loading state (view.table.loadingState.columnCount)',
              6
            ),
          },
          sort: hasMultiSort
            ? [
                {
                  columnId: 'select',
                  direction: 'ASC',
                },
                {
                  columnId: 'string',
                  direction: 'ASC',
                },
              ]
            : {
                columnId: 'string',
                direction: 'ASC',
              },
        },
      }}
      i18n={{
        columnSelectionConfig: text('i18n.columnSelectionConfig', '__Manage columns__'),
      }}
    />
  );
};

BasicDumbTable.storyName = 'basic `dumb` table';

BasicDumbTable.parameters = {
  info: {
    text: `

    For basic table support, you can render the functional <Table/> component with only the columns and data props.  This table does not have any state management built in.  If you want that, use the <StatefulTable/> component or you will need to implement your own listeners and state management.  You can reuse our tableReducer and tableActions with the useReducer hook to update state.

    <br />

    To enable simple search on a table, simply set the prop options.hasSearch=true.  We wouldn't recommend enabling column filters on a table and simple search for UX reasons, but it is supported.

    <br />

    Warning: Searching, filtering, and sorting is only enabled for strings, numbers, and booleans.

    <br />

    ~~~js
    import { tableReducer, tableActions } from 'carbon-addons-iot-react';

    const [state, dispatch] = useReducer(tableReducer, { data: initialData, view: initialState });

    const actions = {
      table: {
        onChangeSort: column => {
          dispatch(tableActions.tableColumnSort(column));
        },
      }
    }

    <Table
      {...state}
      ...
    ~~~

    <br />
    `,
  },
};

export const TableWithColumnGrouping = () => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'Table');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  const useZebraStyles = boolean('Alternate colors in table rows (useZebraStyles)', false);
  const ordering = object('Ordering (view.table.ordering)', [
    {
      columnId: 'string',
      columnGroupId: 'groupA',
    },
    {
      columnId: 'date',
      columnGroupId: 'groupA',
    },
    {
      columnId: 'select',
      columnGroupId: 'groupB',
    },
    {
      columnId: 'secretField',
      columnGroupId: 'groupB',
    },
  ]);
  const options = {
    hasRowActions: boolean('Enables row actions (options.hasRowActions)', false),
    hasRowExpansion: boolean(
      'Enables expanding rows to show additional content (options.hasRowExpansion)',
      false
    ),
    hasRowNesting: boolean(
      'Enables rows to have nested rows within (options.hasRowNesting)',
      false
    ),
    hasRowSelection: select(
      'Enable or Disable selecting single, multiple, or no rows (options.hasRowSelection)',
      ['multi', 'single', false],
      false
    ),
  };

  return (
    <MyTable
      id="table"
      useZebraStyles={useZebraStyles}
      columns={tableColumns.slice(0, 4)}
      columnGroups={object('Column groups (columnGroups)', [
        {
          id: 'groupA',
          name: 'Group A',
        },
        {
          id: 'groupB',
          name: 'Group B',
        },
      ])}
      data={tableData.slice(0, 10).map((i) => ({
        ...i,
        rowActions: [
          {
            id: 'textOnly',
            labelText: 'Text only sample action',
            isOverflow: true,
          },
        ],
      }))}
      options={options}
      actions={tableActions}
      size={select(
        'Sets the height of the table rows (size)',
        ['xs', 'sm', 'md', 'lg', 'xl'],
        'lg'
      )}
      view={{
        table: { ordering },
      }}
    />
  );
};

TableWithColumnGrouping.storyName = 'with column grouping';

export const TableExampleWithCreateSaveViews = () => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'Table');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;

  // The initial default state for this story is one with no active filters
  // and no default search value etc, i.e. a view all scenario.
  const baseState = {
    ...initialState,
    columns: initialState.columns.map((col) => ({
      ...col,
      width: '150px',
    })),
    view: {
      ...initialState.view,
      filters: [],
      toolbar: {
        activeBar: 'filter',
        search: { defaultValue: '' },
      },
    },
  };

  // Create some mockdata to represent previously saved views.
  // The props can be any subset of the view and columns prop that
  // you need in order to successfully save and load your views.
  const viewExample = {
    description: 'Columns: 7, Filters: 0, Search: pinoc',
    id: 'view1',
    isPublic: true,
    isDeleteable: true,
    isEditable: true,
    title: 'Search view',
    props: {
      view: {
        filters: [],
        table: {
          ordering: baseState.view.table.ordering,
          sort: {},
        },
        toolbar: {
          activeBar: 'column',
          search: { defaultValue: text('defaultSearchValue', 'pinoc'), defaultExpanded: true },
        },
      },
      columns: baseState.columns,
    },
  };
  const viewExample2 = {
    description: 'Columns: 7, Filters: 1, Search:',
    id: 'view2',
    isPublic: false,
    isDeleteable: true,
    isEditable: true,
    title: 'Filters and search view',
    props: {
      view: {
        filters: [{ columnId: 'string', value: 'helping' }],
        table: {
          ordering: baseState.view.table.ordering,
          sort: {
            columnId: 'select',
            direction: 'DESC',
          },
        },
        toolbar: {
          activeBar: 'filter',
          search: { defaultValue: 'help', defaultExpanded: true },
        },
      },
      columns: baseState.columns,
    },
  };

  /** The "store" that holds all the existing views */
  const [viewsStorage, setViewsStorage] = useState([viewExample, viewExample2]);
  /** Tracks if the user has modified the view since it was selected */
  const [selectedViewEdited, setSelectedViewEdited] = useState(false);
  /** The props & metadata of the view currently selected */
  const [selectedView, setSelectedView] = useState(viewExample2);
  /** The props & metadata representing the current state needed by SaveViewModal  */
  const [viewToSave, setViewToSave] = useState(undefined);
  /** The id of the view that is currently the default */
  const [defaultViewId, setDefaultViewId] = useState('view2');
  /** Number of views per page in the TableManageViewModal */
  const manageViewsRowsPerPage = 10;
  /** Current page number in the TableManageViewModal */
  const [manageViewsCurrentPageNumber, setManageViewsCurrentPageNumber] = useState(1);
  /** Current filters in the TableManageViewModal. Can hold 'searchTerm' and 'showPublic' */
  const [manageViewsCurrentFilters, setManageViewsCurrentFilters] = useState({
    searchTerm: '',
    showPublic: true,
  });
  /** Flag needed to open and close the TableManageViewModal */
  const [manageViewsModalOpen, setManageViewsModalOpen] = useState(false);
  /** Collection of filtered views needed for the pagination in the TableManageViewModal */
  const [manageViewsFilteredViews, setManageViewsFilteredViews] = useState(viewsStorage);
  /** Collection of views on the current page in the TableManageViewModal */
  const [manageViewsCurrentPageItems, setManageViewsCurrentPageItems] = useState(
    viewsStorage.slice(0, manageViewsRowsPerPage)
  );

  // This is the state of the current table.
  const [currentTableState, setCurrentTableState] = useState(
    assign({}, baseState, viewsStorage.find((view) => view.id === defaultViewId)?.props)
  );

  // The seletable items to be presented by the ViewDropDown.
  const selectableViews = useMemo(
    () => viewsStorage.map(({ id, title }) => ({ id, text: title })),
    [viewsStorage]
  );

  // A helper method used to extract the relevat properties from the view and column
  // props. For our example story this is what we store in a saved view.
  const extractCurrentUserView = useCallback(
    ({ view, columns }) => ({
      props: {
        columns,
        view: {
          filters: view.filters,
          table: {
            ordering: view.table.ordering,
            sort: view.table.sort || {},
          },
          toolbar: {
            activeBar: view.toolbar.activeBar,
            search: {
              ...view.toolbar.search,
              defaultValue: currentTableState.view.toolbar?.search?.defaultValue || '',
            },
          },
        },
      },
    }),
    [currentTableState]
  );

  // This effect is needed to determine if the current view has been changed
  // so that this can be reflected in the TableViewDropdown.
  useEffect(() => {
    const currentUserView = extractCurrentUserView(currentTableState);
    const compareView = selectedView || extractCurrentUserView(baseState);
    setSelectedViewEdited(!isEqual(currentUserView.props, compareView.props));
  }, [baseState, currentTableState, extractCurrentUserView, selectedView]);

  /**
   * The TableManageViewsModal is an external component that can be placed outside
   * the table. It is highly customizable and is used to list existing views and
   * provide the used the option to delete and edit the view's metadata. See the
   * TableManageViewsModal story for a more detailed documentation.
   */
  const renderManageViewsModal = () => {
    const showPage = (pageNumber, views) => {
      const rowUpperLimit = pageNumber * manageViewsRowsPerPage;
      const currentItemsOnPage = views.slice(rowUpperLimit - manageViewsRowsPerPage, rowUpperLimit);
      setManageViewsCurrentPageNumber(pageNumber);
      setManageViewsCurrentPageItems(currentItemsOnPage);
    };

    const applyFiltering = ({ searchTerm, showPublic }) => {
      const views = viewsStorage
        .filter(
          (view) =>
            searchTerm === '' || view.title.toLowerCase().search(searchTerm.toLowerCase()) !== -1
        )
        .filter((view) => (showPublic ? view : !view.isPublic));

      setManageViewsFilteredViews(views);
      showPage(1, views);
    };

    const onDelete = (viewId) => {
      if (viewId === selectedView?.id) {
        setSelectedViewEdited(false);
        setSelectedView(undefined);
        setCurrentTableState(baseState);
      }

      const deleteIndex = viewsStorage.findIndex((view) => view.id === viewId);
      setViewsStorage((existingViews) => {
        const modifiedViews = [...existingViews];
        modifiedViews.splice(deleteIndex, 1);
        setManageViewsFilteredViews(modifiedViews);
        showPage(1, modifiedViews);
        return modifiedViews;
      });
    };

    return (
      <TableManageViewsModal
        actions={{
          onDisplayPublicChange: (showPublic) => {
            const newFilters = {
              ...manageViewsCurrentFilters,
              showPublic,
            };
            setManageViewsCurrentFilters(newFilters);
            applyFiltering(newFilters);
          },
          onSearchChange: (searchTerm = '') => {
            const newFilters = {
              ...manageViewsCurrentFilters,
              searchTerm,
            };
            setManageViewsCurrentFilters(newFilters);
            applyFiltering(newFilters);
          },
          onEdit: (viewId) => {
            setManageViewsModalOpen(false);
            const viewToEdit = viewsStorage.find((view) => view.id === viewId);
            setSelectedView(viewToEdit);
            setViewToSave(viewToEdit);
          },
          onDelete,
          onClearError: action('TableManageViewsModal: onClearManageViewsModalError'),
          onClose: () => setManageViewsModalOpen(false),
        }}
        defaultViewId={defaultViewId}
        error={select('TableManageViewsModal: error', [undefined, 'My error msg'], undefined)}
        isLoading={boolean('TableManageViewsModal: isLoading', false)}
        open={manageViewsModalOpen}
        views={manageViewsCurrentPageItems}
        pagination={{
          page: manageViewsCurrentPageNumber,
          onPage: (pageNumber) => showPage(pageNumber, manageViewsFilteredViews),
          maxPage: Math.ceil(manageViewsFilteredViews.length / manageViewsRowsPerPage),
          pageOfPagesText: (pageNumber) => `Page ${pageNumber}`,
        }}
      />
    );
  };

  /**
   * The TableViewDropdown is an external component that needs to be passed in
   * via the customToolbarContent and positioned according to the applications needs.
   * Most of the functionality in the TableViewDropdown can be overwritten. See the
   * TableViewDropdown story for a more detailed documentation.
   */
  const renderViewDropdown = () => {
    return (
      <TableViewDropdown
        style={{ order: '-1', width: '300px' }}
        selectedViewId={selectedView?.id}
        selectedViewEdited={selectedViewEdited}
        views={selectableViews}
        actions={{
          onSaveAsNewView: () => {
            setViewToSave({
              id: undefined,
              ...extractCurrentUserView(currentTableState),
            });
          },
          onManageViews: () => {
            setManageViewsModalOpen(true);
            setManageViewsCurrentPageItems(viewsStorage.slice(0, manageViewsRowsPerPage));
          },
          onChangeView: ({ id }) => {
            const selectedView = viewsStorage.find((view) => view.id === id);
            setCurrentTableState(assign({}, baseState, selectedView?.props));
            setSelectedView(selectedView);
            setSelectedViewEdited(false);
          },
          onSaveChanges: () => {
            setViewToSave({
              ...selectedView,
              ...extractCurrentUserView(currentTableState),
            });
          },
        }}
      />
    );
  };

  /**
   * The TableSaveViewModal is a an external component that can be placed
   * outside the table. Is is used both for saving new views and for
   * updating existing ones. See the TableSaveViewModal story for a more
   * detailed documentation.
   */
  const renderSaveViewModal = () => {
    const saveView = (viewMetaData) => {
      setViewsStorage((existingViews) => {
        const modifiedStorage = [];
        const saveNew = viewToSave.id === undefined;
        const { isDefault, ...metaDataToSave } = viewMetaData;
        const generatedId = new Date().getTime().toString();

        if (saveNew) {
          const newViewToStore = {
            ...viewToSave,
            ...metaDataToSave,
            id: generatedId,
            isDeleteable: true,
            isEditable: true,
          };
          modifiedStorage.push(...existingViews, newViewToStore);
          setSelectedView(newViewToStore);
        } else {
          const indexToUpdate = existingViews.findIndex((view) => view.id === viewToSave.id);
          const viewsCopy = [...existingViews];
          const modifiedViewToStore = {
            ...viewToSave,
            ...metaDataToSave,
          };
          viewsCopy[indexToUpdate] = modifiedViewToStore;
          setSelectedView(modifiedViewToStore);
          modifiedStorage.push(...viewsCopy);
        }

        if (isDefault) {
          setDefaultViewId(saveNew ? generatedId : viewToSave.id);
        }

        setSelectedViewEdited(false);
        return modifiedStorage;
      });
      setViewToSave(undefined);
    };

    // Simple description example that can be replaced by any string or node.
    // See the TableSaveViewModal story for more examples.
    const getDescription = ({ table, filters, toolbar }) =>
      `Columns: ${table.ordering.filter((col) => !col.isHidden).length},
        Filters: ${filters?.length || 0},
        Search: ${toolbar?.search?.defaultValue}`;

    return (
      viewToSave && (
        <TableSaveViewModal
          actions={{
            onSave: saveView,
            onClose: () => {
              setViewToSave(undefined);
            },
            onClearError: action('TableSaveViewModal: onClearError'),
            onChange: action('TableSaveViewModal: onChange'),
          }}
          sendingData={boolean('TableSaveViewModal: sendingData', false)}
          error={select('TableSaveViewModal: error', [undefined, 'My error msg'], undefined)}
          open
          titleInputInvalid={boolean('TableSaveViewModal: titleInputInvalid', false)}
          titleInputInvalidText={text('TableSaveViewModal: titleInputInvalidText', undefined)}
          viewDescription={getDescription(viewToSave.props.view)}
          initialFormValues={{
            title: viewToSave.title,
            isPublic: viewToSave.isPublic,
            isDefault: viewToSave.id === defaultViewId,
          }}
          i18n={{
            modalTitle: viewToSave.id ? 'Update view' : 'Save new view',
          }}
        />
      )
    );
  };

  return (
    <FullWidthWrapper>
      {renderManageViewsModal()}
      {renderSaveViewModal()}
      <MyTable
        key={`table-story-${selectedView?.id}`}
        id="table"
        {...baseState}
        columns={currentTableState.columns}
        size={select(
          'Sets the height of the table rows (size)',
          ['xs', 'sm', 'md', 'lg', 'xl'],
          'lg'
        )}
        view={{
          ...currentTableState.view,
          // The TableViewDropdown should be inserted as customToolbarContent
          toolbar: {
            ...currentTableState.view.toolbar,
            customToolbarContent: renderViewDropdown(),
          },
        }}
        secondaryTitle="Table with user view management"
        actions={{
          ...tableActions,
          table: {
            ...action.table,
            onColumnResize: (columns) => {
              setCurrentTableState((state) => ({
                ...state,
                columns,
              }));
            },
            // Simplified sorting for this story. It does not update the data of the table
            // and it ignores direction.
            onChangeSort: (sortOnColumnId) => {
              setCurrentTableState((state) => ({
                ...state,
                view: {
                  ...state.view,
                  table: {
                    ...state.view.table,
                    sort: {
                      columnId: sortOnColumnId,
                      direction: 'DESC',
                    },
                  },
                },
              }));
            },
          },
          toolbar: {
            ...tableActions.toolbar,
            onApplySearch: (currentSearchValue) => {
              // Here you can use debounce and call the backend to properly filter
              // your data. For this story we simply update the search defaultValue.
              setCurrentTableState((state) => ({
                ...state,
                view: {
                  ...state.view,
                  toolbar: {
                    ...state.view.toolbar,
                    search: { defaultValue: currentSearchValue },
                  },
                },
              }));
            },
            onApplyFilter: (filters) => {
              // Simplified filtering for this story. It does not update the data of
              // the table only the actual filters.
              setCurrentTableState((state) => ({
                ...state,
                view: {
                  ...state.view,
                  filters: Object.entries(filters)
                    .filter(([, value]) => value !== '')
                    .map(([key, value]) => ({
                      columnId: key,
                      value,
                    })),
                },
              }));
            },
          },
        }}
        options={{
          ...baseState.options,
          hasResize: true,
          hasFilter: select(
            'hasFilter',
            ['onKeyPress', 'onEnterAndBlur', true, false],
            'onKeyPress'
          ),
          wrapCellText: select(
            'Choose how text should wrap witin columns (options.wrapCellText)',
            selectTextWrapping,
            'always'
          ),
          // Enables the behaviour in Table required
          // to fully implement Create and Save Views
          hasUserViewManagement: true,
        }}
      />
    </FullWidthWrapper>
  );
};

TableExampleWithCreateSaveViews.storyName = 'with create & save view management';
TableExampleWithCreateSaveViews.decorators = [createElement];

TableExampleWithCreateSaveViews.parameters = {
  info: {
    text: `
    This story shows a partial implementation of how to add user View Management,
    but the implemented examples should be enough to give you an idea on how to use it
    together with your own state manager. We examplify by providing shallow implementations
    for onChangeSort, onApplySearch and onApplyFilter. The story is using a simple state
    object currentTableState and the data objects in the callbacks are just appended to that
    state using the same ref, but in a real situation the state management would be more complex.
    The story's source code is too complex to successfully be shown here, please view
    the actual source code.
    `,
    propTables: [Table],
    propTablesExclude: [StatefulTable],
  },
};

export const BasicTableWithFullRowEditExample = () => {
  const [showRowEditBar, setShowRowEditBar] = useState(false);
  const startingData = tableData.map((i) => ({
    ...i,
    rowActions: [
      {
        id: 'edit',
        renderIcon: Edit,
        iconDescription: 'Edit',
        labelText: 'Edit',
        isOverflow: true,
        isEdit: true,
      },
    ],
  }));
  const [currentData, setCurrentData] = useState(startingData);
  const [rowEditedData, setRowEditedData] = useState([]);
  const [previousData, setPreviousData] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [rowActionsState, setRowActionsState] = useState([]);

  const onDataChange = (e, columnId, rowId) => {
    const newValue = e.currentTarget ? e.currentTarget.value : e;
    rowEditedData.find((row) => row.id === rowId).values[columnId] = newValue;
  };

  const onShowMultiRowEdit = () => {
    setRowEditedData(cloneDeep(currentData));
    setShowRowEditBar(true);
    setShowToast(false);
  };
  const onCancelRowEdit = () => {
    setRowEditedData([]);
    setShowRowEditBar(false);
    setRowActionsState([]);
  };
  const onSaveRowEdit = () => {
    setShowToast(true);
    setPreviousData(currentData);
    setCurrentData(rowEditedData);
    setRowEditedData([]);
    setShowRowEditBar(false);
    setRowActionsState([]);
  };
  const onUndoRowEdit = () => {
    setCurrentData(previousData);
    setPreviousData([]);
    setShowToast(false);
  };

  const onApplyRowAction = (action, rowId) => {
    if (action === 'edit') {
      setRowEditedData(cloneDeep(currentData));
      setRowActionsState([...rowActionsState, { rowId, isEditMode: true }]);
    }
  };

  // The app should handle i18n and button enable state, e.g. that the save button
  // is disabled when the input controls are pristine.
  const saveCancelButtons = (
    <React.Fragment>
      <Button
        key="cancel"
        style={{ marginRight: spacing03 }}
        size="small"
        kind="tertiary"
        onClick={onCancelRowEdit}
      >
        Cancel
      </Button>
      <Button key="save" size="small" onClick={onSaveRowEdit}>
        Save
      </Button>
    </React.Fragment>
  );

  // This is a simplified example.
  // The app should handle input validation and types like dates, select etc
  const editDataFunction = ({ value, columnId, rowId }) => {
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

  const myToast = (
    <ToastNotification
      style={{ position: 'absolute', zIndex: '1' }}
      hideCloseButton={false}
      kind="success"
      notificationType="inline"
      role="alert"
      subtitle={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>Changed your mind?</span>
          <Button
            style={{ color: 'white', marginLeft: '12px' }}
            kind="ghost"
            onClick={onUndoRowEdit}
            size="small"
            type="button"
          >
            Undo edits
          </Button>
        </div>
      }
      timeout={5000}
      title="Your changes have been saved."
    />
  );

  return (
    <div>
      {showToast ? myToast : null}
      <Table
        id="table"
        secondaryTitle="My editable table"
        size={select(
          'Sets the height of the table rows (size)',
          ['xs', 'sm', 'md', 'lg', 'xl'],
          'lg'
        )}
        view={{
          toolbar: {
            activeBar: showRowEditBar ? 'rowEdit' : undefined,
            rowEditBarButtons: saveCancelButtons,
          },
          table: {
            rowActions: rowActionsState,
            singleRowEditButtons: saveCancelButtons,
          },
        }}
        data={currentData}
        actions={{
          table: { onApplyRowAction },
          toolbar: { onShowRowEdit: onShowMultiRowEdit },
        }}
        options={{
          hasRowEdit: boolean(
            'Enables row editing for the entire table (options.hasRowEdit)',
            true
          ),
          hasSingleRowEdit: boolean(
            'Enables row editing for a single row (options.hasSingleRowEdit)',
            true
          ),
          hasRowActions: true,
          hasPagination: true,
        }}
        columns={tableColumns.map((i) => ({ ...i, editDataFunction }))}
      />
    </div>
  );
};

BasicTableWithFullRowEditExample.storyName = 'with full rowEdit example';
BasicTableWithFullRowEditExample.decorators = [createElement];

BasicTableWithFullRowEditExample.parameters = {
  info: {
    text: `

    This table has editable rows. It is wrapped in a component that handles the state of the table data and
    the active bar to serve as a simple example of how to use the 'hasRowEdit' and the 'hasSingleRowEdit'
    functionality with your own data store.

    When the 'hasRowEdit' is true an edit icon will be shown in the
    table toolbar. Clicking the edit icon should enable row edit for all rows, but it requires the
    columns to have an 'editDataFunction' prop defined. For StatefulTable this is handled automatically, for normal tables it
    should be handled manually as shown in this story.

    The 'hasSingleRowEdit' must be combined with a row action that has the "isEdit" property set to true.
    Clicking that row action shoulf turn that specific row editable, and it also requires the columns to have
    provided a 'editDataFunction'. For StatefulTable the row action state is automatically updated with
    isEditMode:true but for normal tables it should be handled manually as shown in this story.


    ~~~js

    view = {
      toolbar: {
        activeBar: // conditionally set to 'rowEdit' using onShowRowEdit action
        rowEditBarButtons: // JSX to show save and cancel buttons in the rowEdit bar
      }
    }

    actions = {
      table: { onApplyRowAction: (action, rowId) => {
        // Handle action === 'edit' to enable the rows edit mode
      } },
      toolbar: { onShowRowEdit: (action, rowId) => {
        // Update your state to enable full table edit mode
      } },
    }

    options = { hasRowEdit: true, hasSingleRowEdit: true }

    columns={columns.map(i => ({
      ...i,
      editDataFunction: () => {
        // Your edit data function here..
      },
    }))}

    The editDataFunction is called with this payload
    {
       value: PropTypes.any (current cell value),
       columnId: PropTypes.string,
       rowId: PropTypes.string,
       row: the full data for this rowPropTypes.object like this {col: value, col2: value}
    }
    ~~~

    `,
    propTables: [Table],
    propTablesExclude: [StatefulTable],
  },
};

export const RowSelectionAndBatchActions = () => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'Table');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  const hasRowSelection = select(
    'Enable or Disable selecting single, multiple, or no rows (options.hasRowSelection)',
    ['multi', 'single', false],
    'multi'
  );
  const selectedIds =
    hasRowSelection === 'multi'
      ? array('An array of currently selected rowIds (view.table.selectedIds)', [
          'row-3',
          'row-4',
          'row-6',
          'row-7',
        ])
      : array('An array of currently selected rowIds (view.table.selectedIds)', ['row-3']);
  return (
    <MyTable
      id="table"
      secondaryTitle={text(
        'Title shown in bar above header row (secondaryTitle)',
        `Row count: ${initialState.data.length}`
      )}
      columns={tableColumns}
      data={tableData.slice(0, number('number of rows in story', 10)).map((i, idx) => ({
        ...i,
        children:
          idx === 3
            ? [getNewRow(idx, 'A'), getNewRow(idx, 'B')]
            : idx === 7
            ? [
                getNewRow(idx, 'A'),
                {
                  ...getNewRow(idx, 'B'),
                  children: [getNewRow(idx, 'B-1'), getNewRow(idx, 'B-2')],
                },
                getNewRow(idx, 'C'),
                {
                  ...getNewRow(idx, 'D'),
                  children: [getNewRow(idx, 'D-1'), getNewRow(idx, 'D-2'), getNewRow(idx, 'D-3')],
                },
              ]
            : undefined,
      }))}
      actions={tableActions}
      size={select(
        'Sets the height of the table rows (size)',
        ['xs', 'sm', 'md', 'lg', 'xl'],
        'lg'
      )}
      options={{
        hasFilter: select(
          'Enables filtering columns by value (options.hasFilter)',
          ['onKeyPress', 'onEnterAndBlur', true, false],
          'onKeyPress'
        ),
        hasPagination: boolean('Enables pagination for the table (options.hasPagination)', true),
        hasRowSelection,
        hasRowExpansion: boolean(
          'Enables expanding rows to show additional content (options.hasRowExpansion)',
          true
        ),
        hasRowNesting: boolean(
          'Enables rows to have nested rows within (options.hasRowNesting)',
          true
        ),
      }}
      view={{
        filters: [],
        toolbar: {
          batchActions: [
            {
              id: 'delete',
              labelText: 'Delete',
              renderIcon: TrashCan16,
              iconDescription: 'Delete Item',
            },
          ],
        },
        table: {
          ordering: defaultOrdering,
          isSelectAllSelected: select(
            'Manages the state of the Select All checkbox (view.table.isSelectAllSelected)',
            [undefined, true, false],
            undefined
          ),
          isSelectAllIndeterminate: select(
            'Is the Select All checkbox in in indeterminate state? (view.table.isSelectAllIndeterminate)',
            [undefined, true, false],
            undefined
          ),
          expandedIds: array('An array of current expanded rowIds (view.table.expandedIds)', [
            'row-3',
            'row-7',
            'row-7_B',
          ]),
          selectedIds,
        },
      }}
    />
  );
};

RowSelectionAndBatchActions.storyName = 'with row selection and batch actions';

export const WithRowExpansionAndActions = () => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'Table');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;

  const renderDataFunction = ({ value }) => (
    <div style={{ color: value === 'BROKEN' ? 'red' : 'black' }}>{value}</div>
  );

  return (
    <MyTable
      id="table"
      columns={tableColumns.map((c) => ({
        ...c,
        renderDataFunction: c.renderDataFunction || renderDataFunction,
      }))}
      data={tableData.map((i, idx) => ({
        ...i,
        rowActions:
          idx % 4 === 0 // every 4th row shouldn't have any actions
            ? []
            : [
                {
                  id: 'drilldown',
                  renderIcon: Arrow,
                  iconDescription: 'See more',
                  labelText: 'See more',
                },
                {
                  id: 'add',
                  renderIcon: Add,
                  iconDescription: 'Add',
                  labelText: 'Add',
                  isOverflow: true,
                  hasDivider: true,
                },
                {
                  id: 'delete',
                  renderIcon: TrashCan16,
                  iconDescription: 'Delete',
                  labelText: 'Delete',
                  isOverflow: true,
                  isDelete: true,
                },
              ].filter((i) => i),
      }))}
      actions={tableActions}
      options={{
        hasRowExpansion: true,
        hasRowActions: true,
      }}
      size={select(
        'Sets the height of the table rows (size)',
        ['xs', 'sm', 'md', 'lg', 'xl'],
        'lg'
      )}
      expandedData={[
        {
          rowId: 'row-2',
          content: <RowExpansionContent rowId="row-2" />,
        },
        {
          rowId: 'row-5',
          content: <RowExpansionContent rowId="row-5" />,
        },
      ]}
      view={{
        filters: [],
        table: {
          ordering: defaultOrdering,
          rowActions: [
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
          ],
        },
      }}
    />
  );
};

WithRowExpansionAndActions.storyName = 'with row expansion, custom cell renderer, and actions';

WithRowExpansionAndActions.parameters = {
  info: {
    text: `

    To add custom row actions to each row you need to pass a rowActions array along with every row of your data.  The RowActionsPropTypes is defined as:

    <br />

    ~~~js
    RowActionPropTypes = PropTypes.arrayOf(
      PropTypes.shape({
        /** Unique id of the action */
        id: PropTypes.string.isRequired,
        /** icon ultimately gets passed through all the way to <Button>, which has this same copied proptype definition for icon */
        icon: PropTypes.oneOfType([
          PropTypes.shape({
            width: PropTypes.string,
            height: PropTypes.string,
            viewBox: PropTypes.string.isRequired,
            svgData: PropTypes.object.isRequired,
          }),
          PropTypes.string,
          PropTypes.node,
        ]),
        disabled: PropTypes.bool,
        labelText: PropTypes.string,
        /** Action should go into the overflow menu, not be rendered inline in the row */
        isOverflow: PropTypes.bool,
      })
    );

    data.map(row=>{id: row.id, values: {id: row.id}, rowActions=[{id: delete, icon: 'icon--delete', labelText: 'Delete'}]})
    ~~~

    <br />

    You also need to set the options prop on the table to get the rowActions to render.

    <br />

    ~~~js
    options = {
      hasRowActions: true
    }
    ~~~

    <br />

    To listen to the row actions and trigger an event you should pass a function to the actions prop:

    <br />

    ~~~js
    actions={
      table: {
        onApplyRowAction: myCustomListener
      }
    }
    ~~~

    <br />

    The onApplyRowAction is called with the actionid, and then the rowid that was clicked.  If you return a promise, the table will assume this is an asynchronous action and will show an In Progress indicator until you resolve or reject the promise.

    <br />

    ~~~js
      const myCustomListener = (actionid, rowid)=> {
        if (actionid === 'myexpectedaction') {
          console.log(\`perform action on row: \${rowid}\`)
        }
      }
    ~~~

    <br />

    `,
  },
};

export const WithSorting = () => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'Table');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  const hasMultiSort = boolean(
    'Enables sorting the table by multiple dimentions (options.hasMultiSort)',
    false
  );

  const sortedData =
    hasMultiSort && selectedTableType === 'Table'
      ? tableData.slice(0, 10).sort(
          firstBy((row) => row.values.select).thenBy((row) => {
            return row.values.string;
          })
        )
      : getSortedData(tableData, 'string', 'ASC');
  return (
    <FullWidthWrapper>
      <style>{`#custom-row-height table tr { height: 5rem;}`}</style>
      <div id="custom-row-height">
        <MyTable
          columns={tableColumns.map((i, idx) => ({
            ...i,
            isSortable: idx !== 1,
            align: i.id === 'number' ? 'end' : i.id === 'string' ? 'center' : 'start',
          }))}
          data={sortedData}
          actions={tableActions}
          options={{
            hasFilter: boolean('Enables filtering columns by value (options.hasFilter)', false),
            hasPagination: boolean(
              'Enables pagination for the table (options.hasPagination)',
              false
            ),
            hasRowSelection: select(
              'Enable or Disable selecting single, multiple, or no rows (options.hasRowSelection)',
              ['multi', 'single', false],
              'multi'
            ),
            hasAggregations: boolean(
              'Aggregates column values and displays in a footer row (options.hasAggregations)',
              true
            ),
            hasMultiSort,
          }}
          view={{
            filters: [],
            aggregations: {
              label: 'Total',
              columns: [
                {
                  id: 'number',
                  align: 'end',
                  isSortable: true,
                },
              ],
              isHidden: false,
            },
            table: {
              ordering: defaultOrdering,
              sort: hasMultiSort
                ? [
                    {
                      columnId: 'select',
                      direction: 'ASC',
                    },
                    {
                      columnId: 'string',
                      direction: 'ASC',
                    },
                  ]
                : {
                    columnId: 'string',
                    direction: 'ASC',
                  },
            },
          }}
        />
      </div>
    </FullWidthWrapper>
  );
};

WithSorting.storyName = 'with sorting and custom row height';

export const WithFilters = () => {
  text(
    'instructions',
    "By changing the value in a filter to a value that doesn't it exist will show the no results screen"
  );
  const filters = object(
    'An array of filter objects for the columns to be filtered by (view.filters)',
    [
      {
        columnId: 'string',
        value: 'whiteboard',
      },
      {
        columnId: 'select',
        value: 'option-B',
      },
    ]
  );

  const filteredData = tableData.filter(({ values }) =>
    // return false if a value doesn't match a valid filter
    filters.reduce(
      (acc, { columnId, value }) => acc && values[columnId].toString().includes(value),
      true
    )
  );

  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'Table');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  return (
    <MyTable
      id="table"
      columns={tableColumns}
      data={filteredData}
      actions={tableActions}
      options={{
        hasFilter: true,
        hasPagination: true,
        hasRowSelection: 'multi',
      }}
      size={select(
        'Sets the height of the table rows (size)',
        ['xs', 'sm', 'md', 'lg', 'xl'],
        'lg'
      )}
      view={{
        filters,
        pagination: {
          totalItems: filteredData.length,
        },
        toolbar: {
          activeBar: 'filter',
          customToolbarContent: (
            <div style={{ alignItems: 'center', display: 'flex', padding: '0 1rem' }}>
              custom content
            </div>
          ),
        },
        table: {
          ordering: defaultOrdering,
        },
      }}
    />
  );
};

WithFilters.storyName = 'with filtering and custom toolbar content';

export const WithAdvancedFilters = () => {
  const operands = {
    IN: (a, b) => a.includes(b),
    NEQ: (a, b) => a !== b,
    LT: (a, b) => a < b,
    LTOET: (a, b) => a <= b,
    EQ: (a, b) => a === b,
    GTOET: (a, b) => a >= b,
    GT: (a, b) => a > b,
  };

  const advancedFilters = [
    {
      filterId: 'story-filter',
      /** Text for main tilte of page */
      filterTitleText: 'Story Filter',
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
            operand: 'IN',
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
      filterColumns: tableColumns,
    },
    {
      filterId: 'next-filter',
      /** Text for main tilte of page */
      filterTitleText: 'Next Filter',
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
      filterColumns: tableColumns,
    },
  ];

  const filteredData = tableData.filter(({ values }) => {
    // return false if a value doesn't match a valid filter
    return advancedFilters[0].filterRules.rules.reduce(
      (acc, { columnId, operand, value: filterValue }) => {
        const columnValue = values[columnId].toString();
        const comparitor = operands[operand];
        if (advancedFilters[0].filterRules.groupLogic === 'ALL') {
          return acc && comparitor(columnValue, filterValue);
        }

        return comparitor(columnValue, filterValue);
      },
      true
    );
  });
  return (
    <>
      <StoryNotice experimental componentName="Table with advancedFilters" />
      <Table
        id="table"
        columns={tableColumns}
        data={filteredData}
        actions={tableActions}
        options={{
          hasPagination: true,
          hasRowSelection: 'multi',
          hasAdvancedFilter: true,
        }}
        size={select(
          'Sets the height of the table rows (size)',
          ['xs', 'sm', 'md', 'lg', 'xl'],
          'lg'
        )}
        view={{
          filters: [
            {
              columnId: 'string',
              value: 'whiteboard',
            },
            {
              columnId: 'select',
              value: 'option-B',
            },
          ],
          advancedFilters,
          selectedAdvancedFilterIds: ['story-filter'],
          pagination: {
            totalItems: filteredData.length,
          },
          table: {
            ordering: defaultOrdering,
          },
          toolbar: {
            advancedFilterFlyoutOpen: true,
          },
        }}
      />
    </>
  );
};

WithAdvancedFilters.storyName = '☢️ with advanced filtering';

export const WithTableStates = () => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'Table');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;

  const emptyState = (
    <div key="empty-state">
      <h1 key="empty-state-heading">Custom empty state</h1>
      <p key="empty-state-message">Hey, no data!</p>
    </div>
  );

  const errorState = (
    <EmptyState
      icon="error"
      title="Error occured while loading"
      body={text('error state message', 'Error message')}
      action={{
        label: 'Reload',
        onClick: action('onErrorStateAction'),
        kind: 'ghost',
      }}
    />
  );

  const showErrorState = boolean('Show Custom Error State', false);
  return (
    <MyTable
      id="table"
      columns={tableColumns}
      data={showErrorState ? tableData.slice(0, 20) : []}
      actions={tableActions}
      size={select(
        'Sets the height of the table rows (size)',
        ['xs', 'sm', 'md', 'lg', 'xl'],
        'lg'
      )}
      view={{
        table: {
          ordering: defaultOrdering,
          emptyState: boolean('Show Custom Empty State', false) ? emptyState : undefined,
          errorState: showErrorState ? errorState : undefined,
          loadingState: {
            isLoading: boolean(
              'Show the loading state for the table (view.table.loadingState.isLoading)',
              false
            ),
            rowCount: number(
              'The number of skeleton rows to be included in the loading state (view.table.loadingState.rowCount)',
              7
            ),
          },
        },
      }}
      options={{ hasPagination: true }}
      error={showErrorState ? 'Error!' : undefined}
    />
  );
};

WithTableStates.storyName = 'with custom states states: no data, custom empty, error, and loading';

export const WithOptionsToExploreColumnSettings = () => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'Table');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;

  const ColumnsModifier = ({ onAdd, onRemove, columns, ordering }) => {
    const [colsToAddField, setColsToAddField] = useState('colX, colY');
    const [colsToAddWidthField, setColsToAddWidthField] = useState('100px, 150px');
    const [colsToDeleteField, setColsToDeleteField] = useState('select, status');
    const [isHidden, setIsHidden] = useState(false);

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}
      >
        <Form style={{ maxWidth: '300px', marginRight: '2rem' }}>
          <TextInput
            labelText="Ids of one or more columns"
            id="colsToAddInput"
            value={colsToAddField}
            type="text"
            onChange={(evt) => setColsToAddField(evt.currentTarget.value)}
          />
          <FormGroup legendText="" style={{ marginBottom: '1rem' }}>
            <Checkbox
              labelText="add as hidden column(s)"
              id="isHiddenCheckbox"
              defaultChecked={isHidden}
              onChange={() => setIsHidden(!isHidden)}
            />
          </FormGroup>
          <TextInput
            labelText="The width of the added columns (if any)"
            id="colsToAddWidthInput"
            value={colsToAddWidthField}
            type="text"
            onChange={(evt) => setColsToAddWidthField(evt.currentTarget.value)}
          />
          <Button
            style={{ marginTop: '1rem' }}
            onClick={() => onAdd(colsToAddField, colsToAddWidthField, isHidden)}
          >
            Add
          </Button>
        </Form>
        <div style={{ maxWidth: '50%' }}>
          <div style={{ margin: '1rem' }}>
            <p>COLUMNS prop</p>
            <samp>{JSON.stringify(columns)}</samp>
          </div>
          <div style={{ margin: '1rem' }}>
            <p>ORDERING prop</p>
            <samp>{JSON.stringify(ordering)}</samp>
          </div>
        </div>

        <Form style={{ maxWidth: '300px' }}>
          <TextInput
            labelText="One or more IDs of columns to delete"
            id="removeColInput"
            value={colsToDeleteField}
            type="text"
            onChange={(evt) => setColsToDeleteField(evt.currentTarget.value)}
          />
          <Button
            style={{ marginTop: '1rem' }}
            id="removeColInput"
            onClick={() => onRemove(colsToDeleteField)}
          >
            Remove
          </Button>
        </Form>
      </div>
    );
  };

  const initialColumnsWidth = select(
    'initial column width',
    [undefined, '100px', '300px'],
    '100px'
  );
  const [myColumns, setMyColumns] = useState(
    [
      ...tableColumns.map(({ filter, ...rest }) => rest),
      { id: 'longName', name: 'Testing a really long column name that will occupy a lot of space' },
    ].map((col) => (initialColumnsWidth ? { ...col, width: initialColumnsWidth } : col))
  );
  const [myOrdering, setMyOrdering] = useState([
    ...defaultOrdering,
    { columnId: 'longName', isHidden: false },
  ]);
  const [activeBar, setActiveBar] = useState(null);

  const onAdd = (colIds, colWidths, isHidden) => {
    const colsToAdd = colIds.split(', ');
    const widths = colWidths.split(', ');
    const newColumns = [];
    const newOrdering = [];
    colsToAdd.forEach((colToAddId, index) => {
      newColumns.push({
        id: colToAddId,
        name: colToAddId,
        width: widths[index] || undefined,
      });
      newOrdering.push({ columnId: colToAddId, isHidden });
    });
    setMyColumns([...myColumns, ...newColumns]);
    setMyOrdering([...myOrdering, ...newOrdering]);
  };

  const onRemove = (colIds) => {
    const colsToDelete = colIds.split(', ');
    setMyColumns(myColumns.filter((col) => !colsToDelete.includes(col.id)));
    setMyOrdering(myOrdering.filter((col) => !colsToDelete.includes(col.columnId)));
  };
  const onColumnResize = (cols) => {
    action('onColumnResize')(cols);
    if (selectedTableType === 'Table') {
      setMyColumns(cols);
    }
  };
  const onToggleColumnSelection = () => {
    action('onToggleColumnSelection')();
    if (selectedTableType === 'Table') {
      setActiveBar(activeBar ? undefined : 'column');
    }
  };
  const onChangeOrdering = (ordering) => {
    action('onChangeOrdering')(ordering);
    if (selectedTableType === 'Table') {
      setMyOrdering(ordering);
    }
  };

  return (
    <>
      <ColumnsModifier
        onAdd={onAdd}
        onRemove={onRemove}
        columns={myColumns}
        ordering={myOrdering}
      />
      <div style={{ width: select('table container width', ['auto', '300px', '800px'], '800px') }}>
        <MyTable
          id="table"
          options={{
            hasColumnSelection: boolean(
              'Enables choosing which columns are visible or drag-and-drop reorder them (options.hasColumnSelection)',
              true
            ),
            hasResize: boolean('Enables resizing of column widths (options.hasResize)', true),
            wrapCellText: select(
              'Choose how text should wrap witin columns (options.wrapCellText)',
              selectTextWrapping,
              'always'
            ),
            useAutoTableLayoutForResize: boolean(
              'Removes table-layout:fixed to allow resizable tables (options.useAutoTableLayoutForResize)',
              false
            ),
            preserveColumnWidths: boolean(
              'Preserve column widths when resizing (options.preserveColumnWidths)',
              true
            ),
            hasPagination: true,
          }}
          columns={myColumns}
          size={select(
            'Sets the height of the table rows (size)',
            ['xs', 'sm', 'md', 'lg', 'xl'],
            'lg'
          )}
          view={{
            filters: [],
            table: {
              ordering: myOrdering,
            },
            toolbar: { activeBar },
          }}
          data={tableData}
          actions={{
            ...tableActions,
            table: {
              ...tableActions.table,
              onColumnResize,
              onChangeOrdering,
            },
            toolbar: {
              ...tableActions.toolbar,
              onToggleColumnSelection,
            },
          }}
        />
      </div>
    </>
  );
};

WithOptionsToExploreColumnSettings.storyName = 'with options to explore column settings';
WithOptionsToExploreColumnSettings.decorators = [createElement];
WithOptionsToExploreColumnSettings.parameters = {
  info: {
    source: true,
    propTables: false,
  },
};

export const HorizontalScrollCustomWidth = () => {
  const tableColumnsConcat = [
    { id: 'test2', name: 'Test 2' },
    { id: 'test3', name: 'Test 3' },
    {
      id: 'test4',
      name: 'Test 4',
    },
  ];
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'Table');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;

  // You don't n,eed to use styled components, just pass a className to the Table component and use selectors to find the correct column
  return (
    <div style={{ width: select('table container width', ['auto', '800px'], '800px') }}>
      <MyTable
        id="table"
        columns={tableColumns.concat(tableColumnsConcat)}
        options={{
          hasFilter: select(
            'Enables filtering columns by value (options.hasFilter)',
            ['onKeyPress', 'onEnterAndBlur', true, false],
            'onKeyPress'
          ),
          hasPagination: boolean('Enables pagination for the table (options.hasPagination)', true),
          wrapCellText: select(
            'Choose how text should wrap witin columns (options.wrapCellText)',
            selectTextWrapping,
            'always'
          ),
          hasOnlyPageData: boolean(
            'Change pagination behavior to assume data prop only contains data necessary for the current page (options.hasOnlyPageData)',
            true
          ),
        }}
        data={tableData.slice(25, 45)}
        actions={tableActions}
        size={select(
          'Sets the height of the table rows (size)',
          ['xs', 'sm', 'md', 'lg', 'xl'],
          'lg'
        )}
        view={{
          filters: [
            { columnId: 'string', value: 'whiteboard' },
            { columnId: 'select', value: 'option-B' },
          ],
          toolbar: { activeBar: 'filter' },
          pagination: object(
            'An object representing the pagination props for the table (view.pagination)',
            {
              pageSize: 10,
              pageSizes: [10, 20, 30],
              page: 8267,
              totalItems: 97532,
            }
          ),
        }}
      />
    </div>
  );
};

HorizontalScrollCustomWidth.storyName = 'with horizontal scroll and hasOnlyPageData';

export const FilteredSortedPaginatedTableWithAsynchronousDataSource = () => {
  const apiClient = new MockApiClient(100, number('Fetch Duration (ms)', 500));
  return <AsyncTable fetchData={apiClient.getData} />;
};

FilteredSortedPaginatedTableWithAsynchronousDataSource.storyName = 'with asynchronous data source';

FilteredSortedPaginatedTableWithAsynchronousDataSource.parameters = {
  info: {
    text:
      'This is an example of how to use the <MyTable> component to present data fetched asynchronously from an HTTP API supporting pagination, filtering and sorting. Refer to the source files under /src/components/Table/AsyncTable for details. ',
    source: false,
  },
};

export const AsyncColumnLoading = () => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'Table');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setColumns(tableColumns);
      setData(tableData);
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MyTable
      id="loading-table"
      columns={columns}
      data={data}
      options={{
        hasAggregations: boolean(
          'Aggregates column values and displays in a footer row (options.hasAggregations)',
          true
        ),
        hasSearch: boolean('Enable searching on the table values (options.hasSearch)', true),
        hasFilter: select(
          'Enables filtering columns by value (options.hasFilter)',
          ['onKeyPress', 'onEnterAndBlur', true, false],
          'onKeyPress'
        ),
        hasPagination: boolean('Enables pagination for the table (options.hasPagination)', true),
      }}
      size={select(
        'Sets the height of the table rows (size)',
        ['xs', 'sm', 'md', 'lg', 'xl'],
        'lg'
      )}
      view={{
        aggregations: {
          label: 'Total:',
          columns: [
            {
              id: 'number',
              align: 'start',
              isSortable: false,
            },
          ],
        },
        table: {
          loadingState: {
            isLoading,
            rowCount: number(
              'The number of skeleton rows to be included in the loading state (view.table.loadingState.rowCount)',
              10
            ),
            columnCount: number(
              'The number of skeleton columns to be included in the loading state (view.table.loadingState.columnCount)',
              9
            ),
          },
        },
      }}
    />
  );
};
AsyncColumnLoading.storyName = 'with async column loading';
AsyncColumnLoading.decorators = [createElement];

export const RowExpansionAndLoadMore = () => {
  const TableWithState = () => {
    const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'Table');
    const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
    const [loadingMoreIds, setLoadingMoreIds] = useState([]);

    const [tableDataNested, setTableDataNested] = useState(
      tableData.slice(0, number('number of rows in story', 3)).map((i, idx) => ({
        ...i,
        children:
          idx === 0
            ? [
                getNewRow(idx, 'A'),

                getNewRow(idx, 'B'),

                getNewRow(idx, 'C'),
                {
                  ...getNewRow(idx, 'D'),
                  hasLoadMore: true,
                  children: [getNewRow(0, 'D-1'), getNewRow(0, 'D-2'), getNewRow(0, 'D-3')],
                },
                {
                  ...getNewRow(idx, 'E'),
                  hasLoadMore: true,
                  children: [getNewRow(0, 'E-1'), getNewRow(0, 'E-2'), getNewRow(0, 'E-3')],
                },
              ]
            : undefined,
      }))
    );

    const addDataTimeout = (id) =>
      setTimeout(() => {
        setTableDataNested((prevTable) => {
          const dataUpdated = cloneDeep(prevTable);
          const indexChildren = dataUpdated[0].children.findIndex((i) => i.id === id);
          dataUpdated[0].children[indexChildren] = {
            ...dataUpdated[0].children[indexChildren],
            hasLoadMore: false,
            children: [
              ...dataUpdated[0].children[indexChildren].children,
              getNewRow(0, `${id.split('_').pop()}-4`),
              getNewRow(0, `${id.split('_').pop()}-5`),
              getNewRow(0, `${id.split('_').pop()}-6 `),
            ],
          };
          return dataUpdated;
        });
      }, 2000);

    return (
      <MyTable
        id="my-nested-table"
        columns={tableColumns}
        data={tableDataNested}
        actions={{
          table: {
            onRowLoadMore: (id) => {
              action('onRowLoadMore:', id);
              if (selectedTableType !== 'StatefulTable') {
                setLoadingMoreIds((prev) => [...prev, id]);
              }
              addDataTimeout(id);
            },
          },
        }}
        options={{
          hasRowExpansion: boolean('options.hasRowExpansion', true),
          hasRowNesting: boolean('options.hasRowNesting', true),
        }}
        view={{
          table: {
            expandedIds: [
              tableDataNested[0].id,
              tableDataNested[0].children[3].id,
              tableDataNested[0].children[4].id,
            ],
            loadingMoreIds: selectedTableType !== 'StatefulTable' ? loadingMoreIds : [],
          },
        }}
      />
    );
  };

  return <TableWithState />;
};

RowExpansionAndLoadMore.storyName = 'row expansion: with load more ';
