import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import {
  SettingsAdjust16 as SettingsAdjust,
  ShareKnowledge16 as ShareKnowledge,
  ShrinkScreen16 as ShrinkScreen,
} from '@carbon/icons-react';

import Button from '../Button';

import FlyoutMenu from './FlyoutMenu';

const directions = { Bottom: 'bottom', Top: 'top', Left: 'left', Right: 'right' };

function UncontrolledExample() {
  const [isOpen, setIsOpen] = useState(false);
  const direction = select('Flyout direction', directions, 'bottom');

  return (
    <>
      <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
        <Button style={{ margin: '10px 5px' }} onClick={() => setIsOpen(false)}>
          Hide
        </Button>
        <Button
          className="story-flyout-menu-open"
          style={{ margin: '10px 5px' }}
          onClick={() => setIsOpen(true)}
        >
          Show
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <FlyoutMenu
          iconDescription="Helpful description"
          triggerId="test-trigger-id"
          light={boolean('Light Mode', true)}
          open={isOpen}
          transactional={boolean('Renders a transactional flyout', true)}
          renderButton={false}
          direction={direction}
          onCancel={action('On Cancel Clicked')}
          onApply={action('On Apply Clicked')}
          selectorPrimaryFocus="story-flyout-menu-open"
        >
          Example Content
        </FlyoutMenu>
      </div>
    </>
  );
}

function ExampleContent() {
  return (
    <div>
      <h2>This is a header</h2>

      <p style={{ width: 300 }}>
        Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta
        felis euismod semper.
      </p>

      <div style={{ backgroundColor: '#333333', height: 300, width: 800 }} />
    </div>
  );
}

function ControlledExample() {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <FlyoutMenu
          buttonProps={{ size: 'default', renderIcon: SettingsAdjust }}
          iconDescription="Helpful description"
          triggerId="test-trigger-id"
          onCancel={action('On Cancel Clicked')}
          onApply={action('On Apply Clicked')}
          direction="bottom"
        >
          <ExampleContent />
        </FlyoutMenu>

        <FlyoutMenu
          buttonProps={{ size: 'field', renderIcon: ShrinkScreen }}
          iconDescription="Helpful description"
          triggerId="test-trigger-id-2"
          transactional={boolean('Renders a transactional flyout', true)}
          light={boolean('Light Mode', true)}
          onCancel={action('On Cancel Clicked')}
          onApply={action('On Apply Clicked')}
          direction={select('Flyout direction', directions, 'bottom')}
        >
          <ExampleContent />
        </FlyoutMenu>

        <FlyoutMenu
          buttonProps={{ size: 'small', renderIcon: ShareKnowledge }}
          iconDescription="Helpful description"
          triggerId="test-trigger-id-3"
          onCancel={action('On Cancel Clicked')}
          onApply={action('On Apply Clicked')}
          direction="bottom"
        >
          <ExampleContent />
        </FlyoutMenu>
      </div>
    </>
  );
}

storiesOf('Watson IoT/Flyout Menu', module)
  .add('basic', () => <UncontrolledExample />)
  .add('Controlled example', () => <ControlledExample />);
