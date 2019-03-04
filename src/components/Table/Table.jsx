import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import { Button, PaginationV2, DataTable, Checkbox } from 'carbon-components-react';
import { Bee32 } from '@carbon/icons-react';

import { COLORS } from '../../styles/styles';
import { defaultFunction } from '../../utils/componentUtilityFunctions';

import TableHead from './TableHead/TableHead';
import TableToolbar from './TableToolbar/TableToolbar';

const {
  Table: CarbonTable,
  TableBody,
  TableRow,
  TableExpandRow,
  TableContainer,
  TableCell,
} = DataTable;

const propTypes = {
  /** DOM ID for component */
  id: PropTypes.string,
  /** Specify the properties of each column in the table */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      isSortable: PropTypes.bool,
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
  /** Data for the body of the table */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      values: PropTypes.object.isRequired,
      /** Optional list of actions visible on row hover or expansion */
      rowActions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          icon: PropTypes.string.isRequired,
          labelText: PropTypes.string,
          /** Disabled state defaults to false */
          disabled: PropTypes.bool,
        })
      ),
    })
  ).isRequired,
  /** Optional properties to customize how the table should be rendered */
  options: PropTypes.shape({
    hasPagination: PropTypes.bool,
    hasRowSelection: PropTypes.bool,
    hasRowExpansion: PropTypes.bool,
    hasRowActions: PropTypes.bool,
    hasFilter: PropTypes.bool,
    hasColumnSelection: PropTypes.bool,
  }),
  /** Initial state of the table, should be updated via a local state wrapper component implementation or via a central store/redux */
  view: PropTypes.shape({
    pagination: PropTypes.shape({
      pageSize: PropTypes.number,
      pageSizes: PropTypes.arrayOf(PropTypes.number),
      page: PropTypes.number,
      totalItems: PropTypes.number,
    }),
    filters: PropTypes.arrayOf(
      PropTypes.shape({
        columnId: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ),
    toolbar: PropTypes.shape({
      /** Specify which header row to display, will display default header row if null */
      activeBar: PropTypes.oneOf(['filter', 'column']),
      /** Specify which batch actions to render in the batch action bar. If empty, no batch action toolbar will display */
      batchActions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          labelText: PropTypes.string.isRequired,
          icon: PropTypes.oneOfType([
            PropTypes.shape({
              width: PropTypes.string,
              height: PropTypes.string,
              viewBox: PropTypes.string.isRequired,
              svgData: PropTypes.object.isRequired,
            }),
            PropTypes.string,
          ]),
          iconDescription: PropTypes.string,
        })
      ),
    }),
    table: PropTypes.shape({
      isSelectAllSelected: PropTypes.bool,
      isSelectAllIndeterminate: PropTypes.bool,
      selectedIds: PropTypes.arrayOf(PropTypes.string),
      sort: PropTypes.shape({
        columnId: PropTypes.string,
        direction: PropTypes.oneOf(['NONE', 'ASC', 'DESC']),
      }),
      /* Specify column ordering and visibility */
      ordering: PropTypes.arrayOf(
        PropTypes.shape({
          columnId: PropTypes.string.isRequired,
          /* Visibility of column in table, defaults to false */
          isHidden: PropTypes.bool,
        })
      ),
      expandedRows: PropTypes.arrayOf(
        PropTypes.shape({
          rowId: PropTypes.string,
          content: PropTypes.element,
        })
      ),
      emptyState: PropTypes.oneOfType([
        PropTypes.shape({
          message: PropTypes.string.isRequired,
          /* Show a different message if no content is in the table matching the filters */
          messageWithFilters: PropTypes.string,
          /* If a label is not provided, no action button will be rendered */
          buttonLabel: PropTypes.string,
          /* Show a different utton label if no content is in the table matching the filters */
          buttonLabelWithFilters: PropTypes.string,
        }),
        /* If a React element is provided, it will be rendered in place of the default */
        PropTypes.element,
      ]),
    }),
  }),
  /** Callbacks for actions of the table, can be used to update state in wrapper component to update `view` props */
  actions: PropTypes.shape({
    pagination: PropTypes.shape({
      /** Specify a callback for when the current page or page size is changed. This callback is passed an object parameter containing the current page and the current page size */
      onChange: PropTypes.func,
    }),
    toolbar: PropTypes.shape({
      onApplyFilter: PropTypes.func,
      onToggleFilter: PropTypes.func,
      onToggleColumnSelection: PropTypes.func,
      /** Specify a callback for when the user clicks toolbar button to clear all filters. Recieves a parameter of the current filter values for each column */
      onClearAllFilters: PropTypes.func,
      onCancelBatchAction: PropTypes.func,
      onApplyBatchAction: PropTypes.func,
    }),
    table: PropTypes.shape({
      onRowSelected: PropTypes.func,
      onRowExpanded: PropTypes.func,
      onSelectAll: PropTypes.func,
      onChangeSort: PropTypes.func,
      onApplyRowAction: PropTypes.func,
      onEmptyStateAction: PropTypes.func,
      onChangeOrdering: PropTypes.func,
    }).isRequired,
  }),
};

const defaultProps = baseProps => ({
  id: 'Table',
  options: {
    hasPagination: false,
    hasRowSelection: false,
    hasRowExpansion: false,
    hasRowActions: false,
    hasFilter: false,
    hasColumnSelection: false,
  },
  view: {
    pagination: {
      pageSize: 10,
      pageSizes: [10, 20, 30],
      page: 1,
      totalItems: baseProps.data && baseProps.data.length,
    },
    filters: [],
    toolbar: {
      batchActions: [],
    },
    table: {
      expandedRows: [],
      isSelectAllSelected: false,
      selectedIds: [],
      sort: {},
      ordering: baseProps.columns && baseProps.columns.map(i => ({ columnId: i.id })),
      emptyState: {
        message: 'There is no data',
        messageWithFilters: 'No results match the current filters',
        buttonLabel: 'Create some data',
        buttonLabelWithFilters: 'Clear all filters',
      },
    },
  },
  actions: {
    pagination: { onChange: defaultFunction('actions.pagination.onChange') },
    toolbar: {
      onToggleFilter: defaultFunction('actions.toolbar.onToggleFilter'),
      onToggleColumnSelection: defaultFunction('actions.toolbar.onToggleColumnSelection'),
      onApplyBatchAction: defaultFunction('actions.toolbar.onApplyBatchAction'),
      onCancelBatchAction: defaultFunction('actions.toolbar.onCancelBatchAction'),
    },
    table: {
      onChangeSort: defaultFunction('actions.table.onChangeSort'),
      onRowExpanded: defaultFunction('actions.table.onRowExpanded'),
      onApplyRowAction: defaultFunction('actions.table.onApplyRowAction'),
      onEmptyStateAction: defaultFunction('actions.table.onEmptyStateAction'),
      onChangeOrdering: defaultFunction('actions.table.onChangeOrdering'),
    },
  },
});

const RowActionsContainer = styled.div`
  & {
    display: flex;
    justify-content: flex-end;
    opacity: ${props => (props.visible ? 1 : 0)};
  }
`;

const RowActionButton = styled(Button)`
  &&& {
    color: ${props => (props.rowexpanded ? COLORS.white : COLORS.darkGray)};
    svg {
      fill: ${props => (props.rowexpanded ? COLORS.white : COLORS.darkGray)};
      margin-left: ${props => (props.nolabel !== 'false' ? '0' : '')};
    }
    :hover {
      color: ${props => (!props.rowexpanded ? COLORS.white : COLORS.darkGray)};
      svg {
        fill: ${props => (!props.rowexpanded ? COLORS.white : COLORS.darkGray)};
      }
    }
  }
`;

const StyledTableExpandRow = styled(TableExpandRow)`
  &&& {
    cursor: pointer;
    :hover {
      td {
        div {
          opacity: 1;
        }
      }
    }
  }
`;

const StyledTableExpandRowExpanded = styled(TableExpandRow)`
  &&& {
    cursor: pointer;
    td {
      background-color: ${COLORS.blue};
      border-color: ${COLORS.blue};
      color: white;
      button {
        svg {
          fill: white;
        }
      }
      border-top: 1px solid ${COLORS.blue};
      :first-of-type {
        border-left: 1px solid ${COLORS.blue};
      }
      :last-of-type {
        border-right: 1px solid ${COLORS.blue};
      }
    }
  }
`;

const StyledExpansionTableRow = styled(TableRow)`
  &&& {
    td {
      background-color: inherit;
      border-left: 4px solid ${COLORS.blue};
      border-width: 0 0 0 4px;
    }
    :hover {
      border: inherit;
      background-color: inherit;
      td {
        background-color: inherit;
        border-left: solid ${COLORS.blue};
        border-width: 0 0 0 4px;
      }
    }
  }
`;

const StyledEmptyTableRow = styled(TableRow)`
  &&& {
    &:hover td {
      border: 1px solid ${COLORS.lightGrey};
      background: inherit;
    }
    .empty-table-cell--default {
      display: flex;
      align-items: center;
      justify-content: middle;
      flex-direction: column;
      padding: 3rem;

      svg {
        margin: 1rem;
      }

      & > * {
        margin: 0.5rem;
      }
    }
  }
`;

const Table = props => {
  const { id, columns, data, view, actions, options, className } = merge(
    {},
    defaultProps(props),
    props
  );

  const minItemInView =
    options.hasPagination && view.pagination
      ? (view.pagination.page - 1) * view.pagination.pageSize
      : 0;
  const maxItemInView =
    options.hasPagination && view.pagination
      ? view.pagination.page * view.pagination.pageSize
      : data.length;
  const visibleData = data.slice(minItemInView, maxItemInView);

  const visibleColumns = columns.filter(
    c => !(view.table.ordering.find(o => o.columnId === c.id) || { isHidden: false }).isHidden
  );
  const totalColumns =
    visibleColumns.length +
    (options.hasRowSelection ? 1 : 0) +
    (options.hasRowExpansion ? 1 : 0) +
    (options.hasRowActions ? 1 : 0);
  return (
    <div id={id} className={className}>
      <TableContainer>
        <TableToolbar
          actions={pick(
            actions.toolbar,
            'onCancelBatchAction',
            'onApplyBatchAction',
            'onClearAllFilters',
            'onToggleColumnSelection',
            'onToggleFilter'
          )}
          options={pick(options, 'hasColumnSelection', 'hasFilter')}
          tableState={{
            totalSelected: view.table.selectedIds.length,
            totalFilters: view.filters ? view.filters.length : 0,
            batchActions: view.toolbar.batchActions,
          }}
        />
        <CarbonTable zebra={false}>
          <TableHead
            options={pick(options, 'hasRowSelection', 'hasRowExpansion', 'hasRowActions')}
            columns={columns}
            filters={view.filters}
            actions={{
              ...pick(actions.toolbar, 'onApplyFilter'),
              ...pick(actions.table, 'onSelectAll', 'onChangeSort', 'onChangeOrdering'),
            }}
            tableState={{
              activeBar: view.toolbar.activeBar,
              filters: view.filters,
              ...view.table,
              selection: {
                isSelectAllSelected: view.table.isSelectAllSelected,
                isSelectAllIndeterminate: view.table.isSelectAllIndeterminate,
              },
            }}
          />
          {visibleData && visibleData.length ? (
            <TableBody>
              {visibleData.map(i => {
                const isRowExpanded =
                  view.table.expandedRows && view.table.expandedRows.find(j => j.rowId === i.id);
                const rowExpansionContent = isRowExpanded
                  ? view.table.expandedRows.find(j => j.rowId === i.id).content
                  : null;
                const rowSelectionCell = options.hasRowSelection ? (
                  <TableCell
                    key={`${i.id}-row-selection-cell`}
                    style={{ paddingBottom: '0.5rem' }}
                    onClick={e => {
                      actions.table.onRowSelected(i.id, !view.table.selectedIds.includes(i.id));
                      e.preventDefault();
                      e.stopPropagation();
                    }}>
                    {/* TODO: Replace checkbox with TableSelectRow component when onChange bug is fixed
                    https://github.com/IBM/carbon-components-react/issues/1088
                    Also move onClick logic above into TableSelectRow
                    */}
                    <Checkbox
                      id={`select-row-${i.id}`}
                      labelText="Select Row"
                      hideLabel
                      checked={view.table.selectedIds.includes(i.id)}
                    />
                  </TableCell>
                ) : null;
                const rowActionsCell = expanded =>
                  i.rowActions && i.rowActions.length > 0 ? (
                    <TableCell key={`${i.id}-row-actions-cell`}>
                      <RowActionsContainer visible={expanded}>
                        {i.rowActions.map(a => (
                          <RowActionButton
                            key={`${i.id}-row-actions-button-${a.id}`}
                            kind="ghost"
                            icon={a.icon}
                            disabled={a.disabled}
                            onClick={e => {
                              actions.table.onApplyRowAction(i.id, a.id);
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            small
                            nolabel={`${!a.labelText}`}
                            rowexpanded={isRowExpanded}>
                            {a.labelText}
                          </RowActionButton>
                        ))}
                      </RowActionsContainer>
                    </TableCell>
                  ) : null;
                const tableCells = (
                  <React.Fragment>
                    {rowSelectionCell}
                    {visibleColumns.map(col => (
                      <TableCell key={col.id}>{i.values[col.id]}</TableCell>
                    ))}
                    {rowActionsCell(isRowExpanded)}
                  </React.Fragment>
                );
                return options.hasRowExpansion ? (
                  isRowExpanded ? (
                    <React.Fragment key={i.id}>
                      <StyledTableExpandRowExpanded
                        id={`${id}-Row-${i.id}`}
                        ariaLabel="Expand Row"
                        isExpanded
                        onExpand={() => actions.table.onRowExpanded(i.id, false)}
                        onClick={() => actions.table.onRowExpanded(i.id, false)}>
                        {tableCells}
                      </StyledTableExpandRowExpanded>
                      <StyledExpansionTableRow>
                        <TableCell colSpan={totalColumns}>{rowExpansionContent}</TableCell>
                      </StyledExpansionTableRow>
                    </React.Fragment>
                  ) : (
                    <StyledTableExpandRow
                      id={`${id}-Row-${i.id}`}
                      key={i.id}
                      ariaLabel="Expand Row"
                      isExpanded={false}
                      onExpand={() => actions.table.onRowExpanded(i.id, true)}
                      onClick={() => actions.table.onRowExpanded(i.id, true)}>
                      {tableCells}
                    </StyledTableExpandRow>
                  )
                ) : (
                  <TableRow key={i.id}>{tableCells}</TableRow>
                );
              })}
            </TableBody>
          ) : (
            <TableBody>
              <StyledEmptyTableRow>
                <TableCell colSpan={totalColumns}>
                  {view.table.emptyState.props ? (
                    view.table.emptyState
                  ) : (
                    <div className="empty-table-cell--default">
                      <Bee32 />
                      <p>
                        {view.filters.length > 0 && view.table.emptyState.messageWithFilters
                          ? view.table.emptyState.messageWithFilters
                          : view.table.emptyState.message}
                      </p>
                      {view.table.emptyState.buttonLabel && (
                        <Button onClick={() => actions.table.onEmptyStateAction()}>
                          {view.filters.length > 0 && view.table.emptyState.buttonLabelWithFilters
                            ? view.table.emptyState.buttonLabelWithFilters
                            : view.table.emptyState.buttonLabel}
                        </Button>
                      )}
                    </div>
                  )}
                </TableCell>
              </StyledEmptyTableRow>
            </TableBody>
          )}
        </CarbonTable>
      </TableContainer>

      {options.hasPagination ? <PaginationV2 {...view.pagination} {...actions.pagination} /> : null}
    </div>
  );
};

Table.propTypes = propTypes;
Table.defaultProps = defaultProps({});

export default Table;
