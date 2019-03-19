import { mount } from 'enzyme';
import React from 'react';

import { itemsAndComponents } from './WizardInline.story';
import StatefulWizardInline from './StatefulWizardInline';

describe('StatefulWizardInline', () => {
  test('onNext', () => {
    const mockNext = jest.fn();
    const wrapper = mount(
      <StatefulWizardInline
        title="My Wizard"
        items={itemsAndComponents}
        currentItemId={itemsAndComponents[0].id}
        onNext={mockNext}
      />
    );
    const cancelAndNextButtons = wrapper.find('.bx--btn');
    expect(cancelAndNextButtons).toHaveLength(2);
    cancelAndNextButtons.at(1).simulate('click');
    expect(mockNext).toHaveBeenCalled();
  });
  test('onClose', () => {
    const mockClose = jest.fn();
    const wrapper = mount(
      <StatefulWizardInline
        title="My Wizard"
        items={itemsAndComponents}
        currentItemId={itemsAndComponents[0].id}
        onClose={mockClose}
      />
    );
    const cancelAndNextButtons = wrapper.find('.bx--btn');
    expect(cancelAndNextButtons).toHaveLength(2);
    cancelAndNextButtons.at(0).simulate('click');
    expect(mockClose).toHaveBeenCalled();
  });
  test('onBack', () => {
    const mockBack = jest.fn();
    const wrapper = mount(
      <StatefulWizardInline
        title="My Wizard"
        items={itemsAndComponents}
        currentItemId={itemsAndComponents[1].id}
        onBack={mockBack}
      />
    );
    const backAndNextButtons = wrapper.find('.bx--btn');
    expect(backAndNextButtons).toHaveLength(2);
    backAndNextButtons.at(0).simulate('click');
    expect(mockBack).toHaveBeenCalled();
  });
});
