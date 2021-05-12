import React from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'carbon-components-react';

import EmptyState from '../../EmptyState';
import { settings } from '../../../constants/Settings';
import { EmptyStatePropTypes } from '../TablePropTypes';

const { TableBody, TableCell, TableRow } = DataTable;
const { iotPrefix } = settings;

const propTypes = {
  /** The unique id of the table */
  id: PropTypes.string,
  /** Empty state to render, either a custom element or an object */
  emptyState: EmptyStatePropTypes.isRequired,
  totalColumns: PropTypes.number.isRequired,
  isFiltered: PropTypes.bool.isRequired,
  onEmptyStateAction: PropTypes.func,
  testID: PropTypes.string,
};

const defaultProps = {
  id: 'EmptyTable',
  onEmptyStateAction: null,
  testID: '',
};

const EmptyTable = ({
  id,
  totalColumns,
  isFiltered,
  emptyState,
  onEmptyStateAction,
  emptyState: {
    messageWithFilters,
    message,
    buttonLabel,
    buttonLabelWithFilters,
    messageBody,
    messageWithFiltersBody,
  },
  testID,
}) => (
  <TableBody id={id} data-testid={testID}>
    <TableRow className={`${iotPrefix}--empty-table--table-row`}>
      <TableCell colSpan={totalColumns}>
        {React.isValidElement(emptyState) ? (
          emptyState
        ) : (
          <div className="empty-table-cell--default">
            {isFiltered ? (
              <EmptyState
                icon="no-result"
                title={messageWithFilters}
                body={messageWithFiltersBody || ''}
                action={
                  onEmptyStateAction
                    ? {
                        label: buttonLabelWithFilters,
                        onClick: onEmptyStateAction,
                        kind: 'secondary',
                      }
                    : null
                }
              />
            ) : (
              <EmptyState
                icon="empty"
                title={message}
                body={messageBody || ''}
                action={
                  onEmptyStateAction
                    ? {
                        label: buttonLabel,
                        onClick: onEmptyStateAction,
                      }
                    : null
                }
              />
            )}
          </div>
        )}
      </TableCell>
    </TableRow>
  </TableBody>
);

EmptyTable.propTypes = propTypes;
EmptyTable.defaultProps = defaultProps;

export default EmptyTable;
