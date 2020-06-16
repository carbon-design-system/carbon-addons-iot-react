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
  ...comboProps
}) => {
  // Ref for the combobox input
  const comboRef = React.createRef();
  const { items, downshiftProps } = comboProps;
  // Current selected item that shows in the input
  const [selectedItem, setSelectedItem] = useState(null);
  // Array that populates list
  const [listItems, setListItems] = useState(items);
  // Array that populates tags
  const [tagItems, setTagItems] = useState([]);

  useEffect(() => {}, []);

  useEffect(() => {
    // If there are tags then clear and focus the input
    if (tagItems.length >= 1) {
      setSelectedItem('');
      comboRef.current.textInput.current.focus();
    }
  });

  const handleOnKeypress = evt => {
    // Current value of input
    const currentValue = comboRef.current.textInput.current.value.trim();

    // Only apply logic if user hit enter
    if (evt.key === 'Enter' && currentValue !== '' && currentValue !== undefined) {
      // Check if there is already a tag for this value and return it
      const filteredTags = tagItems.filter(x => itemToString(x) === currentValue);
      // Check if value is part of items array
      const filteredItems = listItems.filter(x => itemToString(x) === currentValue);

      const uid = (listItems.length + filteredTags.length + filteredItems.length) / Math.random();
      // create new item to add items array and tags array
      const newItem = {
        id: `id-${uid}`,
        text: currentValue || '',
        selected: true,
      };
      // If component is using multiValue feature and there is not already a tag for new value
      if (hasMultiValue && filteredTags.length < 1) {
        // Add new value to the tags array
        setTagItems(inputValues => [...inputValues, { ...newItem, id: `tag-${newItem.id}` }]);
      }

      // If current value is not part of items array
      if (filteredItems.length < 1) {
        // Add new item to items array and set as selected Item
        setListItems(currentList => [...currentList, newItem]);
        setSelectedItem(newItem);
      } else {
        // Set the chosen item as selectedItem
        setSelectedItem(filteredItems[0]);
      }
    }
  };

  const handleOnClose = e => {
    // Get close target's text
    const closedValue = e.currentTarget.parentNode.children[0].textContent;
    // If there is a tag with the same value then remove from tag array
    tagItems.forEach((item, idx) => {
      if (itemToString(item).includes(closedValue)) {
        tagItems.splice(idx, 1);
        setTagItems([...tagItems]);
      }
    });
  };

  const handleOnChange = selected => {
    const newItem = selected.selectedItem;
    const currentValue = itemToString(newItem);
    const filteredItems = tagItems.filter(x => itemToString(x) === currentValue);
    // If component is using multiValue feature and the tags array does not contain new value
    if (hasMultiValue && filteredItems.length < 1 && newItem !== null) {
      // Add new value to tags array
      setTagItems(inputValues => [...inputValues, newItem]);
    }
    // Get selected item from Combobox and set our internal state to the value
    setSelectedItem(newItem);
    // Pass on value to user's onChange callback
    comboProps.onChange(selected);
  };

  const highlightedIndex = hasMultiValue ? -1 : downshiftProps?.highlightedIndex;
  const combinedDownshiftProps = {
    ...downshiftProps,
    highlightedIndex,
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={classNames(`${iotPrefix}--combobox`, { [wrapperClassName]: wrapperClassName })}
      onKeyDown={evt => handleOnKeypress(evt)}
      data-testid="combo-wrapper"
    >
      <ul data-testid="combo-tags" className={`${iotPrefix}--combobox-tags`}>
        {tagItems.map((item, idx) => (
          <li>
            <Tag
              key={`${item?.id}-${idx}`}
              filter
              onClose={e => handleOnClose(e)}
              title={closeButtonText}
            >
              {itemToString(item)}
            </Tag>
          </li>
        ))}
      </ul>
      <CarbonComboBox
        data-testid="combo-box"
        {...comboProps}
        downshiftProps={combinedDownshiftProps}
        ref={comboRef}
        selectedItem={!hasMultiValue ? selectedItem : selectedItem}
        items={listItems}
        itemToString={itemToString}
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
