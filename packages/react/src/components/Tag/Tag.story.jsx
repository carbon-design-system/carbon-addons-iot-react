/* eslint-disable react/destructuring-assignment */
/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs';
import { Carbon, Compass, Tag as TagIcon } from '@carbon/react/icons';
import { action } from '@storybook/addon-actions';
import { types as typesList } from 'carbon-components-react/es/components/Tag';

import { Tag, TagSkeleton } from '.';

const icons = {
  'Carbon (Carbon16 from `@carbon/icons-react`)': 'Carbon16',
  'Compass (Compass16 from `@carbon/icons-react`)': 'Compass16',
  'Tag (Tag16 from `@carbon/icons-react`)': 'Tag16',
};

const iconMap = {
  Carbon,
  Compass,
  TagIcon,
};

const sizes = {
  'Default size': undefined,
  'Small size (sm)': 'sm',
};

const props = {
  regular: () => ({
    type: select(
      'Tag type (type)',
      typesList.reduce(
        (acc, type) => ({
          ...acc,
          [`${type} (${type})`]: type,
        }),
        {
          Default: undefined,
        }
      )
    ),
    disabled: boolean('Disabled (disabled)', false),
    size: select('Field size (size)', sizes, undefined) || undefined,
    title: text('Title (title)', 'Clear Filter'),
  }),
  filter() {
    return {
      ...this.regular(),
      onClick: action('onClick'),
      onClose: action('onClose'),
    };
  },
  icon() {
    return {
      ...this.regular(),
      renderIcon: iconMap[select('Icon (icon)', icons, 'Tag16')],
    };
  },
};

export default {
  title: '3 - Carbon/Tag',
  decorators: [withKnobs],

  parameters: {
    component: Tag,

    subcomponents: {
      TagSkeleton,
    },
  },
};

export const _Default = () => (
  <Tag className="some-class" {...props.regular()}>
    {text('Content (children)', 'This is a tag')}
  </Tag>
);

_Default.parameters = {
  info: {
    text: `
        Tags are used for items that need to be labeled, categorized, or organized using keywords that describe them.
        The example below shows how the Tag component can be used. Each type has a default message describing the type,
        but a custom message can also be applied.
      `,
  },
};

export const Filter = () => (
  <Tag className="some-class" {...props.filter()} filter>
    {text('Content (children)', 'This is a tag')}
  </Tag>
);

Filter.parameters = {
  info: {
    text: `
        Tags are used for items that need to be labeled, categorized, or organized using keywords that describe them.
        The example below shows how the Tag component can be used. Each type has a default message describing the type,
        but a custom message can also be applied.
      `,
  },
};

export const CustomIcon = () => (
  <Tag className="some-class" {...props.icon()}>
    {text('Content (children)', 'This is a tag')}
  </Tag>
);

CustomIcon.parameters = {
  info: {
    text: `
        Tags are used for items that need to be labeled, categorized, or organized using keywords that describe them.
        The example below shows how the Tag component can be used. Each type has a default message describing the type,
        but a custom message can also be applied.
      `,
  },
};

export const Skeleton = () => (
  <div>
    <TagSkeleton />
    <TagSkeleton size="sm" />
  </div>
);

Skeleton.storyName = 'skeleton';

Skeleton.parameters = {
  info: {
    text: `
      Placeholder skeleton state to use when content is loading.
      `,
  },
};
