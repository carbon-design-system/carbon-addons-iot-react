import React from 'react';
import { action } from '@storybook/addon-actions';
import { Star16, Share16, TrashCan16 } from '@carbon/icons-react';

import RuleBuilder from './RuleBuilder';
import { columns, TEST_TREE_DATA } from './RuleBuilderEditor.story';

export default {
  title: 'Watson IoT Experimental/RuleBuilder',
  parameters: {
    component: RuleBuilder,
  },
};

const actions = [
  {
    actionId: 'favorite',
    actionLabel: 'Favorite',
    actionIcon: Star16,
    actionCallback: action('favorite'),
  },
  {
    actionId: 'share',
    actionLabel: 'Share',
    actionIcon: Share16,
    actionCallback: action('share'),
  },
  {
    actionId: 'delete',
    actionLabel: 'Delete',
    actionIcon: TrashCan16,
    actionCallback: action('delete'),
  },
];

const getDate = () =>
  new Date().toLocaleDateString('en', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const filter = {
  filterId: 'story-filter',
  /** Text for main tilte of page */
  filterTitleText: 'My Filter',
  /** Text for metadata for the filter */
  filterMetaText: `last updated: ${getDate()}`,
  /** tags associated with particular filter */
  filterTags: ['fav', 'other-tag'],
  /** users that have access to particular filter */
  filterAccess: [
    {
      userName: 'Example-User',
      email: 'example@pal.com',
      name: 'Example User',
      access: 'edit',
    },
    {
      userName: 'Other-User',
      email: 'other@pal.com',
      name: 'Other User',
      access: 'read',
    },
  ],
  /** All possible uers that can be granted access */
  filterUsers: [
    {
      userName: 'Example-User',
      email: 'example@pal.com',
      name: 'Example User',
    },
    {
      userName: 'Test-User',
      email: 'test@pal.com',
      name: 'Test User',
    },
    {
      userName: 'Other-User',
      email: 'other@pal.com',
      name: 'Other User',
    },
  ],
  /**
   * the rules passed into the component. The RuleBuilder is a controlled component, so
   * this works the same as passing defaultValue to a controlled input component.
   */
  filterRules: TEST_TREE_DATA,
  filterColumns: columns,
};

const footerButtons = [
  {
    buttonId: 'apply',
    buttonLabel: 'Apply',
    buttonCallback: action('apply'),
  },
];

export const ruleBuilder = () => (
  <div style={{ width: '100%', height: 'calc(100vh - 100px)' }}>
    <RuleBuilder
      onChange={action('onChange')}
      actionBar={actions}
      handleOnSave={action('onSave')}
      handleOnCancel={action('onCancel')}
      footerButtons={footerButtons}
    />
  </div>
);

ruleBuilder.story = {
  name: 'new filter',
};

export const ruleBuilderWithRules = () => (
  <div style={{ width: '100%', height: 'calc(100vh - 100px)' }}>
    <RuleBuilder
      actionBar={actions}
      handleOnSave={action('onSave')}
      handleOnCancel={action('onCancel')}
      footerButtons={footerButtons}
      filter={filter}
    />
  </div>
);

ruleBuilderWithRules.story = {
  name: 'with existing filter rules',
};
