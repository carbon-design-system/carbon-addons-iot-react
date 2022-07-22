import React from 'react';
import { mount } from '@cypress/react';
import { onlyOn } from '@cypress/skip-test';

import ListSpinner from './ListSpinner';

describe('ListSpinner', () => {
  const listItems = Array.from(Array(12)).map((el, i) => {
    const index = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;
    return { id: index, value: index };
  });
  onlyOn('headless', () => {
    it('matches image snapshot', () => {
      const commonProps = {
        testId: 'my-list',
        list: listItems,
        defaultSelectedId: '03',
        onClick: cy.stub(),
      };
      mount(<ListSpinner {...commonProps} />);
      cy.findByTestId('my-list').compareSnapshot('Button');
    });
  });

  it('updates selected when scrolled', () => {
    const onClick = cy.stub().as('my-cb');
    const commonProps = {
      testId: 'my-list',
      list: listItems,
      defaultSelectedId: '03',
      onClick,
    };
    mount(<ListSpinner {...commonProps} />);

    cy.findByTestId('my-list-list').trigger('wheel', {
      deltaX: 0,
      deltaY: 1000,
    });
    cy.get('@my-cb').should('have.been.called');
  });

  it('updates selected when swiped', () => {
    const onClick = cy.stub().as('my-cb2');
    const commonProps = {
      testId: 'my-list',
      list: listItems,
      defaultSelectedId: '03',
      onClick,
    };
    mount(<ListSpinner {...commonProps} />);

    cy.findByTestId('my-list-list')
      .trigger('touchstart', {
        touches: [{ pageY: 0, pageX: 0 }],
      })
      .trigger('touchmove', {
        touches: [{ pageY: 1000, pageX: 0 }],
      });
    cy.get('@my-cb2').should('have.been.called');
  });
});
