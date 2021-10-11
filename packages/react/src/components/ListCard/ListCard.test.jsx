import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { CARD_SIZES } from '../..';

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
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should be selectable by testID or testId', () => {
    const onLoadData = jest.fn();
    const { rerender } = render(
      <ListCard
        title="Testing"
        hasMoreData
        isLoading
        data={data}
        testID="LIST_CARD"
        loadData={onLoadData}
      />
    );

    expect(screen.getByTestId('LIST_CARD')).toBeDefined();
    expect(screen.getByTestId('LIST_CARD-list-body')).toBeDefined();
    expect(screen.getByTestId('LIST_CARD-loading')).toBeDefined();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(`The 'testID' prop has been deprecated.`)
    );
    jest.resetAllMocks();

    rerender(
      <ListCard
        title="Testing"
        hasMoreData
        isLoading
        data={data}
        testId="list_card"
        loadData={onLoadData}
      />
    );

    expect(screen.getByTestId('list_card')).toBeDefined();
    expect(screen.getByTestId('list_card-list-body')).toBeDefined();
    expect(screen.getByTestId('list_card-loading')).toBeDefined();
  });

  it('calls loadData callback on scroll', () => {
    const onLoadData = jest.fn();

    render(
      <ListCard title="Testing" loadData={onLoadData} hasMoreData isLoading={false} data={data} />
    );

    fireEvent.scroll(screen.getByTestId('Card'), mockScrollEvent.target);
    expect(onLoadData).toHaveBeenCalled();
  });

  it('LoadData when data is null', () => {
    const onLoadData = jest.fn();

    render(<ListCard title="Testing" loadData={onLoadData} hasMoreData isLoading={false} />);

    expect(screen.queryByText('Loading data...')).toBeNull();
  });

  it('Inline Loading', () => {
    const onLoadData = jest.fn();

    render(<ListCard title="Testing" loadData={onLoadData} hasMoreData isLoading data={data} />);

    expect(screen.queryByText('Loading data...')).not.toBeNull();
  });

  it('should display a proptype error when using SMALL size', () => {
    const onLoadData = jest.fn();
    render(<ListCard title="Testing" data={data} size={CARD_SIZES.SMALL} loadData={onLoadData} />);

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('`ListCard` prop `size` cannot be `SMALL`')
    );
  });

  it('should display a proptype error when using SMALLWIDE sizes', () => {
    const onLoadData = jest.fn();
    render(
      <ListCard title="Testing" data={data} size={CARD_SIZES.SMALLWIDE} loadData={onLoadData} />
    );

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('`ListCard` prop `size` cannot be `SMALLWIDE`')
    );
  });

  it('should display a proptype error when using SMALLFULL sizes', () => {
    const onLoadData = jest.fn();
    render(
      <ListCard title="Testing" data={data} size={CARD_SIZES.SMALLFULL} loadData={onLoadData} />
    );

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('`ListCard` prop `size` cannot be `SMALLFULL`')
    );
  });

  it('should display a proptype error when using an unknown size.', () => {
    const onLoadData = jest.fn();
    expect(() =>
      render(<ListCard title="Testing" data={data} size="REALLY_BIG_CARD" loadData={onLoadData} />)
    ).toThrowError(`Cannot read property 'lg' of undefined`);

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('`ListCard` prop `size` must be one of ')
    );
  });
});
