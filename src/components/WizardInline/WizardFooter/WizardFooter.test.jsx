import React from 'react';
import { mount } from 'enzyme';

import WizardFooter from './WizardFooter';

const mockNext = jest.fn();
const mockBack = jest.fn();
const mockSubmit = jest.fn();
const mockCancel = jest.fn();

const commonFooterProps = {
  onNext: mockNext,
  onBack: mockBack,
  onSubmit: mockSubmit,
  onCancel: mockCancel,
  backLabel: 'Back',
  nextLabel: 'Next',
  cancelLabel: 'Cancel',
  submitLabel: 'Add',
};

describe('WizardFooter', () => {
  test('check footer buttons', () => {
    const cancelAndNextButtons = mount(<WizardFooter {...commonFooterProps} hasPrev={false} />);
    // should only have Cancel and Next button
    expect(cancelAndNextButtons.find('.bx--btn')).toHaveLength(2);
    const backAndNextButtons = mount(<WizardFooter {...commonFooterProps} />);
    // should have Back and Next button
    expect(backAndNextButtons.find('.bx--btn')).toHaveLength(2);
    const backAndAddButtons = mount(<WizardFooter {...commonFooterProps} hasNext={false} />);
    // should have Back and Add button
    expect(backAndAddButtons.find('.bx--btn')).toHaveLength(2);
    expect(
      backAndAddButtons
        .find('.bx--btn')
        .at(1)
        .text()
    ).toContain('Add');
  });
});
