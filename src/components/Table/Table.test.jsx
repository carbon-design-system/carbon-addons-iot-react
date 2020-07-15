import { mount } from 'enzyme';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import merge from 'lodash/merge';
import { Add20 } from '@carbon/icons-react';

import { settings } from '../../constants/Settings';

import { mockActions } from './Table.test.helpers';
import Table, { defaultProps } from './Table';
import TableToolbar from './TableToolbar/TableToolbar';
import EmptyTable from './EmptyTable/EmptyTable';
import TableBodyRow from './TableBody/TableBodyRow/TableBodyRow';
import TableHead from './TableHead/TableHead';
import { initialState } from './Table.story';

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

const largeTableData = Array(100)
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

  it('limits the number of pagination select options', () => {
    // 100 records should have 10 pages. With max pages option we expect 5.
    const wrapper = mount(
      <Table
        columns={tableColumns}
        data={largeTableData}
        expandedData={expandedData}
        actions={mockActions}
        options={{ hasPagination: true }}
        view={{ ...view, pagination: { ...view.pagination, maxPages: 5 } }}
      />
    );
    expect(wrapper.find('.bx--select-option')).toHaveLength(5);
  });

  it('handles row collapse', () => {
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

  it('handles row expansion', () => {
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

  it('handles column sort', () => {
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

  it('custom emptystate only renders with no filters', () => {
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
        i18n={{ emptyButtonLabelWithFilters: 'Clear all filters' }}
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

  it('validate row count function ', () => {
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

  it('validate show/hide hasRowCountInHeader property ', () => {
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

  it('click should trigger onDownload', () => {
    const { getByTestId } = render(
      <TableToolbar actions={mockActions.toolbar} options={options2} tableState={tableState} />
    );

    const downloadButton = getByTestId('download-button');
    expect(downloadButton).toBeTruthy();
    fireEvent.click(downloadButton);
    expect(mockActions.toolbar.onDownloadCSV).toHaveBeenCalledTimes(1);
  });

  it('click should trigger onColumnSelection', () => {
    const { getByTestId } = render(
      <TableToolbar
        actions={mockActions.toolbar}
        options={{ hasColumnSelection: true }}
        tableState={tableState}
      />
    );

    const columnSelectButton = getByTestId('column-selection-button');
    expect(columnSelectButton).toBeTruthy();
    fireEvent.click(columnSelectButton);
    expect(mockActions.toolbar.onToggleColumnSelection).toHaveBeenCalledTimes(1);
  });

  it('click should trigger onFilter', () => {
    const { getByTestId } = render(
      <TableToolbar
        actions={mockActions.toolbar}
        options={{ hasFilter: true }}
        tableState={tableState}
      />
    );

    const filterButton = getByTestId('filter-button');
    expect(filterButton).toBeTruthy();
    fireEvent.click(filterButton);
    expect(mockActions.toolbar.onToggleFilter).toHaveBeenCalledTimes(1);
  });

  it('mouse click should trigger rowEdit toolbar', () => {
    const { getByTestId } = render(
      <TableToolbar
        actions={mockActions.toolbar}
        options={{ hasRowEdit: true }}
        tableState={tableState}
      />
    );

    const rowEditButton = getByTestId('row-edit-button');
    expect(rowEditButton).toBeTruthy();

    fireEvent.click(rowEditButton);
    expect(mockActions.toolbar.onShowRowEdit).toHaveBeenCalledTimes(1);
  });

  it('rowEdit toolbar should contain external rowEditBarButtons', () => {
    const { getByTestId } = render(
      <TableToolbar
        actions={mockActions.toolbar}
        options={{ hasRowEdit: true }}
        tableState={{
          ...tableState,
          activeBar: 'rowEdit',
          rowEditBarButtons: <button type="button" data-testid="row-edit-bar-button" />,
        }}
      />
    );

    const rowEditBarButton = getByTestId('row-edit-bar-button');
    expect(rowEditBarButton).toBeTruthy();
  });

  it('toolbar search should render with default value', () => {
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

    const wrapper2 = mount(
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
              defaultValue: 'ferrari',
            },
          },
        }}
      />
    );

    expect(wrapper2.find('.bx--search-input').prop('value')).toEqual('ferrari');
    expect(wrapper2.find('.bx--search-input').html()).toContain(`aria-hidden="false"`);
  });

  it('cells should always wrap by default', () => {
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

  it('cells should truncate with wrapCellText:auto if resize or fixed col widths', () => {
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

    const wrapper3 = mount(
      <Table
        columns={tableColumns.map(col => ({
          ...col,
          width: undefined,
          renderDataFunction: () => 'hello this is a custom rendered long string',
        }))}
        data={[tableData[0]]}
        options={{ hasResize: false, wrapCellText: 'auto' }}
      />
    );
    expect(
      wrapper3
        .find('TableCell .iot--table__cell--truncate .iot--table__cell-text--truncate')
        .first()
    ).toHaveLength(1);
  });

  it('cells should wrap (not truncate) with wrapCellText:auto if no resize nor fixed col widths', () => {
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

  it('cells should wrap (not truncate) for wrapCellText:auto + resize + table-layout:auto', () => {
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

  it('cells should always wrap when wrapCellText is always', () => {
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

  it('table should get row-actions HTML class only when rowActions are enabled', () => {
    const wrapper = mount(
      <Table columns={tableColumns} data={[tableData[0]]} options={{ hasRowActions: true }} />
    );
    expect(wrapper.exists(`table.${iotPrefix}--data-table--row-actions`)).toBeTruthy();

    const wrapper2 = mount(
      <Table columns={tableColumns} data={[tableData[0]]} options={{ hasRowActions: false }} />
    );
    expect(wrapper2.exists(`table.${iotPrefix}--data-table--row-actions`)).toBeFalsy();
  });

  it('i18n string test 1', () => {
    const i18nTest = {
      /** table body */
      overflowMenuAria: 'overflow-menu',
      clickToExpandAria: 'expand-aria',
      clickToCollapseAria: 'collapse-aria',
      selectAllAria: 'select-all',
      selectRowAria: 'select-row',
      /** toolbar */
      clearAllFilters: 'clear-filters',
      columnSelectionButtonAria: 'column-select-aria',
      columnSelectionConfig: 'column-select-config',
      filterButtonAria: 'filter-aria',
      editButtonAria: 'edit-button',
      searchLabel: 'search-label',
      searchPlaceholder: 'search-placeholder',
      clearFilterAria: 'clear-filter',
      filterAria: 'filter-aria',
      openMenuAria: 'open-menu',
      batchCancel: 'cancel',
      itemSelected: 'item-selected',
      /** empty state */
      emptyMessage: 'empty-message',
      emptyMessageWithFilters: 'empty-filters',
      emptyButtonLabel: 'empty-button',
      downloadIconDescription: 'download-descript',
    };

    const i18nDefault = defaultProps({}).i18n;

    const additionalProps = {
      options: {
        ...initialState.options,
        hasRowActions: true,
        hasFilter: true,
        hasSingleRowEdit: true,
      },
      actions: {
        toolbar: {
          onDownloadCSV: () => {},
        },
      },
      view: {
        ...initialState.view,
        table: {
          expandedIds: ['row-3', 'row-7'],
        },
      },
    };

    const { rerender } = render(
      <Table {...initialState} {...additionalProps} isSortable i18n={i18nTest} />
    );

    expect(screen.getAllByLabelText(i18nTest.overflowMenuAria)[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(i18nTest.clickToExpandAria)[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(i18nTest.clickToCollapseAria)[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(i18nTest.selectAllAria)[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(i18nTest.selectRowAria)[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(i18nTest.downloadIconDescription)[0]).toBeInTheDocument();

    expect(screen.getAllByText(i18nTest.clearAllFilters)[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(i18nTest.columnSelectionButtonAria)[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(i18nTest.filterButtonAria)[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(i18nTest.editButtonAria)[0]).toBeInTheDocument();
    expect(screen.getAllByText(i18nTest.searchLabel)[0]).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(i18nTest.searchPlaceholder)[0]).toBeInTheDocument();
    expect(screen.getAllByTitle(i18nTest.clearFilterAria)[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(i18nTest.filterAria)[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText(i18nTest.openMenuAria)[0]).toBeInTheDocument();
    expect(screen.getAllByText(i18nTest.batchCancel)[0]).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`.*\\s${i18nTest.itemSelected}.*`))).toBeInTheDocument();

    expect(screen.queryByLabelText(i18nDefault.overflowMenuAria)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefault.clickToExpandAria)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefault.clickToCollapseAria)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefault.selectAllAria)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefault.selectRowAria)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefault.downloadIconDescription)).not.toBeInTheDocument();

    expect(screen.queryByText(i18nDefault.clearAllFilters)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefault.columnSelectionButtonAria)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefault.filterButtonAria)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefault.editButtonAria)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.searchLabel)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(i18nDefault.searchPlaceholder)).not.toBeInTheDocument();
    expect(screen.queryByTitle(i18nDefault.clearFilterAria)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefault.filterAria)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefault.openMenuAria)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.batchCancel)).not.toBeInTheDocument();

    rerender(
      <Table
        {...initialState}
        options={{
          ...initialState.options,
          hasColumnSelectionConfig: true,
        }}
        i18n={i18nTest}
        view={{
          ...initialState.view,
          toolbar: {
            activeBar: 'column',
          },
        }}
      />
    );
    expect(screen.getAllByText(i18nTest.columnSelectionConfig)[0]).toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.columnSelectionConfig)).not.toBeInTheDocument();
  });

  it('i18n string test 2', () => {
    const i18nTest = {
      /** table body */
      overflowMenuAria: 'overflow-menu',
      clickToExpandAria: 'expand-aria',
      clickToCollapseAria: 'collapse-aria',
      selectAllAria: 'select-all',
      selectRowAria: 'select-row',
      /** toolbar */
      clearAllFilters: 'clear-filters',
      columnSelectionButtonAria: 'column-select-aria',
      columnSelectionConfig: 'column-select-config',
      filterButtonAria: 'filter-aria',
      editButtonAria: 'edit-button',
      searchLabel: 'search-label',
      searchPlaceholder: 'search-placeholder',
      clearFilterAria: 'clear-filter',
      filterAria: 'filter-aria',
      openMenuAria: 'open-menu',
      batchCancel: 'cancel',
      itemSelected: 'item-selected',
      /** empty state */
      emptyMessage: 'empty-message',
      emptyMessageWithFilters: 'empty-filters',
      emptyButtonLabel: 'empty-button',
      downloadIconDescription: 'download-descript',
    };

    const i18nDefault = defaultProps({}).i18n;

    const { rerender } = render(
      <Table
        columns={tableColumns}
        data={[]}
        view={{
          filters: [{ columnId: 'select', value: 'option-B' }],
        }}
        i18n={i18nTest}
        options={{
          hasFilter: true,
        }}
      />
    );
    expect(screen.getAllByText(i18nTest.emptyMessageWithFilters)[0]).toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.emptyMessageWithFilters)).not.toBeInTheDocument();

    rerender(
      <Table
        columns={tableColumns}
        data={[]}
        actions={{
          table: {
            onEmptyStateAction: () => {},
          },
        }}
        i18n={i18nTest}
      />
    );
    expect(screen.getAllByText(i18nTest.emptyMessage)[0]).toBeInTheDocument();
    expect(screen.getAllByText(i18nTest.emptyButtonLabel)[0]).toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.emptyMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.emptyButtonLabel)).not.toBeInTheDocument();
  });
});
