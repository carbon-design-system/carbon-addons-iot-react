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

  it('scrolls back around when it hits the end', async () => {
    const listItems2 = Array.from(Array(6)).map((el, i) => {
      const index = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;
      return { id: index, value: index };
    });
    render(
      <ListSpinner list={listItems2} onClick={onClick} defaultSelectedId="01" testId="my-list" />
    );
    const selectedBtn = screen.getByText(/01/);
    expect(
      selectedBtn.parentNode.classList.contains('iot--list-spinner__list-item--selected')
    ).toBeTruthy();
    const prevBtn = screen.getByTestId('my-list-prev-btn');
    const nextBtn = screen.getByTestId('my-list-next-btn');
    userEvent.click(prevBtn);
    userEvent.click(prevBtn);
    userEvent.click(prevBtn);
    userEvent.click(prevBtn);
    userEvent.click(prevBtn);
    userEvent.click(prevBtn);
    expect(
      selectedBtn.parentNode.classList.contains('iot--list-spinner__list-item--selected')
    ).toBeTruthy();
    userEvent.click(nextBtn);
    userEvent.click(nextBtn);
    userEvent.click(nextBtn);
    userEvent.click(nextBtn);
    userEvent.click(nextBtn);
    userEvent.click(nextBtn);
    expect(
      selectedBtn.parentNode.classList.contains('iot--list-spinner__list-item--selected')
    ).toBeTruthy();
  });

  it('should apply callbacks when user presses right or left arrow', () => {
    const rightArrowCallback = jest.fn();
    const leftArrowCallback = jest.fn();
    render(
      <ListSpinner
        list={listItems}
        onRightArrowClick={rightArrowCallback}
        onLeftArrowClick={leftArrowCallback}
        defaultSelectedId="10"
        testId="my-list"
      />
    );

    const selected = screen.getByTestId('my-list-selected-item');
    userEvent.type(selected, '{arrowright}');
    expect(rightArrowCallback).toHaveBeenCalledTimes(1);
    userEvent.type(selected, '{arrowleft}{arrowleft}');
    expect(leftArrowCallback).toHaveBeenCalledTimes(2);
  });

  it('should scroll value if arrow up or arrow down is pressed', () => {
    const onChange = jest.fn();
    render(
      <ListSpinner list={listItems} defaultSelectedId="10" testId="my-list" onChange={onChange} />
    );

    const selected = screen.getByTestId('my-list-selected-item');
    userEvent.type(selected, '{arrowup}{arrowdown}{arrowdown}');
    expect(onChange).toHaveBeenCalledTimes(4);
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

  it('shifts so that selected index moves to the second index location (12h format)', () => {
    const list = Array.from(Array(12)).map((el, i) => i);
    let newValue = moveToSecondIndex(list, 6);
    expect(newValue.toString()).toEqual('4,5,6,7,8,9,10,11,0,1,2,3');
    newValue = moveToSecondIndex(newValue, 4);
    expect(newValue.toString()).toEqual('6,7,8,9,10,11,0,1,2,3,4,5');
    newValue = moveToSecondIndex(list, 11);
    expect(newValue.toString()).toEqual('9,10,11,0,1,2,3,4,5,6,7,8');
  });

  it('shifts so that selected index moves to the second index location (24h format)', () => {
    const list = Array.from(Array(24)).map((el, i) => i);
    let newValue = moveToSecondIndex(list, 5);
    expect(newValue.toString()).toEqual(
      '3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1,2'
    );
    newValue = moveToSecondIndex(newValue, 5);
    expect(newValue.toString()).toEqual(
      '6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1,2,3,4,5'
    );
    newValue = moveToSecondIndex(list, 14);
    expect(newValue.toString()).toEqual(
      '12,13,14,15,16,17,18,19,20,21,22,23,0,1,2,3,4,5,6,7,8,9,10,11'
    );
  });
});
