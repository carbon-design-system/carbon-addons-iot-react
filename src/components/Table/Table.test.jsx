import { mount } from 'enzyme';
import React from 'react';

import Table from './Table';

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
    size: 1,
    filter: { placeholderText: 'pick a string' },
    isSortable: true,
  },
  {
    id: 'date',
    name: 'Date',
    size: 1,
    filter: { placeholderText: 'pick a date' },
  },
  {
    id: 'select',
    name: 'Select',
    size: 1,
    filter: { placeholderText: 'pick an option', options: selectData },
  },
  {
    id: 'number',
    name: 'Number',
    size: 1,
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

describe('Table', () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  const actions = {
    pagination: {
      onChange: jest.fn(),
    },
    toolbar: {
      onApplyFilter: jest.fn(),
      onToggleFilter: jest.fn(),
      onClearAllFilters: jest.fn(),
    },
    table: {
      onRowSelected: jest.fn(),
      onRowExpanded: jest.fn(),
      onSelectAll: jest.fn(),
      onChangeSort: jest.fn(),
    },
  };

  const options = {
    hasRowExpansion: true,
  };

  const view = {
    filters: [],
    pagination: {
      totalItems: tableData.length,
    },
    table: {
      expandedRows: [
        {
          rowId: 'row-1',
          content: <RowExpansionContent rowId="row-1" />,
        },
      ],
    },
  };

  test('handles row collapse', () => {
    const wrapper = mount(
      <Table
        columns={tableColumns}
        data={tableData}
        actions={actions}
        options={options}
        view={view}
      />
    );
    wrapper.find('tr#Table-Row-row-1 .bx--table-expand-v2__button').simulate('click');
    expect(actions.table.onRowExpanded).toHaveBeenCalled();
  });

  test('handles row expansion', () => {
    const wrapper = mount(
      <Table
        columns={tableColumns}
        data={tableData}
        actions={actions}
        options={options}
        view={view}
      />
    );
    wrapper.find('tr#Table-Row-row-2 .bx--table-expand-v2__button').simulate('click');
    expect(actions.table.onRowExpanded).toHaveBeenCalled();
  });

  test('handles column sort', () => {
    const wrapper = mount(
      <Table
        columns={tableColumns}
        data={tableData}
        actions={actions}
        options={options}
        view={view}
      />
    );
    wrapper.find('button#column-string').simulate('click');
    expect(actions.table.onChangeSort).toHaveBeenCalled();
  });
});
