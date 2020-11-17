import React, { useRef } from 'react';
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
  light: PropTypes.bool,
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
  /** The state values of the controlled form elements e.g. { title: 'My hotspot 1', description: 'Lorem ipsum' } */
  formValues: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      colorPropType,
    ])
  ),
  fontColors: PropTypes.arrayOf(colorPropType),
  backgroundColors: PropTypes.arrayOf(colorPropType),
  borderColors: PropTypes.arrayOf(colorPropType),
};

const defaultProps = {
  light: true,
  i18n: {
    boldLabel: 'Text Bold',
    italicLabel: 'Text Italic',
    underlineLabel: 'Text Underline',
    fontLabel: 'Font',
    fontSizeLabel: 'Font Size',
    fontSizeInvalid: 'Font Size is invalid',
    backgroundLabel: 'Background',
    fillOpacityLabel: 'Fill Opacity',
    fillOpacityInvalid: 'Fill Opacity is invalid',
    borderLabel: 'Border',
    borderWidthLabel: 'Border Width',
    borderWidthInvalid: 'Border Width is invalid',
  },
  formValues: {
    bold: false,
    italic: false,
    underline: false,
    font: {
      color: undefined,
      size: 12,
    },
    background: {
      color: undefined,
      opacity: 100,
    },
    border: {
      color: undefined,
      width: 1,
    },
  },
  fontColors: undefined,
  backgroundColors: undefined,
  borderColors: undefined,
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
}) => {
  const {
    boldLabel,
    italicLabel,
    underlineLabel,
    fontLabel,
    fontSizeLabel,
    fontSizeInvalid,
    backgroundLabel,
    fillOpacityLabel,
    fillOpacityInvalid,
    borderLabel,
    borderWidthLabel,
    borderWidthInvalid,
  } = merge({}, defaultProps.i18n, i18n);

  const fontSizeRef = useRef(null);
  const fillOpacityRef = useRef(null);
  const borderWidthRef = useRef(null);

  const { bold, italic, underline, font, background, border } = merge(
    {},
    defaultProps.formValues,
    formValues
  );

  return (
    <div className={className}>
      <div className={`${iotPrefix}--hotspot-text-style-tab__text-style`}>
        <IconSwitch
          onClick={() => onChange({ bold: !bold })}
          data-testid="hotspot-bold"
          selected={bold}
          text={boldLabel}
          renderIcon={TextBold}
          index={0}
          light={light}
        />
        <IconSwitch
          name="italic"
          onClick={() => onChange({ italic: !italic })}
          data-testid="hotspot-italic"
          selected={italic}
          text={italicLabel}
          renderIcon={TextItalic}
          index={1}
          light={light}
        />
        <IconSwitch
          name="underline"
          onClick={() => onChange({ underline: !underline })}
          data-testid="hotspot-underline"
          selected={underline}
          text={underlineLabel}
          renderIcon={TextUnderline}
          index={2}
          light={light}
        />
      </div>

      <div className={`${iotPrefix}--hotspot-text-style-tab__row`}>
        <ColorDropdown
          id={`${iotPrefix}--hotspot-text-style-tab__font-color`}
          titleText={fontLabel}
          light={light}
          selectedColor={font.color ?? fontColors?.[0]}
          colors={fontColors}
          onChange={(selected) => {
            onChange({ font: selected });
          }}
        />

        <NumberInput
          id={`${iotPrefix}--hotspot-text-style-tab__font-size`}
          min={0}
          max={50}
          value={font.size}
          step={1}
          light={light}
          label={fontSizeLabel}
          invalidText={fontSizeInvalid}
          ref={fontSizeRef}
          onChange={() => {
            onChange({ font: { size: fontSizeRef.current.value } });
          }}
        />
      </div>

      <div className={`${iotPrefix}--hotspot-text-style-tab__row`}>
        <ColorDropdown
          id={`${iotPrefix}--hotspot-text-style-tab__background-color`}
          titleText={backgroundLabel}
          light={light}
          selectedColor={background.color ?? backgroundColors?.[0]}
          colors={backgroundColors}
          onChange={(selected) => {
            onChange({
              background: selected,
            });
          }}
        />

        <NumberInput
          id={`${iotPrefix}--hotspot-text-style-tab__background`}
          label={fillOpacityLabel}
          min={0}
          max={100}
          value={background.opacity}
          ref={fillOpacityRef}
          step={1}
          light={light}
          invalidText={fillOpacityInvalid}
          onChange={() => {
            onChange({
              background: { opacity: fillOpacityRef.current.value },
            });
          }}
        />
      </div>

      <div className={`${iotPrefix}--hotspot-text-style-tab__row`}>
        <ColorDropdown
          id={`${iotPrefix}--hotspot-text-style-tab__border-color`}
          titleText={borderLabel}
          light={light}
          colors={borderColors}
          onChange={(selected) => {
            onChange({ border: selected });
          }}
          selectedColor={border.color ?? borderColors?.[0]}
        />

        <NumberInput
          id={`${iotPrefix}--hotspot-text-style-tab__border`}
          label={borderWidthLabel}
          min={0}
          max={15}
          value={border.width}
          ref={borderWidthRef}
          step={1}
          light={light}
          invalidText={borderWidthInvalid}
          onChange={() => {
            onChange({ border: { width: borderWidthRef.current.value } });
          }}
        />
      </div>
    </div>
  );
};

HotspotTextStyleTab.propTypes = propTypes;
HotspotTextStyleTab.defaultProps = defaultProps;

export default HotspotTextStyleTab;
