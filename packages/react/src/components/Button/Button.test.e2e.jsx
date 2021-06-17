import React from 'react';
import { mount } from '@cypress/react';

import Button from './Button.jsx';

const commonProps = {
  onClick: () => console.log('clicked'),
};

describe('Accordion', () => {
  beforeEach(() => {
    mount(
      <Button loading {...commonProps}>
        Click Me
      </Button>
    );
  });
  it('renders learn react link', () => {
    cy.findByText(/Click Me/).should('be.visible');
  });
});
