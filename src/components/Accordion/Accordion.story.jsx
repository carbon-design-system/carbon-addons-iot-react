// Copied from v10.17.0-rc-0 because in v10.17.0 the story imports an .mdx file that is not published in the bundle yet.
// When/if Carbon exports the .mdx documentation files, we can update to import the story directly from the Carbon package again.
// https://raw.githubusercontent.com/carbon-design-system/carbon/v10.17.0-rc.0/packages/react/src/components/Accordion/Accordion-story.js

/* eslint-disable no-console */

import React from 'react';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  boolean,
  number,
  select,
  text,
} from '@storybook/addon-knobs';

import Button from '../Button';

import { Accordion, AccordionItem, AccordionSkeleton } from '.';

export default {
  title: 'Accordion',
  component: Accordion,
  subcomponents: {
    AccordionItem,
    AccordionSkeleton,
  },
  decorators: [withKnobs],
};

const props = {
  onClick: action('onClick'),
  onHeadingClick: action('onHeadingClick'),
};

export const accordion = () => (
  <Accordion>
    <AccordionItem title="Section 1 title">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
    </AccordionItem>
    <AccordionItem title="Section 2 title">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
    </AccordionItem>
    <AccordionItem title="Section 3 title">
      <Button>This is a button.</Button>
    </AccordionItem>
    <AccordionItem
      title={
        <span>
          Section 4 title (<em>the title can be a node</em>)
        </span>
      }
      {...props}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
    </AccordionItem>
  </Accordion>
);

export const skeleton = () => (
  <div style={{ width: '500px' }}>
    <AccordionSkeleton open count={4} />
  </div>
);

export const playground = () => (
  <Accordion
    align={select(
      'Accordion heading alignment (align)',
      ['start', 'end'],
      'end'
    )}>
    <AccordionItem
      title={text('The title (title)', 'Section 1 title')}
      open={boolean('Open the section (open)', false)}
      {...props}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
    </AccordionItem>
    <AccordionItem title="Section 2 title" {...props}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
    </AccordionItem>
    <AccordionItem title="Section 3 title" {...props}>
      <Button>This is a button.</Button>
    </AccordionItem>
    <AccordionItem
      title={
        <span>
          Section 4 title (<em>the title can be a node</em>)
        </span>
      }
      {...props}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
    </AccordionItem>
  </Accordion>
);

export const skeletonPlayground = () => (
  <div style={{ width: '500px' }}>
    <AccordionSkeleton
      align={select(
        'Accordion heading alignment (align)',
        ['start', 'end'],
        'end'
      )}
      open={boolean('Show first item opened (open)', true)}
      count={number('Set number of items (count)', 4)}
    />
  </div>
);
