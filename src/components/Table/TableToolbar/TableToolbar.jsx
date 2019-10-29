import React from 'react';
import PropTypes from 'prop-types';
import IconColumnSelector from '@carbon/icons-react/lib/column/20';
import IconFilter from '@carbon/icons-react/lib/filter/20';
import { DataTable, Button } from 'carbon-components-react';
import styled from 'styled-components';

import { TableSearchPropTypes, defaultI18NPropTypes } from '../TablePropTypes';
import { tableTranslateWithId } from '../../../utils/componentUtilityFunctions';
// import { COLORS } from '../../../styles/styles';

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
  /** id of table */
  tableId: PropTypes.string.isRequired,
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
        icon: PropTypes.node,
        iconDescription: PropTypes.string,
      })
    ),
    search: TableSearchPropTypes,
  }).isRequired,
};

const defaultProps = {
  i18n: {
    ...defaultI18NPropTypes,
  },
};

const TableToolbar = ({
  tableId,
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
    // activeBar,
    customToolbarContent,
    isDisabled,
  },
}) => (
  <StyledCarbonTableToolbar className={className}>
    <StyledTableBatchActions
      onCancel={onCancelBatchAction}
      shouldShowBatchActions={hasRowSelection === 'multi' && totalSelected > 0}
      totalSelected={totalSelected}
      translateWithId={(...args) => tableTranslateWithId(i18n, ...args)}
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
        translateWithId={(...args) => tableTranslateWithId(i18n, ...args)}
        id={`${tableId}-toolbar-search`}
        onChange={event => onApplySearch(event.currentTarget ? event.currentTarget.value : '')}
        disabled={isDisabled}
      />
    ) : null}
    <StyledTableToolbarContent>
      {customToolbarContent || null}
      {totalFilters > 0 ? (
        <Button kind="secondary" onClick={onClearAllFilters}>
          {i18n.clearAllFilters}
        </Button>
      ) : null}
      {hasColumnSelection ? (
        <ToolbarSVGWrapper onClick={onToggleColumnSelection}>
          <IconColumnSelector description={i18n.columnSelectionButtonAria} />
        </ToolbarSVGWrapper>
      ) : null}
      {hasFilter ? (
        <ToolbarSVGWrapper onClick={onToggleFilter}>
          <IconFilter description={i18n.filterButtonAria} />
        </ToolbarSVGWrapper>
      ) : null}
    </StyledTableToolbarContent>
  </StyledCarbonTableToolbar>
);

TableToolbar.propTypes = propTypes;
TableToolbar.defaultProps = defaultProps;

export default TableToolbar;
