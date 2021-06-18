import React from 'react';
import { mount } from '@cypress/react';

import Button from './Button';

const commonProps = {
  onClick: () => console.log('clicked'),
};

describe('Button proof of concept', () => {
  beforeEach(() => {
    mount(
      <Button loading {...commonProps}>
        Click Me
      </Button>
    );
  });
  /* eslint-disable-next-line jest/expect-expect */
  it('renders the text', () => {
    /* eslint-disable-next-line testing-library/prefer-screen-queries */
    cy.findByText(/Click Me/).should('be.visible');
  });
});
