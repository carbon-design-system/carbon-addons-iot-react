import React from 'react';
import PropTypes from 'prop-types';
import { Column20, Filter20, Download20 } from '@carbon/icons-react';
import { DataTable, Button, Tooltip } from 'carbon-components-react';
import styled from 'styled-components';

import deprecate from '../../../internal/deprecate';
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

const ToolbarSVGWrapper = styled.div`
  &&& {
    background: transparent;
    border: none;
    display: flex;
    cursor: pointer;
    height: auto;
    min-width: 3rem;
    outline: 2px solid transparent;

    :hover {
      background: #e5e5e5;
    }

    &:active,
    &:focus {
      outline: 2px solid #0062ff;
      outline-offset: -2px;
    }

    svg {
      margin: 0 auto;
      height: auto;
      width: auto;
      fill: #525252;
    }
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

const StyledTooltipContainer = styled.div`
  padding: 1rem 0;
`;

const propTypes = {
  /** id of table */
  tableId: PropTypes.string.isRequired,
  secondaryTitle: PropTypes.string,
  tooltip: PropTypes.node,
  /** global table options */
  options: PropTypes.shape({
    hasFilter: PropTypes.bool,
    hasSearch: PropTypes.bool,
    hasColumnSelection: PropTypes.bool,
    /** Optional boolean to render rowCount in header
     *  NOTE: Deprecated in favor of secondaryTitle for custom use
     */
    hasRowCountInHeader: deprecate(
      PropTypes.bool,
      '\n The prop `hasRowCountInHeader` has been deprecated in favor `secondaryTitle`'
    ),
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
    totalItemsCount: PropTypes.number,
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
  secondaryTitle: null,
  tooltip: null,
};

const TableToolbar = ({
  tableId,
  className,
  i18n,
  secondaryTitle,
  tooltip,
  options: { hasColumnSelection, hasFilter, hasSearch, hasRowSelection, hasRowCountInHeader },
  actions: {
    onCancelBatchAction,
    onApplyBatchAction,
    onClearAllFilters,
    onToggleColumnSelection,
    onToggleFilter,
    onApplySearch,
    onDownloadCSV,
  },
  tableState: {
    totalSelected,
    totalFilters,
    batchActions,
    search,
    // activeBar,
    customToolbarContent,
    isDisabled,
    totalItemsCount,
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
    {secondaryTitle ? (
      <label // eslint-disable-line
        className="table-toolbar-secondary-title"
      >
        {secondaryTitle}
      </label>
    ) : null}
    {// Deprecated in favor of secondaryTitle for a more general use-case
    hasRowCountInHeader ? (
      <label // eslint-disable-line
        className="table-toolbar-secondary-title"
      >
        {i18n.rowCountInHeader(totalItemsCount)}
      </label>
    ) : null}
    {tooltip && (
      <StyledTooltipContainer>
        <Tooltip
          triggerId={`card-tooltip-trigger-${tableId}`}
          tooltipId={`card-tooltip-${tableId}`}
          triggerText=""
        >
          {tooltip}
        </Tooltip>
      </StyledTooltipContainer>
    )}
    <StyledTableToolbarContent>
      {hasSearch ? (
        <TableToolbarSearch
          {...search}
          className="table-toolbar-search"
          translateWithId={(...args) => tableTranslateWithId(i18n, ...args)}
          id={`${tableId}-toolbar-search`}
          onChange={event => onApplySearch(event.currentTarget ? event.currentTarget.value : '')}
          disabled={isDisabled}
        />
      ) : null}
      {totalFilters > 0 ? (
        <Button kind="secondary" onClick={onClearAllFilters}>
          {i18n.clearAllFilters}
        </Button>
      ) : null}
      {onDownloadCSV ? (
        <ToolbarSVGWrapper onClick={onDownloadCSV}>
          <Download20 description={i18n.downloadIconDescription} />
        </ToolbarSVGWrapper>
      ) : null}
      {hasColumnSelection ? (
        <ToolbarSVGWrapper onClick={onToggleColumnSelection}>
          <Column20 description={i18n.columnSelectionButtonAria} />
        </ToolbarSVGWrapper>
      ) : null}
      {hasFilter ? (
        <ToolbarSVGWrapper onClick={onToggleFilter}>
          <Filter20 description={i18n.filterButtonAria} />
        </ToolbarSVGWrapper>
      ) : null}

      {// Default card header actions should be to the right of the table-specific actions
      customToolbarContent || null}
    </StyledTableToolbarContent>
  </StyledCarbonTableToolbar>
);

TableToolbar.propTypes = propTypes;
TableToolbar.defaultProps = defaultProps;

export default TableToolbar;
