import React from 'react';
import { shallow } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';

import PageWizard from './PageWizard';
import { content, StepValidation } from './PageWizard.story';

describe('PageWizard tests', () => {
  test('error states', () => {
    const i18n = {
      close: 'Close',
    };
    const mocks = {
      onClearError: jest.fn(),
    };
    const { getByText, queryByText, getAllByTitle } = render(
      <PageWizard error="My Custom Error" currentStepId="step1" {...mocks} i18n={i18n}>
        {content}
      </PageWizard>
    );
    // The error should show
    expect(getByText('My Custom Error')).toBeDefined();
    // The first close is the SVG
    fireEvent.click(getAllByTitle(i18n.close)[1]);
    // The error should go away
    expect(mocks.onClearError).toHaveBeenCalledTimes(1);
    expect(queryByText('My Custom Error')).toBeNull();
  });
  test('currentStepId prop', () => {
    const wrapper = shallow(<PageWizard currentStepId="step1">{content}</PageWizard>);
    expect(wrapper.find('PageWizardStep').prop('id')).toEqual('step1');
  });
  test('button events during first step (no validation)', () => {
    const mocks = {
      onNext: jest.fn(),
      onClose: jest.fn(),
    };
    const i18n = {
      next: 'Next',
      cancel: 'Cancel',
    };
    const { getByText } = render(
      <PageWizard currentStepId="step1" {...mocks} i18n={i18n}>
        {content}
      </PageWizard>
    );
    fireEvent.click(getByText(i18n.cancel));
    expect(mocks.onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(getByText(i18n.next));
    expect(mocks.onNext).toHaveBeenCalledTimes(1);
  });

  test('button events during middle step (no validation)', () => {
    const mocks = {
      onBack: jest.fn(),
      onNext: jest.fn(),
    };
    const i18n = {
      back: 'Back',
      next: 'Next',
    };
    const { getByText } = render(
      <PageWizard currentStepId="step2" {...mocks} i18n={i18n}>
        {content}
      </PageWizard>
    );
    fireEvent.click(getByText(i18n.back));
    expect(mocks.onBack).toHaveBeenCalledTimes(1);
    fireEvent.click(getByText(i18n.next));
    expect(mocks.onNext).toHaveBeenCalledTimes(1);
  });

  test('button events during final step (no validation)', () => {
    const mocks = {
      onBack: jest.fn(),
      onSubmit: jest.fn(),
    };
    const i18n = {
      back: 'Back',
      submit: 'Submit',
    };
    const { getByText } = render(
      <PageWizard currentStepId="step3" {...mocks} i18n={i18n}>
        {content}
      </PageWizard>
    );
    fireEvent.click(getByText(i18n.back));
    expect(mocks.onBack).toHaveBeenCalledTimes(1);
    fireEvent.click(getByText(i18n.submit));
    expect(mocks.onSubmit).toHaveBeenCalledTimes(1);
  });

  test('validation in first step', () => {
    const mocks = {
      onNext: jest.fn(),
    };
    const i18n = {
      back: 'Back',
      submit: 'Submit',
      next: 'Next',
      cancel: 'Cancel',
    };
    const { getByTestId, getByText } = render(
      <PageWizard currentStepId="step1" {...mocks} i18n={i18n}>
        <StepValidation id="step1" label="Step with validation" />
        {content[1]}
        {content[2]}
      </PageWizard>
    );
    // validation should fail if only first name is entered
    fireEvent.change(getByTestId('first-name'), { target: { value: 'First Name' } });
    fireEvent.click(getByText(i18n.next));
    expect(mocks.onNext).toHaveBeenCalledTimes(0);

    // validation should succeed if both fields are entered
    fireEvent.change(getByTestId('last-name'), { target: { value: 'Last Name' } });
    fireEvent.click(getByText(i18n.next));
    expect(mocks.onNext).toHaveBeenCalledTimes(1);
  });
});
