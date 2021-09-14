import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { keyCodes } from '../../constants/KeyCodeConstants';
import { settings } from '../../constants/Settings';

import ComboBox from './ComboBox';
import { items } from './ComboBox.story';

const { iotPrefix } = settings;

const defaultProps = {
  items,
  id: 'comboinput',
  placeholder: 'Filter...',
  titleText: 'Combobox title',
  helperText: 'Optional helper text here',
  hasMultiValue: true,
  onChange: jest.fn(),
  onInputChange: () => {},
  itemToString: (item) => (item ? item.text : ''),
};

describe('ComboBox', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to open the list and return it
  const getListBox = async () => {
    // open the list by clicking the open menu icon
    userEvent.click(screen.getByTitle('Open'));
    const list = await screen.findByRole('listbox');
    return list;
  };

  it('should filter bad props, but not good ones.', async () => {
    jest.spyOn(console, 'error');
    const { container } = render(
      <ComboBox {...defaultProps} aBadProp="100" data-test-check="100" />
    );
    expect(console.error).not.toHaveBeenCalled();
    expect(container.querySelector('[data-test-check]')).toBeDefined();
  });

  it('renders with default props', async () => {
    render(<ComboBox {...defaultProps} />);
    const tags = screen.getByTestId('combo-tags');

    // only the defaults should be present
    expect(tags.childElementCount).toEqual(0);
    const list = await getListBox();
    expect(list.childElementCount).toEqual(5);
  });

  it('does not add tag when input is blank or add to list', async () => {
    render(<ComboBox {...defaultProps} />);
    const tags = screen.getByTestId('combo-tags');

    await userEvent.type(screen.getByPlaceholderText('Filter...'), '{enter}');

    expect(tags.childElementCount).toEqual(0);
    const list = await getListBox();
    expect(list.childElementCount).toEqual(5);
  });

  it('adds a tag and a list item when user types in new value and hits enter', async () => {
    render(<ComboBox {...defaultProps} />);
    const tags = screen.getByTestId('combo-tags');

    await userEvent.type(screen.getByPlaceholderText('Filter...'), 'Hello{enter}');

    expect(tags.childElementCount).toEqual(1);
    let list = await getListBox();
    expect(list.childElementCount).toEqual(6);

    expect(tags.firstChild.firstChild.firstChild.innerHTML).toEqual('Hello');
    expect(list.firstChild.firstChild.innerHTML).toEqual('Hello');

    expect(defaultProps.onChange.mock.calls.length).toBe(1);
    expect(defaultProps.onChange.mock.calls[0][0][0].text).toBe('Hello');

    await userEvent.type(screen.getByPlaceholderText('Filter...'), 'World{enter}');

    expect(tags.childElementCount).toEqual(2);
    list = await getListBox();
    expect(list.childElementCount).toEqual(7);

    expect(defaultProps.onChange.mock.calls.length).toBe(2);
    expect(defaultProps.onChange.mock.calls[1][0][0].text).toBe('Hello');
    expect(defaultProps.onChange.mock.calls[1][0][1].text).toBe('World');
  });

  it('does not add duplicate tags or list items', async () => {
    render(<ComboBox {...defaultProps} />);

    await userEvent.type(screen.getByPlaceholderText('Filter...'), 'Hello{enter}');
    await waitFor(() => expect(screen.getByTestId('combo-tags').childElementCount).toEqual(1));

    await userEvent.type(screen.getByPlaceholderText('Filter...'), 'Hello{enter}');
    await waitFor(() => expect(screen.getByTestId('combo-tags').childElementCount).toEqual(1));

    userEvent.click(screen.getByTitle('Clear selected item'));

    const list = await getListBox();
    expect(list.childElementCount).toEqual(6);

    expect(defaultProps.onChange.mock.calls.length).toBe(1);
    expect(defaultProps.onChange.mock.calls[0][0][0].text).toBe('Hello');
  });

  it('adds a tag when user selects from list, does not add a duplicate list item', async () => {
    render(<ComboBox {...defaultProps} />);
    const tags = screen.getByTestId('combo-tags');

    userEvent.click(screen.getByTitle('Open'));
    userEvent.click(screen.getByRole('option', { name: 'Option 1' }));

    expect(tags.childElementCount).toEqual(1);
    expect(tags.firstChild.firstChild.firstChild.innerHTML).toEqual('Option 1');

    const list = await getListBox();
    expect(list.childElementCount).toEqual(5);

    expect(defaultProps.onChange.mock.calls.length).toBe(1);
    expect(defaultProps.onChange.mock.calls[0][0][0].text).toBe('Option 1');
  });

  it('does not add duplicate tag when user selects same value from list', async () => {
    render(<ComboBox {...defaultProps} />);

    userEvent.click(screen.getByTitle('Open'));
    userEvent.click(screen.getByRole('option', { name: 'Option 1' }));
    userEvent.click(screen.getByTitle('Open'));
    userEvent.click(screen.getByRole('option', { name: 'Option 1' }));

    userEvent.click(screen.getByTitle('Clear selected item'));

    expect(screen.getByTestId('combo-tags').childElementCount).toEqual(1);
    const list = await getListBox();
    expect(list.childElementCount).toEqual(5);

    expect(defaultProps.onChange.mock.calls.length).toBe(1);
  });

  it('removes tag when close button is clicked', async () => {
    render(<ComboBox {...defaultProps} />);
    const tags = screen.getByTestId('combo-tags');

    await userEvent.click(screen.getByPlaceholderText('Filter...'));
    await userEvent.type(screen.getByPlaceholderText('Filter...'), 'Home{enter}');

    const close = await screen.findByRole('button', { name: /close/i });
    await userEvent.click(close);

    expect(tags.childElementCount).toEqual(0);

    expect(defaultProps.onChange.mock.calls.length).toBe(2);
    expect(defaultProps.onChange.mock.calls[1][0].length).toBe(0);
  });

  it('removes tag via keyboard tabbing and entering', async () => {
    render(<ComboBox {...defaultProps} />);
    const tags = screen.getByTestId('combo-tags');

    await userEvent.click(screen.getByPlaceholderText('Filter...'));
    await userEvent.type(screen.getByPlaceholderText('Filter...'), 'Home{enter}');

    expect(tags.childElementCount).toEqual(1);

    // tab over to tag and hit enter
    userEvent.tab();
    await userEvent.type(screen.getByRole('button', { name: /close/i }), '{enter}');

    expect(tags.childElementCount).toEqual(0);
  });

  it('adds to list (not tags) when addToList is passed and no hasMultiValue', async () => {
    render(
      <ComboBox
        {...defaultProps}
        addToList
        hasMultiValue={false}
        initialSelectedItem={{
          id: 'option-0',
          label: 'Option 1',
        }}
      />
    );

    await userEvent.type(screen.getByPlaceholderText('Filter...'), 'Hello {enter}');

    expect(screen.queryByTestId('combo-tags')).toBeNull();

    const list = await getListBox();
    expect(list.childElementCount).toEqual(6);

    expect(defaultProps.onChange.mock.calls.length).toBe(1);
    expect(defaultProps.onChange.mock.calls[0][0].text).toBe('Hello');
  });

  it('adds tag via keyboard interaction only', async () => {
    render(<ComboBox {...defaultProps} />);
    const tags = screen.getByTestId('combo-tags');
    expect(tags.childElementCount).toEqual(0);

    const control = screen.getByPlaceholderText('Filter...');

    await userEvent.click(control);
    fireEvent.keyDown(control, { keyCode: keyCodes.DOWN });
    fireEvent.keyDown(control, { keyCode: keyCodes.ENTER });

    expect(tags.childElementCount).toEqual(1);

    expect(defaultProps.onChange.mock.calls.length).toBe(1);
    expect(defaultProps.onChange.mock.calls[0][0][0].text).toBe('Option 1');
  });

  it('handles number ids', async () => {
    render(<ComboBox {...defaultProps} />);

    userEvent.click(screen.getByRole('button', { name: 'Open' }));
    userEvent.click(screen.getByText('Option 1'));
    expect(defaultProps.onChange).toHaveBeenCalledWith([{ id: 0, text: 'Option 1' }]);
  });

  it('can fit menu to content', () => {
    const { rerender } = render(<ComboBox {...defaultProps} menuFitContent />);
    expect(screen.getByTestId('combo-wrapper')).toHaveClass(
      `${iotPrefix}--combobox__menu--fit-content`
    );
    rerender(<ComboBox {...defaultProps} />);
    expect(screen.getByTestId('combo-wrapper')).not.toHaveClass(
      `${iotPrefix}--combobox__menu--fit-content`
    );
  });

  it('can have the menu expand to the left or right', () => {
    const { rerender } = render(
      <ComboBox {...defaultProps} menuFitContent horizontalDirection="start" />
    );
    expect(screen.getByTestId('combo-wrapper')).toHaveClass(
      `${iotPrefix}--combobox__menu--flip-horizontal`
    );

    rerender(<ComboBox {...defaultProps} menuFitContent horizontalDirection="end" />);
    expect(screen.getByTestId('combo-wrapper')).not.toHaveClass(
      `${iotPrefix}--combobox__menu--flip-horizontal`
    );
  });

  it('expands the menu to the right (right) by default', () => {
    render(<ComboBox {...defaultProps} menuFitContent />);
    expect(screen.getByTestId('combo-wrapper')).not.toHaveClass(
      `${iotPrefix}--combobox__menu--flip-horizontal`
    );
  });
});
