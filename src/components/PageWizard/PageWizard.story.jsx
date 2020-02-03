/* Used dependencies */
import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { Form, FormGroup, FormItem, Link, TextInput } from 'carbon-components-react';

import PageTitleBar from '../PageTitleBar/PageTitleBar';

import PageWizard from './PageWizard';
import PageWizardStep from './PageWizardStep/PageWizardStep';
import PageWizardStepContent from './PageWizardStep/PageWizardStepContent';
import PageWizardStepDescription from './PageWizardStep/PageWizardStepDescription';
import PageWizardStepTitle from './PageWizardStep/PageWizardStepTitle';
import PageWizardStepExtraContent from './PageWizardStep/PageWizardStepExtraContent';
import StatefulPageWizard from './StatefulPageWizard';

export const content = [
  <PageWizardStep
    id="step1"
    label="Step 1"
    key="step1"
    onClose={() => {}}
    onSubmit={() => {}}
    onNext={() => {}}
    onBack={() => {}}
  >
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
  <PageWizardStep
    id="step2"
    key="step2"
    label="Step 2"
    onClose={() => {}}
    onSubmit={() => {}}
    onNext={() => {}}
    onBack={() => {}}
  >
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
  <PageWizardStep
    id="step3"
    key="step3"
    label="Step 3"
    onClose={() => {}}
    onSubmit={() => {}}
    onNext={() => {}}
    onBack={() => {}}
  >
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

export const StepValidation = ({ ...props }) => {
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
                data-testid="first-name"
                labelText="First name"
                value={firstName}
                onChange={evt => setFirstName(evt.target.value)}
              />
            </FormItem>
            <FormItem>
              <TextInput
                id="last-name"
                data-testid="last-name"
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

storiesOf('Watson IoT|PageWizard', module)
  .add('stateful example', () => (
    <div>
      <StatefulPageWizard
        onClearError={() => {}}
        onClose={() => {}}
        onSubmit={() => {}}
        onNext={() => {}}
        onBack={() => {}}
        setStep={() => {}}
      >
        {content}
      </StatefulPageWizard>
    </div>
  ))
  .add('stateful example w/ validation in PageTitleBar', () => (
    <div>
      <PageTitleBar
        title="A cool PageWizard!"
        description="The description from the PageTitleBar"
        breadcrumb={[
          <Link to="www.ibm.com">Home</Link>,
          <Link to="www.ibm.com">Something</Link>,
          <Link to="www.ibm.com">Something Else</Link>,
        ]}
        content={
          <StatefulPageWizard
            onClearError={() => {}}
            onClose={() => {}}
            onSubmit={() => {}}
            onNext={() => {}}
            onBack={() => {}}
            setStep={() => {}}
          >
            <StepValidation id="step1" label="Step with validation" />
            {content[1]}
          </StatefulPageWizard>
        }
      />
    </div>
  ))
  .add('wrapped in PageTitleBar', () => (
    <div>
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
            onClose={action('closed', () => {})}
            onSubmit={action('submit', () => {})}
            onClearError={action('Clear error', () => {})}
            onNext={action('next', () => {})}
            onBack={action('back', () => {})}
            setStep={action('step clicked', () => {})}
            isProgressIndicatorVertical={boolean('Toggle Progress Indicator Alignment', true)}
          >
            {content}
          </PageWizard>
        }
      />
    </div>
  ))
  .add('With Horizontal ProgressIndicator', () => (
    <div>
      <PageWizard
        currentStepId="step1"
        onClose={action('closed', () => {})}
        onSubmit={action('submit', () => {})}
        onNext={action('next', () => {})}
        onBack={action('back', () => {})}
        setStep={action('step clicked', () => {})}
        onClearError={action('Clear error', () => {})}
        isProgressIndicatorVertical={boolean('Toggle Progress Indicator Alignment', false)}
      >
        {content}
      </PageWizard>
    </div>
  ))
  .add('only one step, in PageTitleBar', () => (
    <div>
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
            onClose={action('closed', () => {})}
            onSubmit={action('submit', () => {})}
            onNext={action('next', () => {})}
            onBack={action('back', () => {})}
            onClearError={() => {}}
            setStep={action('step clicked', () => {})}
            sendingData={boolean('sendingData', false)}
            hasStickyFooter={boolean('hasStickyFooter', false)}
          >
            {[content[0]]}
          </PageWizard>
        }
      />
    </div>
  ))
  .add('With Sticky Footer: stateful example w/ validation in PageTitleBar', () => (
    <div>
      <PageTitleBar
        title="A cool PageWizard!"
        description="The description from the PageTitleBar"
        breadcrumb={[
          <Link to="www.ibm.com">Home</Link>,
          <Link to="www.ibm.com">Something</Link>,
          <Link to="www.ibm.com">Something Else</Link>,
        ]}
        content={
          <StatefulPageWizard
            hasStickyFooter={boolean('hasStickyFooter', true)}
            isProgressIndicatorVertical={boolean('Toggle Progress Indicator Alignment', true)}
            onClearError={() => {}}
            onClose={() => {}}
            onSubmit={() => {}}
            onNext={() => {}}
            onBack={() => {}}
            setStep={() => {}}
          >
            <StepValidation id="step1" label="Step with validation" />
            {content[1]}
          </StatefulPageWizard>
        }
      />
    </div>
  ))

  .add('w/ i18n', () => (
    <div>
      <PageWizard
        currentStepId="step1"
        onClose={action('closed', () => {})}
        onSubmit={action('submit', () => {})}
        onNext={action('next', () => {})}
        onBack={action('back', () => {})}
        onClearError={() => {}}
        setStep={action('step clicked', () => {})}
        sendingData={boolean('sendingData', false)}
        hasStickyFooter={boolean('hasStickyFooter', false)}
        i18={{
          close: text('Close label', 'Close'),
          cancel: text('Cancel label', 'Cancel'),
          back: text('Back label', 'Back'),
          next: text('Next label', 'Next'),
          submit: text('Submit label', 'Submit'),
        }}
      >
        {content}
      </PageWizard>
    </div>
  ));
