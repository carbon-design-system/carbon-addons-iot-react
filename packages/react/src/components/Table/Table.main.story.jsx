import React, { useState, createElement } from 'react';
import { action } from '@storybook/addon-actions';
import { object, select, boolean } from '@storybook/addon-knobs';
import { merge, uniqueId } from 'lodash-es';

import StoryNotice from '../../internal/StoryNotice';
import Button from '../Button';
import EmptyState from '../EmptyState';
import { DragAndDrop } from '../../utils/DragAndDropUtils';
import RuleBuilder from '../RuleBuilder/RuleBuilder';

import TableREADME from './mdx/Table.mdx';
import SortingREADME from './mdx/Sorting.mdx';
import RowExpansionREADME from './mdx/RowExpansion.mdx';
import SelectionAndBatchActionsREADME from './mdx/SelectionAndBatchActions.mdx';
import InlineActionsREADME from './mdx/InlineActions.mdx';
import RowNestingREADME from './mdx/RowNesting.mdx';
import FilteringREADME from './mdx/Filtering.mdx';
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
  getBatchActions,
  objectWithSubstitution,
  getDrillDownRowAction,
  getOverflowTextOnlyRowAction,
  getOverflowDeleteRowAction,
  getOverflowAddRowAction,
  getOverflowEditRowAction,
  getHiddenOverflowRowAction,
  getHiddenRowAction,
  addMoreChildRowsToParent,
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
    demoHasLoadMore,
    shouldExpandOnRowClick,
    expandedIds,
    hasRowSelection,
    selectedIds,
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
    batchActions,
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
        ['selectionCheckboxEnabled'].includes(name)
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

  // INITIAL DATA STATE
  const [data, setData] = useState(
    [...(demoEmptyState || demoCustomEmptyState ? [] : getTableData())]
      .slice(0, numerOfRows)
      .map((row, index) => (hasRowActions ? addRowAction(row, hasSingleRowEdit, index) : row))
      .map((row, index) => (hasRowNesting ? addChildRows(row, index) : row))
      .map((row) => (!selectionCheckboxEnabled ? { ...row, isSelectable: false } : row))
      .map((row) => (demoHasLoadMore ? { ...row, hasLoadMore: true } : row))
  );

  const onRowLoadMore = (parentId) => {
    action('onRowLoadMore')(parentId);
    setTimeout(() => {
      setData((prevData) => addMoreChildRowsToParent(prevData, parentId));
    }, 1000);
  };

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
    table: { onRowLoadMore },
    toolbar: {
      onShowRowEdit: () => setShowRowEditBar(true),
    },
  });
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
        },
        table: {
          emptyState,
          errorState,
          expandedIds,
          selectedIds,
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
    tooltip:
      column.id === 'object'
        ? `This column has a custom sort function based on the object id property`
        : column.id === 'status'
        ? `This column has a custom sort function that orders on BROKEN, RUNNING and then NOT_RUNNING`
        : undefined,
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

export const WithRowNesting = () => {
  const {
    selectedTableType,
    hasRowNesting,
    shouldExpandOnRowClick,
    demoHasLoadMore,
  } = getTableKnobs({
    knobsToCreate: [
      'selectedTableType',
      'hasRowNesting',
      'shouldExpandOnRowClick',
      'demoHasLoadMore',
    ],
    enableKnob: () => true,
  });
  const initiallyExpandedIds = object('Expanded ids (view.table.expandedIds)', ['row-1']);

  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  const initialData = getTableData()
    .slice(0, 10)
    .map((row, index) => {
      const demoDeepNesting = !hasRowNesting.hasSingleNestedHierarchy;
      return addChildRows(row, index, demoDeepNesting);
    })
    .map((row) => ({
      ...row,
      hasLoadMore: demoHasLoadMore,
    }));
  const columns = getTableColumns();
  const actions = getTableActions();

  const [loadingMoreIds, setLoadingMoreIds] = useState([]);
  const [data, setData] = useState(initialData);
  const [expandedIds, setExpandedIds] = useState(initiallyExpandedIds);

  const onRowLoadMore = (parentId) => {
    action('onRowLoadMore')(parentId);
    if (selectedTableType !== 'StatefulTable') {
      setLoadingMoreIds((prev) => [...prev, parentId]);
    }
    setTimeout(() => {
      setData((prevData) => {
        if (selectedTableType !== 'StatefulTable') {
          setLoadingMoreIds((ids) => ids.filter((loadId) => loadId !== parentId));
        }
        return addMoreChildRowsToParent(prevData, parentId);
      });
    }, 2000);
  };

  const onRowExpanded = (rowId, expanded) => {
    action('onRowExpanded')(rowId, expanded);
    setExpandedIds((currentlyExpanded) =>
      expanded ? [...currentlyExpanded, rowId] : currentlyExpanded.filter((id) => id !== rowId)
    );
  };
  return (
    <MyTable
      actions={{
        ...actions,
        table: {
          ...actions.table,
          onRowExpanded,
          onRowLoadMore,
        },
      }}
      columns={columns}
      data={data}
      options={{
        hasRowNesting,
        shouldExpandOnRowClick,
      }}
      view={{
        table: {
          expandedIds,
          loadingMoreIds: selectedTableType !== 'StatefulTable' ? loadingMoreIds : [],
        },
      }}
    />
  );
};

WithRowNesting.storyName = 'With row nesting';
WithRowNesting.decorators = [createElement];
WithRowNesting.parameters = {
  component: Table,
  docs: {
    page: RowNestingREADME,
  },
};

export const WithFiltering = () => {
  const { selectedTableType, hasFilter, hasAdvancedFilter } = getTableKnobs({
    knobsToCreate: ['selectedTableType', 'hasFilter', 'hasAdvancedFilter'],
    enableKnob: (knobName) => knobName !== 'hasAdvancedFilter',
  });

  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  const data = getTableData().slice(0, 30);
  const columns = getTableColumns().map((col) =>
    col.id === 'object'
      ? {
          ...col,
          tooltip: `This column has objects as values and needs a custom filter function that
      filters based on an object property.`,
        }
      : col
  );

  // Normal filter settings
  let activeFilters;
  let activeBar;
  if (!hasAdvancedFilter) {
    activeFilters = object('Active filters (view.filters)', [
      {
        columnId: 'string',
        value: 'whiteboard',
      },
      {
        columnId: 'select',
        value: 'option-B',
      },
    ]);
    activeBar = select(
      'Show filter toolbar (view.toolbar.activeBar)',
      ['filter', undefined],
      'filter'
    );
  }

  // Advanced filter settings
  const [showBuilder, setShowBuilder] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState(
    hasAdvancedFilter ? getAdvancedFilters() : undefined
  );
  const selectedAdvancedFilterIds = hasAdvancedFilter
    ? object('Active advanced filters (view.selectedAdvancedFilterIds) ☢️', ['story-filter'])
    : undefined;
  const advancedFilterFlyoutOpen = hasAdvancedFilter
    ? boolean('Show advanced filter flyout (view.toolbar.advancedFilterFlyoutOpen) ☢️', true)
    : undefined;
  const actions = merge(getTableActions(), {
    toolbar: { onCreateAdvancedFilter: () => setShowBuilder(true) },
  });
  const storyNotice = hasAdvancedFilter ? (
    <StoryNotice experimental componentName="StatefulTable with advancedFilters" />
  ) : null;

  return (
    <>
      {storyNotice}
      <MyTable
        actions={actions}
        columns={columns}
        data={data}
        options={{
          hasFilter: hasFilter && !hasAdvancedFilter ? hasFilter : false,
          hasAdvancedFilter,
        }}
        view={{
          advancedFilters,
          selectedAdvancedFilterIds,
          filters: activeFilters,
          toolbar: {
            activeBar,
            advancedFilterFlyoutOpen,
          },
        }}
      />
      {showBuilder && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
          }}
        >
          <RuleBuilder
            onSave={(newFilter) => {
              setAdvancedFilters((prev) => [
                ...prev,
                {
                  filterId: uniqueId('filter-id'),
                  ...newFilter,
                },
              ]);
              setShowBuilder(false);
            }}
            onCancel={() => setShowBuilder(false)}
            filter={{
              filterColumns: columns.map(({ id, name }) => ({ id, name })),
            }}
          />
        </div>
      )}
    </>
  );
};

WithFiltering.storyName = 'With filtering';
WithFiltering.decorators = [createElement];
WithFiltering.parameters = {
  component: Table,
  docs: {
    page: FilteringREADME,
  },
};

export const WithSelectionAndBatchActions = () => {
  const { selectedTableType, hasRowSelection, selectionCheckboxEnabled } = getTableKnobs({
    knobsToCreate: ['selectedTableType', 'hasRowSelection', 'selectionCheckboxEnabled'],
    enableKnob: () => true,
  });

  const isStateful = selectedTableType === 'StatefulTable';
  const isMultiSelect = hasRowSelection === 'multi';
  const selectdIdsDescription = `${isStateful ? 'Initially selected' : 'Selected'} 
    id${isMultiSelect ? 's' : ''} (view.table.selectedIds)`;
  const selectedIds =
    hasRowSelection === 'multi'
      ? object(selectdIdsDescription, ['row-3', 'row-4'])
      : object(selectdIdsDescription, ['row-3']);

  const batchActions = isMultiSelect
    ? objectWithSubstitution(
        'Batch actions for selected rows (view.toolbar.batchActions)',
        getBatchActions()
      )
    : undefined;

  const MyTable = isStateful ? StatefulTable : Table;
  const data = getTableData()
    .slice(0, 10)
    .map((row) => (!selectionCheckboxEnabled ? { ...row, isSelectable: false } : row));
  const columns = getTableColumns();

  return (
    <MyTable
      actions={getTableActions()}
      columns={columns}
      data={data}
      options={{
        hasRowSelection,
      }}
      view={{
        table: {
          selectedIds,
        },
        toolbar: { batchActions },
      }}
    />
  );
};

WithSelectionAndBatchActions.storyName = 'With selection and batch actions';
WithSelectionAndBatchActions.decorators = [createElement];
WithSelectionAndBatchActions.parameters = {
  component: Table,
  docs: {
    page: SelectionAndBatchActionsREADME,
  },
};

export const WithInlineActions = () => {
  const { selectedTableType, hasRowActions } = getTableKnobs({
    knobsToCreate: ['selectedTableType', 'hasRowActions'],
    enableKnob: () => true,
  });

  const rowActions = [
    objectWithSubstitution('Row actions for row-0 (data[0].rowActions)', [getDrillDownRowAction()]),
    objectWithSubstitution('Row actions for row-1 (data[1].rowActions)', [
      getDrillDownRowAction(),
      getOverflowTextOnlyRowAction(),
      getHiddenOverflowRowAction(),
    ]),
    objectWithSubstitution('Row actions for row-2 (data[2].rowActions)', [
      getOverflowEditRowAction(),
      getOverflowAddRowAction(),
      getOverflowDeleteRowAction(),
    ]),
    objectWithSubstitution('Row actions for row-3 (data[3].rowActions)', [
      getHiddenRowAction(),
      getHiddenOverflowRowAction(),
    ]),
  ];

  const rowActionsState = object(
    'State of the row actions (view.table.rowActions)',
    getRowActionStates()
  );

  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  const data = getTableData()
    .slice(0, 10)
    .map((row, index) => {
      if (hasRowActions) {
        return { ...row, rowActions: rowActions[index] ?? [] };
      }
      return row;
    });
  const columns = getTableColumns();

  return (
    <MyTable
      actions={getTableActions()}
      columns={columns}
      data={data}
      options={{
        hasRowActions,
      }}
      view={{ table: { rowActions: rowActionsState } }}
    />
  );
};
WithInlineActions.storyName = 'With inline actions';
WithInlineActions.decorators = [createElement];
WithInlineActions.parameters = {
  component: Table,
  docs: {
    page: InlineActionsREADME,
  },
};
