import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tag } from 'carbon-components-react';

import { settings } from '../../constants/Settings';

import CarbonComboBox from './CarbonComboBox';

const { iotPrefix } = settings;
const propTypes = {
  // eslint-disable-next-line react/forbid-foreign-prop-types
  ...CarbonComboBox.propTypes,
  loading: PropTypes.bool,
  inline: PropTypes.bool,
  wrapperClassName: PropTypes.string,
  closeButtonText: PropTypes.string,
  hasMultiValue: PropTypes.bool,
};

const defaultProps = {
  ...CarbonComboBox.defaultProps,
  loading: false,
  inline: false,
  wrapperClassName: null,
  closeButtonText: 'Close',
  hasMultiValue: true,
};

const ComboBox = ({
  inline,
  loading,
  wrapperClassName,
  closeButtonText,
  hasMultiValue,
  ...comboProps
}) => {
  // Ref for the combobox input
  const comboRef = React.createRef();
  const { items, itemToString } = comboProps;
  // Current selected item that shows in the input
  const [selectedItem, setSelectedItem] = useState(null);
  // Array that populates tags
  const [tagItems, setTagItems] = useState([]);

  useEffect(() => {
    // If there are tags then clear and focus the input
    if (tagItems.length >= 1) {
      setSelectedItem('');
      comboRef.current.textInput.current.focus();
    }
  });

  const handleOnKeypress = evt => {
    // Only apply logic if user hit enter
    if (evt.key === 'Enter') {
      // Current value of input
      const currentValue = comboRef.current.textInput.current.value.trim();
      console.log({ currentValue });
      const uid = items.length;
      // Check if there is already a tag for this value and return it
      const filteredItems = tagItems.filter(x => itemToString(x).includes(currentValue));

      // create new item to add items array and tags array
      const newItem = {
        id: `id-${uid}`,
        text: currentValue || '',
        selected: true,
      };

      // If current value is not part of items array and is not empty string
      if (
        items.filter(x => itemToString(x).includes(currentValue)).length < 1 &&
        currentValue !== ''
      ) {
        // Add new item to items array and set as selected Item
        items.push(newItem);
        setSelectedItem(newItem);
        // If component is using multiValue feature and there is not already a tag for new value
        if (hasMultiValue && filteredItems.length < 1) {
          // Add new value to the tags array
          setTagItems(inputValues => [...inputValues, { ...newItem, id: `tag-${newItem.id}` }]);
        }
      } else {
        const chosenItem = items.filter(x => itemToString(x).includes(currentValue))[0];
        setSelectedItem(chosenItem);
        // If component is using multiValue feature and there is not already a tag for new value
        if (hasMultiValue && filteredItems.length < 1) {
          // Add new value to the tags array
          setTagItems(inputValues => [...inputValues, { ...newItem, id: `tag-${newItem.id}` }]);
        }
      }
    }
  };

  const handleOnClose = e => {
    // Get close target's text
    const closedValue = e.currentTarget.parentNode.children[0].innerText;
    // If there is a tag with the same value then remove from tag array
    tagItems.forEach((item, idx) => {
      if (itemToString(item).includes(closedValue)) {
        tagItems.splice(idx, 1);
        setTagItems([...tagItems]);
      }
    });
  };

  const handleOnChange = selected => {
    // Get selected item from Combobox and set our internal state to the value
    setSelectedItem(selected.selectedItem);
    console.log(comboRef.current);
    const currentValue = comboRef.current?.textInput.current.value.trim();
    const filteredItems = tagItems.filter(x => itemToString(x).includes(currentValue));
    // If component is using multiValue feature and the tags array does not contain new value
    if (hasMultiValue && filteredItems.length < 1) {
      // Add new value to tags array
      setTagItems(inputValues => [...inputValues, selected.selectedItem]);
    }
    // Pass on value to user's onChange callback
    comboProps.onChange(selected);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={classNames(`${iotPrefix}--combobox`, { wrapperClassName })}
      onKeyDown={evt => handleOnKeypress(evt)}
    >
      <ul className={`${iotPrefix}--combobox-tags`}>
        {tagItems.map(item => (
          <li>
            <Tag key={item.id} filter onClose={e => handleOnClose(e)} title={closeButtonText}>
              {itemToString(item)}
            </Tag>
          </li>
        ))}
      </ul>
      <CarbonComboBox
        {...comboProps}
        ref={comboRef}
        light
        selectedItem={!hasMultiValue ? selectedItem : selectedItem}
        items={items}
        itemToString={item => (item ? item.text : '')}
        onChange={handleOnChange}
        className={classNames(comboProps.className, `${iotPrefix}--combobox-input`)}
        disabled={comboProps.disabled || (loading !== undefined && loading !== false)}
      />
    </div>
  );
};

ComboBox.propTypes = propTypes;
ComboBox.defaultProps = defaultProps;

export default ComboBox;
