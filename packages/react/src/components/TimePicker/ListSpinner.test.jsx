import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ListSpinner, { backwardArraySwap, forwardArraySwap, moveToSecondIndex } from './ListSpinner';

describe('ListSpinner', () => {
  const onClick = jest.fn();
  const { IntersectionObserver: originalIntersectionObserver } = window;
  beforeEach(() => {
    window.IntersectionObserver = jest.fn().mockImplementation((callback) => {
      callback([{ isIntersecting: false }]);

      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    });
  });

  afterEach(() => {
    window.IntersectionObserver = originalIntersectionObserver;
    jest.restoreAllMocks();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  const listItems = Array.from(Array(12)).map((el, i) => {
    const index = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;
    return { id: index, value: index };
  });

  it('is selectable with testId', () => {
    render(
      <ListSpinner testId="my-list" onClick={onClick} list={listItems} defaultSelectedId="03" />
    );
    expect(screen.getByTestId('my-list')).toBeTruthy();
    expect(screen.getByTestId('my-list-prev-btn')).toBeTruthy();
    expect(screen.getByTestId('my-list-next-btn')).toBeTruthy();
    expect(screen.getByTestId('my-list-list')).toBeTruthy();
    expect(screen.getAllByTestId('my-list-list-item').length).toEqual(12);
  });

  it('scrolls down when you hit previous button', async () => {
    render(
      <ListSpinner list={listItems} onClick={onClick} defaultSelectedId="10" testId="my-list" />
    );
    const prevBtn = screen.getByTestId('my-list-prev-btn');
    userEvent.click(prevBtn);
    await waitFor(() => expect(onClick.mock.calls[0][0]).toEqual('09'));
    const selectedBtn = screen.getByText(/09/);
    expect(
      selectedBtn.parentNode.classList.contains('iot--list-spinner__list-item--selected')
    ).toBeTruthy();
    onClick.mockRestore();
    const tenBtn = screen.getByText(/10/);
    userEvent.click(tenBtn);
    await waitFor(() => expect(onClick.mock.calls[0][0]).toEqual('10'));
  });

  it('will return a new array with the first index moved to the end', () => {
    const list = Array.from(Array(12)).map((el, i) => i);
    const newValue = backwardArraySwap(list);
    expect(newValue.toString()).toEqual('1,2,3,4,5,6,7,8,9,10,11,0');
  });

  it('will return a new array with the last index moved to the start', () => {
    const list = Array.from(Array(12)).map((el, i) => i);
    const newValue = forwardArraySwap(list);
    expect(newValue.toString()).toEqual('11,0,1,2,3,4,5,6,7,8,9,10');
  });

  it('shifts so that selected index moves to the second index location', () => {
    const list = Array.from(Array(12)).map((el, i) => i);
    let newValue = moveToSecondIndex(list, 6);
    expect(newValue.toString()).toEqual('4,5,6,7,8,9,10,11,0,1,2,3');
    newValue = moveToSecondIndex(newValue, 4);
    expect(newValue.toString()).toEqual('6,7,8,9,10,11,0,1,2,3,4,5');
    newValue = moveToSecondIndex(list, 11);
    expect(newValue.toString()).toEqual('9,10,11,0,1,2,3,4,5,6,7,8');
  });
});
