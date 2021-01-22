import React from 'react';
import { FormItem, NumberInput } from 'carbon-components-react';

export default {
  title: 'FormItem',

  parameters: {
    component: FormItem,
  },
};

export const Default = () => (
  <FormItem>
    <NumberInput id="number-input-1" hideLabel />
  </FormItem>
);

Default.story = {
  parameters: {
    info: {
      text: 'Form item.',
    },
  },
};
