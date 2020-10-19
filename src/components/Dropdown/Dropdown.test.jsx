import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import Dropdown from './Dropdown';
import { items, itemsWithIcons } from './Dropdown.story';

describe('Dropdown', () => {
  it('Renders default', () => {
    const label = 'Dropdown menu options';

    render(
      <Dropdown
        id="dropdown-1"
        items={items}
        label={label}
        actions={{
          onChangeView: () => {},
        }}
      />
    );

    const renderedLabel = screen.queryByText(label);

    expect(renderedLabel).toBeDefined();
  });

  it('Renders selected item', () => {
    const label = 'Dropdown menu options';

    render(
      <Dropdown
        id="dropdown-1"
        items={items}
        label={label}
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
    const label = 'Dropdown menu options';

    render(
      <Dropdown
        id="dropdown-1"
        items={itemsWithIcons}
        hasIconsOnly
        label={label}
        actions={{
          onChangeView: () => {},
        }}
      />
    );

    const renderedLabel = screen.queryByText(label);

    fireEvent.click(renderedLabel);

    expect(screen.queryByTestId(`dropdown-button__${itemsWithIcons[3].id}`)).toBeDefined();

    expect(screen.queryByTestId(`dropdown-button__${itemsWithIcons[5].id}`)).toBeDefined();
  });

  it('Renders icon labels', () => {
    const label = 'Dropdown menu options';

    render(
      <Dropdown
        id="dropdown-1"
        items={itemsWithIcons}
        label={label}
        actions={{
          onChangeView: () => {},
        }}
      />
    );

    const renderedLabel = screen.queryByText(label);

    fireEvent.click(renderedLabel);

    expect(screen.queryByTestId(`dropdown-button__${itemsWithIcons[3].id}`)).toBeNull();
    expect(screen.queryByTestId(itemsWithIcons[3].text)).toBeDefined();

    expect(screen.queryByTestId(`dropdown-button__${itemsWithIcons[5].id}`)).toBeNull();
    expect(screen.queryByTestId(itemsWithIcons[5].text)).toBeDefined();
  });

  it('icon handles callback', () => {
    const label = 'Dropdown menu options';

    let selectedItem = null;

    render(
      <Dropdown
        id="dropdown-1"
        items={itemsWithIcons}
        label={label}
        hasIconsOnly
        actions={{
          onChangeView: item => {
            console.log('here i am yo');
            selectedItem = item;
          },
        }}
      />
    );

    const itemToSelect = itemsWithIcons[3];

    fireEvent.click(screen.getByText(label));
    fireEvent.click(screen.getAllByText(itemToSelect.text)[0]);

    expect(selectedItem.id).toEqual(itemToSelect.id);
  });

  it('custom render', () => {
    const label = 'Dropdown menu options';

    render(
      <Dropdown
        id="dropdown-1"
        items={itemsWithIcons}
        label={label}
        hasIconsOnly
        itemToString={() => 'test'}
        actions={{
          onChangeView: () => {},
        }}
      />
    );

    fireEvent.click(screen.getByText(label));

    expect(screen.getAllByText('test').length).toEqual(9);
  });
});
