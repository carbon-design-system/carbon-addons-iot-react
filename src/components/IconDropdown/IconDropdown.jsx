import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';
import { Button } from '../../index';
import { Dropdown } from '../Dropdown/index';

const { iotPrefix, prefix } = settings;

const itemShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  footer: PropTypes.node,
});

const propTypes = {
  id: PropTypes.string.isRequired,
  dropdownId: PropTypes.string.isRequired,
  columnCount: PropTypes.number,
  selectedItem: itemShape,
  items: PropTypes.arrayOf(itemShape).isRequired,

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
  columnCount: 4,
  selectedItem: null,
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

const defaultItemSize = 48;
const defaultHelperPadding = 4;

const IconDropdown = ({
  id,
  columnCount,
  selectedItem: controlledSelectedItem,
  items,
  dropdownId,
  disabled,
  direction,
  onChange,
  ...other
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [internalSelectedItem, setInternalSelectedItem] = useState(
    controlledSelectedItem
  );

  const selectedItem =
    controlledSelectedItem !== null
      ? controlledSelectedItem
      : internalSelectedItem;

  // Takes measurements of the dropdown and text that renders beneath this - used to position the footer
  const dropdown = document.getElementById(id);
  const helperText = dropdown?.getElementsByClassName(
    `${prefix}--form__helper-text`
  )[0];
  const validationText = dropdown?.getElementsByClassName(
    `${prefix}--form-requirement`
  )[0];
  const menuOption = dropdown?.getElementsByClassName(
    `${prefix}--list-box__menu-item`
  )[0];

  const helperTextHeight =
    helperText !== undefined
      ? helperText.clientHeight + defaultHelperPadding
      : 0;
  const validationTextHeight =
    validationText !== undefined
      ? validationText.clientHeight + defaultHelperPadding
      : 0;

  const widthStyle = `${
    columnCount * (menuOption?.clientWidth ?? defaultItemSize)
  }px`;
  const heightStyle = Math.ceil(items.length / columnCount) * defaultItemSize;

  const highlightedItem =
    highlightedIndex >= 0 && highlightedIndex < items.length
      ? items[highlightedIndex]
      : null;

  const hasFooter = highlightedItem || selectedItem;

  const Footer = () => {
    const selectedFooter =
      highlightedItem !== null ? highlightedItem : selectedItem;

    const bottomTranslate = `translateY(-${
      helperTextHeight + validationTextHeight
    }px)`;
    const topTranslate = `translateY(-${
      heightStyle + defaultHelperPadding * 2
    }px)`;

    return selectedFooter !== undefined && selectedFooter !== null ? (
      <div
        className={`${iotPrefix}--icon-dropdown__footer`}
        style={{
          width: widthStyle,
          transform: direction === 'top' ? topTranslate : bottomTranslate,
          paddingTop: direction === 'bottom' ? `${heightStyle}px` : 0,
          paddingBottom: direction === 'top' ? `${heightStyle}px` : 0,
        }}>
        <div className={`${iotPrefix}--icon-dropdown__footer-content`}>
          {selectedFooter.footer}
        </div>
      </div>
    ) : null;
  };

  const itemToString = (item) => {
    const index = items.findIndex((element) => element.id === item.id);

    return (
      <>
        <Button
          className={classnames(
            `${iotPrefix}--icon-dropdown__image-button`,
            {
              [`${iotPrefix}--icon-dropdown__image-button--leading`]:
                index % columnCount === 0,
            },
            {
              [`${iotPrefix}--icon-dropdown__image-button--trailing`]:
                (index + 1) % columnCount === 0,
            },
            {
              [`${iotPrefix}--icon-dropdown__image-button--bottom`]:
                index + columnCount >= items.length && !hasFooter,
            }
          )}
          renderIcon={item?.icon}
          kind="ghost"
          hasIconOnly
          disabled={disabled}
          selected={item.id === selectedItem?.id}
          data-testid={`dropdown-button__${item?.id}`}
          iconDescription={item.text}
          title={item?.text}
        />

        <div className={`${iotPrefix}--icon-dropdown__selected-icon-label`}>
          {React.createElement(item.icon)}
          <div
            className={`${iotPrefix}--icon-dropdown__selected-icon-label__content`}>
            {item.text}
          </div>
        </div>
      </>
    );
  };

  return (
    <div id={id}>
      {isOpen && direction === 'top' && <Footer />}

      <Dropdown
        id={dropdownId}
        direction={direction}
        style={{ width: widthStyle }}
        items={items}
        className={`${iotPrefix}--icon-dropdown__selection-buttons`}
        selectedItem={selectedItem}
        onChange={(changes) => {
          const { selectedItem: newSelected } = changes;
          setInternalSelectedItem(newSelected);
          onChange(newSelected);
        }}
        downshiftProps={{
          isOpen,
          onStateChange: (change) => {
            if (change.isOpen !== undefined) {
              setIsOpen(change.isOpen);
            }

            if (change.highlightedIndex !== undefined) {
              setHighlightedIndex(change.highlightedIndex);
            }
          },
        }}
        {...other}
        itemToString={itemToString}
      />
      {isOpen && direction === 'bottom' && <Footer />}
    </div>
  );
};

IconDropdown.propTypes = propTypes;
IconDropdown.defaultProps = defaultPropTypes;

export default IconDropdown;
