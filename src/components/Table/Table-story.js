import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import update from 'immutability-helper';

import Table from './Table';

const selectData = ['Option A is an option', 'Option B is an option', 'Option C is an option'];
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
    name: 'number',
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
const getSentence = index => `${getWord(index, 1)} ${getWord(index, 2)} ${getWord(index, 3)}`;

const tableData = Array(100)
  .fill(0)
  .map((i, idx) => ({
    id: `row-${idx}`,
    values: {
      string: getSentence(idx),
      date: new Date(1000000 + idx * idx).toISOString(),
      select: selectData[idx % 2],
      number: idx * idx,
    },
  }));

class TableSimple extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: tableColumns,
      data: tableData,
      options: {
        hasRowSelection: true,
      },
      view: {
        table: {
          isSelectAllSelected: false,
          selectedIds: [],
        },
      },
    };
  }

  render = () => {
    const { columns, data, options, view } = this.state;
    const actions = {
      toolbar: {
        onBatchCancel: () => {
          this.setState(state =>
            update(state, {
              view: {
                table: {
                  isSelectAllSelected: {
                    $set: false,
                  },
                  selectedIds: {
                    $set: [],
                  },
                },
              },
            })
          );
        },
        onApplyFilter: filter => console.log(JSON.stringify(filter, null, 4)),
        onBatchDelete: () => console.log('onBatchDelete'),
      },
      table: {
        onRowSelected: (id, val) => {
          this.setState(state =>
            update(state, {
              view: {
                table: {
                  selectedIds: {
                    $set: val
                      ? state.view.table.selectedIds.concat([id])
                      : state.view.table.selectedIds.filter(i => i !== id),
                  },
                },
              },
            })
          );
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
                    $set: val ? state.data.map(i => i.id) : [],
                  },
                },
              },
            })
          );
        },
      },
    };
    return <Table columns={columns} data={data} options={options} view={view} actions={actions} />;
  };
}

// eslint-disable-next-line react/no-multi-comp
class TablePagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: tableColumns,
      data: tableData,
      options: {
        hasPagination: true,
        hasRowSelection: true,
      },
      view: {
        pagination: {
          totalItems: tableData.length,
          itemsPerPage: 10,
          page: 1,
        },
        toolbar: {},
        table: {
          isSelectAllSelected: false,
          selectedIds: [],
        },
      },
    };
  }

  render = () => {
    const { columns, data, options, view } = this.state;
    const actions = {
      pagination: {
        onChangeItemsPerPage: value => {
          this.setState(state =>
            update(state, {
              view: {
                pagination: {
                  itemsPerPage: {
                    $set: value,
                  },
                },
              },
            })
          );
        },
        onChangePage: value => {
          this.setState(state =>
            update(state, {
              view: {
                pagination: {
                  page: {
                    $set: value,
                  },
                },
              },
            })
          );
        },
      },
      toolbar: {
        onApplyFilter: filter => console.log(JSON.stringify(filter, null, 4)),
        onBatchCancel: () => {
          this.setState(state =>
            update(state, {
              view: {
                table: {
                  isSelectAllSelected: {
                    $set: false,
                  },
                  selectedIds: {
                    $set: [],
                  },
                },
              },
            })
          );
        },
      },
      table: {
        onRowSelected: (id, val) => {
          this.setState(state =>
            update(state, {
              view: {
                table: {
                  selectedIds: {
                    $set: val
                      ? state.view.table.selectedIds.concat([id])
                      : state.view.table.selectedIds.filter(i => i !== id),
                  },
                },
              },
            })
          );
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
                    $set: val ? state.data.map(i => i.id) : [],
                  },
                },
              },
            })
          );
        },
      },
    };
    return <Table columns={columns} data={data} options={options} view={view} actions={actions} />;
  };
}

// eslint-disable-next-line react/no-multi-comp
class TableFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: tableColumns,
      data: tableData,
      options: {
        hasRowSelection: true,
        hasFilter: true,
      },
      view: {
        toolbar: {
          activeBar: 'filter',
        },
        table: {
          isSelectAllSelected: false,
          selectedIds: [],
        },
      },
    };
  }

  render = () => {
    const { columns, data, options, view } = this.state;
    const actions = {
      toolbar: {
        onApplyFilter: filter => console.log(JSON.stringify(filter, null, 4)),
        onBatchCancel: () => {
          this.setState(state =>
            update(state, {
              view: {
                table: {
                  isSelectAllSelected: {
                    $set: false,
                  },
                  selectedIds: {
                    $set: [],
                  },
                },
              },
            })
          );
        },
        onBatchDelete: () => {
          console.log('onBatchDelete');
          this.setState(state =>
            update(state, {
              view: {
                table: {
                  isSelectAllSelected: {
                    $set: false,
                  },
                  selectedIds: {
                    $set: [],
                  },
                },
              },
            })
          );
        },
      },
      table: {
        onRowSelected: (id, val) => {
          this.setState(state =>
            update(state, {
              view: {
                table: {
                  selectedIds: {
                    $set: val
                      ? state.view.table.selectedIds.concat([id])
                      : state.view.table.selectedIds.filter(i => i !== id),
                  },
                },
              },
            })
          );
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
                    $set: val ? state.data.map(i => i.id) : [],
                  },
                },
              },
            })
          );
        },
      },
    };
    return <Table columns={columns} data={data} options={options} view={view} actions={actions} />;
  };
}

storiesOf('Table', module)
  .add('simple', () => (
    <div style={{ padding: 40 }}>
      <TableSimple />
    </div>
  ))
  .add('pagination', () => (
    <div style={{ padding: 40 }}>
      <TablePagination />
    </div>
  ))
  .add('filter', () => (
    <div style={{ padding: 40 }}>
      <TableFilter />
    </div>
  ));
