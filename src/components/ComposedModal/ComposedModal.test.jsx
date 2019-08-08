import { mount } from 'enzyme';
import React from 'react';

import * as utilityFunctions from '../../utils/componentUtilityFunctions';

import ComposedModal from './ComposedModal';

jest.mock('../../utils/componentUtilityFunctions');

const modalProps = {
  onClose: () => jest.fn(),
};

describe('ComposedModal', () => {
  test('invalid field should be scrolled into view', () => {
    const wrapper = mount(<ComposedModal {...modalProps} />);
    wrapper.setProps({ invalid: true, submitFailed: true });
    expect(utilityFunctions.scrollErrorIntoView).toHaveBeenCalledTimes(1);
  });
  test('errors should be cleared', () => {
    const onClearError = jest.fn();
    const wrapper = mount(
      <ComposedModal {...modalProps} error="error" onClearError={onClearError} />
    );
    wrapper
      .find('.bx--inline-notification__close-button')
      .at(0)
      .simulate('click');
    expect(onClearError).toHaveBeenCalledTimes(1);
  });
  test('errors should not cause error', () => {
    const wrapper = mount(<ComposedModal {...modalProps} error="error" />);
    wrapper
      .find('.bx--inline-notification__close-button')
      .at(0)
      .simulate('click');
    // the close button shouldn't cause exception
    expect(wrapper).toBeDefined();
  });
  test('clicking outside Composedmodal does not close it', () => {
    const wrapper = mount(<ComposedModal {...modalProps} />);
    // Have to return false
    expect(wrapper.instance().doNotClose()).toEqual(false);
  });
});
