import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import update from 'immutability-helper';

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
const getSentence = index => `${getWord(index, 1)} ${getWord(index, 2)} ${getWord(index, 3)}`;

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
class TableExpansion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: tableColumns,
      data: tableData,
      options: {
        hasRowExpansion: true,
      },
      view: {
        table: {
          expandedRows: [],
        },
      },
    };
  }

  getExpansionContent = rowId => (
    <div style={{ padding: 20 }}>
      <h3>{rowId}</h3>
      <ul style={{ lineHeight: '22px' }}>
        {Object.entries(tableData.find(i => i.id === rowId).values).map(([key, value]) => (
          <li>
            <b>{key}</b>: {value}
          </li>
        ))}
      </ul>
    </div>
  );

  render = () => {
    const { columns, data, options, view } = this.state;
    const actions = {
      table: {
        onRowExpanded: (id, val) => {
          this.setState(state => {
            const newExpandedRows = val
              ? state.view.table.expandedRows.concat([
                  { rowId: id, content: this.getExpansionContent(id) },
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
          pageSize: 10,
          pageSizes: [10, 20, 30],
          page: 1,
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
        table: {
          isSelectAllSelected: false,
          selectedIds: [],
        },
      },
    };
  }

  render = () => {
    const { columns, data, options, view } = this.state;
    const filteredData = data.filter(({ values }) =>
      // return false if a value doesn't match a valid filter
      view.filters.reduce(
        (acc, { columnId, value }) => acc && values[columnId].toString().includes(value),
        true
      )
    );
    const actions = {
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
      },
    };
    return (
      <Table
        columns={columns}
        data={filteredData}
        options={options}
        view={view}
        actions={actions}
      />
    );
  };
}

// eslint-disable-next-line react/no-multi-comp
class TableSort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: tableColumns.map((i, idx) => ({
        ...i,
        isSortable: idx !== 1,
      })),
      data: tableData,
      view: {
        table: {
          sort: undefined,
        },
      },
    };
  }

  getSortedData = (inputData, columnId, direction) => {
    const sortedData = inputData.map(i => i);
    return sortedData.sort((a, b) => {
      const val = direction === 'ASC' ? -1 : 1;
      if (a.values[columnId] < b.values[columnId]) {
        return val;
      }
      if (a.values[columnId] > b.values[columnId]) {
        return -val;
      }
      return 0;
    });
  };

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
    const actions = {
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
      },
    };
    return (
      <Table
        columns={columns}
        data={
          sort && sort.columnId ? this.getSortedData(data, sort.columnId, sort.direction) : data
        }
        options={options}
        view={view}
        actions={actions}
      />
    );
  };
}

storiesOf('Table', module)
  .addDecorator(story => <div style={{ padding: 40 }}>{story()}</div>)
  .add('simple', () => <TableSimple />)
  .add('expansion', () => <TableExpansion />)
  .add('pagination', () => <TablePagination />)
  .add('filter', () => <TableFilter />)
  .add('sort', () => <TableSort />);
