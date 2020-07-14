import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, number, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import {
  SettingsAdjust16 as SettingsAdjust,
  ShareKnowledge16 as ShareKnowledge,
} from '@carbon/icons-react';

import FlyoutMenu, { FlyoutMenuDirection } from './FlyoutMenu';

const buttonSizes = {
  Default: 'default',
  Field: 'field',
  Small: 'small',
};

const CustomFooter = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: 64 }}>
      I&apos;m a custom footer!
    </div>
  );
};

storiesOf('Watson IoT Experimental/Flyout Menu', module)
  .add('Default Example', () => (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
      <FlyoutMenu
        buttonSize={select('Button Size', buttonSizes, buttonSizes.Default)}
        renderIcon={ShareKnowledge}
        disabled={boolean('Disabled', false)}
        iconDescription="Helpful description"
        passive={boolean('Passive Flyout', false)}
        triggerId="test-trigger-id-2"
        light={boolean('Light Mode', true)}
        menuOffset={{ top: number('Menu Offset top', 0), left: number('Menu offset left', 0) }}
        onCancel={action('On Cancel Clicked')}
        onApply={action('On Apply Clicked')}
        direction={select('Flyout direction', FlyoutMenuDirection, FlyoutMenuDirection.BottomStart)}
      >
        This is some flyout content
      </FlyoutMenu>
    </div>
  ))
  .add('Large Flyout Example', () => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <FlyoutMenu
        buttonSize={select('Button Size', buttonSizes, buttonSizes.Default)}
        renderIcon={ShareKnowledge}
        disabled={boolean('Disabled', false)}
        iconDescription="Helpful description"
        passive={boolean('Passive Flyout', false)}
        triggerId="test-trigger-id-2"
        light={boolean('Light Mode', true)}
        onCancel={action('On Cancel Clicked')}
        onApply={action('On Apply Clicked')}
      >
        <div>
          <h2>This is a header</h2>

          <p style={{ width: 300 }}>
            Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta
            felis euismod semper.
          </p>

          <div style={{ backgroundColor: '#333333', height: 300, width: 800 }} />
        </div>
      </FlyoutMenu>
    </div>
  ))
  .add('Custom Footer Example', () => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <FlyoutMenu
        buttonSize={select('Button Size', buttonSizes, buttonSizes.Default)}
        renderIcon={SettingsAdjust}
        disabled={boolean('Disabled', false)}
        iconDescription="Helpful description"
        passive={false}
        customFooter={<CustomFooter />}
        triggerId="test-trigger-id-2"
        light={boolean('Light Mode', true)}
        onCancel={action('On Cancel Clicked')}
        onApply={action('On Apply Clicked')}
        direction={select('Flyout direction', FlyoutMenuDirection, FlyoutMenuDirection.BottomStart)}
      >
        <div>
          <h2>This is a header</h2>

          <p style={{ width: 300 }}>
            Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta
            felis euismod semper.
          </p>
        </div>
      </FlyoutMenu>
    </div>
  ));
