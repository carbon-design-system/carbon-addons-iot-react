import React from 'react';
import { render, screen, userEvent, fireEvent, waitFor } from '@testing-library/react';

import Button from '../Button';

import ListSpinner from './ListSpinner';

describe('ListSpinner', () => {
  const onClick = jest.fn();
  const onChange = jest.fn();
  afterEach(() => {
    jest.clearAllMocks();
  });
  const listItems = Array.from(Array(12)).map((el, i) => {
    const index = i + 1 < 10 ? `0${i + 1}` : i + 1;
    return (
      <li id={`hour-${index}`}>
        <Button id={`hour-${index}-button`} kind="ghost">
          {index}
        </Button>
      </li>
    );
  });
  it('is selectable with testId', () => {
    render(<ListSpinner listItems={listItems} testId="my-list" />);
    expect(screen.getByTestId('my-list')).toBeTruthy();
    expect(screen.getByTestId('my-list-prev-btn')).toBeTruthy();
    expect(screen.getByTestId('my-list-next-btn')).toBeTruthy();
    expect(screen.getByTestId('my-list-list')).toBeTruthy();
    expect(screen.getAllByTestId('my-list-list-item')).toBeTruthy();
  });

  it.only('scrolls down when you hit previous button', async () => {
    render(
      <ListSpinner
        listItems={listItems}
        onClick={onClick}
        defaultSelectedId="hour-10"
        testId="my-list"
      />
    );
    // screen.debug();
    // fireEvent.click(screen.getByTestId('my-list-prev-btn'));
    userEvent.click(screen.getByTestId('my-list-prev-btn'));
    expect(1).toEqual(1);
    await waitFor(() => expect(onChange).toHaveBeenCalledWith('hour-09'));
  });
});
