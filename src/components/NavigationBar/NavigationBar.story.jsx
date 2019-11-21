import React, { Fragment, useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import PageTitleBar from '../PageTitleBar/PageTitleBar';
import PageWorkArea from '../Page/PageWorkArea';
import WizardInline from '../WizardInline/StatefulWizardInline';
import { itemsAndComponents } from '../WizardInline/WizardInline.story';

import NavigationBar from './NavigationBar';

const StyledDirections = styled.div`
  padding: 1rem;
`;

const commonPageHeroProps = {
  section: 'Explore',
  title: 'Your Devices',
  description:
    'Your data lake displays a detailed view of the entity types that are connected in Watson IoT Platform. To explore the metrics and dimensions of your entities in more detail, select Entities. To start applying calculations and analyzing your entity data, select Data.',
  big: true,
  extraContent: <div>Extra Content</div>,
};

const navBarProps = {
  tabs: [
    { id: 'tab1', label: 'Tab 1', children: 'my content' },
    { id: 'tab2', label: 'Tab 2', children: 'my content2' },
  ],
  hero: <PageTitleBar {...commonPageHeroProps} />,
  onSelectionChange: action('onSelectionChange'),
};

const StatefulNavigationBar = () => {
  const [workAreaOpen, setWorkAreaOpen] = useState(false);
  const handleNew = event => {
    setWorkAreaOpen(!workAreaOpen);
    action('button1')(event);
  };
  return (
    <Fragment>
      <StyledDirections>
        To interact with the workarea, click the New Entity Type button. To close the workarea,
        click the Cancel button or finish the flow.
      </StyledDirections>
      <NavigationBar
        {...navBarProps}
        workArea={
          workAreaOpen ? (
            <PageWorkArea isOpen={workAreaOpen}>
              <WizardInline
                title="Sample Wizard"
                items={itemsAndComponents}
                onClose={() => setWorkAreaOpen(false)}
                onSubmit={() => setWorkAreaOpen(false)}
              />
            </PageWorkArea>
          ) : null
        }
        actions={[{ id: 'button1', children: 'New Entity Type', onClick: handleNew }]}
      />
    </Fragment>
  );
};

storiesOf('Watson IoT|NavigationBar', module)
  .add('normal', () => <NavigationBar {...navBarProps} />)
  .add('start with tab 2 selected', () => <NavigationBar {...navBarProps} selected={1} />)
  .add('with actions', () => (
    <NavigationBar
      {...navBarProps}
      actions={[
        { id: 'button1', children: 'New Entity Type', onClick: action('button1') },
        { id: 'button2', children: 'Button 2', kind: 'secondary', onClick: action('button2') },
      ]}
    />
  ))
  .add('example with workArea', () => <StatefulNavigationBar />);
