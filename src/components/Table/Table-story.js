import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import update from 'react-addons-update';

import Table from './Table';

const tableColumns = [
  { id: 'string', text: 'String', size: 1 },
  { id: 'date', text: 'Date', size: 1 },
  { id: 'number', text: 'number', size: 1 },
];

const tableData = Array(100)
  .fill(0)
  .map((i, idx) => ({
    id: `row-${idx}`,
    values: {
      string: Math.random()
        .toString(36)
        .substr(2, 10),
      date: new Date(Math.random() * 1000000).toISOString(),
      number: Math.round(Math.random() * 89999 + 10000),
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
    return (
      <Table
        columns={columns}
        data={data}
        options={options}
        view={view}
        actions={actions}
      />
    );
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
    return (
      <Table
        columns={columns}
        data={data}
        options={options}
        view={view}
        actions={actions}
      />
    );
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
  ));
