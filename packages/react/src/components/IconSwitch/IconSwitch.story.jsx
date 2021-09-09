import React from 'react';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';
import { ContentSwitcher } from 'carbon-components-react';
import {
  List16,
  Code16,
  List20,
  Code20,
  List24,
  Code24,
  Screen16,
  Screen20,
  Screen24,
  Laptop16,
  Laptop20,
  Laptop24,
  Mobile16,
  Mobile20,
  Mobile24,
  ScreenOff16,
  ScreenOff20,
  ScreenOff24,
} from '@carbon/icons-react';

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

const mobileIcons = {
  [ICON_SWITCH_SIZES.small]: Mobile16,
  [ICON_SWITCH_SIZES.default]: Mobile20,
  [ICON_SWITCH_SIZES.large]: Mobile24,
};

const laptopIcons = {
  [ICON_SWITCH_SIZES.small]: Laptop16,
  [ICON_SWITCH_SIZES.default]: Laptop20,
  [ICON_SWITCH_SIZES.large]: Laptop24,
};

const desktopIcons = {
  [ICON_SWITCH_SIZES.small]: Screen16,
  [ICON_SWITCH_SIZES.default]: Screen20,
  [ICON_SWITCH_SIZES.large]: Screen24,
};

const screenOffIcons = {
  [ICON_SWITCH_SIZES.small]: ScreenOff16,
  [ICON_SWITCH_SIZES.default]: ScreenOff20,
  [ICON_SWITCH_SIZES.large]: ScreenOff24,
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

export const ExampleUsedInContentSwitcherTwoIcons = () => {
  const size = select('Size', Object.values(ICON_SWITCH_SIZES), ICON_SWITCH_SIZES.default);
  const isDisabled = boolean('disabled', false);
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
        text="Graphical View"
        renderIcon={listIcons[size]}
        size={size}
        index={0}
        disabled={isDisabled}
      />
      <IconSwitch
        name="two"
        onClick={function noRefCheck() {}}
        onKeyDown={function noRefCheck() {}}
        text="Source View"
        renderIcon={codeIcons[size]}
        size={size}
        index={0}
        disabled={isDisabled}
      />
    </ContentSwitcher>
  );
};

ExampleUsedInContentSwitcherTwoIcons.storyName = 'with 2 icons in ContentSwitcher';

export const ExampleUsedInContentSwitcher = () => {
  const size = select('Size', Object.values(ICON_SWITCH_SIZES), ICON_SWITCH_SIZES.default);
  const isDisabled = boolean('disabled', false);
  return (
    <div style={{ backgroundColor: 'white', padding: '3rem' }}>
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
          text="Desktop view"
          renderIcon={desktopIcons[size]}
          size={size}
          index={0}
          disabled={isDisabled}
        />
        <IconSwitch
          name="two"
          onClick={function noRefCheck() {}}
          onKeyDown={function noRefCheck() {}}
          selected={false}
          text="Laptop view"
          renderIcon={laptopIcons[size]}
          size={size}
          index={1}
          disabled={isDisabled}
        />
        <IconSwitch
          name="three"
          onClick={function noRefCheck() {}}
          onKeyDown={function noRefCheck() {}}
          selected={false}
          text="Mobile view"
          renderIcon={mobileIcons[size]}
          size={size}
          index={2}
          disabled={isDisabled}
        />
        <IconSwitch
          name="four"
          onClick={function noRefCheck() {}}
          onKeyDown={function noRefCheck() {}}
          selected={false}
          text="Screen off"
          renderIcon={screenOffIcons[size]}
          size={size}
          index={3}
          disabled={isDisabled}
        />
      </ContentSwitcher>
    </div>
  );
};

ExampleUsedInContentSwitcher.storyName = 'with 4 icons in ContentSwitcher';

export const ExampleUsedInContentSwitcherLightVersionFourIcons = () => {
  const size = select('Size', Object.values(ICON_SWITCH_SIZES), ICON_SWITCH_SIZES.default);
  const isDisabled = boolean('disabled', false);

  return (
    <div style={{ backgroundColor: 'white', padding: '3rem' }}>
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
          text="Desktop view"
          renderIcon={desktopIcons[size]}
          size={size}
          index={0}
          disabled={isDisabled}
          light
        />
        <IconSwitch
          name="two"
          onClick={function noRefCheck() {}}
          onKeyDown={function noRefCheck() {}}
          selected={false}
          text="Laptop view"
          renderIcon={laptopIcons[size]}
          size={size}
          index={1}
          disabled={isDisabled}
          light
        />
        <IconSwitch
          name="three"
          onClick={function noRefCheck() {}}
          onKeyDown={function noRefCheck() {}}
          selected={false}
          text="Mobile view"
          renderIcon={mobileIcons[size]}
          size={size}
          index={2}
          disabled={isDisabled}
          light
        />
        <IconSwitch
          name="four"
          onClick={function noRefCheck() {}}
          onKeyDown={function noRefCheck() {}}
          selected={false}
          text="Screen off"
          renderIcon={screenOffIcons[size]}
          size={size}
          index={3}
          disabled={isDisabled}
          light
        />
      </ContentSwitcher>
    </div>
  );
};

ExampleUsedInContentSwitcherLightVersionFourIcons.storyName =
  'with light version and four icons in ContentSwitcher';

export const ExampleUsedInContentSwitcherLightVersionTwoIcons = () => {
  const size = select('Size', Object.values(ICON_SWITCH_SIZES), ICON_SWITCH_SIZES.default);

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

ExampleUsedInContentSwitcherLightVersionTwoIcons.storyName = 'with light version and two icons';
