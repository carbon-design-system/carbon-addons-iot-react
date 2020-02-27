import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import FullWidthWrapper from '../../internal/FullWidthWrapper';

import AccordionItem from './AccordionItem';

import { Accordion } from '.';

storiesOf('Watson IoT|AccordionItem', module).add('conditionally load', () => (
  <FullWidthWrapper>
    <Accordion>
      <AccordionItem id="a" title="Title one" open={boolean('switch open state via prop', true)}>
        <p>This content</p>
      </AccordionItem>
      <AccordionItem id="b" title="Title two">
        <p>This content</p>
      </AccordionItem>
    </Accordion>
  </FullWidthWrapper>
));
