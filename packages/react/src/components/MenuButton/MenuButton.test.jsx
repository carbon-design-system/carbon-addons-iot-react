import React from 'react';
import {
  unstable_ContextMenuItem as ContextMenuItem,
  unstable_ContextMenuDivider as ContextMenuDivider,
  unstable_ContextMenuRadioGroup as ContextMenuRadioGroup,
  unstable_ContextMenuSelectableItem as ContextMenuSelectableItem,
} from 'carbon-components-react';
import { ChevronDown16, ChevronUp16, Copy16, TrashCan16 } from '@carbon/icons-react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../constants/Settings';

import * as MenuButtonUtils from './utils';
import MenuButton from './MenuButton';

const { prefix } = settings;

const callbacks = {
  primary: jest.fn(),
  publish: jest.fn(),
  duplicate: jest.fn(),
  share: jest.fn(),
  csv: jest.fn(),
  json: jest.fn(),
  delete: jest.fn(),
};
const menuItems = [
  <ContextMenuSelectableItem
    key="publish"
    label="Publish"
    initialChecked={false}
    onChange={callbacks.publish}
  />,
  <ContextMenuDivider key="div-1" />,
  <ContextMenuItem
    key="duplicate"
    renderIcon={Copy16}
    label="Duplicate"
    onClick={callbacks.duplicate}
  />,
  <ContextMenuDivider key="div-2" />,
  <ContextMenuItem key="share" label="Share with">
    <ContextMenuRadioGroup
      label="Shared with"
      items={['None', 'Product Team', 'Organization', 'Company']}
      initialSelectedItem="None"
      onChange={callbacks.share}
    />
  </ContextMenuItem>,
  <ContextMenuDivider key="div-3" />,
  <ContextMenuItem key="export" label="Export">
    <ContextMenuItem label="CSV" onClick={callbacks.csv} />
    <ContextMenuItem label="JSON" onClick={callbacks.json} />
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
    onClick={callbacks.delete}
    shortcut="⌘⌫"
    /** this is unavailable until we upgrade to Carbon 10.32/7.32 */
    kind="danger"
  />,
];

describe('MenuButton', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should be a single button if only a label is given', () => {
    render(<MenuButton label="Actions">{menuItems}</MenuButton>);

    expect(screen.getByTestId('menu-button-single')).toBeVisible();
    expect(screen.queryByTestId('menu-button-primary')).toBeNull();
    expect(screen.queryByTestId('menu-button-secondary')).toBeNull();
  });

  it('should be a split button if a label and primary action are given', () => {
    render(
      <MenuButton label="Actions" onPrimaryActionClick={jest.fn()}>
        {menuItems}
      </MenuButton>
    );

    expect(screen.getByTestId('menu-button-primary')).toBeVisible();
    expect(screen.getByTestId('menu-button-secondary')).toBeVisible();
  });

  it('should be an icon only button if a label is not given', () => {
    render(<MenuButton>{menuItems}</MenuButton>);

    expect(screen.getByTestId('menu-button-icon')).toBeVisible();
    expect(screen.queryByTestId('menu-button-single')).toBeNull();
    expect(screen.queryByTestId('menu-button-primary')).toBeNull();
    expect(screen.queryByTestId('menu-button-secondary')).toBeNull();
  });

  it('should be fire the onPrimaryActionClick callback when in split mode', () => {
    const create = jest.fn();
    render(
      <MenuButton label="Create" onPrimaryActionClick={create}>
        {menuItems}
      </MenuButton>
    );

    userEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(create).toBeCalled();
  });

  it('should be open the menu when clicking the button in single button mode', () => {
    const { container } = render(<MenuButton label="Create">{menuItems}</MenuButton>);

    expect(container.querySelector(`.${prefix}--context-menu`)).not.toHaveClass(
      `${prefix}--context-menu--open`
    );
    userEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(screen.getByText('Publish')).toBeVisible();
    expect(container.querySelector(`.${prefix}--context-menu`)).toHaveClass(
      `${prefix}--context-menu--open`
    );
  });

  it('should be open the menu when clicking the secondary button split button mode', () => {
    const { container } = render(
      <MenuButton label="Create" onPrimaryActionClick={callbacks.primary}>
        {menuItems}
      </MenuButton>
    );

    expect(container.querySelector(`.${prefix}--context-menu`)).not.toHaveClass(
      `${prefix}--context-menu--open`
    );
    userEvent.click(screen.getByLabelText('open menu button'));
    expect(screen.getByText('Publish')).toBeVisible();
    expect(container.querySelector(`.${prefix}--context-menu`)).toHaveClass(
      `${prefix}--context-menu--open`
    );
  });

  it('should not open when clicking the primary action of a split button', () => {
    const { container } = render(
      <MenuButton label="Create" onPrimaryActionClick={callbacks.primary}>
        {menuItems}
      </MenuButton>
    );

    expect(container.querySelector(`.${prefix}--context-menu`)).not.toHaveClass(
      `${prefix}--context-menu--open`
    );
    userEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(callbacks.primary).toHaveBeenCalled();
    expect(container.querySelector(`.${prefix}--context-menu`)).not.toHaveClass(
      `${prefix}--context-menu--open`
    );
  });

  it('should close the menu when clicking a child item with an onClick handler', () => {
    const { container } = render(
      <MenuButton label="Create" onPrimaryActionClick={callbacks.primary}>
        {menuItems}
      </MenuButton>
    );

    expect(container.querySelector(`.${prefix}--context-menu`)).not.toHaveClass(
      `${prefix}--context-menu--open`
    );
    userEvent.click(screen.getByLabelText('open menu button'));

    expect(container.querySelector(`.${prefix}--context-menu`)).toHaveClass(
      `${prefix}--context-menu--open`
    );
    userEvent.click(screen.getByTitle('Duplicate'));
    expect(callbacks.duplicate).toHaveBeenCalled();
    expect(container.querySelector(`.${prefix}--context-menu`)).not.toHaveClass(
      `${prefix}--context-menu--open`
    );
  });

  it('should show a warning when using an icon without an icon description', () => {
    console.error = jest.fn();
    render(
      <MenuButton
        label="Create"
        onPrimaryActionClick={callbacks.primary}
        renderOpenIcon={ChevronDown16}
        renderCloseIcon={ChevronUp16}
        openIconDescription={null}
        closeIconDescription={null}
      >
        {menuItems}
      </MenuButton>
    );

    expect(console.error).toHaveBeenCalledTimes(3);
    expect(console.error).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining(
        `Failed prop type: renderCloseIcon property specified without also providing an closeIconDescription property.`
      )
    );
    expect(console.error).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining(
        `Failed prop type: renderOpenIcon property specified without also providing an openIconDescription property.`
      )
    );
    expect(console.error).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining(
        `Failed prop type: The prop \`iconDescription\` is marked as required in \`ForwardRef\`, but its value is \`null\`.`
      )
    );
  });

  describe('getMenuPosition', () => {
    beforeEach(() => {
      jest.spyOn(MenuButtonUtils, 'getMenuPosition');
      Object.defineProperty(document.body, 'clientWidth', {
        writable: true,
        value: 1024,
      });
      Object.defineProperty(document.body, 'clientHeight', {
        writable: true,
        value: 768,
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
      Object.defineProperty(document.body, 'clientWidth', {
        writable: true,
        value: 0,
      });
      Object.defineProperty(document.body, 'clientHeight', {
        writable: true,
        value: 0,
      });
    });

    it('should position a single button in the bottom right corner', () => {
      const button = document.createElement('button');
      button.getBoundingClientRect = jest.fn(() => {
        return {
          bottom: 747,
          height: 48,
          left: 930,
          right: 978,
          top: 699,
          width: 48,
          x: 930,
          y: 699,
        };
      });
      const menu = document.createElement('ul');
      menu.getBoundingClientRect = jest.fn(() => {
        return {
          bottom: 236,
          height: 236,
          left: 0,
          right: 208,
          top: 0,
          width: 208,
          x: 0,
          y: 0,
        };
      });
      Object.defineProperty(button, 'nextSibling', {
        get() {
          return menu;
        },
      });

      expect(
        MenuButtonUtils.getMenuPosition({
          label: 'Actions',
          buttonRef: { current: button },
          onPrimaryActionClick: null,
        })
      ).toEqual({ x: 978, y: 463 });
    });

    it('should position a split button on the bottom correctly', () => {
      const button = document.createElement('button');
      button.getBoundingClientRect = jest.fn(() => {
        return {
          bottom: 747,
          height: 48,
          left: 489,
          right: 537,
          top: 699,
          width: 48,
          x: 489,
          y: 699,
        };
      });
      const menu = document.createElement('ul');
      menu.getBoundingClientRect = jest.fn(() => {
        return {
          bottom: 236,
          height: 236,
          left: 0,
          right: 208,
          top: 0,
          width: 208,
          x: 0,
          y: 0,
        };
      });
      Object.defineProperty(button, 'nextSibling', {
        get() {
          return menu;
        },
      });

      expect(
        MenuButtonUtils.getMenuPosition({
          label: 'Actions',
          buttonRef: { current: button },
          onPrimaryActionClick: jest.fn(),
        })
      ).toEqual({ x: 489, y: 463 });
    });

    it('should position an icon only button on the right correctly', () => {
      const button = document.createElement('button');
      button.getBoundingClientRect = jest.fn(() => {
        return {
          bottom: 96,
          height: 48,
          left: 930,
          right: 978,
          top: 48,
          width: 48,
          x: 930,
          y: 48,
        };
      });
      const menu = document.createElement('ul');
      menu.getBoundingClientRect = jest.fn(() => {
        return {
          bottom: 236,
          height: 236,
          left: 0,
          right: 208,
          top: 0,
          width: 208,
          x: 0,
          y: 0,
        };
      });
      Object.defineProperty(button, 'nextSibling', {
        get() {
          return menu;
        },
      });

      expect(
        MenuButtonUtils.getMenuPosition({
          label: '',
          buttonRef: { current: button },
          onPrimaryActionClick: null,
        })
      ).toEqual({ x: 978, y: 96 });
    });

    it('should position a split button on the bottom correctly in RTL', () => {
      const button = document.createElement('button');
      document.dir = 'rtl';
      button.getBoundingClientRect = jest.fn(() => {
        return {
          bottom: 747,
          height: 48,
          left: 489,
          right: 537,
          top: 699,
          width: 48,
          x: 489,
          y: 699,
        };
      });
      const menu = document.createElement('ul');
      menu.getBoundingClientRect = jest.fn(() => {
        return {
          bottom: 236,
          height: 236,
          left: 0,
          right: 208,
          top: 0,
          width: 208,
          x: 0,
          y: 0,
        };
      });
      Object.defineProperty(button, 'nextSibling', {
        get() {
          return menu;
        },
      });

      expect(
        MenuButtonUtils.getMenuPosition({
          label: 'Actions',
          buttonRef: { current: button },
          onPrimaryActionClick: jest.fn(),
        })
      ).toEqual({ x: 489, y: 463 });
      document.dir = 'ltr';
    });
  });
});
