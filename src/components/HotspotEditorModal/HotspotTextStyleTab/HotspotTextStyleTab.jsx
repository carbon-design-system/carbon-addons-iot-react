import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import { NumberInput } from 'carbon-components-react';
import {
  TextBold16 as TextBold,
  TextItalic16 as TextItalic,
  TextUnderline16 as TextUnderline,
} from '@carbon/icons-react';

import { settings } from '../../../constants/Settings';
import IconSwitch from '../../IconSwitch/IconSwitch';
import ColorDropdown from '../../ColorDropdown/ColorDropdown';

const { iotPrefix } = settings;

const colorPropType = PropTypes.shape({
  carbonColor: PropTypes.string,
  name: PropTypes.string,
});

const propTypes = {
  /**
   * Specify an optional className to be applied to the container node
   */
  className: PropTypes.string,
  /** True if the light theme is to be used, defaults to true */
  light: PropTypes.bool,
  /** set of internationalized labels */
  i18n: PropTypes.shape({
    boldLabel: PropTypes.string,
    italicLabel: PropTypes.string,
    underlineLabel: PropTypes.string,
    fontLabel: PropTypes.string,
    fontSize: PropTypes.string,
    fontSizeInvalid: PropTypes.string,
    backgroundLabel: PropTypes.string,
    fillOpacityLabel: PropTypes.string,
    fillOpacityInvalid: PropTypes.string,
    borderLabel: PropTypes.string,
    borderWidth: PropTypes.string,
    borderWidthInvalid: PropTypes.string,
  }),
  /** Callback for when any of the form element's value changes */
  onChange: PropTypes.func.isRequired,
  /** The state values of the controlled form elements, see defaults for shape */
  formValues: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      colorPropType,
    ])
  ),
  /** Array of colors to be shown for the font colors dropdown */
  fontColors: PropTypes.arrayOf(colorPropType),
  /** Array of colors to be shown for the background colors dropdown */
  backgroundColors: PropTypes.arrayOf(colorPropType),
  /** Array of colors to be shown for the border colors dropdown */
  borderColors: PropTypes.arrayOf(colorPropType),
  /** Minimum Font size */
  minFontSize: PropTypes.number,
  /** Maximum Font size */
  maxFontSize: PropTypes.number,
  /** Minimum Opacity Value */
  minOpacity: PropTypes.number,
  /** Maximum Opacity Value */
  maxOpacity: PropTypes.number,
  /** Minimum Border Width */
  minBorderWidth: PropTypes.number,
  /** Maximum Border Width */
  maxBorderWidth: PropTypes.number,
};

const defaultProps = {
  className: '',
  light: true,
  i18n: {
    boldLabelText: 'Text Bold',
    italicLabelText: 'Text Italic',
    underlineLabelText: 'Text Underline',
    fontLabelText: 'Font',
    fontSizeLabelText: 'Font Size',
    fontSizeInvalidText: 'Font Size is invalid',
    backgroundLabelText: 'Background',
    fillOpacityLabelText: 'Fill Opacity',
    fillOpacityInvalidText: 'Fill Opacity is invalid',
    borderLabelText: 'Border',
    borderWidthLabelText: 'Border Width',
    borderWidthInvalidText: 'Border Width is invalid',
  },
  formValues: {
    bold: false,
    italic: false,
    underline: false,
    fontColor: undefined,
    fontSize: undefined,
    backgroundColor: undefined,
    backgroundOpacity: undefined,
    borderColor: undefined,
    borderWidth: undefined,
  },
  fontColors: undefined,
  backgroundColors: undefined,
  borderColors: undefined,
  minFontSize: 1,
  maxFontSize: 50,
  minOpacity: 0,
  maxOpacity: 100,
  minBorderWidth: 0,
  maxBorderWidth: 15,
};

/* this component is only used internally where props are defined and set. */
const HotspotTextStyleTab = ({
  className,
  fontColors,
  backgroundColors,
  borderColors,
  formValues,
  light,
  i18n,
  onChange,
  minFontSize,
  maxFontSize,
  minOpacity,
  maxOpacity,
  minBorderWidth,
  maxBorderWidth,
}) => {
  const {
    boldLabelText,
    italicLabelText,
    underlineLabelText,
    fontLabelText,
    fontSizeLabelText,
    fontSizeInvalidText,
    backgroundLabelText,
    fillOpacityLabelText,
    fillOpacityInvalidText,
    borderLabelText,
    borderWidthLabelText,
    borderWidthInvalidText,
  } = merge({}, defaultProps.i18n, i18n);

  const {
    bold,
    italic,
    underline,
    fontSize,
    fontColor,
    backgroundColor,
    backgroundOpacity,
    borderColor,
    borderWidth,
  } = formValues;

  return (
    <div className={className}>
      <div className={`${iotPrefix}--hotspot-text-style-tab__text-style`}>
        <IconSwitch
          onClick={() => onChange({ bold: !bold })}
          data-testid="hotspot-bold"
          selected={bold}
          text={boldLabelText}
          renderIcon={TextBold}
          index={0}
          light={light}
        />
        <IconSwitch
          name="italic"
          onClick={() => onChange({ italic: !italic })}
          data-testid="hotspot-italic"
          selected={italic}
          text={italicLabelText}
          renderIcon={TextItalic}
          index={1}
          light={light}
        />
        <IconSwitch
          name="underline"
          onClick={() => onChange({ underline: !underline })}
          data-testid="hotspot-underline"
          selected={underline}
          text={underlineLabelText}
          renderIcon={TextUnderline}
          index={2}
          light={light}
        />
      </div>

      <div className={`${iotPrefix}--hotspot-text-style-tab__row`}>
        <ColorDropdown
          id={`${iotPrefix}--hotspot-text-style-tab__font-color`}
          titleText={fontLabelText}
          light={light}
          selectedColor={fontColor}
          colors={fontColors}
          onChange={(selected) => {
            onChange({ fontColor: selected.color });
          }}
        />

        <NumberInput
          id={`${iotPrefix}--hotspot-text-style-tab__font-size`}
          min={minFontSize}
          max={maxFontSize}
          value={fontSize}
          step={1}
          light={light}
          label={fontSizeLabelText}
          invalidText={fontSizeInvalidText}
          onChange={(event) => {
            onChange({ fontSize: event.imaginaryTarget.value });
          }}
        />
      </div>

      <div className={`${iotPrefix}--hotspot-text-style-tab__row`}>
        <ColorDropdown
          id={`${iotPrefix}--hotspot-text-style-tab__background-color`}
          titleText={backgroundLabelText}
          light={light}
          selectedColor={backgroundColor}
          colors={backgroundColors}
          onChange={(selected) => {
            onChange({
              backgroundColor: selected.color,
            });
          }}
        />

        <NumberInput
          id={`${iotPrefix}--hotspot-text-style-tab__background`}
          label={fillOpacityLabelText}
          min={minOpacity}
          max={maxOpacity}
          value={backgroundOpacity}
          step={1}
          light={light}
          invalidText={fillOpacityInvalidText}
          onChange={(event) => {
            onChange({
              backgroundOpacity: event.imaginaryTarget.value,
            });
          }}
        />
      </div>

      <div className={`${iotPrefix}--hotspot-text-style-tab__row`}>
        <ColorDropdown
          id={`${iotPrefix}--hotspot-text-style-tab__border-color`}
          titleText={borderLabelText}
          light={light}
          colors={borderColors}
          onChange={(selected) => {
            onChange({ borderColor: selected.color });
          }}
          selectedColor={borderColor}
        />

        <NumberInput
          id={`${iotPrefix}--hotspot-text-style-tab__border`}
          label={borderWidthLabelText}
          min={minBorderWidth}
          max={maxBorderWidth}
          value={borderWidth}
          step={1}
          light={light}
          invalidText={borderWidthInvalidText}
          onChange={(event) => {
            onChange({ borderWidth: event.imaginaryTarget.value });
          }}
        />
      </div>
    </div>
  );
};

HotspotTextStyleTab.propTypes = propTypes;
HotspotTextStyleTab.defaultProps = defaultProps;

export default HotspotTextStyleTab;
