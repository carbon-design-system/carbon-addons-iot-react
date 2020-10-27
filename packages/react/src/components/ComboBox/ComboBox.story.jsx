// export {
//   default as ComboBoxStory,
// } from 'carbon-components-react/lib/components/ComboBox/ComboBox-story';
// TODO: https://github.com/carbon-design-system/carbon/issues/5067

import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { action } from '@storybook/addon-actions';
import { spacing05 } from '@carbon/layout';
import { withKnobs, boolean, select, text } from '@storybook/addon-knobs';

import Button from '../Button';

import ComboBox from './ComboBox';

export const items = [
  {
    id: 'option-0',
    text: 'Option 1',
  },
  {
    id: 'option-1',
    text: 'Option 2',
  },
  {
    id: 'option-2',
    text: 'Option 3',
  },
  {
    id: 'option-3',
    text: 'Option 4',
  },
  {
    id: 'option-4',
    text: 'An example option that is really long to show what should be done to handle long text',
  },
];

const sizes = {
  'Extra large size (xl)': 'xl',
  'Default size': undefined,
  'Small size (sm)': 'sm',
};

const props = () => ({
  id: text('Combobox ID (id)', 'carbon-combobox-example'),
  placeholder: text('Placeholder text (placeholder)', 'Filter...'),
  titleText: text('Title (titleText)', 'Combobox title'),
  helperText: text('Helper text (helperText)', 'Optional helper text here'),
  light: boolean('Light (light)', false),
  disabled: boolean('Disabled (disabled)', false),
  invalid: boolean('Invalid (invalid)', false),
  invalidText: text('Invalid text (invalidText)', 'A valid value is required'),
  size: select('Field size (size)', sizes, undefined) || undefined,
  onChange: action('fired onChange'),
});

const itemToElement = (item) => {
  const itemAsArray = item.text.split(' ');
  return (
    <div>
      <span>{itemAsArray[0]}</span>
      <span style={{ color: 'blue' }}> {itemAsArray.splice(1, itemAsArray.length).join(' ')}</span>
    </div>
  );
};

const ControlledComboBoxApp = ({ onBlur, ...props }) => {
  let uid = items.length;
  // start the local state from items
  const [localStateItems, setLocalStateItems] = useState(items);
  const [selectedItem, setSelectedItem] = useState(localStateItems[0]);

  const itemToString = (item) => (item ? item.text : '');

  const handleBlur = (inputValue) => {
    if (
      !isEmpty(inputValue) &&
      !isEqual(inputValue, selectedItem) &&
      items.every((item) => !isEqual(item, inputValue)) // only actually trigger this if this is a new item
    ) {
      setSelectedItem(inputValue);
      // Trigger normal onChange to update the form
      props.onChange(inputValue);
      setLocalStateItems(
        // add the item to the end of the original list
        [...items, inputValue]
      );
    }
  };
  return (
    <>
      <ComboBox
        {...props}
        key={JSON.stringify(localStateItems.slice(-1))} // for onBlur support regenerate to reset the local cached state if the last item changes
        onBlur={onBlur ? handleBlur : undefined} // if onBlur is true then attach our custom handler
        items={localStateItems}
        itemToString={itemToString}
        onChange={(changedItem) => {
          if (changedItem) {
            setSelectedItem(localStateItems.find((item) => isEqual(item, changedItem))); // because combobox is stupid I have to find the exact same one https://github.com/carbon-design-system/carbon/issues/7055
            if (
              // if the selected item is one of the original items and we're blurring, remove it from list
              !isEqual(items, localStateItems) &&
              onBlur &&
              items.find((item) => isEqual(item, changedItem))
            ) {
              setLocalStateItems(items);
            }
          }
        }}
        initialSelectedItem={selectedItem}
        selectedItem={selectedItem}
      />
      <Button
        style={{ marginTop: spacing05 }}
        onClick={() => {
          items.push({
            id: `id-${(uid += 1)}`,
            text: `Option ${uid}`,
          });
          setSelectedItem(items[items.length - 1]);
        }}
      >
        Add new item
      </Button>
    </>
  );
};

const Wrapper = ({ children }) => <div style={{ width: 300, padding: '1rem' }}>{children}</div>;

storiesOf('Watson IoT Experimental/ComboBox', module)
  .addDecorator(withKnobs)
  .add(
    'Default',
    () => (
      <Wrapper>
        <ComboBox items={items} itemToString={(item) => (item ? item.text : '')} {...props()} />
      </Wrapper>
    ),
    {
      info: {
        text: 'ComboBox',
        propTablesExclude: [Wrapper],
      },
    }
  )
  .add(
    'Items as components',
    () => (
      <Wrapper>
        <ComboBox
          {...props()}
          items={items}
          itemToString={(item) => (item ? item.text : '')}
          itemToElement={itemToElement}
        />
      </Wrapper>
    ),
    {
      info: {
        text: 'ComboBox',
        propTablesExclude: [Wrapper],
      },
    }
  )
  .add('application-level control for selection', () => <ControlledComboBoxApp {...props()} />, {
    info: {
      text: `Controlled ComboBox example application`,
      propTables: [ComboBox],
      propTablesExclude: [ControlledComboBoxApp],
    },
  })
  .add(
    'Experimental multi-value tags',
    () => (
      <Wrapper>
        <ComboBox
          {...props()}
          items={items}
          hasMultiValue
          itemToString={(item) => (item ? item.text : '')}
        />
      </Wrapper>
    ),
    {
      info: {
        text:
          'This variation of the ComboBox is experimental. By setting `hasMultiValue` to true, when an item is selected it will create a persistent tag above the ComboBox. If the entered text does not match an item in the list, it will be added to the list.',
        propTablesExclude: [Wrapper],
      },
    }
  )
  .add(
    'Experimental add new items to list',
    () => (
      <Wrapper>
        <ComboBox
          {...props()}
          items={items}
          itemToString={(item) => (item ? item.text : '')}
          addToList
        />
      </Wrapper>
    ),
    {
      info: {
        text:
          'This variation of the ComboBox is experimental. By setting `addToList` to true, if an entered item is not part of the list options, it will be added to the list upon hitting enter.',
        propTablesExclude: [Wrapper],
      },
    }
  )
  .add(
    'Custom onBlur function automatically adds item to the list',
    () => {
      return (
        <Wrapper>
          <ControlledComboBoxApp {...props()} onBlur={boolean('onBlur', true)} />
        </Wrapper>
      );
    },
    {
      info: {
        text:
          'This variation of the ComboBox is experimental. By setting `addToList` to true, if an entered item is not part of the list options, it will be added to the list upon hitting enter.',
        propTablesExclude: [Wrapper],
      },
    }
  );
