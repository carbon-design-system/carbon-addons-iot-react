import React from 'react';
import PropTypes from 'prop-types';
import IconColumnSelector from '@carbon/icons-react/lib/column/20';
import IconFilter from '@carbon/icons-react/lib/filter/20';
import { DataTable, Button } from 'carbon-components-react';
import styled from 'styled-components';
import { sortStates } from 'carbon-components-react/lib/components/DataTable/state/sorting';

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
      padding-top: 0.25rem;
    }
  }
`;

// Need to save one px on the right for the focus
const StyledTableToolbarContent = styled(TableToolbarContent)`
  &&& {
    padding-right: 1px;
    align-items: center;
    font-size: 0.875rem;
    height: 2.25rem;
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
  i18n: PropTypes.shape({
    clearAllFilters: PropTypes.string,
    columnSelectionButtonAria: PropTypes.string,
    filterButtonAria: PropTypes.string,
    searchLabel: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    batchCancel: PropTypes.string,
    itemsSelected: PropTypes.string,
    itemSelected: PropTypes.string,
    filterNone: PropTypes.string,
    filterAscending: PropTypes.string,
    filterDescending: PropTypes.string,
  }),
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
    /** is the toolbar currently disabled */
    isDisabled: PropTypes.bool,
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
  i18n: {
    clearAllFilters: 'Clear all filters',
    columnSelectionButtonAria: 'Column selection',
    filterButtonAria: 'Filter',
    searchLabel: 'Search',
    searchPlaceholder: 'Search',
    batchCancel: 'Cancel',
    itemsSelected: 'items selected',
    itemSelected: 'item selected',
    filterNone: 'Unsort rows by this header',
    filterAscending: 'Sort rows by this header in ascending order',
    filterDescending: 'Sort rows by this header in descending order',
  },
};

const translateWithId = (i18n, id, state) => {
  const { batchCancel, itemsSelected, itemSelected } = i18n;
  switch (id) {
    case 'carbon.table.batch.cancel':
      return batchCancel;
    case 'carbon.table.batch.items.selected':
      return `${state.totalSelected} ${itemsSelected}`;
    case 'carbon.table.batch.item.selected':
      return `${state.totalSelected} ${itemSelected}`;
    case 'carbon.table.toolbar.search.label':
      return i18n.searchLabel;
    case 'carbon.table.toolbar.search.placeholder':
      return i18n.searchPlaceholder;
    case 'carbon.table.header.icon.description':
      if (state.isSortHeader) {
        // When transitioning, we know that the sequence of states is as follows:
        // NONE -> ASC -> DESC -> NONE
        if (state.sortDirection === sortStates.NONE) {
          return i18n.filterAscending;
        }
        if (state.sortDirection === sortStates.ASC) {
          return i18n.filterDescending;
        }

        return i18n.filterNone;
      }
      return i18n.filterAscending;
    default:
      return '';
  }
};

const TableToolbar = ({
  className,
  i18n,
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
    isDisabled,
  },
}) => (
  <StyledCarbonTableToolbar className={className}>
    {hasSearch ? (
      <TableToolbarSearch
        {...search}
        translateWithId={(...args) => translateWithId(i18n, ...args)}
        onChange={event => onApplySearch(event.currentTarget ? event.currentTarget.value : '')}
        disabled={isDisabled}
      />
    ) : null}
    <StyledTableToolbarContent>
      <TableBatchActions
        onCancel={onCancelBatchAction}
        shouldShowBatchActions={hasRowSelection === 'multi' && totalSelected > 0}
        totalSelected={totalSelected}
        translateWithId={(...args) => translateWithId(i18n, ...args)}
      >
        {batchActions.map(({ id, labelText, ...others }) => (
          <TableBatchAction key={id} onClick={() => onApplyBatchAction(id)} {...others}>
            {labelText}
          </TableBatchAction>
        ))}
      </TableBatchActions>
      {customToolbarContent || null}
      {totalFilters > 0 ? (
        <StyledClearFiltersButton kind="secondary" onClick={onClearAllFilters} small>
          {i18n.clearAllFilters}
        </StyledClearFiltersButton>
      ) : null}
      {hasColumnSelection ? (
        <StyledTableToolbarAction
          className="bx--btn--sm"
          renderIcon={() => <IconColumnSelector />}
          iconDescription={i18n.columnSelectionButtonAria}
          isActive={activeBar === 'column'}
          onClick={onToggleColumnSelection}
          disabled={isDisabled}
        />
      ) : null}
      {hasFilter ? (
        <StyledTableToolbarAction
          className="bx--btn--sm"
          renderIcon={() => <IconFilter />}
          iconDescription={i18n.filterButtonAria}
          isActive={activeBar === 'filter'}
          onClick={onToggleFilter}
          disabled={isDisabled}
        />
      ) : null}
    </StyledTableToolbarContent>
  </StyledCarbonTableToolbar>
);

TableToolbar.propTypes = propTypes;
TableToolbar.defaultProps = defaultProps;

export default TableToolbar;
