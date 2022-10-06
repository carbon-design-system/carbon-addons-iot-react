import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import MockDate from 'mockdate';

import { settings } from '../../constants/Settings';

import TimePickerDropdown from './TimePickerDropdown';

const { iotPrefix, prefix } = settings;

describe('TimePickerDropdown', () => {
  const { IntersectionObserver: originalIntersectionObserver } = window;
  beforeEach(() => {
    MockDate.set(1356067800000);
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
    MockDate.reset();
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
    const { rerender } = render(<TimePickerDropdown {...timePickerProps} />);
    expect(screen.getByTestId('time-picker-test')).toBeTruthy();
    expect(screen.getByTestId('time-picker-test-input')).toBeTruthy();
    fireEvent.focus(screen.getByTestId('time-picker-test-input'));
    const dropdown = screen.queryByTestId('time-picker-test-spinner');
    expect(dropdown).toBeTruthy();
    rerender(
      <TimePickerDropdown
        {...timePickerProps}
        type="range"
        value="03:30 AM"
        defaultValue="03:30 AM"
      />
    );
    expect(screen.getByTestId('time-picker-test-input-1')).toBeTruthy();
    expect(screen.getByTestId('time-picker-test-input-2')).toBeTruthy();
  });

  it('renders the appropriate help text and icon when invalid/warn/readonly is passed', () => {
    // test warn prop
    const { rerender } = render(
      <TimePickerDropdown {...timePickerProps} type="range" warn={[true, false]} />
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
    rerender(<TimePickerDropdown {...timePickerProps} type="range" warn={[false, true]} />);
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
    rerender(<TimePickerDropdown {...timePickerProps} warn={[true]} />);
    expect(
      screen
        .getByTestId('time-picker-test-time-btn')
        .classList.contains(`${iotPrefix}--time-picker__icon--warn`)
    ).toBe(true);
    expect(screen.getByText(/You have been warned/)).toBeTruthy();

    // test invalid prop
    rerender(<TimePickerDropdown {...timePickerProps} type="range" invalid={[false, true]} />);
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
    rerender(<TimePickerDropdown {...timePickerProps} type="range" invalid={[true, false]} />);
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
    rerender(<TimePickerDropdown {...timePickerProps} invalid={[true]} />);
    expect(
      screen
        .getByTestId('time-picker-test-time-btn')
        .classList.contains(`${iotPrefix}--time-picker__icon--invalid`)
    ).toBe(true);
    expect(screen.getByText(/The time entered is invalid/)).toBeTruthy();

    // test readonly prop
    rerender(<TimePickerDropdown {...timePickerProps} type="range" readOnly />);
    expect(screen.getAllByTitle(/Read only/).length).toEqual(2);
  });

  it('should display only secondary invalid state if 2nd invalid prop passed', () => {
    const { rerender } = render(
      <TimePickerDropdown {...timePickerProps} type="range" invalid={[false, true]} />
    );

    const firstInput = screen.getByTestId('time-picker-test-input-1');
    const secondaryInput = screen.getByTestId('time-picker-test-input-2');

    expect(secondaryInput).toBeInvalid();
    expect(firstInput).not.toBeInvalid();

    expect(screen.getByText('The time entered is invalid')).toBeInTheDocument();
    expect(screen.getByText('This is some helper text')).toBeInTheDocument();

    rerender(<TimePickerDropdown {...timePickerProps} type="range" invalid={[true, false]} />);

    expect(firstInput).toBeInvalid();
    expect(secondaryInput).not.toBeInvalid();

    expect(screen.getByText('The time entered is invalid')).toBeInTheDocument();
    expect(screen.getByText('This is some helper text')).toBeInTheDocument();
  });

  it('should display only secondary warn state if 2nd warn prop passed', () => {
    const { rerender } = render(
      <TimePickerDropdown {...timePickerProps} type="range" warn={[false, true]} />
    );

    const firstInput = screen.getByTestId('time-picker-test-input-1');
    const secondaryInput = screen.getByTestId('time-picker-test-input-2');

    expect(secondaryInput).toHaveClass('bx--text-input--warning');
    expect(firstInput).not.toHaveClass('bx--text-input--warning');

    expect(screen.getByText('You have been warned')).toBeInTheDocument();
    expect(screen.getByText('This is some helper text')).toBeInTheDocument();

    rerender(<TimePickerDropdown {...timePickerProps} type="range" warn={[true, false]} />);

    expect(firstInput).toHaveClass('bx--text-input--warning');
    expect(secondaryInput).not.toHaveClass('bx--text-input--warning');

    expect(screen.getByText('You have been warned')).toBeInTheDocument();
    expect(screen.getByText('This is some helper text')).toBeInTheDocument();
  });

  it('can take input and returns it in onChange callback', async () => {
    const { rerender } = render(<TimePickerDropdown {...timePickerProps} />);
    timePickerProps.onChange.mockRestore();
    const input = screen.getByTestId('time-picker-test-input');
    userEvent.type(
      input,
      '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}09:30{space}AM'
    );
    expect(timePickerProps.onChange).toHaveBeenCalledTimes(17);
    expect(input.value).toEqual('09:30 AM');
    expect(timePickerProps.onChange.mock.calls[16][0]).toEqual('09:30 AM');
    timePickerProps.onChange.mockRestore();
    rerender(<TimePickerDropdown {...timePickerProps} type="range" />);
    const input2 = screen.getByTestId('time-picker-test-input-2');
    userEvent.type(
      input2,
      '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}09:30{space}AM'
    );
    expect(timePickerProps.onChange).toHaveBeenCalledTimes(17);
    expect(input2.value).toEqual('09:30 AM');
    expect(timePickerProps.onChange.mock.calls[16][0]).toEqual('09:30 AM');
  });

  it('hides and shows appropriate labels', () => {
    const { rerender } = render(<TimePickerDropdown {...timePickerProps} />);
    let firstLabel = screen.queryByText('Start');
    let secondLabel = screen.queryByText('End');
    expect(firstLabel).toBeInTheDocument();
    expect(secondLabel).not.toBeInTheDocument();
    rerender(<TimePickerDropdown {...timePickerProps} type="range" />);
    firstLabel = screen.queryByText('Start');
    secondLabel = screen.queryByText('End');
    expect(firstLabel).toBeInTheDocument();
    expect(secondLabel).toBeInTheDocument();
    rerender(<TimePickerDropdown {...timePickerProps} type="range" hideSecondaryLabel />);
    firstLabel = screen.queryByText('Start');
    secondLabel = screen.queryByText('End');
    expect(firstLabel).toBeInTheDocument();
    expect(secondLabel).not.toBeInTheDocument();
    rerender(<TimePickerDropdown {...timePickerProps} type="range" hideLabel />);
    firstLabel = screen.queryByText('Start');
    secondLabel = screen.queryByText('End');
    expect(firstLabel.classList.contains(`${prefix}--visually-hidden`)).toBeTruthy();
    expect(secondLabel.classList.contains(`${prefix}--visually-hidden`)).toBeTruthy();
  });

  it('opens dropdown when input field is focused, closes on when component loses focus', async () => {
    render(<TimePickerDropdown {...timePickerProps} type="range" />);
    const qbt = screen.queryByTestId;
    const input1 = screen.getByTestId('time-picker-test-input-1');
    fireEvent.focus(input1);
    expect(qbt('time-picker-test-spinner')).toBeInTheDocument();
    fireEvent.blur(input1);
    expect(qbt('time-picker-test-spinner')).not.toBeInTheDocument();

    const input2 = screen.getByTestId('time-picker-test-input-2');
    fireEvent.focus(input2);
    expect(qbt('time-picker-test-spinner')).toBeInTheDocument();
    fireEvent.blur(input2);
    expect(qbt('time-picker-test-spinner')).not.toBeInTheDocument();
  });

  it('will not open dropdown if in read only state', () => {
    const { rerender } = render(<TimePickerDropdown {...timePickerProps} readOnly />);
    const timeBtn = screen.getByTestId('time-picker-test-time-btn');
    userEvent.click(timeBtn);
    const dropdown = screen.queryByTestId('time-picker-test-spinner');
    expect(dropdown).toBeFalsy();

    rerender(<TimePickerDropdown {...timePickerProps} type="range" readOnly />);
    const timeBtn1 = screen.getByTestId('time-picker-test-time-btn-1');
    const timeBtn2 = screen.getByTestId('time-picker-test-time-btn-2');
    userEvent.click(timeBtn1);
    userEvent.click(timeBtn2);
    expect(dropdown).toBeFalsy();
  });

  it('updates the value of input when list spinner button is pressed', async () => {
    render(<TimePickerDropdown {...timePickerProps} value="09:30 AM" />);
    const input = screen.getByTestId('time-picker-test-input');
    fireEvent.focus(input);
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
    render(<TimePickerDropdown {...timePickerProps} type="range" secondaryValue="09:30 AM" />);
    const input1 = screen.getByTestId('time-picker-test-input-1');
    const input2 = screen.getByTestId('time-picker-test-input-2');
    fireEvent.focus(input2);
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

  it('should hide meridiem spinner if in 24h format', () => {
    render(<TimePickerDropdown {...timePickerProps} is24hours />);

    fireEvent.focus(screen.queryByTestId('time-picker-test-input'));

    expect(screen.queryByTestId('time-picker-test-spinner-list-spinner-1')).toBeInTheDocument();
    expect(screen.queryByTestId('time-picker-test-spinner-list-spinner-2')).toBeInTheDocument();
    expect(screen.queryByTestId('time-picker-test-spinner-list-spinner-3')).not.toBeInTheDocument();
  });

  it('should be in invalid state if meridiem is typed into 24h input', () => {
    render(<TimePickerDropdown {...timePickerProps} is24hours />);
    const input = screen.getByTestId('time-picker-test-input');
    fireEvent.change(input, { target: { value: '09:33 AM' } });
    fireEvent.blur(input);

    expect(screen.getByText('The time entered is invalid')).toBeInTheDocument();
    expect(input).toBeInvalid();
  });

  it('should populate time value in input on focus', () => {
    render(<TimePickerDropdown {...timePickerProps} type="range" />);
    const input1 = screen.getByTestId('time-picker-test-input-1');
    const input2 = screen.getByTestId('time-picker-test-input-2');
    fireEvent.focus(input1);
    expect(input1.value).toEqual('11:30 PM');
    fireEvent.focus(input2);
    expect(input2.value).toEqual('11:30 PM');
  });

  it('should not populate time value on focus if correct value already filled in', () => {
    render(
      <TimePickerDropdown
        {...timePickerProps}
        type="range"
        value="08:30 AM"
        secondaryValue="09:30 AM"
      />
    );
    const input1 = screen.getByTestId('time-picker-test-input-1');
    const input2 = screen.getByTestId('time-picker-test-input-2');
    fireEvent.focus(input1);
    expect(input1.value).toEqual('08:30 AM');
    fireEvent.focus(input2);
    expect(input2.value).toEqual('09:30 AM');

    userEvent.type(
      input1,
      '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}11:30{space}AM'
    );

    userEvent.type(
      input2,
      '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}06:30{space}AM'
    );

    userEvent.click(document.body);

    fireEvent.focus(input1);
    expect(input1.value).toEqual('11:30 AM');
    fireEvent.focus(input2);
    expect(input2.value).toEqual('06:30 AM');
  });

  it('should display invalid state if typed characters outside of 24h format', async () => {
    render(<TimePickerDropdown {...timePickerProps} />);
    const input = screen.getByTestId('time-picker-test-input');
    userEvent.type(input, 'fdsfsdfsdf');
    expect(input.value).toEqual('11:30 PMfdsfsdfsdf');
    userEvent.click(document.body);
    await waitFor(() => {
      expect(screen.getByText('The time entered is invalid')).toBeInTheDocument();
    });
  });

  it('should move focus in spinner if left or right arrows pressed', () => {
    render(<TimePickerDropdown {...timePickerProps} />);
    const input = screen.getByTestId('time-picker-test-input');
    input.focus();
    userEvent.type(input, '{arrowdown}');
    expect(
      screen.getByTestId('time-picker-test-spinner-list-spinner-1-selected-item')
    ).toHaveFocus();

    userEvent.type(
      screen.getByTestId('time-picker-test-spinner-list-spinner-1-selected-item'),
      '{arrowright}'
    );
    expect(
      screen.getByTestId('time-picker-test-spinner-list-spinner-2-selected-item')
    ).toHaveFocus();

    userEvent.type(
      screen.getByTestId('time-picker-test-spinner-list-spinner-2-selected-item'),
      '{arrowright}'
    );
    expect(
      screen.getByTestId('time-picker-test-spinner-list-spinner-3-selected-item')
    ).toHaveFocus();

    userEvent.type(
      screen.getByTestId('time-picker-test-spinner-list-spinner-3-selected-item'),
      '{arrowleft}'
    );
    expect(
      screen.getByTestId('time-picker-test-spinner-list-spinner-2-selected-item')
    ).toHaveFocus();

    userEvent.type(
      screen.getByTestId('time-picker-test-spinner-list-spinner-2-selected-item'),
      '{arrowleft}'
    );
    expect(
      screen.getByTestId('time-picker-test-spinner-list-spinner-1-selected-item')
    ).toHaveFocus();
  });

  it('should close dropdown spinner on enter keyboard press', () => {
    render(<TimePickerDropdown {...timePickerProps} />);
    const input = screen.getByTestId('time-picker-test-input');
    input.focus();
    userEvent.type(input, '{arrowdown}');
    expect(
      screen.getByTestId('time-picker-test-spinner-list-spinner-1-selected-item')
    ).toHaveFocus();

    const spinnerDropdown = screen.getByTestId('time-picker-test-spinner');

    userEvent.type(
      screen.getByTestId('time-picker-test-spinner-list-spinner-1-selected-item'),
      '{enter}'
    );
    expect(input).toHaveFocus();
    expect(spinnerDropdown).not.toBeInTheDocument();
  });
});
