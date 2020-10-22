import React from 'react';
import PropTypes from 'prop-types';

import { settings } from '../../constants/Settings';

import { Dropdown } from './index';

const { iotPrefix } = settings;

const propTypes = {
  itemToString: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      icon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    })
  ).isRequired,
};

const defaultPropTypes = {
  itemToString: null,
};

const DropdownWithIcon = ({
  selectedViewId,
  items,
  itemToString,
  actions: { onChangeView, ...otherActions },
  ...other
}) => {
  const onSelectionChange = (changes) => {
    const { selectedItem } = changes;

    onChangeView(selectedItem);
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

  return (
    <Dropdown
      items={items}
      actions={otherActions}
      onChange={onSelectionChange}
      {...other}
      itemToString={itemToString !== null ? itemToString : renderLabel}
    />
  );
};

DropdownWithIcon.propTypes = Dropdown.propTypes && propTypes;
DropdownWithIcon.defaultProps = Dropdown.defaultProps && defaultPropTypes;

export default DropdownWithIcon;
