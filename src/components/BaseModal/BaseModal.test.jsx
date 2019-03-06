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
    const mockClearSubmitErrors = jest.fn();
    const mockOnClearDialogErrors = jest.fn();
    const wrapper = mount(
      <BaseModal
        {...modalProps}
        clearSubmitErrors={mockClearSubmitErrors}
        onClearDialogErrors={mockOnClearDialogErrors}
      />
    );
    wrapper.instance().handleClearError();
    expect(mockClearSubmitErrors).toHaveBeenCalledTimes(1);
    expect(mockOnClearDialogErrors).toHaveBeenCalledTimes(1);
  });
});
