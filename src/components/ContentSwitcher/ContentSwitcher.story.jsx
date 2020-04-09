import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select } from '@storybook/addon-knobs';
import { ContentSwitcher } from 'carbon-components-react';
import List16 from '@carbon/icons-react/lib/list/16';
import Code16 from '@carbon/icons-react/lib/code/16';
import List20 from '@carbon/icons-react/lib/list/20';
import Code20 from '@carbon/icons-react/lib/code/20';
import List24 from '@carbon/icons-react/lib/list/24';
import Code24 from '@carbon/icons-react/lib/code/24';

import IconSwitch, { ICON_SWITCH_SIZES } from '../IconSwitch';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const listIcons = {
  [ICON_SWITCH_SIZES.small]: List16,
  [ICON_SWITCH_SIZES.default]: List20,
  [ICON_SWITCH_SIZES.large]: List24,
};
const codeIcons = {
  [ICON_SWITCH_SIZES.small]: Code16,
  [ICON_SWITCH_SIZES.default]: Code20,
  [ICON_SWITCH_SIZES.large]: Code24,
};

export {
  default as ContentSwitcherStory,
} from 'carbon-components-react/lib/components/ContentSwitcher/ContentSwitcher-story';

storiesOf('Watson IoT/ContentSwitcher', module)
  .addDecorator(withKnobs)
  .add('icons', () => {
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
