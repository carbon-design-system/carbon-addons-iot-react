import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, Checkbox } from 'carbon-components-react';
import styled from 'styled-components';

import { COLORS } from '../../../../styles/styles';
import RowActionsCell from '../RowActionsCell/RowActionsCell';
import TableCellRenderer from '../../TableCellRenderer/TableCellRenderer';
import { RowActionPropTypes } from '../../TablePropTypes';
import { stopPropagationAndCallback } from '../../../../utils/componentUtilityFunctions';

const { TableRow, TableExpandRow, TableCell } = DataTable;

const StyledTableExpandRow = styled(TableExpandRow)`
  &&& {
    cursor: pointer;
    :hover {
      td {
        div > * {
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
      padding: 0;
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
  /** What column ordering is currently applied to the table */
  ordering: PropTypes.arrayOf(
    PropTypes.shape({
      columnId: PropTypes.string.isRequired,
      /* Visibility of column in table, defaults to false */
      isHidden: PropTypes.bool,
    })
  ).isRequired,
  /** table wide options */
  options: PropTypes.shape({
    hasRowSelection: PropTypes.bool,
    hasRowExpansion: PropTypes.bool,
    shouldExpandOnRowClick: PropTypes.bool,
  }),

  /** The unique row id */
  id: PropTypes.string.isRequired,
  /** some columns might be hidden, so total columns has the overall total */
  totalColumns: PropTypes.number.isRequired,
  /** table Id */
  tableId: PropTypes.string.isRequired,
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
    onRowClicked: PropTypes.func,
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

const StyledCheckboxTableCell = styled(TableCell)`
  && {
    padding-left: 1rem;
    padding-bottom: 0.5rem;
    width: 2.5rem;
  }
`;

const TableBodyRow = ({
  id,
  tableId,
  totalColumns,
  ordering,
  options: { hasRowSelection, hasRowExpansion, shouldExpandOnRowClick },
  tableActions: { onRowSelected, onRowExpanded, onRowClicked, onApplyRowAction },
  isExpanded,
  isSelected,
  children,
  rowActions,
  rowDetails,
  maxWidth,
}) => {
  const rowSelectionCell = hasRowSelection ? (
    <StyledCheckboxTableCell
      key={`${id}-row-selection-cell`}
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
    </StyledCheckboxTableCell>
  ) : null;

  const tableCells = (
    <React.Fragment>
      {rowSelectionCell}
      {ordering.map(col =>
        !col.isHidden ? (
          <TableCell key={col.columnId} data-column={col.columnId}>
            <TableCellRenderer>{children[col.columnId]}</TableCellRenderer>
          </TableCell>
        ) : null
      )}
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
          onExpand={evt => stopPropagationAndCallback(evt, onRowExpanded, id, false)}
          onClick={() => {
            if (shouldExpandOnRowClick) {
              onRowExpanded(id, false);
            }
            onRowClicked(id);
          }}>
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
        onExpand={evt => stopPropagationAndCallback(evt, onRowExpanded, id, true)}
        onClick={() => {
          if (shouldExpandOnRowClick) {
            onRowExpanded(id, true);
          }
          onRowClicked(id);
        }}>
        {tableCells}
      </StyledTableExpandRow>
    )
  ) : (
    <TableRow key={id} onClick={() => onRowClicked(id)}>
      {tableCells}
    </TableRow>
  );
};

TableBodyRow.propTypes = propTypes;
TableBodyRow.defaultProps = defaultProps;

export default TableBodyRow;
