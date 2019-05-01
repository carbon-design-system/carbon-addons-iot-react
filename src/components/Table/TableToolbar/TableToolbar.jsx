import React from 'react';
import PropTypes from 'prop-types';
import { iconFilter } from 'carbon-icons';
import IconColumnSelector from '@carbon/icons-react/lib/column/20';
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
    padding-right: 0.75rem;
    display: flex;
    height: 2.5rem;
    width: unset;

    :focus {
      height: calc(2.5rem - 2px);

      > svg {
        fill: ${COLORS.blue};
      }
    }

    :not(:focus) > svg {
      fill: ${props => (props.isActive ? COLORS.blue : COLORS.gray)};
    }
  }
`;

const StyledCarbonTableToolbar = styled(CarbonTableToolbar)`
   {
    &&& {
      width: 100%;
      padding-top: 0.125rem;
    }
  }
`;

// Need to save one px on the right for the focus
const StyledTableToolbarContent = styled(TableToolbarContent)`
  &&& {
    padding-right: 1px;
    align-items: center;
    font-size: 0.875rem;
    > div + * {
      margin-left: 0.75rem;
    }
  }
`;

// add margin to the right of the Clear filters button
const StyledClearFiltersButton = styled(Button)`
  &&& {
    margin-right: 0.5rem;
  }
`;

const propTypes = {
  /** global table options */
  options: PropTypes.shape({
    hasFilter: PropTypes.bool,
    hasSearch: PropTypes.bool,
    hasColumnSelection: PropTypes.bool,
  }).isRequired,

  /** internationalized labels */
  searchPlaceholderText: PropTypes.string,
  clearAllFiltersText: PropTypes.string,
  columnSelectionText: PropTypes.string,
  filterText: PropTypes.string,
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
    /** row selection option */
    hasRowSelection: PropTypes.oneOf(['multi', 'single', false]),
    /** optional content to render inside the toolbar  */
    customToolbarContent: PropTypes.node,
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

const defaultProps = {
  clearAllFiltersText: 'Clear all filters',
  searchPlaceholderText: 'Search',
  columnSelectionText: 'Column selection',
  filterText: 'Filter',
};

const TableToolbar = ({
  className,

  clearAllFiltersText,
  searchPlaceholderText,
  columnSelectionText,
  filterText,
  options: { hasColumnSelection, hasFilter, hasSearch, hasRowSelection },
  actions: {
    onCancelBatchAction,
    onApplyBatchAction,
    onClearAllFilters,
    onToggleColumnSelection,
    onToggleFilter,
    onApplySearch,
  },
  tableState: {
    totalSelected,
    totalFilters,
    batchActions,
    search,
    activeBar,
    customToolbarContent,
  },
}) => (
  <StyledCarbonTableToolbar className={className}>
    {hasSearch ? (
      <TableToolbarSearch
        {...search}
        onChange={event => onApplySearch(event.currentTarget ? event.currentTarget.value : '')}
        placeHolderText={searchPlaceholderText}
      />
    ) : null}
    <StyledTableToolbarContent>
      <TableBatchActions
        onCancel={onCancelBatchAction}
        shouldShowBatchActions={hasRowSelection === 'multi' && totalSelected > 0}
        totalSelected={totalSelected}>
        {batchActions.map(({ id, labelText, ...others }) => (
          <TableBatchAction key={id} onClick={() => onApplyBatchAction(id)} {...others}>
            {labelText}
          </TableBatchAction>
        ))}
      </TableBatchActions>
      {customToolbarContent || null}
      {totalFilters > 0 ? (
        <StyledClearFiltersButton kind="secondary" onClick={onClearAllFilters} small>
          {clearAllFiltersText}
        </StyledClearFiltersButton>
      ) : null}
      {hasColumnSelection ? (
        <StyledTableToolbarAction
          className="bx--btn--sm"
          renderIcon={() => <IconColumnSelector />}
          iconDescription={columnSelectionText}
          isActive={activeBar === 'column'}
          onClick={onToggleColumnSelection}
        />
      ) : null}
      {hasFilter ? (
        <StyledTableToolbarAction
          className="bx--btn--sm"
          icon={iconFilter}
          iconDescription={filterText}
          isActive={activeBar === 'filter'}
          onClick={onToggleFilter}
        />
      ) : null}
    </StyledTableToolbarContent>
  </StyledCarbonTableToolbar>
);

TableToolbar.propTypes = propTypes;
TableToolbar.defaultProps = defaultProps;

export default TableToolbar;
