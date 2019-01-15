import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Pagination from './Pagination/Pagination';
import Toolbar from './Toolbar/Toolbar';

const propTypes = {
  /** Array with objects (id, name and size) */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
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
  }),
  view: PropTypes.shape({
    pagination: PropTypes.shape({
      itemsPerPage: PropTypes.number.isRequired,
      totalItems: PropTypes.number.isRequired,
      page: PropTypes.number.isRequired,
    }),
    toolbar: PropTypes.shape({}),
    table: PropTypes.shape({
      isSelectAllSelected: PropTypes.bool.isRequired,
      selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  }),
  actions: PropTypes.shape({
    pagination: PropTypes.shape({
      onChangeItemsPerPage: PropTypes.func.isRequired,
      onChangePage: PropTypes.func.isRequired,
    }),
    toolbar: PropTypes.shape({
      onBatchCancel: PropTypes.func.isRequired,
      onBatchDelete: PropTypes.func.isRequired,
    }),
    table: PropTypes.shape({
      onRowSelected: PropTypes.func.isRequired,
      onSelectAll: PropTypes.func.isRequired,
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
      : 1;
    const maxItemInView = view.pagination
      ? view.pagination.page * view.pagination.itemsPerPage
      : data.length;
    const visibleData = data.slice(minItemInView, maxItemInView);
    const header = (
      <thead>
        <tr>
          {options.hasRowSelection ? (
            <th>
              <label htmlFor="select-all" className="bx--checkbox-label">
                <input
                  data-event="select-all"
                  id="select-all"
                  className="bx--checkbox"
                  type="checkbox"
                  checked={view.table.isSelectAllSelected}
                  onClick={() =>
                    actions.table.onSelectAll(!view.table.isSelectAllSelected)
                  }
                />
              </label>
            </th>
          ) : null}
          {columns.map(i => (
            <th>
              <span className="bx--table-header-label">{i.text}</span>
            </th>
          ))}
        </tr>
      </thead>
    );
    const body = (
      <tbody>
        {visibleData.map(i => (
          <tr>
            {options.hasRowSelection ? (
              <td>
                <label
                  htmlFor={`${i.id}-checkbox`}
                  className="bx--checkbox-label">
                  <input
                    data-event="select"
                    id={`${i.id}-checkbox`}
                    className="bx--checkbox"
                    type="checkbox"
                    checked={view.table.selectedIds.includes(i.id)}
                    onClick={() =>
                      actions.table.onRowSelected(
                        i.id,
                        !view.table.selectedIds.includes(i.id)
                      )
                    }
                  />
                </label>
              </td>
            ) : null}
            {columns.map(col => (
              <td>{i.values[col.id]}</td>
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
