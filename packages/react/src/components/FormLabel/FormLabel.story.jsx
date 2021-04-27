/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { FormLabel, Tooltip } from 'carbon-components-react';

export default {
  title: 'FormLabel',

  parameters: {
    component: FormLabel,
  },
};

export const Default = () => <FormLabel>Form label</FormLabel>;
Default.story = {};

export const WithTooltip = () => (
  <FormLabel>
    <Tooltip triggerText="Form label">
      This can be used to provide more information about a field.
    </Tooltip>
  </FormLabel>
);

WithTooltip.story = {
  name: 'Form Label with Tooltip',
};
