import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import update from 'immutability-helper';

import { getSortedData } from '../../utils/componentUtilityFunctions';

import Table from './Table';

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
const tableColumns = [
  {
    id: 'string',
    name: 'String',
    size: 1,
    filter: { placeholderText: 'pick a string' },
  },
  {
    id: 'date',
    name: 'Date',
    size: 1,
    filter: { placeholderText: 'pick a date' },
  },
  {
    id: 'select',
    name: 'Select',
    size: 1,
    filter: { placeholderText: 'pick an option', options: selectData },
  },
  {
    id: 'number',
    name: 'Number',
    size: 1,
    filter: { placeholderText: 'pick a number' },
  },
];

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
const getWord = (index, step = 1) => words[(step * index) % words.length];
const getSentence = index =>
  `${getWord(index, 1)} ${getWord(index, 2)} ${getWord(index, 3)} ${index}`;

const tableData = Array(100)
  .fill(0)
  .map((i, idx) => ({
    id: `row-${idx}`,
    values: {
      string: getSentence(idx),
      date: new Date(100000000000 + 1000000000 * idx * idx).toISOString(),
      select: selectData[idx % 3].id,
      number: idx * idx,
    },
  }));

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

const actions = {
  pagination: {
    /** Specify a callback for when the current page or page size is changed. This callback is passed an object parameter containing the current page and the current page size */
    onChange: action('onChange'),
  },
  toolbar: {
    onApplyFilter: action('onApplyFilter'),
    onToggleFilter: action('onToggleFilter'),
    /** Specify a callback for when the user clicks toolbar button to clear all filters. Recieves a parameter of the current filter values for each column */
    onClearAllFilters: action('onClearAllFilters'),
  },
  table: {
    onRowSelected: action('onRowSelected'),
    onSelectAll: action('onSelectAll'),
  },
};

class StatefulTableWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: tableColumns.map((i, idx) => ({
        ...i,
        isSortable: idx !== 1,
      })),
      data: tableData,
      options: {
        hasFilter: true,
        hasPagination: true,
        hasRowSelection: true,
        hasRowExpansion: true,
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
          expandedRows: [],
        },
        toolbar: {
          activeBar: 'filter',
        },
      },
    };
  }

  render = () => {
    const {
      columns,
      data,
      options,
      view,
      view: {
        table: { sort },
      },
    } = this.state;
    const filteredData = data.filter(({ values }) =>
      // return false if a value doesn't match a valid filter
      view.filters.reduce(
        (acc, { columnId, value }) => acc && values[columnId].toString().includes(value),
        true
      )
    );

    const actions = {
      pagination: {
        onChange: paginationValues => {
          this.setState(state =>
            update(state, {
              view: {
                pagination: {
                  $merge: paginationValues,
                },
              },
            })
          );
        },
      },
      toolbar: {
        onApplyFilter: filterValues => {
          const newFilters = Object.entries(filterValues)
            .map(([key, value]) =>
              value !== ''
                ? {
                    columnId: key,
                    value,
                  }
                : null
            )
            .filter(i => i);
          this.setState(state =>
            update(state, {
              view: {
                filters: {
                  $set: newFilters,
                },
              },
            })
          );
        },
        onToggleFilter: () => {
          this.setState(state => {
            const filterToggled = state.view.toolbar.activeBar === 'filter' ? null : 'filter';
            return update(state, {
              view: {
                toolbar: {
                  activeBar: {
                    $set: filterToggled,
                  },
                },
              },
            });
          });
        },
        onClearAllFilters: () => {
          this.setState(state =>
            update(state, {
              view: {
                filters: {
                  $set: [],
                },
              },
            })
          );
        },
      },
      table: {
        onChangeSort: columnId => {
          this.setState(state => {
            const sorts = ['NONE', 'ASC', 'DESC'];
            const currentSort = state.view.table.sort;
            const currentSortDir =
              currentSort && currentSort.columnId === columnId
                ? state.view.table.sort.direction
                : 'NONE';
            const nextSortDir =
              sorts[(sorts.findIndex(i => i === currentSortDir) + 1) % sorts.length];
            return update(state, {
              view: {
                table: {
                  sort: {
                    $set:
                      nextSortDir === 'NONE'
                        ? undefined
                        : {
                            columnId,
                            direction: nextSortDir,
                          },
                  },
                },
              },
            });
          });
        },
        onRowSelected: (id, val) => {
          this.setState(state => {
            const isClearing = !val && state.view.table.selectedIds.length === 1;
            const isSelectingAll =
              val && state.view.table.selectedIds.length + 1 === filteredData.length;
            return update(state, {
              view: {
                table: {
                  selectedIds: {
                    $set: val
                      ? state.view.table.selectedIds.concat([id])
                      : state.view.table.selectedIds.filter(i => i !== id),
                  },
                  isSelectIndeterminate: {
                    $set: !(isClearing || isSelectingAll),
                  },
                  isSelectAllSelected: {
                    $set: isSelectingAll,
                  },
                },
              },
            });
          });
        },
        onSelectAll: val => {
          this.setState(state =>
            update(state, {
              view: {
                table: {
                  isSelectAllSelected: {
                    $set: val,
                  },
                  selectedIds: {
                    $set: val ? filteredData.map(i => i.id) : [],
                  },
                  isSelectIndeterminate: {
                    $set: false,
                  },
                },
              },
            })
          );
        },
        onRowExpanded: (id, val) => {
          this.setState(state => {
            const newExpandedRows = val
              ? state.view.table.expandedRows.concat([
                  { rowId: id, content: <RowExpansionContent rowId={id} /> },
                ])
              : state.view.table.expandedRows.filter(i => i.rowId !== id);
            return update(state, {
              view: {
                table: {
                  expandedRows: {
                    $set: newExpandedRows,
                  },
                },
              },
            });
          });
        },
      },
    };
    return (
      <Table
        columns={columns}
        data={
          sort && sort.columnId
            ? getSortedData(filteredData, sort.columnId, sort.direction)
            : filteredData
        }
        options={options}
        view={view}
        actions={actions}
      />
    );
  };
}

storiesOf('Table', module)
  .add('Stateful Example', () => <StatefulTableWrapper />, {
    info: {
      text:
        'This is a working stateful example of the table to showcase it\'s various functions. This is produced by wrapping the <Table> in a container component and managing the state associated with features such the toolbar, filters, row select, etc. For more robust documentation on the prop model and source, see the other "with function" stories.',
      propTables: [Table],
      propTablesExclude: [StatefulTableWrapper],
    },
  })
  .add('default', () => <Table columns={tableColumns} data={tableData} actions={actions} />)
  .add('with selection and batch actions', () => (
    // TODO - batch action bar
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      options={{
        hasFilter: false,
        hasPagination: true,
        hasRowSelection: true,
      }}
      view={{
        filters: [],
        pagination: {
          pageSize: 10,
          pageSizes: [10, 20, 30],
          page: 1,
          totalItems: tableData.length,
        },
        table: {
          isSelectAllSelected: false,
          isSelectIndeterminate: true,
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
        pagination: {
          totalItems: tableData.length,
        },
        table: {
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
        pagination: {
          pageSize: 10,
          pageSizes: [10, 20, 30],
          page: 1,
          totalItems: tableData.length,
        },
        table: {
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
            pageSize: 10,
            pageSizes: [10, 20, 30],
            page: 1,
            totalItems: filteredData.length,
          },
          table: {
            isSelectAllSelected: false,
            selectedIds: [],
          },
          toolbar: {
            activeBar: 'filter',
          },
        }}
      />
    );
  })
  .add('with customized columns', () => <p>TODO - a couple columns selected and reordered</p>)
  .add('with no results', () => <p>TODO - empty state when filters applied and no results</p>)
  .add('with no data', () => <p>TODO - empty state when no data provided</p>)
  .add('is loading', () => <p>TODO - empty state when data is loading</p>);
