import React from 'react';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';
import { ContentSwitcher } from "@carbon/react";
import { List, Code, Screen, Laptop, Mobile, ScreenOff } from '@carbon/icons-react';

import { settings } from '../../constants/Settings';

import IconSwitch, { ICON_SWITCH_SIZES } from './IconSwitch';

const { iotPrefix } = settings;

const codeIcons = {
  [ICON_SWITCH_SIZES.small]: Code,
  [ICON_SWITCH_SIZES.default]: Code,
  [ICON_SWITCH_SIZES.large]: Code,
};

const listIcons = {
  [ICON_SWITCH_SIZES.small]: List,
  [ICON_SWITCH_SIZES.default]: List,
  [ICON_SWITCH_SIZES.large]: List,
};

const mobileIcons = {
  [ICON_SWITCH_SIZES.small]: Mobile,
  [ICON_SWITCH_SIZES.default]: Mobile,
  [ICON_SWITCH_SIZES.large]: Mobile,
};

const laptopIcons = {
  [ICON_SWITCH_SIZES.small]: Laptop,
  [ICON_SWITCH_SIZES.default]: Laptop,
  [ICON_SWITCH_SIZES.large]: Laptop,
};

const desktopIcons = {
  [ICON_SWITCH_SIZES.small]: Screen,
  [ICON_SWITCH_SIZES.default]: Screen,
  [ICON_SWITCH_SIZES.large]: Screen,
};

const screenOffIcons = {
  [ICON_SWITCH_SIZES.small]: ScreenOff,
  [ICON_SWITCH_SIZES.default]: ScreenOff,
  [ICON_SWITCH_SIZES.large]: ScreenOff,
};

export default {
  title: '1 - Watson IoT/Icon content switcher',
  decorators: [withKnobs],

  parameters: {
    component: IconSwitch,
  },
};

export const Unselected = () => {
  const size = select('Size', Object.values(ICON_SWITCH_SIZES), ICON_SWITCH_SIZES.default);
  const isDisabled = boolean('disabled', false);
  const isLight = boolean('light', false);
  return (
    <IconSwitch
      name="one"
      onClick={function noRefCheck() {}}
      onKeyDown={function noRefCheck() {}}
      text="Graphical View"
      renderIcon={listIcons[size]}
      size={size}
      index={0}
      disabled={isDisabled}
      light={isLight}
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
  const size = select('Size', Object.values(ICON_SWITCH_SIZES), ICON_SWITCH_SIZES.default);
  const isDisabled = boolean('disabled', false);
  const isLight = boolean('light', false);
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
      disabled={isDisabled}
      light={isLight}
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
  const isLight = boolean('light', false);
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
        light={isLight}
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
        light={isLight}
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
