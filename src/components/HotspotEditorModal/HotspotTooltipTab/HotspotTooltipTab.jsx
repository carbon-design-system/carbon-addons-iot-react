import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import { TrashCan32, InformationFilled24 } from '@carbon/icons-react';

import Dropdown from '../../Dropdown/Dropdown';
import { TextInput } from '../../TextInput';
import { TextArea } from '../../TextArea';
import { settings } from '../../../constants/Settings';
import Button from '../../Button/Button';
import ColorDropdown from '../../ColorDropdown/ColorDropdown';
import { OverridePropTypes } from '../../../constants/SharedPropTypes';

const { iotPrefix } = settings;

const colorPropType = PropTypes.shape({
  carbonColor: PropTypes.string,
  name: PropTypes.string,
});

const iconsPropType = PropTypes.shape({
  id: PropTypes.string,
  icon: PropTypes.object,
  text: PropTypes.string,
});

const propTypes = {
  /** Array of selectable color objects */
  hotspotIconFillColors: PropTypes.arrayOf(colorPropType),
  /** Array of selectable icon objects. Use icon size 24 for the icon */
  hotspotIcons: PropTypes.arrayOf(iconsPropType),
  /** The state values of the controlled form elements e.g. { title: 'My hotspot 1', description: 'Lorem ipsum' } */
  formValues: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
      colorPropType,
    ])
  ),
  /** Internationalisation strings */
  i18n: PropTypes.shape({
    deleteButtonLabelText: PropTypes.string,
    deleteButtonIconDescription: PropTypes.string,
    titleInputLabelText: PropTypes.string,
    titleInputPlaceholderText: PropTypes.string,
    descriptionTextareaLabelText: PropTypes.string,
    descriptionTextareaPlaceholderText: PropTypes.string,
    iconDropdownLabelText: PropTypes.string,
    colorDropdownLabelText: PropTypes.string,
    colorDropdownTitleText: PropTypes.string,
  }),
  /** If present, the msg and an info icon will be the only thing showing  */
  infoMessage: PropTypes.string,
  /** Callback for when any of the form element's value changes */
  onChange: PropTypes.func.isRequired,
  /** Callback for when the delete button is clicked */
  onDelete: PropTypes.func.isRequired,
  /**
   * Used to overide the internal components and props for the text based input
   * if need should arise to manage defaultValue, length or validation etc.
   */
  overrides: PropTypes.shape({
    titleTextInput: OverridePropTypes,
    decriptionTextArea: OverridePropTypes,
  }),
  /** The id of the form elememt that should be initially focused */
  primaryInputId: PropTypes.string,
  /** Id that can be used for testing */
  testID: PropTypes.string,
};

const defaultProps = {
  hotspotIconFillColors: undefined,
  hotspotIcons: [],
  formValues: {},
  i18n: {
    deleteButtonLabelText: 'Delete hotspot',
    deleteButtonIconDescription: 'Delete this hotspot',
    titleInputLabelText: 'Title',
    titleInputPlaceholderText: 'Enter title for the tooltip',
    descriptionTextareaLabelText: 'Description',
    descriptionTextareaPlaceholderText: 'Enter description for the tooltip',
    iconDropdownLabelText: 'Select an Icon',
    iconDropdownTitleText: 'Icon',
  },
  infoMessage: undefined,
  overrides: undefined,
  primaryInputId: undefined,
  testID: 'HotspotTooltipTab',
};

const preventFormSubmission = (e) => e.preventDefault();

const HotspotTooltipTab = ({
  hotspotIcons,
  hotspotIconFillColors,
  formValues,
  i18n,
  infoMessage,
  primaryInputId,
  onChange,
  onDelete,
  overrides,
  testID,
}) => {
  const {
    deleteButtonLabelText,
    deleteButtonIconDescription,
    titleInputLabelText,
    titleInputPlaceholderText,
    descriptionTextareaLabelText,
    descriptionTextareaPlaceholderText,
    iconDropdownLabelText,
    iconDropdownTitleText,
    colorDropdownLabelText,
    colorDropdownTitleText,
  } = merge({}, defaultProps.i18n, i18n);

  const currentIconColor = formValues?.color?.carbonColor ?? 'currentcolor';

  const renderInfoMessage = () => (
    <div className={`${iotPrefix}--hotspot-editor--tooltip-info-message`}>
      <InformationFilled24 />
      <p>{infoMessage}</p>
    </div>
  );

  const renderColorIconContainer = () => (
    <div
      className={`${iotPrefix}--icon-color-container`}
      style={{ '--icon-fill-color': currentIconColor }}>
      <Dropdown
        id="tooltip-form-icon"
        items={hotspotIcons}
        label={iconDropdownLabelText}
        light
        onChange={(change) => {
          onChange({ icon: change.selectedItem });
        }}
        selectedItem={formValues.icon}
        titleText={iconDropdownTitleText}
        type="default"
      />

      <ColorDropdown
        selectedColor={formValues.color}
        id="tooltip-form-color"
        colors={hotspotIconFillColors}
        label={colorDropdownLabelText}
        light
        onChange={(selectedColorItem) => {
          onChange(selectedColorItem);
        }}
        titleText={colorDropdownTitleText}
      />
    </div>
  );

  const MyTitleTextInput = overrides?.titleTextInput?.component || TextInput;
  const MyDecriptionTextArea =
    overrides?.decriptionTextArea?.component || TextArea;

  return (
    <div className={`${iotPrefix}--hotspot-tooltip-tab`}>
      {infoMessage ? (
        renderInfoMessage()
      ) : (
        <>
          <form
            className={`${iotPrefix}--hotspot-editor--tooltip-form`}
            data-testid={testID}
            onSubmit={preventFormSubmission}>
            <MyTitleTextInput
              name="title"
              data-testid={`${testID}-title-input`}
              value={formValues.title || ''}
              id={primaryInputId || 'tooltip-form-title'}
              labelText={titleInputLabelText}
              light
              onChange={(evt) => {
                onChange({ title: evt.target.value });
              }}
              placeholder={titleInputPlaceholderText}
              type="text"
              {...overrides?.titleTextInput?.props}
            />
            <MyDecriptionTextArea
              name="description"
              id="tooltip-form-description"
              labelText={descriptionTextareaLabelText}
              light
              onChange={(evt) => {
                onChange({ description: evt.target.value });
              }}
              placeholder={descriptionTextareaPlaceholderText}
              value={formValues.description || ''}
              {...overrides?.decriptionTextArea?.props}
            />
            {renderColorIconContainer()}
          </form>
          <div
            className={`${iotPrefix}--hotspot-tooltip-tab__delete-button-container`}>
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

HotspotTooltipTab.propTypes = propTypes;
HotspotTooltipTab.defaultProps = defaultProps;

export default HotspotTooltipTab;
