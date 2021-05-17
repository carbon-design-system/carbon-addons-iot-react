import React from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'carbon-components-react';

import EmptyState from '../../EmptyState';
import { settings } from '../../../constants/Settings';

const { TableBody, TableCell, TableRow } = DataTable;
const { iotPrefix } = settings;

const propTypes = {
  /** The unique id of the table */
  id: PropTypes.string,
  testID: PropTypes.string,
  /** set of internationalized labels */
  i18n: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element])
  ).isRequired,
  totalColumns: PropTypes.number.isRequired,
  /** Empty error state to render */
  errorState: PropTypes.element,
  error: PropTypes.string,
  onErrorStateAction: PropTypes.func,
};

const defaultProps = {
  id: 'ErrorTable',
  testID: 'ErrorTable',
  error: null,
  errorState: null,
  onErrorStateAction: null,
};

const ErrorTable = ({ id, testID, i18n, totalColumns, error, errorState, onErrorStateAction }) => (
  <TableBody id={id} data-testid={testID}>
    <TableRow className={`${iotPrefix}--empty-table--table-row`}>
      <TableCell colSpan={totalColumns}>
        {React.isValidElement(errorState) ? (
          errorState
        ) : (
          <div className="empty-table-cell--default">
            <EmptyState
              icon="error"
              title={i18n.tableErrorStateTitle}
              body={error || ''}
              action={
                onErrorStateAction
                  ? {
                      label: i18n.buttonLabelOnTableError,
                      onClick: onErrorStateAction,
                      kind: 'secondary',
                    }
                  : null
              }
            />
          </div>
        )}
      </TableCell>
    </TableRow>
  </TableBody>
);

ErrorTable.propTypes = propTypes;
ErrorTable.defaultProps = defaultProps;

export default ErrorTable;
