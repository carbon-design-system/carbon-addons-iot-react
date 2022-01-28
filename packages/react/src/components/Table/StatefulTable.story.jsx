import React, { createElement, useMemo, useRef, useState } from 'react';
import { boolean, text, select, array, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { SettingsAdjust16, TrashCan16 } from '@carbon/icons-react';
import { isEqual, assign } from 'lodash-es';

import RuleBuilder from '../RuleBuilder/RuleBuilder';
import FullWidthWrapper from '../../internal/FullWidthWrapper';
import StoryNotice from '../../internal/StoryNotice';
import FlyoutMenu, { FlyoutMenuDirection } from '../FlyoutMenu/FlyoutMenu';
import { csvDownloadHandler } from '../../utils/componentUtilityFunctions';
import Button from '../Button/Button';
import { DragAndDrop } from '../../utils/DragAndDropUtils';

import StatefulTable from './StatefulTable';
import {
  initialState,
  getNewRow,
  tableActions,
  selectTextWrapping,
  tableColumnsFixedWidth,
  tableData,
  tableColumns,
  defaultOrdering,
  tableColumnsWithOverflowMenu,
  tableColumnsWithAlignment,
} from './Table.story';
import Table from './Table';
import TableREADME from './mdx/Table.mdx';
import TableManageViewsModal from './TableManageViewsModal/TableManageViewsModal';
import TableViewDropdown from './TableViewDropdown/TableViewDropdown';
import TableSaveViewModal from './TableSaveViewModal/TableSaveViewModal';

export const StatefulTableWithNestedRowItems = (props) => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'StatefulTable');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  const tableData = initialState.data.map((i, idx) => ({
    ...i,
    children:
      idx % 4 !== 0
        ? [getNewRow(idx, 'A', true), getNewRow(idx, 'B', true)]
        : idx === 4
        ? [
            getNewRow(idx, 'A', true),
            {
              ...getNewRow(idx, 'B'),
              children: [
                getNewRow(idx, 'B-1', true),
                {
                  ...getNewRow(idx, 'B-2'),
                  children: [getNewRow(idx, 'B-2-A', true), getNewRow(idx, 'B-2-B', true)],
                },
                getNewRow(idx, 'B-3', true),
              ],
            },
            getNewRow(idx, 'C', true),
            {
              ...getNewRow(idx, 'D', true),
              children: [
                getNewRow(idx, 'D-1', true),
                getNewRow(idx, 'D-2', true),
                getNewRow(idx, 'D-3', true),
              ],
            },
          ]
        : undefined,
  }));

  const hasAggregations = boolean(
    'Aggregates column values and displays in a footer row (options.hasAggregations)',
    false
  );
  return (
    <div style={{ width: select('table container width', ['auto', '300px', '800px'], 'auto') }}>
      <MyTable
        id="table"
        {...initialState}
        secondaryTitle={text(
          'Title shown in bar above header row (secondaryTitle)',
          `Row count: ${initialState.data.length}`
        )}
        columns={tableColumnsFixedWidth}
        data={tableData}
        size={select(
          'Sets the height of the table rows (size)',
          ['xs', 'sm', 'md', 'lg', 'xl'],
          'lg'
        )}
        options={{
          ...initialState.options,
          hasAggregations,
          hasRowNesting: true,
          hasFilter: true,
          hasResize: true,
          shouldExpandOnRowClick: true,
          wrapCellText: select(
            'Choose how text should wrap witin columns (options.wrapCellText)',
            selectTextWrapping,
            'alwaysTruncate'
          ),
        }}
        view={{
          ...initialState.view,
          aggregations: hasAggregations
            ? {
                label: 'Total:',
                columns: [
                  {
                    id: 'number',
                    align: 'center',
                    isSortable: false,
                  },
                ],
              }
            : undefined,
          filters: [],
          toolbar: {
            activeBar: null,
          },
        }}
        actions={tableActions}
        {...props}
      />
    </div>
  );
};

export default {
  title: '1 - Watson IoT/Table/StatefulTable',

  parameters: {
    component: StatefulTable,
    docs: {
      page: TableREADME,
    },
  },

  excludeStories: [
    'tableColumns',
    'tableColumnsWithAlignment',
    'tableColumnsFixedWidth',
    'tableColumnsWithOverflowMenu',
    'initialState',
    'StatefulTableWithNestedRowItems',
  ],
};

export const SimpleStatefulExample = () => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'StatefulTable');
  const demoInitialColumnSizes = boolean('Demo initial columns sizes', false);
  const demoColumnGroupAssignments = boolean('Demo assigning columns to groups', false);
  const demoColumnTooltips = boolean('Demo column tooltips', false);

  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  return (
    <MyTable
      id="table"
      key={`table${demoInitialColumnSizes}`}
      {...initialState}
      data={initialState.data.slice(
        0,
        select(
          'number of data items in table',
          [initialState.data.length, 50, 20, 5],
          initialState.data.length
        )
      )}
      actions={tableActions}
      columns={initialState.columns
        .map((column) => {
          if (column.filter) {
            return {
              ...column,
              filter: {
                ...column.filter,
                isMultiselect: boolean('force MultiSelect filter', !!column.filter?.options),
              },
            };
          }
          return column;
        })
        .map((col, i) => ({
          ...col,
          width: demoInitialColumnSizes ? (i % 2 === 0 ? '100px' : '200px') : undefined,
          tooltip: demoColumnTooltips
            ? col.id === 'select'
              ? `This tooltip displays extra information about the select box. You can choose from a variety of options. Pick one today!`
              : `A tooltip for ${col.name} here`
            : undefined,
        }))}
      columnGroups={object('Column groups definition (columnGroups)', [
        {
          id: 'groupA',
          name: 'Group A that has a very long name that should be truncated',
        },
        { id: 'groupB', name: 'Group B' },
      ])}
      style={{ maxWidth: select('table width', ['auto', '300px'], 'auto') }}
      useZebraStyles={boolean('Alternate colors in table rows (useZebraStyles)', false)}
      size={select(
        'Sets the height of the table rows (size)',
        ['xs', 'sm', 'md', 'lg', 'xl'],
        'lg'
      )}
      options={{
        hasAggregations: boolean(
          'Aggregates column values and displays in a footer row (options.hasAggregations)',
          false
        ),
        hasColumnSelection: boolean(
          'Enables choosing which columns are available (options.hasColumnSelection)',
          false
        ),
        hasFilter: boolean('Enables filtering columns by value (options.hasFilter)', false),
        hasMultiSort: boolean(
          'Enables sorting the table by multiple dimentions (options.hasMultiSort)',
          false
        ),
        hasPagination: boolean('Enables pagination for the table (options.hasPagination)', false),
        shouldLazyRender: boolean(
          'Enables only loading table rows as they become visible (options.shouldLazyRender)',
          false
        ),
        hasResize: boolean('Enables resizing of column widths (options.hasResize)', false),
        hasRowActions: boolean('Enables row actions (options.hasRowActions)', false),
        hasRowExpansion: select(
          'Enables expanding rows to show additional content (options.hasRowExpansion)',
          {
            true: true,
            false: false,
            '{ expandRowsExclusively: true }': { expandRowsExclusively: true },
          },
          false
        ),
        hasRowNesting: boolean(
          'Enables rows to have nested rows within (options.hasRowNesting)',
          false
        ),
        hasRowSelection: select(
          'Enable or Disable selecting single, multiple, or no rows (options.hasRowSelection)',
          ['multi', 'single', false],
          'multi'
        ),
        hasFastSearch: boolean(
          "Enable search as typing (default) or only on 'Enter' (options.hasFastSearch).",
          true
        ),
        hasSearch: boolean('Enable searching on the table values (options.hasSearch)', false),
        hasSort: boolean('Enable sorting columns by a single dimension (options.hasSort)', false),
        preserveColumnWidths: boolean(
          'Preserve column widths when resizing (options.preserveColumnWidths)',
          true
        ),
        useAutoTableLayoutForResize: boolean(
          'Removes table-layout:fixed to allow resizable tables (options.useAutoTableLayoutForResize)',
          false
        ),
        wrapCellText: select(
          'Choose how text should wrap witin columns (options.wrapCellText)',
          selectTextWrapping,
          'always'
        ),
      }}
      view={{
        aggregations: {
          label: text('The label used in the aggregation row (view.aggregations.label)', 'Total:'),
          columns: [
            object(
              'An example column object to demonstrate which columns should aggregate (view.aggregations.columns[0])',
              {
                id: 'number',
                align: 'start',
                isSortable: false,
              }
            ),
          ],
        },
        table: {
          ordering: demoColumnGroupAssignments
            ? defaultOrdering.map((col, index) =>
                index === 1 || index === 2
                  ? { ...col, columnGroupId: 'groupA' }
                  : index === 5 || index === 6 || index === 7
                  ? { ...col, columnGroupId: 'groupB' }
                  : col
              )
            : defaultOrdering,
          selectedIds: array('An array of selected table ids (view.table.selectedIds)', []),
        },
        toolbar: {
          batchActions: [
            {
              iconDescription: 'Delete Item',
              id: 'delete',
              labelText: 'Delete',
              renderIcon: TrashCan16,
            },
          ],
        },
      }}
    />
  );
};

SimpleStatefulExample.storyName = 'simple stateful table';

SimpleStatefulExample.parameters = {
  info: {
    text:
      'This is an example of the <StatefulTable> component that uses local state to handle all the table actions. This is produced by wrapping the <Table> in a container component and managing the state associated with features such the toolbar, filters, row select, etc. For more robust documentation on the prop model and source, see the other "with function" stories.',
    propTables: [Table],
    propTablesExclude: [StatefulTable],
  },
};

export const StatefulExampleWithRowNestingAndFixedColumns = () => (
  <StatefulTableWithNestedRowItems />
);

StatefulExampleWithRowNestingAndFixedColumns.storyName =
  'with row nesting and resizable columns with initial width';

StatefulExampleWithRowNestingAndFixedColumns.parameters = {
  info: {
    text: `

    This stateful table has nested rows.  To setup your table this way you must pass a children prop along with each of your data rows.

    <br />

    ~~~js
    data=[
      {
        id: 'rowid',
        values: {
          col1: 'value1
        },
        children: [
          {
            id: 'child-rowid,
            values: {
              col1: 'nested-value1'
            }
          }
        ]
      }
    ]
    ~~~

    <br />

    You must also set hasRowNesting to true in your table options

    <br />

    ~~~js
      options={
        hasRowNesting: true
      }
    ~~~

    <br />

    `,
    propTables: [Table],
    propTablesExclude: [StatefulTable],
  },
};

export const StatefulExampleWithSingleNestedHierarchy = () => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'StatefulTable');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;

  const tableData = initialState.data.map((i, idx) => ({
    ...i,
    children: [getNewRow(idx, 'A', true), getNewRow(idx, 'B', true)],
  }));
  return (
    <div>
      <MyTable
        id="table"
        {...initialState}
        secondaryTitle={text(
          'Title shown in bar above header row (secondaryTitle)',
          `Row count: ${initialState.data.length}`
        )}
        columns={tableColumns}
        data={tableData}
        size={select(
          'Sets the height of the table rows (size)',
          ['xs', 'sm', 'md', 'lg', 'xl'],
          'lg'
        )}
        options={{
          ...initialState.options,
          hasRowNesting: {
            hasSingleNestedHierarchy: boolean(
              'options.hasRowNesting.hasSimpleNestedHierarchy',
              true
            ),
          },
          wrapCellText: select(
            'Choose how text should wrap witin columns (options.wrapCellText)',
            selectTextWrapping,
            'always'
          ),
        }}
        actions={tableActions}
      />
    </div>
  );
};

StatefulExampleWithSingleNestedHierarchy.storyName = 'with single nested hierarchy';

StatefulExampleWithSingleNestedHierarchy.parameters = {
  info: {
    text: `

    This stateful table has nested rows.  To setup your table this way you must pass a children prop along with each of your data rows.
    In addition, if there is a single level of row nesting, hasRowNesting can be customized to add additional styling seen in this story

    <br />

    ~~~js
    data=[
      {
        id: 'rowid',
        values: {
          col1: 'value1
        },
        children: [
          {
            id: 'child-rowid,
            values: {
              col1: 'nested-value1'
            }
          }
        ]
      }
    ]
    ~~~

    <br />

    You must also set hasRowExpansion to true and hasRowNesting to an object with hasSingleLevelRowNesting to true in your table options

    <br />

    ~~~js
      options={
        hasRowExpansion: true,
        hasRowNesting: {
          hasSingleLevelRowNesting: true
        }
      }
    ~~~

    <br />

    `,
    propTables: [Table],
    propTablesExclude: [StatefulTable],
  },
};

export const SimpleStatefulExampleWithColumnOverflowMenu = () => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'StatefulTable');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  return (
    <FullWidthWrapper>
      <MyTable
        id="table"
        {...initialState}
        columns={tableColumnsWithOverflowMenu.map((c) => ({
          ...c,
          width: '150px',
        }))}
        actions={tableActions}
        size={select(
          'Sets the height of the table rows (size)',
          ['xs', 'sm', 'md', 'lg', 'xl'],
          'lg'
        )}
        options={{
          hasAggregations: true,
          hasPagination: boolean('Enables pagination for the table (options.hasPagination)', true),
          hasRowSelection: select(
            'Enable or Disable selecting single, multiple, or no rows (options.hasRowSelection)',
            ['multi', 'single'],
            'multi'
          ),
          hasRowExpansion: false,
          hasResize: true,
          wrapCellText: select(
            'Choose how text should wrap witin columns (options.wrapCellText)',
            selectTextWrapping,
            'always'
          ),
          preserveColumnWidths: true,
        }}
        view={{
          aggregations: {
            label: 'Total',
            columns: [
              {
                id: 'number',
                align: 'end',
              },
            ],
          },
          table: {
            selectedIds: array(
              'An array of currently selected rowIds (view.table.selectedIds)',
              []
            ),
          },
        }}
      />
    </FullWidthWrapper>
  );
};

SimpleStatefulExampleWithColumnOverflowMenu.storyName =
  'with column overflow menu and aggregate column values';

SimpleStatefulExampleWithColumnOverflowMenu.parameters = {
  info: {
    text:
      'This is an example of the <MyTable> component that implements the overflow menu in the column header. Refer to the source files under /src/components/Table/TableHead for details. ',
    propTables: [Table],
    propTablesExclude: [StatefulTable],
  },
};

export const SimpleStatefulExampleWithAlignment = () => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'StatefulTable');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  return (
    <FullWidthWrapper>
      <MyTable
        id="table"
        {...initialState}
        secondaryTitle={text(
          'Title shown in bar above header row (secondaryTitle)',
          `Row count: ${initialState.data.length}`
        )}
        columns={tableColumnsWithAlignment.map((c, idx) => ({
          ...c,
          width: idx % 2 === 0 ? '100px' : '200px',
          tooltip: c.id === 'select' ? 'Select an option' : undefined,
        }))}
        data={initialState.data.map((eachRow, index) => ({
          ...eachRow,
          isSelectable: index % 3 !== 0,
        }))}
        size={select(
          'Sets the height of the table rows (size)',
          ['xs', 'sm', 'md', 'lg', 'xl'],
          'lg'
        )}
        actions={tableActions}
        options={{
          hasRowSelection: select(
            'Enable or Disable selecting single, multiple, or no rows (options.hasRowSelection)',
            ['multi', 'single', false],
            'multi'
          ),
          hasRowExpansion: boolean(
            'Enables expanding rows to show additional content (options.hasRowExpansion)',
            false
          ),
        }}
        view={{
          table: {
            selectedIds: array(
              'An array of currently selected rowIds (view.table.selectedIds)',
              []
            ),
          },
        }}
      />
    </FullWidthWrapper>
  );
};

SimpleStatefulExampleWithAlignment.storyName = 'with alignment and column tooltip';

SimpleStatefulExampleWithAlignment.parameters = {
  info: {
    text:
      'This is an example of the <MyTable> component that uses local state to handle all the table actions. This is produced by wrapping the <Table> in a container component and managing the state associated with features such the toolbar, filters, row select, etc. For more robust documentation on the prop model and source, see the other "with function" stories.',
    propTables: [Table],
    propTablesExclude: [StatefulTable],
  },
};

export const StatefulExampleWithEveryThirdRowUnselectable = () => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'StatefulTable');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  return (
    <MyTable
      id="table"
      {...initialState}
      secondaryTitle={text(
        'Title shown in bar above header row (secondaryTitle)',
        `Row count: ${initialState.data.length}`
      )}
      data={initialState.data.map((eachRow, index) => ({
        ...eachRow,
        isSelectable: index % 3 !== 0,
      }))}
      actions={tableActions}
      size={select(
        'Sets the height of the table rows (size)',
        ['xs', 'sm', 'md', 'lg', 'xl'],
        'lg'
      )}
      options={{
        hasRowSelection: select(
          'Enable or Disable selecting single, multiple, or no rows (options.hasRowSelection)',
          ['multi', 'single', false],
          'multi'
        ),
        hasRowExpansion: false,
      }}
      view={{
        table: {
          selectedIds: array('An array of currently selected rowIds (view.table.selectedIds)', []),
        },
      }}
    />
  );
};

StatefulExampleWithEveryThirdRowUnselectable.storyName = 'with every third row unselectable';

StatefulExampleWithEveryThirdRowUnselectable.parameters = {
  info: {
    text:
      'This is an example of the <MyTable> component that uses local state to handle all the table actions. This is produced by wrapping the <Table> in a container component and managing the state associated with features such the toolbar, filters, row select, etc. For more robust documentation on the prop model and source, see the other "with function" stories.',
    propTables: [Table],
    propTablesExclude: [StatefulTable],
  },
};

export const StatefulExampleWithExpansionMaxPagesAndColumnResize = () => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'StatefulTable');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  return (
    <FullWidthWrapper>
      <MyTable
        id="table"
        {...initialState}
        view={{
          ...initialState.view,
          pagination: {
            ...initialState.view.pagination,
            maxPages: 5,
          },
          toolbar: {
            activeBar: 'filter',
            customToolbarContent: (
              <FlyoutMenu
                direction={FlyoutMenuDirection.BottomEnd}
                buttonProps={{ size: 'default', renderIcon: SettingsAdjust16 }}
                iconDescription="Helpful description"
                triggerId="test-flyout-id"
                transactional={boolean('Flyout Transactional', true)}
                onApply={action('Flyout Menu Apply Clicked')}
                onCancel={action('Flyout Menu Cancel Clicked')}
              >
                Example Flyout Content
              </FlyoutMenu>
            ),
          },
        }}
        secondaryTitle={text(
          'Title shown in bar above header row (secondaryTitle)',
          `Row count: ${initialState.data.length}`
        )}
        actions={{
          ...tableActions,
          toolbar: {
            ...tableActions.toolbar,
            onDownloadCSV: (filteredData) => csvDownloadHandler(filteredData, 'my table data'),
          },
        }}
        size={select(
          'Sets the height of the table rows (size)',
          ['xs', 'sm', 'md', 'lg', 'xl'],
          'lg'
        )}
        options={{
          ...initialState.options,
          hasResize: true,
          hasFilter: select(
            'Enables filtering columns by value (options.hasFilter)',
            ['onKeyPress', 'onEnterAndBlur', true, false],
            'onKeyPress'
          ),
          wrapCellText: select(
            'Choose how text should wrap witin columns (options.wrapCellText)',
            selectTextWrapping,
            'always'
          ),
          hasSingleRowEdit: true,
        }}
      />
    </FullWidthWrapper>
  );
};

StatefulExampleWithExpansionMaxPagesAndColumnResize.storyName =
  'with expansion, maxPages, and column resize';

StatefulExampleWithExpansionMaxPagesAndColumnResize.parameters = {
  info: {
    text: `

    This table has expanded rows.  To support expanded rows, make sure to pass the expandedData prop to the table and set options.hasRowExpansion=true.

    <br />

    ~~~js
    expandedData={[
      {rowId: 'row-0',content: <RowExpansionContent />},
      {rowId: 'row-1',content: <RowExpansionContent />},
      {rowId: 'row-2',content: <RowExpansionContent />},
      …
    ]}

    options = {
      hasRowExpansion:true
    }

    view={{
      pagination: {
        maxPages: 5,
      }
    }}

    ~~~

    <br />

    `,
    propTables: [Table],
    propTablesExclude: [StatefulTable],
  },
};

export const StatefulExampleWithCreateSaveViews = () => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'StatefulTable');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  // The initial default state for this story is one with no active filters
  // and no default search value etc, i.e. a view all scenario.
  const defaultState = {
    ...initialState,
    columns: initialState.columns.map((col) => ({
      ...col,
      width: '150px',
    })),
    view: {
      ...initialState.view,
      filters: [],
      toolbar: {
        activeBar: 'filter',
        search: { defaultValue: '' },
      },
    },
  };

  // Create some mockdata to represent previously saved views.
  // The props can be any subset of the view and columns prop that
  // you need in order to successfully save and load your views.
  const viewExample = {
    description: 'Columns: 7, Filters: 0, Search: pinoc',
    id: 'view1',
    isPublic: true,
    isDeleteable: true,
    isEditable: true,
    title: 'My view 1',
    props: {
      view: {
        filters: [],
        table: {
          ordering: defaultState.view.table.ordering,
          sort: {},
        },
        toolbar: {
          activeBar: 'column',
          search: { defaultValue: text('defaultSearchValue', 'pinoc') },
        },
      },
      columns: defaultState.columns,
    },
  };
  const viewExample2 = {
    description: 'Columns: 7, Filters: 1, Search:',
    id: 'view2',
    isPublic: false,
    isDeleteable: true,
    isEditable: true,
    title: 'My view 2',
    props: {
      view: {
        filters: [{ columnId: 'string', value: 'helping' }],
        table: {
          ordering: defaultState.view.table.ordering,
          sort: {
            columnId: 'select',
            direction: 'DESC',
          },
        },
        toolbar: {
          activeBar: 'filter',
          search: { defaultValue: '' },
        },
      },
      columns: defaultState.columns,
    },
  };

  /** The "store" that holds all the existing views */
  const [viewsStorage, setViewsStorage] = useState([viewExample, viewExample2]);
  /** Tracks if the user has modified the view since it was selected */
  const [selectedViewEdited, setSelectedViewEdited] = useState(false);
  /** The props & metadata of the view currently selected */
  const [selectedView, setSelectedView] = useState(viewExample2);
  /** The props & metadata representing the current state needed by SaveViewModal  */
  const [viewToSave, setViewToSave] = useState(undefined);
  /** The id of the view that is currently the default */
  const [defaultViewId, setDefaultViewId] = useState('view2');
  /** Number of views per page in the TableManageViewModal */
  const manageViewsRowsPerPage = 10;
  /** Current page number in the TableManageViewModal */
  const [manageViewsCurrentPageNumber, setManageViewsCurrentPageNumber] = useState(1);
  /** Current filters in the TableManageViewModal. Can hold 'searchTerm' and 'showPublic' */
  const [manageViewsCurrentFilters, setManageViewsCurrentFilters] = useState({
    searchTerm: '',
    showPublic: true,
  });
  /** Flag needed to open and close the TableManageViewModal */
  const [manageViewsModalOpen, setManageViewsModalOpen] = useState(false);
  /** Collection of filtered views needed for the pagination in the TableManageViewModal */
  const [manageViewsFilteredViews, setManageViewsFilteredViews] = useState(viewsStorage);
  /** Collection of views on the current page in the TableManageViewModal */
  const [manageViewsCurrentPageItems, setManageViewsCurrentPageItems] = useState(
    viewsStorage.slice(0, manageViewsRowsPerPage)
  );

  // The seletable items to be presented by the ViewDropDown.
  const selectableViews = useMemo(
    () => viewsStorage.map(({ id, title }) => ({ id, text: title })),
    [viewsStorage]
  );

  // A helper method for currentUserViewRef that extracts a relevant subset of the
  // properties avilable in the "view" prop. It also extracts the columns since they
  // potentially hold the column widths.
  const extractViewRefData = ({ view, columns }) => {
    return {
      columns,
      view: {
        filters: view.filters,
        table: {
          ordering: view.table.ordering,
          sort: view.table.sort || {},
        },
        toolbar: {
          activeBar: view.toolbar.activeBar,
          search: { ...view.toolbar.search },
        },
      },
    };
  };

  // The table's current user view configuration (inlcuding unsaved changes to the selected view).
  // useRef is preferred over useState so that the value can be updated without causing a
  // rerender of the table.
  const currentUserViewRef = useRef({
    props: {
      ...(selectedView ? selectedView.props : extractViewRefData(defaultState)),
    },
  });

  // Callback from the StatefulTable when view, columns or search value have
  // been modified and we need to update our ref that holds the latest view config.
  const onUserViewModified = (newState) => {
    const {
      view,
      columns,
      // The default search value is not updated just because the user modifies
      // the actual search input so in order to set the defaultValue we can access
      // the internal "currentSearchValue" via a special state prop
      state: { currentSearchValue },
    } = newState;

    const props = extractViewRefData({ view, columns });
    props.view.toolbar.search = {
      ...props.view.toolbar.search,
      defaultValue: currentSearchValue,
    };
    currentUserViewRef.current = { props };

    if (!selectedView) {
      setSelectedViewEdited(!isEqual(props, extractViewRefData(defaultState)));
    } else {
      setSelectedViewEdited(!isEqual(props, selectedView.props));
    }
  };

  /**
   * The TableManageViewsModal is an external component that can be placed outside
   * the table. It is highly customizable and is used to list existing views and
   * provide the used the option to delete and edit the view's metadata. See the
   * TableManageViewsModal story for a more detailed documentation.
   */
  const renderManageViewsModal = () => {
    const showPage = (pageNumber, views) => {
      const rowUpperLimit = pageNumber * manageViewsRowsPerPage;
      const currentItemsOnPage = views.slice(rowUpperLimit - manageViewsRowsPerPage, rowUpperLimit);
      setManageViewsCurrentPageNumber(pageNumber);
      setManageViewsCurrentPageItems(currentItemsOnPage);
    };

    const applyFiltering = ({ searchTerm, showPublic }) => {
      const views = viewsStorage
        .filter(
          (view) =>
            searchTerm === '' || view.title.toLowerCase().search(searchTerm.toLowerCase()) !== -1
        )
        .filter((view) => (showPublic ? view : !view.isPublic));

      setManageViewsFilteredViews(views);
      showPage(1, views);
    };

    const onDelete = (viewId) => {
      if (selectedView?.id === viewId) {
        currentUserViewRef.current = {
          props: { ...extractViewRefData(defaultState) },
        };
        setSelectedViewEdited(false);
        setSelectedView(undefined);
      }

      const deleteIndex = viewsStorage.findIndex((view) => view.id === viewId);
      setViewsStorage((existingViews) => {
        const modifiedViews = [...existingViews];
        modifiedViews.splice(deleteIndex, 1);
        setManageViewsFilteredViews(modifiedViews);
        showPage(1, modifiedViews);
        return modifiedViews;
      });
    };

    return (
      <TableManageViewsModal
        actions={{
          onDisplayPublicChange: (showPublic) => {
            const newFilters = {
              ...manageViewsCurrentFilters,
              showPublic,
            };
            setManageViewsCurrentFilters(newFilters);
            applyFiltering(newFilters);
          },
          onSearchChange: (searchTerm = '') => {
            const newFilters = {
              ...manageViewsCurrentFilters,
              searchTerm,
            };
            setManageViewsCurrentFilters(newFilters);
            applyFiltering(newFilters);
          },
          onEdit: (viewId) => {
            setManageViewsModalOpen(false);
            const viewToEdit = viewsStorage.find((view) => view.id === viewId);
            setSelectedView(viewToEdit);
            setViewToSave(viewToEdit);
          },
          onDelete,
          onClearError: action('TableManageViewsModal: onClearManageViewsModalError'),
          onClose: () => setManageViewsModalOpen(false),
        }}
        defaultViewId={defaultViewId}
        error={select('TableManageViewsModal: error', [undefined, 'My error msg'], undefined)}
        isLoading={boolean('TableManageViewsModal: isLoading', false)}
        open={manageViewsModalOpen}
        views={manageViewsCurrentPageItems}
        pagination={{
          page: manageViewsCurrentPageNumber,
          onPage: (pageNumber) => showPage(pageNumber, manageViewsFilteredViews),
          maxPage: Math.ceil(manageViewsFilteredViews.length / manageViewsRowsPerPage),
          i18n: { pageOfPagesText: (pageNumber) => `Page ${pageNumber}` },
        }}
      />
    );
  };

  /**
   * The TableViewDropdown is an external component that needs to be passed in
   * via the customToolbarContent and positioned according to the applications needs.
   * Most of the functionality in the TableViewDropdown can be overwritten. See the
   * TableViewDropdown story for a more detailed documentation.
   */

  const renderViewDropdown = () => {
    return (
      <TableViewDropdown
        style={{ order: '-1', width: '300px' }}
        selectedViewId={selectedView?.id}
        selectedViewEdited={selectedViewEdited}
        views={selectableViews}
        actions={{
          onSaveAsNewView: () => {
            setViewToSave({
              id: undefined,
              ...currentUserViewRef.current,
            });
          },
          onManageViews: () => {
            setManageViewsModalOpen(true);
            setManageViewsCurrentPageItems(viewsStorage.slice(0, manageViewsRowsPerPage));
          },
          onChangeView: ({ id }) => {
            const selected = viewsStorage.find((view) => view.id === id);
            setSelectedView(selected);
            setSelectedViewEdited(false);
            currentUserViewRef.current = selected?.props || {
              props: extractViewRefData(defaultState),
            };
          },
          onSaveChanges: () => {
            setViewToSave({
              ...selectedView,
              ...currentUserViewRef.current,
            });
          },
        }}
      />
    );
  };

  /**
   * The TableSaveViewModal is a an external component that can be placed
   * outside the table. Is is used both for saving new views and for
   * updating existing ones. See the TableSaveViewModal story for a more
   * detailed documentation.
   */
  const renderSaveViewModal = () => {
    const saveView = (viewMetaData) => {
      setViewsStorage((existingViews) => {
        const modifiedStorage = [];
        const saveNew = viewToSave.id === undefined;
        const { isDefault, ...metaDataToSave } = viewMetaData;
        const generatedId = new Date().getTime().toString();

        if (saveNew) {
          const newViewToStore = {
            ...viewToSave,
            ...metaDataToSave,
            id: generatedId,
            isDeleteable: true,
            isEditable: true,
          };
          modifiedStorage.push(...existingViews, newViewToStore);
          setSelectedView(newViewToStore);
        } else {
          const indexToUpdate = existingViews.findIndex((view) => view.id === viewToSave.id);
          const viewsCopy = [...existingViews];
          const modifiedViewToStore = {
            ...viewToSave,
            ...metaDataToSave,
          };
          viewsCopy[indexToUpdate] = modifiedViewToStore;
          setSelectedView(modifiedViewToStore);
          modifiedStorage.push(...viewsCopy);
        }

        if (isDefault) {
          setDefaultViewId(saveNew ? generatedId : viewToSave.id);
        }

        setSelectedViewEdited(false);
        return modifiedStorage;
      });
      setViewToSave(undefined);
    };

    // Simple description example that can be replaced by any string or node.
    // See the TableSaveViewModal story for more examples.
    const getDescription = ({ table, filters, toolbar }) =>
      `Columns: ${table.ordering.filter((col) => !col.isHidden).length},
        Filters: ${filters?.length || 0},
        Search: ${toolbar?.search?.defaultValue}`;

    return (
      viewToSave && (
        <TableSaveViewModal
          actions={{
            onSave: saveView,
            onClose: () => {
              setViewToSave(undefined);
            },
            onClearError: action('TableSaveViewModal: onClearError'),
            onChange: action('TableSaveViewModal: onChange'),
          }}
          sendingData={boolean('TableSaveViewModal: sendingData', false)}
          error={select('TableSaveViewModal: error', [undefined, 'My error msg'], undefined)}
          open
          titleInputInvalid={boolean('TableSaveViewModal: titleInputInvalid', false)}
          titleInputInvalidText={text('TableSaveViewModal: titleInputInvalidText', undefined)}
          viewDescription={getDescription(viewToSave.props.view)}
          initialFormValues={{
            title: viewToSave.title,
            isPublic: viewToSave.isPublic,
            isDefault: viewToSave.id === defaultViewId,
          }}
          i18n={{
            modalTitle: viewToSave.id ? 'Update view' : 'Save new view',
          }}
        />
      )
    );
  };

  // We need to merge (using assign) the view properties from a few sources as
  // explained below in order to get the desired result. This is written as a
  // more general function, but it can just as well be written as an explicit
  // object literal picking the right properties from the different sources.
  const mergedViewProp = useMemo(() => {
    const merged = assign(
      {},
      // The default state view contains properties that are not
      // part of this Save View example, e.g. pagination, so we include
      // the default state as a baseline view configuration.
      defaultState.view,
      // These are the properties specific for the currently selected view
      selectedView?.props?.view,
      // These are the properties of an unsaved modified view that already
      // have to be rendered before they become part of the selected view.
      viewToSave?.props?.view
    );
    return merged;
  }, [defaultState, selectedView, viewToSave]);

  return (
    <FullWidthWrapper>
      {renderManageViewsModal()}
      {renderSaveViewModal()}
      <MyTable
        key={`table-story-${selectedView?.id}`}
        id="table"
        {...defaultState}
        columns={viewToSave?.props?.columns || selectedView?.props?.columns || defaultState.columns}
        view={{
          ...mergedViewProp,
          // The TableViewDropdown should be inserted as customToolbarContent
          toolbar: {
            ...mergedViewProp.toolbar,
            customToolbarContent: renderViewDropdown(),
          },
        }}
        secondaryTitle="Table with user view management"
        actions={{
          ...tableActions,
          onUserViewModified,
        }}
        size={select(
          'Sets the height of the table rows (size)',
          ['xs', 'sm', 'md', 'lg', 'xl'],
          'lg'
        )}
        options={{
          ...defaultState.options,
          hasResize: true,
          hasFilter: select(
            'Enables filtering columns by value (options.hasFilter)',
            ['onKeyPress', 'onEnterAndBlur', true, false],
            'onKeyPress'
          ),
          wrapCellText: select(
            'Choose how text should wrap witin columns (options.wrapCellText)',
            selectTextWrapping,
            'always'
          ),
          // Enables the behaviour in StatefulTable and Table required
          // to fully implement Create and Save Views
          hasUserViewManagement: true,
        }}
      />
    </FullWidthWrapper>
  );
};

StatefulExampleWithCreateSaveViews.storyName = 'with create & save view management';
StatefulExampleWithCreateSaveViews.decorators = [createElement];

StatefulExampleWithCreateSaveViews.parameters = {
  info: {
    text: `
    This story shows a complete implementation of user configurable View Management.
    The story's source code is too complex to successfully be shown here, please view
    the actual source code.
    `,
    propTables: [Table],
    propTablesExclude: [StatefulTable],
  },
};

export const WithPreFilledSearch = () => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'StatefulTable');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  const [defaultValue, setDefaultValue] = useState('toyota');
  const sampleDefaultValues = ['whiteboard', 'scott', 'helping'];
  return (
    <>
      <p>
        Click the button below to demonstrate updating the pre-filled search (defaultValue) via
        state/props
      </p>
      <Button
        onClick={() => {
          setDefaultValue(
            sampleDefaultValues[sampleDefaultValues.indexOf(defaultValue) + 1] ||
              sampleDefaultValues[0]
          );
        }}
        style={{ marginBottom: '1rem' }}
      >
        Update defaultValue prop to new value
      </Button>
      <Button
        onClick={() => {
          setDefaultValue('');
        }}
        style={{ marginBottom: '1rem', marginLeft: '1rem' }}
      >
        Reset defaultValue prop to empty string
      </Button>
      <MyTable
        id="table"
        secondaryTitle={text(
          'Title shown in bar above header row (secondaryTitle)',
          `Row count: ${initialState.data.length}`
        )}
        style={{ maxWidth: '300px' }}
        columns={tableColumns.slice(0, 2)}
        data={tableData}
        actions={tableActions}
        options={{
          hasSearch: true,
          hasPagination: true,
          hasRowSelection: 'single',
        }}
        size={select(
          'Sets the height of the table rows (size)',
          ['xs', 'sm', 'md', 'lg', 'xl'],
          'lg'
        )}
        view={{
          toolbar: {
            search: {
              defaultValue,
            },
          },
        }}
        i18n={{
          emptyButtonLabelWithFilters: text(
            'i18n strings for translation (i18n.emptyButtonLabel)',
            '__Clear all filters__'
          ),
        }}
      />
    </>
  );
};

WithPreFilledSearch.storyName = 'with pre-filled search';
WithPreFilledSearch.decorators = [createElement];

WithPreFilledSearch.parameters = {
  info: {
    text: `The table will pre-fill a search value, expand the search input and trigger a search`,
  },
};

export const StatefulTableWithAdvancedFilters = () => {
  const [showBuilder, setShowBuilder] = useState(false);

  const [advancedFilters, setAdvancedFilters] = useState([
    {
      filterId: 'story-filter',
      /** Text for main tilte of page */
      filterTitleText: 'date CONTAINS 19, boolean=true',
      /** Text for metadata for the filter */
      filterMetaText: `last updated: 2021-03-11 15:34:01`,
      /** tags associated with particular filter */
      filterTags: ['fav', 'other-tag'],
      /** users that have access to particular filter */
      filterAccess: [
        {
          username: 'Example-User',
          email: 'example@pal.com',
          name: 'Example User',
          access: 'edit',
        },
        {
          username: 'Other-User',
          email: 'other@pal.com',
          name: 'Other User',
          access: 'read',
        },
      ],
      /** All possible users that can be granted access */
      filterUsers: [
        {
          id: 'teams',
          name: 'Teams',
          groups: [
            {
              id: 'team-a',
              name: 'Team A',
              users: [
                {
                  username: '@tpeck',
                  email: 'tpeck@pal.com',
                  name: 'Templeton Peck',
                },
                {
                  username: '@jsmith',
                  email: 'jsmith@pal.com',
                  name: 'John Smith',
                },
              ],
            },
          ],
        },
        {
          username: 'Example-User',
          email: 'example@pal.com',
          name: 'Example User',
        },
        {
          username: 'Test-User',
          email: 'test@pal.com',
          name: 'Test User',
        },
        {
          username: 'Other-User',
          email: 'other@pal.com',
          name: 'Other User',
        },
      ],
      /**
       * the rules passed into the component. The RuleBuilder is a controlled component, so
       * this works the same as passing defaultValue to a controlled input component.
       */
      filterRules: {
        id: '14p5ho3pcu',
        groupLogic: 'ALL',
        rules: [
          {
            id: 'rsiru4rjba',
            columnId: 'date',
            operand: 'CONTAINS',
            value: '19',
          },
          {
            id: '34bvyub9jq',
            columnId: 'boolean',
            operand: 'EQ',
            value: 'true',
          },
        ],
      },
      filterColumns: tableColumns,
    },
    {
      filterId: 'next-filter',
      /** Text for main tilte of page */
      filterTitleText: 'select=Option c, boolean=false',
      /** Text for metadata for the filter */
      filterMetaText: `last updated: 2021-03-11 15:34:01`,
      /** tags associated with particular filter */
      filterTags: ['fav', 'other-tag'],
      /** users that have access to particular filter */
      filterAccess: [
        {
          username: 'Example-User',
          email: 'example@pal.com',
          name: 'Example User',
          access: 'edit',
        },
        {
          username: 'Other-User',
          email: 'other@pal.com',
          name: 'Other User',
          access: 'read',
        },
      ],
      /** All possible users that can be granted access */
      filterUsers: [
        {
          id: 'teams',
          name: 'Teams',
          groups: [
            {
              id: 'team-a',
              name: 'Team A',
              users: [
                {
                  username: '@tpeck',
                  email: 'tpeck@pal.com',
                  name: 'Templeton Peck',
                },
                {
                  username: '@jsmith',
                  email: 'jsmith@pal.com',
                  name: 'John Smith',
                },
              ],
            },
          ],
        },
        {
          username: 'Example-User',
          email: 'example@pal.com',
          name: 'Example User',
        },
        {
          username: 'Test-User',
          email: 'test@pal.com',
          name: 'Test User',
        },
        {
          username: 'Other-User',
          email: 'other@pal.com',
          name: 'Other User',
        },
      ],
      /**
       * the rules passed into the component. The RuleBuilder is a controlled component, so
       * this works the same as passing defaultValue to a controlled input component.
       */
      filterRules: {
        id: '14p5ho3pcu',
        groupLogic: 'ALL',
        rules: [
          {
            id: 'rsiru4rjba',
            columnId: 'select',
            operand: 'EQ',
            value: 'option-C',
          },
          {
            id: '34bvyub9jq',
            columnId: 'boolean',
            operand: 'EQ',
            value: 'false',
          },
        ],
      },
      filterColumns: tableColumns,
    },
  ]);

  return (
    <>
      <StoryNotice experimental componentName="StatefulTable with advancedFilters" />

      <div style={{ position: 'relative' }}>
        <StatefulTable
          id="table"
          columns={tableColumns}
          data={tableData}
          actions={{
            ...tableActions,
            toolbar: {
              ...tableActions.toolbar,
              onCreateAdvancedFilter: () => {
                setShowBuilder(true);
              },
            },
          }}
          options={{
            hasPagination: true,
            hasRowSelection: 'multi',
            hasAdvancedFilter: true,
          }}
          size={select(
            'Sets the height of the table rows (size)',
            ['xs', 'sm', 'md', 'lg', 'xl'],
            'lg'
          )}
          view={{
            filters: [
              {
                columnId: 'string',
                value: 'whiteboard',
              },
              {
                columnId: 'select',
                value: 'option-B',
              },
            ],
            advancedFilters,
            selectedAdvancedFilterIds: ['story-filter'],
            table: {
              ordering: defaultOrdering,
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
                    filterId: 'a-new-filter-id',
                    ...newFilter,
                  },
                ]);
                setShowBuilder(false);
              }}
              onCancel={() => {
                setShowBuilder(false);
              }}
              filter={{
                filterColumns: tableColumns.map(({ id, name }) => ({ id, name })),
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

StatefulTableWithAdvancedFilters.storyName = '☢️ with advanced filters';
StatefulTableWithAdvancedFilters.decorators = [createElement];

export const WithMultiSorting = () => {
  const selectedTableType = select('Type of Table', ['Table', 'StatefulTable'], 'StatefulTable');
  const MyTable = selectedTableType === 'StatefulTable' ? StatefulTable : Table;
  return (
    <MyTable
      columns={tableColumns.map((i, idx) => ({
        ...i,
        width: '200px',
        isSortable: idx !== 1,
        align: i.id === 'number' ? 'end' : i.id === 'string' ? 'center' : 'start',
      }))}
      data={tableData}
      actions={tableActions}
      size={select(
        'Sets the height of the table rows (size)',
        ['xs', 'sm', 'md', 'lg', 'xl'],
        'lg'
      )}
      options={{
        hasFilter: false,
        hasPagination: true,
        hasRowSelection: 'multi',
        hasAggregations: false,
        hasMultiSort: true,
        hasResize: true,
        hasColumnSelection: true,
        preserveColumnWidths: true,
      }}
      view={{
        filters: [],
        aggregations: {
          label: 'Total',
          columns: [
            {
              id: 'number',
              align: 'end',
              isSortable: true,
            },
          ],
        },
        table: {
          ordering: defaultOrdering,
          sort: [
            {
              columnId: 'select',
              direction: 'ASC',
            },
            {
              columnId: 'string',
              direction: 'ASC',
            },
          ],
        },
      }}
    />
  );
};

WithMultiSorting.storyName = 'with multi-sorting';
WithMultiSorting.decorators = [
  (Story) => (
    <DragAndDrop>
      <Story />
    </DragAndDrop>
  ),
];
