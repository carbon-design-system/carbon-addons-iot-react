/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import List16 from '@carbon/icons-react/lib/list/16';

import { settings } from '../../constants/Settings';

import IconSwitch from './IconSwitch';

const { prefix, iotPrefix } = settings;

describe('IconSwitch', () => {
  describe('component rendering', () => {
    const buttonWrapper = mount(
      <IconSwitch name="blah" size="default" renderIcon={List16} text="test" index={0} />
    );

    it('should have the expected text', () => {
      expect(buttonWrapper.find('span').text()).toEqual('test');
    });

    it('label should have the expected class', () => {
      const className = `${prefix}--assistive-text`;
      expect(buttonWrapper.find('span').hasClass(className)).toEqual(true);
    });

    it('should have the expected class', () => {
      const cls = `${iotPrefix}--icon-switch--default`;
      expect(buttonWrapper.find('button').hasClass(cls)).toEqual(true);
    });

    it('should have unselected class', () => {
      const unselectedClass = `${iotPrefix}--icon-switch--unselected`;
      expect(buttonWrapper.find('button').hasClass(unselectedClass)).toEqual(true);
    });

    it('should NOT have unselected class when selected is set to true', () => {
      const unselectedClass = `${iotPrefix}--icon-switch--unselected`;
      const selected = true;
      buttonWrapper.setProps({ selected });
      expect(buttonWrapper.find('button').hasClass(unselectedClass)).toEqual(false);
    });
  });

  describe('events', () => {
    const index = 1;
    const name = 'first';
    const text = 'test';
    const spaceKey = 32;
    const enterKey = 13;
    let buttonOnClick;
    let buttonOnKey;
    let buttonWrapper;

    beforeEach(() => {
      buttonOnClick = jest.fn();
      buttonOnKey = jest.fn();
      buttonWrapper = mount(
        <IconSwitch
          name={name}
          size="default"
          renderIcon={List16}
          onClick={buttonOnClick}
          onKeyDown={buttonOnKey}
          text={text}
          index={index}
        />
      );
    });

    it('should invoke button onClick handler', () => {
      buttonWrapper.simulate('click', { preventDefault() {} });
      expect(buttonOnClick).toHaveBeenCalledWith({ index, name, text });
    });

    it('should invoke button onKeyDown handler when SPACE', () => {
      buttonWrapper.simulate('keydown', { which: spaceKey });
      expect(buttonOnKey).toHaveBeenCalledWith({ index, name, text });
    });
    it('should invoke button onKeyDown handler when ENTER', () => {
      buttonWrapper.simulate('keydown', { which: enterKey });
      expect(buttonOnKey).toHaveBeenCalledWith({ index, name, text });
    });
    it('should NOT invoke button onKeyDown handler when NEITHER SPACE NOR ENTER', () => {
      buttonWrapper.simulate('keydown', { which: 'L' });
      expect(buttonOnKey).toHaveBeenCalledTimes(0);
    });
  });
});
