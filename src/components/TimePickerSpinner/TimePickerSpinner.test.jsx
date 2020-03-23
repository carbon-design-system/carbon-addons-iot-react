import React from 'react';
import { mount } from 'enzyme';

import { keyCodes } from '../../constants/KeyCodeConstants';

import TimePickerSpinner, { TIMEGROUPS } from './TimePickerSpinner';

const timePickerProps = {
  id: 'timepickerspinner',
  onClick: jest.fn(),
  onChange: jest.fn(),
};

describe('TimePickerSpinner tests', () => {
  jest.useFakeTimers();

  test('show/hide spinner', () => {
    let wrapper = mount(<TimePickerSpinner {...timePickerProps} spinner />);
    expect(wrapper.find('.iot--time-picker__controls--btn')).toHaveLength(2);

    wrapper = mount(<TimePickerSpinner {...timePickerProps} />);
    expect(wrapper.find('.iot--time-picker__controls--btn')).toHaveLength(0);
  });

  test('increment/decrement value', () => {
    const wrapper = mount(<TimePickerSpinner {...timePickerProps} spinner />);

    wrapper
      .find('.iot--time-picker__controls--btn.up-icon')
      .first()
      .simulate('click');
    expect(wrapper.find('input').props().value).toEqual('01:00');

    wrapper
      .find('.iot--time-picker__controls--btn.down-icon')
      .first()
      .simulate('click');
    expect(wrapper.find('input').props().value).toEqual('00:00');

    wrapper.find('input').simulate('focus');
    wrapper.find('input').simulate('keyup', { keyCode: keyCodes.LEFT });
    wrapper.find('input').simulate('keyup', { keyCode: keyCodes.RIGHT });
    wrapper.find('input').simulate('keyup', { keyCode: keyCodes.UP });
    wrapper.find('input').simulate('keyup', { keyCode: keyCodes.ESC });
    expect(wrapper.find('input').props().value).toEqual('01:00');

    wrapper.find('input').simulate('keyup', { keyCode: keyCodes.DOWN });
    expect(wrapper.find('input').props().value).toEqual('00:00');

    wrapper
      .find('input')
      .simulate('keyup', { keyCode: keyCodes.RIGHT, currentTarget: { selectionStart: 3 } });
    wrapper.find('input').simulate('keyup', { keyCode: keyCodes.UP });
    expect(wrapper.find('input').props().value).toEqual('01:00');
  });

  test('work with strings', () => {
    const wrapper = mount(<TimePickerSpinner {...timePickerProps} value="xyz" spinner />);

    wrapper
      .find('.iot--time-picker__controls--btn.down-icon')
      .first()
      .simulate('click');
    expect(wrapper.find('input').props().value).toEqual('23:00');
  });

  test('show indicator', () => {
    const wrapper = mount(<TimePickerSpinner {...timePickerProps} spinner />);

    const upButton = wrapper.find('.iot--time-picker__controls--btn.up-icon').first();
    const downButton = wrapper.find('.iot--time-picker__controls--btn.down-icon').first();

    upButton.simulate('focus');
    upButton.simulate('click');
    expect(wrapper.find('input').props().value).toEqual('01:00');
    expect(
      wrapper
        .find('.iot--time-picker__wrapper')
        .hasClass('iot--time-picker__wrapper--show-underline')
    ).toEqual(true);
    upButton.simulate('mouseover');
    upButton.simulate('mouseout');
    upButton.simulate('blur');
    expect(
      wrapper
        .find('.iot--time-picker__wrapper')
        .hasClass('iot--time-picker__wrapper--show-underline')
    ).toEqual(false);

    wrapper.find('input').simulate('keydown', { keyCode: keyCodes.DOWN });
    wrapper.find('input').simulate('keydown', { keyCode: keyCodes.UP });
    wrapper.find('input').simulate('keydown', { keyCode: keyCodes.ESC });
    expect(wrapper.find('input').props().value).toEqual('01:00');
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 0);

    downButton.simulate('focus');
    downButton.simulate('click');
    expect(wrapper.find('input').props().value).toEqual('00:00');
    downButton.simulate('mouseover');
    downButton.simulate('mouseout');
    downButton.simulate('blur');
  });

  test('onClick should be called', () => {
    const wrapper = mount(<TimePickerSpinner {...timePickerProps} spinner />);
    wrapper.find('input').simulate('click');
    expect(timePickerProps.onClick).toHaveBeenCalled();
  });

  test('onChange should be called', () => {
    const wrapper = mount(<TimePickerSpinner {...timePickerProps} spinner />);
    wrapper.find('input').simulate('change');
    expect(timePickerProps.onChange).toHaveBeenCalled();
  });

  test('12-hour picker', () => {
    const wrapper = mount(
      <TimePickerSpinner {...timePickerProps} value="12:00" spinner is12hour />
    );
    wrapper
      .find('.iot--time-picker__controls--btn.up-icon')
      .first()
      .simulate('click');
    expect(wrapper.find('input').props().value).toEqual('00:00');
  });

  test('default timeGroup to minutes', () => {
    const wrapper = mount(
      <TimePickerSpinner
        {...timePickerProps}
        value="12:00"
        spinner
        defaultTimegroup={TIMEGROUPS.MINUTES}
      />
    );
    wrapper
      .find('.iot--time-picker__controls--btn.up-icon')
      .first()
      .simulate('click');
    expect(wrapper.find('input').props().value).toEqual('12:01');
  });

  test('flip minutes back to 59 after hitting 0', () => {
    const wrapper = mount(
      <TimePickerSpinner
        {...timePickerProps}
        value="12:00"
        spinner
        defaultTimegroup={TIMEGROUPS.MINUTES}
      />
    );
    wrapper
      .find('.iot--time-picker__controls--btn.down-icon')
      .first()
      .simulate('click');
    expect(wrapper.find('input').props().value).toEqual('12:59');
  });
});
