import React from 'react';
import { FormItem, NumberInput } from 'carbon-components-react';

export default {
  title: 'FormItem',
};

export const Default = () => (
  <FormItem>
    <NumberInput id="number-input-1" hideLabel />
  </FormItem>
);

Default.parameters = {
  info: {
    text: 'Form item.',
  },
};
