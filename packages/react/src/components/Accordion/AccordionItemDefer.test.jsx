import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

import { settings } from '../../constants/Settings';

import AccordionItemDefer from './AccordionItemDefer';

import { Accordion } from '.';

const { prefix } = settings;

describe('AccordionItemDefer', () => {
  it('should be selectable by testId', () => {
    render(
      <Accordion>
        <AccordionItemDefer id="a" title="Title one" testId="DEFFERED">
          <p>This content</p>
        </AccordionItemDefer>
      </Accordion>
    );

    expect(screen.getByTestId('DEFFERED')).toBeDefined();
  });

  it('renders content when expanded', () => {
    const { container } = render(
      <Accordion>
        <AccordionItemDefer id="a" title="Title one">
          <p>This content</p>
        </AccordionItemDefer>
      </Accordion>
    );
    expect(
      screen.getByTestId('accordion-item-deferred').lastElementChild.childElementCount
    ).toEqual(0);
    fireEvent.click(container.querySelector(`.${prefix}--accordion__heading`));
    expect(
      screen.getByTestId('accordion-item-deferred').lastElementChild.childElementCount
    ).toEqual(1);
    // test that content will not close accordion
    fireEvent.click(container.querySelector(`.${prefix}--accordion__content`));
    expect(
      screen.getByTestId('accordion-item-deferred').lastElementChild.childElementCount
    ).toEqual(1);
  });

  it('does not remove content when closed', () => {
    const { container } = render(
      <Accordion>
        <AccordionItemDefer id="a" title="Title one" open>
          <p>This content</p>
        </AccordionItemDefer>
      </Accordion>
    );
    expect(
      screen.getByTestId('accordion-item-deferred').lastElementChild.childElementCount
    ).toEqual(1);
    fireEvent.click(container.querySelector(`.${prefix}--accordion__heading`));
    expect(
      screen.getByTestId('accordion-item-deferred').lastElementChild.childElementCount
    ).toEqual(1);
  });

  it('triggers callback when heading is clicked', () => {
    const headingClicked = jest.fn();
    render(
      <Accordion>
        <AccordionItemDefer id="a" title="Title one" onHeadingClick={headingClicked}>
          <p>This content</p>
        </AccordionItemDefer>
      </Accordion>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Title one' }));
    expect(headingClicked).toHaveBeenCalled();
  });
});
