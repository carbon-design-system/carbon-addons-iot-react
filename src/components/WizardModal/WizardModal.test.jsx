import { mount } from 'enzyme';
import React from 'react';
import { Loading } from 'carbon-components-react';

import WizardModal from './WizardModal';

const commonWizardProps = {
  onSubmit: () => console.log('submit'),
  onClose: () => console.log('close'),
};

describe('WizardModal', () => {
  test('handleNext', () => {
    const mockValidateStepFunction = jest.fn();
    const wrapper = mount(
      <WizardModal
        {...commonWizardProps}
        steps={[
          { label: 'step1', content: 'page 1', onValidate: mockValidateStepFunction },
          { label: 'step2', content: 'page 2', onValidate: mockValidateStepFunction },
          { label: 'step3', content: 'page 3', onValidate: mockValidateStepFunction },
        ]}
      />
    );
    // trigger next
    wrapper.instance().handleNext();
    expect(wrapper.state('step')).toEqual(1);
    expect(mockValidateStepFunction).toHaveBeenCalled();

    mockValidateStepFunction.mockClear();

    // trigger previous
    wrapper.instance().handlePrevious();
    expect(wrapper.state('step')).toEqual(0);
    expect(mockValidateStepFunction).not.toHaveBeenCalled();
  });
  test('validation', () => {
    const wrapper = mount(
      <WizardModal
        {...commonWizardProps}
        steps={[
          { label: 'step1', content: 'page 1' },
          { label: 'step2', content: 'page 2', onValidate: () => false },
          { label: 'step3', content: 'page 3' },
        ]}
      />
    );
    // trigger next
    wrapper.instance().handleNext();
    // step should advance without validation function
    expect(wrapper.state('step')).toEqual(1);

    // trigger next
    wrapper.instance().handleNext();
    // step should NOT advance if validation returns false
    expect(wrapper.state('step')).toEqual(1);

    // trigger next by clicking
    wrapper.instance().handleClick(2);
    // step should NOT advance if validation returns false
    expect(wrapper.state('step')).toEqual(1);

    // trigger next by clicking
    wrapper.instance().handleClick(0);
    // step be allowed to go backwards
    expect(wrapper.state('step')).toEqual(0);
  });
  test('submit', () => {
    const mockValidateStepFunction = jest.fn();
    const wrapper = mount(
      <WizardModal
        {...commonWizardProps}
        steps={[
          { label: 'step1', content: 'page 1' },
          { label: 'step2', content: 'page 2' },
          { label: 'step3', content: 'page 3', onValidate: mockValidateStepFunction },
        ]}
      />
    );
    // Advance to last panel should have a submit button
    wrapper.setState({ step: 2 });

    // Close
    expect(wrapper.find('.bx--modal-close')).toHaveLength(1);

    // Previous
    expect(wrapper.find('.bx--btn--secondary')).toHaveLength(1);

    // Submit button
    expect(wrapper.find('.bx--btn--primary')).toHaveLength(1);

    // Submit button should validate the last page
    wrapper.instance().handleSubmit();
    expect(mockValidateStepFunction).toHaveBeenCalled();
  });
  test('footer and buttons', () => {
    const wrapper = mount(
      <WizardModal
        {...commonWizardProps}
        steps={[
          { label: 'step1', content: 'page 1' },
          { label: 'step2', content: 'page 2' },
          { label: 'step3', content: 'page 3' },
        ]}
        footer={{ leftContent: 'Hi there' }}
      />
    );
    // Close
    expect(wrapper.find('.bx--modal-close')).toHaveLength(1);

    // Cancel
    expect(wrapper.find('.bx--btn--secondary')).toHaveLength(1);

    // Submit button
    expect(wrapper.find('.bx--btn--primary')).toHaveLength(1);

    // Close Next Previous and Cancel
    wrapper.setState({ step: 1 });
    // Close
    expect(wrapper.find('.bx--modal-close')).toHaveLength(1);

    // Previous
    expect(wrapper.find('.bx--btn--secondary')).toHaveLength(1);

    // Submit button
    expect(wrapper.find('.bx--btn--primary')).toHaveLength(1);
    // Close Previous Submit and Cancel
    // Close
    expect(wrapper.find('.bx--modal-close')).toHaveLength(1);

    // Previous
    expect(wrapper.find('.bx--btn--secondary')).toHaveLength(1);

    // Submit button
    expect(wrapper.find('.bx--btn--primary')).toHaveLength(1);
    wrapper.setState({ step: 2 });
  });
  test('sendingData', () => {
    const wrapper = mount(
      <WizardModal
        {...commonWizardProps}
        steps={[
          { label: 'step1', content: 'page 1' },
          { label: 'step2', content: 'page 2' },
          { label: 'step3', content: 'page 3' },
        ]}
        sendingData
      />
    );

    // Should show Loading button
    wrapper.setState({ step: 2 });
    expect(wrapper.find(Loading)).toHaveLength(1);
  });
});
