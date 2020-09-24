import { mount } from 'enzyme';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { Loading } from 'carbon-components-react';

import WizardModal from './WizardModal';

const commonWizardProps = {
  isClickable: true,
  onSubmit: () => console.log('submit'),
  onClose: () => console.log('close'),
};

describe('WizardModal', () => {
  it('handleNext', () => {
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
  it('validation', () => {
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
  it('submit', () => {
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
  it('footer and buttons', () => {
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
  it('sendingData', () => {
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
  it('clicking on previous button or previous step will call onBack', () => {
    const callBack = jest.fn();

    const getStep = (step) => screen.getByTestId(`iot--progress-step-button-main-${step}`);

    render(<WizardModal 
      {...commonWizardProps} 
      onBack={callBack}
        steps={[
        { label: 'step1', content: 'page 1' },
        { label: 'step2', content: 'page 2' },
        { label: 'step3', content: 'page 3' },
      ]} 
    />);

      // Go to second step
      getStep('step2').click();

      // clicking previous step in progressIndicator will call callBack
      userEvent.click(getStep('step1'));
      expect(callBack).toHaveBeenCalled();
      expect(callBack.mock.calls[0][0]).toBe(0);

      // Go to third step
      getStep('step3').click();

      // clicking on previous button will trigger onBack
      userEvent.click(screen.getByText('Previous'));
      expect(callBack).toHaveBeenCalledTimes(2);
      expect(callBack.mock.calls[1][0]).toBe(1);
  });
});
