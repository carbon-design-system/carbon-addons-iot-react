import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { settings } from '../../constants/Settings';

import ListBuilder from './ListBuilder';

const { iotPrefix } = settings;

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    rerender(<ListBuilder {...commonProps} testId="list_builder" hasReset />);

    expect(screen.getByTestId('list_builder')).toBeDefined();
    expect(screen.getByTestId('list_builder__all')).toBeDefined();
    expect(screen.getByTestId('list_builder__selected')).toBeDefined();
    expect(screen.getByTestId('list_builder__selected__reset-button')).toBeDefined();
  });
  it('should call add when clicking the add arrow on the full list', () => {
    render(<ListBuilder {...commonProps} />);

    userEvent.click(screen.getAllByLabelText('Add item to list')[0]);
    expect(commonProps.onAdd).toHaveBeenCalledWith(expect.anything(), '1');
  });

  it('should call remove when clicking the remove arrow in the selected list', () => {
    render(
      <ListBuilder
        {...commonProps}
        items={commonProps.items.filter((item) => item.id !== '1')}
        selectedItems={commonProps.items.filter((item) => item.id === '1')}
      />
    );

    userEvent.click(screen.getAllByLabelText('Remove item from list')[0]);
    expect(commonProps.onRemove).toHaveBeenCalledWith(expect.anything(), '1');
  });

  it('should show the prop i18n strings', () => {
    render(
      <ListBuilder
        {...commonProps}
        hasReset
        items={commonProps.items.filter((item) => item.id !== '1')}
        selectedItems={commonProps.items.filter((item) => item.id === '1')}
        i18n={{
          allListTitle: (count) => `${count}-available`,
          selectedListTitle: (count) => `${count}-selected`,
          addLabel: 'add-item-to-list',
          removeLabel: 'remove-item-from-list',
          allListSearchPlaceholderText: 'search-all-list',
          selectedListSearchPlaceholderText: 'search-selected-list',
          resetLabel: 'perform-reset',
        }}
      />
    );

    expect(screen.getByText('perform-reset')).toBeVisible();
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

  it('should add reset button with callback when hasReset:true', () => {
    const onReset = jest.fn();

    // It doesn't break without the onReset callback
    const { rerender } = render(<ListBuilder {...commonProps} hasReset />);
    userEvent.click(screen.getByRole('button', { name: 'Reset' }));

    rerender(<ListBuilder {...commonProps} hasReset onReset={onReset} />);

    expect(onReset).not.toHaveBeenCalled();
    userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onReset).toHaveBeenCalled();
  });

  it('should render rightside list search by default but not when hasSelectedItemsSearch:false', () => {
    const { rerender } = render(<ListBuilder {...commonProps} />);
    expect(
      screen.getByPlaceholderText(ListBuilder.defaultProps.i18n.selectedListSearchPlaceholderText)
    ).toBeVisible();

    rerender(<ListBuilder {...commonProps} hasSelectedItemsSearch={false} />);
    expect(
      screen.queryAllByPlaceholderText(
        ListBuilder.defaultProps.i18n.selectedListSearchPlaceholderText
      )
    ).toHaveLength(0);
  });

  it('should render leftside list search by default but not when hasSelectedItemsSearch:false', () => {
    const { rerender } = render(<ListBuilder {...commonProps} />);
    expect(
      screen.getByPlaceholderText(ListBuilder.defaultProps.i18n.allListSearchPlaceholderText)
    ).toBeVisible();

    rerender(<ListBuilder {...commonProps} hasItemsSearch={false} />);
    expect(
      screen.queryAllByPlaceholderText(ListBuilder.defaultProps.i18n.allListSearchPlaceholderText)
    ).toHaveLength(0);
  });

  it('should use tall list items when isLargeRow:true', () => {
    const { rerender } = render(<ListBuilder {...commonProps} />);
    expect(screen.getByText('one').closest(`.${iotPrefix}--list-item__large`)).toBeNull();

    rerender(<ListBuilder {...commonProps} isLargeRow />);
    expect(screen.getByText('one').closest(`.${iotPrefix}--list-item__large`)).toBeVisible();
  });

  describe('new design triggered by useCheckboxes:true', () => {
    it('should render checkboxes for selection', () => {
      render(<ListBuilder {...commonProps} useCheckboxes />);
      expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    });

    it('should trigger onAdd for row click', () => {
      render(<ListBuilder {...commonProps} useCheckboxes />);
      expect(commonProps.onAdd).not.toHaveBeenCalled();
      userEvent.click(screen.getByText('one'));
      expect(commonProps.onAdd).toHaveBeenCalledWith(null, '1');
    });

    it('should not allow row to get tab focus', () => {
      render(<ListBuilder {...commonProps} useCheckboxes />);
      expect(screen.getByText('one').closest(`.${iotPrefix}--list-item`)).toHaveAttribute(
        'tabindex',
        '-1'
      );
    });

    it('should call onRemove when clicking the remove button in the selected list', () => {
      render(
        <ListBuilder
          {...commonProps}
          selectedItems={commonProps.items.filter((item) => item.id === '1')}
        />
      );

      expect(commonProps.onRemove).not.toHaveBeenCalled();
      userEvent.click(screen.getAllByLabelText('Remove item from list')[0]);
      expect(commonProps.onRemove).toHaveBeenCalledWith(expect.anything(), '1');
    });
  });
});
