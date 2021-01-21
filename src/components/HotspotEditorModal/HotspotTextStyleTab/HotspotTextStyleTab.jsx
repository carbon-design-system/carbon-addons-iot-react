import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import { NumberInput } from 'carbon-components-react';
import {
  TrashCan32,
  InformationFilled24,
  TextBold16 as TextBold,
  TextItalic16 as TextItalic,
  TextUnderline16 as TextUnderline,
} from '@carbon/icons-react';

import { settings } from '../../../constants/Settings';
import IconSwitch from '../../IconSwitch/IconSwitch';
import ColorDropdown from '../../ColorDropdown/ColorDropdown';
import Button from '../../Button/Button';

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
    boldLabelText: PropTypes.string,
    infoMessageText: PropTypes.string,
    italicLabelText: PropTypes.string,
    underlineLabelText: PropTypes.string,
    fontColorLabelText: PropTypes.string,
    fontSizeInvalidText: PropTypes.string,
    backgroundLabelText: PropTypes.string,
    fillOpacityLabelText: PropTypes.string,
    fillOpacityInvalidText: PropTypes.string,
    borderLabelText: PropTypes.string,
    borderWidthInvalidText: PropTypes.string,
    deleteButtonLabelText: PropTypes.string,
    deleteButtonIconDescription: PropTypes.string,
  }),
  translateWithId: PropTypes.func.isRequired,
  /** Callback for when any of the form element's value changes */
  onChange: PropTypes.func.isRequired,
  /** Callback for when the delete button is clicked */
  onDelete: PropTypes.func.isRequired,
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
  /** Set to true to hide all form elements and show the info message */
  showInfoMessage: PropTypes.bool,
};

const defaultProps = {
  className: '',
  light: true,
  i18n: {
    boldLabelText: 'Text Bold',
    infoMessageText:
      'Select an existing label on the image to edit it or hold the CTRL key and click on an empty region to create one',
    italicLabelText: 'Text Italic',
    underlineLabelText: 'Text Underline',
    fontColorLabelText: 'Font color',
    fontSizeLabelText: 'Font Size',
    fontSizeInvalidText: 'Font Size is invalid',
    backgroundLabelText: 'Background',
    fillOpacityLabelText: 'Fill Opacity',
    fillOpacityInvalidText: 'Fill Opacity is invalid',
    borderLabelText: 'Border',
    borderWidthLabelText: 'Border Width',
    borderWidthInvalidText: 'Border Width is invalid',
    deleteButtonLabelText: 'Delete hotspot',
    deleteButtonIconDescription: 'Delete this hotspot',
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
  minFontSize: undefined,
  maxFontSize: undefined,
  minOpacity: undefined,
  maxOpacity: undefined,
  minBorderWidth: undefined,
  maxBorderWidth: undefined,
  showInfoMessage: false,
};

const getSelectedColorItem = (color, colorCollection) => {
  return typeof color === 'string' && Array.isArray(colorCollection)
    ? colorCollection.find((colorObj) => colorObj.carbonColor === color)
    : color;
};

const getIntOrUndefined = (value) => {
  return value === '' ? undefined : parseInt(value, 10);
};

const preventFormSubmission = (e) => e.preventDefault();

/**
 * This component renders a form that allows the user to change the style of the text type hotspots
 */
const HotspotTextStyleTab = ({
  className,
  fontColors,
  backgroundColors,
  borderColors,
  formValues,
  light,
  i18n,
  onChange,
  onDelete,
  minFontSize,
  maxFontSize,
  minOpacity,
  maxOpacity,
  minBorderWidth,
  maxBorderWidth,
  showInfoMessage,
  translateWithId,
}) => {
  const {
    boldLabelText,
    infoMessageText,
    italicLabelText,
    underlineLabelText,
    fontColorLabelText,
    fontSizeLabelText,
    fontSizeInvalidText,
    backgroundLabelText,
    fillOpacityLabelText,
    fillOpacityInvalidText,
    borderLabelText,
    borderWidthLabelText,
    borderWidthInvalidText,
    deleteButtonLabelText,
    deleteButtonIconDescription,
    selectAColor,
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

  const renderInfoMessage = () => (
    <div className={`${iotPrefix}--hotspot-editor--text-info-message`}>
      <InformationFilled24 />
      <p>{infoMessageText}</p>
    </div>
  );

  return (
    <div className={className}>
      {showInfoMessage ? (
        renderInfoMessage()
      ) : (
        <>
          <form
            onSubmit={preventFormSubmission}
            className={`${iotPrefix}--hotspot-text-style-tab__form`}>
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
                key={fontColor?.carbonColor ?? fontColor}
                id={`${iotPrefix}--hotspot-text-style-tab__font-color`}
                titleText={fontColorLabelText}
                light={light}
                label={selectAColor}
                selectedColor={getSelectedColorItem(fontColor, fontColors)}
                colors={fontColors}
                onChange={(selected) => {
                  onChange({ fontColor: selected.color.carbonColor });
                }}
                translateWithId={translateWithId}
              />

              <NumberInput
                allowEmpty
                id={`${iotPrefix}--hotspot-text-style-tab__font-size`}
                min={minFontSize}
                max={maxFontSize}
                value={fontSize}
                step={1}
                light={light}
                label={fontSizeLabelText}
                invalidText={fontSizeInvalidText}
                onChange={(event) => {
                  onChange({
                    fontSize: getIntOrUndefined(event.imaginaryTarget.value),
                  });
                }}
              />
            </div>

            <div className={`${iotPrefix}--hotspot-text-style-tab__row`}>
              <ColorDropdown
                key={backgroundColor?.carbonColor ?? backgroundColor}
                id={`${iotPrefix}--hotspot-text-style-tab__background-color`}
                titleText={backgroundLabelText}
                light={light}
                label={selectAColor}
                selectedColor={getSelectedColorItem(
                  backgroundColor,
                  backgroundColors
                )}
                colors={backgroundColors}
                onChange={(selected) => {
                  onChange({
                    backgroundColor: selected.color.carbonColor,
                  });
                }}
                translateWithId={translateWithId}
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
                    backgroundOpacity: getIntOrUndefined(
                      event.imaginaryTarget.value
                    ),
                  });
                }}
              />
            </div>

            <div className={`${iotPrefix}--hotspot-text-style-tab__row`}>
              <ColorDropdown
                key={borderColor?.carbonColor ?? borderColor}
                id={`${iotPrefix}--hotspot-text-style-tab__border-color`}
                titleText={borderLabelText}
                light={light}
                label={i18n.selectAColor}
                colors={borderColors}
                onChange={(selected) => {
                  onChange({ borderColor: selected.color.carbonColor });
                }}
                translateWithId={translateWithId}
                selectedColor={getSelectedColorItem(borderColor, borderColors)}
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
                  onChange({
                    borderWidth: getIntOrUndefined(event.imaginaryTarget.value),
                  });
                }}
              />
            </div>
          </form>
          <div
            className={`${iotPrefix}--hotspot-text-style-tab__delete-button-container`}>
            <Button
              kind="ghost"
              renderIcon={TrashCan32}
              iconDescription={deleteButtonIconDescription}
              onClick={onDelete}>
              {deleteButtonLabelText}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

HotspotTextStyleTab.propTypes = propTypes;
HotspotTextStyleTab.defaultProps = defaultProps;

export default HotspotTextStyleTab;
