import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';

import Pagination from './Pagination/Pagination';
import Toolbar from './Toolbar/Toolbar';
import FilterHeaderRow from './FilterHeaderRow/FilterHeaderRow';

const propTypes = {
  /** Array with objects (id, name and size) */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      filter: PropTypes.shape({
        placeholderText: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
          })
        ),
      }),
    })
  ).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      values: PropTypes.object,
    })
  ).isRequired,
  options: PropTypes.shape({
    hasPagination: PropTypes.bool,
    hasRowSelection: PropTypes.bool,
    hasFilter: PropTypes.bool,
  }),
  view: PropTypes.shape({
    pagination: PropTypes.shape({
      itemsPerPage: PropTypes.number.isRequired,
      totalItems: PropTypes.number.isRequired,
      page: PropTypes.number.isRequired,
    }),
    filters: PropTypes.arrayOf(
      PropTypes.shape({
        columnId: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ),
    toolbar: PropTypes.shape({
      // if not provided, no bar is visible
      activeBar: PropTypes.oneOf(['filter'], ['column']),
    }),
    table: PropTypes.shape({
      isSelectAllSelected: PropTypes.bool.isRequired,
      selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  }),
  actions: PropTypes.shape({
    pagination: PropTypes.shape({
      onChangeItemsPerPage: PropTypes.func,
      onChangePage: PropTypes.func,
    }),
    toolbar: PropTypes.shape({
      onBatchCancel: PropTypes.func,
      onBatchDelete: PropTypes.func,
      onApplyFilter: PropTypes.func,
    }),
    table: PropTypes.shape({
      onRowSelected: PropTypes.func,
      onSelectAll: PropTypes.func,
    }).isRequired,
  }),
};

const defaultProps = {
  options: {},
  view: {
    pagination: {},
    toolbar: {},
    table: {},
  },
  actions: {
    pagination: {},
    toolbar: {},
    table: {},
  },
}; // TBD

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    const { columns, data, view, actions, options } = this.props;
    const minItemInView = view.pagination
      ? (view.pagination.page - 1) * view.pagination.itemsPerPage + 1
      : 0;
    const maxItemInView = view.pagination
      ? view.pagination.page * view.pagination.itemsPerPage
      : data.length;
    const visibleData = data.slice(minItemInView, maxItemInView);
    const filterBarActive = options.hasFilter && view.toolbar.activeBar === 'filter';
    const filterBarActiveStyle = { paddingTop: 16 };
    const header = (
      <thead>
        <tr>
          {options.hasRowSelection ? (
            <th style={filterBarActive === true ? filterBarActiveStyle : {}}>
              <label htmlFor="select-all" className="bx--checkbox-label">
                <input
                  data-event="select-all"
                  id="select-all"
                  className="bx--checkbox"
                  type="checkbox"
                  checked={view.table.isSelectAllSelected}
                  onChange={() => {}}
                  onClick={() => actions.table.onSelectAll(!view.table.isSelectAllSelected)}
                />
              </label>
            </th>
          ) : null}
          {columns.map(column => (
            <th style={filterBarActive === true ? filterBarActiveStyle : {}}>
              <span className="bx--table-header-label">{column.name}</span>
            </th>
          ))}
        </tr>
        {filterBarActive && (
          <FilterHeaderRow
            columns={columns.map(column => ({
              ...column.filter,
              id: column.id,
              isFilterable: !isNil(column.filter),
            }))}
            filters={view.filters}
            tableOptions={options}
            onApplyFilter={actions.toolbar.onApplyFilter}
          />
        )}
      </thead>
    );
    const body = (
      <tbody>
        {visibleData.map(i => (
          <tr key={i.id}>
            {options.hasRowSelection ? (
              <td>
                <label htmlFor={`${i.id}-checkbox`} className="bx--checkbox-label">
                  <input
                    data-event="select"
                    id={`${i.id}-checkbox`}
                    className="bx--checkbox"
                    type="checkbox"
                    checked={view.table.selectedIds.includes(i.id)}
                    onChange={() => {}}
                    onClick={() =>
                      actions.table.onRowSelected(i.id, !view.table.selectedIds.includes(i.id))
                    }
                  />
                </label>
              </td>
            ) : null}
            {columns.map(col => (
              <td key={col.id}>{i.values[col.id]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    );

    const pagination = options.hasPagination ? (
      <Pagination {...view.pagination} {...actions.pagination} />
    ) : null;

    return (
      <div>
        <Toolbar
          {...view.toolbar}
          selectedItemCount={view.table.selectedIds.length}
          {...actions.toolbar}
        />
        <table className="bx--data-table-v2">
          {header}
          {body}
        </table>
        {pagination}
      </div>
    );
  };
}

Table.propTypes = propTypes;
Table.defaultProps = defaultProps;

export default Table;
