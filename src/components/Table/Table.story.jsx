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
    id: 'secretField',
    name: 'Secret Information',
    size: 1,
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
    onToggleColumnSelection: action('onToggleColumnSelection'),
    /** Specify a callback for when the user clicks toolbar button to clear all filters. Recieves a parameter of the current filter values for each column */
    onClearAllFilters: action('onClearAllFilters'),
    onCancelBatchAction: action('onCancelBatchAction'),
    onApplyBatchAction: action('onApplyBatchAction'),
  },
  table: {
    onRowSelected: action('onRowSelected'),
    onSelectAll: action('onSelectAll'),
    onEmptyStateAction: action('onEmptyStateAction'),
    onChangeOrdering: action('onChangeOrdering'),
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
      })),
      options: {
        hasFilter: true,
        hasPagination: true,
        hasRowSelection: true,
        hasRowExpansion: true,
        hasRowActions: true,
        hasColumnSelection: true,
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
          expandedRows: [],
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
                pagination: {
                  page: { $set: 1 },
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
        onToggleColumnSelection: () => {
          this.setState(state => {
            const columnSelectionToggled =
              state.view.toolbar.activeBar === 'column' ? null : 'column';
            return update(state, {
              view: {
                toolbar: {
                  activeBar: {
                    $set: columnSelectionToggled,
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
                pagination: {
                  page: { $set: 1 },
                },
              },
            })
          );
        },
        onCancelBatchAction: () => {
          this.setState(state =>
            update(state, {
              view: {
                table: {
                  selectedIds: { $set: [] },
                  isSelectAllSelected: { $set: false },
                  isSelectAllIndeterminate: { $set: false },
                },
              },
            })
          );
        },
        onApplyBatchAction: id => {
          if (id === 'delete') {
            this.setState(state =>
              update(state, {
                data: {
                  $set: state.data.filter(i => !state.view.table.selectedIds.includes(i.id)),
                },
                view: {
                  table: {
                    selectedIds: { $set: [] },
                    isSelectAllSelected: { $set: false },
                    isSelectAllIndeterminate: { $set: false },
                  },
                },
              })
            );
          }
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
                  isSelectAllIndeterminate: {
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
                  isSelectAllIndeterminate: {
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
        onApplyRowAction: (rowId, actionId) => {
          alert(`action "${actionId}" clicked for row "${rowId}"`); //eslint-disable-line
        },
        onEmptyStateAction: () => {
          this.setState(state =>
            state.view.filters.length > 0
              ? update(state, {
                  view: {
                    filters: {
                      $set: [],
                    },
                    toolbar: {
                      activeBar: {
                        $set: null,
                      },
                    },
                    pagination: {
                      page: { $set: 1 },
                    },
                  },
                })
              : update(state, {
                  data: {
                    $set: [getNewRow(Math.floor(Math.random() * 100))].map(i => ({
                      ...i,
                      rowActions: [
                        {
                          id: 'drilldown',
                          icon: 'arrow--right',
                          labelText: 'Drill in',
                        },
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
                      ],
                    })),
                  },
                })
          );
        },
        onChangeOrdering: ordering => {
          this.setState(state =>
            update(state, {
              view: {
                table: {
                  ordering: { $set: ordering },
                },
              },
            })
          );
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
        view={{
          ...view,
          pagination: {
            ...view.pagination,
            totalItems: filteredData.length,
          },
        }}
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
        table: {
          ordering: tableColumns.map(c => ({
            columnId: c.id,
            isHidden: c.id === 'secretField' || c.id === 'date',
          })),
        },
        toolbar: {
          activeBar: 'column',
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
      }}
      options={{ hasFilter: true, hasPagination: true }}
    />
  ))
  .add('with no data', () => (
    <Table columns={tableColumns} data={[]} actions={actions} options={{ hasPagination: true }} />
  ))
  .add('with no data and custom empty state', () => (
    <Table
      columns={tableColumns}
      data={[]}
      actions={actions}
      view={{
        table: {
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
      view={{ table: { loadingState: { isLoading: true } } }}
    />
  ));
