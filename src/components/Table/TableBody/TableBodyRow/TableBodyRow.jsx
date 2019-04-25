import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, Checkbox } from 'carbon-components-react';
import styled from 'styled-components';

import { COLORS } from '../../../../styles/styles';
import RowActionsCell from '../RowActionsCell/RowActionsCell';
import TableCellRenderer from '../../TableCellRenderer/TableCellRenderer';
import { RowActionPropTypes, TableColumnsPropTypes } from '../../TablePropTypes';
import { stopPropagationAndCallback } from '../../../../utils/componentUtilityFunctions';

const { TableRow, TableExpandRow, TableCell } = DataTable;

const propTypes = {
  /** What column ordering is currently applied to the table */
  ordering: PropTypes.arrayOf(
    PropTypes.shape({
      columnId: PropTypes.string.isRequired,
      /* Visibility of column in table, defaults to false */
      isHidden: PropTypes.bool,
      /** for each column you can register a render callback function that is called with this object payload
       * {
       *    value: PropTypes.any (current cell value),
       *    columnId: PropTypes.string,
       *    rowId: PropTypes.string,
       *    row: PropTypes.object like this {col: value, col2: value}
       * }, you should return the node that should render within that cell */
      renderDataFunction: PropTypes.func,
    })
  ).isRequired,
  /** internationalized label */
  selectRowText: PropTypes.string,
  /** internationalized label  */
  overflowMenuText: PropTypes.string,
  /** internationalized label */
  clickToExpandText: PropTypes.string,
  /** internationalized label  */
  clickToCollapseText: PropTypes.string,
  /** List of columns */
  columns: TableColumnsPropTypes.isRequired,
  /** table wide options */
  options: PropTypes.shape({
    hasRowSelection: PropTypes.bool,
    hasRowStickySelection: PropTypes.bool,
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
  /** is the row currently sticky selected */
  isStickySelected: PropTypes.bool,
  /** is the row currently expanded */
  isExpanded: PropTypes.bool,
  /** optional row details */
  rowDetails: PropTypes.node,

  /** tableActions */
  tableActions: PropTypes.shape({
    onRowSelected: PropTypes.func,
    onRowStickySelected: PropTypes.func,
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
  selectRowText: 'Select row',
  overflowMenuText: 'More actions',
  clickToExpandText: 'Click to expand.',
  clickToCollapseText: 'Click to collapse.',
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

const StyledTableRow = styled(TableRow)`
  &&& {
    :hover {
      td {
        div > * {
          opacity: 1;
        }
      }
    }
  }
`;

const StyledStickySelectedTableRow = styled(TableRow)`
  &&& {
    background: ${COLORS.superLightGray};
    border-left: 5px solid ${COLORS.blue};

    td {
      margin-left: -5px;
    }
  }
`;

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

const StyledTableCellRow = styled(TableCell)`
  &&& {
    ${props => {
      const { width } = props;
      return width !== undefined
        ? `
        min-width: ${width};
        max-width: ${width};
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;
      `
        : '';
    }};
  }
`;

const TableBodyRow = ({
  id,
  tableId,
  totalColumns,
  ordering,
  columns,
  options: { hasRowSelection, hasRowStickySelection, hasRowExpansion, shouldExpandOnRowClick },
  tableActions: {
    onRowSelected,
    onRowExpanded,
    onRowClicked,
    onApplyRowAction,
    onRowStickySelected,
  },
  isExpanded,
  isSelected,
  isStickySelected,
  selectRowText,
  overflowMenuText,
  clickToExpandText,
  clickToCollapseText,
  children,
  rowActions,
  rowDetails,
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
      <Checkbox id={`select-row-${id}`} labelText={selectRowText} hideLabel checked={isSelected} />
    </StyledCheckboxTableCell>
  ) : null;

  const tableCells = (
    <React.Fragment>
      {rowSelectionCell}
      {ordering.map(col => {
        const matchingColumnMeta = columns && columns.find(column => column.id === col.columnId);
        return !col.isHidden ? (
          <StyledTableCellRow
            key={col.columnId}
            data-column={col.columnId}
            width={matchingColumnMeta && matchingColumnMeta.width}>
            {col.renderDataFunction ? (
              col.renderDataFunction({
                // Call the column renderer if it's provided
                value: children[col.columnId],
                columnId: col.columnId,
                rowId: id,
                row: children,
              })
            ) : (
              <TableCellRenderer>{children[col.columnId]}</TableCellRenderer>
            )}
          </StyledTableCellRow>
        ) : null;
      })}
      <RowActionsCell
        id={id}
        actions={rowActions}
        isRowExpanded={isExpanded}
        overflowMenuText={overflowMenuText}
        onApplyRowAction={onApplyRowAction}
      />
    </React.Fragment>
  );
  return hasRowExpansion ? (
    isExpanded ? (
      <React.Fragment key={id}>
        <StyledTableExpandRowExpanded
          id={`${tableId}-Row-${id}`}
          ariaLabel={clickToCollapseText}
          expandIconDescription={clickToCollapseText}
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
        ariaLabel={clickToExpandText}
        expandIconDescription={clickToExpandText}
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
  ) : hasRowStickySelection && isStickySelected ? (
    <StyledStickySelectedTableRow key={id} onClick={() => onRowClicked(id)}>
      {tableCells}
    </StyledStickySelectedTableRow>
  ) : (
    <StyledTableRow
      key={id}
      onClick={() => {
        if (hasRowStickySelection) {
          onRowStickySelected(id);
        }
        onRowClicked(id);
      }}>
      {tableCells}
    </StyledTableRow>
  );
};

TableBodyRow.propTypes = propTypes;
TableBodyRow.defaultProps = defaultProps;

export default TableBodyRow;
