import React from 'react';
import { mount } from '@cypress/react';

import { CARD_SIZES } from '../../constants/LayoutConstants';

import Card from './Card';

describe('Card', () => {
  it('should lazy-load content when isLazyLoading:true', () => {
    cy.viewport(1680, 900);
    const ManyCards = () =>
      Array(8)
        .fill()
        .map((_, i) => (
          <Card
            title={`Lazy loading card #${i}`}
            id={`card-${i}`}
            key={`card-${i}`}
            size={CARD_SIZES.MEDIUM}
            breakpoint="lg"
            isLazyLoading
          >
            {(childSize) => (
              <p>
                Card with a renderprop. The content width is {childSize.width} and height is{' '}
                {childSize.height}
              </p>
            )}
          </Card>
        ));
    mount(<ManyCards />);

    // only five loaded at first.
    cy.findAllByText(/renderprop/).should('have.length', 3);

    // scroll down to load the rest.
    cy.scrollTo('bottom', { duration: 500 });
    cy.findAllByText(/renderprop/).should('have.length', 8);
  });
});
