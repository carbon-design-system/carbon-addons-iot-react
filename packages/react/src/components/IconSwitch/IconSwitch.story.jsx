import React from 'react';
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

export default {
  title: '1 - Watson IoT/IconSwitch',
  decorators: [withKnobs],

  parameters: {
    component: IconSwitch,
  },
};

export const Unselected = () => {
  const size = select('Size', Object.values(ICON_SWITCH_SIZES), ICON_SWITCH_SIZES.default, 'size');
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
};

Unselected.storyName = 'unselected';

Unselected.parameters = {
  info: {
    text: 'Designed to be embedded in ContentSwitcher - see Watson IoT/ContentSwitcher',
  },
};

export const Selected = () => {
  const size = select('Size', Object.values(ICON_SWITCH_SIZES), ICON_SWITCH_SIZES.default, 'size');
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
};

Selected.storyName = 'selected';

Selected.parameters = {
  info: {
    text: 'Designed to be embedded in ContentSwitcher - see Watson IoT/ContentSwitcher',
  },
};

export const ExampleUsedInContentSwitcher = () => {
  const size = select('Size', Object.values(ICON_SWITCH_SIZES), ICON_SWITCH_SIZES.default, 'size');

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
};

ExampleUsedInContentSwitcher.storyName = 'example - used in ContentSwitcher';

export const ExampleUsedInContentSwitcherLightVersion = () => {
  const size = select('Size', Object.values(ICON_SWITCH_SIZES), ICON_SWITCH_SIZES.default, 'size');

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
        light
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
        light
      />
    </ContentSwitcher>
  );
};

ExampleUsedInContentSwitcherLightVersion.storyName =
  'example - used in ContentSwitcher light version ';
