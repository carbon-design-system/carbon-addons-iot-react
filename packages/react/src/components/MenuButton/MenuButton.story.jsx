import { Copy16, OverflowMenuVertical16, TrashCan16 } from '@carbon/icons-react';
import {
  unstable_ContextMenuItem as ContextMenuItem,
  unstable_ContextMenuDivider as ContextMenuDivider,
  unstable_ContextMenuRadioGroup as ContextMenuRadioGroup,
  unstable_ContextMenuSelectableItem as ContextMenuSelectableItem,
} from 'carbon-components-react';
import React from 'react';
import { action } from '@storybook/addon-actions';

import StoryNotice, { experimentalStoryTitle } from '../../internal/StoryNotice';

import MenuButton from './MenuButton';

const menuItems = [
  <ContextMenuSelectableItem
    key="publish"
    label="Publish"
    initialChecked={false}
    onChange={action('Publish')}
  />,
  <ContextMenuDivider key="div-1" />,
  <ContextMenuItem
    key="duplicate"
    renderIcon={Copy16}
    label="Duplicate"
    onClick={action('Duplicate')}
  />,
  <ContextMenuDivider key="div-2" />,
  <ContextMenuItem key="share" label="Share with">
    <ContextMenuRadioGroup
      label="Shared with"
      items={['None', 'Product Team', 'Organization', 'Company']}
      initialSelectedItem="None"
      onChange={action('Share')}
    />
  </ContextMenuItem>,
  <ContextMenuDivider key="div-3" />,
  <ContextMenuItem key="export" label="Export">
    <ContextMenuItem label="CSV" onClick={action('Export CSV')} />
    <ContextMenuItem label="JSON" onClick={action('Export JSON')} />
  </ContextMenuItem>,
  <ContextMenuItem
    key="disabled"
    label={<span title="You must have proper credentials to use this option.">Disabled</span>}
    disabled
  />,
  <ContextMenuDivider key="div-4" />,
  <ContextMenuItem
    key="delete"
    label="Delete"
    renderIcon={TrashCan16}
    onClick={action('Delete')}
    shortcut="⌘⌫"
    /** this is unavailable until we upgrade to Carbon 10.32/7.32 */
    kind="danger"
  />,
];

export const Experimental = () => <StoryNotice componentName="MenuButton" experimental />;
Experimental.story = {
  name: experimentalStoryTitle,
};

/**
 * If no primary action is given, but has a label we assume it's a single menu button.
 */
export const SingleMenuButton = () => <MenuButton label="Actions">{menuItems}</MenuButton>;

SingleMenuButton.story = {
  name: 'menu button',
};

/**
 * if a primary action and label are given, then we assume it's a split button.
 */
export const SplitMenuButton = () => (
  <MenuButton onPrimaryActionClick={action('onPrimaryActionClick')} label="Create">
    {menuItems}
  </MenuButton>
);

SplitMenuButton.story = {
  name: 'split menu button',
};

/**
 * if no label is given then it assumes it's an icon only menu.
 */
export const IconOnlyMenuButton = () => (
  <MenuButton renderOpenIcon={OverflowMenuVertical16} renderCloseIcon={OverflowMenuVertical16}>
    {menuItems}
  </MenuButton>
);

IconOnlyMenuButton.story = {
  name: 'icon only menu button',
};

export const AutoPositioningExample = () => (
  <div
    style={{
      display: 'flex',
      flex: '1',
      flexDirection: 'column',
      height: 'calc(100vh)',
    }}
  >
    <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          flex: 1,
        }}
      >
        <IconOnlyMenuButton />
      </div>
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <IconOnlyMenuButton />
      </div>
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
        }}
      >
        <IconOnlyMenuButton />
      </div>
    </div>
    <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flex: 1,
        }}
      >
        <IconOnlyMenuButton />
      </div>
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconOnlyMenuButton />
      </div>
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <IconOnlyMenuButton />
      </div>
    </div>
    <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          flex: 1,
        }}
      >
        <IconOnlyMenuButton />
      </div>
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <IconOnlyMenuButton />
      </div>
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        <IconOnlyMenuButton />
      </div>
    </div>
  </div>
);

AutoPositioningExample.story = {
  name: 'icon only with auto positioning',
};

export default {
  title: 'Watson IoT Experimental/☢️ MenuButton',

  decorators: [],
  parameters: {
    component: MenuButton,
  },
};
