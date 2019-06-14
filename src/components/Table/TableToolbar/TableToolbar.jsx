import React from 'react';
import PropTypes from 'prop-types';
// import { iconFilter } from 'carbon-icons';
import IconColumnSelector from '@carbon/icons-react/lib/column/20';
import IconFilter from '@carbon/icons-react/lib/filter/20';
import { DataTable, Button } from 'carbon-components-react';
import styled from 'styled-components';

import { TableSearchPropTypes } from '../TablePropTypes';
// import { COLORS } from '../../../styles/styles';
// import ButtonEnhanced from '../../ButtonEnhanced';

const {
  TableToolbar: CarbonTableToolbar,
  TableToolbarContent,
  // TableToolbarAction,
  TableBatchActions,
  TableBatchAction,
  TableToolbarSearch,
} = DataTable;

const ToolbarSVGWrapper = styled.button`
  &&& {
    background: transparent;
    border: none;
    display: flex;
    cursor: pointer;
    height: 3rem;
    width: 3rem;
    padding: 1rem;
    outline: 2px solid transparent;

    :hover {
      background: #e5e5e5;
    }

    &:active,
    &:focus {
      outline: 2px solid #0062ff;
      outline-offset: -2px;
    }
  }
`;

const StyledToolbarSearch = styled(TableToolbarSearch)`
  &&& {
    flex-grow: 2;
  }
`;

const StyledCarbonTableToolbar = styled(CarbonTableToolbar)`
  &&& {
    width: 100%;
    padding-top: 0.125rem;
  }
`;

// Need to save one px on the right for the focus
const StyledTableToolbarContent = styled(TableToolbarContent)`
  &&& {
    flex: 1;
    font-size: 0.875rem;
  }
`;

const StyledTableBatchActions = styled(TableBatchActions)`
  z-index: 3;

  & + .bx--toolbar-action {
    padding: 0;
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
        icon: PropTypes.node,
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
    // activeBar,
    customToolbarContent,
  },
}) => (
  <StyledCarbonTableToolbar className={className}>
    <StyledTableBatchActions
      onCancel={onCancelBatchAction}
      shouldShowBatchActions={hasRowSelection === 'multi' && totalSelected > 0}
      totalSelected={totalSelected}
    >
      {batchActions.map(({ id, labelText, ...others }) => (
        <TableBatchAction key={id} onClick={() => onApplyBatchAction(id)} {...others}>
          {labelText}
        </TableBatchAction>
      ))}
    </StyledTableBatchActions>
    {hasSearch ? (
      <StyledToolbarSearch
        {...search}
        onChange={event => onApplySearch(event.currentTarget ? event.currentTarget.value : '')}
        placeHolderText={searchPlaceholderText}
      />
    ) : null}
    <StyledTableToolbarContent>
      {customToolbarContent || null}
      {totalFilters > 0 ? (
        <Button kind="secondary" onClick={onClearAllFilters}>
          {clearAllFiltersText}
        </Button>
      ) : null}
      {hasColumnSelection ? (
        <ToolbarSVGWrapper onClick={onToggleColumnSelection}>
          <IconColumnSelector description={columnSelectionText} />
        </ToolbarSVGWrapper>
      ) : null}
      {hasFilter ? (
        <ToolbarSVGWrapper onClick={onToggleFilter}>
          <IconFilter description={filterText} />
        </ToolbarSVGWrapper>
      ) : null}
    </StyledTableToolbarContent>
  </StyledCarbonTableToolbar>
);

TableToolbar.propTypes = propTypes;
TableToolbar.defaultProps = defaultProps;

export default TableToolbar;
