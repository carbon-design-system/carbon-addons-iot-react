import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  purple70,
  cyan50,
  teal70,
  magenta70,
  red50,
  red90,
  green60,
  blue80,
  magenta50,
  purple50,
  teal50,
  cyan90,
} from '@carbon/colors';

import { ComboBox } from '../../index';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const colorPropType = PropTypes.shape({
  id: PropTypes.string,
  text: PropTypes.string,
});

const propTypes = {
  /** Array of colors to be shown */
  colors: PropTypes.arrayOf(colorPropType),
  /** True if the dropdown should hide the color names that display next to the color box */
  hideLabels: PropTypes.bool,
  /** Required Id string */
  id: PropTypes.string.isRequired,
  /** True if the light theme is to be used, defaults to false */
  light: PropTypes.bool,
  /** Callback for when any of the Dropdown color value changes */
  onChange: PropTypes.func,
  /** Callback to translate common strings */
  translateWithId: PropTypes.func,
  /** The selected color, use to set initial color */
  selectedColor: colorPropType,
  /** Id used if needed for testing */
  testID: PropTypes.string,
  /** Optionally allows user to type a custom color and add it as an option */
  allowCustomColors: PropTypes.bool,
  i18n: PropTypes.shape({
    helperText: PropTypes.string,
    placeholder: PropTypes.string,
    titleText: PropTypes.string,
    invalidText: PropTypes.string,
  }),
  disabled: PropTypes.bool,
};

const defaultProps = {
  colors: [
    { id: purple70, text: 'purple70' },
    { id: cyan50, text: 'cyan50' },
    { id: teal70, text: 'teal70' },
    { id: magenta70, text: 'magenta70' },
    { id: red50, text: 'red50' },
    { id: red90, text: 'red90' },
    { id: green60, text: 'green60' },
    { id: blue80, text: 'blue80' },
    { id: magenta50, text: 'magenta50' },
    { id: purple50, text: 'purple50' },
    { id: teal50, text: 'teal50' },
    { id: cyan90, text: 'cyan90' },
  ],
  hideLabels: false,
  light: false,
  selectedColor: undefined,
  testID: undefined,
  translateWithId: undefined,
  allowCustomColors: false,
  i18n: {
    titleText: 'Color',
    helperText: '',
    placeholder: 'Filter colors',
    invalidText: 'Invalid color',
  },
  onChange: null,
  disabled: false,
};

const validCarbonColors = [
  'purple70',
  'cyan50',
  'teal70',
  'magenta70',
  'red50',
  'red90',
  'green60',
  'blue80',
  'magenta50',
  'purple50',
  'teal50',
  'cyan90',
];

const isValidColor = (color) => {
  const s = new Option().style;
  s.color = color;
  return s.color === color;
};

const isCarbonColor = (color) => {
  return validCarbonColors.includes(color);
};

const ColorDropdown = ({
  colors,
  id,
  hideLabels,
  light,
  onChange,
  selectedColor,
  testID,
  translateWithId,
  i18n,
  allowCustomColors,
  disabled,
}) => {
  const mergedI18n = useMemo(() => ({ ...defaultProps.i18n, ...i18n }), [i18n]);
  const [invalid, setInvalid] = useState(false);
  const [items, setItems] = useState(colors);

  useEffect(
    () => {
      // if the initial selected color is a custom color, need to add it into the options
      // so that we can show the item correctly
      if (
        selectedColor &&
        allowCustomColors &&
        !colors.find((color) => color.id === selectedColor.id)
      ) {
        const newItems = [...items];
        newItems.push(selectedColor);
        setItems(newItems);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedColor, colors]
  );

  /**
   * Renders a color square and color name
   * @param {Object} item {id: string, text: string}
   */
  const renderColorItem = (item) => {
    const backgroundColor = allowCustomColors
      ? isCarbonColor(item.text)
        ? item.id
        : item.text
      : item.id;
    return item ? (
      <div title={`${item.text}`} className={`${iotPrefix}--color-dropdown__item`}>
        <div className={`${iotPrefix}--color-dropdown__item-border`}>
          <div
            title={`${item.id}`}
            className={`${iotPrefix}--color-dropdown__color-sample`}
            style={{ backgroundColor }}
          />
          {!hideLabels && (
            <div className={`${iotPrefix}--color-dropdown__color-name`}>{item.text}</div>
          )}
        </div>
      </div>
    ) : (
      ''
    );
  };

  const handleOnChange = (inputItem) => {
    if (inputItem && (isValidColor(inputItem.text) || isCarbonColor(inputItem.text))) {
      setInvalid(false);
    } else {
      setInvalid(true);
    }
    if (onChange) {
      onChange(inputItem);
    }
  };

  const handleOnInputChange = (input) => {
    if ((isValidColor(input) && input !== '') || isCarbonColor(input)) {
      setInvalid(false);
    } else {
      setInvalid(true);
    }
  };

  return (
    <ComboBox
      className={`${iotPrefix}--color-dropdown`}
      id={id}
      placeholder={mergedI18n.placeholder}
      items={items}
      itemToString={(item) => (item ? item.text : '')}
      itemToElement={renderColorItem}
      titleText={mergedI18n.titleText}
      helperText={mergedI18n.helperText}
      light={light}
      disabled={disabled}
      onChange={handleOnChange}
      onInputChange={handleOnInputChange}
      invalid={invalid}
      invalidText={invalid ? mergedI18n.invalidText : null}
      addToList
      test-id={testID}
      selectedItem={selectedColor}
      translateWithId={translateWithId}
    />
  );
};

ColorDropdown.propTypes = propTypes;
ColorDropdown.defaultProps = defaultProps;

export default ColorDropdown;
