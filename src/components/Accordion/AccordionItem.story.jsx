import React from 'react';
import { storiesOf } from '@storybook/react';

import FullWidthWrapper from '../../internal/FullWidthWrapper';

import AccordionItem from './AccordionItem';

import { Accordion } from '.';

storiesOf('Watson IoT|AccordionItem', module).add('conditionally load', () => (
  <FullWidthWrapper>
    <Accordion>
      <AccordionItem id="a" title="Title one">
        <p>This content</p>
      </AccordionItem>
      <AccordionItem id="b" title="Title two">
        <p>This content</p>
      </AccordionItem>
    </Accordion>
  </FullWidthWrapper>
));
