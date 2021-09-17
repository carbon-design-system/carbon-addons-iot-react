import React from 'react';
import { mount } from 'enzyme';
import { render, screen } from '@testing-library/react';

import ListCard from './ListCard';

const data = [
  {
    id: 'row-1',
    value: 'Row content 1',
    link: 'https://internetofthings.ibmcloud.com/',
  },
  {
    id: 'row-2',
    value: 'Row content 2',
    link: 'https://internetofthings.ibmcloud.com/',
  },
  { id: 'row-3', value: 'Row content 3' },
  {
    id: 'row-4',
    value: 'Row content 4',
    link: 'https://internetofthings.ibmcloud.com/',
    extraContent: (
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
  target: { scrollHeight: 100, scrollTop: 0, clientHeight: 100 },
};

describe('ListCard', () => {
  it('should be selectable by testID or testId', () => {
    const { rerender } = render(
      <ListCard title="Testing" hasMoreData isLoading data={data} testID="LIST_CARD" />
    );

    expect(screen.getByTestId('LIST_CARD')).toBeDefined();
    expect(screen.getByTestId('LIST_CARD-list-body')).toBeDefined();
    expect(screen.getByTestId('LIST_CARD-loading')).toBeDefined();

    rerender(<ListCard title="Testing" hasMoreData isLoading data={data} testID="list_card" />);

    expect(screen.getByTestId('list_card')).toBeDefined();
    expect(screen.getByTestId('list_card-list-body')).toBeDefined();
    expect(screen.getByTestId('list_card-loading')).toBeDefined();
  });

  it('calls loadData callback on scroll', () => {
    const onLoadData = jest.fn();

    const wrapper = mount(
      <ListCard title="Testing" loadData={onLoadData} hasMoreData isLoading={false} data={data} />
    );

    wrapper.find('Card').prop('onScroll')(mockScrollEvent);
    expect(onLoadData).toHaveBeenCalled();
  });

  it('LoadData when data is null', () => {
    const onLoadData = jest.fn();

    const wrapper = mount(
      <ListCard title="Testing" loadData={onLoadData} hasMoreData isLoading={false} />
    );

    expect(wrapper.find('InlineLoading')).toHaveLength(0);
  });

  it('Inline Loading', () => {
    const onLoadData = jest.fn();

    const wrapper = mount(
      <ListCard title="Testing" loadData={onLoadData} hasMoreData isLoading data={data} />
    );

    expect(wrapper.find('InlineLoading')).toHaveLength(1);
  });
});
