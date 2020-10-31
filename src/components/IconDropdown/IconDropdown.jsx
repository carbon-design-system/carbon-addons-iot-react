import React, { useState } from 'react';
import PropTypes from 'prop-types';

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
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  dropdownId: PropTypes.string.isRequired,
  light: PropTypes.node,
  columnCount: PropTypes.number,
  selectedItem: itemShape,
  items: PropTypes.arrayOf(itemShape).isRequired,
};

const defaultPropTypes = {
  disabled: false,
  columnCount: 4,
  selectedItem: null,
};

const defaultItemSize = 48;
const defaultHelperPadding = 4;

const IconDropdown = ({
  id,
  columnCount,
  selectedItem: controlledSelectedItem,
  items,
  light,
  dropdownId,
  disabled,
  actions: { onChangeView, ...otherActions },
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
  const menu = dropdown?.getElementsByClassName(`${prefix}--list-box__menu`)[0];
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
  const heightStyle =
    menu?.clientHeight > 0
      ? menu?.clientHeight
      : `${Math.ceil(items.length / columnCount) * defaultItemSize}px`;

  const Footer = () => {
    const highlightedItem =
      highlightedIndex >= 0 && highlightedIndex < items.length
        ? items[highlightedIndex]
        : null;

    const selectedFooter =
      highlightedItem !== null ? highlightedItem : selectedItem;

    return selectedFooter !== undefined && selectedFooter !== null ? (
      <div
        className={`${iotPrefix}--dropdown__footer`}
        style={{
          width: widthStyle,
          transform: `translateY(-${
            helperTextHeight + validationTextHeight
          }px)`,
          paddingTop: heightStyle,
        }}>
        <div className={`${iotPrefix}--dropdown__footer-content`}>
          {selectedFooter.footer}
        </div>
      </div>
    ) : null;
  };

  const itemToString = (item) => {
    return (
      <>
        <Button
          className={`${iotPrefix}--dropdown__image-button`}
          renderIcon={item?.icon}
          kind="ghost"
          hasIconOnly
          disabled={disabled}
          selected={item.id === selectedItem?.id}
          data-testid={`dropdown-button__${item?.id}`}
          iconDescription={item?.text}
          title={item?.text}
        />

        <div className={`${iotPrefix}--dropdown__selected-icon-label`}>
          {React.createElement(item.icon)}
          <div
            className={`${iotPrefix}--dropdown__selected-icon-label__content`}>
            {item.text}
          </div>
        </div>
      </>
    );
  };

  return (
    <div id={id}>
      <Dropdown
        id={dropdownId}
        style={{ width: widthStyle }}
        items={items}
        disabled={disabled}
        className={`${iotPrefix}--dropdown__selection-buttons`}
        actions={otherActions}
        selectedItem={selectedItem}
        onChange={(changes) => {
          const { selectedItem: newSelected } = changes;
          setInternalSelectedItem(newSelected);
          onChangeView(newSelected);
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
      {isOpen && <Footer />}
    </div>
  );
};

IconDropdown.propTypes = Dropdown.propTypes && propTypes;
IconDropdown.defaultProps = Dropdown.defaultProps && defaultPropTypes;

export default IconDropdown;
