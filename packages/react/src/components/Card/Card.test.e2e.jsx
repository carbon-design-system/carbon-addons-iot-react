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

    // only three loaded at first.
    cy.findAllByText(/renderprop/).should('have.length', 3);

    // scroll down to load the rest.
    cy.scrollTo('bottom', { duration: 1000 });
    cy.findAllByText(/renderprop/).should('have.length', 8);
  });

  it('should render tooltip if the text is too long', () => {
    cy.viewport(1680, 900);
    const aLongTitle =
      'A very very long title which will almost certainly overflow and require a tooltip and we must test these things, you know.';
    mount(
      <Card
        style={{ width: '400px', height: '360px' }}
        id="myCard"
        title={aLongTitle}
        size={CARD_SIZES.MEDIUM}
      />
    );

    cy.findByRole('button', { name: aLongTitle }).should('exist');
  });

  it('should not render tooltip if the text is not too long', () => {
    cy.viewport(1680, 900);
    const aShortTitle = 'A short title';
    mount(
      <Card
        style={{ width: '600px', height: '360px' }}
        id="myCard"
        title={aShortTitle}
        size={CARD_SIZES.MEDIUM}
        breakpoint="lg"
      />
    );

    cy.findByRole('button', { name: aShortTitle }).should('not.exist');
  });

  it('should close title tooltip in title if window is scrolled', () => {
    cy.viewport(1680, 900);
    const title =
      'Card Title that should be truncated and presented in a tooltip while the cards also has an external tooltip.';

    mount(
      <div style={{ height: '1500px' }}>
        <Card
          style={{ width: '600px', height: '360px' }}
          title={title}
          subtitle="Lorem ipsum"
          hasTitleWrap
          id="facilitycard-basic"
          size={CARD_SIZES.MEDIUM}
          breakpoint="lg"
          footerContent={() => <div>Footer Content</div>}
        />
      </div>
    );

    cy.findByRole('button', { name: title }).click();
    cy.findByTestId('Card-title-tooltip').should('exist');
    cy.findByTestId('Card-title-tooltip').should('be.visible');

    cy.scrollTo(0, 50);

    cy.findByTestId('Card-title-tooltip').should('not.exist');
  });

  it('should close subtitle tooltip in title if window is scrolled', () => {
    cy.viewport(1680, 900);
    const subtitle =
      'Card Title that should be truncated and presented in a tooltip while the cards also has an external tooltip.';

    mount(
      <div style={{ height: '1500px' }}>
        <Card
          style={{ width: '600px', height: '360px' }}
          title="Hello, world!"
          subtitle={subtitle}
          hasTitleWrap
          id="facilitycard-basic"
          size={CARD_SIZES.MEDIUM}
          breakpoint="lg"
          footerContent={() => <div>Footer Content</div>}
          tooltip={<p>this is the external tooltip content</p>}
        />
      </div>
    );

    cy.findByRole('button', { name: subtitle }).click();
    cy.findByTestId('Card-subtitle').should('exist');
    cy.findByTestId('Card-subtitle').should('be.visible');

    cy.scrollTo(0, 50);

    cy.findByTestId('Card-subtitle').should('not.exist');
  });

  it('should close info icon tooltip in title if window is scrolled', () => {
    cy.viewport(1680, 900);

    mount(
      <div style={{ height: '1500px' }}>
        <Card
          style={{ width: '600px', height: '360px' }}
          title="Hello, world!"
          subtitle="Subtitle"
          hasTitleWrap
          id="facilitycard-basic"
          size={CARD_SIZES.MEDIUM}
          breakpoint="lg"
          footerContent={() => <div>Footer Content</div>}
          tooltip={<p>this is the external tooltip content</p>}
        />
      </div>
    );

    cy.findByRole('button', { name: 'Tooltip info icon' }).click();
    cy.findByTestId('Card-tooltip').should('exist');
    cy.findByTestId('Card-tooltip').should('be.visible');

    cy.scrollTo(0, 50);

    cy.findByTestId('Card-tooltip').should('not.exist');
  });
});
