import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from 'carbon-components-react';

import WizardModal from './WizardModal';

const commonWizardProps = {
  onSubmit: action('submit'),
  onClose: action('close'),
};

storiesOf('WizardModal', module)
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
    <WizardModal
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
        leftContent: <Button>My Button</Button>,
        previousButtonLabel: 'I18N Previous',
        nextButtonLabel: 'I18N Next',
        submitButtonLabel: 'I18N Submit',
        cancelButtonLabel: 'I18N Cancel',
      }}
      {...commonWizardProps}
    />
  ));
