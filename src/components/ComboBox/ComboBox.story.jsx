// export {
//   default as ComboBoxStory,
// } from 'carbon-components-react/lib/components/ComboBox/ComboBox-story';
// TODO: https://github.com/carbon-design-system/carbon/issues/5067

import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
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

const itemToElement = item => {
  const itemAsArray = item.text.split(' ');
  return (
    <div>
      <span>{itemAsArray[0]}</span>
      <span style={{ color: 'blue' }}> {itemAsArray[1]}</span>
    </div>
  );
};

const shouldFilterItem = ({ item, itemToString, inputValue }) =>
  itemToString(item).includes(inputValue);

const ControlledComboBoxApp = props => {
  const [selectedItem, setSelectedItem] = useState(items[0]);
  let uid = items.length;
  return (
    <>
      <ComboBox
        {...props}
        items={items}
        itemToString={item => (item ? item.text : '')}
        onChange={({ selectedItem }) => setSelectedItem(selectedItem)}
        initialSelectedItem={items[0]}
        selectedItem={selectedItem}
      />
      <Button
        style={{ marginTop: '1rem' }}
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
        <ComboBox
          shouldFilterItem={shouldFilterItem}
          items={items}
          initialSelectedItem="Option 1"
          itemToString={item => (item ? item.text : '')}
          {...props()}
        />
      </Wrapper>
    ),
    {
      info: {
        text: 'ComboBox',
      },
    }
  )
  .add(
    'Mult-value tags',
    () => (
      <Wrapper>
        <ComboBox
          shouldFilterItem={shouldFilterItem}
          items={items}
          hasMultiValue
          itemToString={item => (item ? item.text : '')}
          {...props()}
        />
      </Wrapper>
    ),
    {
      info: {
        text: 'ComboBox',
      },
    }
  )
  .add(
    'items as components',
    () => (
      <Wrapper>
        <ComboBox
          items={items}
          itemToString={item => (item ? item.text : '')}
          itemToElement={itemToElement}
          {...props()}
        />
      </Wrapper>
    ),
    {
      info: {
        text: 'ComboBox',
      },
    }
  )
  .add('application-level control for selection', () => <ControlledComboBoxApp {...props()} />, {
    info: {
      text: `Controlled ComboBox example application`,
    },
  });
