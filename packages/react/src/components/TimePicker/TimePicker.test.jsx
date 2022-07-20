import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import TimePicker from './TimePicker';

describe('TimePicker', () => {
  const timePickerProps = {
    secondaryValue: '04:33 PM',
    readOnly: false,
    hideLabel: false,
    hideSecondaryLabel: false,
    id: 'time-picker-test',
    testId: 'time-picker-test',
    i18n: {
      labelText: 'Start',
      secondaryLabelText: 'End',
      helperText: 'This is some helper text',
      warnText: 'You have been warned',
    },
    type: 'single',
    invalid: [false, false],
    warn: [false, false],
    onChange: jest.fn(),
  };

  it('is selectable with testId', () => {
    const { rerender } = render(<TimePicker {...timePickerProps} />);
    expect(screen.getByTestId('time-picker-test')).toBeTruthy();
    expect(screen.getByTestId('time-picker-test-input')).toBeTruthy();
    expect(screen.getByTestId('time-picker-test-time-btn')).toBeTruthy();
    const timeBtn = screen.getByTestId('time-picker-test-time-btn');
    userEvent.click(timeBtn);
    const dropdown = screen.queryByTestId('time-picker-test-spinner');
    expect(dropdown).toBeTruthy();
    rerender(<TimePicker {...timePickerProps} type="range" />);
    expect(screen.getByTestId('time-picker-test-input-1')).toBeTruthy();
    expect(screen.getByTestId('time-picker-test-time-btn-1')).toBeTruthy();
    expect(screen.getByTestId('time-picker-test-input-2')).toBeTruthy();
    expect(screen.getByTestId('time-picker-test-time-btn-2')).toBeTruthy();
  });

  it('can take input and returns it in onChange callback', async () => {
    render(<TimePicker {...timePickerProps} />);
    const input = screen.getByTestId('time-picker-test-input');
    await act(() => userEvent.type(input, '09:30{space}AM', { delay: 200 }));
    expect(timePickerProps.onChange).toHaveBeenCalledTimes(8);
    expect(input.value).toEqual('09:30 AM');
    expect(timePickerProps.onChange.mock.calls[7][0]).toEqual('09:30 AM');
  });

  it('opens dropdown when clock icon clicked, closes when component loses focus', async () => {
    render(<TimePicker {...timePickerProps} />);
    const timeBtn = screen.getByTestId('time-picker-test-time-btn');
    userEvent.click(timeBtn);
    const dropdown = screen.queryByTestId('time-picker-test-spinner');
    expect(dropdown).toBeTruthy();
    userEvent.click(document.body);
    await waitFor(() => expect(dropdown).not.toBeInTheDocument());
  });

  // it.only('updates the value of input when list spinner button is pressed', async () => {
  //   render(<TimePicker {...timePickerProps} value="09:30 AM" />);
  //   const timeBtn = screen.getByTestId('time-picker-test-time-btn');
  //   userEvent.click(timeBtn);
  //   const prevBtn = screen.queryByTestId('time-picker-test-spinner-list-spinner-1-prev-btn');
  //   const input = screen.getByTestId('time-picker-test-input');
  //   // console.log(prevBtn);
  //   fireEvent.click(prevBtn);
  //   await waitFor(() =>
  //     fireEvent.click(screen.queryByTestId('time-picker-test-spinner-list-spinner-1-prev-btn'))
  //   );
  //   expect(input.value).toEqual('08:30 AM');
  // });

  // it('scrolls down when you hit previous button', async () => {
  //   render(
  //     <ListSpinner
  //       listItems={listItems}
  //       onClick={onClick}
  //       defaultSelectedId="hour-10"
  //       testId="my-list"
  //     />
  //   );
  //   // screen.debug();
  //   // fireEvent.click(screen.getByTestId('my-list-prev-btn'));
  //   userEvent.click(screen.getByTestId('my-list-prev-btn'));
  //   expect(1).toEqual(1);
  //   await waitFor(() => expect(onChange).toHaveBeenCalledWith('hour-09'));
  // });
});
