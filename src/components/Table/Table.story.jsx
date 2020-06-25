import React, { useState, useLayoutEffect } from 'react';
// import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, text, number, select, array } from '@storybook/addon-knobs';
import styled from 'styled-components';
import Arrow from '@carbon/icons-react/lib/arrow--right/16';
import Add from '@carbon/icons-react/lib/add/16';
import Edit from '@carbon/icons-react/lib/edit/16';
import Delete from '@carbon/icons-react/lib/delete/16';
import { Add20, SettingsAdjust16 as SettingsAdjust } from '@carbon/icons-react';
import { Tooltip, TextInput, Checkbox, ToastNotification, Button } from 'carbon-components-react';
import cloneDeep from 'lodash/cloneDeep';

import { getSortedData, csvDownloadHandler } from '../../utils/componentUtilityFunctions';
import FullWidthWrapper from '../../internal/FullWidthWrapper';
import FlyoutMenu, { FlyoutMenuDirection } from '../FlyoutMenu/FlyoutMenu';

import Table from './Table';
import StatefulTable from './StatefulTable';
import AsyncTable from './AsyncTable/AsyncTable';
import MockApiClient from './AsyncTable/MockApiClient';

const selectData = [
  {
    id: 'option-A',
    text: 'option-A',
  },
  {
    id: 'option-B',
    text: 'option-B',
  },
  {
    id: 'option-C',
    text: 'option-C',
  },
];

const STATUS = {
  RUNNING: 'RUNNING',
  NOT_RUNNING: 'NOT_RUNNING',
  BROKEN: 'BROKEN',
};

const selectTextWrapping = ['always', 'never', 'auto'];

const renderStatusIcon = ({ value: status }) => {
  switch (status) {
    case STATUS.RUNNING:
    default:
      return (
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="3" stroke="none" strokeWidth="1" fill="green" />
        </svg>
      );
    case STATUS.NOT_RUNNING:
      return (
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="3" stroke="none" strokeWidth="1" fill="gray" />
        </svg>
      );
    case STATUS.BROKEN:
      return (
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="3" stroke="none" strokeWidth="1" fill="red" />
        </svg>
      );
  }
};
// Example custom sort method for the status field.  Will sort the broken to the top, then the running, then the not_running
const customColumnSort = ({ data, columnId, direction }) => {
  // clone inputData because sort mutates the array
  const sortedData = data.map(i => i);
  sortedData.sort((a, b) => {
    let compare = -1;
    // same status
    if (a.values[columnId] === b.values[columnId]) {
      compare = 0;
    } else if (a.values[columnId] === STATUS.RUNNING && b.values[columnId] === STATUS.NOT_RUNNING) {
      compare = -1;
    } else if (a.values[columnId] === STATUS.NOT_RUNNING && b.values[columnId] === STATUS.RUNNING) {
      compare = 1;
    } else if (b.values[columnId] === STATUS.BROKEN) {
      compare = 1;
    } else if (a.values[columnId] === STATUS.BROKEN) {
      compare = -1;
    }

    return direction === 'ASC' ? compare : -compare;
  });
  return sortedData;
};

export const tableColumns = [
  {
    id: 'string',
    name: 'String',
    filter: { placeholderText: 'enter a string' },
  },

  {
    id: 'date',
    name: 'Date',
    filter: { placeholderText: 'enter a date' },
  },
  {
    id: 'select',
    name: 'Select',
    filter: { placeholderText: 'pick an option', options: selectData },
  },
  {
    id: 'secretField',
    name: 'Secret Information',
  },
  {
    id: 'status',
    name: 'Status',
    renderDataFunction: renderStatusIcon,
    sortFunction: customColumnSort,
  },
  {
    id: 'number',
    name: 'Number',
    filter: { placeholderText: 'enter a number' },
  },
  {
    id: 'boolean',
    name: 'Boolean',
    filter: { placeholderText: 'true or false' },
  },
  {
    id: 'node',
    name: 'React Node',
  },
];

export const tableColumnsWithAlignment = [
  {
    id: 'string',
    name: 'String',
    filter: { placeholderText: 'enter a string' },
    align: 'start',
    isSortable: true,
  },
  {
    id: 'date',
    name: 'Date',
    filter: { placeholderText: 'enter a date' },
    align: 'center',
    isSortable: true,
  },
  {
    id: 'select',
    name: 'Select',
    filter: { placeholderText: 'pick an option', options: selectData },
    align: 'end',
  },
  {
    id: 'secretField',
    name: 'Secret Information',
    align: 'start',
  },
  {
    id: 'status',
    name: 'Status',
    renderDataFunction: renderStatusIcon,
    align: 'center',
  },
  {
    id: 'number',
    name: 'Number',
    filter: { placeholderText: 'enter a number' },
    align: 'end',
    isSortable: true,
  },
];

export const tableColumnsFixedWidth = tableColumns.map(i => ({
  ...i,
  width:
    i.id === 'string'
      ? '50px'
      : i.id === 'date'
      ? '180px'
      : i.id === 'select'
      ? '120px'
      : i.id === 'secretField'
      ? '300px'
      : i.id === 'status'
      ? '100px'
      : i.id === 'number'
      ? '80px'
      : i.id === 'boolean'
      ? '80px'
      : undefined,
}));

const defaultOrdering = tableColumns.map(c => ({
  columnId: c.id,
  isHidden: c.id === 'secretField',
}));

const words = [
  'toyota',
  'helping',
  'whiteboard',
  'as',
  'can',
  'bottle',
  'eat',
  'chocolate',
  'pinocchio',
  'scott',
];
const getLetter = index =>
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(index % 62);
const getWord = (index, step = 1) => words[(step * index) % words.length];
const getSentence = index =>
  `${getWord(index, 1)} ${getWord(index, 2)} ${getWord(index, 3)} ${index}`;
const getString = (index, length) =>
  Array(length)
    .fill(0)
    .map((i, idx) => getLetter(index * (idx + 14) * (idx + 1)))
    .join('');

const getStatus = idx => {
  const modStatus = idx % 3;
  switch (modStatus) {
    case 0:
    default:
      return STATUS.RUNNING;
    case 1:
      return STATUS.NOT_RUNNING;
    case 2:
      return STATUS.BROKEN;
  }
};

const getBoolean = index => {
  return index % 2 === 0;
};

const getNewRow = (idx, suffix = '', withActions = false) => ({
  id: `row-${idx}${suffix ? `_${suffix}` : ''}`,
  values: {
    string: getSentence(idx) + suffix,
    date: new Date(100000000000 + 1000000000 * idx * idx).toISOString(),
    select: selectData[idx % 3].id,
    secretField: getString(idx, 10) + suffix,
    number: idx * idx,
    status: getStatus(idx),
    boolean: getBoolean(idx),
    node: <Add20 />,
  },
  rowActions: withActions
    ? [
        {
          id: 'drilldown',
          renderIcon: Arrow,
          iconDescription: 'Drill in',
          labelText: 'Drill in',
        },
        {
          id: 'Add',
          renderIcon: Add,
          iconDescription: 'Add',
          labelText: 'Add',
          isOverflow: true,
        },
      ]
    : undefined,
});

const tableData = Array(100)
  .fill(0)
  .map((i, idx) => getNewRow(idx));

/** Sample expanded row component */
const RowExpansionContent = ({ rowId }) => (
  <div key={`${rowId}-expansion`} style={{ padding: 20 }}>
    <h3 key={`${rowId}-title`}>{rowId}</h3>
    <ul style={{ lineHeight: '22px' }}>
      {Object.entries(tableData.find(i => i.id === rowId).values).map(([key, value]) => (
        <li key={`${rowId}-${key}`}>
          <b>{key}</b>: {value}
        </li>
      ))}
    </ul>
  </div>
);

const StyledTableCustomRowHeight = styled(Table)`
  &&& {
    & tr {
      height: 5rem;
    }
  }
`;

const StyledCustomToolbarContent = styled.div`
  &&& {
    align-items: center;
    display: flex;
    padding: 0 1rem;
  }
`;

const actions = {
  pagination: {
    /** Specify a callback for when the current page or page size is changed. This callback is passed an object parameter containing the current page and the current page size */
    onChangePage: action('onChangePage'),
  },
  toolbar: {
    onApplyFilter: action('onApplyFilter'),
    onToggleFilter: action('onToggleFilter'),
    onShowRowEdit: action('onShowRowEdit'),
    onToggleColumnSelection: action('onToggleColumnSelection'),
    /** Specify a callback for when the user clicks toolbar button to clear all filters. Recieves a parameter of the current filter values for each column */
    onClearAllFilters: action('onClearAllFilters'),
    onCancelBatchAction: action('onCancelBatchAction'),
    onApplyBatchAction: action('onApplyBatchAction'),
    onApplySearch: action('onApplySearch'),
  },
  table: {
    onRowClicked: action('onRowClicked'),
    onRowSelected: action('onRowSelected'),
    onSelectAll: action('onSelectAll'),
    onEmptyStateAction: action('onEmptyStateAction'),
    onApplyRowAction: action('onApplyRowAction'),
    onRowExpanded: action('onRowExpanded'),
    onChangeOrdering: action('onChangeOrdering'),
    onColumnSelectionConfig: action('onColumnSelectionConfig'),
    onChangeSort: action('onChangeSort'),
    onColumnResize: action('onColumnResize'),
  },
};

/** This would be loaded from your fetch */
export const initialState = {
  columns: tableColumns.map((i, idx) => ({
    ...i,
    isSortable: idx !== 1,
  })),
  data: tableData.map((i, idx) => ({
    ...i,
    rowActions: [
      idx % 4 !== 0
        ? {
            id: 'drilldown',
            renderIcon: Arrow,
            iconDescription: 'Drill in',
            labelText: 'Drill in to find out more after observing',
          }
        : null,
      {
        id: 'edit',
        renderIcon: Edit,
        labelText: 'Edit',
        isOverflow: true,
        iconDescription: 'Edit',
        isDelete: false,
        isEdit: true,
      },
      {
        id: 'Add',
        renderIcon: Add,
        iconDescription: 'Add',
        labelText: 'Add',
        isOverflow: true,
        hasDivider: true,
      },
      {
        id: 'delete',
        renderIcon: Delete,
        labelText: 'Delete',
        isOverflow: true,
        iconDescription: 'Delete',
        isDelete: true,
      },
      {
        id: 'textOnly',
        labelText: 'Text only dummy action',
        isOverflow: true,
      },
    ].filter(i => i),
  })),
  expandedData: tableData.map(data => ({
    rowId: data.id,
    content: <RowExpansionContent rowId={data.id} />,
  })),
  options: {
    hasFilter: true,
    hasSearch: true,
    hasPagination: true,
    hasRowSelection: 'multi',
    hasRowExpansion: true,
    hasRowActions: true,
    hasColumnSelection: true,
    shouldExpandOnRowClick: false,
    hasRowEdit: true,
    wrapCellText: select('wrapCellText', selectTextWrapping, 'always'),
  },
  view: {
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
    pagination: {
      pageSize: 10,
      pageSizes: [10, 20, 30],
      page: 1,
      totalItems: tableData.length,
    },
    table: {
      isSelectAllSelected: false,
      selectedIds: [],
      sort: undefined,
      ordering: tableColumns.map(({ id }) => ({
        columnId: id,
        isHidden: id === 'secretField',
      })),
      expandedIds: [],
      rowActions: [],
      singleRowEditButtons: <span>singleRowEditButtons implementation needed</span>,
    },
    toolbar: {
      activeBar: 'filter',
      batchActions: [
        {
          id: 'delete',
          labelText: 'Delete',
          renderIcon: Delete,
          iconDescription: 'Delete',
        },
      ],
      rowEditBarButtons: <div>App implementation of rowEdit bar buttons expected</div>,
    },
  },
};

storiesOf('Watson IoT/Table', module)
  .add(
    'Simple Stateful Example',
    () => (
      <FullWidthWrapper>
        <StatefulTable
          {...initialState}
          actions={actions}
          lightweight={boolean('lightweight', false)}
          options={{
            hasRowSelection: select('hasRowSelection', ['multi', 'single'], 'multi'),
            hasRowExpansion: false,
            wrapCellText: select('wrapCellText', selectTextWrapping, 'always'),
          }}
          view={{ table: { selectedIds: array('selectedIds', []) } }}
        />
      </FullWidthWrapper>
    ),
    {
      info: {
        text:
          'This is an example of the <StatefulTable> component that uses local state to handle all the table actions. This is produced by wrapping the <Table> in a container component and managing the state associated with features such the toolbar, filters, row select, etc. For more robust documentation on the prop model and source, see the other "with function" stories.',
        propTables: [Table],
        propTablesExclude: [StatefulTable],
      },
    }
  )
  .add(
    'Simple Stateful Example with alignment',
    () => (
      <FullWidthWrapper>
        <StatefulTable
          {...initialState}
          secondaryTitle={text('Secondary Title', `Row count: ${initialState.data.length}`)}
          columns={tableColumnsWithAlignment}
          actions={actions}
          lightweight={boolean('lightweight', false)}
          options={{
            hasRowSelection: select('hasRowSelection', ['multi', 'single'], 'multi'),
            hasRowExpansion: false,
          }}
          view={{ table: { selectedIds: array('selectedIds', []) } }}
        />
      </FullWidthWrapper>
    ),
    {
      info: {
        text:
          'This is an example of the <StatefulTable> component that uses local state to handle all the table actions. This is produced by wrapping the <Table> in a container component and managing the state associated with features such the toolbar, filters, row select, etc. For more robust documentation on the prop model and source, see the other "with function" stories.',
        propTables: [Table],
        propTablesExclude: [StatefulTable],
      },
    }
  )

  .add(
    'Stateful Example with every third row unselectable',
    () => (
      <StatefulTable
        {...initialState}
        secondaryTitle={text('Secondary Title', `Row count: ${initialState.data.length}`)}
        data={initialState.data.map((eachRow, index) => ({
          ...eachRow,
          isSelectable: index % 3 !== 0,
        }))}
        actions={actions}
        lightweight={boolean('lightweight', false)}
        options={{
          hasRowSelection: select('hasRowSelection', ['multi', 'single'], 'multi'),
          hasRowExpansion: false,
        }}
        view={{ table: { selectedIds: array('selectedIds', []) } }}
      />
    ),
    {
      info: {
        text:
          'This is an example of the <StatefulTable> component that uses local state to handle all the table actions. This is produced by wrapping the <Table> in a container component and managing the state associated with features such the toolbar, filters, row select, etc. For more robust documentation on the prop model and source, see the other "with function" stories.',
        propTables: [Table],
        propTablesExclude: [StatefulTable],
      },
    }
  )
  .add(
    'Stateful Example with expansion, maxPages, and column resize',
    () => (
      <FullWidthWrapper>
        <StatefulTable
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
                <StyledCustomToolbarContent>
                  <FlyoutMenu
                    direction={FlyoutMenuDirection.BottomEnd}
                    buttonProps={{ size: 'default', renderIcon: SettingsAdjust }}
                    iconDescription="Helpful description"
                    triggerId="test-flyout-id"
                    transactional={boolean('Flyout Transactional', true)}
                    onApply={action('Flyout Menu Apply Clicked')}
                    onCancel={action('Flyout Menu Cancel Clicked')}
                  >
                    Example Flyout Content
                  </FlyoutMenu>
                </StyledCustomToolbarContent>
              ),
            },
          }}
          secondaryTitle={text('Secondary Title', `Row count: ${initialState.data.length}`)}
          actions={{
            ...actions,
            toolbar: {
              ...actions.toolbar,
              onDownloadCSV: () => csvDownloadHandler(initialState.data, 'my table data'),
            },
          }}
          isSortable
          lightweight={boolean('lightweight', false)}
          options={{
            ...initialState.options,
            hasResize: true,
            hasFilter: select('hasFilter', ['onKeyPress', 'onEnterAndBlur'], 'onKeyPress'),
            wrapCellText: select('wrapCellText', selectTextWrapping, 'always'),
            hasSingleRowEdit: true,
          }}
        />
      </FullWidthWrapper>
    ),
    {
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
    }
  )
  .add(
    'Stateful Example with row nesting and fixed columns',
    () => {
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
      return (
        <div>
          <StatefulTable
            {...initialState}
            secondaryTitle={text('Secondary Title', `Row count: ${initialState.data.length}`)}
            columns={tableColumnsFixedWidth}
            data={tableData}
            options={{
              ...initialState.options,
              hasRowNesting: true,
              hasFilter: true,
              wrapCellText: select('wrapCellText', selectTextWrapping, 'always'),
            }}
            view={{
              ...initialState.view,
              filters: [],
              toolbar: {
                activeBar: null,
              },
            }}
            actions={actions}
            lightweight={boolean('lightweight', false)}
          />
        </div>
      );
    },
    {
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

        You must also set hasRowExpansion to true in your table options

        <br />

        ~~~js
          options={
            hasRowExpansion: true
          }
        ~~~

        <br />

        `,
        propTables: [Table],
        propTablesExclude: [StatefulTable],
      },
    }
  )
  .add(
    'Basic table with full rowEdit example',
    () => {
      return React.createElement(() => {
        const [showRowEditBar, setShowRowEditBar] = useState(false);
        const startingData = tableData.map(i => ({
          ...i,
          rowActions: [
            {
              id: 'edit',
              renderIcon: Edit,
              iconDescription: 'Edit',
              labelText: 'Edit',
              isOverflow: true,
              isEdit: true,
            },
          ],
        }));
        const [currentData, setCurrentData] = useState(startingData);
        const [rowEditedData, setRowEditedData] = useState([]);
        const [previousData, setPreviousData] = useState([]);
        const [showToast, setShowToast] = useState(false);
        const [rowActionsState, setRowActionsState] = useState([]);

        const onDataChange = (e, columnId, rowId) => {
          const newValue = e.currentTarget ? e.currentTarget.value : e;
          rowEditedData.find(row => row.id === rowId).values[columnId] = newValue;
        };

        const onShowMultiRowEdit = () => {
          setRowEditedData(cloneDeep(currentData));
          setShowRowEditBar(true);
          setShowToast(false);
        };
        const onCancelRowEdit = () => {
          setRowEditedData([]);
          setShowRowEditBar(false);
          setRowActionsState([]);
        };
        const onSaveRowEdit = () => {
          setShowToast(true);
          setPreviousData(currentData);
          setCurrentData(rowEditedData);
          setRowEditedData([]);
          setShowRowEditBar(false);
          setRowActionsState([]);
        };
        const onUndoRowEdit = () => {
          setCurrentData(previousData);
          setPreviousData([]);
          setShowToast(false);
        };

        const onApplyRowAction = (action, rowId) => {
          if (action === 'edit') {
            setRowEditedData(cloneDeep(currentData));
            setRowActionsState([...rowActionsState, { rowId, isEditMode: true }]);
          }
        };

        // The app should handle i18n and button enable state, e.g. that the save button
        // is disabled when the input controls are pristine.
        const saveCancelButtons = (
          <React.Fragment>
            <Button
              key="cancel"
              style={{ marginRight: '8px' }}
              size="small"
              kind="tertiary"
              onClick={onCancelRowEdit}
            >
              Cancel
            </Button>
            <Button key="save" size="small" onClick={onSaveRowEdit}>
              Save
            </Button>
          </React.Fragment>
        );

        // This is a simplified example.
        // The app should handle input validation and types like dates, select etc
        const editDataFunction = ({ value, columnId, rowId }) => {
          const id = `${columnId}-${rowId}`;
          return React.isValidElement(value) ? (
            value
          ) : typeof value === 'boolean' ? (
            <Checkbox
              defaultChecked={value}
              id={id}
              labelText=""
              hideLabel
              onChange={e => onDataChange(e, columnId, rowId)}
            />
          ) : (
            <TextInput
              id={id}
              onChange={e => onDataChange(e, columnId, rowId)}
              type="text"
              light
              defaultValue={value}
              labelText=""
              hideLabel
            />
          );
        };

        const myToast = (
          <ToastNotification
            style={{ position: 'absolute', zIndex: '1' }}
            hideCloseButton={false}
            kind="success"
            notificationType="inline"
            role="alert"
            subtitle={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>Changed your mind?</span>
                <Button
                  style={{ color: 'white', marginLeft: '12px' }}
                  kind="ghost"
                  onClick={onUndoRowEdit}
                  size="small"
                  type="button"
                >
                  Undo edits
                </Button>
              </div>
            }
            timeout={5000}
            title="Your changes have been saved."
          />
        );

        return (
          <div>
            {showToast ? myToast : null}
            <Table
              secondaryTitle="My editable table"
              view={{
                toolbar: {
                  activeBar: showRowEditBar ? 'rowEdit' : undefined,
                  rowEditBarButtons: saveCancelButtons,
                },
                table: { rowActions: rowActionsState, singleRowEditButtons: saveCancelButtons },
              }}
              data={currentData}
              actions={{
                table: { onApplyRowAction },
                toolbar: { onShowRowEdit: onShowMultiRowEdit },
              }}
              options={{
                hasRowEdit: boolean('hasRowEdit', true),
                hasSingleRowEdit: boolean('hasSingleRowEdit', true),
                hasRowActions: true,
                hasPagination: true,
              }}
              columns={tableColumns.map(i => ({ ...i, editDataFunction }))}
            />
          </div>
        );
      });
    },
    {
      info: {
        text: `

        This table has editable rows. It is wrapped in a component that handles the state of the table data and 
        the active bar to serve as a simple example of how to use the 'hasRowEdit' and the 'hasSingleRowEdit' 
        functionality with your own data store. 
        
        When the 'hasRowEdit' is true an edit icon will be shown in the 
        table toolbar. Clicking the edit icon should enable row edit for all rows, but it requires the
        columns to have an 'editDataFunction' prop defined. For StatefulTable this is handled automatically, for normal tables it
        should be handled manually as shown in this story.

        The 'hasSingleRowEdit' must be combined with a row action that has the "isEdit" property set to true. 
        Clicking that row action shoulf turn that specific row editable, and it also requires the columns to have 
        provided a 'editDataFunction'. For StatefulTable the row action state is automatically updated with 
        isEditMode:true but for normal tables it should be handled manually as shown in this story.
    

        ~~~js

        view = {
          toolbar: {
            activeBar: // conditionally set to 'rowEdit' using onShowRowEdit action
            rowEditBarButtons: // JSX to show save and cancel buttons in the rowEdit bar
          }
        }

        actions = {
          table: { onApplyRowAction: (action, rowId) => {
            // Handle action === 'edit' to enable the rows edit mode
          } },
          toolbar: { onShowRowEdit: (action, rowId) => {
            // Update your state to enable full table edit mode
          } },
        }

        options = { hasRowEdit: true, hasSingleRowEdit: true }

        columns={columns.map(i => ({
          ...i,
          editDataFunction: () => {
            // Your edit data function here..
          },
        }))}

        The editDataFunction is called with this payload
        {
           value: PropTypes.any (current cell value),
           columnId: PropTypes.string,
           rowId: PropTypes.string,
           row: the full data for this rowPropTypes.object like this {col: value, col2: value}
        }
        ~~~

        `,
        propTables: [Table],
        propTablesExclude: [StatefulTable],
      },
    }
  )
  .add(
    'basic `dumb` table',
    () => (
      <Table
        columns={tableColumns}
        data={tableData}
        actions={actions}
        options={{
          hasSearch: boolean('hasSearch', false),
          hasFilter: boolean('hasFilter', false),
          hasPagination: boolean('hasPagination', false),
          hasRowEdit: boolean('hasRowEdit', false),
        }}
      />
    ),
    {
      info: {
        text: `

        For basic table support, you can render the functional <Table/> component with only the columns and data props.  This table does not have any state management built in.  If you want that, use the <StatefulTable/> component or you will need to implement your own listeners and state management.  You can reuse our tableReducer and tableActions with the useReducer hook to update state.

        <br />

        To enable simple search on a table, simply set the prop options.hasSearch=true.  We wouldn't recommend enabling column filters on a table and simple search for UX reasons, but it is supported.

        <br />

        Warning: Searching, filtering, and sorting is only enabled for strings, numbers, and booleans.

        <br />

        ~~~js
        import { tableReducer, tableActions } from 'carbon-addons-iot-react';

        const [state, dispatch] = useReducer(tableReducer, { data: initialData, view: initialState });

        const actions = {
          table: {
            onChangeSort: column => {
              dispatch(tableActions.tableColumnSort(column));
            },
          }
        }

        <Table
          {...state}
          ...
        ~~~

        <br />
        `,
      },
    }
  )
  .add(
    'minitable',
    () => (
      <StatefulTable
        secondaryTitle={text('Secondary Title', `Row count: ${initialState.data.length}`)}
        style={{ maxWidth: '300px' }}
        columns={tableColumns.slice(0, 2)}
        data={tableData}
        actions={actions}
        options={{ hasSearch: true, hasPagination: true, hasRowSelection: 'single' }}
      />
    ),
    {
      info: {
        text: `The table will automatically adjust to narrow mode if you set a style or class that makes max-width smaller than 600 pixels (which is the width needed to render the full pagination controls) `,
      },
    }
  )
  .add(
    'with pre-filled search',
    () => (
      <StatefulTable
        secondaryTitle={text('Secondary Title', `Row count: ${initialState.data.length}`)}
        style={{ maxWidth: '300px' }}
        columns={tableColumns.slice(0, 2)}
        data={tableData}
        actions={actions}
        options={{ hasSearch: true, hasPagination: true, hasRowSelection: 'single' }}
        view={{
          toolbar: {
            search: {
              defaultValue: 'toyota',
            },
          },
        }}
      />
    ),
    {
      info: {
        text: `The table will pre-fill a search value, expand the search input and trigger a search`,
      },
    }
  )
  .add('with multi select and batch actions', () => (
    <StatefulTable
      secondaryTitle={text('Secondary Title', `Row count: ${initialState.data.length}`)}
      columns={tableColumns}
      data={tableData}
      actions={actions}
      options={{
        hasFilter: true,
        hasPagination: true,
        hasRowSelection: 'multi',
      }}
      view={{
        filters: [],
        toolbar: {
          batchActions: [
            {
              id: 'delete',
              labelText: 'Delete',
              renderIcon: Delete,
              iconDescription: 'Delete Item',
            },
          ],
        },
        table: {
          ordering: defaultOrdering,
          isSelectAllSelected: false,
          isSelectAllIndeterminate: true,
          selectedIds: ['row-3', 'row-4', 'row-6', 'row-7'],
        },
      }}
    />
  ))
  .add('with single select', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      options={{ hasRowSelection: 'single' }}
      view={{ table: { selectedIds: ['row-3'] } }}
    />
  ))
  .add('with single select and nested table rows ', () => (
    <Table
      columns={tableColumns}
      data={tableData.map((i, idx) => ({
        ...i,
        children:
          idx === 3
            ? [getNewRow(idx, 'A'), getNewRow(idx, 'B')]
            : idx === 7
            ? [
                getNewRow(idx, 'A'),
                {
                  ...getNewRow(idx, 'B'),
                  children: [getNewRow(idx, 'B-1'), getNewRow(idx, 'B-2')],
                },
                getNewRow(idx, 'C'),
                {
                  ...getNewRow(idx, 'D'),
                  children: [getNewRow(idx, 'D-1'), getNewRow(idx, 'D-2'), getNewRow(idx, 'D-3')],
                },
              ]
            : undefined,
      }))}
      options={{
        hasPagination: true,
        hasRowSelection: 'single',
        hasRowExpansion: true,
        hasRowNesting: true,
      }}
      actions={actions}
      view={{
        table: {
          expandedIds: ['row-3', 'row-7', 'row-7_B'],
          selectedIds: ['row-3_A'],
        },
      }}
    />
  ))
  .add('with row expansion and on row click expands', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      options={{
        hasRowExpansion: true,
        shouldExpandOnRowClick: true,
      }}
      view={{
        filters: [],
        table: {
          ordering: defaultOrdering,
          expandedRows: [
            {
              rowId: 'row-2',
              content: <RowExpansionContent rowId="row-2" />,
            },
            {
              rowId: 'row-5',
              content: <RowExpansionContent rowId="row-5" />,
            },
          ],
        },
      }}
    />
  ))
  .add(
    'with row expansion and actions',
    () => (
      <Table
        columns={tableColumns}
        data={tableData.map((i, idx) => ({
          ...i,
          rowActions: [
            idx % 4 === 0
              ? {
                  id: 'drilldown',
                  renderIcon: Arrow,
                  iconDescription: 'See more',
                  labelText: 'See more',
                }
              : null,
            {
              id: 'add',
              renderIcon: Add,
              iconDescription: 'Add',
              labelText: 'Add',
              isOverflow: true,
              hasDivider: true,
            },
            {
              id: 'delete',
              renderIcon: Delete,
              iconDescription: 'Delete',
              labelText: 'Delete',
              isOverflow: true,
              isDelete: true,
            },
          ].filter(i => i),
        }))}
        actions={actions}
        options={{
          hasRowExpansion: true,
          hasRowActions: true,
        }}
        view={{
          filters: [],
          table: {
            ordering: defaultOrdering,
            expandedRows: [
              {
                rowId: 'row-2',
                content: <RowExpansionContent rowId="row-2" />,
              },
              {
                rowId: 'row-5',
                content: <RowExpansionContent rowId="row-5" />,
              },
            ],
            rowActions: [
              {
                rowId: 'row-1',
                isRunning: true,
              },
              {
                rowId: 'row-3',
                error: { title: 'Import failed', message: 'Contact your administrator' },
              },
            ],
          },
        }}
      />
    ),
    {
      info: {
        text: `

        To add custom row actions to each row you need to pass a rowActions array along with every row of your data.  The RowActionsPropTypes is defined as:

        <br />

        ~~~js
        RowActionPropTypes = PropTypes.arrayOf(
          PropTypes.shape({
            /** Unique id of the action */
            id: PropTypes.string.isRequired,
            /** icon ultimately gets passed through all the way to <Button>, which has this same copied proptype definition for icon */
            icon: PropTypes.oneOfType([
              PropTypes.shape({
                width: PropTypes.string,
                height: PropTypes.string,
                viewBox: PropTypes.string.isRequired,
                svgData: PropTypes.object.isRequired,
              }),
              PropTypes.string,
              PropTypes.node,
            ]),
            disabled: PropTypes.bool,
            labelText: PropTypes.string,
            /** Action should go into the overflow menu, not be rendered inline in the row */
            isOverflow: PropTypes.bool,
          })
        );

        data.map(row=>{id: row.id, values: {id: row.id}, rowActions=[{id: delete, icon: 'icon--delete', labelText: 'Delete'}]})
        ~~~

        <br />

        You also need to set the options prop on the table to get the rowActions to render.

        <br />

        ~~~js
        options = {
          hasRowActions: true
        }
        ~~~

        <br />

        To listen to the row actions and trigger an event you should pass a function to the actions prop:

        <br />

        ~~~js
        actions={
          table: {
            onApplyRowAction: myCustomListener
          }
        }
        ~~~

        <br />

        The onApplyRowAction is called with the actionid, and then the rowid that was clicked.  If you return a promise, the table will assume this is an asynchronous action and will show an In Progress indicator until you resolve or reject the promise.

        <br />

        ~~~js
          const myCustomListener = (actionid, rowid)=> {
            if (actionid === 'myexpectedaction') {
              console.log(\`perform action on row: \${rowid}\`)
            }
          }
        ~~~

        <br />

        `,
      },
    }
  )
  .add('with sorting', () => (
    <Table
      columns={tableColumns.map((i, idx) => ({
        ...i,
        isSortable: idx !== 1,
      }))}
      data={getSortedData(tableData, 'string', 'ASC')}
      actions={actions}
      options={{
        hasFilter: false,
        hasPagination: true,
        hasRowSelection: 'multi',
      }}
      view={{
        filters: [],
        table: {
          ordering: defaultOrdering,
          sort: {
            columnId: 'string',
            direction: 'ASC',
          },
        },
      }}
    />
  ))
  .add(
    'with custom cell renderer',
    () => {
      const renderDataFunction = ({ value }) => <div style={{ color: 'red' }}>{value}</div>;
      return (
        <Table
          columns={tableColumns.map(i => ({
            ...i,
            renderDataFunction,
          }))}
          data={tableData}
          actions={actions}
          options={{
            hasFilter: true,
            hasPagination: true,
            hasRowSelection: 'multi',
          }}
          view={{
            filters: [],
            table: {
              ordering: defaultOrdering,
              sort: {
                columnId: 'string',
                direction: 'ASC',
              },
            },
          }}
        />
      );
    },
    {
      info: {
        text: `To render a custom widget in a table cell, pass a renderDataFunction prop along with your column metadata.

        <br />

        ~~~js
            The renderDataFunction is called with this payload
           {
              value: PropTypes.any (current cell value),
              columnId: PropTypes.string,
              rowId: PropTypes.string,
              row: the full data for this rowPropTypes.object like this {col: value, col2: value}
           }
        ~~~

        <br />
          `,
      },
    }
  )
  .add('with filters', () => {
    const filteredData = tableData.filter(({ values }) =>
      // return false if a value doesn't match a valid filter
      [
        {
          columnId: 'string',
          value: 'whiteboard',
        },
        {
          columnId: 'select',
          value: 'option-B',
        },
      ].reduce(
        (acc, { columnId, value }) => acc && values[columnId].toString().includes(value),
        true
      )
    );
    return (
      <Table
        columns={tableColumns}
        data={filteredData}
        actions={actions}
        options={{
          hasFilter: true,
          hasPagination: true,
          hasRowSelection: 'multi',
        }}
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
          pagination: {
            totalItems: filteredData.length,
          },
          toolbar: {
            activeBar: 'filter',
          },
          table: {
            ordering: defaultOrdering,
          },
        }}
      />
    );
  })
  .add('with column selection', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      options={{
        hasPagination: true,
        hasRowSelection: 'multi',
        hasColumnSelection: true,
        hasColumnSelectionConfig: boolean('hasColumnSelectionConfig', true),
      }}
      view={{
        toolbar: {
          activeBar: 'column',
        },
        table: {
          ordering: defaultOrdering,
        },
      }}
      i18n={{ columnSelectionConfig: text('i18n.columnSelectionConfig', '__Manage columns__') }}
    />
  ))
  .add('with no results', () => (
    <Table
      columns={tableColumns}
      data={[]}
      actions={actions}
      view={{
        filters: [
          {
            columnId: 'string',
            value: 'something not matching',
          },
        ],
        toolbar: {
          activeBar: 'filter',
        },
        table: {
          ordering: defaultOrdering,
        },
      }}
      options={{ hasFilter: true, hasPagination: true }}
    />
  ))
  .add('with no data', () => (
    <Table
      columns={tableColumns}
      data={[]}
      actions={actions}
      view={{
        table: {
          ordering: defaultOrdering,
        },
      }}
      options={{ hasPagination: true }}
    />
  ))
  .add('with nested table rows', () => (
    <Table
      columns={tableColumns}
      data={tableData.map((i, idx) => ({
        ...i,
        children:
          idx === 3
            ? [getNewRow(idx, 'A'), getNewRow(idx, 'B')]
            : idx === 7
            ? [
                getNewRow(idx, 'A'),
                {
                  ...getNewRow(idx, 'B'),
                  children: [getNewRow(idx, 'B-1'), getNewRow(idx, 'B-2')],
                },
                getNewRow(idx, 'C'),
                {
                  ...getNewRow(idx, 'D'),
                  children: [getNewRow(idx, 'D-1'), getNewRow(idx, 'D-2'), getNewRow(idx, 'D-3')],
                },
              ]
            : undefined,
      }))}
      options={{
        hasPagination: true,
        hasRowSelection: 'multi',
        hasRowExpansion: true,
        hasRowNesting: true,
      }}
      actions={actions}
      view={{
        table: {
          expandedIds: ['row-3', 'row-7', 'row-7_B'],
        },
      }}
    />
  ))
  .add('with no data and custom empty state', () => (
    <Table
      columns={tableColumns}
      data={[]}
      actions={actions}
      view={{
        table: {
          ordering: defaultOrdering,
          emptyState: (
            <div key="empty-state">
              <h1 key="empty-state-heading">Custom empty state</h1>
              <p key="empty-state-message">Hey, no data!</p>
            </div>
          ),
        },
      }}
      options={{ hasPagination: true }}
    />
  ))
  .add('with loading state', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      view={{
        table: {
          ordering: defaultOrdering,
          loadingState: {
            isLoading: true,
            rowCount: 7,
          },
        },
      }}
    />
  ))
  .add('with zebra striping', () => (
    <Table useZebraStyles columns={tableColumns} data={tableData} actions={actions} />
  ))
  .add('with resize and initial column widths on Simple Stateful and row selection', () => (
    <StatefulTable
      {...initialState}
      actions={actions}
      lightweight={boolean('lightweight', false)}
      columns={tableColumns.map((i, idx) => ({
        width: idx % 2 === 0 ? '100px' : '200px',
        ...i,
      }))}
      options={{
        hasRowSelection: select('hasRowSelection', ['multi', 'single'], 'multi'),
        hasRowExpansion: false,
        hasResize: true,
        wrapCellText: select('wrapCellText', selectTextWrapping, 'always'),
      }}
      view={{ table: { selectedIds: array('selectedIds', []) } }}
    />
  ))
  .add(
    'with resize and initial column widths and hidden column',
    () => (
      <FullWidthWrapper>
        <Table
          options={{
            hasResize: true,
            wrapCellText: select('wrapCellText', selectTextWrapping, 'always'),
          }}
          columns={tableColumns.map((i, idx) => ({
            width: idx % 2 === 0 ? '100px' : '200px',
            ...i,
          }))}
          data={tableData}
          actions={actions}
          view={{
            table: {
              ordering: defaultOrdering,
            },
          }}
        />
      </FullWidthWrapper>
    ),
    {
      info: {
        source: true,
        propTables: false,
      },
    }
  )
  .add(
    'with resize, hasColumnSelection and initial column widths',
    () => (
      <StatefulTable
        options={{
          hasResize: true,
          hasColumnSelection: true,
          wrapCellText: select('wrapCellText', selectTextWrapping, 'always'),
        }}
        columns={tableColumns.map((i, idx) => ({
          width: idx % 2 === 0 ? '100px' : '200px',
          ...i,
        }))}
        data={tableData}
        actions={actions}
        view={{
          table: {
            ordering: defaultOrdering,
          },
        }}
      />
    ),
    {
      info: {
        source: true,
        propTables: false,
      },
    }
  )
  .add(
    'with resize, onColumnResize callback and no initial column width',
    () => {
      return React.createElement(() => {
        const [myColumns, setMyColumns] = useState(tableColumns);
        const onColumnResize = cols => setMyColumns(cols);
        return (
          <Table
            options={{
              hasResize: true,
              wrapCellText: select('wrapCellText', selectTextWrapping, 'always'),
            }}
            columns={myColumns}
            data={tableData}
            actions={{ ...actions, table: { ...actions.table, onColumnResize } }}
          />
        );
      });
    },
    {
      info: {
        source: true,
        propTables: false,
      },
    }
  )
  .add(
    'with resize and no initial column width and auto adjusted column widths',
    () => (
      <React.Fragment>
        <p>
          <strong>Note!</strong> <br />
          For this configuration to work, the table must be wrapped in a container that has a width
          defined in other than %. <br />
          E.g. the FullWidthWrapper used by the storybook examples.
        </p>
        <FullWidthWrapper>
          <Table
            options={{
              hasResize: true,
              useAutoTableLayoutForResize: true,
              wrapCellText: select('wrapCellText', selectTextWrapping, 'always'),
            }}
            columns={tableColumns}
            data={tableData}
            actions={actions}
          />
        </FullWidthWrapper>
      </React.Fragment>
    ),
    {
      info: {
        source: true,
        propTables: false,
      },
    }
  )
  .add(
    'with fixed column width and no resize',
    () => (
      // You don't need to use styled components, just pass a className to the Table component and use selectors to find the correct column
      <FullWidthWrapper>
        <Table
          options={{
            hasResize: false,
            hasColumnSelection: true,
            wrapCellText: select('wrapCellText', selectTextWrapping, 'always'),
          }}
          columns={tableColumns.map((i, idx) => ({
            width: idx % 2 === 0 ? '20rem' : '10rem',
            ...i,
          }))}
          data={tableData}
          actions={actions}
        />
      </FullWidthWrapper>
    ),
    {
      info: {
        source: true,
        propTables: false,
      },
    }
  )
  .add('with resize and no initial columns', () =>
    React.createElement(() => {
      // Initial render is an empty columns array, which is updated after the first render
      const [columns, setColumns] = useState([]);
      useLayoutEffect(() => {
        setColumns(
          tableColumns.map((i, idx) => ({
            width: idx % 2 === 0 ? '100px' : '100px',
            ...i,
          }))
        );
      }, []);
      return (
        <Table
          options={{
            hasResize: true,
            wrapCellText: select('wrapCellText', selectTextWrapping, 'always'),
          }}
          columns={columns}
          data={tableData}
          actions={actions}
        />
      );
    })
  )
  .add(
    'with custom row height',
    () => (
      // You don't need to use styled components, just pass a className to the Table component and use selectors to find the correct column
      <FullWidthWrapper>
        <StyledTableCustomRowHeight columns={tableColumns} data={tableData} actions={actions} />
      </FullWidthWrapper>
    ),
    {
      info: {
        source: false,
        text: `This is an example of the <Table> component that has a custom row height. Pass a custom className prop to the Table component and use a css selector to change the height of all the rows.
        `,
        propTables: false,
      },
    }
  )
  .add('with lightweight design', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      options={{ hasPagination: true }}
      actions={actions}
      lightweight={boolean('lightweight', true)}
    />
  ))
  .add(
    'with hasOnlyPageData',
    () => {
      return (
        <Table
          columns={tableColumns}
          options={{ hasOnlyPageData: true, hasPagination: true }}
          data={tableData.slice(25, 35)} // this isn't the "8267th page", but we just want to indicate that it is not the first page of data
          actions={actions}
          view={{
            pagination: {
              pageSize: 10,
              pageSizes: [10, 20, 30],
              page: 8267,
              totalItems: 97532,
            },
          }}
        />
      );
    },
    {
      info: {
        text:
          'By default, tables with pagination will expect the entire table data to be passed in on the `data` prop; the visible data for a page is calculated dynamically by the table based on the page size and page number.  In the case where the table is rendering a large data set, the `options.hasOnlyPageData` prop can be used change this behavior.  With `options.hasOnlyPageData = true`, the `data` prop will be expected to contain only the rows for the visible page.',
        source: true,
      },
    }
  )
  .add('horizontal scroll - custom width', () => {
    const tableColumnsConcat = [
      { id: 'test2', name: 'Test 2' },
      { id: 'test3', name: 'Test 3' },
      {
        id: 'test4',
        name: 'Test 4',
      },
    ];
    // You don't n,eed to use styled components, just pass a className to the Table component and use selectors to find the correct column
    return (
      <div style={{ width: '800px' }}>
        <Table
          columns={tableColumns.concat(tableColumnsConcat)}
          options={{
            hasFilter: true,
            hasPagination: true,
            wrapCellText: select('wrapCellText', selectTextWrapping, 'always'),
          }}
          data={tableData}
          actions={actions}
          view={{
            filters: [
              { columnId: 'string', value: 'whiteboard' },
              { columnId: 'select', value: 'option-B' },
            ],
            toolbar: { activeBar: 'filter' },
          }}
        />
      </div>
    );
  })
  .add('horizontal scroll - full width - no wrap', () => {
    const tableColumnsConcat = [
      { id: 'test2', name: 'Test 2' },
      { id: 'test3', name: 'Test 3' },
      {
        id: 'test4',
        name: 'Test 4',
      },
    ];
    // You don't n,eed to use styled components, just pass a className to the Table component and use selectors to find the correct column
    return (
      <Table
        columns={tableColumns.concat(tableColumnsConcat)}
        options={{
          hasFilter: true,
          hasPagination: true,
          wrapCellText: select('wrapCellText', selectTextWrapping, 'always'),
        }}
        data={tableData}
        actions={actions}
        view={{
          filters: [
            { columnId: 'string', value: 'whiteboard' },
            { columnId: 'select', value: 'option-B' },
          ],
          toolbar: { activeBar: 'filter' },
        }}
      />
    );
  })
  .add(
    'Filtered/Sorted/Paginated table with asynchronous data source',
    () => {
      const apiClient = new MockApiClient(100, number('Fetch Duration (ms)', 500));
      return <AsyncTable fetchData={apiClient.getData} />;
    },
    {
      info: {
        text:
          'This is an example of how to use the <Table> component to present data fetched asynchronously from an HTTP API supporting pagination, filtering and sorting. Refer to the source files under /src/components/Table/AsyncTable for details. ',
        source: false,
      },
    }
  )
  .add('Custom toolbar content', () => (
    <Table
      columns={tableColumns}
      options={{ hasFilter: true, hasPagination: true }}
      data={tableData}
      actions={actions}
      view={{
        filters: [
          { columnId: 'string', value: 'whiteboard' },
          { columnId: 'select', value: 'option-B' },
        ],
        toolbar: {
          activeBar: 'filter',
          customToolbarContent: <StyledCustomToolbarContent>my custom</StyledCustomToolbarContent>,
        },
      }}
    />
  ))
  .add(
    'Stateful Example with I18N strings',
    () => (
      <StatefulTable
        {...initialState}
        secondaryTitle={text('Secondary Title', `Row count: ${initialState.data.length}`)}
        actions={actions}
        options={{
          hasRowActions: true,
        }}
        view={{
          filters: [],
          table: {
            sort: {
              columnId: 'number',
              direction: 'DESC',
            },
            rowActions: [
              {
                rowId: 'row-1',
                isRunning: true,
              },
              {
                rowId: 'row-3',
                error: { title: 'Import failed', message: 'Contact your administrator' },
              },
            ],
          },
        }}
        locale={select('locale', ['fr', 'en'], 'fr')}
        i18n={{
          /** pagination */
          pageBackwardAria: text('i18n.pageBackwardAria', '__Previous page__'),
          pageForwardAria: text('i18n.pageForwardAria', '__Next page__'),
          pageNumberAria: text('i18n.pageNumberAria', '__Page Number__'),
          itemsPerPage: text('i18n.itemsPerPage', '__Items per page:__'),
          itemsRange: (min, max) => `__${min}–${max} items__`,
          currentPage: page => `__page ${page}__`,
          itemsRangeWithTotal: (min, max, total) => `__${min}–${max} of ${total} items__`,
          pageRange: (current, total) => `__${current} of ${total} pages__`,
          /** table body */
          overflowMenuAria: text('i18n.overflowMenuAria', '__More actions__'),
          clickToExpandAria: text('i18n.clickToExpandAria', '__Click to expand content__'),
          clickToCollapseAria: text('i18n.clickToCollapseAria', '__Click to collapse content__'),
          selectAllAria: text('i18n.selectAllAria', '__Select all items__'),
          selectRowAria: text('i18n.selectRowAria', '__Select row__'),
          /** toolbar */
          clearAllFilters: text('i18n.clearAllFilters', '__Clear all filters__'),
          searchLabel: text('i18n.searchLabel', '__Search__'),
          searchPlaceholder: text('i18n.searchPlaceholder', '__Search__'),
          columnSelectionButtonAria: text('i18n.columnSelectionButtonAria', '__Column Selection__'),
          filterButtonAria: text('i18n.filterButtonAria', '__Filters__'),
          editButtonAria: text('i18n.editButtonAria', '__Edit rows__'),
          clearFilterAria: text('i18n.clearFilterAria', '__Clear filter__'),
          filterAria: text('i18n.filterAria', '__Filter__'),
          openMenuAria: text('i18n.openMenuAria', '__Open menu__'),
          closeMenuAria: text('i18n.closeMenuAria', '__Close menu__'),
          clearSelectionAria: text('i18n.clearSelectionAria', '__Clear selection__'),
          batchCancel: text('i18n.batchCancel', '__Cancel__'),
          itemsSelected: text('i18n.itemsSelected', '__items selected__'),
          itemSelected: text('i18n.itemSelected', '__item selected__'),
          filterNone: text('i18n.filterNone', '__filterNone__'),
          filterAscending: text('i18n.filterAscending', '__filterAscending__'),
          filterDescending: text('i18n.filterDescending', '__filterDescending__'),
          /** empty state */
          emptyMessage: text('i18n.emptyMessage', '__There is no data__'),
          emptyMessageWithFilters: text(
            'i18n.emptyMessageWithFilters',
            '__No results match the current filters__'
          ),
          emptyButtonLabel: text('i18n.emptyButtonLabel', '__Create some data__'),
          emptyButtonLabelWithFilters: text('i18n.emptyButtonLabel', '__Clear all filters__'),
          inProgressText: text('i18n.inProgressText', '__In Progress__'),
          actionFailedText: text('i18n.actionFailedText', '__Action Failed__'),
          learnMoreText: text('i18n.learnMoreText', '__Learn More__'),
          dismissText: text('i18n.dismissText', '__Dismiss__'),
        }}
      />
    ),
    {
      info: {
        text: `

        By default the table shows all of its internal strings in English.  If you want to support multiple languages, you must populate these i18n keys with the appropriate label for the selected UI language.

        <br />

        ~~~js
          i18n={

            /** pagination */
            pageBackwardAria,
            pageForwardAria,
            pageNumberAria,
            itemsPerPage,
            itemsRange,
            currentPage,
            itemsRangeWithTotal,
            pageRange,

            /** table body */
            overflowMenuAria,
            clickToExpandAria,
            clickToCollapseAria,
            selectAllAria,
            selectRowAria,

            /** toolbar */
            clearAllFilters,
            searchPlaceholder,
            columnSelectionButtonAria,
            filterButtonAria,
            editButtonAria,
            clearFilterAria,
            filterAria,
            openMenuAria,
            closeMenuAria,
            clearSelectionAria,

            /** empty state */
            emptyMessage,
            emptyMessageWithFilters,
            emptyButtonLabel,
            emptyButtonLabelWithFilters,
            inProgressText,
            actionFailedText,
            learnMoreText,
            dismissText,
          }

        <br />

        `,
        propTables: [Table],
        propTablesExclude: [StatefulTable],
      },
    }
  )
  .add(
    'with sticky header and cell tooltip calculation',
    () => {
      const renderDataFunction = ({ value }) => (
        <div style={{ position: 'relative' }} data-floating-menu-container>
          {value}
          <Tooltip
            direction="right"
            tabIndex={0}
            tooltipId="table-tooltip"
            triggerId="table-tooltip-trigger"
            triggerText=""
            menuOffset={menuBody => {
              const container = menuBody.closest('[data-floating-menu-container]');
              return {
                top: -container.getBoundingClientRect().y - window.pageYOffset + 4,
                left: -container.getBoundingClientRect().x - window.pageXOffset + 10,
              };
            }}
          >
            <p>This scroll with the table body</p>
          </Tooltip>
        </div>
      );
      return (
        <div>
          <Table
            columns={tableColumns.map(i => ({
              ...i,
              renderDataFunction,
            }))}
            data={tableData}
            actions={actions}
            stickyHeader
            options={{
              hasFilter: true,
              hasPagination: true,
              hasRowSelection: 'multi',
            }}
            view={{
              filters: [],
              table: {
                ordering: defaultOrdering,
                sort: {
                  columnId: 'string',
                  direction: 'ASC',
                },
              },
            }}
          />
        </div>
      );
    },
    {
      centered: { disable: true },
      info: {
        text: `To properly render a tooltip in a table with sticky headers you need to pass a menuOffset or menuOffsetFlip calculation to <Tooltip>`,
      },
    }
  );
