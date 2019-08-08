import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import WizardModal from './WizardModal';

const StyledWizard = styled(WizardModal)`
  .WizardInline-custom-footer-content {
    padding: 1rem;
  }
`;

const commonWizardProps = {
  onSubmit: action('submit'),
  onClose: action('close'),
};

storiesOf('Watson IoT|WizardModal', module)
  .addParameters({
    info: `
  Extends ComposedModal to add Carbon's ProgressIndicator and Wizard pages and local state.  Refer to the ComposedModal component for additional props that can be passed
  `,
  })
  .add('basic wizard modal', () => (
    <WizardModal
      header={{
        label: 'Basic Wizard',
        title: 'Gimme 3 Steps',
      }}
      steps={[
        { label: 'step1', content: 'page 1', onValidate: action('validateStep1') },
        { label: 'step2', content: 'page 2', onValidate: action('validateStep2') },
        { label: 'step3', content: 'page 3', onValidate: action('validateStep3') },
      ]}
      {...commonWizardProps}
    />
  ))
  .add('custom footer', () => (
    <StyledWizard
      header={{
        label: 'Wizard With Custom Footer ',
        title: 'Gimme 3 Steps',
      }}
      steps={[
        { label: 'step1', content: 'page 1', onValidate: action('validateStep1') },
        { label: 'step2', content: 'page 2', onValidate: action('validateStep2') },
        { label: 'step3', content: 'page 3', onValidate: action('validateStep3') },
      ]}
      footer={{
        leftContent: <p>Custom content</p>,
        previousButtonLabel: 'I18N Previous',
        nextButtonLabel: 'I18N Next',
        submitButtonLabel: 'I18N Submit',
        cancelButtonLabel: 'I18N Cancel',
      }}
      {...commonWizardProps}
    />
  ))
  .add('sending data', () => (
    <WizardModal
      header={{
        label: 'Basic Wizard',
        title: 'Gimme 3 Steps',
      }}
      steps={[
        { label: 'step1', content: 'page 1', onValidate: action('validateStep1') },
        { label: 'step2', content: 'page 2', onValidate: action('validateStep2') },
        { label: 'step3', content: 'page 3', onValidate: action('validateStep3') },
      ]}
      {...commonWizardProps}
      currentStepIndex={2}
      sendingData
    />
  ));
