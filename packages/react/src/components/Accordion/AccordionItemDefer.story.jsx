import React from 'react';

import FullWidthWrapper from '../../internal/FullWidthWrapper';

import AccordionItemDefer from './AccordionItemDefer';

import { Accordion, AccordionItem } from '.';

export default {
  title: '1 - Watson IoT/AccordionItemDefer',
  component: AccordionItemDefer,
  parameters: {
    info: {
      text: `
      AccordionItemDefer can be used in place of a normal AccordionItem and it has the same proptypes signature. AccordionItemDefer waits to render the content/children until the accordion item is opened. Content/children are not removed or unmounted when the accordion item closes.
      `,
    },
  },
};

export const WithDeferredContentRendering = () => (
  <FullWidthWrapper>
    <Accordion>
      <AccordionItem id="a" title="A section without deferred content rendering">
        <p>
          This content is always rendered to the DOM, no matter if the accordion item has been open
          or closed.
        </p>
      </AccordionItem>
      <AccordionItemDefer id="b" title="A section with deferred content rendering">
        <p>
          This content will not be rendered to the DOM until the accordion item is opened. It is not
          removed from the DOM when the accordion is closed.
        </p>
      </AccordionItemDefer>
    </Accordion>
  </FullWidthWrapper>
);
