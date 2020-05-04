import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { settings } from '../../constants/Settings';

import CarbonComboBox from './CarbonComboBox';

const { iotPrefix } = settings;
const propTypes = {
  // eslint-disable-next-line react/forbid-foreign-prop-types
  ...CarbonComboBox.propTypes,
  loading: PropTypes.bool,
  inline: PropTypes.bool,
  wrapperClassName: PropTypes.string,
};

const defaultProps = {
  ...CarbonComboBox.defaultProps,
  loading: false,
  inline: false,
  wrapperClassName: null,
};

const ComboWrapper = props => {
  const handleOnKeypress = evt => {
    // let uid = items.length;
    // if (!items.includes(inputValue)) {
    //   items.push({
    //     id: `id-${(uid += 1)}`,
    //     text: inputValue || '',
    //   });
    //   setSelectedItem(inputValue);
    // }

    // if (evt.keycode === )
    console.log('Selected: ', evt.key);
    // comboOnChange(value);
  };

  return <div onKeyDown={evt => handleOnKeypress(evt)}>{props.children}</div>;
};

const ComboBox = ({ inline, loading, wrapperClassName, ...comboProps }) => {
  const { items } = comboProps;
  const [selectedItem, setSelectedItem] = useState(null);
  const [inputValue, setInputValue] = useState(items[0]);
  const handleInputChange = (value, name) => {
    // let uid = items.length;
    // items.push({
    //   id: `id-${(uid += 1)}`,
    //   text: value,
    // });
    setInputValue(value);
    console.log('value: ', name, value);
    // comboOnChange(value);
  };

  // const handleOnKeypress = evt => {
  // let uid = items.length;
  // if (!items.includes(inputValue)) {
  //   items.push({
  //     id: `id-${(uid += 1)}`,
  //     text: inputValue || '',
  //   });
  //   setSelectedItem(inputValue);
  // }

  // if (evt.keycode === )
  // console.log('Selected: ', evt.keycode);
  // comboOnChange(value);
  // };
  // <ComboBox
  //   id="icam-editor"
  //   title={selectedItem ? selectedItem.label : typeahead_label}
  //   placeholder={selectedItem ? selectedItem.label : typeahead_label}
  //   itemToString={item => {
  //     return item ? item.label : '';
  //   }}
  //   items={valueList}
  //   selectedItem={selectedItem}
  //   onInputChange={this.fieldChange.bind(this, parm)}
  //   onChange={this.fieldChange.bind(this, parm)}
  // />;

  const handleOnChange = evt => {
    // let uid = items.length;
    // if (!items.includes(inputValue)) {
    //   items.push({
    //     id: `id-${(uid += 1)}`,
    //     text: inputValue || '',
    //   });
    //   setSelectedItem(inputValue);
    // }

    // if (evt.keycode === )
    console.log('CHanged: ', evt);
    // comboOnChange(value);
  };
  return (
    <ComboWrapper>
      <CarbonComboBox
        {...comboProps}
        light
        // selectedItem={selectedItem || null}
        items={items}
        // onKeyPress={value => handleInputChange(value, 'keypress')}
        itemToString={item => (item ? item.text : '')}
        onChange={value => handleInputChange(value, 'onchange')}
        // onInputChange={value => handleInputChange(value, 'inputchange')}
        className={classNames(comboProps.className, `${iotPrefix}--combo-box`)}
        disabled={comboProps.disabled || (loading !== undefined && loading !== false)}
      />
    </ComboWrapper>
  );
};

ComboBox.propTypes = propTypes;
ComboBox.defaultProps = defaultProps;

export default ComboBox;
