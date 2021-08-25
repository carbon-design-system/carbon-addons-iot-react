import React from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'carbon-components-react';
import { ArrowDown16 } from '@carbon/icons-react';
import styled from 'styled-components';

import { settings } from '../../../../constants/Settings';

const { TableRow, TableCell } = DataTable;
const { prefix } = settings;

const propTypes = {
  /** The unique row id */
  id: PropTypes.string.isRequired,
  /** The unique id for the table */
  tableId: PropTypes.string.isRequired,
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
  /** offset level if row is nested */
  nestingLevel: PropTypes.number,
  /** tableActions */
  tableActions: PropTypes.shape({
    onRowLoadMore: PropTypes.func,
  }).isRequired,
  /** I18N label for load more */
  loadMoreText: PropTypes.string,
};

const defaultProps = {
  loadMoreText: 'Load more',

  nestingLevel: 0,
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

const StyledTableCell = styled(({ ...props }) => <TableCell {...props} />)`
  &&& {
    cursor: pointer;
    text-align: center;
  }
`;

const StyledSpan = styled(({ ...props }) => <span {...props} />)`
  &&& {
    color: #0f62fe;
    svg {
      vertical-align: middle;
    }
  }
`;

const TableBodyLoadMoreRow = ({
  id,
  tableId,
  ordering,
  tableActions: { onRowLoadMore },
  loadMoreText,
  nestingLevel,
}) => {
  const tableCells = (
    <>
      <StyledTableCell
        key={`${tableId}-${id}-row-load-more-cell`}
        colSpan={ordering.length + nestingLevel + 1}
        onClick={() => onRowLoadMore(id)}
      >
        <StyledSpan>
          {loadMoreText} &nbsp;
          <ArrowDown16 />
        </StyledSpan>
      </StyledTableCell>
    </>
  );

  return (
    <StyledTableRow key={id} isSelected={false} isSelectable isEditMode={false}>
      {tableCells}
    </StyledTableRow>
  );
};

TableBodyLoadMoreRow.propTypes = propTypes;
TableBodyLoadMoreRow.defaultProps = defaultProps;

export default TableBodyLoadMoreRow;
