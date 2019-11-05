/* Used dependencies */
import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Form, FormGroup, FormItem, Link, TextInput } from 'carbon-components-react';

import PageTitleBar from '../PageTitleBar/PageTitleBar';

import {
  PageWizard,
  PageWizardStep,
  PageWizardStepContent,
  PageWizardStepTitle,
  PageWizardStepDescription,
  PageWizardStepExtraContent,
} from './PageWizard';
import StatefulPageWizard from './StatefulPageWizard';

export const content = [
  <PageWizardStep id="step1" label="Step 1">
    <PageWizardStepTitle>Step 1: Define the data</PageWizardStepTitle>
    <PageWizardStepDescription>
      You can create summaries lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eros
      odio, rhoncus et sapien quis, vestibulum bibendum est.{' '}
      <a href="www.ibm.com">An embedded link</a> is good to have sometimes.
    </PageWizardStepDescription>
    <PageWizardStepContent>
      <h1>A table could go here</h1>
      <h3>Some other form items could go here</h3>
      <h4>And other things here</h4>
    </PageWizardStepContent>
    <PageWizardStepExtraContent>
      <h4>What are time grains?</h4>
      <p>
        Time grains are lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eros odio,
        rhoncus et sapien quis, vestibulum bibendum est. Duis blandit tellus ultricies justo
        sagittis, tempus ornare purus tristique. Quisque nisi tortor, semper ac efficitur tincidunt,
        feugiat vel ligula. Aenean consequat, massa nec rhoncus vulputate, metus ex dictum ante, at
        posuere erat tellus vitae orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
        eu tempus sem. Vestibulum quis consequat orci. Sed vel ultrices libero, eu malesuada quam.
      </p>
    </PageWizardStepExtraContent>
  </PageWizardStep>,
  <PageWizardStep id="step2" label="Step 2">
    <PageWizardStepTitle>Step 2: Pick the contents</PageWizardStepTitle>
    <PageWizardStepDescription>
      You can add content lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eros
      odio, rhoncus et sapien quis, vestibulum bibendum est.
    </PageWizardStepDescription>
    <PageWizardStepContent>
      <h1>A graph could go here</h1>
      <h3>Some other form items could go here</h3>
      <h4>And other things here</h4>
    </PageWizardStepContent>
    <PageWizardStepExtraContent>
      <h4>What are time grains?</h4>
      <p>
        Time grains are lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eros odio,
        rhoncus et sapien quis, vestibulum bibendum est. Duis blandit tellus ultricies justo
        sagittis, tempus ornare purus tristique. Quisque nisi tortor, semper ac efficitur tincidunt,
        feugiat vel ligula. Aenean consequat, massa nec rhoncus vulputate, metus ex dictum ante, at
        posuere erat tellus vitae orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
        eu tempus sem. Vestibulum quis consequat orci. Sed vel ultrices libero, eu malesuada quam.
      </p>
      <h4>Some more help text?</h4>
      <p>
        Time grains are lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eros odio,
        rhoncus et sapien quis, vestibulum bibendum est. Duis blandit tellus ultricies justo
        sagittis, tempus ornare purus tristique. Quisque nisi tortor, semper ac efficitur tincidunt,
        feugiat vel ligula. Aenean consequat, massa nec rhoncus vulputate, metus ex dictum ante, at
        posuere erat tellus vitae orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
        eu tempus sem. Vestibulum quis consequat orci. Sed vel ultrices libero, eu malesuada quam.
      </p>
    </PageWizardStepExtraContent>
  </PageWizardStep>,
  <PageWizardStep id="step3" label="Step 3">
    <PageWizardStepTitle>Step 3: Define your dashboard</PageWizardStepTitle>
    <PageWizardStepDescription>
      Dashboards are useful lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eros
      odio, rhoncus et sapien quis, vestibulum bibendum est.
    </PageWizardStepDescription>
    <PageWizardStepContent>
      <h1>A dashboard could go here.</h1>
      <h3>Some other form items could go here</h3>
      <h4>And other things here</h4>
    </PageWizardStepContent>
  </PageWizardStep>,
];

const StepValidation = ({ ...props }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(null);

  return (
    <PageWizardStep
      {...props}
      error={error}
      onValidate={() => {
        if (firstName.length > 0 && lastName.length > 0) {
          return true;
        }
        setError('First name and Last name cannot be empty');
        return false;
      }}
    >
      <PageWizardStepTitle>Enter some things</PageWizardStepTitle>
      <PageWizardStepDescription>
        Make sure you do not try to go to the next step with an empty input! Bad things will happen.
      </PageWizardStepDescription>
      <PageWizardStepContent>
        <Form>
          <FormGroup legendText="Name">
            <FormItem>
              <TextInput
                id="first-name"
                labelText="First name"
                value={firstName}
                onChange={evt => setFirstName(evt.target.value)}
              />
            </FormItem>
            <FormItem>
              <TextInput
                id="last-name"
                labelText="Last name"
                value={lastName}
                onChange={evt => setLastName(evt.target.value)}
              />
            </FormItem>
          </FormGroup>
        </Form>
      </PageWizardStepContent>
    </PageWizardStep>
  );
};

storiesOf('Watson IoT Experimental|PageWizard', module)
  .add('stateful example', () => (
    <div style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, padding: '2rem' }}>
      <StatefulPageWizard>{content}</StatefulPageWizard>
    </div>
  ))
  .add('stateful example w/ validation in PageTitleBar', () => (
    <div style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0 }}>
      <PageTitleBar
        title="A cool PageWizard!"
        description="The description from the PageTitleBar"
        breadcrumb={[
          <Link to="www.ibm.com">Home</Link>,
          <Link to="www.ibm.com">Something</Link>,
          <Link to="www.ibm.com">Something Else</Link>,
        ]}
        content={
          <StatefulPageWizard>
            <StepValidation id="step1" label="Step with validation" />
            {content[1]}
          </StatefulPageWizard>
        }
      />
    </div>
  ))
  .add('wrapped in PageTitleBar', () => (
    <div style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0 }}>
      <PageTitleBar
        title="A cool PageWizard!"
        description="The description from the PageTitleBar"
        breadcrumb={[
          <Link to="www.ibm.com">Home</Link>,
          <Link to="www.ibm.com">Something</Link>,
          <Link to="www.ibm.com">Something Else</Link>,
        ]}
        content={
          <PageWizard
            currentStepId="step1"
            onClose={action('closed')}
            onSubmit={action('submit')}
            onNext={action('next')}
            onBack={action('back')}
            setStep={action('step clicked')}
          >
            {content}
          </PageWizard>
        }
      />
    </div>
  ))
  .add('only one step, in PageTitleBar', () => (
    <div style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0 }}>
      <PageTitleBar
        title="A cool PageWizard!"
        description="The description from the PageTitleBar"
        breadcrumb={[
          <Link to="www.ibm.com">Home</Link>,
          <Link to="www.ibm.com">Something</Link>,
          <Link to="www.ibm.com">Something Else</Link>,
        ]}
        content={
          <PageWizard
            currentStepId="step1"
            onClose={action('closed')}
            onSubmit={action('submit')}
            onNext={action('next')}
            onBack={action('back')}
            setStep={action('step clicked')}
          >
            {[content[0]]}
          </PageWizard>
        }
      />
    </div>
  ))
  .add('w/ i18n', () => <div>TODO</div>);
