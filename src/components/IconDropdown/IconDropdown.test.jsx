import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import IconDropdown from './IconDropdown';
import { items } from './IconDropdown.story';

const iconDropdownProps = {
  id: 'icon-dropdown-1',
  label: 'Icon Dropdown menu options',
  items,
};

describe('Icon Dropdown', () => {
  it('Renders default', () => {
    render(
      <IconDropdown
        items={items}
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

  it('icon handles callback', () => {
    let selectedItem = null;

    render(
      <IconDropdown
        {...iconDropdownProps}
        actions={{
          onChangeView: (item) => {
            selectedItem = item;
          },
        }}
      />
    );

    const itemToSelect = items[3];

    fireEvent.click(screen.getByText(iconDropdownProps.label));
    fireEvent.click(screen.queryAllByText(itemToSelect.text)[0]);

    expect(selectedItem.id).toEqual(itemToSelect.id);
  });

  it('renders correct footer', () => {
    const renderFooter = (item) => {
      return <div data-testid={`test-${item.text}`}>{item.text}</div>;
    };

    const itemsWithFooter = items.map((item) => {
      return {
        ...item,
        footer: renderFooter(item),
      };
    });

    render(
      <IconDropdown
        {...iconDropdownProps}
        helperText="help"
        items={itemsWithFooter}
        selectedViewId={null}
        actions={{
          onChangeView: () => {},
        }}
      />
    );

    const itemToHighlight = items[3];
    const highlightedTestId = `test-${itemToHighlight.text}`;

    expect(screen.queryByTestId(highlightedTestId)).toBeNull();

    fireEvent.click(screen.getByText(iconDropdownProps.label));
    expect(screen.queryByTestId(highlightedTestId)).toBeNull();

    userEvent.hover(screen.getAllByText(itemToHighlight.text)[0]);
    expect(screen.queryByTestId(highlightedTestId)).toBeDefined();
  });
});
