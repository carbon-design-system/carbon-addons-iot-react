import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import AccordionItemDefer from './AccordionItemDefer';

import { Accordion } from '.';

describe('AccordionItemDefer', () => {
  it('renders content when expanded', () => {
    const { container, getByTestId } = render(
      <Accordion>
        <AccordionItemDefer id="a" title="Title one">
          <p>This content</p>
        </AccordionItemDefer>
      </Accordion>
    );
    expect(getByTestId('accordion-item-deferred').lastElementChild.childElementCount).toEqual(0);
    fireEvent.click(container.querySelector('.bx--accordion__heading'));
    expect(getByTestId('accordion-item-deferred').lastElementChild.childElementCount).toEqual(1);
    // test that content will not close accordion
    fireEvent.click(container.querySelector('.bx--accordion__content'));
    expect(getByTestId('accordion-item-deferred').lastElementChild.childElementCount).toEqual(1);
  });

  it('does not remove content when closed', () => {
    const { container, getByTestId } = render(
      <Accordion>
        <AccordionItemDefer id="a" title="Title one" open>
          <p>This content</p>
        </AccordionItemDefer>
      </Accordion>
    );
    expect(getByTestId('accordion-item-deferred').lastElementChild.childElementCount).toEqual(1);
    fireEvent.click(container.querySelector('.bx--accordion__heading'));
    expect(getByTestId('accordion-item-deferred').lastElementChild.childElementCount).toEqual(1);
  });
});
