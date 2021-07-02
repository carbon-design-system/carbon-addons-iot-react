import React from 'react';
import { mount } from '@cypress/react';
import { onlyOn } from '@cypress/skip-test';

import Button from './Button';

const commonProps = {
  onClick: () => console.log('clicked'),
};

describe('Button', () => {
  /* eslint-disable jest/expect-expect, testing-library/prefer-screen-queries */
  onlyOn('headless', () => {
    it('matches image snapshot', () => {
      mount(<Button {...commonProps}>Click Me</Button>);
      cy.findByText(/Click Me/).compareSnapshot('Button');
    });

    it('Ghost button matches image snapshot', () => {
      mount(
        <Button {...commonProps} kind="ghost">
          Click Me
        </Button>
      );
      cy.findByText(/Click Me/).compareSnapshot('Ghost_Button');
    });
  });
});
