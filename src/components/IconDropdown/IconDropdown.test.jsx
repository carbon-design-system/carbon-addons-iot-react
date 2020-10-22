import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import IconDropdown from './IconDropdown';
import { items } from './IconDropdown.story';

const iconDropdownProps = {
  id: 'icon-dropdown-1',
  label: 'Icon Dropdown menu options',
  items,
};

const itemsWithoutIcons = [
  {
    id: 'option-0',
    text: 'Option 0',
  },
  {
    id: 'option-1',
    text: 'Option 1',
  },
  {
    id: 'option-2',
    text: 'Option 2',
  },
];

describe('Icon Dropdown', () => {
  it('Renders default', () => {
    render(
      <IconDropdown
        items={itemsWithoutIcons}
        {...iconDropdownProps}
        actions={{
          onChangeView: () => {},
        }}
      />
    );

    const renderedLabel = screen.queryByText(iconDropdownProps.label);

    expect(renderedLabel).toBeDefined();
  });

  it('Renders selected item', () => {
    render(
      <IconDropdown
        {...iconDropdownProps}
        selectedViewId={items[0].id}
        actions={{
          onChangeView: () => {},
        }}
      />
    );

    const selectedItem = screen.queryByText(items[0].text);

    expect(selectedItem).toBeDefined();
  });

  it('Renders icon buttons', () => {
    render(
      <IconDropdown
        {...iconDropdownProps}
        hasIconsOnly
        actions={{
          onChangeView: () => {},
        }}
      />
    );

    const renderedLabel = screen.queryByText(iconDropdownProps.label);

    fireEvent.click(renderedLabel);

    expect(
      screen.queryByTestId(`dropdown-button__${items[3].id}`)
    ).toBeDefined();

    expect(
      screen.queryByTestId(`dropdown-button__${items[5].id}`)
    ).toBeDefined();
  });

  it('Renders icon labels', () => {
    const label = 'Icon Dropdown menu options';

    render(
      <IconDropdown
        {...iconDropdownProps}
        items={items}
        actions={{
          onChangeView: () => {},
        }}
      />
    );

    const renderedLabel = screen.queryByText(label);

    fireEvent.click(renderedLabel);

    expect(screen.queryByTestId(`dropdown-button__${items[3].id}`)).toBeNull();
    expect(screen.queryByTestId(items[3].text)).toBeDefined();

    expect(screen.queryByTestId(`dropdown-button__${items[5].id}`)).toBeNull();
    expect(screen.queryByTestId(items[5].text)).toBeDefined();
  });

  it('icon handles callback', () => {
    let selectedItem = null;

    render(
      <IconDropdown
        {...iconDropdownProps}
        hasIconsOnly
        actions={{
          onChangeView: (item) => {
            selectedItem = item;
          },
        }}
      />
    );

    const itemToSelect = items[3];

    fireEvent.click(screen.getByText(iconDropdownProps.label));
    fireEvent.click(screen.getAllByText(itemToSelect.text)[0]);

    expect(selectedItem.id).toEqual(itemToSelect.id);
  });

  it('custom render', () => {
    render(
      <IconDropdown
        {...iconDropdownProps}
        hasIconsOnly
        itemToString={() => 'test'}
        actions={{
          onChangeView: () => {},
        }}
      />
    );

    fireEvent.click(screen.getByText(iconDropdownProps.label));

    expect(screen.getAllByText('test').length).toEqual(items.length);
  });
});
