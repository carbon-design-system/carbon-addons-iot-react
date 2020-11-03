import React from 'react';
import PropTypes from 'prop-types';

import { settings } from '../../constants/Settings';

import { Dropdown } from './index';

const { iotPrefix } = settings;

const propTypes = {
  id: PropTypes.string.isRequired,
  itemToString: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      icon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    })
  ).isRequired,

  // Dropdown specific props
  /**
   * 'aria-label' of the ListBox component.
   */
  ariaLabel: PropTypes.string,

  /**
   * Specify the direction of the dropdown. Can be either top or bottom.
   */
  direction: PropTypes.oneOf(['top', 'bottom']),

  /**
   * Disable the control
   */
  disabled: PropTypes.bool,

  /**
   * Provide helper text that is used alongside the control label for
   * additional help
   */
  helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

  /**
   * Specify if the currently selected value is invalid.
   */
  invalid: PropTypes.bool,

  /**
   * Message which is displayed if the value is invalid.
   */
  invalidText: PropTypes.string,

  /**
   * Generic `label` that will be used as the textual representation of what
   * this field is for
   */
  label: PropTypes.node.isRequired,

  /**
   * `true` to use the light version.
   */
  light: PropTypes.bool,

  /**
   * `onChange` is a utility for this controlled component to communicate to a
   * consuming component what kind of internal state changes are occuring.
   */
  onChange: PropTypes.func,

  /**
   * Provide the title text that will be read by a screen reader when
   * visiting this control
   */
  titleText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

  /**
   * The dropdown type, `default` or `inline`
   */
  type: PropTypes.oneOf(['default', 'inline']),

  /**
   * Specify whether the control is currently in warning state
   */
  warn: PropTypes.bool,

  /**
   * Provide the text that is displayed when the control is in warning state
   */
  warnText: PropTypes.string,
};

const defaultPropTypes = {
  itemToString: null,
  disabled: false,
  type: 'default',
  light: false,
  titleText: '',
  helperText: '',
  direction: 'bottom',
  ariaLabel: '',
  invalid: false,
  invalidText: '',
  onChange: () => {},
  warn: false,
  warnText: '',
};

const DropdownWithIcon = ({ id, items, itemToString, onChange, ...other }) => {
  const onSelectionChange = (changes) => {
    const { selectedItem } = changes;

    onChange(selectedItem);
  };

  const renderLabel = (item) => {
    return (
      <div className={`${iotPrefix}--dropdown__label`}>
        {React.createElement(item?.icon)}
        <div className={`${iotPrefix}--dropdown__label__content`}>
          {item.text}
        </div>
      </div>
    );
  };

  return (
    <Dropdown
      id={id}
      items={items}
      onChange={onSelectionChange}
      {...other}
      itemToString={itemToString !== null ? itemToString : renderLabel}
    />
  );
};

DropdownWithIcon.propTypes = propTypes;
DropdownWithIcon.defaultProps = defaultPropTypes;

export default DropdownWithIcon;
