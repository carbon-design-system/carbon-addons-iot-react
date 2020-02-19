import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import AccordionItem from './AccordionItem';

import { Accordion } from '.';

describe('AccordionItem', () => {
  test('that it conditionally loads', () => {
    const { getByTestId } = render(
      <Accordion>
        <AccordionItem id="a" title="Title one">
          <p>This content</p>
        </AccordionItem>
      </Accordion>
    );
    expect(getByTestId('accordion-item').lastElementChild.childElementCount).toEqual(0);
    fireEvent.click(getByTestId('accordion-item'));
    expect(getByTestId('accordion-item').lastElementChild.childElementCount).toEqual(1);
  });
});
