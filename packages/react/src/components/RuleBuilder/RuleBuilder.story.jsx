
import React from 'react';
import { action } from '@storybook/addon-actions';
import { Star16, Share16, TrashCan16 } from '@carbon/icons-react';

import RuleBuilder from './RuleBuilder';

export default {
  title: 'Watson IoT Experimental/RuleBuilder',
  component: RuleBuilder,
};

const actions = [
  {
    actionId: 'favorite',
    actionLabel: 'Favorite',
    actionIcon: Star16,
    actionCallback: action('favorite')
  }
]



const getDate = () => new Date().toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

export const ruleBuilder = () => (
  <div style={{ width: '100%', height: 'calc(100vh - 100px)'}}>
    <RuleBuilder metaText={`last updated: ${getDate()}`} actionBar={actions} handleOnSave={action('onSave')} handleOnCancel={action('onCancel')}/>
  </div>
);