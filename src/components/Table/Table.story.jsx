import React from 'react';
// import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, text, number, select, array } from '@storybook/addon-knobs';
import styled from 'styled-components';
import Arrow from '@carbon/icons-react/lib/arrow--right/20';
import Add from '@carbon/icons-react/lib/add/20';
import Delete from '@carbon/icons-react/lib/delete/16';

import { getSortedData, csvDownloadHandler } from '../../utils/componentUtilityFunctions';
import FullWidthWrapper from '../../internal/FullWidthWrapper';

import Table from './Table';
import StatefulTable from './StatefulTable';
import AsyncTable from './AsyncTable/AsyncTable';
import MockApiClient from './AsyncTable/MockApiClient';

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
];

const STATUS = {
  RUNNING: 'RUNNING',
  NOT_RUNNING: 'NOT_RUNNING',
  BROKEN: 'BROKEN',
};

const renderStatusIcon = ({ value: status }) => {
  switch (status) {
    case STATUS.RUNNING:
    default:
      return (
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="3" stroke="none" strokeWidth="1" fill="green" />
        </svg>
      );
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
  }
};
export const tableColumns = [
  {
    id: 'string',
    name: 'String',
    filter: { placeholderText: 'pick a string' },
  },
  {
    id: 'date',
    name: 'Date',
    filter: { placeholderText: 'pick a date' },
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
  },
  {
    id: 'number',
    name: 'Number',
    filter: { placeholderText: 'pick a number' },
  },
];

export const tableColumnsWithAlignment = [
  {
    id: 'string',
    name: 'String',
    filter: { placeholderText: 'pick a string' },
    align: 'start',
    isSortable: true,
  },
  {
    id: 'date',
    name: 'Date',
    filter: { placeholderText: 'pick a date' },
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
    filter: { placeholderText: 'pick a number' },
    align: 'end',
    isSortable: true,
  },
];

export const tableColumnsFixedWidth = tableColumns.map(i => ({
  ...i,
  width:
    i.id === 'string'
      ? '300px'
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
      : undefined,
}));

const defaultOrdering = tableColumns.map(c => ({
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
const getLetter = index =>
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(index % 62);
const getWord = (index, step = 1) => words[(step * index) % words.length];
const getSentence = index =>
  `${getWord(index, 1)} ${getWord(index, 2)} ${getWord(index, 3)} ${index}`;
const getString = (index, length) =>
  Array(length)
    .fill(0)
    .map((i, idx) => getLetter(index * (idx + 14) * (idx + 1)))
    .join('');

const getStatus = idx => {
  const modStatus = idx % 3;
  switch (modStatus) {
    case 0:
    default:
      return STATUS.RUNNING;
    case 1:
      return STATUS.NOT_RUNNING;
    case 2:
      return STATUS.BROKEN;
  }
};

const getNewRow = (idx, suffix = '', withActions = false) => ({
  id: `row-${idx}${suffix ? `_${suffix}` : ''}`,
  values: {
    string: getSentence(idx) + suffix,
    date: new Date(100000000000 + 1000000000 * idx * idx).toISOString(),
    select: selectData[idx % 3].id,
    secretField: getString(idx, 10) + suffix,
    number: idx * idx,
    status: getStatus(idx),
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

const tableData = Array(100)
  .fill(0)
  .map((i, idx) => getNewRow(idx));

/** Sample expanded row component */
const RowExpansionContent = ({ rowId }) => (
  <div key={`${rowId}-expansion`} style={{ padding: 20 }}>
    <h3 key={`${rowId}-title`}>{rowId}</h3>
    <ul style={{ lineHeight: '22px' }}>
      {Object.entries(tableData.find(i => i.id === rowId).values).map(([key, value]) => (
        <li key={`${rowId}-${key}`}>
          <b>{key}</b>: {value}
        </li>
      ))}
    </ul>
  </div>
);

const StyledTableCustomRowHeight = styled(Table)`
  &&& {
    & tr {
      height: 5rem;
    }
  }
`;

const StyledCustomToolbarContent = styled.div`
  &&& {
    align-items: center;
    display: flex;
    padding: 0 1rem;
  }
`;

const actions = {
  pagination: {
    /** Specify a callback for when the current page or page size is changed. This callback is passed an object parameter containing the current page and the current page size */
    onChangePage: action('onChangePage'),
  },
  toolbar: {
    onApplyFilter: action('onApplyFilter'),
    onToggleFilter: action('onToggleFilter'),
    onToggleColumnSelection: action('onToggleColumnSelection'),
    /** Specify a callback for when the user clicks toolbar button to clear all filters. Recieves a parameter of the current filter values for each column */
    onClearAllFilters: action('onClearAllFilters'),
    onCancelBatchAction: action('onCancelBatchAction'),
    onApplyBatchAction: action('onApplyBatchAction'),
    onApplySearch: action('onApplySearch'),
  },
  table: {
    onRowClicked: action('onRowClicked'),
    onRowSelected: action('onRowSelected'),
    onSelectAll: action('onSelectAll'),
    onEmptyStateAction: action('onEmptyStateAction'),
    onApplyRowAction: action('onApplyRowAction'),
    onRowExpanded: action('onRowExpanded'),
    onChangeOrdering: action('onChangeOrdering'),
    onChangeSort: action('onChangeSort'),
  },
};
// const exampletext = (
//   <div>
//     <p>This is text</p>
//     <Add />
//   </div>
// );
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
            labelText: 'Drill in',
          }
        : null,
      {
        id: 'Add',
        renderIcon: Add,
        iconDescription: 'Add',
        labelText: 'Add',
        isOverflow: true,
      },
      {
        id: 'delete',
        renderIcon: Delete,
        labelText: 'Delete',
        isOverflow: true,
        iconDescription: 'Delete',
      },
    ].filter(i => i),
  })),
  expandedData: tableData.map(data => ({
    rowId: data.id,
    content: <RowExpansionContent rowId={data.id} />,
  })),
  options: {
    hasFilter: true,
    hasSearch: true,
    hasPagination: true,
    hasRowSelection: 'multi',
    hasRowExpansion: true,
    hasRowActions: true,
    hasColumnSelection: true,
    shouldExpandOnRowClick: false,
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
      totalItems: tableData.length,
    },
    table: {
      isSelectAllSelected: false,
      selectedIds: [],
      sort: undefined,
      ordering: tableColumns.map(({ id }) => ({
        columnId: id,
        isHidden: id === 'secretField',
      })),
      expandedIds: [],
      rowActions: [],
    },
    toolbar: {
      activeBar: 'filter',
      batchActions: [
        {
          id: 'delete',
          labelText: 'Delete',
          renderIcon: Delete,
          iconDescription: 'Delete',
        },
      ],
    },
  },
};

storiesOf('Watson IoT|Table', module)
  .add(
    'Simple Stateful Example',
    () => (
      <FullWidthWrapper>
        <StatefulTable
          {...initialState}
          actions={actions}
          lightweight={boolean('lightweight', false)}
          options={{
            hasRowSelection: select('hasRowSelection', ['multi', 'single'], 'multi'),
            hasRowExpansion: false,
          }}
          view={{ table: { selectedIds: array('selectedIds', []) } }}
        />
      </FullWidthWrapper>
    ),
    {
      info: {
        text:
          'This is an example of the <StatefulTable> component that uses local state to handle all the table actions. This is produced by wrapping the <Table> in a container component and managing the state associated with features such the toolbar, filters, row select, etc. For more robust documentation on the prop model and source, see the other "with function" stories.',
        propTables: [Table],
        propTablesExclude: [StatefulTable],
      },
    }
  )
  .add(
    'Simple Stateful Example with alignment',
    () => (
      <FullWidthWrapper>
        <StatefulTable
          {...initialState}
          columns={tableColumnsWithAlignment}
          actions={actions}
          lightweight={boolean('lightweight', false)}
          options={{
            hasRowSelection: select('hasRowSelection', ['multi', 'single'], 'multi'),
            hasRowExpansion: false,
          }}
          view={{ table: { selectedIds: array('selectedIds', []) } }}
        />
      </FullWidthWrapper>
    ),
    {
      info: {
        text:
          'This is an example of the <StatefulTable> component that uses local state to handle all the table actions. This is produced by wrapping the <Table> in a container component and managing the state associated with features such the toolbar, filters, row select, etc. For more robust documentation on the prop model and source, see the other "with function" stories.',
        propTables: [Table],
        propTablesExclude: [StatefulTable],
      },
    }
  )
  .add('Stateful Example with Row Count', () => (
    <FullWidthWrapper>
      <StatefulTable
        {...initialState}
        options={{
          hasSearch: boolean('Show Search', true),
          hasPagination: boolean('Show Pagination', true),
          hasRowSelection: 'multi',
          hasFilter: boolean('Show Filter', true),
          hasRowActions: boolean('Show Row Action', true),
          hasRowCountInHeader: boolean('Show Row Count', true),
        }}
        view={{
          toolbar: { activeBar: null },
        }}
        i18n={{
          rowCountInHeader: totalRowCount =>
            `${text('Row Count Label', 'Results')}: ${totalRowCount}`,
        }}
      />
    </FullWidthWrapper>
  ))
  .add(
    'Stateful Example with every third row unselectable',
    () => (
      <StatefulTable
        {...initialState}
        data={initialState.data.map((eachRow, index) => ({
          ...eachRow,
          isSelectable: index % 3 !== 0,
        }))}
        actions={actions}
        lightweight={boolean('lightweight', false)}
        options={{
          hasRowSelection: select('hasRowSelection', ['multi', 'single'], 'multi'),
          hasRowExpansion: false,
        }}
        view={{ table: { selectedIds: array('selectedIds', []) } }}
      />
    ),
    {
      info: {
        text:
          'This is an example of the <StatefulTable> component that uses local state to handle all the table actions. This is produced by wrapping the <Table> in a container component and managing the state associated with features such the toolbar, filters, row select, etc. For more robust documentation on the prop model and source, see the other "with function" stories.',
        propTables: [Table],
        propTablesExclude: [StatefulTable],
      },
    }
  )
  .add(
    'Stateful Example with expansion',
    () => (
      <FullWidthWrapper>
        <StatefulTable
          {...initialState}
          actions={{
            ...actions,
            toolbar: { ...actions.toolbar, onDownloadCSV: csvDownloadHandler },
          }}
          isSortable
          lightweight={boolean('lightweight', false)}
        />
      </FullWidthWrapper>
    ),
    {
      info: {
        text: `

        This table has expanded rows.  To support expanded rows, make sure to pass the expandedData prop to the table and set options.hasRowExpansion=true.

        <br />

        ~~~js
        expandedData={[
          {rowId: 'row-0',content: <RowExpansionContent />},
          {rowId: 'row-1',content: <RowExpansionContent />},
          {rowId: 'row-2',content: <RowExpansionContent />},
          …
        ]}

        options = {
          hasRowExpansion:true
        }

        ~~~

        <br />

        `,
        propTables: [Table],
        propTablesExclude: [StatefulTable],
      },
    }
  )
  .add(
    'Stateful Example with row nesting',
    () => {
      const tableData = initialState.data.map((i, idx) => ({
        ...i,
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
      }));
      return (
        <div>
          <StatefulTable
            {...initialState}
            columns={tableColumnsFixedWidth}
            data={tableData}
            options={{
              ...initialState.options,
              hasRowNesting: true,
              hasFilter: true,
            }}
            view={{
              ...initialState.view,
              filters: [],
              toolbar: {
                activeBar: null,
              },
            }}
            actions={actions}
            lightweight={boolean('lightweight', false)}
          />
        </div>
      );
    },
    {
      info: {
        text: `

        This stateful table has nested rows.  To setup your table this way you must pass a children prop along with each of your data rows.

        <br />

        ~~~js
        data=[
          {
            id: 'rowid',
            values: {
              col1: 'value1
            },
            children: [
              {
                id: 'child-rowid,
                values: {
                  col1: 'nested-value1'
                }
              }
            ]
          }
        ]
        ~~~

        <br />

        You must also set hasRowExpansion to true in your table options

        <br />

        ~~~js
          options={
            hasRowExpansion: true
          }
        ~~~

        <br />

        `,
        propTables: [Table],
        propTablesExclude: [StatefulTable],
      },
    }
  )
  .add(
    'basic `dumb` table',
    () => <Table columns={tableColumns} data={tableData} actions={actions} />,
    {
      info: {
        text: `

        For basic table support, you can render the functional <Table/> component with only the columns and data props.  This table does not have any state management built in.  If you want that, use the <StatefulTable/> component or you will need to implement your own listeners and state management.  You can reuse our tableReducer and tableActions with the useReducer hook to update state.

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
    }
  )
  .add(
    'with simple search',
    () => (
      <Table
        columns={tableColumns}
        data={tableData}
        actions={actions}
        options={{ hasSearch: true }}
      />
    ),
    {
      info: {
        text: `To enable simple search on a table, simply set the prop options.hasSearch=true.  We wouldn't recommend enabling column filters on a table and simple search for UX reasons, but it is supported.`,
      },
    }
  )
  .add(
    'minitable',
    () => (
      <StatefulTable
        style={{ maxWidth: '300px' }}
        columns={tableColumns.slice(0, 2)}
        data={tableData}
        actions={actions}
        options={{ hasSearch: true, hasPagination: true, hasRowSelection: 'single' }}
      />
    ),
    {
      info: {
        text: `The table will automatically adjust to narrow mode if you set a style or class that makes max-width smaller than 600 pixels (which is the width needed to render the full pagination controls) `,
      },
    }
  )
  .add('with multi select and batch actions', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      options={{
        hasFilter: true,
        hasPagination: true,
        hasRowSelection: 'multi',
      }}
      view={{
        filters: [],
        toolbar: {
          batchActions: [
            {
              id: 'delete',
              labelText: 'Delete',
              renderIcon: Delete,
              iconDescription: 'Delete Item',
            },
          ],
        },
        table: {
          ordering: defaultOrdering,
          isSelectAllSelected: false,
          isSelectAllIndeterminate: true,
          selectedIds: ['row-3', 'row-4', 'row-6', 'row-7'],
        },
      }}
    />
  ))
  .add('with single select', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      options={{ hasRowSelection: 'single' }}
      view={{ table: { selectedIds: ['row-3'] } }}
    />
  ))
  .add('with single select and nested table rows ', () => (
    <Table
      columns={tableColumns}
      data={tableData.map((i, idx) => ({
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
      options={{
        hasPagination: true,
        hasRowSelection: 'single',
        hasRowExpansion: true,
        hasRowNesting: true,
      }}
      actions={actions}
      view={{
        table: {
          expandedIds: ['row-3', 'row-7', 'row-7_B'],
          selectedIds: ['row-3_A'],
        },
      }}
    />
  ))
  .add('with row expansion', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      options={{
        hasRowExpansion: true,
      }}
      view={{
        filters: [],
        table: {
          ordering: defaultOrdering,
          expandedRows: [
            {
              rowId: 'row-2',
              content: <RowExpansionContent rowId="row-2" />,
            },
            {
              rowId: 'row-5',
              content: <RowExpansionContent rowId="row-5" />,
            },
          ],
        },
      }}
    />
  ))
  .add('with row expansion and on row click expands', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      options={{
        hasRowExpansion: true,
        shouldExpandOnRowClick: true,
      }}
      view={{
        filters: [],
        table: {
          ordering: defaultOrdering,
          expandedRows: [
            {
              rowId: 'row-2',
              content: <RowExpansionContent rowId="row-2" />,
            },
            {
              rowId: 'row-5',
              content: <RowExpansionContent rowId="row-5" />,
            },
          ],
        },
      }}
    />
  ))
  .add(
    'with row expansion and actions',
    () => (
      <Table
        columns={tableColumns}
        data={tableData.map((i, idx) => ({
          ...i,
          rowActions: [
            idx % 4 === 0
              ? {
                  id: 'drilldown',
                  renderIcon: Arrow,
                  iconDescription: 'See more',
                  labelText: 'See more',
                }
              : null,
            {
              id: 'add',
              renderIcon: Add,
              iconDescription: 'Add',
              labelText: 'Add',
              isOverflow: true,
            },
            {
              id: 'delete',
              renderIcon: Delete,
              iconDescription: 'Delete',
              labelText: 'Delete',
              isOverflow: true,
            },
          ].filter(i => i),
        }))}
        actions={actions}
        options={{
          hasRowExpansion: true,
          hasRowActions: true,
        }}
        view={{
          filters: [],
          table: {
            ordering: defaultOrdering,
            expandedRows: [
              {
                rowId: 'row-2',
                content: <RowExpansionContent rowId="row-2" />,
              },
              {
                rowId: 'row-5',
                content: <RowExpansionContent rowId="row-5" />,
              },
            ],
            rowActions: [
              {
                rowId: 'row-1',
                isRunning: true,
              },
              {
                rowId: 'row-3',
                error: { title: 'Import failed', message: 'Contact your administrator' },
              },
            ],
          },
        }}
      />
    ),
    {
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
    }
  )
  .add('with sorting', () => (
    <Table
      columns={tableColumns.map((i, idx) => ({
        ...i,
        isSortable: idx !== 1,
      }))}
      data={getSortedData(tableData, 'string', 'ASC')}
      actions={actions}
      options={{
        hasFilter: false,
        hasPagination: true,
        hasRowSelection: 'multi',
      }}
      view={{
        filters: [],
        table: {
          ordering: defaultOrdering,
          sort: {
            columnId: 'string',
            direction: 'ASC',
          },
        },
      }}
    />
  ))
  .add(
    'with custom cell renderer',
    () => {
      const renderDataFunction = ({ value }) => <div style={{ color: 'red' }}>{value}</div>;
      return (
        <Table
          columns={tableColumns.map(i => ({
            ...i,
            renderDataFunction,
          }))}
          data={tableData}
          actions={actions}
          options={{
            hasFilter: true,
            hasPagination: true,
            hasRowSelection: 'multi',
          }}
          view={{
            filters: [],
            table: {
              ordering: defaultOrdering,
              sort: {
                columnId: 'string',
                direction: 'ASC',
              },
            },
          }}
        />
      );
    },
    {
      info: {
        text: `To render a custom widget in a table cell, pass a renderDataFunction prop along with your column metadata.

        <br />

        ~~~js
            The renderDataFunction is called with this payload
           {
              value: PropTypes.any (current cell value),
              columnId: PropTypes.string,
              rowId: PropTypes.string,
              row: the full data for this rowPropTypes.object like this {col: value, col2: value}
           }
        ~~~

        <br />
          `,
      },
    }
  )
  .add('with filters', () => {
    const filteredData = tableData.filter(({ values }) =>
      // return false if a value doesn't match a valid filter
      [
        {
          columnId: 'string',
          value: 'whiteboard',
        },
        {
          columnId: 'select',
          value: 'option-B',
        },
      ].reduce(
        (acc, { columnId, value }) => acc && values[columnId].toString().includes(value),
        true
      )
    );
    return (
      <Table
        columns={tableColumns}
        data={filteredData}
        actions={actions}
        options={{
          hasFilter: true,
          hasPagination: true,
          hasRowSelection: 'multi',
        }}
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
          pagination: {
            totalItems: filteredData.length,
          },
          toolbar: {
            activeBar: 'filter',
          },
          table: {
            ordering: defaultOrdering,
          },
        }}
      />
    );
  })
  .add('with customized columns', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      options={{
        hasPagination: true,
        hasRowSelection: 'multi',
        hasColumnSelection: true,
      }}
      view={{
        toolbar: {
          activeBar: 'column',
        },
        table: {
          ordering: defaultOrdering,
        },
      }}
    />
  ))
  .add('with no results', () => (
    <Table
      columns={tableColumns}
      data={[]}
      actions={actions}
      view={{
        filters: [
          {
            columnId: 'string',
            value: 'something not matching',
          },
        ],
        toolbar: {
          activeBar: 'filter',
        },
        table: {
          ordering: defaultOrdering,
        },
      }}
      options={{ hasFilter: true, hasPagination: true }}
    />
  ))
  .add('with no data', () => (
    <Table
      columns={tableColumns}
      data={[]}
      actions={actions}
      view={{
        table: {
          ordering: defaultOrdering,
        },
      }}
      options={{ hasPagination: true }}
    />
  ))
  .add('with nested table rows', () => (
    <Table
      columns={tableColumns}
      data={tableData.map((i, idx) => ({
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
      options={{
        hasPagination: true,
        hasRowSelection: 'multi',
        hasRowExpansion: true,
        hasRowNesting: true,
      }}
      actions={actions}
      view={{
        table: {
          expandedIds: ['row-3', 'row-7', 'row-7_B'],
        },
      }}
    />
  ))
  .add('with no data and custom empty state', () => (
    <Table
      columns={tableColumns}
      data={[]}
      actions={actions}
      view={{
        table: {
          ordering: defaultOrdering,
          emptyState: (
            <div key="empty-state">
              <h1 key="empty-state-heading">Custom empty state</h1>
              <p key="empty-state-message">Hey, no data!</p>
            </div>
          ),
        },
      }}
      options={{ hasPagination: true }}
    />
  ))
  .add('with loading state', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      view={{
        table: {
          ordering: defaultOrdering,
          loadingState: {
            isLoading: true,
            rowCount: 7,
          },
        },
      }}
    />
  ))
  .add('with zebra striping', () => (
    <Table useZebraStyles columns={tableColumns} data={tableData} actions={actions} />
  ))
  .add(
    'with fixed column width',
    () => (
      // You don't need to use styled components, just pass a className to the Table component and use selectors to find the correct column
      <FullWidthWrapper>
        <Table
          columns={tableColumns.map((i, idx) => ({
            width: idx % 2 === 0 ? '20rem' : '10rem',
            ...i,
          }))}
          data={tableData}
          actions={actions}
        />
      </FullWidthWrapper>
    ),
    {
      info: {
        source: true,
        propTables: false,
      },
    }
  )
  .add(
    'with custom row height',
    () => (
      // You don't need to use styled components, just pass a className to the Table component and use selectors to find the correct column
      <FullWidthWrapper>
        <StyledTableCustomRowHeight columns={tableColumns} data={tableData} actions={actions} />
      </FullWidthWrapper>
    ),
    {
      info: {
        source: false,
        text: `This is an example of the <Table> component that has a custom row height. Pass a custom className prop to the Table component and use a css selector to change the height of all the rows.
        `,
        propTables: false,
      },
    }
  )
  .add('with lightweight design', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      options={{ hasPagination: true }}
      actions={actions}
      lightweight={boolean('lightweight', true)}
    />
  ))
  .add(
    'with hasOnlyPageData',
    () => {
      return (
        <Table
          columns={tableColumns}
          options={{ hasOnlyPageData: true, hasPagination: true }}
          data={tableData.slice(25, 35)} // this isn't the "8267th page", but we just want to indicate that it is not the first page of data
          actions={actions}
          view={{
            pagination: {
              pageSize: 10,
              pageSizes: [10, 20, 30],
              page: 8267,
              totalItems: 97532,
            },
          }}
        />
      );
    },
    {
      info: {
        text:
          'By default, tables with pagination will expect the entire table data to be passed in on the `data` prop; the visible data for a page is calculated dynamically by the table based on the page size and page number.  In the case where the table is rendering a large data set, the `options.hasOnlyPageData` prop can be used change this behavior.  With `options.hasOnlyPageData = true`, the `data` prop will be expected to contain only the rows for the visible page.',
        source: true,
      },
    }
  )
  .add('horizontal scroll - custom width', () => {
    const tableColumnsConcat = [
      { id: 'test2', name: 'Test 2' },
      { id: 'test3', name: 'Test 3' },
      {
        id: 'test4',
        name: 'Test 4',
      },
    ];
    // You don't n,eed to use styled components, just pass a className to the Table component and use selectors to find the correct column
    return (
      <div style={{ width: '800px' }}>
        <Table
          columns={tableColumns.concat(tableColumnsConcat)}
          options={{ hasFilter: true, hasPagination: true }}
          data={tableData}
          actions={actions}
          view={{
            filters: [
              { columnId: 'string', value: 'whiteboard' },
              { columnId: 'select', value: 'option-B' },
            ],
            toolbar: { activeBar: 'filter' },
          }}
        />
      </div>
    );
  })
  .add('horizontal scroll - full width', () => {
    const tableColumnsConcat = [
      { id: 'test2', name: 'Test 2' },
      { id: 'test3', name: 'Test 3' },
      {
        id: 'test4',
        name: 'Test 4',
      },
    ];
    // You don't n,eed to use styled components, just pass a className to the Table component and use selectors to find the correct column
    return (
      <Table
        columns={tableColumns.concat(tableColumnsConcat)}
        options={{ hasFilter: true, hasPagination: true }}
        data={tableData}
        actions={actions}
        view={{
          filters: [
            { columnId: 'string', value: 'whiteboard' },
            { columnId: 'select', value: 'option-B' },
          ],
          toolbar: { activeBar: 'filter' },
        }}
      />
    );
  })
  .add(
    'Filtered/Sorted/Paginated table with asynchronous data source',
    () => {
      const apiClient = new MockApiClient(100, number('Fetch Duration (ms)', 500));
      return <AsyncTable fetchData={apiClient.getData} />;
    },
    {
      info: {
        text:
          'This is an example of how to use the <Table> component to present data fetched asynchronously from an HTTP API supporting pagination, filtering and sorting. Refer to the source files under /src/components/Table/AsyncTable for details. ',
        source: false,
      },
    }
  )
  .add('Custom toolbar content', () => (
    <Table
      columns={tableColumns}
      options={{ hasFilter: true, hasPagination: true }}
      data={tableData}
      actions={actions}
      view={{
        filters: [
          { columnId: 'string', value: 'whiteboard' },
          { columnId: 'select', value: 'option-B' },
        ],
        toolbar: {
          activeBar: 'filter',
          customToolbarContent: <StyledCustomToolbarContent>my custom</StyledCustomToolbarContent>,
        },
      }}
    />
  ))
  .add(
    'Stateful Example with I18N strings',
    () => (
      <StatefulTable
        {...initialState}
        actions={actions}
        options={{
          hasRowActions: true,
        }}
        view={{
          filters: [],
          table: {
            rowActions: [
              {
                rowId: 'row-1',
                isRunning: true,
              },
              {
                rowId: 'row-3',
                error: { title: 'Import failed', message: 'Contact your administrator' },
              },
            ],
          },
        }}
        i18n={{
          /** pagination */
          pageBackwardAria: text('i18n.pageBackwardAria', '__Previous page__'),
          pageForwardAria: text('i18n.pageForwardAria', '__Next page__'),
          pageNumberAria: text('i18n.pageNumberAria', '__Page Number__'),
          itemsPerPage: text('i18n.itemsPerPage', '__Items per page:__'),
          itemsRange: (min, max) => `__${min}–${max} items__`,
          currentPage: page => `__page ${page}__`,
          itemsRangeWithTotal: (min, max, total) => `__${min}–${max} of ${total} items__`,
          pageRange: (current, total) => `__${current} of ${total} pages__`,
          /** table body */
          overflowMenuAria: text('i18n.overflowMenuAria', '__More actions__'),
          clickToExpandAria: text('i18n.clickToExpandAria', '__Click to expand content__'),
          clickToCollapseAria: text('i18n.clickToCollapseAria', '__Click to collapse content__'),
          selectAllAria: text('i18n.selectAllAria', '__Select all items__'),
          selectRowAria: text('i18n.selectRowAria', '__Select row__'),
          /** toolbar */
          clearAllFilters: text('i18n.clearAllFilters', '__Clear all filters__'),
          searchLabel: text('i18n.searchLabel', '__Search__'),
          searchPlaceholder: text('i18n.searchPlaceholder', '__Search__'),
          columnSelectionButtonAria: text('i18n.columnSelectionButtonAria', '__Column Selection__'),
          filterButtonAria: text('i18n.filterButtonAria', '__Filters__'),
          clearFilterAria: text('i18n.clearFilterAria', '__Clear filter__'),
          filterAria: text('i18n.filterAria', '__Filter__'),
          openMenuAria: text('i18n.openMenuAria', '__Open menu__'),
          closeMenuAria: text('i18n.closeMenuAria', '__Close menu__'),
          clearSelectionAria: text('i18n.clearSelectionAria', '__Clear selection__'),
          batchCancel: text('i18n.batchCancel', '__Cancel__'),
          itemsSelected: text('i18n.itemsSelected', '__items selected__'),
          itemSelected: text('i18n.itemSelected', '__item selected__'),
          filterNone: text('i18n.filterNone', '__filterNone__'),
          filterAscending: text('i18n.filterAscending', '__filterAscending__'),
          filterDescending: text('i18n.filterDescending', '__filterDescending__'),
          /** empty state */
          emptyMessage: text('i18n.emptyMessage', '__There is no data__'),
          emptyMessageWithFilters: text(
            'i18n.emptyMessageWithFilters',
            '__No results match the current filters__'
          ),
          emptyButtonLabel: text('i18n.emptyButtonLabel', '__Create some data__'),
          emptyButtonLabelWithFilters: text('i18n.emptyButtonLabel', '__Clear all filters__'),
          inProgressText: text('i18n.inProgressText', '__In Progress__'),
          actionFailedText: text('i18n.actionFailedText', '__Action Failed__'),
          learnMoreText: text('i18n.learnMoreText', '__Learn More__'),
          dismissText: text('i18n.dismissText', '__Dismiss__'),
        }}
      />
    ),
    {
      info: {
        text: `

        By default the table shows all of its internal strings in English.  If you want to support multiple languages, you must populate these i18n keys with the appropriate label for the selected UI language.

        <br />

        ~~~js
          i18n={

            /** pagination */
            pageBackwardAria,
            pageForwardAria,
            pageNumberAria,
            itemsPerPage,
            itemsRange,
            currentPage,
            itemsRangeWithTotal,
            pageRange,

            /** table body */
            overflowMenuAria,
            clickToExpandAria,
            clickToCollapseAria,
            selectAllAria,
            selectRowAria,

            /** toolbar */
            clearAllFilters,
            searchPlaceholder,
            columnSelectionButtonAria,
            filterButtonAria,
            clearFilterAria,
            filterAria,
            openMenuAria,
            closeMenuAria,
            clearSelectionAria,

            /** empty state */
            emptyMessage,
            emptyMessageWithFilters,
            emptyButtonLabel,
            emptyButtonLabelWithFilters,
            inProgressText,
            actionFailedText,
            learnMoreText,
            dismissText,
          }
        ~~~

        <br />

        `,
        propTables: [Table],
        propTablesExclude: [StatefulTable],
      },
    }
  );
