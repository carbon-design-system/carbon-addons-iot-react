/* Used dependencies */
import React, { Component } from 'react';
// import { withKnobs, boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import ProgressIndicator from './ProgressIndicator';

class ProgressIndicatorExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItemId: 'step1',
    };
  }

  setItem = id => {
    this.setState({ currentItemId: id });
  };

  render() {
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
    const { currentItemId } = this.state;

    return (
      <ProgressIndicator
        items={items}
        // currentItemId={select('id', ['step1', 'step2', 'step3', 'step4'])}
        onClickItem={this.setItem}
        currentItemId={currentItemId}
        // showLabels={boolean('showlabels', true)}
        showLabels
        // stepWidth={number('stepWidth', 136)}
        stepWidth={200}
      />
    );
  }
}

/* Adds the stories */
// export default function addStories(story) {
//   story.add('Progress Indicator', mimic(ProgressIndicatorExample, ProgressIndicator));
// }

storiesOf('ProgressIndicator', module).add('ProgressIndicator', () => <ProgressIndicatorExample />);
