import React from 'react';
import { action } from '@storybook/addon-actions';
import { object, select, boolean, number } from '@storybook/addon-knobs';
import { merge, uniqueId } from 'lodash-es';

import StoryNotice from '../../internal/StoryNotice';
import Button from '../Button';
import EmptyState from '../EmptyState';
import { DragAndDrop } from '../../utils/DragAndDropUtils';
import RuleBuilder from '../RuleBuilder/RuleBuilder';
import useStoryState from '../../internal/storyState';

import TableREADME from './mdx/Table.mdx';
import SortingREADME from './mdx/Sorting.mdx';
import RowExpansionREADME from './mdx/RowExpansion.mdx';
import SelectionAndBatchActionsREADME from './mdx/SelectionAndBatchActions.mdx';
import InlineActionsREADME from './mdx/InlineActions.mdx';
import RowNestingREADME from './mdx/RowNesting.mdx';
import FilteringREADME from './mdx/Filtering.mdx';
import PaginationREADME from './mdx/Pagination.mdx';
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
 * of the library it would probably be overwhelming to see all functionality at once,
 * hence a simple table is shown in production.
 * @returns story function
 */
export const Playground = () => {
  // STATES
  const [showRowEditBar, setShowRowEditBar] = useStoryState(false);
  const [rowActionsState, setRowActionsState] = useStoryState(getRowActionStates());

  // KNOBS
  // The order of appearance is defined function getTableKnobs.
  const {
    selectedTableType,
    tableMaxWidth,
    secondaryTitle,
    numberOfRows,
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
    hasOnlyPageData,
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
        'hasOnlyPageData',
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
  const [data, setData] = useStoryState(
    [...(demoEmptyState || demoCustomEmptyState ? [] : getTableData())]
      .slice(0, numberOfRows)
      .map((row, index) => (hasRowActions ? addRowAction(row, hasSingleRowEdit, index) : row))
      .map((row, index) => (hasRowNesting ? addChildRows(row, index) : row))
      .map((row) => (!selectionCheckboxEnabled ? { ...row, isSelectable: false } : row))
      .map((row) => (demoHasLoadMore ? { ...row, hasLoadMore: true } : row)),
    // Reset initial state and trigger a story re-render when any
    // of the following values change
    [
      demoEmptyState,
      demoCustomEmptyState,
      hasRowActions,
      hasSingleRowEdit,
      hasRowNesting,
      selectionCheckboxEnabled,
      demoHasLoadMore,
    ]
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

  // For demo and test purposes we generate an new key for the table when
  // some knobs change that normally wouldn't trigger a rerender in the StatefulTable.
  const knobRegeneratedKey = `table${demoInitialColumnSizes}${JSON.stringify(aggregationsColumns)}
  ${aggregationLabel}${demoCustomEmptyState}${loadingRowCount}${loadingColumnCount}${maxPages}
  ${isItemPerPageHidden}${paginationSize}${demoToolbarActions}${toolbarIsDisabled}`;

  return (
    <DragAndDrop>
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
          hasOnlyPageData,
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
    </DragAndDrop>
  );
};
Playground.storyName = 'Playground';

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
    <DragAndDrop>
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
    </DragAndDrop>
  );
};

WithSorting.storyName = 'With sorting';
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
  const demoDeepNesting = !hasRowNesting.hasSingleNestedHierarchy;
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  const initialData = getTableData()
    .slice(0, 10)
    .map((row, index) => {
      return addChildRows(row, index, demoDeepNesting);
    })
    .map((row) => ({
      ...row,
      hasLoadMore: demoHasLoadMore,
    }));
  const columns = getTableColumns();
  const actions = getTableActions();

  const [loadingMoreIds, setLoadingMoreIds] = useStoryState([]);
  const [data, setData] = useStoryState(initialData, [demoHasLoadMore, demoDeepNesting]);
  const [expandedIds, setExpandedIds] = useStoryState(initiallyExpandedIds, initiallyExpandedIds);

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
    const temp = expanded ? [...expandedIds, rowId] : expandedIds.filter((id) => id !== rowId);
    setExpandedIds(temp);
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
  const [showBuilder, setShowBuilder] = useStoryState(false);
  const [advancedFilters, setAdvancedFilters] = useStoryState(
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

  const knobRegeneratedKey = `${JSON.stringify(activeFilters)}`;
  return (
    <>
      {storyNotice}
      <MyTable
        key={knobRegeneratedKey}
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
WithInlineActions.parameters = {
  component: Table,
  docs: {
    page: InlineActionsREADME,
  },
};

export const WithPagination = () => {
  const {
    selectedTableType,
    hasPagination,
    pageSizes,
    maxPages,
    isItemPerPageHidden,
    paginationSize,
    hasOnlyPageData,
  } = getTableKnobs({
    knobsToCreate: [
      'selectedTableType',
      'hasPagination',
      'pageSizes',
      'maxPages',
      'isItemPerPageHidden',
      'paginationSize',
      'hasOnlyPageData',
    ],
    enableKnob: (name) => name !== 'hasOnlyPageData' && name !== 'isItemPerPageHidden',
  });

  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  const data = getTableData();
  const columns = getTableColumns();

  const pageSize = select('Selected pageSize (view.pagination.pageSize)', pageSizes, 10);
  const page = number('Current page (view.pagination.page)', 1);
  const totalItems = number('Total items in data prop (view.pagination.totalItems)', data.length);

  const knobRegeneratedKey = `table${isItemPerPageHidden}${maxPages}${paginationSize}${pageSize}`;

  return (
    <MyTable
      key={knobRegeneratedKey}
      actions={getTableActions()}
      columns={columns}
      data={data}
      options={{ hasPagination, hasOnlyPageData }}
      view={{
        pagination: {
          page,
          pageSize,
          pageSizes,
          totalItems,
          maxPages,
          isItemPerPageHidden,
          size: paginationSize,
        },
      }}
    />
  );
};
WithPagination.storyName = 'With pagination';
WithPagination.parameters = {
  component: Table,
  docs: {
    page: PaginationREADME,
  },
};
