import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'carbon-components-react';
import pick from 'lodash/pick';

import { ExpandedRowsPropTypes, TableRowPropTypes, TableColumnsPropTypes } from '../TablePropTypes';

import TableBodyRow from './TableBodyRow/TableBodyRow';

const { TableBody: CarbonTableBody } = DataTable;

const propTypes = {
  /** id of the table */
  id: PropTypes.string.isRequired,
  rows: TableRowPropTypes,
  expandedRows: ExpandedRowsPropTypes,
  columns: TableColumnsPropTypes,
  expandedIds: PropTypes.arrayOf(PropTypes.string),
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  stickySelectedRowId: PropTypes.string,
  /** internationalized label */
  selectRowText: PropTypes.string,
  /** internationalized label */
  overflowMenuText: PropTypes.string,
  /** internationalized label */
  clickToExpandText: PropTypes.string,
  /** internationalized label */
  clickToCollapseText: PropTypes.string,
  /** since some columns might not be currently visible */
  totalColumns: PropTypes.number,
  hasRowSelection: PropTypes.bool,
  hasRowStickySelection: PropTypes.bool,
  hasRowExpansion: PropTypes.bool,
  shouldExpandOnRowClick: PropTypes.bool,

  actions: PropTypes.shape({
    onRowSelected: PropTypes.func,
    onRowClicked: PropTypes.func,
    onApplyRowActions: PropTypes.func,
    onRowExpanded: PropTypes.func,
  }).isRequired,
  /** What column ordering is currently applied to the table */
  ordering: PropTypes.arrayOf(
    PropTypes.shape({
      columnId: PropTypes.string.isRequired,
      /* Visibility of column in table, defaults to false */
      isHidden: PropTypes.bool,
    })
  ).isRequired,
};

const defaultProps = {
  expandedIds: [],
  selectedIds: [],
  stickySelectedRowId: '',
  selectRowText: 'Select row',
  overflowMenuText: 'More actions',
  clickToExpandText: 'Click to expand.',
  clickToCollapseText: 'Click to collapse.',
  rows: [],
  expandedRows: [],
  columns: [],
  totalColumns: 0,
  hasRowSelection: false,
  hasRowStickySelection: false,
  hasRowExpansion: false,
  shouldExpandOnRowClick: false,
};

const TableBody = ({
  id,
  rows,
  columns,
  expandedIds,
  expandedRows,
  selectedIds,
  stickySelectedRowId,
  selectRowText,
  overflowMenuText,
  clickToExpandText,
  clickToCollapseText,
  totalColumns,
  actions,
  hasRowSelection,
  hasRowStickySelection,
  hasRowExpansion,
  shouldExpandOnRowClick,
  ordering,
}) => {
  // Need to merge the ordering and the columns since the columns have the renderer function
  const orderingMap = useMemo(
    () =>
      ordering.map(col => ({
        ...col,
        ...columns.find(column => column.id === col.columnId),
      })),
    [columns, ordering]
  );

  return (
    <CarbonTableBody>
      {rows.map(row => {
        const isRowExpanded = expandedIds.includes(row.id);
        return (
          <TableBodyRow
            key={row.id}
            isExpanded={isRowExpanded}
            isSelected={selectedIds.includes(row.id)}
            isStickySelected={stickySelectedRowId === row.id}
            rowDetails={
              isRowExpanded && expandedRows.find(j => j.rowId === row.id)
                ? expandedRows.find(j => j.rowId === row.id).content
                : null
            }
            ordering={orderingMap}
            selectRowText={selectRowText}
            overflowMenuText={overflowMenuText}
            clickToCollapseText={clickToCollapseText}
            clickToExpandText={clickToExpandText}
            columns={columns}
            id={row.id}
            totalColumns={totalColumns}
            tableId={id}
            options={{
              hasRowSelection,
              hasRowStickySelection,
              hasRowExpansion,
              shouldExpandOnRowClick,
            }}
            tableActions={pick(
              actions,
              'onRowSelected',
              'onApplyRowAction',
              'onRowExpanded',
              'onRowClicked',
              'onRowStickySelected'
            )}
            rowActions={row.rowActions}>
            {row.values}
          </TableBodyRow>
        );
      })}
    </CarbonTableBody>
  );
};

TableBody.propTypes = propTypes;
TableBody.defaultProps = defaultProps;

export default TableBody;
