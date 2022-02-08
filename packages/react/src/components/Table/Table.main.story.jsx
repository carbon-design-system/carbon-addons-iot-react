import React, { useState, createElement } from 'react';
import { action } from '@storybook/addon-actions';
import { object } from '@storybook/addon-knobs';
import { merge } from 'lodash-es';
import { TrashCan16 } from '@carbon/icons-react';

import Button from '../Button';
import EmptyState from '../EmptyState';
import { DragAndDrop } from '../../utils/DragAndDropUtils';

import TableREADME from './mdx/Table.mdx';
import SortingREADME from './mdx/Sorting.mdx';
import RowExpansionREADME from './mdx/RowExpansion.mdx';
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
    demoBatchActions,
    searchIsExpanded,
  } = getTableKnobs({
    enableKnob: (name) =>
      // For this story always disable the following knobs by default
      [
        'hasUserViewManagement',
        'demoInitialColumnSizes',
        'hasRowExpansion',
        'toolbarIsDisabled',
        'hasMultiSort',
        'stickyHeader',
        'useAutoTableLayoutForResize',
        'isItemPerPageHidden',
        'hasColumnSelection',
        'hasColumnSelectionConfig',
        'shouldLazyRender',
        'preserveCellWhiteSpace',
        'tableIsLoading',
        'demoEmptyColumns',
        'demoEmptyState',
        'demoCustomEmptyState',
        'demoCustomErrorState',
      ].includes(name)
        ? false
        : // For this story always enable the following knobs by default
        ['demoBatchActions', 'selectionCheckboxEnabled'].includes(name)
        ? true
        : // For this story enable the other knobs by defaults if we are in dev environment
          __DEV__,
    useGroups: true,
  });

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
  const toolbarActions = demoToolbarActions ? getTableToolbarActions() : undefined;
  const customToolbarContent = demoCustomToolbarContent ? customToolbarContentElement : undefined;

  const data = [...(demoEmptyState || demoCustomEmptyState ? [] : getTableData())]
    .slice(0, numerOfRows)
    .map((row, index) => (hasRowActions ? addRowAction(row, hasSingleRowEdit, index) : row))
    .map((row, index) => (hasRowNesting ? addChildRows(row, index) : row))
    .map((row) => (!selectionCheckboxEnabled ? { ...row, isSelectable: false } : row));

  const expandedData = hasRowExpansion ? getExpandedData(data) : [];

  const columns = [...(demoEmptyColumns ? [] : getTableColumns())]
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

  const ordering = getDefaultOrdering(columns).map((col, index) =>
    demoColumnGroupAssignments ? addColumnGroupIds(col, index) : col
  );

  const myTableActions = merge(getTableActions(), {
    toolbar: {
      onShowRowEdit: () => setShowRowEditBar(true),
    },
  });
  const batchActions = demoBatchActions
    ? [
        {
          id: 'delete',
          labelText: 'Delete',
          renderIcon: TrashCan16,
          iconDescription: 'Delete Item',
        },
        {
          id: 'process',
          labelText: 'Process',
        },
      ]
    : [];
  const advancedFilters = hasAdvancedFilter ? getAdvancedFilters() : undefined;
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
          search: {
            isExpanded: searchIsExpanded,
          },
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
Playground.storyName = 'Playground';
Playground.decorators = [
  (Story) => (
    <DragAndDrop>
      <Story />
    </DragAndDrop>
  ),
];

export const WithSorting = () => {
  const { selectedTableType, demoSingleSort, hasMultiSort } = getTableKnobs({
    knobsToCreate: ['selectedTableType', 'demoSingleSort', 'hasMultiSort'],
    enableKnob: (name) => name !== 'hasMultiSort',
  });

  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  const data = getTableData().slice(0, 50);
  const columns = getTableColumns().map((column) => ({
    ...column,
    isSortable: demoSingleSort,
  }));

  const sort = object('Sort state (view.table.sort)', {
    columnId: 'select',
    direction: 'ASC',
  });

  return (
    <MyTable
      actions={getTableActions()}
      columns={columns}
      data={data}
      options={{
        hasMultiSort,
      }}
      view={{
        table: {
          sort,
        },
      }}
    />
  );
};

WithSorting.storyName = 'With sorting';
WithSorting.decorators = [
  (Story) => (
    <DragAndDrop>
      <Story />
    </DragAndDrop>
  ),
];
WithSorting.parameters = {
  component: Table,
  docs: {
    page: SortingREADME,
  },
};

export const WithRowExpansion = () => {
  const { selectedTableType, hasRowExpansion, shouldExpandOnRowClick } = getTableKnobs({
    knobsToCreate: ['selectedTableType', 'hasRowExpansion', 'shouldExpandOnRowClick'],
    enableKnob: () => true,
  });

  const initiallyExpandedIds = object('expandedIds', ['row-1']);

  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  const data = getTableData().slice(0, 10);
  const columns = getTableColumns();

  const expandedData = object('expandedData', [
    {
      rowId: 'row-1',
      content: 'My expanded content for row 1',
    },
    {
      rowId: 'row-3',
      content: 'My expanded content for row 3',
    },
  ]);

  return (
    <>
      <style>{`.iot--expanded-tablerow td[colspan="10"] { padding: 2rem !important;}`}</style>
      <MyTable
        actions={getTableActions()}
        columns={columns}
        data={data}
        expandedData={expandedData}
        options={{
          hasRowExpansion,
          shouldExpandOnRowClick,
        }}
        view={{ table: { expandedIds: initiallyExpandedIds } }}
      />
    </>
  );
};

WithRowExpansion.storyName = 'With row expansion';
WithRowExpansion.decorators = [createElement];
WithRowExpansion.parameters = {
  component: Table,
  docs: {
    page: RowExpansionREADME,
  },
};
