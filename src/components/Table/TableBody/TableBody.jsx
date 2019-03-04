import React from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'carbon-components-react';
import isNil from 'lodash/isNil';
import pick from 'lodash/pick';

import {
  ExpandedRowsPropTypes,
  TableDataPropTypes,
  TableColumnsPropTypes,
} from '../TablePropTypes';
import TableBodyRow from '../TableBodyRow/TableBodyRow';

const { TableBody: CarbonTableBody } = DataTable;

const propTypes = {
  /** id of the table */
  id: PropTypes.string.isRequired,
  rows: TableDataPropTypes,
  columns: TableColumnsPropTypes,
  expandedRows: ExpandedRowsPropTypes,
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
  expandedRows: null,
  selectedIds: [],
  rows: [],
  columns: [],
  totalColumns: 0,
  hasRowSelection: false,
  hasRowExpansion: false,
};

const TableBody = ({
  id,
  rows,
  columns,
  expandedRows,
  selectedIds,
  totalColumns,
  actions,
  hasRowSelection,
  hasRowExpansion,
}) => (
  <CarbonTableBody>
    {rows.map(row => {
      const isRowExpanded = !isNil(
        expandedRows && expandedRows.find(expandedRow => expandedRow.rowId === row.id)
      );
      return (
        <TableBodyRow
          key={row.id}
          isExpanded={isRowExpanded}
          isSelected={selectedIds.includes(row.id)}
          rowDetails={isRowExpanded ? expandedRows.find(j => j.rowId === row.id).content : null}
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
