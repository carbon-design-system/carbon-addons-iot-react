import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Tag } from 'carbon-components-react';

import { settings } from '../../constants/Settings';
import deprecate from '../../internal/deprecate';

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
  // String to pass to input field option
  editOptionText: PropTypes.string,
  // String to pass for tags close button aria-label. Will be prepended to value name
  closeButtonText: PropTypes.string,
  // Bit that will allow mult value and tag feature
  hasMultiValue: deprecate(
    PropTypes.bool,
    '\nThe prop `hasMultiValue` for Combobox is experimental. The functionality that is enabled by this prop is subject to change until Combobbox moves out of experimental.'
  ),
};

const defaultProps = {
  ...CarbonComboBox.defaultProps,
  loading: false,
  wrapperClassName: null,
  closeButtonText: 'Close',
  editOptionText: '-Create',
  hasMultiValue: false,
  items: [],
  onInputChange: null,
};

const ComboBox = ({
  loading,
  wrapperClassName,
  closeButtonText,
  editOptionText,
  hasMultiValue,
  onChange,
  ...comboProps
}) => {
  const {
    items,
    ariaLabel,
    className,
    disabled,
    id,
    initialSelectedItem,
    downshiftProps,
    itemToString,
    itemToElement,
    placeholder,
    shouldFilterItem,
    type,
    invalid,
    invalidText,
    translateWithId,
    size,
    onInputChange,
    light,
    direction,
  } = comboProps;
  // Ref for the combobox input
  const comboRef = React.createRef();
  // Input value that is added to list
  const [inputValue, setInputValue] = useState('');
  // Current selected item that shows in the input
  const [selectedItem, setSelectedItem] = useState(null);
  // Array that populates list
  const [listItems, setListItems] = useState(items);
  // Array that populates tags
  const [tagItems, setTagItems] = useState([]);
  // Highlighted index for list dropdown
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    // If there are tags then clear and focus the input
    if (hasMultiValue) {
      setSelectedItem(null);
    }
  });

  const handleOnClose = e => {
    // Get close target's text
    const closedValue = e.currentTarget.parentNode?.children[0]?.textContent;
    // If there is a tag with the same value then remove from tag array
    tagItems.forEach((item, idx) => {
      if (itemToString(item) === closedValue) {
        tagItems.splice(idx, 1);
        setTagItems([...tagItems]);
      }
    });
    // Send new value to users onChange callback
    onChange([...tagItems]);
    // eslint-disable-next-line no-unused-expressions
    e.currentTarget.parentNode?.parentNode?.parentNode?.firstChild?.children[0]?.children[1]?.focus();
  };

  const handleOnChange = ({ selectedItem: downShiftSelectedItem }) => {
    const newItem =
      downShiftSelectedItem &&
      Object.keys(downShiftSelectedItem).reduce(
        (acc, currentId) => ({ ...acc, [currentId]: downShiftSelectedItem[currentId].trim() }),
        {}
      );

    const currentValue = itemToString(newItem);
    // Check that there is no existing tag
    const hasNoExistingTag = tagItems.filter(x => itemToString(x) === currentValue).length < 1;
    // Check if value is part of items array
    const matchedItem = listItems.filter(x => itemToString(x).trim() === currentValue)[0];

    if (hasMultiValue) {
      // If tags array does not contain new value
      if (newItem && hasNoExistingTag) {
        // Add new value to tags array
        setTagItems(inputValues => [...inputValues, newItem]);
        // pass the combobox value to user's onChange callback
        onChange([...tagItems, newItem]);
      }
    } else {
      onChange(newItem);
    }

    if (newItem?.id.startsWith(`${iotPrefix}-input-`) && !matchedItem) {
      // Add new item to items array
      setListItems(currentList => [newItem, ...currentList]);
    }

    setSelectedItem(newItem);
    setInputValue(null);
  };

  const handleOnKeypress = evt => {
    // Current value of input
    const currentValue = comboRef.current.textInput.current.value.trim();

    if (evt.key === 'Enter' && currentValue && highlightedIndex < 0) {
      const newItem = {
        id: `${iotPrefix}-input-${currentValue.split(' ').join('-')}-${currentValue.length}`,
        text: currentValue,
      };

      handleOnChange({ selectedItem: newItem });
    }
  };

  const handleInputChange = e => {
    const matchedItem = listItems.filter(x => itemToString(x) === e)[0];
    if (e !== '' && !matchedItem) {
      setInputValue({
        id: `${iotPrefix}-input-${e.split(' ').join('-')}-${e.length}`,
        text: e,
      });
    } else {
      setInputValue(null);
    }
    // Pass on to user callback
    if (typeof onInputChange === 'function') {
      onInputChange(e);
    }
  };

  const findHighlightedIndex = ({ items: carbonItems }, carbonInputValue) => {
    if (!carbonInputValue) {
      return -1;
    }
    const searchValue = carbonItems[0].id.startsWith(`${iotPrefix}-input`)
      ? carbonInputValue.slice(0, -1).toLowerCase()
      : carbonInputValue.toLowerCase();
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < carbonItems.length; i++) {
      const item = itemToString(carbonItems[i]).toLowerCase();
      if (item.indexOf(searchValue) !== -1 && searchValue && searchValue.trim() === item.trim()) {
        return i;
      }
    }
    return -1;
  };

  const combinedItems = useMemo(() => (inputValue ? [inputValue, ...listItems] : listItems), [
    inputValue,
    listItems,
  ]);
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={classnames(
        `${iotPrefix}--combobox`,
        { [wrapperClassName]: wrapperClassName },
        { [`${iotPrefix}--combobox-add`]: inputValue }
      )}
      onKeyDown={evt => handleOnKeypress(evt)}
      data-testid="combo-wrapper"
    >
      <CarbonComboBox
        data-testid="combo-box"
        ariaLabel={ariaLabel}
        id={id}
        type={type}
        placeholder={placeholder}
        shouldFilterItem={shouldFilterItem}
        size={size}
        invalid={invalid}
        light={light}
        direction={direction}
        invalidText={invalidText}
        translateWithId={translateWithId}
        initialSelectedItem={initialSelectedItem}
        downshiftProps={downshiftProps}
        findHighlightedIndex={findHighlightedIndex}
        onHighligtedIndexChange={setHighlightedIndex}
        ref={comboRef}
        selectedItem={comboProps.selectedItem || selectedItem}
        items={combinedItems}
        itemToString={itemToString}
        itemToElement={itemToElement}
        editOptionText={editOptionText}
        onChange={handleOnChange}
        onInputChange={handleInputChange}
        className={classnames(className, `${iotPrefix}--combobox-input`)}
        disabled={disabled || (loading !== undefined && loading !== false)}
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
