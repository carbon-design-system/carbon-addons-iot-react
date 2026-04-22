import React, { useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Column, Filter, Download, Edit, OverflowMenuVertical } from '@carbon/react/icons';
import {
  TableToolbar as CarbonTableToolbar,
  TableToolbarContent,
  TableBatchActions,
  TableBatchAction,
  OverflowMenuItem,
} from '@carbon/react';
import classnames from 'classnames';
import { isNil, pick } from 'lodash-es';

import { useLangDirection } from '../../../utils/useLangDirection';
import { Tooltip } from '../../Tooltip';
import { OverflowMenu } from '../../OverflowMenu';
import Button from '../../Button';
import deprecate from '../../../internal/deprecate';
import {
  TableSearchPropTypes,
  defaultI18NPropTypes,
  ActiveTableToolbarPropType,
  TableColumnsPropTypes,
  TableFiltersPropType,
  TableOrderingPropType,
  TableToolbarActionsPropType,
  TableRowsPropTypes,
  TableSharedOverflowMenuPropTypes,
  TableSharedActionPropTypes,
} from '../TablePropTypes';
import { tableTranslateWithId } from '../../../utils/componentUtilityFunctions';
import { settings } from '../../../constants/Settings';
import { RuleGroupPropType } from '../../RuleBuilder/RuleBuilderPropTypes';
import useDynamicOverflowMenuItems from '../../../hooks/useDynamicOverflowMenuItems';
import useResponsiveInlineCount from '../../../hooks/useResponsiveInlineCount';
import { renderTableOverflowItemText } from '../tableUtilities';

import TableToolbarAdvancedFilterFlyout from './TableToolbarAdvancedFilterFlyout';
import TableToolbarSVGButton from './TableToolbarSVGButton';
import TableToolbarSearch from './TableToolbarSearch';

const { iotPrefix } = settings;

const propTypes = {
  /** id of table */
  tableId: PropTypes.string.isRequired,
  secondaryTitle: PropTypes.string,
  tooltip: PropTypes.node,
  /** global table options */
  options: PropTypes.shape({
    hasAdvancedFilter: PropTypes.bool,
    hasAggregations: PropTypes.bool,
    /* option to hide batch action toolbar */
    hasBatchActionToolbar: PropTypes.bool,
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
    /** button label for batch action overflow menu */
    batchActionsOverflowMenuText: PropTypes.string,
    /** I18N label for search icon in toolbar */
    toolbarSearchIconDescription: PropTypes.string,
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
    onSearchExpand: PropTypes.func,
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
      PropTypes.oneOfType([
        PropTypes.shape({
          ...TableSharedActionPropTypes,
          iconDescription: PropTypes.string,
        }),
        PropTypes.shape({
          ...TableSharedOverflowMenuPropTypes,
          iconDescription: PropTypes.string,
        }),
      ])
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
    /** force hide Clear all filters button in toolbar */
    hideClearAllFiltersButton: PropTypes.bool,
  }).isRequired,
  /** Row value data for the body of the table */
  data: TableRowsPropTypes.isRequired,

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
    hasBatchActionToolbar,
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
    onSearchExpand,
  },
  tableState: {
    advancedFilterFlyoutOpen,
    advancedFilters,
    totalSelected,
    totalFilters,
    batchActions,
    search: searchProp,
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
    hideClearAllFiltersButton,
  },
  data,
  // TODO: remove deprecated 'testID' in v3
  testID,
  testId,
}) => {
  const shouldShowBatchActions = hasRowSelection === 'multi' && totalSelected > 0;
  const langDir = useLangDirection();
  const tableToolbarRef = useRef(null);
  const batchActionsRef = useRef(null);
  const previousFocusedElement = useRef(null);
  const toolbarContentRef = useRef(null);
  const batchOverflowMenuRef = useRef(null);
  const batchActionsVisibleRef = useRef(null);
  const batchActionsLayoutRef = useRef(null);
  const [isBatchOverflowOpen, setIsBatchOverflowOpen] = React.useState(false);

  // Function to restore focus to the previous element
  const restoreFocus = () => {
    if (previousFocusedElement.current) {
      previousFocusedElement.current.focus();
      previousFocusedElement.current = null;
    }
  };

  // Handle focus management when batch actions appear/disappear
  useEffect(() => {
    if (shouldShowBatchActions && batchActionsRef.current) {
      // Store the currently focused element before switching to batch actions
      previousFocusedElement.current = document.activeElement;

      // Hide toolbar content from screen readers when batch actions are visible
      if (toolbarContentRef.current) {
        toolbarContentRef.current.setAttribute('aria-hidden', 'true');
      }

      // Find the first focusable element in batch actions
      const focusable = batchActionsRef.current.querySelector(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      );

      if (focusable) {
        focusable.focus();
      }
    } else if (!shouldShowBatchActions) {
      // Remove aria-hidden immediately when batch actions are hidden
      if (toolbarContentRef.current) {
        toolbarContentRef.current.removeAttribute('aria-hidden');
      }

      // Restore focus when batch actions are hidden
      if (previousFocusedElement.current) {
        // Use setTimeout to ensure the DOM has updated before restoring focus
        setTimeout(() => {
          if (previousFocusedElement.current) {
            // Check if the previous element is still in the document and focusable
            if (document.contains(previousFocusedElement.current)) {
              previousFocusedElement.current.focus();
            } else if (toolbarContentRef.current) {
              // If previous element is no longer available, focus the first focusable element in toolbar
              const firstFocusable = toolbarContentRef.current.querySelector(
                'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
              );
              if (firstFocusable) {
                firstFocusable.focus();
              }
            }
            previousFocusedElement.current = null;
          }
        }, 0);
      }
    }
  }, [shouldShowBatchActions]);

  // Handle keyboard navigation for batch overflow menu
  useEffect(() => {
    if (!isBatchOverflowOpen || !shouldShowBatchActions) {
      return undefined;
    }

    const handleKeyDown = (e) => {
      // Only handle Shift+Tab
      if (!e.shiftKey || e.key !== 'Tab') return;

      // Check if the active element is within a menu
      const { activeElement } = document;

      // Multiple ways to detect if we're in an overflow menu
      const isInOverflowMenu =
        // Check role
        activeElement?.getAttribute('role') === 'menuitem' ||
        activeElement?.closest('[role="menuitem"]') !== null ||
        activeElement?.closest('[role="menu"]') !== null ||
        // Check Carbon classes
        activeElement?.closest('.cds--overflow-menu-options') !== null ||
        activeElement?.closest('.cds--overflow-menu-options__option') !== null ||
        activeElement?.classList?.contains('cds--overflow-menu-options__option') ||
        // Check for batch actions overflow menu specifically
        activeElement?.closest(`.${iotPrefix}--table-overflow-batch-actions`) !== null ||
        // Check our test IDs
        activeElement?.closest(
          `[data-testid^="${testID || testId}-batch-actions-overflow-menu-item"]`
        ) !== null;

      if (!isInOverflowMenu) {
        return;
      }

      // Prevent the default tab behavior
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Close the menu
      setIsBatchOverflowOpen(false);

      // Return focus to the overflow button
      setTimeout(() => {
        if (batchOverflowMenuRef.current) {
          const overflowButton = batchOverflowMenuRef.current.querySelector('button');
          if (overflowButton) {
            overflowButton.focus();
          }
        }
      }, 100);
    };

    // Add event listener with capture phase to intercept before default behavior
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isBatchOverflowOpen, shouldShowBatchActions, testID, testId]);

  const [isOpen, setIsOpen, renderToolbarOverflowActions] = useDynamicOverflowMenuItems({
    actions: toolbarActions,
    className: `${iotPrefix}--table-toolbar-aggregations__overflow-menu-content`,
    isDisabled,
    onClick: onApplyToolbarAction,
    testId: testID || testId,
  });

  const actions = useMemo(() => {
    const renderedActions =
      typeof toolbarActions === 'function' ? toolbarActions() : toolbarActions;

    return renderedActions?.length ? renderedActions : [];
  }, [toolbarActions]);

  const hasToolbarOverflowActions =
    actions.filter((action) => action.isOverflow && action.hidden !== true).length > 0;

  const visibleToolbarActions = actions.filter(
    (action) => !action.isOverflow && action.hidden !== true
  );

  // Extract TableViewDropdown from customToolbarContent
  const { tableViewDropdown, otherToolbarContent } = useMemo(() => {
    if (!customToolbarContent) {
      return { tableViewDropdown: null, otherToolbarContent: null };
    }

    // Helper function to check if a child is TableViewDropdown
    const isTableViewDropdown = (child) => {
      if (!child) return false;

      // Check by key (most reliable for wrapped components)
      if (child.key && typeof child.key === 'string' && child.key.includes('table-view-dropdown')) {
        return true;
      }

      // Check by type properties
      if (child.type) {
        // Check by displayName
        if (child.type.displayName === 'TableViewDropdown') return true;

        // Check by function name
        if (child.type.name === 'TableViewDropdown') return true;
      }

      // Check by props (TableViewDropdown has specific props like 'views', 'selectedViewId')
      if (
        child.props &&
        (child.props.views !== undefined ||
          child.props.selectedViewId !== undefined ||
          child.props.selectedViewEdited !== undefined)
      ) {
        return true;
      }

      return false;
    };

    // Extract children from Fragment if present
    let contentToProcess = customToolbarContent;

    // Check if it's a Fragment (React.Fragment has type as Symbol or Fragment)
    if (customToolbarContent.type === React.Fragment && customToolbarContent.props?.children) {
      contentToProcess = customToolbarContent.props.children;
    }

    // Convert to array (handles both single element and multiple children)
    const contentArray = React.Children.toArray(contentToProcess);

    // Always check the first element
    const firstElement = contentArray[0];

    if (isTableViewDropdown(firstElement)) {
      // First element is TableViewDropdown - extract it, rest is other content
      const remainingContent = contentArray.slice(1);
      return {
        tableViewDropdown: firstElement,
        otherToolbarContent: remainingContent.length > 0 ? remainingContent : null,
      };
    }

    // First element is not TableViewDropdown - all content is other content
    return {
      tableViewDropdown: null,
      otherToolbarContent: contentArray.length > 0 ? contentArray : null,
    };
  }, [customToolbarContent]);

  const visibleBatchActionCandidates = useMemo(
    () => batchActions.filter((action) => !action.isOverflow && action.hidden !== true),
    [batchActions]
  );

  const staticOverflowBatchActions = useMemo(
    () => batchActions.filter((action) => action.isOverflow && action.hidden !== true),
    [batchActions]
  );

  const batchActionExcludedWidthSelectors = useMemo(
    () => ['.cds--batch-summary', '.cds--batch-summary__cancel'],
    []
  );

  const responsiveBatchActionCount = useResponsiveInlineCount({
    enabled:
      hasBatchActionToolbar &&
      (visibleBatchActionCandidates.length > 0 || staticOverflowBatchActions.length > 0),
    items: visibleBatchActionCandidates,
    containerRef: batchActionsVisibleRef,
    overflowTriggerRef: batchOverflowMenuRef,
    itemSelector: '[data-batch-action-visible="true"]',
    staticOverflowCount: staticOverflowBatchActions.length,
    layoutRef: tableToolbarRef,
    excludedWidthSelector: batchActionExcludedWidthSelectors,
  });
  const visibleBatchActions =
    responsiveBatchActionCount === null
      ? visibleBatchActionCandidates
      : visibleBatchActionCandidates.slice(0, responsiveBatchActionCount);

  const visibleOverflowBatchActions = [
    ...visibleBatchActionCandidates.slice(
      responsiveBatchActionCount ?? visibleBatchActionCandidates.length
    ),
    ...staticOverflowBatchActions,
  ];

  const hasVisibleOverflowBatchActions = visibleOverflowBatchActions.length > 0;
  const hasStaticOverflowBatchActions = staticOverflowBatchActions.length > 0;
  const shouldRenderBatchOverflowTrigger =
    hasStaticOverflowBatchActions ||
    (responsiveBatchActionCount !== null &&
      responsiveBatchActionCount < visibleBatchActionCandidates.length) ||
    hasVisibleOverflowBatchActions;

  const totalSelectedText = useMemo(() => {
    if (totalSelected > 1) {
      if (typeof i18n.itemsSelected === 'function') {
        return i18n.itemsSelected(totalSelected);
      }
      return `${totalSelected} ${i18n.itemsSelected}`;
    }
    if (typeof i18n.itemSelected === 'function') {
      return i18n.itemSelected(totalSelected);
    }
    return `${totalSelected} ${i18n.itemSelected}`;
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [i18n.itemSelected, i18n.itemsSelected, totalSelected]);

  /** If all option are false then hide entire row for toolbar, without this its allocated height remain and blank space was visible */
  const allFalse = [
    hasAdvancedFilter,
    hasAggregations,
    hasColumnSelection,
    hasFilter,
    hasSearch,
    hasRowCountInHeader,
    hasRowEdit,
    hasUserViewManagement,
    hasBatchActionToolbar,
    hasRowSelection,
  ].every((flag) => !flag);

  if (allFalse) {
    return null;
  }

  return (
    <CarbonTableToolbar
      ref={tableToolbarRef}
      // TODO: remove deprecated 'testID' in v3
      data-testid={testID || testId}
      className={classnames(`${iotPrefix}--table-toolbar`, className)}
      aria-label={i18n.toolbarLabelAria}
    >
      {secondaryTitle ? (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for
        <label className={`${iotPrefix}--table-toolbar-secondary-title`}>{secondaryTitle}</label>
      ) : !hasBatchActionToolbar && shouldShowBatchActions ? (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for
        <label
          className={`${iotPrefix}--table-toolbar-secondary-title`}
          aria-live="polite"
          aria-atomic="true"
          role="status"
        >
          {totalSelectedText}
        </label>
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
          ref={toolbarContentRef}
          // TODO: remove deprecated 'testID' in v3
          data-testid={`${testID || testId}-content`}
          className={`${iotPrefix}--table-toolbar-content`}
        >
          {tableViewDropdown || null}
          {hasSearch ? (
            <TableToolbarSearch
              tableId={tableId}
              i18n={i18n}
              options={{
                hasFastSearch,
                hasUserViewManagement,
              }}
              actions={{
                onApplySearch,
                onSearchExpand,
              }}
              tableState={{
                search: searchProp,
                isDisabled,
              }}
              testId={testID || testId}
              langDir={langDir}
            />
          ) : null}
          {totalFilters > 0 && !hideClearAllFiltersButton ? (
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
              renderIcon={Download}
              disabled={isDisabled}
              langDir={langDir}
            />
          ) : null}
          {hasColumnSelection ? (
            <TableToolbarSVGButton
              isActive={activeBar === 'column'}
              onClick={onToggleColumnSelection}
              description={i18n.columnSelectionButtonAria}
              testId="column-selection-button"
              renderIcon={Column}
              disabled={isDisabled}
              langDir={langDir}
            />
          ) : null}
          {hasFilter ? (
            <TableToolbarSVGButton
              isActive={activeBar === 'filter'}
              onClick={onToggleFilter}
              description={i18n.filterButtonAria}
              testId="filter-button"
              renderIcon={Filter}
              disabled={isDisabled}
              langDir={langDir}
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
                isDate: column.filter?.isDate,
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
                isDisabled,
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
              renderIcon={(props) => <Edit size={16} {...props} />}
              disabled={isDisabled}
              langDir={langDir}
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
                langDir={langDir}
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
              renderIcon={(props) => <OverflowMenuVertical size={16} {...props} />}
              iconClass={`${iotPrefix}--table-toolbar-aggregations__overflow-icon`}
              onOpen={() => setIsOpen(true)}
              onClose={() => setIsOpen(false)}
              onKeyDown={(e) => {
                // Handle Shift+Tab to keep focus within toolbar
                if (e.shiftKey && e.key === 'Tab' && isOpen) {
                  e.preventDefault();
                  setIsOpen(false);
                  // Focus will naturally return to the overflow menu button
                }
              }}
              withCarbonTooltip
              tooltipPosition="bottom"
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
            // Render other custom toolbar content
            otherToolbarContent || null
          }
        </TableToolbarContent>
      )}
      {hasBatchActionToolbar ? (
        <TableBatchActions
          ref={(node) => {
            batchActionsRef.current = node;
            batchActionsLayoutRef.current = node;
          }}
          role="region"
          aria-live="polite"
          aria-label={totalSelectedText}
          // TODO: remove deprecated 'testID' in v3
          data-testid={`${testID || testId}-batch-actions`}
          id={`${tableId}-batch-actions-root`}
          className={`${iotPrefix}--table-batch-actions`}
          style={{
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            overflow: 'hidden',
          }}
          onCancel={() => {
            if (onCancelBatchAction) {
              onCancelBatchAction();
            }
            restoreFocus();
          }}
          shouldShowBatchActions={shouldShowBatchActions}
          totalSelected={totalSelected}
          translateWithId={(...args) => tableTranslateWithId(i18n, ...args)}
        >
          <div
            id={`${tableId}-batch-actions-visible`}
            ref={batchActionsVisibleRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              minWidth: 0,
              flex: '1 1 auto',
              overflow: 'visible',
            }}
          >
            {visibleBatchActionCandidates.map(({ id, labelText, disabled, ...others }, index) => {
              const isVisibleInline =
                responsiveBatchActionCount === null || index < responsiveBatchActionCount;

              return (
                <TableBatchAction
                  key={id}
                  id={`${tableId}-batch-action-${id}`}
                  data-batch-action-visible="true"
                  onClick={() => {
                    onApplyBatchAction(id);
                    restoreFocus();
                  }}
                  tabIndex={isVisibleInline && shouldShowBatchActions ? 0 : -1}
                  disabled={!shouldShowBatchActions || disabled}
                  {...others}
                  aria-hidden={!isVisibleInline}
                  style={
                    isVisibleInline
                      ? {
                          flex: '0 0 auto',
                        }
                      : {
                          flex: '0 0 auto',
                          position: 'absolute',
                          visibility: 'hidden',
                          pointerEvents: 'none',
                        }
                  }
                >
                  {labelText}
                </TableBatchAction>
              );
            })}
            {shouldRenderBatchOverflowTrigger ? (
              <div
                id={`${tableId}-batch-actions-overflow-trigger`}
                role="presentation"
                ref={batchOverflowMenuRef}
                data-batch-overflow-visible="true"
                style={{ display: 'inline-flex', flexShrink: 0 }}
                onKeyDown={(e) => {
                  if (!shouldShowBatchActions) return;

                  // Handle Shift+Tab from within the batch overflow menu
                  if (e.shiftKey && e.key === 'Tab') {
                    const menuItems = batchOverflowMenuRef.current?.querySelectorAll(
                      '[role="menuitem"]:not([disabled])'
                    );
                    const firstMenuItem = menuItems?.[0];

                    // If we're on the first menu item, move focus to previous batch action
                    if (firstMenuItem && document.activeElement === firstMenuItem) {
                      e.preventDefault();
                      // Find previous focusable element in batch actions
                      if (batchActionsRef.current) {
                        const focusableElements = batchActionsRef.current.querySelectorAll(
                          'button:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
                        );
                        const overflowButton = batchOverflowMenuRef.current?.querySelector('button');
                        const currentIndex = Array.from(focusableElements).indexOf(overflowButton);
                        const prevElement = focusableElements[currentIndex - 1];

                        if (prevElement) {
                          prevElement.focus();
                        }
                      }
                    }
                  }
                  // Handle Tab from the last menu item
                  else if (e.key === 'Tab' && !e.shiftKey) {
                    const menuItems = batchOverflowMenuRef.current?.querySelectorAll(
                      '[role="menuitem"]:not([disabled])'
                    );
                    const lastMenuItem = menuItems?.[menuItems.length - 1];

                    // If we're on the last menu item, move to Clear selections button
                    if (lastMenuItem && document.activeElement === lastMenuItem) {
                      e.preventDefault();
                      // Find the Clear selections button or next focusable element
                      if (batchActionsRef.current) {
                        const focusableElements = batchActionsRef.current.querySelectorAll(
                          'button:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
                        );
                        const overflowButton = batchOverflowMenuRef.current?.querySelector('button');
                        const currentIndex = Array.from(focusableElements).indexOf(overflowButton);
                        const nextElement = focusableElements[currentIndex + 1];

                        if (nextElement) {
                          nextElement.focus();
                        }
                      }
                    }
                  }
                }}
              >
                <OverflowMenu
                  data-testid={`${testID || testId}-batch-actions-overflow-menu`}
                  className={`${iotPrefix}--table-overflow-batch-actions`}
                  flipped={langDir === 'ltr'}
                  direction="bottom"
                  onClick={(e) => e.stopPropagation()}
                  renderIcon={(props) => <OverflowMenuVertical size={16} {...props} />}
                  tabIndex={shouldShowBatchActions ? 0 : -1}
                  size="md"
                  menuOptionsClass={`${iotPrefix}--table-overflow-batch-actions__menu`}
                  withCarbonTooltip
                  tooltipPosition="bottom"
                  buttonLabel={i18n.batchActionsOverflowMenuText}
                  open={isBatchOverflowOpen}
                  onOpen={() => setIsBatchOverflowOpen(true)}
                  onClose={() => setIsBatchOverflowOpen(false)}
                >
                  {visibleOverflowBatchActions.map(
                    ({
                      id,
                      labelText,
                      disabled,
                      hasDivider,
                      isDelete,
                      renderIcon,
                      iconDescription,
                    }) => (
                      <OverflowMenuItem
                        data-testid={`${testID || testId}-batch-actions-overflow-menu-item-${id}`}
                        itemText={renderTableOverflowItemText({
                          action: { renderIcon, labelText: labelText || iconDescription },
                          className: `${iotPrefix}--table-toolbar-aggregations__overflow-menu-content`,
                        })}
                        disabled={!shouldShowBatchActions || disabled}
                        onClick={() => {
                          onApplyBatchAction(id);
                          restoreFocus();
                        }}
                        key={`table-batch-actions-overflow-menu-${id}`}
                        requireTitle={!renderIcon}
                        hasDivider={hasDivider}
                        isDelete={isDelete}
                        aria-label={labelText}
                      />
                    )
                  )}
                </OverflowMenu>
              </div>
            ) : null}
          </div>
        </TableBatchActions>
      ) : null}
    </CarbonTableToolbar>
  );
};

TableToolbar.propTypes = propTypes;
TableToolbar.defaultProps = defaultProps;

export default TableToolbar;
