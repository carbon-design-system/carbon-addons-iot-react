import { mount } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import merge from 'lodash/merge';
import { Add20 } from '@carbon/icons-react';

import { keyCodes } from '../../constants/KeyCodeConstants';
import { settings } from '../../constants/Settings';

import Table from './Table';
import TableToolbar from './TableToolbar/TableToolbar';
import EmptyTable from './EmptyTable/EmptyTable';
import TableBodyRow from './TableBody/TableBodyRow/TableBodyRow';
import TableHead from './TableHead/TableHead';

const { iotPrefix } = settings;

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
const tableColumns = [
  {
    id: 'string',
    name: 'String',
    filter: { placeholderText: 'pick a string' },
    isSortable: true,
  },
  {
    id: 'node',
    name: 'React node',
    isSortable: true,
  },
  {
    id: 'date',
    name: 'Date',
    filter: { placeholderText: 'pick a date' },
  },
  {
    id: 'select',
    name: 'Select',
    filter: { placeholderText: 'pick an option', options: selectData },
  },
  {
    id: 'number',
    name: 'Number',
    filter: { placeholderText: 'pick a number' },
  },
];

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
const getWord = (index, step = 1) => words[(step * index) % words.length];
const getSentence = index =>
  `${getWord(index, 1)} ${getWord(index, 2)} ${getWord(index, 3)} ${index}`;

const tableData = Array(20)
  .fill(0)
  .map((i, idx) => ({
    id: `row-${idx}`,
    values: {
      string: getSentence(idx),
      node: <Add20 />,
      date: new Date(100000000000 + 1000000000 * idx * idx).toISOString(),
      select: selectData[idx % 3].id,
      number: idx * idx,
    },
  }));

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

export const mockActions = {
  pagination: {
    onChangePage: jest.fn(),
  },
  toolbar: {
    onApplyFilter: jest.fn(),
    onToggleFilter: jest.fn(),
    onToggleColumnSelection: jest.fn(),
    onClearAllFilters: jest.fn(),
    onCancelBatchAction: jest.fn(),
    onApplyBatchAction: jest.fn(),
    onApplySearch: jest.fn(),
    onDownloadCSV: jest.fn(),
  },
  table: {
    onRowSelected: jest.fn(),
    onRowClicked: jest.fn(),
    onRowExpanded: jest.fn(),
    onSelectAll: jest.fn(),
    onChangeSort: jest.fn(),
    onApplyRowAction: jest.fn(),
    onEmptyStateAction: jest.fn(),
    onChangeOrdering: jest.fn(),
  },
};

describe('Table', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    console.error.mockClear();
  });
  afterAll(() => {
    console.error.mockRestore();
  });

  const options = {
    hasRowExpansion: true,
    hasRowCountInHeader: true,
  };
  const options2 = {
    hasRowExpansion: true,
    hasRowCountInHeader: false,
  };

  const tableState = {
    totalSelected: 0,
    batchActions: [],
  };
  const view = {
    filters: [],
    pagination: {
      totalItems: tableData.length,
    },
    table: {
      expandedIds: ['row-1'],
    },
  };

  const expandedData = [
    {
      rowId: 'row-1',
      content: <RowExpansionContent rowId="row-1" />,
    },
  ];

  test('handles row collapse', () => {
    const wrapper = mount(
      <Table
        columns={tableColumns}
        data={tableData}
        expandedData={expandedData}
        actions={mockActions}
        options={options}
        view={view}
      />
    );
    wrapper
      .find('.bx--table-expand__button')
      .at(0)
      .simulate('click');
    expect(mockActions.table.onRowExpanded).toHaveBeenCalled();
  });

  test('handles row expansion', () => {
    const wrapper = mount(
      <Table
        columns={tableColumns}
        data={tableData}
        actions={mockActions}
        options={options}
        view={view}
      />
    );
    wrapper
      .find('.bx--table-expand__button')
      .at(1)
      .simulate('click');
    expect(mockActions.table.onRowExpanded).toHaveBeenCalled();
  });

  test('handles column sort', () => {
    const wrapper = mount(
      <Table
        columns={tableColumns}
        data={tableData}
        actions={mockActions}
        options={options}
        view={view}
      />
    );
    wrapper.find('button#column-string').simulate('click');
    expect(mockActions.table.onChangeSort).toHaveBeenCalled();
  });

  test('custom emptystate only renders with no filters', () => {
    const wrapper = mount(
      <Table
        columns={tableColumns}
        data={[]}
        actions={mockActions}
        options={options}
        view={merge({}, view, {
          table: { emptyState: <div id="customEmptyState">emptyState</div> },
        })}
      />
    );
    // Should render the custom empty state
    expect(wrapper.find('#customEmptyState')).toHaveLength(1);

    const wrapper2 = mount(
      <Table
        columns={tableColumns}
        data={[]}
        actions={mockActions}
        options={options}
        view={merge({}, view, {
          filters: [{ columnId: 'col', value: 'value' }],
          table: { emptyState: <div id="customEmptyState">emptyState</div> },
        })}
      />
    );
    // Should not render the empty state
    expect(wrapper2.find('#customEmptyState')).toHaveLength(0);

    // Click the button and make sure the right action fires
    const emptyTable = wrapper2.find(EmptyTable);
    emptyTable.find('button').simulate('click');
    expect(mockActions.toolbar.onApplySearch).toHaveBeenCalled();
    expect(mockActions.toolbar.onClearAllFilters).toHaveBeenCalled();
  });

  test('validate row count function ', () => {
    const wrapper = mount(
      <Table
        columns={tableColumns}
        data={tableData}
        actions={mockActions}
        options={options}
        view={view}
      />
    );

    const rowCounts = view.pagination.totalItems;
    const renderRowCountField = wrapper
      .find('Table')
      .at(0)
      .props()
      .i18n.rowCountInHeader(rowCounts);
    expect(renderRowCountField).toContain('Results:');

    const min = 1;
    const max = 10;
    const renderItemRangeField = wrapper
      .find('Table')
      .at(0)
      .props()
      .i18n.itemsRange(min, max);
    expect(renderItemRangeField).toContain('items');
  });

  test('validate show/hide hasRowCountInHeader property ', () => {
    const tableHeaderWrapper = mount(
      <TableToolbar actions={mockActions} options={options} tableState={tableState} />
    );
    //  Should render Row count label when hasRowCountInHeader (option) property is true
    const renderRowCountLabel = tableHeaderWrapper.find(
      `.${iotPrefix}--table-toolbar-secondary-title`
    );
    expect(renderRowCountLabel).toHaveLength(1);

    const tableHeaderWrapper2 = mount(
      <TableToolbar actions={mockActions} options={options2} tableState={tableState} />
    );
    //  Should not render Row count label when hasRowCountInHeader (option2) property is false
    const renderRowCountLabel2 = tableHeaderWrapper2.find(
      `.${iotPrefix}--table-toolbar-secondary-title`
    );
    expect(renderRowCountLabel2).toHaveLength(0);
  });

  test('enter key should trigger onDownload', () => {
    const { getByTestId } = render(
      <TableToolbar actions={mockActions.toolbar} options={options2} tableState={tableState} />
    );

    const downloadButton = getByTestId('download-button');
    expect(downloadButton).toBeTruthy();
    fireEvent.keyDown(downloadButton, { keyCode: keyCodes.ENTER });
    expect(mockActions.toolbar.onDownloadCSV).toHaveBeenCalledTimes(1);
  });

  test('enter key should trigger onColumnSelection', () => {
    const { getByTestId } = render(
      <TableToolbar
        actions={mockActions.toolbar}
        options={{ hasColumnSelection: true }}
        tableState={tableState}
      />
    );

    const columnSelectButton = getByTestId('column-selection-button');
    expect(columnSelectButton).toBeTruthy();
    fireEvent.keyDown(columnSelectButton, { keyCode: keyCodes.ENTER });
    expect(mockActions.toolbar.onToggleColumnSelection).toHaveBeenCalledTimes(1);
  });

  test('enter key should trigger onFilter', () => {
    const { getByTestId } = render(
      <TableToolbar
        actions={mockActions.toolbar}
        options={{ hasFilter: true }}
        tableState={tableState}
      />
    );

    const filterButton = getByTestId('filter-button');
    expect(filterButton).toBeTruthy();
    fireEvent.keyDown(filterButton, { keyCode: keyCodes.ENTER });
    expect(mockActions.toolbar.onToggleFilter).toHaveBeenCalledTimes(1);
  });

  test('toolbar search should render with default value', () => {
    const wrapper = mount(
      <Table
        columns={tableColumns}
        data={tableData}
        actions={mockActions}
        options={{
          hasSearch: true,
        }}
        view={{
          toolbar: {
            search: {
              defaultValue: '',
            },
          },
        }}
      />
    );

    expect(wrapper.find('.bx--search-input')).toHaveLength(1);
    expect(wrapper.find('.bx--search-input').prop('value')).toEqual('');
    expect(wrapper.find('.bx--search-input').html()).toContain(`aria-hidden="true"`);

    wrapper.setProps({ view: { toolbar: { search: { defaultValue: 'ferrari' } } } });
    wrapper.update();

    expect(wrapper.find('.bx--search-input').prop('value')).toEqual('ferrari');
    expect(wrapper.find('.bx--search-input').html()).toContain(`aria-hidden="false"`);

    wrapper.setProps({ view: { toolbar: { search: { defaultValue: '' } } } });
    wrapper.update();

    expect(wrapper.find('.bx--search-input').prop('value')).toEqual('');
    expect(wrapper.find('.bx--search-input').html()).toContain(`aria-hidden="true"`);
  });

  test('cells should always wrap by default', () => {
    const wrapper = mount(
      <Table columns={tableColumns} data={[tableData[0]]} options={{ hasResize: true }} />
    );
    expect(wrapper.find(TableBodyRow).prop('options').wrapCellText).toEqual('always');
    expect(wrapper.find(TableHead).prop('options').wrapCellText).toEqual('always');

    const wrapper2 = mount(
      <Table
        columns={tableColumns.map(col => ({ ...col, width: '100px' }))}
        data={[tableData[0]]}
        options={{ hasResize: false }}
      />
    );
    expect(wrapper2.find(TableBodyRow).prop('options').wrapCellText).toEqual('always');
    expect(wrapper2.find(TableHead).prop('options').wrapCellText).toEqual('always');

    const wrapper3 = mount(<Table columns={tableColumns} data={[tableData[0]]} />);
    expect(wrapper3.find(TableBodyRow).prop('options').wrapCellText).toEqual('always');
    expect(wrapper3.find(TableHead).prop('options').wrapCellText).toEqual('always');
  });

  test('cells should truncate with wrapCellText:auto if resize or fixed col widths', () => {
    const wrapper = mount(
      <Table
        columns={tableColumns}
        data={[tableData[0]]}
        options={{ hasResize: true, wrapCellText: 'auto' }}
      />
    );
    expect(wrapper.find(TableBodyRow).prop('options').truncateCellText).toBeTruthy();
    expect(wrapper.find(TableHead).prop('options').truncateCellText).toBeTruthy();

    const wrapper2 = mount(
      <Table
        columns={tableColumns.map(col => ({ ...col, width: '100px' }))}
        data={[tableData[0]]}
        options={{ hasResize: false, wrapCellText: 'auto' }}
      />
    );
    expect(wrapper2.find(TableBodyRow).prop('options').truncateCellText).toBeTruthy();
    expect(wrapper2.find(TableHead).prop('options').truncateCellText).toBeTruthy();
  });

  test('cells should wrap (not truncate) with wrapCellText:auto if no resize nor fixed col widths', () => {
    const wrapper3 = mount(
      <Table
        columns={tableColumns}
        data={[tableData[0]]}
        options={{ hasResize: false, wrapCellText: 'auto' }}
      />
    );
    expect(wrapper3.find(TableBodyRow).prop('options').truncateCellText).toBeFalsy();
    expect(wrapper3.find(TableHead).prop('options').truncateCellText).toBeFalsy();
    expect(wrapper3.find(TableBodyRow).prop('options').wrapCellText).toEqual('auto');
    expect(wrapper3.find(TableHead).prop('options').wrapCellText).toEqual('auto');
  });

  test('cells should wrap (not truncate) for wrapCellText:auto + resize + table-layout:auto', () => {
    const wrapper = mount(
      <Table
        columns={tableColumns}
        data={[tableData[0]]}
        options={{ wrapCellText: 'auto', hasResize: true, useAutoTableLayoutForResize: true }}
      />
    );
    expect(wrapper.find(TableBodyRow).prop('options').wrapCellText).toEqual('auto');
    expect(wrapper.find(TableHead).prop('options').wrapCellText).toEqual('auto');
    expect(wrapper.find(TableBodyRow).prop('options').truncateCellText).toBeFalsy();
    expect(wrapper.find(TableHead).prop('options').truncateCellText).toBeFalsy();
  });

  test('cells should always wrap when wrapCellText is always', () => {
    const wrapper = mount(
      <Table
        columns={tableColumns}
        data={[tableData[0]]}
        options={{ hasResize: true, wrapCellText: 'always' }}
      />
    );
    expect(wrapper.find(TableBodyRow).prop('options').wrapCellText).toEqual('always');
    expect(wrapper.find(TableHead).prop('options').wrapCellText).toEqual('always');
    expect(wrapper.find(TableBodyRow).prop('options').truncateCellText).toBeFalsy();
    expect(wrapper.find(TableHead).prop('options').truncateCellText).toBeFalsy();

    const wrapper2 = mount(
      <Table
        columns={tableColumns.map(col => ({ ...col, width: '100px' }))}
        data={[tableData[0]]}
        options={{ wrapCellText: 'always' }}
      />
    );
    expect(wrapper2.find(TableBodyRow).prop('options').wrapCellText).toEqual('always');
    expect(wrapper2.find(TableHead).prop('options').wrapCellText).toEqual('always');
    expect(wrapper2.find(TableBodyRow).prop('options').truncateCellText).toBeFalsy();
    expect(wrapper2.find(TableHead).prop('options').truncateCellText).toBeFalsy();

    const wrapper3 = mount(
      <Table columns={tableColumns} data={[tableData[0]]} options={{ wrapCellText: 'always' }} />
    );
    expect(wrapper3.find(TableBodyRow).prop('options').wrapCellText).toEqual('always');
    expect(wrapper3.find(TableHead).prop('options').wrapCellText).toEqual('always');
    expect(wrapper3.find(TableBodyRow).prop('options').truncateCellText).toBeFalsy();
    expect(wrapper3.find(TableHead).prop('options').truncateCellText).toBeFalsy();
  });
});
