import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import AccordionItem from './AccordionItem';

import { Accordion } from '.';

describe('AccordionItem', () => {
  test('that it conditionally loads', () => {
    const { container, getByTestId } = render(
      <Accordion>
        <AccordionItem id="a" title="Title one">
          <p>This content</p>
        </AccordionItem>
      </Accordion>
    );
    expect(getByTestId('accordion-item').lastElementChild.childElementCount).toEqual(0);
    fireEvent.click(container.querySelector('.bx--accordion__heading'));
    expect(getByTestId('accordion-item').lastElementChild.childElementCount).toEqual(1);
    // test that content will not close accordion
    fireEvent.click(container.querySelector('.bx--accordion__content'));
    expect(getByTestId('accordion-item').lastElementChild.childElementCount).toEqual(1);
  });
});
