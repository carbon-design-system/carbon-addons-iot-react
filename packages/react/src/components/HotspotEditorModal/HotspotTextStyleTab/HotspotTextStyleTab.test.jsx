import React from 'react';
import merge from 'lodash/merge';
import { render, fireEvent, screen } from '@testing-library/react';
import { purple70, cyan50, teal70 } from '@carbon/colors';

import HotspotTextStyleTab from './HotspotTextStyleTab';

const colors = [
  { id: purple70, text: 'purple70' },
  { id: cyan50, text: 'cyan50' },
  { id: teal70, text: 'teal70' },
];

describe('HotspotTextStyleTab', () => {
  const mockOnDelete = jest.fn();
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
        translateWithId={jest.fn()}
        onDelete={mockOnDelete}
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
    let formValues = {
      fontColor: colors[0],
      backgroundColor: colors[0],
      borderColor: colors[0],
    };

    render(
      <HotspotTextStyleTab
        fontColors={colors}
        backgroundColors={colors}
        borderColors={colors}
        formValues={formValues}
        onChange={(change) => {
          formValues = merge({}, formValues, change);
        }}
        translateWithId={jest.fn()}
        onDelete={mockOnDelete}
      />
    );

    const dropdowns = screen.getAllByText(colors[0].text);

    fireEvent.click(dropdowns[0]);
    fireEvent.click(screen.getAllByText(colors[1].text)[0]);

    fireEvent.click(dropdowns[1]);
    fireEvent.click(screen.getAllByText(colors[1].text)[1]);

    fireEvent.click(dropdowns[2]);
    fireEvent.click(screen.getAllByText(colors[1].text)[2]);

    expect(formValues.fontColor).toEqual(colors[1].id);
    expect(formValues.backgroundColor).toEqual(colors[1].id);
    expect(formValues.borderColor).toEqual(colors[1].id);
  });

  it('handles number input updates', () => {
    let formValues = {
      fontSize: '12',
      backgroundOpacity: '99',
      borderWidth: '1',
    };

    render(
      <HotspotTextStyleTab
        fontColors={colors}
        backgroundColors={colors}
        borderColors={colors}
        formValues={formValues}
        onChange={(change) => {
          formValues = merge({}, formValues, change);
        }}
        translateWithId={jest.fn()}
        onDelete={mockOnDelete}
      />
    );

    const incrementButtons = screen.getAllByTitle('Increment number');
    const decrementButtons = screen.getAllByTitle('Decrement number');

    fireEvent.click(incrementButtons[0]);
    fireEvent.click(incrementButtons[1]);
    fireEvent.click(incrementButtons[2]);

    expect(formValues.fontSize).toEqual(13);
    expect(formValues.backgroundOpacity).toEqual(100);
    expect(formValues.borderWidth).toEqual(2);

    fireEvent.click(decrementButtons[0]);
    fireEvent.click(decrementButtons[1]);
    fireEvent.click(decrementButtons[2]);

    expect(formValues.fontSize).toEqual(12);
    expect(formValues.backgroundOpacity).toEqual(99);
    expect(formValues.borderWidth).toEqual(1);
  });

  it('renders preset color string value', () => {
    const colorObj = colors[1];
    const colorString = colorObj.id;

    render(
      <HotspotTextStyleTab
        fontColors={colors}
        backgroundColors={colors}
        borderColors={colors}
        formValues={{ fontColor: colorString }}
        onChange={() => {}}
        translateWithId={jest.fn()}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(colorObj.name)).toBeVisible();
  });
});
