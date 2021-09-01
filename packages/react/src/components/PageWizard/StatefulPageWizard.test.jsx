import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import StatefulPageWizard from './StatefulPageWizard';
import { content, StepValidationWizard } from './PageWizard.story';
import PageWizardStepTitle from './PageWizardStep/PageWizardStepTitle';
import PageWizardStep from './PageWizardStep/PageWizardStep';

describe('StatefulPageWizard', () => {
  it('button events during first step (no validation)', () => {
    const mocks = {
      onNext: jest.fn(),
      onClose: jest.fn(),
      onSubmit: jest.fn(),
      onClearError: jest.fn(),
    };
    const i18n = {
      next: 'Next',
      cancel: 'Cancel',
    };

    render(
      <StatefulPageWizard currentStepId="step1" {...mocks} i18n={i18n}>
        {content}
      </StatefulPageWizard>
    );

    // click on Cancel
    fireEvent.click(screen.getByText(i18n.cancel));
    expect(mocks.onClose).toHaveBeenCalledTimes(1);

    // click on Next
    fireEvent.click(screen.getByText(i18n.next));
    expect(mocks.onNext).toHaveBeenCalledTimes(1);
  });

  it('button events during second step (no validation)', () => {
    const mocks = {
      onNext: jest.fn(),
      onBack: jest.fn(),
      onSubmit: jest.fn(),
      onClearError: jest.fn(),
      onClose: jest.fn(),
    };
    const i18n = {
      next: 'Next',
      back: 'Back',
    };

    render(
      <StatefulPageWizard currentStepId="step2" {...mocks} i18n={i18n}>
        {content}
      </StatefulPageWizard>
    );

    // go back to step 1
    fireEvent.click(screen.getByText(i18n.back));
    expect(mocks.onBack).toHaveBeenCalledTimes(1);

    // reset to step 2
    fireEvent.click(screen.getByText(i18n.next));
    expect(mocks.onNext).toHaveBeenCalledTimes(1);

    // go to step 3
    fireEvent.click(screen.getByText(i18n.next));
    expect(mocks.onNext).toHaveBeenCalledTimes(2);
  });

  it('button events during final step (no validation)', () => {
    const mocks = {
      onBack: jest.fn(),
      onNext: jest.fn(),
      onSubmit: jest.fn(),
      onClearError: jest.fn(),
      onClose: jest.fn(),
    };
    const i18n = {
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
    };

    render(
      <StatefulPageWizard currentStepId="step5" {...mocks} i18n={i18n}>
        {content}
      </StatefulPageWizard>
    );

    // go back to step 4
    fireEvent.click(screen.getByText(i18n.back));
    expect(mocks.onBack).toHaveBeenCalledTimes(1);

    // reset to step 5
    fireEvent.click(screen.getByText(i18n.next));
    expect(mocks.onNext).toHaveBeenCalledTimes(1);

    // click on Submit
    fireEvent.click(screen.getByText(i18n.submit));
    expect(mocks.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('step indicator to go to a specific step', () => {
    const mocks = {
      isClickable: true,
      setStep: jest.fn(),
      onClose: jest.fn(),
      onSubmit: jest.fn(),
      onClearError: jest.fn(),
    };

    render(
      <StatefulPageWizard currentStepId="step5" {...mocks}>
        {content}
      </StatefulPageWizard>
    );

    // go back to step 1
    fireEvent.click(screen.getByText('First Step'));
    expect(mocks.setStep).toHaveBeenCalledTimes(1);
  });

  it('without setting currentStepId', () => {
    const mocks = {
      isClickable: true,
      setStep: jest.fn(),
      onClose: jest.fn(),
      onSubmit: jest.fn(),
      onClearError: jest.fn(),
    };

    render(<StatefulPageWizard {...mocks}>{content}</StatefulPageWizard>);

    // go back to fourth step
    fireEvent.click(screen.getByText('Fourth Step'));
    expect(mocks.setStep).toHaveBeenCalledTimes(1);
  });

  it('not passing onBack function does not blow things up', () => {
    const mocks = {
      onClose: jest.fn(),
      onClearError: jest.fn(),
      onSubmit: jest.fn(),
    };

    const i18n = {
      back: 'Back',
      next: 'Next',
    };
    const renderedElement = render(
      <StatefulPageWizard currentStepId="step2" i18n={i18n} {...mocks} hasStickyFooter>
        {content}
      </StatefulPageWizard>
    );
    fireEvent.click(screen.getByText(i18n.back));
    fireEvent.click(screen.getByText(i18n.next));
    expect(renderedElement.container.innerHTML).toBeTruthy();
  });

  it('clicking on step indicator should validate before going to step', () => {
    render(<StepValidationWizard />);

    // check that the next step won't happen if inputs aren't filled
    fireEvent.click(screen.getByText('Second Step'));
    expect(screen.getByText('First name and Last name cannot be empty')).toBeTruthy();

    // fill in inputs, then try to go to step 2
    fireEvent.change(screen.getByLabelText('First name'), {
      target: { value: 'john' },
    });
    fireEvent.change(screen.getByLabelText('Last name'), {
      target: { value: 'smith' },
    });
    fireEvent.click(screen.getByText('Second Step'));
    expect(screen.queryByText('First name and Last name cannot be empty')).toBeFalsy();
  });

  it('should not move to next or previous step if disabled', () => {
    const mocks = {
      onNext: jest.fn(),
      onClose: jest.fn(),
      onSubmit: jest.fn(),
      onClearError: jest.fn(),
      onBack: jest.fn(),
    };

    render(
      <StatefulPageWizard currentStepId="step2" {...mocks}>
        <PageWizardStep id="step1" label="First Step" key="step1" disabled>
          <PageWizardStepTitle>Step 1: Define the data</PageWizardStepTitle>
        </PageWizardStep>
        <PageWizardStep id="step2" key="step2" label="Second Step">
          <PageWizardStepTitle>Step 2: Pick the contents</PageWizardStepTitle>
        </PageWizardStep>
        <PageWizardStep id="step3" key="step3" label="Third Step" disabled>
          <PageWizardStepTitle>Step 3: Finish</PageWizardStepTitle>
        </PageWizardStep>
      </StatefulPageWizard>
    );

    userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(mocks.onBack).toHaveBeenCalledWith('step2');
    userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(mocks.onBack).toHaveBeenCalledWith('step2');
  });
});
