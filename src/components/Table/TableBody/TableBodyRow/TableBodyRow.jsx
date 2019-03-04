import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, Checkbox } from 'carbon-components-react';
import styled from 'styled-components';

import { COLORS } from '../../../../styles/styles';
import RowActionsCell from '../RowActionsCell/RowActionsCell';
import { RowActionPropTypes } from '../../TablePropTypes';

const { TableRow, TableExpandRow, TableCell } = DataTable;

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

const propTypes = {
  /** table columns */
  columns: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string })).isRequired,
  /** table wide options */
  options: PropTypes.shape({
    hasRowSelection: PropTypes.bool,
    hasRowExpansion: PropTypes.bool,
    totalColumns: PropTypes.number,
    id: PropTypes.string.isRequired,
  }),

  /** The unique row id */
  id: PropTypes.string.isRequired,
  /** contents of the row each object value is a renderable node keyed by column id */
  children: PropTypes.objectOf(PropTypes.node).isRequired,

  /** is the row currently selected */
  isSelected: PropTypes.bool,
  /** is the row currently expanded */
  isExpanded: PropTypes.bool,
  /** optional row details */
  rowDetails: PropTypes.node,

  /** tableActions */
  tableActions: PropTypes.shape({
    onRowSelected: PropTypes.func,
    onApplyRowAction: PropTypes.func,
    onRowExpanded: PropTypes.func,
  }).isRequired,
  /** optional per-row actions */
  rowActions: RowActionPropTypes,
};

const defaultProps = {
  isSelected: false,
  isExpanded: false,
  rowActions: null,
  rowDetails: null,
  options: {},
};

const TableBodyRow = ({
  id,
  columns,
  options: { hasRowSelection, hasRowExpansion, totalColumns, id: tableId },
  tableActions: { onRowSelected, onRowExpanded, onApplyRowAction },
  isExpanded,
  isSelected,
  children,
  rowActions,
  rowDetails,
}) => {
  const rowSelectionCell = hasRowSelection ? (
    <TableCell
      key={`${id}-row-selection-cell`}
      style={{ paddingBottom: '0.5rem' }}
      onClick={e => {
        onRowSelected(id, !isSelected);
        e.preventDefault();
        e.stopPropagation();
      }}>
      {/* TODO: Replace checkbox with TableSelectRow component when onChange bug is fixed
      https://github.com/IBM/carbon-components-react/issues/1247
      Also move onClick logic above into TableSelectRow
      */}
      <Checkbox id={`select-row-${id}`} labelText="Select Row" hideLabel checked={isSelected} />
    </TableCell>
  ) : null;

  const tableCells = (
    <React.Fragment>
      {rowSelectionCell}
      {columns.map(col => (
        <TableCell key={col.id}>{children[col.id]}</TableCell>
      ))}
      <RowActionsCell
        id={id}
        actions={rowActions}
        isRowExpanded={isExpanded}
        onApplyRowAction={onApplyRowAction}
      />
    </React.Fragment>
  );
  return hasRowExpansion ? (
    isExpanded ? (
      <React.Fragment key={id}>
        <StyledTableExpandRowExpanded
          id={`${tableId}-Row-${id}`}
          ariaLabel="Expand Row"
          isExpanded
          onExpand={() => onRowExpanded(id, false)}
          onClick={() => onRowExpanded(id, false)}>
          {tableCells}
        </StyledTableExpandRowExpanded>
        <StyledExpansionTableRow>
          <TableCell colSpan={totalColumns}>{rowDetails}</TableCell>
        </StyledExpansionTableRow>
      </React.Fragment>
    ) : (
      <StyledTableExpandRow
        id={`${tableId}-Row-${id}`}
        key={id}
        ariaLabel="Expand Row"
        isExpanded={false}
        onExpand={() => onRowExpanded(id, true)}
        onClick={() => onRowExpanded(id, true)}>
        {tableCells}
      </StyledTableExpandRow>
    )
  ) : (
    <TableRow key={id}>{tableCells}</TableRow>
  );
};

TableBodyRow.propTypes = propTypes;
TableBodyRow.defaultProps = defaultProps;

export default TableBodyRow;
