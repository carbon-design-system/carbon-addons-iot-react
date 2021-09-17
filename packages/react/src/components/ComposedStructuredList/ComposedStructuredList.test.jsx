import React from 'react';
import { mount } from 'enzyme';
import { render, screen } from '@testing-library/react';

import ComposedStructuredList from './ComposedStructuredList';

const columns = [
  {
    id: 'columnA',
    title: 'A',
  },
  {
    id: 'columnB',
    title: 'B',
  },
  {
    id: 'columnC',
    title: 'C',
  },
];

const data = [
  {
    id: 'row-0',
    values: {
      columnA: 'hey A',
      columnB: 'hey B',
      columnC: 'hey C',
    },
  },
  {
    id: 'row-1',
    values: {
      columnA: 'hey A again',
      columnB: 'hey B again',
      columnC: 'hey C again',
    },
  },
  {
    id: 'row-2',
    values: {
      columnA: 'hey hey A',
      columnB: 'hey hey B',
      columnC: 'hey hey C',
    },
  },
];

describe('Structured List', () => {
  it('should be selectable by testId', () => {
    const onRowClick = jest.fn();
    const { rerender } = render(
      <ComposedStructuredList
        design="normal"
        columns={columns}
        data={data}
        onRowClick={onRowClick}
        testId="composed_structured_list"
      />
    );

    expect(screen.getByTestId('composed_structured_list')).toBeDefined();
    expect(screen.getByTestId('composed_structured_list-head')).toBeDefined();
    expect(screen.getByTestId('composed_structured_list-body')).toBeDefined();
    expect(screen.getByTestId('composed_structured_list-row-row-0')).toBeDefined();

    rerender(
      <ComposedStructuredList
        design="normal"
        columns={columns}
        data={[]}
        onRowClick={onRowClick}
        testId="composed_structured_list"
      />
    );

    expect(screen.getByTestId('composed_structured_list-empty')).toBeDefined();
  });

  // handle click function test
  it('onRowClick', () => {
    const onRowClick = jest.fn();
    const wrapper = mount(
      <ComposedStructuredList
        design="normal"
        columns={columns}
        data={data}
        onRowClick={onRowClick}
      />
    );
    wrapper.find('div[onClick]').first().simulate('click');
    expect(onRowClick.mock.calls).toHaveLength(1);
  });
});
