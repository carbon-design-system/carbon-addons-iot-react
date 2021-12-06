import React from 'react';
import PropTypes from 'prop-types';

import { settings } from '../../constants/Settings';

import { Dropdown as CarbonDropdown } from '.';

const { iotPrefix } = settings;

const propTypes = {
  /**
   * 'aria-label' of the ListBox component.
   */
  ariaLabel: PropTypes.string,

  /**
   * Provide a custom className to be applied on the bx--dropdown node
   */
  className: PropTypes.string,

  /**
   * Specify the direction of the dropdown. Can be either top or bottom.
   */
  direction: PropTypes.oneOf(['top', 'bottom']),

  /**
   * Disable the control
   */
  disabled: PropTypes.bool,

  /**
   * Additional props passed to Downshift
   */
  // eslint-disable-next-line react/forbid-prop-types
  downshiftProps: PropTypes.object,

  /**
   * Provide helper text that is used alongside the control label for
   * additional help
   */
  helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

  /**
   * Specify a custom `id`
   */
  id: PropTypes.string.isRequired,

  /**
   * Allow users to pass in an arbitrary item or a string (in case their items are an array of strings)
   * from their collection that are pre-selected
   */
  initialSelectedItem: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),

  /**
   * Specify if the currently selected value is invalid.
   */
  invalid: PropTypes.bool,

  /**
   * Message which is displayed if the value is invalid.
   */
  invalidText: PropTypes.string,

  /**
   * Function to render items as custom components instead of strings.
   * Defaults to null and is overriden by a getter
   */
  itemToElement: PropTypes.func,

  /**
   * Helper function passed to downshift that allows the library to render a
   * given item to a string label. By default, it extracts the `label` field
   * from a given item to serve as the item label in the list.
   */
  itemToString: PropTypes.func,

  /**
   * We try to stay as generic as possible here to allow individuals to pass
   * in a collection of whatever kind of data structure they prefer
   */
  // eslint-disable-next-line react/forbid-prop-types
  items: PropTypes.array.isRequired,

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
   * In the case you want to control the dropdown selection entirely.
   */
  selectedItem: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),

  /**
   * Specify the size of the ListBox. Currently supports either `sm`, or `xl` as an option.
   */
  size: PropTypes.oneOf(['sm', 'xl']),

  /**
   * Provide the title text that will be read by a screen reader when
   * visiting this control
   */
  titleText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

  /**
   * Callback function for translating ListBoxMenuIcon SVG title
   */
  translateWithId: PropTypes.func,

  /**
   * The dropdown type, `default` or `inline`
   */
  type: PropTypes.oneOf(['default', 'inline']),

  testId: PropTypes.string,
};

const defaultProps = {
  ariaLabel: undefined,
  className: undefined,
  downshiftProps: undefined,
  initialSelectedItem: null,
  invalid: false,
  invalidText: '',
  onChange: null,
  selectedItem: undefined,
  disabled: false,
  size: undefined,
  translateWithId: () => {},
  type: 'default',
  itemToString: null,
  itemToElement: null,
  light: false,
  titleText: '',
  helperText: '',
  direction: 'bottom',
  testId: 'dropdown',
};

const defaultItemToString = (item) => {
  let content;

  if (typeof item === 'string') {
    content = item;
  } else if (item?.icon) {
    content = (
      <div className={`${iotPrefix}--dropdown__item`} title={item.text}>
        <div className={`${iotPrefix}--dropdown__label`}>
          {React.createElement(item?.icon)}
          <div className={`${iotPrefix}--dropdown__label__content`}>{item.text}</div>
        </div>
      </div>
    );
  } else {
    content = item ? item.text : '';
  }

  return content;
};

const Dropdown = ({ itemToString, testId, ...other }) => {
  return (
    <CarbonDropdown
      data-testid={testId}
      {...other}
      className={`${iotPrefix}--dropdown`}
      itemToString={itemToString !== null ? itemToString : defaultItemToString}
    />
  );
};

Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;

export default Dropdown;
