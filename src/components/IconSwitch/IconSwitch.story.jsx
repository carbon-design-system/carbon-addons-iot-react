import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select } from '@storybook/addon-knobs';
import { ContentSwitcher } from 'carbon-components-react';
import { List16, Code16, List20, Code20, List24, Code24 } from '@carbon/icons-react';

import { settings } from '../../constants/Settings';

import IconSwitch, { ICON_SWITCH_SIZES } from './IconSwitch';

const { iotPrefix } = settings;

const codeIcons = {
  [ICON_SWITCH_SIZES.small]: Code16,
  [ICON_SWITCH_SIZES.default]: Code20,
  [ICON_SWITCH_SIZES.large]: Code24,
};

const listIcons = {
  [ICON_SWITCH_SIZES.small]: List16,
  [ICON_SWITCH_SIZES.default]: List20,
  [ICON_SWITCH_SIZES.large]: List24,
};

storiesOf('Watson IoT/IconSwitch', module)
  .addDecorator(withKnobs)
  .add(
    'unselected',
    () => {
      const size = select(
        'Size',
        Object.values(ICON_SWITCH_SIZES),
        ICON_SWITCH_SIZES.default,
        'size'
      );
      return (
        <IconSwitch
          name="one"
          onClick={function noRefCheck() {}}
          onKeyDown={function noRefCheck() {}}
          text="Graphical View"
          renderIcon={listIcons[size]}
          size={size}
          index={0}
        />
      );
    },
    {
      info: {
        text: 'Designed to be embedded in ContentSwitcher - see Watson IoT/ContentSwitcher',
      },
    }
  )
  .add(
    'selected',
    () => {
      const size = select(
        'Size',
        Object.values(ICON_SWITCH_SIZES),
        ICON_SWITCH_SIZES.default,
        'size'
      );
      return (
        <IconSwitch
          name="one"
          onClick={function noRefCheck() {}}
          onKeyDown={function noRefCheck() {}}
          selected
          text="Graphical View"
          renderIcon={listIcons[size]}
          size={size}
          index={0}
        />
      );
    },
    {
      info: {
        text: 'Designed to be embedded in ContentSwitcher - see Watson IoT/ContentSwitcher',
      },
    }
  )
  .add('example - used in ContentSwitcher', () => {
    const size = select(
      'Size',
      Object.values(ICON_SWITCH_SIZES),
      ICON_SWITCH_SIZES.default,
      'size'
    );

    return (
      <ContentSwitcher
        className={`${iotPrefix}--content-switcher--icon`}
        onChange={function noRefCheck() {}}
        selectedIndex={0}
      >
        <IconSwitch
          name="one"
          onClick={function noRefCheck() {}}
          onKeyDown={function noRefCheck() {}}
          selected
          text="Graphical View"
          renderIcon={listIcons[size]}
          size={size}
          index={0}
        />
        <IconSwitch
          name="two"
          onClick={function noRefCheck() {}}
          onKeyDown={function noRefCheck() {}}
          selected={false}
          text="Source View"
          renderIcon={codeIcons[size]}
          size={size}
          index={1}
        />
      </ContentSwitcher>
    );
  });
