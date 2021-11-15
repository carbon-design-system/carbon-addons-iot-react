import React from 'react';
import { shallow } from 'enzyme';
import { render, fireEvent, screen } from '@testing-library/react';

import { settings } from '../../constants/Settings';

import PageWizard, { defaultProps } from './PageWizard';
import { content, StepValidation } from './PageWizard.story';

const { iotPrefix } = settings;

describe('PageWizard', () => {
  const i18n = {
    close: 'Close',
    next: 'Next',
    cancel: 'Cancel',
    back: 'Back',
    submit: 'Submit',
  };
  const mocks = {
    onClearError: jest.fn(),
    onSubmit: jest.fn(),
    onClose: jest.fn(),
    onNext: jest.fn(),
    onBack: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be selectable by testId', () => {
    render(
      <PageWizard currentStepId="step1" {...mocks} testId="page_wizard">
        {content}
      </PageWizard>
    );
    expect(screen.getByTestId('page_wizard')).toBeDefined();
    expect(screen.getByTestId('page_wizard-content')).toBeDefined();
  });

  it('error states', () => {
    render(
      <PageWizard error="My Custom Error" currentStepId="step1" {...mocks} i18n={i18n}>
        {content}
      </PageWizard>
    );
    // The error should show
    expect(screen.getByText('My Custom Error')).toBeDefined();
    // The first close is the SVG
    fireEvent.click(screen.getAllByTitle(i18n.close)[0]);
    // The error should go away
    expect(mocks.onClearError).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('My Custom Error')).toBeNull();
  });

  it('currentStepId prop', () => {
    const wrapper = shallow(
      <PageWizard currentStepId="step1" {...mocks}>
        {content}
      </PageWizard>
    );
    expect(wrapper.find('PageWizardStep').prop('id')).toEqual('step1');
  });

  it('button events during first step (no validation)', () => {
    render(
      <PageWizard currentStepId="step1" {...mocks} i18n={i18n}>
        {content}
      </PageWizard>
    );
    fireEvent.click(screen.getByText(i18n.cancel));
    expect(mocks.onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText(i18n.next));
    expect(mocks.onNext).toHaveBeenCalledTimes(1);
  });

  it('button events during middle step (no validation)', () => {
    render(
      <PageWizard currentStepId="step2" {...mocks} i18n={i18n}>
        {content}
      </PageWizard>
    );
    fireEvent.click(screen.getByText(i18n.back));
    expect(mocks.onBack).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText(i18n.next));
    expect(mocks.onNext).toHaveBeenCalledTimes(1);
  });

  it('button events during final step (no validation)', () => {
    render(
      <PageWizard currentStepId="step5" {...mocks} i18n={i18n}>
        {content}
      </PageWizard>
    );
    fireEvent.click(screen.getByText(i18n.back));
    expect(mocks.onBack).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText(i18n.submit));
    expect(mocks.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('validation in first step', () => {
    render(
      <PageWizard currentStepId="step1" {...mocks} i18n={i18n} isProgressIndicatorVertical={false}>
        <StepValidation id="step1" label="Step with validation" />
        {content[1]}
        {content[2]}
      </PageWizard>
    );
    // validation should fail if only first name is entered
    fireEvent.change(screen.getByTestId('first-name'), {
      target: { value: 'First Name' },
    });
    fireEvent.click(screen.getByText(i18n.next));
    expect(mocks.onNext).toHaveBeenCalledTimes(0);

    // validation should succeed if both fields are entered
    fireEvent.change(screen.getByTestId('last-name'), {
      target: { value: 'Last Name' },
    });
    fireEvent.click(screen.getByText(i18n.next));
    expect(mocks.onNext).toHaveBeenCalledTimes(1);
  });

  it('progress indicator should not render if there is only 1 step', () => {
    const wrapper = shallow(
      <PageWizard currentStepId="step1" {...mocks}>
        {content[0]}
      </PageWizard>
    );
    expect(wrapper.find(`[data-testid="${iotPrefix}--progress-indicator-testid"]`)).toHaveLength(0);
  });

  it('i18n string tests', () => {
    const i18nTest = {
      back: 'back',
      next: 'next',
      cancel: 'cancel',
      submit: 'submit',
      close: 'close',
    };

    const i18nDefault = defaultProps.i18n;
    const { rerender } = render(
      <PageWizard i18n={i18nTest} currentStepId="step1" error="error" {...mocks}>
        {content}
      </PageWizard>
    );

    expect(screen.getByText(i18nTest.next)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.cancel)).toBeInTheDocument();
    expect(screen.getByLabelText(i18nTest.close)).toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.next)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.cancel)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefault.close)).not.toBeInTheDocument();

    rerender(
      <PageWizard currentStepId="step5" i18n={i18nTest} {...mocks}>
        {content}
      </PageWizard>
    );
    expect(screen.getByText(i18nTest.back)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.submit)).toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.back)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.submit)).not.toBeInTheDocument();
  });
});
