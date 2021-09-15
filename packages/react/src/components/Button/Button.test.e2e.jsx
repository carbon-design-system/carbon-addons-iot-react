import React from 'react';
import { mount } from '@cypress/react';
import { onlyOn } from '@cypress/skip-test';

import { VISUAL_REGRESSION_TEST_THRESHOLD } from '../../internal/constants';

import Button from './Button';

const commonProps = {
  onClick: () => {},
};

describe('Button', () => {
  onlyOn('headless', () => {
    it('matches image snapshot', () => {
      mount(<Button {...commonProps}>Click Me</Button>);
      cy.findByText(/Click Me/).compareSnapshot('Button', VISUAL_REGRESSION_TEST_THRESHOLD);
    });

    it('Ghost button matches image snapshot', () => {
      mount(
        <Button {...commonProps} kind="ghost">
          Click Me
        </Button>
      );
      cy.findByText(/Click Me/).compareSnapshot('Ghost_Button', VISUAL_REGRESSION_TEST_THRESHOLD);
    });
  });
});
