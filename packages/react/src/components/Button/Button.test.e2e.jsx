import React from 'react';
import { mount } from '@cypress/react';
import { onlyOn } from '@cypress/skip-test';

import Button from './Button';

const commonProps = {
  onClick: () => console.log('clicked'),
};

describe('Button', () => {
  beforeEach(() => {
    mount(<Button {...commonProps}>Click Me</Button>);
  });

  /* eslint-disable jest/expect-expect, testing-library/prefer-screen-queries */
  it('renders the text', () => {
    cy.findByText(/Click Me/).should('be.visible');
  });

  onlyOn('headless', () => {
    it('matches image snapshot', () => {
      cy.findByText(/Click Me/).compareSnapshot('Button');
    });
  });
});
