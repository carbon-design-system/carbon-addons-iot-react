import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { items } from '../IconDropdown/IconDropdown.story';
import { settings } from '../../constants/Settings';

import Dropdown from './Dropdown';

const { prefix } = settings;

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

describe('Dropdown with Icon and Labels', () => {
  it('should be selectable with testId', () => {
    const { rerender } = render(
      <Dropdown items={itemsWithoutIcons} {...iconDropdownProps} data-testid="dropdown_test" />
    );

    expect(screen.getAllByTestId('dropdown_test')).toBeDefined();

    rerender(<Dropdown items={itemsWithoutIcons} {...iconDropdownProps} testId="dropdown_TEST" />);

    expect(screen.getAllByTestId('dropdown_TEST')).toBeDefined();
  });

  it('Renders default', () => {
    render(<Dropdown items={itemsWithoutIcons} {...iconDropdownProps} />);

    const renderedLabel = screen.queryByText(iconDropdownProps.label);

    expect(renderedLabel).toBeDefined();
  });

  it('Renders selected item', () => {
    render(<Dropdown {...iconDropdownProps} selectedItem={items[0]} />);

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
    let item = null;

    render(
      <Dropdown
        {...iconDropdownProps}
        onChange={(changes) => {
          const { selectedItem } = changes;

          item = selectedItem;
        }}
      />
    );

    const itemToSelect = items[3];

    fireEvent.click(screen.getByText(iconDropdownProps.label));
    fireEvent.click(screen.getAllByText(itemToSelect.text)[0]);

    expect(item.id).toEqual(itemToSelect.id);
  });

  it('custom render', () => {
    render(<Dropdown {...iconDropdownProps} itemToString={() => 'test'} />);

    fireEvent.click(screen.getByText(iconDropdownProps.label));
    expect(screen.getAllByText('test').length).toEqual(items.length);
    fireEvent.click(screen.getAllByText('test')[0]);
    expect(screen.getAllByText('test').length).toEqual(1);
  });

  it('renders string items', () => {
    const items = ['one', 'two', 'three'];

    render(<Dropdown {...iconDropdownProps} items={items} />);

    fireEvent.click(screen.getByText(iconDropdownProps.label));
    expect(screen.getByText(items[0])).toBeDefined();
  });

  it('renders default items', () => {
    const items = [
      {
        id: 'one',
        text: 'one',
      },
      {
        id: 'two',
        text: 'two',
      },
    ];

    render(<Dropdown {...iconDropdownProps} items={items} />);

    fireEvent.click(screen.getByText(iconDropdownProps.label));
    expect(screen.getByText(items[0].text)).toBeDefined();
  });

  it('renders an empty string if item is falsey', () => {
    const items = [
      {
        id: 'one',
        text: 'one',
      },
      {
        id: 'two',
        text: 'two',
      },
      false,
    ];

    const { container } = render(<Dropdown {...iconDropdownProps} items={items} />);

    fireEvent.click(screen.getByText(iconDropdownProps.label));
    expect(container.querySelectorAll(`.${prefix}--list-box__menu-item__option`)).toHaveLength(3);
  });
});
