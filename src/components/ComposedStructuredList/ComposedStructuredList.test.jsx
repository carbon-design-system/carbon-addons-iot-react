import React from 'react';
import { mount } from 'enzyme';

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
  // handle click function test
  test('onRowClick', () => {
    const onRowClick = jest.fn();
    const wrapper = mount(
      <ComposedStructuredList
        design="normal"
        columns={columns}
        data={data}
        onRowClick={onRowClick}
      />
    );
    wrapper
      .find('div[onClick]')
      .first()
      .simulate('click');
    expect(onRowClick.mock.calls).toHaveLength(1);
  });
});
