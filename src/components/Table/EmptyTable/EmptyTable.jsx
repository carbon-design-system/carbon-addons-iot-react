import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, Button } from 'carbon-components-react';
import styled from 'styled-components';
import Bee32 from '@carbon/icons-react/lib/bee/32';

import { EmptyStatePropTypes } from '../TablePropTypes';

const { TableBody, TableCell, TableRow } = DataTable;

const StyledEmptyTableRow = styled(TableRow)`
  &&& {
    height: calc(100% - 3rem);
    &:hover td {
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

    td {
      /* if the table is empty, remove border */
      border-bottom: unset;
    }
  }
`;

const propTypes = {
  /** The unique id of the table */
  id: PropTypes.string,
  /** Empty state to render, either a custom element or an object */
  emptyState: EmptyStatePropTypes.isRequired,
  totalColumns: PropTypes.number.isRequired,
  isFiltered: PropTypes.bool.isRequired,
  onEmptyStateAction: PropTypes.func,
};

const defaultProps = {
  id: 'EmptyTable',
  onEmptyStateAction: null,
};

const EmptyTable = ({
  id,
  totalColumns,
  isFiltered,
  emptyState,
  onEmptyStateAction,
  emptyState: { messageWithFilters, message, buttonLabel, buttonLabelWithFilters },
}) => (
  <TableBody id={id}>
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
