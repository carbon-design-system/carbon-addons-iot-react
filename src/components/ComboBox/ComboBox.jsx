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
  // Callback that is called with the value of the input on change
  onChange: PropTypes.func.isRequired,
  // OPtional classname to be applied to wrapper
  wrapperClassName: PropTypes.string,
  // String to pass for tags close button aria-label. Will be prepended to value name
  closeButtonText: PropTypes.string,
  // Bit that will allow mult value and tag feature
  hasMultiValue: PropTypes.bool,
};

const defaultProps = {
  ...CarbonComboBox.defaultProps,
  loading: false,
  inline: false,
  wrapperClassName: null,
  closeButtonText: 'Close',
  hasMultiValue: false,
  items: [],
};

const ComboBox = ({
  inline,
  loading,
  wrapperClassName,
  closeButtonText,
  hasMultiValue,
  itemToString,
  onChange,
  items,
  downshiftProps,
  ...comboProps
}) => {
  // Ref for the combobox input
  const comboRef = React.createRef();
  // Current selected item that shows in the input
  const [selectedItem, setSelectedItem] = useState(null);
  // Array that populates list
  const [listItems, setListItems] = useState(items);
  // Array that populates tags
  const [tagItems, setTagItems] = useState([]);

  useEffect(() => {
    // If there are tags then clear and focus the input
    if (hasMultiValue) {
      setSelectedItem(null);
      comboRef.current.textInput.current.focus();
    }
  });

  const handleOnKeypress = evt => {
    // Current value of input
    const currentValue = comboRef.current.textInput.current.value.trim();

    // Only apply logic if user hit enter
    if (evt.key === 'Enter' && currentValue !== '' && currentValue !== undefined) {
      // Check if there is already a tag for this value and return it
      const hasNoFilteredTag = tagItems.filter(x => itemToString(x) === currentValue).length < 1;
      // Check if value is part of items array
      const matchedItem = listItems.filter(x => itemToString(x) === currentValue)[0];

      const uid = items.length / Math.random();
      // create new item to add items array and tags array
      const newItem = {
        id: `id-${uid}`,
        text: currentValue,
      };

      // If component is using multiValue feature and there is not already a tag for new value
      // If the value is not already part of items list use new item else use list item
      if (hasMultiValue && hasNoFilteredTag && !matchedItem) {
        // Add new value to the tags array
        setTagItems(inputValues => [...inputValues, { ...newItem, id: newItem.id }]);
      } else if (hasMultiValue && hasNoFilteredTag) {
        // Add new value to the tags array using the list item object
        setTagItems(inputValues => [...inputValues, matchedItem]);
      }

      // If current value is not part of items array
      if (!matchedItem) {
        // Add new item to items array and set as selected Item
        setListItems(currentList => [...currentList, newItem]);
        setSelectedItem(newItem);
      } else {
        // Set the chosen item as selectedItem
        setSelectedItem(matchedItem);
      }

      // Pass the combobox value to user's onChange callback
      // If has multi value we return array otherwise just the object
      if (hasMultiValue) {
        // If item exist in list use list item or else use new item
        if (!matchedItem) {
          onChange([...tagItems, newItem]);
        } else if (hasNoFilteredTag) {
          onChange([...tagItems, matchedItem]);
        }
      }
      // If item exist in list use list item or else use new item
      else if (!matchedItem) {
        onChange(newItem);
      } else {
        onChange(matchedItem);
      }
    }
  };

  const handleOnClose = e => {
    // Get close target's text
    const closedValue = e.currentTarget.parentNode.children[0].textContent;
    // If there is a tag with the same value then remove from tag array
    tagItems.forEach((item, idx) => {
      if (itemToString(item) === closedValue) {
        tagItems.splice(idx, 1);
        setTagItems([...tagItems]);
      }
    });
    // Send new value to users onChange callback
    onChange([...tagItems]);
  };

  const handleOnChange = selected => {
    const newItem = selected.selectedItem;
    const currentValue = itemToString(newItem);
    const filteredItems = tagItems.filter(x => itemToString(x) === currentValue);
    // If component is using multiValue feature and the tags array does not contain new value
    if (newItem !== null && filteredItems.length < 1 && hasMultiValue) {
      // Add new value to tags array
      setTagItems(inputValues => [...inputValues, newItem]);
      // pass the combobox value to user's onChange callback
      onChange([...tagItems, newItem]);
    }

    // Get selected item from Combobox and set our internal state to the value
    setSelectedItem(newItem);
    // If not using multiValue feature then just pass the selected item
    if (!hasMultiValue) {
      onChange(newItem);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={classNames(`${iotPrefix}--combobox`, { [wrapperClassName]: wrapperClassName })}
      onKeyDown={evt => handleOnKeypress(evt)}
      data-testid="combo-wrapper"
    >
      <CarbonComboBox
        data-testid="combo-box"
        {...comboProps}
        downshiftProps={downshiftProps}
        ref={comboRef}
        selectedItem={selectedItem}
        items={listItems}
        itemToString={itemToString}
        onChange={handleOnChange}
        className={classNames(comboProps.className, `${iotPrefix}--combobox-input`)}
        disabled={comboProps.disabled || (loading !== undefined && loading !== false)}
      />
      <ul data-testid="combo-tags" className={`${iotPrefix}--combobox-tags`}>
        {tagItems.map((item, idx) => (
          <li key={`li-${item?.id}-${idx}`}>
            <Tag
              key={`tag-${item?.id}-${idx}`}
              filter
              onClose={e => handleOnClose(e)}
              title={closeButtonText}
            >
              {itemToString(item)}
            </Tag>
          </li>
        ))}
      </ul>
    </div>
  );
};

ComboBox.propTypes = propTypes;
ComboBox.defaultProps = defaultProps;

export default ComboBox;
