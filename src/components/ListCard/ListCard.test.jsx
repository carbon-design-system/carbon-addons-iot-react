import React from 'react';
import { mount } from 'enzyme';

import ListCard from './ListCard';

const data = [
  { id: 'row-1', value: 'Row content 1', link: 'https://internetofthings.ibmcloud.com/' },
  { id: 'row-2', value: 'Row content 2', link: 'https://internetofthings.ibmcloud.com/' },
  { id: 'row-3', value: 'Row content 3' },
  {
    id: 'row-4',
    value: 'Row content 4',
    link: 'https://internetofthings.ibmcloud.com/',
    rightContent: (
      <svg height="10" width="30">
        <circle cx="5" cy="5" r="3" stroke="none" strokeWidth="1" fill="red" />
      </svg>
    ),
  },
  { id: 'row-5', value: 'Row content 5' },
  { id: 'row-6', value: 'Row content 6' },
  { id: 'row-7', value: 'Row content 7' },
  { id: 'row-8', value: 'Row content 8' },
];

const mockScrollEvent = {
  preventDefault: jest.fn(),
  pageX: 300,
  pageY: 300,
  type: 'onscroll',
  currentTarget: {
    getBoundingClientRect: () => ({}),
  },
  stopPropagation: jest.fn(),
  target: {},
};

describe('ListCard', () => {
  test('LoadData', () => {
    const onLoadData = jest.fn();

    const wrapper = mount(
      <ListCard title="Testing" loadData={onLoadData} hasMoreData isLoading={false} data={data} />
    );

    wrapper.find('Card').prop('onScroll')(mockScrollEvent);
  });
  test('Inline Loading', () => {
    const onLoadData = jest.fn();

    const wrapper = mount(
      <ListCard title="Testing" loadData={onLoadData} hasMoreData isLoading data={data} />
    );

    expect(wrapper.find('InlineLoading')).toHaveLength(1);
  });
});
