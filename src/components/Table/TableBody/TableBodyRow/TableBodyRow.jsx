import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, Checkbox } from 'carbon-components-react';
import styled from 'styled-components';
import { settings } from 'carbon-components';

import RowActionsCell from '../RowActionsCell/RowActionsCell';
import TableCellRenderer from '../../TableCellRenderer/TableCellRenderer';
import {
  RowActionPropTypes,
  RowActionErrorPropTypes,
  TableColumnsPropTypes,
} from '../../TablePropTypes';
import { stopPropagationAndCallback } from '../../../../utils/componentUtilityFunctions';
import { COLORS } from '../../../../styles/styles';

const { TableRow, TableExpandRow, TableCell } = DataTable;
const { prefix } = settings;

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
  selectRowAria: PropTypes.string,
  /** internationalized label  */
  overflowMenuAria: PropTypes.string,
  /** internationalized label */
  clickToExpandAria: PropTypes.string,
  /** internationalized label  */
  clickToCollapseAria: PropTypes.string,
  /** List of columns */
  columns: TableColumnsPropTypes.isRequired,
  /** table wide options */
  options: PropTypes.shape({
    hasRowSelection: PropTypes.oneOf(['multi', 'single', false]),
    hasRowExpansion: PropTypes.bool,
    hasRowNesting: PropTypes.bool,
    shouldExpandOnRowClick: PropTypes.bool,
  }),

  /** The unique row id */
  id: PropTypes.string.isRequired,
  /** The unique id for the table */
  tableId: PropTypes.string.isRequired,
  /** some columns might be hidden, so total columns has the overall total */
  totalColumns: PropTypes.number.isRequired,

  /** contents of the row each object value is a renderable node keyed by column id */
  values: PropTypes.objectOf(PropTypes.node).isRequired,

  /** is the row currently selected */
  isSelected: PropTypes.bool,
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
    onRowClicked: PropTypes.func,
    onApplyRowAction: PropTypes.func,
    onRowExpanded: PropTypes.func,
  }).isRequired,
  /** optional per-row actions */
  rowActions: RowActionPropTypes,
  /** Is a row action actively running */
  isRowActionRunning: PropTypes.bool,
  /** has a row action errored out */
  rowActionsError: RowActionErrorPropTypes,
  /** I18N label for in progress */
  inProgressText: PropTypes.string,
  /** I18N label for action failed */
  actionFailedText: PropTypes.string,
  /** I18N label for learn more */
  learnMoreText: PropTypes.string,
  /** I18N label for dismiss */
  dismissText: PropTypes.string,
};

const defaultProps = {
  isSelected: false,
  isExpanded: false,
  selectRowAria: 'Select row',
  overflowMenuAria: 'More actions',
  clickToExpandAria: 'Click to expand.',
  clickToCollapseAria: 'Click to collapse.',
  rowActions: null,
  rowDetails: null,
  nestingLevel: 0,
  nestingChildCount: 0,
  options: {},
};

const StyledTableRow = styled(({ isSelectable, ...others }) => <TableRow {...others} />)`
  &&& {
    ${props => (props.onClick && props.isSelectable !== false ? `cursor: pointer;` : ``)}
    :hover {
      td {
        /* show the row actions if the table row is hovered over */
        div > *:not(label) {
          opacity: 1;
        }
        ${props =>
          props.isSelectable === false
            ? `background-color: inherit; color:#565656;border-bottom-color:#dcdcdc;border-top-color:#ffffff;`
            : ``} /* turn off hover states if the row is set not selectable */
      }
      ${props =>
        props.isSelectable === false
          ? `background-color: inherit; color:#565656;border-bottom-color:#dcdcdc;border-top-color:#ffffff;`
          : ``} /* turn off hover states if the row is set not selectable */
    }


`;

const StyledSingleSelectedTableRow = styled(({ hasRowSelection, ...props }) => (
  <TableRow {...props} />
))`
  &&& {
    background: ${COLORS.lightBlue};

    td:first-of-type {
      position: relative;
    }

    cursor: pointer;
    td:first-of-type:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 3px;
      background-color: ${COLORS.blue};
      border-right: solid 1px rgb(223,227,230);
    }
`;

const StyledTableExpandRow = styled(({ hasRowSelection, ...props }) => (
  <TableExpandRow {...props} />
))`
  &&& {
    ${props =>
      props['data-child-count'] === 0 && props['data-row-nesting']
        ? `
    td > button.bx--table-expand__button {
      display: none;
    }
    `
        : `
    td > button.bx--table-expand__button {
      position: relative;
      left: ${props['data-nesting-offset']}px;
    }
    `}
    ${props =>
      props['data-nesting-offset'] > 0
        ? `
      td.bx--table-expand {
        position: relative;
      }
      td:first-of-type:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: ${props['data-nesting-offset']}px;
        background-color: ${COLORS.gray20};
        border-right: solid 1px rgb(223,227,230);
      }
    `
        : `
    `}
    cursor: pointer;
    td {
      div .bx--btn--ghost:hover {
        background: ${COLORS.gray20};
      }
    }
    :hover {
      td {
        div > *:not(label) {
          opacity: 1;
        }
      }
    }

    ${props =>
      props.hasRowSelection === 'single' && props.isSelected
        ? `
        background: ${COLORS.lightBlue};

        td:first-of-type {
          position: relative;
        }

        td:first-of-type:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 3px;
          background-color: ${COLORS.blue};
          border-right: solid 1px rgb(223,227,230);
        }
        `
        : ``}
  }
`;

const StyledTableExpandRowExpanded = styled(({ hasRowSelection, ...props }) => (
  <TableExpandRow {...props} />
))`
  &&& {
    cursor: pointer;
    ${props =>
      props['data-row-nesting']
        ? `

        td.bx--table-expand, td {
          position: relative;
          border-color: ${COLORS.gray20};
        }
        td > button.bx--table-expand__button {
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

    ${props =>
      props.hasRowSelection === 'single' && props.isSelected
        ? `
        background: ${COLORS.lightBlue};

        td:first-of-type {
          position: relative;
        }

        td:first-of-type:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 3px;
          background-color: ${COLORS.blue};
          border-right: solid 1px rgb(223,227,230);
        }
        `
        : ``}
  }
`;

const StyledExpansionTableRow = styled(({ hasRowSelection, ...props }) => <TableRow {...props} />)`
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

    ${props =>
      props.hasRowSelection === 'single' && props.isSelected
        ? `
        background: ${COLORS.lightBlue};

        td:first-of-type {
          position: relative;
        }

        td:first-of-type:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 3px;
          background-color: ${COLORS.blue};
          border-right: solid 1px rgb(223,227,230);
        }
        `
        : ``}
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
        : null;
    }}
`;

const StyledNestedSpan = styled.span`
  position: relative;
  left: ${props => props.nestingOffset}px;
  display: block;
`;

const TableBodyRow = ({
  id,
  tableId,
  totalColumns,
  ordering,
  columns,
  options: {
    hasRowSelection,
    hasRowExpansion,
    hasRowActions,
    hasRowNesting,
    shouldExpandOnRowClick,
  },
  tableActions: { onRowSelected, onRowExpanded, onRowClicked, onApplyRowAction, onClearRowError },
  isExpanded,
  isSelected,
  selectRowAria,
  overflowMenuAria,
  clickToExpandAria,
  clickToCollapseAria,
  inProgressText,
  actionFailedText,
  learnMoreText,
  dismissText,
  isSelectable,
  values,
  nestingLevel,
  nestingChildCount,
  rowActions,
  isRowActionRunning,
  rowActionsError,
  rowDetails,
}) => {
  const singleSelectionIndicatorWidth = hasRowSelection === 'single' ? 0 : 5;
  const nestingOffset =
    hasRowSelection === 'single'
      ? nestingLevel * 16 - singleSelectionIndicatorWidth
      : nestingLevel * 16;
  const rowSelectionCell =
    hasRowSelection === 'multi' ? (
      <TableCell
        className={`${prefix}--checkbox-table-cell`}
        key={`${id}-row-selection-cell`}
        onClick={
          isSelectable !== false
            ? e => {
                onRowSelected(id, !isSelected);
                e.preventDefault();
                e.stopPropagation();
              }
            : null
        }
      >
        {/* TODO: Replace checkbox with TableSelectRow component when onChange bug is fixed
      https://github.com/IBM/carbon-components-react/issues/1247
      Also move onClick logic above into TableSelectRow
      */}
        <StyledNestedSpan nestingOffset={nestingOffset}>
          <Checkbox
            id={`select-row-${tableId}-${id}`}
            labelText={selectRowAria}
            hideLabel
            checked={isSelected}
            disabled={isSelectable === false}
          />
        </StyledNestedSpan>
      </TableCell>
    ) : null;

  const firstVisibleColIndex = ordering.findIndex(col => !col.isHidden);
  const tableCells = (
    <React.Fragment>
      {rowSelectionCell}
      {ordering.map((col, idx) => {
        const matchingColumnMeta = columns && columns.find(column => column.id === col.columnId);
        const offset = firstVisibleColIndex === idx ? nestingOffset : 0;
        const align =
          matchingColumnMeta && matchingColumnMeta.align ? matchingColumnMeta.align : 'start';
        return !col.isHidden ? (
          <StyledTableCellRow
            id={`cell-${tableId}-${id}-${col.columnId}`}
            key={col.columnId}
            data-column={col.columnId}
            data-offset={offset}
            offset={offset}
            width={matchingColumnMeta && matchingColumnMeta.width}
            align={align}
            className={`data-table-${align}`}
          >
            <StyledNestedSpan nestingOffset={offset}>
              {col.renderDataFunction ? (
                col.renderDataFunction({
                  // Call the column renderer if it's provided
                  value: values[col.columnId],
                  columnId: col.columnId,
                  rowId: id,
                  row: values,
                })
              ) : (
                <TableCellRenderer>{values[col.columnId]}</TableCellRenderer>
              )}
            </StyledNestedSpan>
          </StyledTableCellRow>
        ) : null;
      })}
      {hasRowActions && rowActions && rowActions.length > 0 ? (
        <RowActionsCell
          id={id}
          tableId={tableId}
          actions={rowActions}
          isRowActionRunning={isRowActionRunning}
          isRowExpanded={isExpanded && !hasRowNesting}
          overflowMenuAria={overflowMenuAria}
          inProgressText={inProgressText}
          actionFailedText={actionFailedText}
          onApplyRowAction={onApplyRowAction}
          learnMoreText={learnMoreText}
          dismissText={dismissText}
          rowActionsError={rowActionsError}
          onClearError={onClearRowError ? () => onClearRowError(id) : null}
        />
      ) : nestingLevel > 0 && hasRowActions ? (
        <TableCell key={`${tableId}-${id}-row-actions-cell`} />
      ) : (
        undefined
      )}
    </React.Fragment>
  );
  return hasRowExpansion || hasRowNesting ? (
    isExpanded ? (
      <React.Fragment key={id}>
        <StyledTableExpandRowExpanded
          ariaLabel={clickToCollapseAria}
          expandIconDescription={clickToCollapseAria}
          isExpanded
          isSelected={isSelected}
          hasRowSelection={hasRowSelection}
          data-row-nesting={hasRowNesting}
          data-nesting-offset={nestingOffset}
          onExpand={evt => stopPropagationAndCallback(evt, onRowExpanded, id, false)}
          onClick={() => {
            if (shouldExpandOnRowClick) {
              onRowExpanded(id, false);
            }
            if (hasRowSelection === 'single' && isSelectable !== false) {
              onRowSelected(id, true);
            }
            if (isSelectable !== false) {
              onRowClicked(id);
            }
          }}
        >
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
        key={id}
        data-row-nesting={hasRowNesting}
        data-child-count={nestingChildCount}
        data-nesting-offset={nestingOffset}
        ariaLabel={clickToExpandAria}
        expandIconDescription={clickToExpandAria}
        isExpanded={false}
        isSelected={isSelected}
        hasRowSelection={hasRowSelection}
        onExpand={evt => stopPropagationAndCallback(evt, onRowExpanded, id, true)}
        onClick={() => {
          if (shouldExpandOnRowClick) {
            onRowExpanded(id, true);
          }
          if (hasRowSelection === 'single' && isSelectable !== false) {
            onRowSelected(id, true);
          }
          if (isSelectable !== false) {
            onRowClicked(id);
          }
        }}
      >
        {tableCells}
      </StyledTableExpandRow>
    )
  ) : hasRowSelection === 'single' && isSelected ? (
    <StyledSingleSelectedTableRow
      key={id}
      onClick={() => {
        if (isSelectable !== false) {
          onRowClicked(id);
          onRowSelected(id, true);
        }
      }}
    >
      {tableCells}
    </StyledSingleSelectedTableRow>
  ) : (
    <StyledTableRow
      key={id}
      isSelected={isSelected}
      isSelectable={isSelectable}
      onClick={() => {
        if (isSelectable !== false) {
          if (hasRowSelection === 'single') {
            onRowSelected(id, true);
          }
          onRowClicked(id);
        }
      }}
    >
      {tableCells}
    </StyledTableRow>
  );
};

TableBodyRow.propTypes = propTypes;
TableBodyRow.defaultProps = defaultProps;

export default TableBodyRow;
