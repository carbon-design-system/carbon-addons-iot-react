import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelect } from 'downshift';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';
import { Button } from '../../index';

import { Dropdown as CarbonDropDown } from './index';

const { iotPrefix } = settings;

const propTypes = {
  hasIconsOnly: PropTypes.bool,
  itemToString: PropTypes.func,
  footer: PropTypes.node,
};

const defaultPropTypes = {
  hasIconOnly: false,
  itemToString: item => (item ? item.text : ''),
  footer: null,
};

const Dropdown = ({
  selectedViewId,
  items,
  overrides,
  hasIconsOnly,
  itemToString,
  actions: { onChangeView, ...otherActions },
  ...other
}) => {
  const MyDropDown = overrides?.dropdown?.component || CarbonDropDown;

  const onSelectionChange = changes => {
    const { isOpen, item } = changes;

    if (item) {
      if (item.customAction) {
        item.customAction(item);
      } else {
        onChangeView(item);
      }
    }
  };

  const itemToStringOverride = hasIconsOnly
    ? itemData => {
        return (
          <>
            <Button
              className={`${iotPrefix}--dropdown__image-button`}
              renderIcon={itemData.icon}
              kind="ghost"
              hasIconOnly
              iconDescription={itemData.text}
            />

            <div className={`${iotPrefix}--dropdown__selected-icon-label`}>
              {React.createElement(itemData.icon)}
              <div
                className={classnames(`${iotPrefix}--dropdown__selected-icon-label__content`, {
                  [`${iotPrefix}--dropdown__selected-icon-label__content--open`]: false,
                })}
              >
                {itemData.text}
              </div>
            </div>
          </>
        );
      }
    : itemToString;

  return (
    <MyDropDown
      items={items}
      className={classnames({
        [`${iotPrefix}--dropdown__selection-buttons`]: hasIconsOnly,
      })}
      actions={otherActions}
      onChange={onSelectionChange}
      {...other}
      itemToString={itemToStringOverride}
    />
  );
};

Dropdown.propTypes = CarbonDropDown.propTypes && propTypes;
Dropdown.defaultProps = CarbonDropDown.defaultProps && defaultPropTypes;

export default Dropdown;
