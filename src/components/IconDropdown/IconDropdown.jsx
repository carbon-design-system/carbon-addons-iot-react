import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import  ReactDOM, {createPortal} from 'react-dom';


import { settings } from '../../constants/Settings';
import { Button } from '../../index';

import { Dropdown } from './index';
import { itemPropTypes } from '../List/List';

const { iotPrefix } = settings;

const propTypes = {
  itemToString: PropTypes.func,
  hasFooter: PropTypes.node,
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
  itemToString: null,
  hasFooter: false,
};

const IconDropdown = ({
  selectedViewId,
  items,
  hasFooter,
  itemToString,
  actions: { onChangeView, ...otherActions },
  ...other
}) => {
  const onSelectionChange = (changes) => {
    const { selectedItem } = changes;

    onChangeView(selectedItem);
  };

  const renderFooter = () => {
    const selectedItem = items.filter((item) => item.id === selectedViewId);

    return selectedItem?.footer;
  };

  const renderButtonsOnly = (item) => {
    return (
      <>
        <Button
          className={`${iotPrefix}--dropdown__image-button`}
          renderIcon={item?.icon}
          kind="ghost"
          hasIconOnly
          data-testid={`dropdown-button__${item?.id}`}
          iconDescription={item?.text}
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
  

  const menu = document.body;// .getElementsByClassName('iot--dropdown__selection-buttons');
  let footer = null;

  if (menu !== null) {
    footer = ReactDOM.createPortal(
     <div className="footer">
       {renderFooter()}
      </div>,
    menu)
  }

    // ReactDOM.findDOMNode(document).getElementsByClassName('iot--list-box__menu').length
    // render(renderFooter(), document.getElementsByClassName('iot--list-box__menu')[0]);

    return(<>
    <Dropdown
    items={items}
    def
    className={`${iotPrefix}--dropdown__selection-buttons`}
    actions={otherActions}
    onChange={onSelectionChange}
    {...other}
    itemToString={itemToString !== null ? itemToString : renderButtonsOnly}
  />
    {footer}
    </>);
  
};

IconDropdown.propTypes = Dropdown.propTypes && propTypes;
IconDropdown.defaultProps = Dropdown.defaultProps && defaultPropTypes;

export default IconDropdown;
