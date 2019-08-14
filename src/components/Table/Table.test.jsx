import { mount } from 'enzyme';
import React from 'react';
import merge from 'lodash/merge';

import Table from './Table';
import EmptyTable from './EmptyTable/EmptyTable';

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
  beforeEach(() => {
    console.error = jest.fn();
  });

  const options = {
    hasRowExpansion: true,
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
});
