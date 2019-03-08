import React from 'react';
import PropTypes from 'prop-types';
import { iconGrid, iconFilter } from 'carbon-icons';
import { DataTable, Button } from 'carbon-components-react';
import styled from 'styled-components';

import { TableSearchPropTypes } from '../TablePropTypes';
import { COLORS } from '../../../styles/styles';

const {
  TableToolbar: CarbonTableToolbar,
  TableToolbarContent,
  TableToolbarAction,
  TableBatchActions,
  TableBatchAction,
  TableToolbarSearch,
} = DataTable;

const StyledTableToolbarAction = styled(({ isActive, ...other }) => (
  <TableToolbarAction {...other} />
))`
  &&& {
    :last-of-type {
      padding-right: 0.75rem;
    }

    :not(:focus) > svg {
      fill: ${props => (props.isActive ? COLORS.blue : COLORS.gray)};
    }
  }
`;

// Need to save one px on the right for the focus
const StyledTableToolbarContent = styled(TableToolbarContent)`
  &&& {
    padding-right: 1px;
  }
`;

const propTypes = {
  /** global table options */
  options: PropTypes.shape({
    hasFilter: PropTypes.bool,
    hasSearch: PropTypes.bool,
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
    /** Which toolbar is currently active */
    activeBar: PropTypes.oneOf(['column', 'filter']),
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
    search: TableSearchPropTypes,
  }).isRequired,
};

const TableToolbar = ({
  className,
  options: { hasColumnSelection, hasFilter, hasSearch },
  actions: {
    onCancelBatchAction,
    onApplyBatchAction,
    onClearAllFilters,
    onToggleColumnSelection,
    onToggleFilter,
    onApplySearch,
  },
  tableState: { totalSelected, totalFilters, batchActions, search, activeBar },
}) => (
  <CarbonTableToolbar className={className}>
    {hasSearch ? (
      <TableToolbarSearch
        onChange={event => onApplySearch(event.currentTarget ? event.currentTarget.value : '')}
        {...search}
      />
    ) : null}
    <StyledTableToolbarContent>
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
        <StyledTableToolbarAction
          className="bx--btn--sm"
          icon={iconGrid}
          iconDescription="Column Selection"
          isActive={activeBar === 'column'}
          onClick={onToggleColumnSelection}
        />
      ) : null}
      {hasFilter ? (
        <StyledTableToolbarAction
          className="bx--btn--sm"
          icon={iconFilter}
          iconDescription="Filter"
          isActive={activeBar === 'filter'}
          onClick={onToggleFilter}
        />
      ) : null}
    </StyledTableToolbarContent>
  </CarbonTableToolbar>
);

TableToolbar.propTypes = propTypes;

export default TableToolbar;
