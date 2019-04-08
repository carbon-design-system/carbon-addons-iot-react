/* Used dependencies */
import React, { Component } from 'react';
import { boolean, number, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ProgressIndicator from './ProgressIndicator';

const items = [
  {
    id: 'step1',
    label: 'First step',
  },
  { id: 'step2', label: 'Second Step' },
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
        onClickItem={this.setItem}
        currentItemId={currentItemId}
        showLabels={boolean('showlabels', true)}
        stepWidth={number('stepWidth', 136)}
      />
    );
  }
}

/* Adds the stories */
storiesOf('ProgressIndicator', module)
  .add('Stateful', () => <ProgressIndicatorExample />)
  .add('presentation', () => (
    <ProgressIndicator
      items={items}
      currentItemId={select('id', items.map(item => item.id), items[0].id)}
      onClickItem={action('onClickItem')}
      showLabels={boolean('showlabels', true)}
      stepWidth={number('stepWidth', 136)}
    />
  ))
  .add('hideLabels and default stepWidth', () => (
    <ProgressIndicator
      items={items}
      currentItemId={select('id', items.map(item => item.id), items[0].id)}
      onClickItem={action('onClickItem')}
      showLabels={boolean('showlabels', false)}
      stepWidth={number('stepWidth', 0)}
    />
  ));
