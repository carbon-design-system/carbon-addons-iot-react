/* Used dependencies */
import React from 'react';
import { boolean, number, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ProgressIndicatorSkeleton } from 'carbon-components-react';

import ProgressIndicator from './ProgressIndicator';

const items = [
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
      { id: 'step2_substep3', label: 'Sub Step 3', invalid: true },
      { id: 'step2_substep4', label: 'Sub Step 4', invalid: true, disabled: true },
    ],
  },
  { id: 'step3', label: 'Third Step', secondaryLabel: 'Optional label', disabled: true },
  { id: 'step4', label: 'Fourth Step', invalid: true },
  { id: 'step5', label: 'Fifth Step' },
];

/* Adds the stories */
storiesOf('Watson IoT/ProgressIndicator', module)
  .add('stateful', () => (
    <ProgressIndicator
      items={items}
      currentItemId="step2_substep2"
      stepWidth={number('stepWidth', 6)}
      showLabels={boolean('showlabels', true)}
      isVerticalMode={boolean('isVerticalMode', false)}
      clickable={boolean('clickable', false)}
    />
  ))
  .add('presentation', () => (
    <ProgressIndicator
      items={items}
      currentItemId={select('id', items.map(item => item.id), items[0].id)}
      onClickItem={action('onClickItem')}
      stepWidth={number('stepWidth', 9)}
      showLabels={boolean('showlabels', true)}
      isVerticalMode={boolean('isVerticalMode', false)}
    />
  ))
  .add('presentation vertical', () => (
    <ProgressIndicator
      items={items}
      currentItemId={select('id', items.map(item => item.id), items[0].id)}
      onClickItem={action('onClickItem')}
      showLabels={boolean('showlabels', true)}
      clickable={boolean('clickable', false)}
      isVerticalMode
    />
  ))
  .add('hideLabels and default stepWidth', () => (
    <ProgressIndicator
      items={items}
      currentItemId={select('id', items.map(item => item.id), items[1].id)}
      onClickItem={action('onClickItem')}
      showLabels={false}
      isVerticalMode={boolean('isVerticalMode', false)}
    />
  ))
  .add('skeleton', () => <ProgressIndicatorSkeleton />, {
    info: {
      text: `
            Placeholder skeleton state to use when content is loading.
        `,
    },
  });
