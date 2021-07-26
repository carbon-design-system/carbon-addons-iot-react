import React from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'carbon-components-react';

import EmptyState from '../../EmptyState';
import { settings } from '../../../constants/Settings';
import { EmptyStatePropTypes } from '../TablePropTypes';
import deprecate from '../../../internal/deprecate';

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
  // TODO: remove deprecated 'testID' in v3
  // eslint-disable-next-line react/require-default-props
  testID: deprecate(
    PropTypes.string,
    `The 'testID' prop has been deprecated. Please use 'testId' instead.`
  ),
  testId: PropTypes.string,
};

const defaultProps = {
  id: 'EmptyTable',
  onEmptyStateAction: null,
  testId: '',
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
  // TODO: remove deprecated 'testID' in v3
  testID,
  testId,
}) => (
  <TableBody
    id={id}
    // TODO: remove deprecated 'testID' in v3
    data-testid={testID || testId}
  >
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
