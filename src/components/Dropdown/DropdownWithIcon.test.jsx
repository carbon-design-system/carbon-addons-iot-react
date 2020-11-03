import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { items } from '../IconDropdown/IconDropdown.story';

import Dropdown from './DropdownWithIcon';

const iconDropdownProps = {
  id: 'icon-dropdown-1',
  dropdownId: 'dropdown-id-1',
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

describe('Dropdown with Icon and Labels', () => {
  it('Renders default', () => {
    render(<Dropdown items={itemsWithoutIcons} {...iconDropdownProps} />);

    const renderedLabel = screen.queryByText(iconDropdownProps.label);

    expect(renderedLabel).toBeDefined();
  });

  it('Renders selected item', () => {
    render(<Dropdown {...iconDropdownProps} selectedViewId={items[0].id} />);

    const selectedItem = screen.queryByText(items[0].text);

    expect(selectedItem).toBeDefined();
  });

  it('Renders in dropdown', () => {
    const label = 'Icon Dropdown menu options';

    render(<Dropdown {...iconDropdownProps} items={items} />);

    const renderedLabel = screen.queryByText(label);

    fireEvent.click(renderedLabel);

    expect(screen.queryByTestId(`dropdown-button__${items[3].id}`)).toBeNull();
    expect(screen.queryByTestId(items[3].text)).toBeDefined();

    expect(screen.queryByTestId(`dropdown-button__${items[5].id}`)).toBeNull();
    expect(screen.queryByTestId(items[5].text)).toBeDefined();
  });

  it('handles callback', () => {
    let selectedItem = null;

    render(
      <Dropdown
        {...iconDropdownProps}
        onChange={(item) => {
          selectedItem = item;
        }}
      />
    );

    const itemToSelect = items[3];

    fireEvent.click(screen.getByText(iconDropdownProps.label));
    fireEvent.click(screen.getAllByText(itemToSelect.text)[0]);

    expect(selectedItem.id).toEqual(itemToSelect.id);
  });

  it('custom render', () => {
    render(<Dropdown {...iconDropdownProps} itemToString={() => 'test'} />);

    fireEvent.click(screen.getByText(iconDropdownProps.label));
    expect(screen.getAllByText('test').length).toEqual(items.length);
    fireEvent.click(screen.getAllByText('test')[0]);
    expect(screen.getAllByText('test').length).toEqual(1);
  });
});
