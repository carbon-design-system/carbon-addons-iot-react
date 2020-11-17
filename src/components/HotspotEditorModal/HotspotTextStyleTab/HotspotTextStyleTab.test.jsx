import React from 'react';
import merge from 'lodash/merge';
import { render, fireEvent, screen } from '@testing-library/react';
import { purple70, cyan50, teal70 } from '@carbon/colors';

import HotspotTextStyleTab from './HotspotTextStyleTab';

const colors = [
  { carbonColor: purple70, name: 'purple70' },
  { carbonColor: cyan50, name: 'cyan50' },
  { carbonColor: teal70, name: 'teal70' },
];

describe('HotspotTextStyleTab', () => {
  it('handles text styling', () => {
    let formValues = {};

    render(
      <HotspotTextStyleTab
        fontColors={colors}
        backgroundColors={colors}
        borderColors={colors}
        formValues={formValues}
        onChange={(change) => {
          formValues = merge({}, formValues, change);
        }}
      />
    );

    const boldButton = screen.getByTestId('hotspot-bold');
    const italicButton = screen.getByTestId('hotspot-italic');
    const underlineButton = screen.getByTestId('hotspot-underline');

    fireEvent.click(boldButton);
    fireEvent.click(italicButton);
    fireEvent.click(underlineButton);

    expect(formValues.bold).toBe(true);
    expect(formValues.italic).toBe(true);
    expect(formValues.underline).toBe(true);
  });

  it('handles dropdown updates', () => {
    let formValues = {};

    render(
      <HotspotTextStyleTab
        fontColors={colors}
        backgroundColors={colors}
        borderColors={colors}
        formValues={formValues}
        onChange={(change) => {
          formValues = merge({}, formValues, change);
        }}
      />
    );

    const dropdowns = screen.getAllByText(colors[0].name);

    fireEvent.click(dropdowns[0]);
    fireEvent.click(screen.getAllByText(colors[1].name)[0]);

    fireEvent.click(dropdowns[1]);
    fireEvent.click(screen.getAllByText(colors[1].name)[0]);

    fireEvent.click(dropdowns[2]);
    fireEvent.click(screen.getAllByText(colors[1].name)[0]);

    expect(formValues.font.color).toEqual(colors[1]);
    expect(formValues.background.color).toEqual(colors[1]);
    expect(formValues.border.color).toEqual(colors[1]);
  });

  it('handles number input updates', () => {
    let formValues = {};

    render(
      <HotspotTextStyleTab
        fontColors={colors}
        backgroundColors={colors}
        borderColors={colors}
        formValues={formValues}
        onChange={(change) => {
          formValues = merge({}, formValues, change);
        }}
      />
    );

    const incrementButtons = screen.getAllByTitle('Increment number');
    const decrementButtons = screen.getAllByTitle('Decrement number');

    fireEvent.click(incrementButtons[0]);
    fireEvent.click(incrementButtons[1]);
    fireEvent.click(incrementButtons[2]);

    expect(formValues.font.size).toEqual('13');
    expect(formValues.background).toBeUndefined(); // Invalid update, will be undefined
    expect(formValues.border.width).toEqual('2');

    fireEvent.click(decrementButtons[0]);
    fireEvent.click(decrementButtons[1]);
    fireEvent.click(decrementButtons[2]);

    expect(formValues.font.size).toEqual('12');
    expect(formValues.background.opacity).toEqual('99');
    expect(formValues.border.width).toEqual('1');
  });
});
