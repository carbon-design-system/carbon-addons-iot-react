import React from 'react';
import { mount } from '@cypress/react';
import { onlyOn } from '@cypress/skip-test';

import Button from './Button';

const commonProps = {
  onClick: () => {},
};

describe('Button', () => {
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
