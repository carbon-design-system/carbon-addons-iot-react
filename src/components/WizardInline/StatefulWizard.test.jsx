import { mount } from 'enzyme';
import React from 'react';

import { itemsAndComponents } from './WizardInline.story';
import StatefulWizardInline from './StatefulWizardInline';

const commonWizardProps = {
  title: 'My Wizard',
  items: itemsAndComponents,
  currentItemId: itemsAndComponents[0].id,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
};

describe('StatefulWizardInline', () => {
  test('onNext', () => {
    const mockNext = jest.fn();
    const wrapper = mount(<StatefulWizardInline {...commonWizardProps} onNext={mockNext} />);
    const cancelAndNextButtons = wrapper.find('.bx--btn');
    expect(cancelAndNextButtons).toHaveLength(2);
    cancelAndNextButtons.at(1).simulate('click');
    expect(mockNext).toHaveBeenCalled();
  });
  test('onClose', () => {
    const mockClose = jest.fn();
    const wrapper = mount(<StatefulWizardInline {...commonWizardProps} onClose={mockClose} />);
    const cancelAndNextButtons = wrapper.find('.bx--btn');
    expect(cancelAndNextButtons).toHaveLength(2);
    cancelAndNextButtons.at(0).simulate('click');
    expect(mockClose).toHaveBeenCalled();
  });
  test('onBack', () => {
    const mockBack = jest.fn();
    const wrapper = mount(
      <StatefulWizardInline
        {...commonWizardProps}
        currentItemId={itemsAndComponents[1].id}
        onBack={mockBack}
      />
    );
    const cancelBackAndNextButtons = wrapper.find('.bx--btn');
    expect(cancelBackAndNextButtons).toHaveLength(3);
    cancelBackAndNextButtons.at(1).simulate('click');
    expect(mockBack).toHaveBeenCalled();
  });
});
