import React from 'react';
import { mount } from 'enzyme';

import IotProgressIndicator from './IotProgressIndicator';

const mockItems = [
  {
    id: 'step1',
    label: 'First step',
    secondaryLabel: 'Optional label',
    description: 'This is displayed when step icon is hovered',
  },
  {
    id: 'step2',
    label: 'Second Step',
    secondaryLabel: 'Optional label',
    children: [
      { id: 'step2_substep1', label: 'Sub Step 1' },
      { id: 'step2_substep2', label: 'Sub Step 2', secondaryLabel: 'Optional label' },
      { id: 'step2_substep3', label: 'Sub Step 3' },
    ],
  },
  { id: 'step3', label: 'Third Step', secondaryLabel: 'Optional label', disabled: true },
  { id: 'step4', label: 'Fourth Step', invalid: true },
  { id: 'step5', label: 'Fifth Step' },
];

/*
<IotProgressIndicator
items={mockItems}
currentItemId="step2_substep2"
stepWidth="6"
showLabels={true}
isVerticalMode={false}
clickable={false}
/>
*/

describe('IotProgressIndicator', () => {
  it('handleChange', () => {
    const wrapper = mount(<IotProgressIndicator items={mockItems} />);
  });
});
