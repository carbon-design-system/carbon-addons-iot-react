import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ComboBox from './ComboBox';
import { items } from './ComboBox.story';

const defaultProps = {
  items,
  id: 'comboinput',
  placeholder: 'Filter...',
  titleText: 'Combobox title',
  helperText: 'Optional helper text here',
  hasMultiValue: true,
  onChange: () => {},
};

describe('ComboBox', () => {
  const setup = props => {
    const { container } = render(<ComboBox {...defaultProps} {...props} />);
    // Input element
    const input = screen.getByRole('combobox');
    // List container
    const list = screen.getByRole('listbox');
    // Tag container
    const tags = screen.getByTestId('combo-tags');
    return {
      input,
      tags,
      list,
      container,
    };
  };

  // Hitting enter will not trigger a change if value is blank
  it('will not add tag when input is blank or add to list', async () => {
    const { input, tags, list } = setup();

    // Pre-check tag and list count
    expect(tags.childElementCount).toEqual(0);
    expect(list.childElementCount).toEqual(5);

    await userEvent.type(input, '{enter}');

    // Post-check tag and list count
    expect(tags.childElementCount).toEqual(0);
    expect(list.childElementCount).toEqual(5);
  });

  // Adding unique value will add a new tag and add to list of items
  it('will add tags when user types in new value and adds that value to list', async () => {
    const { input, tags, list } = setup();

    // Pre-check tag and list count
    expect(tags.childElementCount).toEqual(0);
    expect(list.childElementCount).toEqual(5);

    await userEvent.type(input, 'Hello{enter}');

    // Post-check tag and list count
    expect(tags.childElementCount).toEqual(1);
    expect(list.childElementCount).toEqual(6);

    // Check tag value is what it is supposed to be
    expect(tags.firstChild.firstChild.firstChild.innerHTML).toEqual('Hello');

    // Check new item value is what it is supposed to be
    expect(list.lastChild.firstChild.innerHTML).toEqual('Hello');

    await userEvent.type(input, 'World{enter}');
    // Post-check tag and list count
    expect(tags.childElementCount).toEqual(2);
    expect(list.childElementCount).toEqual(7);
  });

  // Typing the same value twice will not result in multiple tags or additions
  it('will not add tag when user types in existing tag value or duplicate to list', async () => {
    const { input, tags, list } = setup();

    // Pre-check tag and list count
    expect(tags.childElementCount).toEqual(0);
    expect(list.childElementCount).toEqual(5);

    await userEvent.type(input, 'Hello{enter}');
    await userEvent.type(input, 'Hello{enter}');

    // Post-check tag and list count - should only increment by 1
    expect(tags.childElementCount).toEqual(1);
    expect(list.childElementCount).toEqual(6);
  });

  // Check that selection from list adds tags but doesnt add duplicate to list
  it('will add tag when user selects from list but not duplicate to list', async () => {
    const { list, tags } = setup();

    // Pre-check tag and list count
    expect(tags.childElementCount).toEqual(0);
    expect(list.childElementCount).toEqual(5);

    userEvent.click(screen.getByTitle('Option 1'));

    // Post-check tag and list count
    expect(tags.childElementCount).toEqual(1);
    expect(list.childElementCount).toEqual(5);
    // Check value is what it is supposed to be
    expect(tags.firstChild.firstChild.firstChild.innerHTML).toEqual('Option 1');
  });

  // Check that selected item is only added once.
  it('will not add additional tag when user selects same value from list', async () => {
    const { list, tags } = setup();

    // Pre-check tag and list count
    expect(tags.childElementCount).toEqual(0);
    expect(list.childElementCount).toEqual(5);

    userEvent.click(screen.getByTitle('Option 1'));
    userEvent.click(screen.getByTitle('Option 1'));

    // Post-check tag and list count
    expect(tags.childElementCount).toEqual(1);
    expect(list.childElementCount).toEqual(5);
  });

  // Check that you can remove tag by clicking x icon
  it('will remove tag when close button is clicked', async () => {
    const { input, tags, container } = setup();

    await userEvent.type(input, 'Home{enter}');

    await waitFor(() => container.querySelector('.bx--tag__close-icon'));
    await userEvent.click(container.querySelector('.bx--tag__close-icon'));

    // Post-check tag count
    expect(tags.childElementCount).toEqual(0);
  });

  // Tags will not be added if hasMultiValue is false
  it('will not add tag when hasMultiValue is set to false but will add to list', async () => {
    const { input, tags, list } = setup({ hasMultiValue: false });

    // Pre-check tag and list count
    expect(tags.childElementCount).toEqual(0);
    expect(list.childElementCount).toEqual(5);

    await userEvent.type(input, 'Hello{enter}');

    // Post-check tag and list count
    expect(tags.childElementCount).toEqual(0);
    expect(list.childElementCount).toEqual(6);
  });
});
