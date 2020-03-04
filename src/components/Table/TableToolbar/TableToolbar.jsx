import React from 'react';
import PropTypes from 'prop-types';
import { Column20, Filter20, Download20 } from '@carbon/icons-react';
import { DataTable, Button, Tooltip } from 'carbon-components-react';
import classNames from 'classnames';

import { keyCodes } from '../../../constants/KeyCodeConstants';
import deprecate from '../../../internal/deprecate';
import { TableSearchPropTypes, defaultI18NPropTypes } from '../TablePropTypes';
import { tableTranslateWithId } from '../../../utils/componentUtilityFunctions';
import { settings } from '../../../constants/Settings';
import TableToolbarSearch from '../TableToolbarSearch/TableToolbarSearch';

const { iotPrefix } = settings;

const {
  TableToolbar: CarbonTableToolbar,
  TableToolbarContent,
  // TableToolbarAction,
  TableBatchActions,
  TableBatchAction,
} = DataTable;

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
  <CarbonTableToolbar className={classNames(`${iotPrefix}--table-toolbar`, className)}>
    <TableBatchActions
      className={`${iotPrefix}--table-batch-actions`}
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
    </TableBatchActions>
    {secondaryTitle ? (
      <label // eslint-disable-line
        className={`${iotPrefix}--table-toolbar-secondary-title`}
      >
        {secondaryTitle}
      </label>
    ) : null}
    {// Deprecated in favor of secondaryTitle for a more general use-case
    hasRowCountInHeader ? (
      <label // eslint-disable-line
        className={`${iotPrefix}--table-toolbar-secondary-title`}
      >
        {i18n.rowCountInHeader(totalItemsCount)}
      </label>
    ) : null}
    {tooltip && (
      <div className={`${iotPrefix}--table-tooltip-container`}>
        <Tooltip
          triggerId={`card-tooltip-trigger-${tableId}`}
          tooltipId={`card-tooltip-${tableId}`}
          triggerText=""
        >
          {tooltip}
        </Tooltip>
      </div>
    )}
    <TableToolbarContent className={`${iotPrefix}--table-toolbar-content`}>
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
        <div
          className={`${iotPrefix}--tooltip-svg-wrapper`}
          onClick={onDownloadCSV}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.keyCode === keyCodes.ENTER) onDownloadCSV();
          }}
          data-testid="download-button"
        >
          <Download20 description={i18n.downloadIconDescription} />
        </div>
      ) : null}
      {hasColumnSelection ? (
        <div
          className={`${iotPrefix}--tooltip-svg-wrapper`}
          onClick={onToggleColumnSelection}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.keyCode === keyCodes.ENTER) onToggleColumnSelection();
          }}
          data-testid="column-selection-button"
        >
          <Column20 description={i18n.columnSelectionButtonAria} />
        </div>
      ) : null}
      {hasFilter ? (
        <div
          className={`${iotPrefix}--tooltip-svg-wrapper`}
          onClick={onToggleFilter}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.keyCode === keyCodes.ENTER) onToggleFilter();
          }}
          data-testid="filter-button"
        >
          <Filter20 description={i18n.filterButtonAria} />
        </div>
      ) : null}

      {// Default card header actions should be to the right of the table-specific actions
      customToolbarContent || null}
    </TableToolbarContent>
  </CarbonTableToolbar>
);

TableToolbar.propTypes = propTypes;
TableToolbar.defaultProps = defaultProps;

export default TableToolbar;
