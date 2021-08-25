import React from 'react';
import { screen, render, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { keyCodes } from '../../constants/KeyCodeConstants';

import TimePickerSpinner, { TIMEGROUPS } from './TimePickerSpinner';

const timePickerProps = {
  id: 'timepickerspinner',
  onClick: jest.fn(),
  onChange: jest.fn(),
  labelText: 'Pick a time',
};

describe('TimePickerSpinner', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('should be selectable by testId', () => {
    render(<TimePickerSpinner {...timePickerProps} spinner testId="time_picker_spinner" />);
    expect(screen.getByTestId('time_picker_spinner')).toBeDefined();
    expect(screen.getByTestId('time_picker_spinner-up-button')).toBeDefined();
    expect(screen.getByTestId('time_picker_spinner-down-button')).toBeDefined();
  });

  it('with spinner', () => {
    render(<TimePickerSpinner {...timePickerProps} spinner />);
    expect(screen.queryAllByRole('button')).toHaveLength(2);
  });

  it('without spinner', () => {
    render(<TimePickerSpinner {...timePickerProps} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('increment/decrement value via buttons', () => {
    render(<TimePickerSpinner {...timePickerProps} spinner />);

    fireEvent.click(screen.queryByRole('button', { name: /Increment hours/i }));
    expect(screen.getByRole('textbox').value).toEqual('01:00');

    fireEvent.click(screen.queryByRole('button', { name: /Decrement hours/i }));
    expect(screen.getByRole('textbox').value).toEqual('00:00');
  });

  // Note: JSDOM follows the whatwg spec of keyboard events which may not follow
  // the current or expected behvaior of keyboard interaction in browsers.
  // The following test covers the keyboard interaction at a base level, but
  // needs to be improved by testing keyboard focus/interactions in-browser via cypress or similar.
  it('increment/decrement value via keyboard', () => {
    render(<TimePickerSpinner {...timePickerProps} spinner />);

    screen.getByRole('textbox').focus();

    fireEvent.keyUp(document.activeElement || document.body, {
      key: 'ArrowLeft',
      code: 'ArrowLeft',
      keyCode: keyCodes.LEFT,
    });
    fireEvent.keyUp(document.activeElement || document.body, {
      key: 'ArrowUp',
      code: 'ArrowUp',
      keyCode: keyCodes.UP,
    });
    expect(screen.getByRole('textbox').value).toEqual('01:00');

    fireEvent.keyUp(document.activeElement || document.body, {
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: keyCodes.DOWN,
    });
    expect(screen.getByRole('textbox').value).toEqual('00:00');
  });

  it('value is not modified on unrelated keystroke', () => {
    render(<TimePickerSpinner {...timePickerProps} spinner />);

    screen.getByRole('textbox').focus();

    fireEvent.keyDown(document.activeElement || document.body, {
      key: 'Escape',
      code: 'Escape',
      keyCode: keyCodes.ESCAPE,
    });
    fireEvent.keyUp(document.activeElement || document.body, {
      key: 'Escape',
      code: 'Escape',
      keyCode: keyCodes.ESCAPE,
    });
    expect(screen.getByRole('textbox').value).toEqual('');
  });

  it('work with strings', () => {
    render(<TimePickerSpinner {...timePickerProps} labelText="Pick a time" value="xyz" spinner />);

    const input = screen.getByLabelText('Pick a time');

    expect(input).toHaveValue('xyz');
    fireEvent.blur(input);
    expect(input).toHaveValue('');

    userEvent.click(screen.getByTitle('Decrement hours'));
    expect(input).toHaveValue('23:00');
  });

  // The following test covers the keyboard interaction at a base level, but
  // needs to be improved by testing keyboard focus/interactions in-browser
  // via cypress or similar.
  it('show indicator', () => {
    render(<TimePickerSpinner {...timePickerProps} spinner />);

    const upButton = screen.getByLabelText(/increment/i);
    const downButton = screen.getByLabelText(/decrement/i);
    const input = screen.getByLabelText('Pick a time');
    const wrapper = screen.getByTestId('time-picker-spinner-wrapper');

    userEvent.click(input);
    userEvent.click(upButton);
    act(() => {
      jest.runAllTimers();
    });
    expect(input).toHaveValue('01:00');
    expect(wrapper).toHaveClass('iot--time-picker__wrapper--show-underline');
    fireEvent.mouseOver(upButton);
    fireEvent.mouseOut(upButton);
    fireEvent.blur(upButton);
    expect(wrapper).not.toHaveClass('iot--time-picker__wrapper--show-underline');

    fireEvent.focus(input);
    fireEvent.keyUp(input, {
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: keyCodes.DOWN,
    });
    act(() => {
      jest.runAllTimers();
    });
    expect(input).toHaveValue('00:00');
    fireEvent.keyUp(input, {
      key: 'ArrowUp',
      code: 'ArrowUp',
      keyCode: keyCodes.UP,
    });
    act(() => {
      jest.runAllTimers();
    });
    expect(input).toHaveValue('01:00');
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 0);

    userEvent.click(downButton);
    act(() => {
      jest.runAllTimers();
    });
    expect(input).toHaveValue('00:00');
    fireEvent.mouseOver(downButton);
    fireEvent.mouseOut(downButton);
    fireEvent.blur(downButton);
  });

  it('onClick should be called', () => {
    render(<TimePickerSpinner {...timePickerProps} spinner />);
    userEvent.click(screen.getByLabelText('Pick a time'));
    expect(timePickerProps.onClick).toHaveBeenCalled();
  });

  it('onClick should not be called if not passed', () => {
    render(<TimePickerSpinner {...timePickerProps} onClick={undefined} spinner />);
    userEvent.click(screen.getByLabelText('Pick a time'));
    expect(timePickerProps.onClick).not.toHaveBeenCalled();
  });

  it('onChange should be called', () => {
    render(<TimePickerSpinner {...timePickerProps} spinner />);
    userEvent.click(screen.getByLabelText(/increment/i));
    expect(timePickerProps.onChange).toHaveBeenCalled();
    const input = screen.getByLabelText('Pick a time');
    userEvent.clear(input);
    expect(input).toHaveValue('');
    userEvent.type(input, '12:34');
    expect(input).toHaveValue('12:34');
    expect(timePickerProps.onChange).toHaveBeenCalledTimes(7);
  });

  it('onChange should not be called if not passed', () => {
    render(<TimePickerSpinner {...timePickerProps} onChange={undefined} spinner />);
    userEvent.click(screen.getByLabelText(/increment/i));
    expect(timePickerProps.onChange).not.toHaveBeenCalled();
    const input = screen.getByLabelText('Pick a time');
    userEvent.clear(input);
    expect(input).toHaveValue('');
    userEvent.type(input, '12:34');
    expect(input).toHaveValue('12:34');
    expect(timePickerProps.onChange).not.toHaveBeenCalled();
  });

  it('should set time group to minutes if selectionStart is greater than 2', () => {
    render(<TimePickerSpinner {...timePickerProps} spinner />);
    const input = screen.getByLabelText('Pick a time');

    fireEvent.focus(input);
    // this keyEvent sets the selectionRange to 5 b/c of how testing-library always moves to the end
    // of the endup.
    fireEvent.keyUp(input, {
      key: 'ArrowUp',
      code: 'ArrowUp',
      keyCode: keyCodes.UP,
    });
    act(() => {
      jest.runAllTimers();
    });
    expect(input).toHaveValue('01:00');
    // thus, this click event checks the current selectionRange and finds that it's 5 and therefore
    // updates the input to group 2 (minutes)
    userEvent.click(input);
    fireEvent.keyUp(input, {
      key: 'ArrowUp',
      code: 'ArrowUp',
      keyCode: keyCodes.UP,
    });
    act(() => {
      jest.runAllTimers();
    });
    expect(input).toHaveValue('01:01');
    fireEvent.keyUp(input, {
      key: 'ArrowRight',
      code: 'ArrowRight',
      keyCode: keyCodes.RIGHT,
    });
    fireEvent.keyUp(input, {
      key: 'ArrowRight',
      code: 'ArrowRight',
      keyCode: keyCodes.RIGHT,
    });
    expect(input.selectionStart).toBe(5);
    fireEvent.keyUp(input, {
      key: 'ArrowLeft',
      code: 'ArrowLeft',
      keyCode: keyCodes.LEFT,
    });
    expect(input.selectionStart).toBe(4);
    act(() => {
      jest.runAllTimers();
    });
    userEvent.click(input);
    fireEvent.keyUp(input, {
      key: 'ArrowUp',
      code: 'ArrowUp',
      keyCode: keyCodes.UP,
    });

    act(() => {
      jest.runAllTimers();
    });
    expect(input).toHaveValue('01:02');
  });

  it('12-hour picker', () => {
    render(<TimePickerSpinner {...timePickerProps} value="12:00" spinner is12hour />);
    userEvent.click(screen.getByLabelText(/increment/i));
    expect(screen.getByLabelText('Pick a time')).toHaveValue('00:00');
  });

  it('default timeGroup to minutes', () => {
    render(
      <TimePickerSpinner
        {...timePickerProps}
        value="12:00"
        spinner
        defaultTimegroup={TIMEGROUPS.MINUTES}
      />
    );
    userEvent.click(screen.getByLabelText(/increment/i));
    expect(screen.getByLabelText('Pick a time')).toHaveValue('12:01');
  });

  it('flip minutes back to 59 after hitting 0', () => {
    render(
      <TimePickerSpinner
        {...timePickerProps}
        value="12:00"
        spinner
        defaultTimegroup={TIMEGROUPS.MINUTES}
      />
    );
    userEvent.click(screen.getByLabelText(/decrement/i));
    expect(screen.getByLabelText('Pick a time')).toHaveValue('12:59');
  });
});
