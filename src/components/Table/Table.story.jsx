import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { select } from '@storybook/addon-knobs';
import styled from 'styled-components';

import { getSortedData } from '../../utils/componentUtilityFunctions';

import Table from './Table';
import StatefulTable from './StatefulTable';

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
export const tableColumns = [
  {
    id: 'string',
    name: 'String this is a max width name okokokokokok',
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
    id: 'number',
    name: 'Number',
    filter: { placeholderText: 'pick a number' },
  },
  {
    id: 'test',
    name: 'Test field',
  },
  {
    id: 'test1',
    name: 'test1',
  },
  {
    id: 'test2',
    name: 'test2',
  },
  {
    id: 'test3',
    name: 'test3',
  },
  {
    id: 'test4',
    name: 'test4',
  },
  // {
  //   id: 'test5',
  //   name: 'test5',
  // },
  // {
  //   id: 'test6',
  //   name: 'test6',
  // },
  // {
  //   id: 'test7',
  //   name: 'test7',
  // },
  // {
  //   id: 'test8',
  //   name: 'test8',
  // },
  // {
  //   id: 'test9',
  //   name: 'test9',
  // },
];
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

const getNewRow = idx => ({
  id: `row-${idx}`,
  values: {
    string: getSentence(idx),
    date: new Date(100000000000 + 1000000000 * idx * idx).toISOString(),
    select: selectData[idx % 3].id,
    secretField: getString(idx, 10),
    number: idx * idx,
  },
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
    tr {
      height: 5rem;
    }
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
            icon: 'arrow--right',
            labelText: 'Drill in',
          }
        : null,
      {
        id: 'Add',
        icon: 'icon--add',
        labelText: 'Add',
        isOverflow: true,
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
    hasRowSelection: true,
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
    },
    toolbar: {
      activeBar: 'filter',
      batchActions: [
        {
          id: 'delete',
          labelText: 'Delete',
          icon: 'delete',
          iconDescription: 'Delete',
        },
      ],
      search: {
        placeHolderText: 'My Search',
      },
    },
  },
};

storiesOf('Table', module)
  .add('Stateful Example', () => <StatefulTable {...initialState} actions={actions} />, {
    info: {
      text:
        'This is an example of the <StatefulTable> component that uses local state to handle all the table actions. This is produced by wrapping the <Table> in a container component and managing the state associated with features such the toolbar, filters, row select, etc. For more robust documentation on the prop model and source, see the other "with function" stories.',
      propTables: [Table],
      propTablesExclude: [StatefulTable],
    },
  })
  .add('default', () => <Table columns={tableColumns} data={tableData} actions={actions} />)
  .add('with simple search', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      options={{ hasSearch: true }}
    />
  ))
  .add('with selection and batch actions', () => (
    // TODO - batch action bar
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      options={{
        hasFilter: true,
        hasPagination: true,
        hasRowSelection: true,
      }}
      view={{
        filters: [],
        toolbar: {
          batchActions: [
            {
              id: 'delete',
              labelText: 'Delete',
              icon: 'delete',
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
  .add('with row expansion and actions', () => (
    <Table
      columns={tableColumns}
      data={tableData.map((i, idx) => ({
        ...i,
        rowActions: [
          idx % 4 === 0
            ? {
                id: 'drilldown',
                icon: 'arrow--right',
                labelText: 'See more',
              }
            : null,
          {
            id: 'add',
            icon: 'icon--add',
            labelText: 'Add',
            isOverflow: true,
          },
          {
            id: 'delete',
            icon: 'icon--delete',
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
        },
      }}
    />
  ))
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
        hasRowSelection: true,
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
          hasRowSelection: true,
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
        hasRowSelection: true,
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
  .add('is loading', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      view={{
        table: {
          ordering: defaultOrdering,
          loadingState: {
            isLoading: true,
          },
        },
      }}
    />
  ))
  .add('zebra', () => <Table zebra columns={tableColumns} data={tableData} actions={actions} />)
  .add(
    'max column width',
    () => {
      const StyledTableColumn = styled(Table)`
        &&& {
          [data-column='string'] {
            width: 100px;
            max-width: 100px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow-x: hidden;
          }
          [data-column='date'] {
            max-width: 100px;
            width: 100px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow-x: hidden;
          }
        }
      `;

      return (
        // You don't need to use styled components, just pass a className to the Table component and use selectors to find the correct column
        <Table
          columns={tableColumns}
          options={{ hasFilter: true }}
          data={tableData}
          actions={actions}
          maxWidth={100}
          // view={{
          //   filters: [
          //     {
          //       columnId: 'string',
          //       value: 'whiteboard',
          //     },
          //     {
          //       columnId: 'select',
          //       value: 'option-B',
          //     },
          //   ],
          //   toolbar: {
          //     activeBar: select('activeBar', ['filter', 'column'], 'filter'),
          //   },
          // }}
        />
      );
    },
    {
      info: {
        source: false,
        text: `This is an example of the <Table> component that has a max column width. Pass a custom className prop to the Table component and use a css selector to identify the correct column. In the example below, the column id we're setting max-width for is called 'string'.
          
        <Table className="my-custom-classname"/>
          
        .my-custom-classname [data-column='string'] { 
          width: 100px; 
          max-width: 100px;
          white-space: nowrap;
          text-overflow: ellipsis; 
          overflow-x: hidden; 
        }`,
        propTables: false,
      },
    }
  )
  .add(
    'custom row height',
    () => (
      // You don't need to use styled components, just pass a className to the Table component and use selectors to find the correct column
      <StyledTableCustomRowHeight columns={tableColumns} data={tableData} actions={actions} />
    ),
    {
      info: {
        source: false,
        text: `This is an example of the <Table> component that has a custom row height. Pass a custom className prop to the Table component and use a css selector to change the height of all the rows.
          
        <Table className="my-custom-classname"/>
          
        .my-custom-classname tr { 
          height: 5rem;
        }`,
        propTables: false,
      },
    }
  );
