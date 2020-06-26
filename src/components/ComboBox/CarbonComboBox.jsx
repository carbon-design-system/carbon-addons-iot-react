import React from 'react';
import cx from 'classnames';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import { settings } from 'carbon-components';
import { Checkmark16, WarningFilled16 } from '@carbon/icons-react';
import ListBox from 'carbon-components-react/es/components/ListBox';

const keys = {
  Tab: {
    key: 'Tab',
    which: 9,
    keyCode: 9,
  },
  Enter: {
    key: 'Enter',
    which: 13,
    keyCode: 13,
  },
  Escape: {
    key: [
      'Escape',
      // IE11 Escape
      'Esc',
    ],
    which: 27,
    keyCode: 27,
  },
  Space: {
    key: ' ',
    which: 32,
    keyCode: 32,
  },
  PageUp: {
    key: 'PageUp',
    which: 33,
    keyCode: 33,
  },
  PageDown: {
    key: 'PageDown',
    which: 34,
    keyCode: 34,
  },
  End: {
    key: 'End',
    which: 35,
    keyCode: 35,
  },
  Home: {
    key: 'Home',
    which: 36,
    keyCode: 36,
  },
  ArrowLeft: {
    key: 'ArrowLeft',
    which: 37,
    keyCode: 37,
  },
  ArrowUp: {
    key: 'ArrowUp',
    which: 38,
    keyCode: 38,
  },
  ArrowRight: {
    key: 'ArrowRight',
    which: 39,
    keyCode: 39,
  },
  ArrowDown: {
    key: 'ArrowDown',
    which: 40,
    keyCode: 40,
  },
};

const ListBoxPropTypes = {
  ListBoxType: PropTypes.oneOf(['default', 'inline']),
  ListBoxSize: PropTypes.oneOf(['sm', 'xl']),
};
const { prefix } = settings;

/**
 * Check to see if the given key matches the corresponding keyboard event. Also
 * supports passing in the value directly if you can't used the given event.
 *
 * @example
 * import * as keys from '../keys';
 * import { matches } from '../match';
 *
 * function handleOnKeyDown(event) {
 *   if (match(event, keys.Enter) {
 *     // ...
 *   }
 * }
 *
 * @param {Event|number|string} eventOrCode
 * @param {Key} key
 * @returns {boolean}
 */
export function match(eventOrCode, { key, which, keyCode } = {}) {
  if (typeof eventOrCode === 'string') {
    return eventOrCode === key;
  }

  if (typeof eventOrCode === 'number') {
    return eventOrCode === which || eventOrCode === keyCode;
  }

  if (eventOrCode.key && Array.isArray(key)) {
    return key.indexOf(eventOrCode.key) !== -1;
  }

  return eventOrCode.key === key || eventOrCode.which === which || eventOrCode.keyCode === keyCode;
}

/**
 * Generic utility to initialize a method that will return a unique instance id
 * for a component.
 */
export function setupGetInstanceId() {
  let instanceId = 0;
  return function getInstanceId() {
    return ++instanceId; // eslint-disable-line no-plusplus
  };
}

export const defaultItemToString = item => {
  if (typeof item === 'string') {
    return item;
  }

  return item && item.label;
};

const defaultShouldFilterItem = () => true;

const getInputValue = (props, state) => {
  if (props.selectedItem) {
    return props.itemToString(props.selectedItem);
  }
  // TODO: consistent `initialSelectedItem` behavior with other listbox components in v11
  if (props.initialSelectedItem) {
    return props.itemToString(props.initialSelectedItem);
  }

  return state.inputValue || '';
};

const defaultFindHighlightedIndex = ({ items, itemToString }, inputValue) => {
  if (!inputValue) {
    return -1;
  }

  const searchValue = inputValue.toLowerCase();

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < items.length; i++) {
    const item = itemToString(items[i]).toLowerCase();
    if (item.indexOf(searchValue) !== -1 && searchValue.length > 1) {
      return i;
    }
  }

  return -1;
};

const getInstanceId = setupGetInstanceId();

/* eslint react/require-default-props: 0 */
export default class ComboBox extends React.Component {
  static propTypes = {
    /**
     * 'aria-label' of the ListBox component.
     */
    ariaLabel: PropTypes.string,

    /**
     * An optional className to add to the container node
     */
    className: PropTypes.string,

    /**
     * Specify if the control should be disabled, or not
     */
    disabled: PropTypes.bool,

    /**
     * Specify a custom `id` for the input
     */
    id: PropTypes.string.isRequired,

    /**
     * Allow users to pass in an arbitrary item or a string (in case their items are an array of strings)
     * from their collection that are pre-selected
     */
    initialSelectedItem: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),

    /**
     * We try to stay as generic as possible here to allow individuals to pass
     * in a collection of whatever kind of data structure they prefer
     */
    items: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types

    /**
     * Helper function passed to downshift that allows the library to render a
     * given item to a string label. By default, it extracts the `label` field
     * from a given item to serve as the item label in the list
     */
    itemToString: PropTypes.func,

    /**
     * Optional function to render items as custom components instead of strings.
     * Defaults to null and is overriden by a getter
     */
    itemToElement: PropTypes.func,

    /**
     * `onChange` is a utility for this controlled component to communicate to a
     * consuming component when a specific dropdown item is selected.
     * @param {{ selectedItem }}
     */
    onChange: PropTypes.func.isRequired,

    /**
     * Used to provide a placeholder text node before a user enters any input.
     * This is only present if the control has no items selected
     */
    placeholder: PropTypes.string.isRequired,

    /**
     * Specify your own filtering logic by passing in a `shouldFilterItem`
     * function that takes in the current input and an item and passes back
     * whether or not the item should be filtered.
     */
    shouldFilterItem: PropTypes.func,

    /**
     * Specify if the currently selected value is invalid.
     */
    invalid: PropTypes.bool,

    /**
     * Message which is displayed if the value is invalid.
     */
    invalidText: PropTypes.string,

    /**
     * For full control of the selection
     */
    selectedItem: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),

    /**
     * Specify a custom translation function that takes in a message identifier
     * and returns the localized string for the message
     */
    translateWithId: PropTypes.func,

    /**
     * Currently supports either the default type, or an inline variant
     */
    type: ListBoxPropTypes.ListBoxType,

    /**
     * Specify the size of the ListBox. Currently supports either `sm`, `lg` or `xl` as an option.
     */
    size: ListBoxPropTypes.ListBoxSize,

    /**
     * Callback function to notify consumer when the text input changes.
     * This provides support to change available items based on the text.
     * @param {string} inputText
     */
    onInputChange: PropTypes.func,

    /**
     * should use "light theme" (white background)?
     */
    light: PropTypes.bool,

    /**
     * Additional props passed to Downshift
     */
    downshiftProps: PropTypes.shape(Downshift.propTypes),

    /**
     * Specify the direction of the combobox dropdown. Can be either top or bottom.
     */
    direction: PropTypes.oneOf(['top', 'bottom']),
    /**
     *  Optional callback to pass the highlighted index to parent
     */
    onHighligtedIndexChange: PropTypes.func,
    findHighlightedIndex: PropTypes.func,
  };

  static defaultProps = {
    disabled: false,
    itemToString: defaultItemToString,
    itemToElement: null,
    shouldFilterItem: defaultShouldFilterItem,
    type: 'default',
    ariaLabel: 'Choose an item',
    light: false,
    direction: 'bottom',
  };

  static getDerivedStateFromProps(nextProps, state) {
    const { prevSelectedItem, doneInitialSelectedItem } = state;
    const { selectedItem } = nextProps;
    if (!doneInitialSelectedItem || prevSelectedItem !== selectedItem) {
      return {
        doneInitialSelectedItem: true,
        prevSelectedItem: selectedItem,
        inputValue: getInputValue(nextProps, state),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.textInput = React.createRef();

    this.comboBoxInstanceId = getInstanceId();

    this.state = {
      inputValue: getInputValue(props, {}),
    };
  }

  filterItems = (items, itemToString, inputValue) =>
    items.filter(item =>
      this.props.shouldFilterItem({
        item,
        itemToString,
        inputValue,
      })
    );

  handleOnChange = selectedItem => {
    if (this.props.onChange) {
      this.props.onChange({ selectedItem });
    }
  };

  handleOnInputValueChange = inputValue => {
    const { onInputChange } = this.props;

    this.setState(
      () => ({
        // Default to empty string if we have a false-y `inputValue`
        inputValue: inputValue || '',
      }),
      () => {
        if (onInputChange) {
          onInputChange(inputValue);
        }
      }
    );
  };

  handleOnStateChange = (newState, { setHighlightedIndex, highlightedIndex }) => {
    this.props.onHighligtedIndexChange(highlightedIndex);
    const findHighlightedIndex = this.props.findHighlightedIndex || defaultFindHighlightedIndex;
    if (Object.prototype.hasOwnProperty.call(newState, 'inputValue')) {
      const { inputValue } = newState;
      setHighlightedIndex(findHighlightedIndex(this.props, inputValue));
    }
  };

  onToggleClick = isOpen => event => {
    if (event.target === this.textInput.current && isOpen) {
      // eslint-disable-next-line no-param-reassign
      event.preventDownshiftDefault = true;
      event.persist();
    }
  };

  render() {
    const {
      className: containerClassName,
      disabled,
      id,
      items,
      itemToString,
      itemToElement,
      titleText, // eslint-disable-line react/prop-types
      helperText, // eslint-disable-line react/prop-types
      placeholder,
      initialSelectedItem,
      selectedItem,
      ariaLabel,
      translateWithId,
      invalid,
      invalidText,
      light,
      type, // eslint-disable-line no-unused-vars
      size,
      shouldFilterItem, // eslint-disable-line no-unused-vars
      onChange, // eslint-disable-line no-unused-vars
      onInputChange, // eslint-disable-line no-unused-vars
      downshiftProps,
      direction,
      onHighligtedIndexChange,
      findHighlightedIndex,
      ...rest
    } = this.props;
    const { inputValue } = this.state;
    const className = cx(`${prefix}--combo-box`, containerClassName, {
      [`${prefix}--list-box--up`]: direction === 'top',
    });
    const titleClasses = cx(`${prefix}--label`, {
      [`${prefix}--label--disabled`]: disabled,
    });
    const comboBoxHelperId = !helperText
      ? undefined
      : `combobox-helper-text-${this.comboBoxInstanceId}`;
    const comboBoxLabelId = `combobox-label-${this.comboBoxInstanceId}`;
    const title = titleText ? (
      // eslint-disable-next-line jsx-a11y/label-has-for
      <label id={comboBoxLabelId} htmlFor={id} className={titleClasses}>
        {titleText}
      </label>
    ) : null;
    const helperClasses = cx(`${prefix}--form__helper-text`, {
      [`${prefix}--form__helper-text--disabled`]: disabled,
    });
    const helper = helperText ? (
      <div id={comboBoxHelperId} className={helperClasses}>
        {helperText}
      </div>
    ) : null;
    const wrapperClasses = cx(`${prefix}--list-box__wrapper`);
    const comboBoxA11yId = `combobox-a11y-${this.comboBoxInstanceId}`;
    const inputClasses = cx(`${prefix}--text-input`, {
      [`${prefix}--text-input--empty`]: !inputValue,
    });

    // needs to be Capitalized for react to render it correctly
    const ItemToElement = itemToElement;
    const input = (
      <Downshift
        {...downshiftProps}
        onChange={this.handleOnChange}
        onInputValueChange={this.handleOnInputValueChange}
        onStateChange={this.handleOnStateChange}
        inputValue={inputValue || ''}
        itemToString={itemToString}
        initialIsOpen={false}
        defaultSelectedItem={initialSelectedItem}
        selectedItem={selectedItem}
      >
        {({
          getButtonProps,
          getInputProps,
          getItemProps,
          getRootProps,
          isOpen,
          inputValue, // eslint-disable-line no-shadow
          selectedItem, // eslint-disable-line no-shadow
          highlightedIndex,
          clearSelection,
          toggleMenu,
        }) => {
          // console.log({ highlightedIndex });
          return (
            <ListBox
              className={className}
              disabled={disabled}
              invalid={invalid}
              id={comboBoxA11yId}
              aria-label={ariaLabel}
              invalidText={invalidText}
              isOpen={isOpen}
              light={light}
              size={size}
              {...getRootProps({ refKey: 'innerRef' })}
            >
              <ListBox.Field
                id={id}
                disabled={disabled}
                aria-labelledby={comboBoxLabelId}
                aria-describedby={comboBoxHelperId}
                {...getButtonProps({
                  disabled,
                  onClick: this.onToggleClick(isOpen),
                })}
              >
                <input
                  className={inputClasses}
                  aria-labelledby={comboBoxA11yId}
                  tabIndex="0"
                  aria-disabled={disabled}
                  aria-controls={isOpen ? `${id}__menu` : null}
                  aria-owns={isOpen ? `${id}__menu` : null}
                  aria-autocomplete="list"
                  ref={this.textInput}
                  title={inputValue}
                  {...rest}
                  {...getInputProps({
                    disabled,
                    id,
                    placeholder,
                    onKeyDown: event => {
                      if (match(event, keys.Space)) {
                        event.stopPropagation();
                      }
                      if (match(event, keys.Enter)) {
                        toggleMenu();
                      }
                    },
                  })}
                />
                {invalid && <WarningFilled16 className={`${prefix}--list-box__invalid-icon`} />}
                {inputValue && (
                  <ListBox.Selection
                    clearSelection={clearSelection}
                    translateWithId={translateWithId}
                    disabled={disabled}
                  />
                )}
                <ListBox.MenuIcon isOpen={isOpen} translateWithId={translateWithId} />
              </ListBox.Field>
              <ListBox.Menu aria-label={ariaLabel} id={id}>
                {this.filterItems(items, itemToString, inputValue).map((item, index) => {
                  const itemProps = getItemProps({
                    item,
                    index,
                  });
                  return (
                    <ListBox.MenuItem
                      key={itemProps.id}
                      isActive={selectedItem === item}
                      isHighlighted={
                        highlightedIndex === index ||
                        (selectedItem && selectedItem.id === item.id) ||
                        false
                      }
                      title={itemToElement ? item.text : itemToString(item)}
                      {...itemProps}
                    >
                      {itemToElement ? (
                        <ItemToElement key={itemProps.id} {...item} />
                      ) : (
                        itemToString(item)
                      )}
                      {selectedItem === item && (
                        <Checkmark16 className={`${prefix}--list-box__menu-item__selected-icon`} />
                      )}
                    </ListBox.MenuItem>
                  );
                })}
              </ListBox.Menu>
            </ListBox>
          );
        }}
      </Downshift>
    );

    return (
      <div className={wrapperClasses}>
        {title}
        {helper}
        {input}
      </div>
    );
  }
}
