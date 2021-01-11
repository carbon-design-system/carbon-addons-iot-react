import { action } from '@storybook/addon-actions';
import React from 'react';
// import { action } from '@storybook/addon-actions';

import RuleBuilder from './RuleBuilder';

export default {
  title: 'Watson IoT Experimental/RuleBuilder',
  component: RuleBuilder,
};

const getDate = () => new Date().toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

export const ruleBuilder = () => (
  <div style={{ width: '100%', height: 'calc(100vh - 100px)'}}>
    <RuleBuilder metaText={`last updated: ${getDate()}`} actionBar={{handleAction: (event) => action('toolbar')}} />
  </div>
);