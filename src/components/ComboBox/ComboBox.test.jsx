import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ComboBox from './ComboBox';
import { items } from './ComboBox.story';
import { defaultItemToString } from './CarbonComboBox';

const item = [
  {
    id: 'option-0',
    label: 'Option 1',
  },
  {
    id: 'option-1',
    label: 'Option 2',
  },
  {
    id: 'option-2',
    label: 'Option 3',
  },
  {
    id: 'option-3',
    label: 'Option 4',
  },
  {
    id: 'option-4',
    label: 'An example option that is really long to show what should be done to handle long text',
  },
];

const defaultProps = {
  items,
  id: 'comboinput',
  placeholder: 'Filter...',
  titleText: 'Combobox title',
  helperText: 'Optional helper text here',
  hasMultiValue: true,
  onChange: jest.fn(),
  onInputChange: () => {},
  itemToString: item => (item ? item.text : ''),
};

describe('ComboBox', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  // Temp test to pass threshold for Carbon Combobox component. Can be removed once we are updated to carbon-components-react@7.13.0
  it('will return a string', async () => {
    const item = {
      id: 'option-0',
      label: 'Option 1',
    };
    expect(defaultItemToString(item)).toEqual('Option 1');
    expect(defaultItemToString('Option 1')).toEqual('Option 1');
  });

  it('will not add tag when input is blank or add to list', async () => {
    const { input, tags, list } = setup({
      itemToString: defaultItemToString,
      items: item,
    });

    // Pre-check tag and list count
    expect(tags.childElementCount).toEqual(0);
    expect(list.childElementCount).toEqual(5);

    await userEvent.type(input, '{enter}');

    // Post-check tag and list count
    expect(tags.childElementCount).toEqual(0);
    expect(list.childElementCount).toEqual(5);
  });

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
    expect(list.firstChild.firstChild.innerHTML).toEqual('Hello');

    // Check that our onChange callback was fired and passed the proper value
    expect(defaultProps.onChange.mock.calls.length).toBe(1);
    expect(defaultProps.onChange.mock.calls[0][0][0].text).toBe('Hello');

    await userEvent.type(input, 'World{enter}');
    // Post-check tag and list count
    expect(tags.childElementCount).toEqual(2);
    expect(list.childElementCount).toEqual(7);

    // Check that our onChange callback was fired and passed the proper value
    expect(defaultProps.onChange.mock.calls.length).toBe(2);
    expect(defaultProps.onChange.mock.calls[1][0][0].text).toBe('Hello');
    expect(defaultProps.onChange.mock.calls[1][0][1].text).toBe('World');
  });

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

    // Check that our onChange callback was fired and passed the proper value
    expect(defaultProps.onChange.mock.calls.length).toBe(1);
    expect(defaultProps.onChange.mock.calls[0][0][0].text).toBe('Hello');
  });

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

    // Check that our onChange callback was fired and passed the proper value
    expect(defaultProps.onChange.mock.calls.length).toBe(1);
    expect(defaultProps.onChange.mock.calls[0][0][0].text).toBe('Option 1');
  });

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

    // Check that our onChange callback was fired only once
    expect(defaultProps.onChange.mock.calls.length).toBe(1);
  });

  it('will remove tag when close button is clicked', async () => {
    const { input, tags, container } = setup();

    await userEvent.click(input);
    await userEvent.type(input, 'Home{enter}');

    await waitFor(() => container.querySelector('.bx--tag__close-icon'));
    await userEvent.click(container.querySelector('.bx--tag__close-icon'));

    // Post-check tag count
    expect(tags.childElementCount).toEqual(0);

    // Check that onChange callback was fired twice and passed the proper value
    expect(defaultProps.onChange.mock.calls.length).toBe(2);
    expect(defaultProps.onChange.mock.calls[1][0].length).toBe(0);
  });

  it('will remove tag with keyboard tabbing and entering', async () => {
    const { input, tags } = setup();

    await userEvent.click(input);
    await userEvent.type(input, 'Home{enter}');

    expect(tags.childElementCount).toEqual(1);

    // tab over to tag and hit enter
    userEvent.tab();
    await userEvent.type(tags.querySelector('.bx--tag__close-icon'), '{enter}');

    expect(tags.childElementCount).toEqual(0);
  });

  it('will not add tag when hasMultiValue is set to false but will add to list', async () => {
    const { input, tags, list } = setup({
      hasMultiValue: false,
      initialSelectedItem: {
        id: 'option-0',
        label: 'Option 1',
      },
    });

    // Pre-check tag and list count
    expect(tags.childElementCount).toEqual(0);
    expect(list.childElementCount).toEqual(5);

    await userEvent.type(input, 'Hello {enter}');

    // Post-check tag and list count
    expect(tags.childElementCount).toEqual(0);
    expect(list.childElementCount).toEqual(6);

    // Check that our onChange callback was fired and passed the proper value
    expect(defaultProps.onChange.mock.calls.length).toBe(1);
    expect(defaultProps.onChange.mock.calls[0][0].text).toBe('Hello');
  });

  it('will add tag when keyboard is used', async () => {
    const { input, tags } = setup();

    // Pre-check tag and list count
    expect(tags.childElementCount).toEqual(0);

    await userEvent.click(input);

    fireEvent.keyDown(input, {
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: 'ArrowDown',
      which: 40,
      charCode: 40,
    });
    await userEvent.type(input, '{enter}');

    // Post-check tag and list count
    expect(tags.childElementCount).toEqual(1);

    // Check that our onChange callback was fired and passed the proper value
    expect(defaultProps.onChange.mock.calls.length).toBe(1);
    expect(defaultProps.onChange.mock.calls[0][0][0].text).toBe('Option 1');
  });
});
