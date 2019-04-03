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
    const wrapper = mount(<BaseModal {...modalProps} onClearError={onClearError} />);
    wrapper.instance().handleClearError();
    expect(onClearError).toHaveBeenCalledTimes(1);
  });
});
