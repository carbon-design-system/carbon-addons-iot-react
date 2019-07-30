/* Used dependencies */
import React, { Component } from 'react';
import { boolean, number, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ProgressIndicatorSkeleton } from 'carbon-components-react';

import ProgressIndicator from './ProgressIndicator';

const items = [
  {
    id: 'step1',
    label: 'First step',
    secondaryLabel: 'secondary label',
    description: 'This is displayed when step icon is hovered',
  },
  {
    id: 'step2',
    label: 'Second Step',
  },
  { id: 'step3', label: 'Third Step' },
  { id: 'step4', label: 'Fourth Step' },
  { id: 'step5', label: 'Fifth Step' },
  { id: 'step6', label: 'Sixth Step' },
];
class ProgressIndicatorExample extends Component {
  state = {
    currentItemId: 'step1',
  };

  setItem = id => {
    action('onClickItem')(id);
    this.setState({ currentItemId: id });
  };

  render() {
    const { currentItemId } = this.state;

    return (
      <ProgressIndicator
        items={items}
        onChange={this.setItem}
        onClickItem={this.setItem}
        currentItemId={currentItemId}
        showLabels={boolean('showlabels', true)}
        isVerticalMode={boolean('isVerticalMode', false)}
      />
    );
  }
}

/* Adds the stories */
storiesOf('Watson IoT|ProgressIndicator', module)
  .add('Stateful', () => <ProgressIndicatorExample />)
  .add('presentation', () => (
    <ProgressIndicator
      items={items}
      currentItemId={select('id', items.map(item => item.id), items[0].id)}
      onClickItem={action('onClickItem')}
      stepWidth={number('stepWidth', 9)}
      showLabels={boolean('showlabels', true)}
    />
  ))
  .add('presentation vertical', () => (
    <ProgressIndicator
      items={items}
      currentItemId={select('id', items.map(item => item.id), items[0].id)}
      onClickItem={action('onClickItem')}
      showLabels={boolean('showlabels', true)}
      isVerticalMode
    />
  ))
  .add('hideLabels and default stepWidth', () => (
    <ProgressIndicator
      items={items}
      currentItemId={select('id', items.map(item => item.id), items[1].id)}
      onClickItem={action('onClickItem')}
    />
  ))
  .add('skeleton', () => <ProgressIndicatorSkeleton />, {
    info: {
      text: `
            Placeholder skeleton state to use when content is loading.
        `,
    },
  });
