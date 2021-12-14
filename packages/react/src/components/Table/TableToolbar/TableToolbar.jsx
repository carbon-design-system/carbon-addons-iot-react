import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Column20,
  Filter20,
  Download20,
  Edit20,
  OverflowMenuVertical20,
} from '@carbon/icons-react';
import { DataTable, Tooltip } from 'carbon-components-react';
import classnames from 'classnames';
import { useLangDirection } from 'use-lang-direction';
import { isNil, pick } from 'lodash-es';

import { OverflowMenuItem } from '../../OverflowMenuItem';
import { OverflowMenu } from '../../OverflowMenu';
import Button from '../../Button';
import deprecate from '../../../internal/deprecate';
import {
  TableSearchPropTypes,
  defaultI18NPropTypes,
  ActiveTableToolbarPropType,
  TableRowPropTypes,
  TableColumnsPropTypes,
  TableFiltersPropType,
  TableOrderingPropType,
  TableToolbarActionsPropType,
} from '../TablePropTypes';
import {
  handleSpecificKeyDown,
  tableTranslateWithId,
} from '../../../utils/componentUtilityFunctions';
import { settings } from '../../../constants/Settings';
import { RuleGroupPropType } from '../../RuleBuilder/RuleBuilderPropTypes';
import useDynamicOverflowMenuItems from '../../../hooks/useDynamicOverflowMenuItems';

import TableToolbarAdvancedFilterFlyout from './TableToolbarAdvancedFilterFlyout';
import TableToolbarSVGButton from './TableToolbarSVGButton';

const { iotPrefix } = settings;

const {
  TableToolbar: CarbonTableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
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
    hasAdvancedFilter: PropTypes.bool,
    hasAggregations: PropTypes.bool,
    /** If true, search is applied as typed. If false, only after 'Enter' is pressed */
    hasFastSearch: PropTypes.bool,
    hasFilter: PropTypes.bool,
    hasSearch: PropTypes.bool,
    hasColumnSelection: PropTypes.bool,
    hasRowEdit: PropTypes.bool,
    hasRowSelection: PropTypes.oneOf(['multi', 'single', false]),
    onApplySearch: PropTypes.func,
    onDownloadCSV: PropTypes.func,
    onApplyAdvancedFilter: PropTypes.func,
    /** Optional boolean to render rowCount in header
     *  NOTE: Deprecated in favor of secondaryTitle for custom use
     */
    hasRowCountInHeader: deprecate(
      PropTypes.bool,
      '\n The prop `hasRowCountInHeader` has been deprecated in favor `secondaryTitle`'
    ),
    // True if use can save/load views
    hasUserViewManagement: PropTypes.bool,
  }).isRequired,
  /** internationalized labels */
  i18n: PropTypes.shape({
    clearAllFilters: PropTypes.string,
    columnSelectionButtonAria: PropTypes.string,
    filterButtonAria: PropTypes.string,
    editButtonAria: PropTypes.string,
    searchLabel: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    batchCancel: PropTypes.string,
    itemsSelected: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    itemSelected: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    filterNone: PropTypes.string,
    filterAscending: PropTypes.string,
    filterDescending: PropTypes.string,
    toggleAggregations: PropTypes.string,
    toolbarLabelAria: PropTypes.string,
    rowCountInHeader: PropTypes.func,
    downloadIconDescription: PropTypes.string,
    /** aria-label applied to the tooltip in the toolbar (if given) */
    toolbarTooltipLabel: PropTypes.string,
  }),
  /**
   * Action callbacks to update tableState
   */
  actions: PropTypes.shape({
    onCancelBatchAction: PropTypes.func,
    onApplyBatchAction: PropTypes.func,
    onClearAllFilters: PropTypes.func,
    onToggleAggregations: PropTypes.func,
    onToggleColumnSelection: PropTypes.func,
    onToggleFilter: PropTypes.func,
    onToggleAdvancedFilter: PropTypes.func,
    onCreateAdvancedFilter: PropTypes.func,
    onChangeAdvancedFilter: PropTypes.func,
    onCancelAdvancedFilter: PropTypes.func,
    onApplyAdvancedFilter: PropTypes.func,
    onShowRowEdit: PropTypes.func,
    onApplySearch: PropTypes.func,
    onDownloadCSV: PropTypes.func,
    onApplyToolbarAction: PropTypes.func,
  }).isRequired,
  /**
   * Inbound tableState
   */
  tableState: PropTypes.shape({
    /** is the toolbar currently disabled */
    isDisabled: PropTypes.bool,
    /** Which toolbar is currently active */
    activeBar: ActiveTableToolbarPropType,
    /** total number of selected rows */
    totalSelected: PropTypes.number,
    totalItemsCount: PropTypes.number,
    advancedFilterFlyoutOpen: PropTypes.bool,
    totalFilters: PropTypes.number,
    filters: TableFiltersPropType,
    columns: TableColumnsPropTypes,
    ordering: TableOrderingPropType,
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
    /** buttons to be shown with when activeBar is 'rowEdit' */
    rowEditBarButtons: PropTypes.node,

    /** a stripped down version of the RuleBuilderFilterPropType */
    advancedFilters: PropTypes.arrayOf(
      PropTypes.shape({
        /** Unique id for particular filter */
        filterId: PropTypes.string.isRequired,
        /** Text for main title of page */
        filterTitleText: PropTypes.string.isRequired,
        filterRules: RuleGroupPropType.isRequired,
      })
    ),
    /** currently selected advanced filters */
    selectedAdvancedFilterIds: PropTypes.arrayOf(PropTypes.string),
    /** toolbar actions that can appear in an overflow menu in the toolbar (same menu as toggle aggregations) */
    toolbarActions: TableToolbarActionsPropType,
  }).isRequired,
  /** Row value data for the body of the table */
  data: TableRowPropTypes.isRequired,

  // TODO: remove deprecated 'testID' in v3
  // eslint-disable-next-line react/require-default-props
  testID: deprecate(
    PropTypes.string,
    `The 'testID' prop has been deprecated. Please use 'testId' instead.`
  ),
  testId: PropTypes.string,
};

const defaultProps = {
  i18n: {
    ...defaultI18NPropTypes,
  },
  secondaryTitle: null,
  tooltip: null,
  testId: '',
};

const TableToolbar = ({
  tableId,
  className,
  i18n,
  secondaryTitle,
  tooltip,
  options: {
    hasAdvancedFilter,
    hasAggregations,
    hasColumnSelection,
    hasFastSearch,
    hasFilter,
    hasSearch,
    hasRowSelection,
    hasRowCountInHeader,
    hasRowEdit,
    hasUserViewManagement,
  },
  actions: {
    onCancelBatchAction,
    onApplyBatchAction,
    onClearAllFilters,
    onToggleAggregations,
    onToggleColumnSelection,
    onToggleFilter,
    onShowRowEdit,
    onApplySearch,
    onDownloadCSV,
    onApplyAdvancedFilter,
    onCancelAdvancedFilter,
    onCreateAdvancedFilter,
    onChangeAdvancedFilter,
    onToggleAdvancedFilter,
    onApplyToolbarAction,
  },
  tableState: {
    advancedFilterFlyoutOpen,
    advancedFilters,
    totalSelected,
    totalFilters,
    batchActions,
    search,
    activeBar,
    customToolbarContent,
    isDisabled,
    totalItemsCount,
    rowEditBarButtons,
    filters,
    selectedAdvancedFilterIds,
    columns,
    ordering,
    toolbarActions,
  },
  data,
  // TODO: remove deprecated 'testID' in v3
  testID,
  testId,
}) => {
  const shouldShowBatchActions = hasRowSelection === 'multi' && totalSelected > 0;
  const langDir = useLangDirection();

  const [isOpen, setIsOpen, renderToolbarOverflowActions] = useDynamicOverflowMenuItems({
    actions: toolbarActions,
    className: `${iotPrefix}--table-toolbar-aggregations__overflow-menu-content`,
    isDisabled,
    onClick: onApplyToolbarAction,
    testId: testID || testId,
  });

  const hasToolbarOverflowActions =
    typeof toolbarActions === 'function' ||
    (toolbarActions?.length > 0 && toolbarActions.some((action) => action.isOverflow));

  const visibleToolbarActions = useMemo(() => {
    if (typeof toolbarActions === 'function') {
      return toolbarActions().filter(({ isOverflow }) => !isOverflow);
    }

    return toolbarActions?.filter(({ isOverflow }) => !isOverflow) ?? [];
  }, [toolbarActions]);

  return (
    <CarbonTableToolbar
      // TODO: remove deprecated 'testID' in v3
      data-testid={testID || testId}
      className={classnames(`${iotPrefix}--table-toolbar`, className)}
      aria-label={i18n.toolbarLabelAria || secondaryTitle ? `${secondaryTitle} Toolbar` : undefined}
    >
      <TableBatchActions
        // TODO: remove deprecated 'testID' in v3
        data-testid={`${testID || testId}-batch-actions`}
        className={`${iotPrefix}--table-batch-actions`}
        onCancel={onCancelBatchAction}
        shouldShowBatchActions={shouldShowBatchActions}
        totalSelected={totalSelected}
        translateWithId={(...args) => tableTranslateWithId(i18n, ...args)}
      >
        {batchActions.map(({ id, labelText, ...others }) => (
          <TableBatchAction
            key={id}
            onClick={() => onApplyBatchAction(id)}
            tabIndex={shouldShowBatchActions ? 0 : -1}
            disabled={!shouldShowBatchActions}
            {...others}
          >
            {labelText}
          </TableBatchAction>
        ))}
      </TableBatchActions>
      {secondaryTitle ? (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for
        <label className={`${iotPrefix}--table-toolbar-secondary-title`}>{secondaryTitle}</label>
      ) : null}
      {
        // Deprecated in favor of secondaryTitle for a more general use-case
        hasRowCountInHeader ? (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for
          <label className={`${iotPrefix}--table-toolbar-secondary-title`}>
            {i18n.rowCountInHeader(totalItemsCount)}
          </label>
        ) : null
      }
      {tooltip && (
        <div className={`${iotPrefix}--table-tooltip-container`}>
          <Tooltip
            triggerId={`card-tooltip-trigger-${tableId}`}
            tooltipId={`card-tooltip-${tableId}`}
            triggerText=""
            iconDescription={i18n.toolbarTooltipLabel}
          >
            {tooltip}
          </Tooltip>
        </div>
      )}
      {activeBar === 'rowEdit' ? (
        <div className={`${iotPrefix}--table-row-edit-actions`}>{rowEditBarButtons}</div>
      ) : (
        <TableToolbarContent
          // TODO: remove deprecated 'testID' in v3
          data-testid={`${testID || testId}-content`}
          className={`${iotPrefix}--table-toolbar-content`}
        >
          {hasSearch ? (
            <TableToolbarSearch
              {...search}
              key={
                // If hasUserViewManagement is active the whole table is regenerated when a new
                // view is loaded so we probably don't need this key-gen fix to preset a search text.
                // The userViewManagement also needs to be able to set the search.defaultValue
                // while typing without loosing input focus.
                hasUserViewManagement
                  ? 'table-toolbar-search'
                  : `table-toolbar-search${search.defaultValue}${search.value}`
              }
              defaultValue={search.defaultValue || search.value}
              className="table-toolbar-search"
              translateWithId={(...args) => tableTranslateWithId(i18n, ...args)}
              id={`${tableId}-toolbar-search`}
              onChange={(event, defaultValue) => {
                const value = event?.target?.value || (defaultValue ?? '');
                if (hasFastSearch) {
                  onApplySearch(value);
                }
              }}
              onKeyDown={
                hasFastSearch
                  ? undefined
                  : handleSpecificKeyDown(['Enter'], (e) => onApplySearch(e.target.value))
              }
              onClear={() => onApplySearch('')}
              onBlur={
                !hasFastSearch
                  ? (e, handleExpand) => {
                      const { value } = e.target;
                      onApplySearch(value);
                      if (!value) {
                        handleExpand(e, false);
                      }
                    }
                  : undefined
              }
              disabled={isDisabled}
              // TODO: remove deprecated 'testID' in v3
              data-testid={`${testID || testId}-search`}
            />
          ) : null}
          {totalFilters > 0 ? (
            <Button
              kind="secondary"
              onClick={onClearAllFilters}
              disabled={isDisabled}
              testId={`${testId}-clear-filters-button`}
            >
              {i18n.clearAllFilters}
            </Button>
          ) : null}
          {onDownloadCSV ? (
            <TableToolbarSVGButton
              onClick={() => {
                // hand back the filtered data
                onDownloadCSV(data);
              }}
              description={i18n.downloadIconDescription}
              testId="download-button"
              renderIcon={Download20}
              disabled={isDisabled}
            />
          ) : null}
          {hasColumnSelection ? (
            <TableToolbarSVGButton
              isActive={activeBar === 'column'}
              onClick={onToggleColumnSelection}
              description={i18n.columnSelectionButtonAria}
              testId="column-selection-button"
              renderIcon={Column20}
              disabled={isDisabled}
            />
          ) : null}
          {hasFilter ? (
            <TableToolbarSVGButton
              isActive={activeBar === 'filter'}
              onClick={onToggleFilter}
              description={i18n.filterButtonAria}
              testId="filter-button"
              renderIcon={Filter20}
              disabled={isDisabled}
            />
          ) : null}
          {hasAdvancedFilter ? (
            <TableToolbarAdvancedFilterFlyout
              actions={{
                onApplyAdvancedFilter,
                onCancelAdvancedFilter,
                onCreateAdvancedFilter,
                onChangeAdvancedFilter,
                onToggleAdvancedFilter,
              }}
              columns={columns.map((column) => ({
                ...column.filter,
                id: column.id,
                name: column.name,
                isFilterable: !isNil(column.filter),
                isMultiselect: column.filter?.isMultiselect,
              }))}
              tableState={{
                filters,
                advancedFilters,
                selectedAdvancedFilterIds,
                advancedFilterFlyoutOpen,
                ordering,
                hasFastFilter: hasAdvancedFilter === 'onKeyPress',
              }}
              i18n={{
                ...pick(
                  i18n,
                  'filterText',
                  'clearFilterText',
                  'clearSelectionText',
                  'openMenuText',
                  'closeMenuText',
                  'applyButtonText',
                  'cancelButtonText',
                  'advancedFilterLabelText',
                  'createNewAdvancedFilterText',
                  'advancedFilterPlaceholderText',
                  'simpleFiltersTabLabel',
                  'advancedFiltersTabLabel'
                ),
              }}
            />
          ) : null}
          {hasRowEdit ? (
            <TableToolbarSVGButton
              isActive={activeBar === 'rowEdit'}
              description={i18n.editButtonAria}
              onClick={onShowRowEdit}
              testId="row-edit-button"
              renderIcon={Edit20}
              disabled={isDisabled}
            />
          ) : null}
          {visibleToolbarActions.map((action) => {
            return (
              <TableToolbarSVGButton
                isActive={action.isActive}
                description={action.labelText || action.iconDescription}
                onClick={(e) => {
                  e.stopPropagation();
                  onApplyToolbarAction(action);
                }}
                testId={`${tableId}-toolbar-actions-button-${action.id}`}
                key={`${tableId}-toolbar-actions-button-${action.id}`}
                renderIcon={action.renderIcon}
                disabled={isDisabled || action.disabled}
              />
            );
          })}
          {hasAggregations || hasToolbarOverflowActions ? (
            <OverflowMenu
              className={`${iotPrefix}--table-toolbar-aggregations__overflow-menu`}
              direction="bottom"
              flipped={langDir === 'ltr'}
              data-testid="table-head--overflow"
              onClick={(e) => e.stopPropagation()}
              renderIcon={OverflowMenuVertical20}
              iconClass={`${iotPrefix}--table-toolbar-aggregations__overflow-icon`}
              onOpen={() => setIsOpen(true)}
              onClose={() => setIsOpen(false)}
            >
              {hasAggregations && (
                <OverflowMenuItem
                  data-testid={`${testID || testId}-toolbar-overflow-menu-item-aggregations`}
                  itemText={i18n.toggleAggregations}
                  key="table-aggregations-overflow-item"
                  onClick={() => {
                    setIsOpen(false);
                    onToggleAggregations();
                  }}
                  disabled={isDisabled}
                />
              )}
              {isOpen && renderToolbarOverflowActions()}

              {
                /**
                 * a placeholder node to ensure the menu will always open. If there are no children,
                 * the renderToolbarOverflowAction method above will never fire, because the
                 * OverflowMenu doesn't open properly if no children are provided.
                 */
                !isOpen && <OverflowMenuItem itemText="" disabled />
              }
            </OverflowMenu>
          ) : null}
          {
            // Default card header actions should be to the right of the table-specific actions
            customToolbarContent || null
          }
        </TableToolbarContent>
      )}
    </CarbonTableToolbar>
  );
};

TableToolbar.propTypes = propTypes;
TableToolbar.defaultProps = defaultProps;

export default TableToolbar;
