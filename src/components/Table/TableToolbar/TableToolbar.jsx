import React from 'react';
import PropTypes from 'prop-types';
import { iconGrid, iconFilter } from 'carbon-icons';
import { DataTable, Button } from 'carbon-components-react';

const {
  TableToolbar: CarbonTableToolbar,
  TableToolbarContent,
  TableToolbarAction,
  TableBatchActions,
  TableBatchAction,
} = DataTable;

const propTypes = {
  /** global table options */
  options: PropTypes.shape({
    hasFilter: PropTypes.bool,
    hasColumnSelection: PropTypes.bool,
  }).isRequired,
  /**
   * Action callbacks to update tableState
   */
  actions: PropTypes.shape({
    onCancelBatchAction: PropTypes.func,
    onApplyBatchAction: PropTypes.func,
    onClearAllFilters: PropTypes.func,
    onToggleColumnSelection: PropTypes.func,
    onToggleFilter: PropTypes.func,
  }).isRequired,
  /**
   * Inbound tableState
   */
  tableState: PropTypes.shape({
    /** total number of selected rows */
    totalSelected: PropTypes.number,
    /** available batch actions */
    batchActions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        labelText: PropTypes.string.isRequired,
        icon: PropTypes.oneOfType([
          PropTypes.shape({
            width: PropTypes.string,
            height: PropTypes.string,
            viewBox: PropTypes.string.isRequired,
            svgData: PropTypes.object.isRequired,
          }),
          PropTypes.string,
        ]),
        iconDescription: PropTypes.string,
      })
    ),
  }).isRequired,
};

const TableToolbar = ({
  options: { hasColumnSelection, hasFilter },
  actions: {
    onCancelBatchAction,
    onApplyBatchAction,
    onClearAllFilters,
    onToggleColumnSelection,
    onToggleFilter,
  },
  tableState: { totalSelected, totalFilters, batchActions },
}) => (
  <CarbonTableToolbar>
    <TableToolbarContent>
      <TableBatchActions
        onCancel={onCancelBatchAction}
        shouldShowBatchActions={totalSelected > 0}
        totalSelected={totalSelected}>
        {batchActions.map(i => (
          <TableBatchAction key={i.id} onClick={() => onApplyBatchAction(i.id)} icon={i.icon}>
            {i.labelText}
          </TableBatchAction>
        ))}
      </TableBatchActions>
      {totalFilters > 0 ? ( // TODO: translate button
        <Button kind="secondary" onClick={onClearAllFilters} small>
          Clear All Filters
        </Button>
      ) : null}
      {hasColumnSelection ? (
        <TableToolbarAction
          className="bx--btn--sm"
          icon={iconGrid}
          iconDescription="Column Selection"
          onClick={onToggleColumnSelection}
        />
      ) : null}
      {hasFilter ? (
        <TableToolbarAction
          className="bx--btn--sm"
          icon={iconFilter}
          iconDescription="Filter"
          onClick={onToggleFilter}
        />
      ) : null}
    </TableToolbarContent>
  </CarbonTableToolbar>
);

TableToolbar.propTypes = propTypes;

export default TableToolbar;
