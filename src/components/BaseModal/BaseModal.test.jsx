import { mount } from 'enzyme';
import React from 'react';

import * as utilityFunctions from '../../utils/componentUtilityFunctions';

import BaseModal from './BaseModal';

jest.mock('../../utils/componentUtilityFunctions');

const modalProps = {
  onClose: () => jest.fn(),
};

describe('BaseModal', () => {
  test('invalid field should be scrolled into view', () => {
    const wrapper = mount(<BaseModal {...modalProps} />);
    wrapper.setProps({ invalid: true, submitFailed: true });
    expect(utilityFunctions.scrollErrorIntoView).toHaveBeenCalledTimes(1);
  });
  test('errors should be cleared', () => {
    const onClearError = jest.fn();
    const wrapper = mount(<BaseModal {...modalProps} error="error" onClearError={onClearError} />);
    wrapper
      .find('.bx--inline-notification__close-button')
      .at(0)
      .simulate('click');
    expect(onClearError).toHaveBeenCalledTimes(1);
  });
  test('errors should not cause error', () => {
    const wrapper = mount(<BaseModal {...modalProps} error="error" />);
    wrapper
      .find('.bx--inline-notification__close-button')
      .at(0)
      .simulate('click');
    // the close button shouldn't cause exception
    expect(wrapper).toBeDefined();
  });
  test('clicking outside basemodal does not close it', () => {
    const wrapper = mount(<BaseModal {...modalProps} />);
    // Have to return false
    expect(wrapper.instance().doNotClose()).toEqual(false);
  });
});
