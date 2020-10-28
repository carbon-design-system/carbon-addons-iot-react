import React from 'react';
import { storiesOf } from '@storybook/react';
import { FormItem, NumberInput } from 'carbon-components-react';

// Duplicating old carbon story for awareness of the component.
// Can replace with Carbon variant when they release
storiesOf('FormItem', module)
  .addParameters({
    component: FormItem,
  })
  .add(
    'Default',
    () => (
      <FormItem>
        <NumberInput id="number-input-1" hideLabel />
      </FormItem>
    ),
    {
      info: {
        text: 'Form item.',
      },
    }
  );
