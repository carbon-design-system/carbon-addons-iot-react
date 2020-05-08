import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import StatefulPageWizard from './StatefulPageWizard';
import { content } from './PageWizard.story';

describe('StatefulPageWizard', () => {
  it('button events during first step (no validation)', () => {
    const mocks = {
      onNext: jest.fn(),
      onClose: jest.fn(),
    };
    const i18n = {
      next: 'Next',
      cancel: 'Cancel',
    };

    const { getByText } = render(
      <StatefulPageWizard currentStepId="step1" {...mocks} i18n={i18n}>
        {content}
      </StatefulPageWizard>
    );

    // click on Cancel
    fireEvent.click(getByText(i18n.cancel));
    expect(mocks.onClose).toHaveBeenCalledTimes(1);

    // click on Next
    fireEvent.click(getByText(i18n.next));
    expect(mocks.onNext).toHaveBeenCalledTimes(1);
  });

  it('button events during second step (no validation)', () => {
    const mocks = {
      onNext: jest.fn(),
      onBack: jest.fn(),
    };
    const i18n = {
      next: 'Next',
      back: 'Back',
    };

    const { getByText } = render(
      <StatefulPageWizard currentStepId="step2" {...mocks} i18n={i18n}>
        {content}
      </StatefulPageWizard>
    );

    // go back to step 1
    fireEvent.click(getByText(i18n.back));
    expect(mocks.onBack).toHaveBeenCalledTimes(1);

    // reset to step 2
    fireEvent.click(getByText(i18n.next));
    expect(mocks.onNext).toHaveBeenCalledTimes(1);

    // go to step 3
    fireEvent.click(getByText(i18n.next));
    expect(mocks.onNext).toHaveBeenCalledTimes(2);
  });

  it('button events during final step (no validation)', () => {
    const mocks = {
      onBack: jest.fn(),
      onNext: jest.fn(),
      onSubmit: jest.fn(),
    };
    const i18n = {
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
    };

    const { getByText } = render(
      <StatefulPageWizard currentStepId="step3" {...mocks} i18n={i18n}>
        {content}
      </StatefulPageWizard>
    );

    // go back to step 2
    fireEvent.click(getByText(i18n.back));
    expect(mocks.onBack).toHaveBeenCalledTimes(1);

    // reset to step 3
    fireEvent.click(getByText(i18n.next));
    expect(mocks.onNext).toHaveBeenCalledTimes(1);

    // click on Submit
    fireEvent.click(getByText(i18n.submit));
    expect(mocks.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('step indicator to go to a specific step', () => {
    const mocks = {
      setStep: jest.fn(),
    };

    const { getByText } = render(
      <StatefulPageWizard currentStepId="step3" {...mocks}>
        {content}
      </StatefulPageWizard>
    );

    // go back to step 1
    fireEvent.click(getByText('Step 1'));
    expect(mocks.setStep).toHaveBeenCalledTimes(1);
  });

  it('without setting currentStepId', () => {
    const mocks = {
      setStep: jest.fn(),
    };

    const { getByText } = render(<StatefulPageWizard {...mocks}>{content}</StatefulPageWizard>);

    // go back to step 1
    fireEvent.click(getByText('Step 2'));
    expect(mocks.setStep).toHaveBeenCalledTimes(1);
  });

  it('not passing onBack function does not blow things up', () => {
    const i18n = {
      back: 'Back',
      next: 'Next',
    };
    const renderedElement = render(
      <StatefulPageWizard currentStepId="step2" i18n={i18n} hasStickyFooter>
        {content}
      </StatefulPageWizard>
    );
    fireEvent.click(renderedElement.getByText(i18n.back));
    fireEvent.click(renderedElement.getByText(i18n.next));
    expect(renderedElement.container.innerHTML).toBeTruthy();
  });
});
