import React, { useState, createElement } from 'react';
import { action } from '@storybook/addon-actions';
import { merge } from 'lodash-es';
import { TrashCan16 } from '@carbon/icons-react';

import Button from '../Button';
import EmptyState from '../EmptyState';

import TableREADME from './mdx/Table.mdx';
import Table from './Table';
import StatefulTable from './StatefulTable';
import {
  addChildRows,
  addRowAction,
  addColumnGroupIds,
  getTableActions,
  getTableColumns,
  getTableData,
  getTableToolbarActions,
  getExpandedData,
  getDefaultOrdering,
  getEditDataFunction,
  getRowActionStates,
  getAdvancedFilters,
  getTableKnobs,
  getI18nKnobs,
} from './Table.story.helpers';

const tableColumns = getTableColumns();
const tableActions = getTableActions();
const tableToolbarActions = getTableToolbarActions();

export default {
  title: '1 - Watson IoT/Table',
  parameters: {
    component: Table,
    docs: {
      page: TableREADME,
    },
  },
};

/**
 * The main playground story for the Table/StatefulTable.
 * All props (that can be combined) are enabled in dev mode in order to help catch
 * regressions and see how changes affect existing functionality. But for the consumers
 * of the library it would probalby be overwhelming to see all functionality at once,
 * hence a simple table is shown in production.
 * @returns story function
 */
export const Playground = () => {
  const enableAllKnobs = __DEV__;

  // STATES
  const [showRowEditBar, setShowRowEditBar] = useState(false);
  const [rowActionsState, setRowActionsState] = useState(getRowActionStates());

  // KNOBS
  // The order of appearance is defined function getTableKnobs.
  const {
    selectedTableType,
    tableMaxWidth,
    secondaryTitle,
    numerOfRows,
    useZebraStyles,
    size,
    tableTooltipText,
    demoInitialColumnSizes,
    hasResize,
    preserveColumnWidths,
    useAutoTableLayoutForResize,
    demoColumnTooltips,
    demoColumnGroupAssignments,
    columnGroups,
    hasColumnSelection,
    hasColumnSelectionConfig,
    demoSingleSort,
    hasMultiSort,
    hasAggregations,
    aggregationLabel,
    aggregationsColumns,
    hasFilter,
    hasAdvancedFilter,
    hasPagination,
    pageSizes,
    maxPages,
    isItemPerPageHidden,
    paginationSize,
    hasRowExpansion,
    hasRowNesting,
    shouldExpandOnRowClick,
    hasRowSelection,
    selectionCheckboxEnabled,
    hasSearch,
    hasFastSearch,
    wrapCellText,
    cellTextAlignment,
    preserveCellWhiteSpace,
    hasRowActions,
    shouldLazyRender,
    hasRowEdit,
    hasSingleRowEdit,
    demoRenderDataFunction,
    demoToolbarActions,
    demoCustomToolbarContent,
    toolbarIsDisabled,
    tableIsLoading,
    demoEmptyColumns,
    loadingRowCount,
    loadingColumnCount,
    demoEmptyState,
    demoCustomEmptyState,
    demoCustomErrorState,
    locale,
  } = getTableKnobs(enableAllKnobs);

  // CUSTOM DEMO JSX
  const rowEditBarButtons = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ fontSize: '12px' }} className=".bx--type-light">
        This is shallow demo implementation of the row edit functionality. Data modifications are
        not saved.
      </div>
      <Button key="cancel" size="small" kind="tertiary" onClick={() => setShowRowEditBar(false)}>
        Cancel demo
      </Button>
    </div>
  );

  const singleRowEditButtons = (
    <Button
      key="cancel"
      size="small"
      kind="tertiary"
      onClick={() => {
        setRowActionsState([...getRowActionStates()]);
      }}
    >
      Cancel Row edit demo
    </Button>
  );

  const customToolbarContentElement = (
    <div
      className=".bx--type-light"
      style={{ alignItems: 'center', display: 'flex', padding: '0 1rem' }}
    >
      Custom content
    </div>
  );

  const customEmptyState = (
    <div key="empty-state">
      <h1 key="empty-state-heading">Custom empty state</h1>
      <p key="empty-state-message">Hey, no data!</p>
    </div>
  );

  const customErrorState = (
    <EmptyState
      icon="error"
      title="Error occured while loading"
      body="Custom Error message"
      action={{
        label: 'Reload',
        onClick: action('onErrorStateAction'),
        kind: 'ghost',
      }}
    />
  );

  // PROPS ADJUSTED BASED ON KNOBS
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  const style = tableMaxWidth !== 'none' ? { maxWidth: tableMaxWidth } : null;
  const tableTooltip = tableTooltipText ? <div>{tableTooltipText}</div> : null;
  const activeBar =
    hasColumnSelection || hasColumnSelectionConfig
      ? 'column'
      : showRowEditBar
      ? 'rowEdit'
      : undefined;
  const toolbarActions = demoToolbarActions ? tableToolbarActions : undefined;
  const customToolbarContent = demoCustomToolbarContent ? customToolbarContentElement : undefined;

  const data = [...(demoEmptyState || demoCustomEmptyState ? [] : getTableData())]
    .slice(0, numerOfRows)
    .map((row, index) => (hasRowActions ? addRowAction(row, hasSingleRowEdit, index) : row))
    .map((row, index) => (hasRowNesting ? addChildRows(row, index) : row))
    .map((row) => (!selectionCheckboxEnabled ? { ...row, isSelectable: false } : row));

  const expandedData = hasRowExpansion ? getExpandedData(data) : [];

  const columns = [...(demoEmptyColumns ? [] : tableColumns)]
    .map((column, index) => ({
      ...column,
      isSortable: (hasMultiSort || demoSingleSort) && index !== 1,
      width: demoInitialColumnSizes ? (index % 2 === 0 ? '100px' : '200px') : undefined,
      tooltip: demoColumnTooltips ? `A tooltip for ${column.name}` : undefined,
      align: cellTextAlignment,
      editDataFunction: getEditDataFunction(() => {}),
    }))
    .map((column) => {
      if (demoRenderDataFunction) return column;
      const { renderDataFunction, ...columnNoRenderDataFunction } = column;
      return columnNoRenderDataFunction;
    });

  const ordering = getDefaultOrdering(tableColumns).map((col, index) =>
    demoColumnGroupAssignments ? addColumnGroupIds(col, index) : col
  );

  const myTableActions = merge(tableActions, {
    toolbar: {
      onShowRowEdit: () => setShowRowEditBar(true),
    },
  });
  const batchActions = [
    {
      id: 'delete',
      labelText: 'Delete',
      renderIcon: TrashCan16,
      iconDescription: 'Delete Item',
    },
  ];
  const advancedFilters = getAdvancedFilters();
  const emptyState = demoCustomEmptyState ? customEmptyState : undefined;
  const errorState = demoCustomErrorState ? customErrorState : undefined;
  const error = demoCustomErrorState ? 'Error!' : undefined;

  const knobRegeneratedKey = `table${demoInitialColumnSizes}${JSON.stringify(aggregationsColumns)}`;

  return (
    <MyTable
      key={knobRegeneratedKey}
      id="table"
      style={style}
      secondaryTitle={secondaryTitle}
      useZebraStyles={useZebraStyles}
      tooltip={tableTooltip}
      columns={columns}
      columnGroups={columnGroups}
      data={data}
      expandedData={expandedData}
      actions={myTableActions}
      size={size}
      options={{
        hasAggregations,
        hasColumnSelection,
        hasColumnSelectionConfig,
        hasFilter: hasFilter && !hasAdvancedFilter,
        hasAdvancedFilter,
        hasMultiSort,
        hasPagination,
        hasResize,
        hasRowExpansion,
        hasRowNesting,
        hasRowSelection,
        shouldExpandOnRowClick,
        hasFastSearch,
        hasSearch,
        preserveColumnWidths,
        useAutoTableLayoutForResize,
        wrapCellText,
        preserveCellWhiteSpace,
        hasRowActions,
        shouldLazyRender,
        hasRowEdit,
        hasSingleRowEdit,
      }}
      view={{
        advancedFilters,
        aggregations: {
          label: aggregationLabel,
          columns: aggregationsColumns,
        },
        toolbar: {
          activeBar,
          isDisabled: toolbarIsDisabled,
          customToolbarContent,
          toolbarActions,
          rowEditBarButtons,
          batchActions,
        },
        table: {
          emptyState,
          errorState,
          rowActions: rowActionsState,
          singleRowEditButtons,
          loadingState: {
            isLoading: tableIsLoading,
            rowCount: loadingRowCount,
            columnCount: loadingColumnCount,
          },
          ordering,
        },
        pagination: {
          pageSizes,
          maxPages,
          isItemPerPageHidden,
          size: paginationSize,
        },
      }}
      i18n={getI18nKnobs()}
      error={error}
      locale={locale}
    />
  );
};
Playground.decorators = [createElement];
Playground.storyName = 'Playground';
