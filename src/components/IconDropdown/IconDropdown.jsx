import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { settings } from '../../constants/Settings';
import { Button } from '../../index';

import { Dropdown } from './index';

const { iotPrefix, prefix } = settings;

const propTypes = {
  disabled: PropTypes.bool,
  light: PropTypes.node,
  columnCount: PropTypes.number,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      icon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
      footer: PropTypes.node,
    })
  ).isRequired,
};

const defaultPropTypes = {
  disabled: false,
  columnCount: 4,
};

const IconDropdown = ({
  columnCount,
  selectedViewId,
  items,
  light,
  disabled,
  actions: { onChangeView, ...otherActions },
  ...other
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  const onSelectionChange = (changes) => {
    const { selectedItem } = changes;
    onChangeView(selectedItem);
  };

  const helperTextHeight =
    document.body.getElementsByClassName(`${prefix}--form__helper-text`)[0]
      ?.clientHeight + 4 ?? 0;
  const widthStyle = `${columnCount * 48}px`;
  const heightStyle = `${Math.ceil(items.length / columnCount) * 48}px`;

  const renderFooter = () => {
    const selectedItem = items.filter((item) => item.id === selectedViewId);
    const highlightedItem =
      highlightedIndex >= 0 && highlightedIndex < items.length
        ? items[highlightedIndex]
        : null;
    return (
      <div
        className={`${iotPrefix}--dropdown__footer`}
        style={{
          width: widthStyle,
          transform: `translateY(-${helperTextHeight}px)`,
          paddingTop: heightStyle,
        }}>
        <div className={`${iotPrefix}--dropdown__footer-content`}>
          {highlightedItem !== null
            ? highlightedItem?.footer
            : selectedItem[0]?.footer}
        </div>
      </div>
    );
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
          selected={item.id === selectedViewId}
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
    <div ref={dropdownRef}>
      <Dropdown
        style={{ width: widthStyle }}
        items={items}
        disabled={disabled}
        className={`${iotPrefix}--dropdown__selection-buttons`}
        actions={otherActions}
        onChange={onSelectionChange}
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
      {isOpen && renderFooter()}
    </div>
  );
};

IconDropdown.propTypes = Dropdown.propTypes && propTypes;
IconDropdown.defaultProps = Dropdown.defaultProps && defaultPropTypes;

export default IconDropdown;
