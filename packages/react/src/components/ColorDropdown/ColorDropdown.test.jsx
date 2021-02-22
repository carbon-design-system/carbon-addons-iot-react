import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { red50, blue50, green50 } from '@carbon/colors';

import { settings } from '../../constants/Settings';
import { hexToRgb } from '../../utils/componentUtilityFunctions';

import ColorDropdown from './ColorDropdown';

const { iotPrefix } = settings;

describe('ColorDropdown', () => {
  const getColors = () => [
    { id: red50, text: 'red' },
    { id: green50, text: 'green' },
    { id: blue50, text: 'blue' },
  ];

  const getHexColor = (text) => getColors().find((obj) => obj.text === text).id;

  const hexToRgbStyle = (hexColor) => {
    const { r, g, b } = hexToRgb(hexColor);
    return `rgb(${r}, ${g}, ${b})`;
  };

  it('renders default labels', () => {
    render(<ColorDropdown id="myColorDropdown" />);

    expect(screen.getAllByLabelText('Color')[0]).toBeVisible();
    expect(screen.getByPlaceholderText('Filter colors')).toBeVisible();
  });

  it('renders custom labels', () => {
    const i18n = {
      helperText: 'my label',
      titleText: 'My title text',
      placeholder: 'my placeholder',
    };
    render(<ColorDropdown id="myColorDropdown" i18n={i18n} />);

    expect(screen.getAllByLabelText(i18n.titleText)[0]).toBeVisible();
    expect(screen.getByText(i18n.helperText)).toBeVisible();
    expect(screen.getByPlaceholderText(i18n.placeholder)).toBeVisible();
  });

  it('renders preset color and shows selected color sample', () => {
    render(
      <ColorDropdown
        colors={getColors()}
        selectedColor={{ id: green50, text: 'green' }}
        id="myColorDropdown"
      />
    );
    userEvent.click(screen.getByPlaceholderText('Filter colors'));
    expect(screen.getByText('green')).toBeVisible();
  });

  it('renders the selected value correctly', () => {
    const onChange = jest.fn();
    render(<ColorDropdown id="myColorDropdown" colors={getColors()} onChange={onChange} />);
    userEvent.click(screen.getByPlaceholderText('Filter colors'));

    const firstItem = screen.getAllByRole('option')[0];
    expect(within(firstItem).getByText('red')).toBeVisible();
    userEvent.click(firstItem);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByPlaceholderText('Filter colors').value).toBe('red');
  });

  it('renders the selectable items correctly', () => {
    const onChange = jest.fn();
    render(<ColorDropdown id="myColorDropdown" colors={getColors()} onChange={onChange} />);
    userEvent.click(screen.getByPlaceholderText('Filter colors'));

    const firstItem = screen.getAllByRole('option')[0];
    const firstColorSample = within(firstItem).getByTitle(getHexColor('red'));
    expect(within(firstItem).getByText('red')).toBeVisible();
    expect(firstColorSample).toHaveClass(`${iotPrefix}--color-dropdown__color-sample`);
    expect(firstColorSample).toHaveStyle({
      backgroundColor: hexToRgbStyle(getHexColor('red')),
    });

    const secondItem = screen.getAllByRole('option')[1];
    const secondColorSample = within(secondItem).getByTitle(getHexColor('green'));
    expect(within(secondItem).getByText('green')).toBeVisible();
    expect(secondColorSample).toHaveClass(`${iotPrefix}--color-dropdown__color-sample`);
    expect(secondColorSample).toHaveStyle({
      backgroundColor: hexToRgbStyle(getHexColor('green')),
    });
  });

  it('calls onChange with the selected color when a color is selected', () => {
    const onChange = jest.fn();
    render(<ColorDropdown colors={getColors()} id="myColorDropdown" onChange={onChange} />);
    userEvent.click(screen.getByPlaceholderText('Filter colors'));
    const firstItem = screen.getAllByRole('option')[0];
    userEvent.click(firstItem);

    expect(onChange).toHaveBeenCalledWith({ id: getHexColor('red'), text: 'red' });
  });
});
