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
    const onClearErrors = jest.fn();
    const wrapper = mount(<BaseModal {...modalProps} onClearErrors={onClearErrors} />);
    wrapper.instance().handleClearError();
    expect(onClearErrors).toHaveBeenCalledTimes(1);
  });
});
