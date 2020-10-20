import React from 'react';
import PropTypes from 'prop-types';
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
  itemToString: null,
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

  const onSelectionChange = (changes) => {
    const { selectedItem } = changes;

    onChangeView(selectedItem);
  };

  const renderButtonsOnly = (itemData) => {
    return (
      <>
        <Button
          className={`${iotPrefix}--dropdown__image-button`}
          renderIcon={itemData?.icon}
          kind="ghost"
          hasIconOnly
          data-testid={`dropdown-button__${itemData?.id}`}
          iconDescription={itemData?.text}
        />

        <div className={`${iotPrefix}--dropdown__selected-icon-label`}>
          {React.createElement(itemData.icon)}
          <div
            className={`${iotPrefix}--dropdown__selected-icon-label__content`}>
            {itemData.text}
          </div>
        </div>
      </>
    );
  };

  const renderLabel = (item) => {
    return (
      <>
        <div className={`${iotPrefix}--dropdown__label`}>
          {item?.icon !== undefined ? React.createElement(item?.icon) : null}
          <div className={`${iotPrefix}--dropdown__label__content`}>
            {item ? item.text : ''}
          </div>
        </div>
      </>
    );
  };

  const itemToStringOverride = hasIconsOnly
    ? (item) => renderButtonsOnly(item)
    : (item) => renderLabel(item);

  return (
    <MyDropDown
      items={items}
      className={classnames({
        [`${iotPrefix}--dropdown__selection-buttons`]: hasIconsOnly,
      })}
      actions={otherActions}
      onChange={onSelectionChange}
      {...other}
      itemToString={itemToString !== null ? itemToString : itemToStringOverride}
    />
  );
};

Dropdown.propTypes = CarbonDropDown.propTypes && propTypes;
Dropdown.defaultProps = CarbonDropDown.defaultProps && defaultPropTypes;

export default Dropdown;
