import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, Button } from 'carbon-components-react';
import styled from 'styled-components';
import { Bee32 } from '@carbon/icons-react';

import { COLORS } from '../../../styles/styles';
import { EmptyStatePropTypes } from '../TablePropTypes';

const { TableBody, TableCell, TableRow } = DataTable;

const StyledEmptyTableRow = styled(TableRow)`
  &&& {
    &:hover td {
      border: 1px solid ${COLORS.lightGrey};
      background: inherit;
    }
    .empty-table-cell--default {
      display: flex;
      align-items: center;
      justify-content: middle;
      flex-direction: column;
      padding: 3rem;

      svg {
        margin: 1rem;
      }

      & > * {
        margin: 0.5rem;
      }
    }
  }
`;

const propTypes = {
  /** Empty state to render, either a custom element or an object */
  emptyState: EmptyStatePropTypes.isRequired,
  totalColumns: PropTypes.number.isRequired,
  isFiltered: PropTypes.bool.isRequired,
  onEmptyStateAction: PropTypes.func,
};

const defaultProps = {
  onEmptyStateAction: null,
};

const EmptyTable = ({
  totalColumns,
  isFiltered,
  emptyState,
  onEmptyStateAction,
  emptyState: { messageWithFilters, message, buttonLabel, buttonLabelWithFilters },
}) => (
  <TableBody>
    <StyledEmptyTableRow>
      <TableCell colSpan={totalColumns}>
        {React.isValidElement(emptyState) ? (
          emptyState
        ) : (
          <div className="empty-table-cell--default">
            <Bee32 />
            <p>{isFiltered && messageWithFilters ? messageWithFilters : message}</p>
            {buttonLabel && onEmptyStateAction ? (
              <Button onClick={onEmptyStateAction}>
                {isFiltered && buttonLabelWithFilters ? buttonLabelWithFilters : buttonLabel}
              </Button>
            ) : null}
          </div>
        )}
      </TableCell>
    </StyledEmptyTableRow>
  </TableBody>
);

EmptyTable.propTypes = propTypes;
EmptyTable.defaultProps = defaultProps;

export default EmptyTable;
