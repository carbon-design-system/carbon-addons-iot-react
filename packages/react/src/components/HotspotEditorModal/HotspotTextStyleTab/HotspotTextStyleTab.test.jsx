import React from 'react';
import merge from 'lodash/merge';
import { render, screen } from '@testing-library/react';
import { purple70, cyan50, teal70 } from '@carbon/colors';
import userEvent from '@testing-library/user-event';

import HotspotTextStyleTab from './HotspotTextStyleTab';

const colors = [
  { carbonColor: purple70, name: 'purple70' },
  { carbonColor: cyan50, name: 'cyan50' },
  { carbonColor: teal70, name: 'teal70' },
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

    userEvent.click(boldButton);
    userEvent.click(italicButton);
    userEvent.click(underlineButton);

    expect(formValues.bold).toBe(true);
    expect(formValues.italic).toBe(true);
    expect(formValues.underline).toBe(true);
  });

  it('disables input controls when content is an element', () => {
    render(
      <HotspotTextStyleTab
        fontColors={colors}
        backgroundColors={colors}
        borderColors={colors}
        formValues={{ content: <span>I am an element</span> }}
        onChange={() => {}}
        translateWithId={jest.fn()}
        onDelete={() => {}}
      />
    );

    expect(screen.getByTestId('hotspot-bold')).toBeDisabled();
    expect(screen.getByTestId('hotspot-italic')).toBeDisabled();
    expect(screen.getByTestId('hotspot-underline')).toBeDisabled();

    expect(screen.getByRole('button', { name: 'Font color Select a color' })).toBeDisabled();
    expect(screen.getByRole('spinbutton', { name: 'Font Size' })).toBeDisabled();
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

    const dropdowns = screen.getAllByText(colors[0].name);

    userEvent.click(dropdowns[0]);
    userEvent.click(screen.getAllByText(colors[1].name)[0]);

    userEvent.click(dropdowns[1]);
    userEvent.click(screen.getAllByText(colors[1].name)[1]);

    userEvent.click(dropdowns[2]);
    userEvent.click(screen.getAllByText(colors[1].name)[2]);

    expect(formValues.fontColor).toEqual(colors[1].carbonColor);
    expect(formValues.backgroundColor).toEqual(colors[1].carbonColor);
    expect(formValues.borderColor).toEqual(colors[1].carbonColor);
  });

  it('only calls onChange for font size when input is within defined range', () => {
    const { i18n } = HotspotTextStyleTab.defaultProps;
    const onChangeMock = jest.fn();
    render(
      <HotspotTextStyleTab
        fontColors={colors}
        backgroundColors={colors}
        borderColors={colors}
        formValues={{ fontSize: 5 }}
        minFontSize={5}
        maxFontSize={8}
        onChange={onChangeMock}
        translateWithId={jest.fn()}
        onDelete={mockOnDelete}
      />
    );

    userEvent.type(
      screen.getByRole('spinbutton', { name: i18n.fontSizeLabelText }),
      '{backspace}4'
    );
    expect(onChangeMock).not.toHaveBeenCalled();

    userEvent.type(
      screen.getByRole('spinbutton', { name: i18n.fontSizeLabelText }),
      '{backspace}5'
    );
    expect(onChangeMock).toHaveBeenCalledWith({ fontSize: 5 });

    userEvent.type(
      screen.getByRole('spinbutton', { name: i18n.fontSizeLabelText }),
      '{backspace}8'
    );
    expect(onChangeMock).toHaveBeenCalledWith({ fontSize: 8 });

    userEvent.type(
      screen.getByRole('spinbutton', { name: i18n.fontSizeLabelText }),
      '{backspace}9'
    );
    expect(onChangeMock).not.toHaveBeenCalledWith({ fontSize: 9 });
  });

  it('only calls onChange for border width when input is within defined range', () => {
    const { i18n } = HotspotTextStyleTab.defaultProps;
    const onChangeMock = jest.fn();
    render(
      <HotspotTextStyleTab
        fontColors={colors}
        backgroundColors={colors}
        borderColors={colors}
        formValues={{ borderWidth: 5 }}
        minBorderWidth={5}
        maxBorderWidth={8}
        onChange={onChangeMock}
        translateWithId={jest.fn()}
        onDelete={mockOnDelete}
      />
    );

    userEvent.type(
      screen.getByRole('spinbutton', { name: i18n.borderWidthLabelText }),
      '{backspace}4'
    );
    expect(onChangeMock).not.toHaveBeenCalled();

    userEvent.type(
      screen.getByRole('spinbutton', { name: i18n.borderWidthLabelText }),
      '{backspace}5'
    );
    expect(onChangeMock).toHaveBeenCalledWith({ borderWidth: 5 });

    userEvent.type(
      screen.getByRole('spinbutton', { name: i18n.borderWidthLabelText }),
      '{backspace}8'
    );
    expect(onChangeMock).toHaveBeenCalledWith({ borderWidth: 8 });

    userEvent.type(
      screen.getByRole('spinbutton', { name: i18n.borderWidthLabelText }),
      '{backspace}9'
    );
    expect(onChangeMock).not.toHaveBeenCalledWith({ borderWidth: 9 });
  });

  it('only calls onChange for background fill opacity when input is within defined range', () => {
    const { i18n } = HotspotTextStyleTab.defaultProps;
    const onChangeMock = jest.fn();
    render(
      <HotspotTextStyleTab
        fontColors={colors}
        backgroundColors={colors}
        borderColors={colors}
        formValues={{ backgroundOpacity: 1 }}
        minOpacity={5}
        maxOpacity={8}
        onChange={onChangeMock}
        translateWithId={jest.fn()}
        onDelete={mockOnDelete}
      />
    );

    userEvent.type(
      screen.getByRole('spinbutton', { name: i18n.fillOpacityLabelText }),
      '{backspace}4'
    );
    expect(onChangeMock).not.toHaveBeenCalled();

    userEvent.type(
      screen.getByRole('spinbutton', { name: i18n.fillOpacityLabelText }),
      '{backspace}5'
    );
    expect(onChangeMock).toHaveBeenCalledWith({ backgroundOpacity: 5 });

    userEvent.type(
      screen.getByRole('spinbutton', { name: i18n.fillOpacityLabelText }),
      '{backspace}8'
    );
    expect(onChangeMock).toHaveBeenCalledWith({ backgroundOpacity: 8 });

    userEvent.type(
      screen.getByRole('spinbutton', { name: i18n.fillOpacityLabelText }),
      '{backspace}9'
    );
    expect(onChangeMock).not.toHaveBeenCalledWith({ backgroundOpacity: 9 });
  });

  it('handles number input updates', () => {
    let formValues = {
      fontSize: 12,
      backgroundOpacity: 99,
      borderWidth: 1,
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

    userEvent.click(incrementButtons[0]);
    userEvent.click(incrementButtons[1]);
    userEvent.click(incrementButtons[2]);

    expect(formValues.fontSize).toEqual(13);
    expect(formValues.backgroundOpacity).toEqual(100);
    expect(formValues.borderWidth).toEqual(2);

    userEvent.click(decrementButtons[0]);
    userEvent.click(decrementButtons[1]);
    userEvent.click(decrementButtons[2]);

    expect(formValues.fontSize).toEqual(12);
    expect(formValues.backgroundOpacity).toEqual(99);
    expect(formValues.borderWidth).toEqual(1);
  });

  it('renders preset color string value', () => {
    const colorObj = colors[1];
    const colorString = colorObj.carbonColor;

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
