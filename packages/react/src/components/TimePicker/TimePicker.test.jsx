import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { settings } from '../../constants/Settings';

import TimePicker from './TimePicker';

const { iotPrefix } = settings;

describe('TimePicker', () => {
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
  });
  const timePickerProps = {
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
    rerender(
      <TimePicker {...timePickerProps} type="range" value="03:30 AM" defaultValue="03:30 AM" />
    );
    expect(screen.getByTestId('time-picker-test-input-1')).toBeTruthy();
    expect(screen.getByTestId('time-picker-test-time-btn-1')).toBeTruthy();
    expect(screen.getByTestId('time-picker-test-input-2')).toBeTruthy();
    expect(screen.getByTestId('time-picker-test-time-btn-2')).toBeTruthy();
  });

  it('renders the appropriate help text and icon when invalid/warn/readonly is passed', async () => {
    // test warn prop
    const { rerender } = render(
      <TimePicker {...timePickerProps} type="range" warn={[true, false]} />
    );
    expect(
      screen
        .getByTestId('time-picker-test-time-btn-1')
        .classList.contains(`${iotPrefix}--time-picker__icon--warn`)
    ).toBe(true);
    expect(
      screen
        .getByTestId('time-picker-test-time-btn-2')
        .classList.contains(`${iotPrefix}--time-picker__icon--warn`)
    ).toBe(false);
    expect(screen.getByText(/You have been warned/)).toBeTruthy();
    rerender(<TimePicker {...timePickerProps} type="range" warn={[false, true]} />);
    expect(
      screen
        .getByTestId('time-picker-test-time-btn-1')
        .classList.contains(`${iotPrefix}--time-picker__icon--warn`)
    ).toBe(false);
    expect(
      screen
        .getByTestId('time-picker-test-time-btn-2')
        .classList.contains(`${iotPrefix}--time-picker__icon--warn`)
    ).toBe(true);
    expect(screen.getByText(/You have been warned/)).toBeTruthy();

    // single warn
    rerender(<TimePicker {...timePickerProps} warn={[true]} />);
    expect(
      screen
        .getByTestId('time-picker-test-time-btn')
        .classList.contains(`${iotPrefix}--time-picker__icon--warn`)
    ).toBe(true);
    expect(screen.getByText(/You have been warned/)).toBeTruthy();

    // test invalid prop
    rerender(<TimePicker {...timePickerProps} type="range" invalid={[false, true]} />);
    expect(
      screen
        .getByTestId('time-picker-test-time-btn-1')
        .classList.contains(`${iotPrefix}--time-picker__icon--invalid`)
    ).toBe(false);
    expect(
      screen
        .getByTestId('time-picker-test-time-btn-2')
        .classList.contains(`${iotPrefix}--time-picker__icon--invalid`)
    ).toBe(true);
    expect(screen.getByText(/The time entered is invalid/)).toBeTruthy();
    rerender(<TimePicker {...timePickerProps} type="range" invalid={[true, false]} />);
    expect(
      screen
        .getByTestId('time-picker-test-time-btn-1')
        .classList.contains(`${iotPrefix}--time-picker__icon--invalid`)
    ).toBe(true);
    expect(
      screen
        .getByTestId('time-picker-test-time-btn-2')
        .classList.contains(`${iotPrefix}--time-picker__icon--invalid`)
    ).toBe(false);
    expect(screen.getByText(/The time entered is invalid/)).toBeTruthy();
    // single invalid
    rerender(<TimePicker {...timePickerProps} invalid={[true]} />);
    expect(
      screen
        .getByTestId('time-picker-test-time-btn')
        .classList.contains(`${iotPrefix}--time-picker__icon--invalid`)
    ).toBe(true);
    expect(screen.getByText(/The time entered is invalid/)).toBeTruthy();

    // test readonly prop
    rerender(<TimePicker {...timePickerProps} type="range" readOnly />);
    expect(screen.getAllByTitle(/Read only/).length).toEqual(2);
  });

  it('can take input and returns it in onChange callback', async () => {
    const { rerender } = render(<TimePicker {...timePickerProps} />);
    timePickerProps.onChange.mockRestore();
    const input = screen.getByTestId('time-picker-test-input');
    await act(() => userEvent.type(input, '09:30{space}AM', { delay: 200 }));
    expect(timePickerProps.onChange).toHaveBeenCalledTimes(8);
    expect(input.value).toEqual('09:30 AM');
    expect(timePickerProps.onChange.mock.calls[7][0]).toEqual('09:30 AM');
    timePickerProps.onChange.mockRestore();
    rerender(<TimePicker {...timePickerProps} type="range" />);
    const input2 = screen.getByTestId('time-picker-test-input-2');
    await act(() => userEvent.type(input2, '09:30{space}AM', { delay: 200 }));
    expect(timePickerProps.onChange).toHaveBeenCalledTimes(8);
    expect(input2.value).toEqual('09:30 AM');
    expect(timePickerProps.onChange.mock.calls[7][0]).toEqual('09:30 AM');
  });

  it('opens dropdown when clock icon clicked, closes when component loses focus', async () => {
    render(<TimePicker {...timePickerProps} type="range" secondaryValue="09:30" />);
    const timeBtn = screen.getByTestId('time-picker-test-time-btn-1');
    userEvent.click(timeBtn);
    const dropdown = screen.queryByTestId('time-picker-test-spinner');
    expect(dropdown).toBeTruthy();
    userEvent.click(timeBtn);
    await waitFor(() => expect(dropdown).not.toBeInTheDocument());
    userEvent.click(timeBtn);
    expect(dropdown).toBeTruthy();
    userEvent.click(document.body);
    await waitFor(() => expect(dropdown).not.toBeInTheDocument());
    expect(screen.queryByText(/The time entered is invalid/)).toBeTruthy();
    const input1 = screen.getByTestId('time-picker-test-input-1');
    const input2 = screen.getByTestId('time-picker-test-input-2');
    fireEvent.focus(input1);
    fireEvent.focus(input2);
    expect(dropdown).not.toBeInTheDocument();
  });

  it('will not open dropdown if in read only state', async () => {
    const { rerender } = render(<TimePicker {...timePickerProps} readOnly />);
    const timeBtn = screen.getByTestId('time-picker-test-time-btn');
    userEvent.click(timeBtn);
    const dropdown = screen.queryByTestId('time-picker-test-spinner');
    expect(dropdown).toBeFalsy();

    rerender(<TimePicker {...timePickerProps} type="range" readOnly />);
    const timeBtn1 = screen.getByTestId('time-picker-test-time-btn-1');
    const timeBtn2 = screen.getByTestId('time-picker-test-time-btn-2');
    userEvent.click(timeBtn1);
    userEvent.click(timeBtn2);
    expect(dropdown).toBeFalsy();
  });

  it('updates the value of input when list spinner button is pressed', async () => {
    render(<TimePicker {...timePickerProps} value="09:30 AM" />);
    const timeBtn = screen.getByTestId('time-picker-test-time-btn');
    const input = screen.getByTestId('time-picker-test-input');
    userEvent.click(timeBtn);
    const prevBtn = screen.queryByTestId('time-picker-test-spinner-list-spinner-1-prev-btn');
    const nextBtn = screen.queryByTestId('time-picker-test-spinner-list-spinner-1-next-btn');
    const tenBtn = screen.getAllByText(/10/)[0];
    const twentyBtn = screen.getAllByText(/20/)[0];
    const pmBtn = screen.getAllByText(/PM/)[0];
    act(() => userEvent.click(prevBtn));
    await waitFor(() => expect(input.value).toEqual('08:30 AM'));
    act(() => userEvent.click(nextBtn));
    await waitFor(() => expect(input.value).toEqual('09:30 AM'));
    act(() => userEvent.click(tenBtn));
    act(() => userEvent.click(twentyBtn));
    act(() => userEvent.click(pmBtn));
    await waitFor(() => expect(input.value).toEqual('10:20 PM'));
  });

  it('updates the value of  2nd input when list spinner button is pressed', async () => {
    render(
      <TimePicker {...timePickerProps} type="range" hideSecondaryLabel secondaryValue="09:30 AM" />
    );
    const timeBtn1 = screen.getByTestId('time-picker-test-time-btn-1');
    const timeBtn2 = screen.getByTestId('time-picker-test-time-btn-2');
    const input1 = screen.getByTestId('time-picker-test-input-1');
    const input2 = screen.getByTestId('time-picker-test-input-2');
    userEvent.click(timeBtn1);
    userEvent.click(timeBtn2);
    const prevBtn = screen.queryByTestId('time-picker-test-spinner-list-spinner-1-prev-btn');
    const nextBtn = screen.queryByTestId('time-picker-test-spinner-list-spinner-1-next-btn');
    const tenBtn = screen.getAllByText(/10/)[0];
    const twentyBtn = screen.getAllByText(/20/)[0];
    const pmBtn = screen.getAllByText(/PM/)[0];
    act(() => userEvent.click(prevBtn));
    await waitFor(() => expect(input2.value).toEqual('08:30 AM'));
    act(() => userEvent.click(nextBtn));
    await waitFor(() => expect(input2.value).toEqual('09:30 AM'));
    act(() => userEvent.click(tenBtn));
    act(() => userEvent.click(twentyBtn));
    act(() => userEvent.click(pmBtn));
    await waitFor(() => expect(input2.value).toEqual('10:20 PM'));
    expect(input1.value).toEqual('');
  });
});
