import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'carbon-components-react';
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

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const colorPropType = PropTypes.shape({
  carbonColor: PropTypes.string,
  name: PropTypes.string,
});

const propTypes = {
  colors: PropTypes.arrayOf(colorPropType),
  /** Internationalisation strings */
  label: PropTypes.string,
  titleText: PropTypes.string,
  id: PropTypes.string.isRequired,
  light: PropTypes.bool,
  /** Callback for when any of the Dropdown color value changes */
  onChange: PropTypes.func.isRequired,
  selectedColor: colorPropType,
  testID: PropTypes.string,
};

const defaultProps = {
  colors: [
    { carbonColor: purple70, name: 'purple70' },
    { carbonColor: cyan50, name: 'cyan50' },
    { carbonColor: teal70, name: 'teal70' },
    { carbonColor: magenta70, name: 'magenta70' },
    { carbonColor: red50, name: 'red50' },
    { carbonColor: red90, name: 'red90' },
    { carbonColor: green60, name: 'green60' },
    { carbonColor: blue80, name: 'blue80' },
    { carbonColor: magenta50, name: 'magenta50' },
    { carbonColor: purple50, name: 'purple50' },
    { carbonColor: teal50, name: 'teal50' },
    { carbonColor: cyan90, name: 'cyan90' },
  ],
  label: 'Select a color',
  light: false,
  selectedColor: undefined,
  testID: undefined,
  titleText: 'Color',
};

const ColorDropdown = ({
  colors,
  id,
  label,
  light,
  onChange,
  selectedColor,
  titleText,
  testID,
}) => {
  const renderColorItem = (item) => {
    return (
      <div
        title={`${item.name}`}
        className={`${iotPrefix}--color-dropdown__item`}>
        <div
          title={`${item.carbonColor}`}
          className={`${iotPrefix}--color-dropdown__color-sample`}
          style={{ backgroundColor: item.carbonColor }}
        />
        <div className={`${iotPrefix}--color-dropdown__color-name`}>
          {item.name}
        </div>
      </div>
    );
  };

  return (
    <Dropdown
      className={`${iotPrefix}--color-dropdown`}
      id={id}
      itemToString={renderColorItem}
      items={colors}
      label={label}
      light={light}
      onChange={(change) => {
        onChange({ color: change.selectedItem });
      }}
      selectedItem={selectedColor}
      titleText={titleText}
      type="default"
      test-id={testID}
    />
  );
};

ColorDropdown.propTypes = propTypes;
ColorDropdown.defaultProps = defaultProps;

export default ColorDropdown;
