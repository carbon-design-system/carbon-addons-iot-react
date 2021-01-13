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
    { carbonColor: red50, name: 'red' },
    { carbonColor: green50, name: 'green' },
    { carbonColor: blue50, name: 'blue' },
  ];

  const getHexColor = (name) =>
    getColors().find((obj) => obj.name === name).carbonColor;

  const hexToRgbStyle = (hexColor) => {
    const { r, g, b } = hexToRgb(hexColor);
    return `rgb(${r}, ${g}, ${b})`;
  };

  it('renders default labels', () => {
    render(<ColorDropdown id="myColorDropdown" onChange={() => {}} />);

    expect(
      within(screen.getByRole('button')).getByText('Select a color')
    ).toBeTruthy();

    expect(screen.getByText('Color')).toBeVisible();
  });

  it('renders custom labels', () => {
    const label = 'my label';
    const titleText = 'My title text';
    render(
      <ColorDropdown
        id="myColorDropdown"
        label={label}
        titleText={titleText}
        onChange={() => {}}
      />
    );

    expect(within(screen.getByRole('button')).getByText(label)).toBeTruthy();
    expect(screen.getByText(titleText)).toBeVisible();
  });

  it('renders preset color and shows selected color sample', () => {
    render(
      <ColorDropdown
        colors={getColors()}
        selectedColor={{ carbonColor: green50, name: 'green' }}
        id="myColorDropdown"
        onChange={() => {}}
      />
    );
    const button = screen.getByRole('button');
    expect(within(button).getByText('green')).toBeVisible();
    expect(within(button).getByTitle(getHexColor('green'))).toHaveClass(
      `${iotPrefix}--color-dropdown__color-sample`
    );
  });

  it('renders the selected value correctly', () => {
    const onChange = jest.fn();
    render(
      <ColorDropdown
        id="myColorDropdown"
        colors={getColors()}
        onChange={onChange}
      />
    );
    userEvent.click(screen.getByText('Select a color'));

    const firstItem = screen.getAllByRole('option')[0];
    expect(within(firstItem).getByText('red')).toBeVisible();
    userEvent.click(firstItem);

    const button = screen.getByRole('button');
    expect(within(button).getByText('red')).toBeVisible();
    const colorSample = within(button).getByTitle(getHexColor('red'));
    expect(colorSample).toHaveClass(
      `${iotPrefix}--color-dropdown__color-sample`
    );
    expect(colorSample).toHaveStyle({
      backgroundColor: hexToRgbStyle(getHexColor('red')),
    });
  });

  it('renders the selectable items correctly', () => {
    const onChange = jest.fn();
    render(
      <ColorDropdown
        id="myColorDropdown"
        colors={getColors()}
        onChange={onChange}
      />
    );
    userEvent.click(screen.getByText('Select a color'));

    const firstItem = screen.getAllByRole('option')[0];
    const firstColorSample = within(firstItem).getByTitle(getHexColor('red'));
    expect(within(firstItem).getByText('red')).toBeVisible();
    expect(firstColorSample).toHaveClass(
      `${iotPrefix}--color-dropdown__color-sample`
    );
    expect(firstColorSample).toHaveStyle({
      backgroundColor: hexToRgbStyle(getHexColor('red')),
    });

    const secondItem = screen.getAllByRole('option')[1];
    const secondColorSample = within(secondItem).getByTitle(
      getHexColor('green')
    );
    expect(within(secondItem).getByText('green')).toBeVisible();
    expect(secondColorSample).toHaveClass(
      `${iotPrefix}--color-dropdown__color-sample`
    );
    expect(secondColorSample).toHaveStyle({
      backgroundColor: hexToRgbStyle(getHexColor('green')),
    });
  });

  it('calls onChange with the selected color when a color is selected', () => {
    const onChange = jest.fn();
    render(
      <ColorDropdown
        colors={getColors()}
        id="myColorDropdown"
        onChange={onChange}
      />
    );
    userEvent.click(screen.getByText('Select a color'));
    const firstItem = screen.getAllByRole('option')[0];
    userEvent.click(firstItem);

    expect(onChange).toHaveBeenCalledWith({
      color: { carbonColor: getHexColor('red'), name: 'red' },
    });
  });
});
