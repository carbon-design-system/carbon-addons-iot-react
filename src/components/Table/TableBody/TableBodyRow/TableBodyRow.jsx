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
    hasRowNesting: PropTypes.bool,
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
  /** offset level if row is nested */
  nestingLevel: PropTypes.number,
  /** number of child rows underneath this row */
  nestingChildCount: PropTypes.number,

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
  nestingLevel: 0,
  nestingChildCount: 0,
  options: {},
};

const StyledCheckboxTableCell = styled(TableCell)`
  && {
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
    ${props =>
      props['data-child-count'] === 0 && props['data-row-nesting']
        ? `
    td > button.bx--table-expand-v2__button {
      display: none;
    }
    `
        : `
    td > button.bx--table-expand-v2__button {
      position: relative;
      left: ${props['data-nesting-offset']}px;
    }
    `}
    ${props =>
      props['data-nesting-offset'] > 0
        ? `
      td.bx--table-expand-v2 {
        position: relative;
      }
      td:first-of-type:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: ${props['data-nesting-offset']}px;
        background-color: rgb(229,237,237);
        border-right: solid 1px rgb(223,227,230);
      }
    `
        : `
    `}
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
    ${props =>
      props['data-child-count'] === 0 && props['data-row-nesting']
        ? `
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
    `
        : props['data-row-nesting']
        ? `
    :hover {
      td {
        border-bottom: 1px solid ${COLORS.blue};
      }
      td:first-of-type {
        border-left: 1px solid ${COLORS.blue};
      }
    }
    td.bx--table-expand-v2 {
      position: relative;
    }
    td > button.bx--table-expand-v2__button {
      position: relative;
      left: ${props['data-nesting-offset']}px;
    }
    td:first-of-type:before {
      width: ${props['data-nesting-offset']}px;
      background-color: rgb(229,237,237);
      border-right: solid 1px rgb(223,227,230);
    }
    `
        : ``}
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
      const { width, offset } = props;
      return width !== undefined
        ? `
        min-width: ${width};
        max-width: ${width};
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;
        padding-right: ${offset}px;
      `
        : `padding-right: ${props.offset}px`;
    }};
  }
`;

const StyledNestedSpan = styled.span`
  position: relative;
  left: ${props => props.nestingOffset}px;
`;

const TableBodyRow = ({
  id,
  tableId,
  totalColumns,
  ordering,
  columns,
  options: {
    hasRowSelection,
    hasRowStickySelection,
    hasRowExpansion,
    hasRowActions,
    hasRowNesting,
    shouldExpandOnRowClick,
  },
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
  nestingLevel,
  nestingChildCount,
  rowActions,
  rowDetails,
}) => {
  const nestingOffset = nestingLevel * 16;
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
      <StyledNestedSpan nestingOffset={nestingOffset}>
        <Checkbox
          id={`select-row-${id}`}
          labelText={selectRowText}
          hideLabel
          checked={isSelected}
        />
      </StyledNestedSpan>
    </StyledCheckboxTableCell>
  ) : null;

  const firstVisibleColIndex = ordering.findIndex(col => !col.isHidden);
  const tableCells = (
    <React.Fragment>
      {rowSelectionCell}
      {ordering.map((col, idx) => {
        const matchingColumnMeta = columns && columns.find(column => column.id === col.columnId);
        const offset = firstVisibleColIndex === idx ? nestingOffset : 0;
        return !col.isHidden ? (
          <StyledTableCellRow
            key={col.columnId}
            data-column={col.columnId}
            data-offset={offset}
            offset={offset}
            width={matchingColumnMeta && matchingColumnMeta.width}>
            <StyledNestedSpan nestingOffset={offset}>
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
            </StyledNestedSpan>
          </StyledTableCellRow>
        ) : null;
      })}
      {hasRowActions && rowActions && rowActions.length > 0 ? (
        <RowActionsCell
          id={id}
          actions={rowActions}
          isRowExpanded={isExpanded && !hasRowNesting}
          overflowMenuText={overflowMenuText}
          onApplyRowAction={onApplyRowAction}
        />
      ) : nestingLevel > 0 && hasRowActions ? (
        <TableCell key={`${id}-row-actions-cell`} />
      ) : (
        undefined
      )}
    </React.Fragment>
  );
  return hasRowExpansion || hasRowNesting ? (
    isExpanded ? (
      <React.Fragment key={id}>
        <StyledTableExpandRowExpanded
          id={`${tableId}-Row-${id}`}
          ariaLabel={clickToCollapseText}
          expandIconDescription={clickToCollapseText}
          isExpanded
          data-row-nesting={hasRowNesting}
          data-nesting-offset={nestingOffset}
          onExpand={evt => stopPropagationAndCallback(evt, onRowExpanded, id, false)}
          onClick={() => {
            if (shouldExpandOnRowClick) {
              onRowExpanded(id, false);
            }
            onRowClicked(id);
          }}>
          {tableCells}
        </StyledTableExpandRowExpanded>
        {!hasRowNesting && (
          <StyledExpansionTableRow>
            <TableCell colSpan={totalColumns}>{rowDetails}</TableCell>
          </StyledExpansionTableRow>
        )}
      </React.Fragment>
    ) : (
      <StyledTableExpandRow
        id={`${tableId}-Row-${id}`}
        key={id}
        data-row-nesting={hasRowNesting}
        data-child-count={nestingChildCount}
        data-nesting-offset={nestingOffset}
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
