import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { DataTable, Checkbox } from 'carbon-components-react';
import styled from 'styled-components';
import classnames from 'classnames';

import { settings } from '../../../../constants/Settings';
import RowActionsCell from '../RowActionsCell/RowActionsCell';
import TableCellRenderer from '../../TableCellRenderer/TableCellRenderer';
import {
  RowActionPropTypes,
  RowActionErrorPropTypes,
  TableColumnsPropTypes,
  CellTextOverflowPropType,
} from '../../TablePropTypes';
import { stopPropagationAndCallback } from '../../../../utils/componentUtilityFunctions';
import { COLORS } from '../../../../styles/styles';
import { CELL_TEXT_OVERFLOW } from '../../tableConstants';

const { TableRow, TableExpandRow, TableCell } = DataTable;
const { prefix, iotPrefix } = settings;

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
    hasRowNesting: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        /** If the hierarchy only has 1 nested level of children */
        hasSingleNestedHierarchy: PropTypes.bool,
      }),
    ]),
    hasRowActions: PropTypes.bool,
    shouldExpandOnRowClick: PropTypes.bool,
    cellTextOverflow: CellTextOverflowPropType,
    /** use white-space: pre; css when true */
    preserveCellWhiteSpace: PropTypes.bool,
  }),

  /** The unique row id */
  id: PropTypes.string.isRequired,
  /** The unique id for the table */
  tableId: PropTypes.string.isRequired,
  /** some columns might be hidden, so total columns has the overall total */
  totalColumns: PropTypes.number.isRequired,

  /** contents of the row each object value is a renderable node keyed by column id */
  values: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.node, PropTypes.bool, PropTypes.object, PropTypes.array])
  ).isRequired,

  /** is the row currently selected */
  isSelected: PropTypes.bool,
  /** is the row currently in an indeterminate state, i.e. some but not all children are checked */
  isIndeterminate: PropTypes.bool,
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
    onClearRowError: PropTypes.func,
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
  locale: PropTypes.string,
  rowEditMode: PropTypes.bool,
  singleRowEditMode: PropTypes.bool,
  isSelectable: PropTypes.bool,
  singleRowEditButtons: PropTypes.element,
  /**
   * direction of document
   */
  langDir: PropTypes.oneOf(['ltr', 'rtl']),
  /** shows an additional column that can expand/shrink as the table is resized  */
  showExpanderColumn: PropTypes.bool,
  /**
   * the size passed to the table to set row height
   */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
};

const defaultProps = {
  isSelected: false,
  isIndeterminate: false,
  isExpanded: false,
  selectRowAria: 'Select row',
  overflowMenuAria: 'More actions',
  clickToExpandAria: 'Click to expand.',
  clickToCollapseAria: 'Click to collapse.',
  rowActions: null,
  rowDetails: null,
  nestingLevel: 0,
  nestingChildCount: 0,
  options: { cellTextOverflow: null },
  rowEditMode: false,
  singleRowEditMode: false,
  singleRowEditButtons: null,
  isRowActionRunning: false,
  rowActionsError: null,
  learnMoreText: 'Learn more',
  inProgressText: 'In progress',
  dismissText: 'Dismiss',
  actionFailedText: 'Action failed',
  showExpanderColumn: false,
  langDir: 'ltr',
  locale: 'en',
  isSelectable: undefined,
  size: undefined,
};

const StyledTableRow = styled(({ isSelectable, isEditMode, ...others }) => (
  <TableRow {...others} />
))`
  &&& {
    .${prefix}--checkbox {
      ${(props) => (props.onClick && props.isSelectable !== false ? `cursor: pointer;` : ``)}
    }
    :hover {
      td {
        ${(props) =>
          props.isSelectable === false && !props.isEditMode
            ? `background-color: inherit; color:#565656;border-bottom-color:#dcdcdc;border-top-color:#ffffff;`
            : ``} /* turn off hover states if the row is set not selectable */
      }
      ${(props) =>
        props.isSelectable === false && !props.isEditMode
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
    ${// if single nested hierarchy AND there are children rows (meaning this is a parent),
    // bolden all cells of this row
    (props) =>
      props['data-row-nesting'] &&
      props['data-row-nesting'].hasSingleNestedHierarchy &&
      props['data-child-count'] > 0
        ? `td {
        font-weight: bold
      }`
        : ``}

    ${(props) =>
      props['data-child-count'] === 0 && props['data-row-nesting']
        ? `
    td > button.${prefix}--table-expand__button {
      display: none;
    }
    `
        : `
    td > button.${prefix}--table-expand__button {
      position: relative;
      left: ${props['data-nesting-offset']}px;
    }
    `}
    ${(props) =>
      props['data-nesting-offset'] > 0
        ? `
      td.${prefix}--table-expand {
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
      div .${prefix}--btn--ghost:hover {
        background: ${COLORS.gray20hover};
      }
    }

    ${(props) =>
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

    ${// if single nested hierarchy, bolden all cells of this row
    (props) =>
      props['data-row-nesting'] && props['data-row-nesting'].hasSingleNestedHierarchy
        ? `td {
        font-weight: bold
      }`
        : ``}

    ${(props) =>
      props['data-row-nesting']
        ? `

        td.${prefix}--table-expand, td {
          position: relative;
          border-color: ${COLORS.gray20};
        }
        td > button.${prefix}--table-expand__button {
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

    ${(props) =>
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
      font-weight: bold;
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

    ${(props) =>
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

const StyledNestedSpan = styled.span`
  position: relative;
  left: ${(props) => props.nestingOffset}px;
  display: block;
`;

const TableBodyRow = ({
  id,
  tableId,
  langDir,
  totalColumns,
  ordering,
  columns,
  locale,
  options: {
    hasRowSelection,
    hasRowExpansion,
    hasRowActions,
    hasRowNesting,
    shouldExpandOnRowClick,
    cellTextOverflow,
    preserveCellWhiteSpace,
  },
  tableActions: { onRowSelected, onRowExpanded, onRowClicked, onApplyRowAction, onClearRowError },
  isExpanded,
  isSelected,
  isIndeterminate,
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
  rowEditMode,
  singleRowEditMode,
  singleRowEditButtons,
  showExpanderColumn,
  size,
}) => {
  const isEditMode = rowEditMode || singleRowEditMode;
  const singleSelectionIndicatorWidth = hasRowSelection === 'single' ? 0 : 5;
  // if this a single hierarchy (i.e. only 1 level of nested children), do NOT show the gray offset
  const nestingOffset = hasRowNesting?.hasSingleNestedHierarchy
    ? 0
    : hasRowSelection === 'single'
    ? nestingLevel * 16 - singleSelectionIndicatorWidth
    : nestingLevel * 16;

  const rowSelectionCell =
    hasRowSelection === 'multi' ? (
      <TableCell
        className={`${prefix}--checkbox-table-cell`}
        key={`${id}-row-selection-cell`}
        onChange={isSelectable !== false ? () => onRowSelected(id, !isSelected) : null}
        onClick={(e) => e.stopPropagation()}
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
            indeterminate={isIndeterminate}
            checked={isSelected}
            disabled={isSelectable === false}
          />
        </StyledNestedSpan>
      </TableCell>
    ) : null;

  const firstVisibleColIndex = ordering.findIndex((col) => !col.isHidden);
  const tableCells = (
    <Fragment key={`${tableId}-${id}`}>
      {rowSelectionCell}
      {ordering.map((col, idx) => {
        const matchingColumnMeta = columns && columns.find((column) => column.id === col.columnId);
        // initialColumnWidth for the table body cells is needed for tables that have fixed column widths
        // and table-layout:auto combination so that cell content can be truncated
        const initialColumnWidth = matchingColumnMeta && matchingColumnMeta.width;
        // if this a single hierarchy (i.e. only 1 level of nested children), do NOT show the gray offset
        const offset = firstVisibleColIndex === idx ? nestingOffset : 0;
        const align =
          matchingColumnMeta && matchingColumnMeta.align ? matchingColumnMeta.align : 'start';
        const sortable =
          matchingColumnMeta && matchingColumnMeta.isSortable
            ? matchingColumnMeta.isSortable
            : false;
        return !col.isHidden ? (
          <TableCell
            id={`cell-${tableId}-${id}-${col.columnId}`}
            key={col.columnId}
            data-column={col.columnId}
            data-offset={offset}
            offset={offset}
            align={align}
            className={classnames(`data-table-${align}`, {
              [`${iotPrefix}--table__cell--truncate`]:
                cellTextOverflow === CELL_TEXT_OVERFLOW.TRUNCATE,
              [`${iotPrefix}--table__cell--sortable`]: sortable,
            })}
            width={initialColumnWidth}
          >
            <StyledNestedSpan nestingOffset={offset}>
              {col.editDataFunction && isEditMode ? (
                col.editDataFunction({
                  value: values[col.columnId],
                  columnId: col.columnId,
                  rowId: id,
                  row: values,
                })
              ) : (
                <TableCellRenderer
                  cellTextOverflow={cellTextOverflow}
                  locale={locale}
                  renderDataFunction={col.renderDataFunction}
                  isSortable={col.isSortable}
                  sortFunction={col.sortFunction}
                  isFilterable={col.filter}
                  filterFunction={col.filter?.filterFunction}
                  columnId={col.columnId}
                  rowId={id}
                  row={values}
                  preserveCellWhiteSpace={preserveCellWhiteSpace}
                >
                  {values[col.columnId]}
                </TableCellRenderer>
              )}
            </StyledNestedSpan>
          </TableCell>
        ) : null;
      })}
      {showExpanderColumn ? <TableCell key={`${tableId}-${id}-row-expander-cell`} /> : null}

      {hasRowActions && rowActions ? (
        <RowActionsCell
          id={id}
          langDir={langDir}
          tableId={tableId}
          actions={rowActions}
          isRowActionRunning={isRowActionRunning}
          isRowExpanded={isExpanded && !hasRowNesting}
          showSingleRowEditButtons={singleRowEditMode}
          singleRowEditButtons={singleRowEditButtons}
          overflowMenuAria={overflowMenuAria}
          inProgressText={inProgressText}
          actionFailedText={actionFailedText}
          onApplyRowAction={onApplyRowAction}
          learnMoreText={learnMoreText}
          dismissText={dismissText}
          rowActionsError={rowActionsError}
          onClearError={onClearRowError ? () => onClearRowError(id) : null}
          size={size}
        />
      ) : nestingLevel > 0 && hasRowActions ? (
        <TableCell key={`${tableId}-${id}-row-actions-cell`} />
      ) : undefined}
    </Fragment>
  );
  return hasRowExpansion || hasRowNesting ? (
    isExpanded ? (
      <Fragment key={id}>
        <StyledTableExpandRowExpanded
          ariaLabel={clickToCollapseAria}
          expandIconDescription={clickToCollapseAria}
          isExpanded
          isSelected={isSelected}
          hasRowSelection={hasRowSelection}
          data-row-nesting={hasRowNesting}
          data-nesting-offset={nestingOffset}
          onExpand={(evt) => stopPropagationAndCallback(evt, onRowExpanded, id, false)}
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
          <StyledExpansionTableRow className={`${iotPrefix}--expanded-tablerow`}>
            <TableCell colSpan={totalColumns}>{rowDetails}</TableCell>
          </StyledExpansionTableRow>
        )}
      </Fragment>
    ) : (
      <StyledTableExpandRow
        key={id}
        className={`${iotPrefix}--expanded-tablerow`}
        data-row-nesting={hasRowNesting}
        data-child-count={nestingChildCount}
        data-nesting-offset={nestingOffset}
        ariaLabel={clickToExpandAria}
        expandIconDescription={clickToExpandAria}
        isExpanded={false}
        isSelected={isSelected}
        hasRowSelection={hasRowSelection}
        onExpand={(evt) => stopPropagationAndCallback(evt, onRowExpanded, id, true)}
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
      isEditMode={isEditMode}
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
