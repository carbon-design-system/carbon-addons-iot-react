import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, Button } from 'carbon-components-react';
import { Bee32 } from '@carbon/icons-react';

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
    <TableRow className={`${iotPrefix}--empty-table--table-row`}>
      <TableCell colSpan={totalColumns}>
        {React.isValidElement(emptyState) ? (
          emptyState
        ) : (
          <div className="empty-table-cell--default">
            <Bee32 />
            <p>{isFiltered && messageWithFilters ? messageWithFilters : message}</p>
            {onEmptyStateAction ? (
              <Button onClick={onEmptyStateAction}>
                {isFiltered ? buttonLabelWithFilters : buttonLabel}
              </Button>
            ) : null}
          </div>
        )}
      </TableCell>
    </TableRow>
  </TableBody>
);

EmptyTable.propTypes = propTypes;
EmptyTable.defaultProps = defaultProps;

export default EmptyTable;
