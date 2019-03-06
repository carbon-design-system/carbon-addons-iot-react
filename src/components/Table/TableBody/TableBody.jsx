import React from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'carbon-components-react';
import pick from 'lodash/pick';

import {
  ExpandedRowsPropTypes,
  TableDataPropTypes,
  TableColumnsPropTypes,
} from '../TablePropTypes';

import TableBodyRow from './TableBodyRow/TableBodyRow';

const { TableBody: CarbonTableBody } = DataTable;

const propTypes = {
  /** id of the table */
  id: PropTypes.string.isRequired,
  rows: TableDataPropTypes,
  expandedRows: ExpandedRowsPropTypes,
  columns: TableColumnsPropTypes,
  expandedIds: PropTypes.arrayOf(PropTypes.string),
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  /** since some columns might not be currently visible */
  totalColumns: PropTypes.number,
  hasRowSelection: PropTypes.bool,
  hasRowExpansion: PropTypes.bool,
  actions: PropTypes.shape({
    onRowSelected: PropTypes.func,
    onApplyRowActions: PropTypes.func,
    onRowExpanded: PropTypes.func,
  }).isRequired,
};

const defaultProps = {
  expandedIds: [],
  selectedIds: [],
  rows: [],
  expandedRows: [],
  columns: [],
  totalColumns: 0,
  hasRowSelection: false,
  hasRowExpansion: false,
};

const TableBody = ({
  id,
  rows,
  columns,
  expandedIds,
  expandedRows,
  selectedIds,
  totalColumns,
  actions,
  hasRowSelection,
  hasRowExpansion,
}) => (
  <CarbonTableBody>
    {rows.map(row => {
      const isRowExpanded = expandedIds.includes(row.id);
      return (
        <TableBodyRow
          key={row.id}
          isExpanded={isRowExpanded}
          isSelected={selectedIds.includes(row.id)}
          rowDetails={
            isRowExpanded && expandedRows.find(j => j.rowId === row.id)
              ? expandedRows.find(j => j.rowId === row.id).content
              : null
          }
          columns={columns}
          id={row.id}
          options={{
            hasRowSelection,
            hasRowExpansion,
            totalColumns,
            id,
          }}
          tableActions={pick(actions, 'onRowSelected', 'onApplyRowAction', 'onRowExpanded')}
          rowActions={row.rowActions}>
          {row.values}
        </TableBodyRow>
      );
    })}
  </CarbonTableBody>
);

TableBody.propTypes = propTypes;
TableBody.defaultProps = defaultProps;

export default TableBody;
