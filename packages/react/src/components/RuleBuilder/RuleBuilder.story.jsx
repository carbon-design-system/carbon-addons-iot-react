import * as React from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import RuleBuilder from './RuleBuilder';

export const RuleBuilderEditor = () => <RuleBuilder />;
RuleBuilderEditor.story = {
  name: 'Rule Builder Editor',
};

export default {
  title: 'Watson IoT Experimental/RuleBuilder',
  decorators: [withKnobs],

  parameters: {
    component: RuleBuilder,
  },
};
