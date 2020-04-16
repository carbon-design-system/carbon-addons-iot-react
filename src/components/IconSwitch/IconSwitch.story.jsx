import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select } from '@storybook/addon-knobs';
import List16 from '@carbon/icons-react/lib/list/16';
import List20 from '@carbon/icons-react/lib/list/20';
import List24 from '@carbon/icons-react/lib/list/24';

import IconSwitch, { ICON_SWITCH_SIZES } from './IconSwitch';

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
  );
