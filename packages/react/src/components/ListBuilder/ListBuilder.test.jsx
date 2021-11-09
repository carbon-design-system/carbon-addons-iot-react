import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ListBuilder from './ListBuilder';

const commonProps = {
  items: [
    {
      id: '1',
      content: {
        value: 'one',
      },
    },
    {
      id: '2',
      content: {
        value: 'two',
      },
    },
    {
      id: '3',
      content: {
        value: 'three',
      },
    },
  ],
  onAdd: jest.fn(),
  onRemove: jest.fn(),
};

describe('ListBuilder', () => {
  it('should be selectable by testID or testId', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const { rerender } = render(<ListBuilder {...commonProps} testID="LIST_BUILDER" />);
    expect(console.error).toHaveBeenCalledWith(
      `Warning: The 'testID' prop has been deprecated. Please use 'testId' instead.`
    );
    console.error.mockReset();
    expect(screen.getByTestId('LIST_BUILDER')).toBeDefined();
    expect(screen.getByTestId('LIST_BUILDER__all')).toBeDefined();
    expect(screen.getByTestId('LIST_BUILDER__selected')).toBeDefined();
    rerender(<ListBuilder {...commonProps} testId="list_builder" />);

    expect(screen.getByTestId('list_builder')).toBeDefined();
    expect(screen.getByTestId('list_builder__all')).toBeDefined();
    expect(screen.getByTestId('list_builder__selected')).toBeDefined();
  });
  it('should call add when clicking the add arrow on the full list', () => {
    render(<ListBuilder {...commonProps} />);

    userEvent.click(screen.getAllByLabelText('Add item to list')[0]);
    expect(commonProps.onAdd).toHaveBeenCalledWith(expect.anything(), '1');
  });

  it('should call remove when clicking the add arrow on the full list', () => {
    render(
      <ListBuilder
        {...commonProps}
        items={commonProps.items.filter((item) => item.id !== '1')}
        selectedItems={commonProps.items.filter((item) => item.id === '1')}
      />
    );

    userEvent.click(screen.getAllByLabelText('Remove item from list')[0]);
    expect(commonProps.onAdd).toHaveBeenCalledWith(expect.anything(), '1');
  });

  it('should show the prop i18n strings', () => {
    render(
      <ListBuilder
        {...commonProps}
        items={commonProps.items.filter((item) => item.id !== '1')}
        selectedItems={commonProps.items.filter((item) => item.id === '1')}
        i18n={{
          allListTitle: (count) => `${count}-available`,
          selectedListTitle: (count) => `${count}-selected`,
          addLabel: 'add-item-to-list',
          removeLabel: 'remove-item-from-list',
          allListSearchPlaceholderText: 'search-all-list',
          selectedListSearchPlaceholderText: 'search-selected-list',
        }}
      />
    );

    expect(screen.getByText('2-available')).toBeVisible();
    expect(screen.getByText('1-selected')).toBeVisible();
    expect(screen.queryAllByText('add-item-to-list')).not.toBeNull();
    expect(screen.queryAllByText('remove-item-from-list')).not.toBeNull();
    expect(screen.queryAllByText('search-all-list')).not.toBeNull();
    expect(screen.queryAllByText('search-selected-list')).not.toBeNull();
  });

  it('should show zero when no items are given or selected', () => {
    render(
      <ListBuilder
        {...commonProps}
        items={null}
        selectedItems={null}
        i18n={{
          allListTitle: (count) => `${count}-available`,
          selectedListTitle: (count) => `${count}-selected`,
          addLabel: 'add-item-to-list',
          removeLabel: 'remove-item-from-list',
        }}
      />
    );

    expect(screen.getByText('0-available')).toBeVisible();
    expect(screen.getByText('0-selected')).toBeVisible();
  });
});
