import React from 'react';
import { mount } from '@cypress/react';

import SidePanel from './SidePanel';

describe('SidePanel', () => {
  const commonProps = {
    title: 'test title',
    subtitle: 'test content',
  };
  const content =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae bibendum urna. Maecenas interdum suscipit purus, et vehicula justo finibus sit amet. Fusce mi dolor, suscipit vel pharetra et, rhoncus et nisi. Nunc a bibendum turpis, aliquam tristique nibh. Vestibulum elit orci, posuere nec ante id, porttitor aliquam est. Proin est purus, rutrum ut sollicitudin in, vulputate a neque. Aliquam vulputate, diam vitae congue rutrum, velit arcu pulvinar neque, vel tristique quam mauris sit amet ipsum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam quam tortor, sagittis vitae nibh id, imperdiet efficitur urna. Duis fermentum nulla elementum, eleifend massa a, congue erat. Morbi a magna pulvinar, vulputate dui id, dignissim neque. Sed ultricies ligula sapien, posuere hendrerit turpis dapibus vitae. Nullam a nisi semper, efficitur ex ac, mattis nulla. Aliquam nec maximus lacus. Suspendisse venenatis erat suscipit mauris vulputate tincidunt';

  it('should go into condensed mode when content is scrolled', () => {
    cy.viewport(1680, 900);
    mount(
      <SidePanel style={{ height: '400px' }} {...commonProps} isOpen>
        {content}
      </SidePanel>
    );
    cy.findByTestId('side-panel').should('not.have.class', 'iot--sidepanel--condensed');
    // scroll content.
    cy.findByTestId('side-panel-content').scrollTo('bottom', { duration: 1000 });
    cy.findByTestId('side-panel').should('have.class', 'iot--sidepanel--condensed');
    // scroll back up
    cy.findByTestId('side-panel-content').scrollTo('top', { duration: 1000 });
    cy.findByTestId('side-panel').should('not.have.class', 'iot--sidepanel--condensed');
  });

  it('should render tooltip if the title text is too long', () => {
    cy.viewport(1680, 900);
    const aLongTitle =
      'A very very long title which will almost certainly overflow and require a tooltip and we must test these things, you know.';
    mount(
      <SidePanel isOpen title={aLongTitle}>
        this is some content
      </SidePanel>
    );

    cy.findByRole('button', { name: aLongTitle }).should('exist');
  });

  it('should not render tooltip if the title text is not too long', () => {
    cy.viewport(1680, 900);
    const aShortTitle = 'A short title';
    mount(
      <SidePanel isOpen title={aShortTitle}>
        this is some content
      </SidePanel>
    );

    cy.findByRole('button', { name: aShortTitle }).should('not.exist');
  });
});
