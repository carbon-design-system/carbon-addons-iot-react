import React from 'react';
import { mount } from '@cypress/react';

import PageTitleBar from './PageTitleBar';

describe('PageTitleBar', () => {
  it('Reacts to scrollY when set to dynamic', () => {
    mount(
      <div style={{ paddingTop: '10rem', height: '200vh' }}>
        <PageTitleBar
          breadcrumb={[<a href="/">Home</a>, <a href="/">Type</a>, <span>Instance</span>]}
          title="testTitle"
          headerMode="DYNAMIC"
          description={<p data-testid="test-description">test</p>}
          testId="page-title-bar"
          upperActions={
            <button data-testid="upper-action-delete" type="button">
              Delete
            </button>
          }
        />
      </div>
    );

    cy.findByTestId('test-description').should('have.text', 'test');
    cy.findByTestId('upper-action-delete').should('have.text', 'Delete');
    cy.findByTestId('page-title-bar')
      .should('not.have.class', 'page-title-bar--dynamic--during')
      .should('not.have.class', 'page-title-bar--dynamic--after')
      .should('not.have.class', 'page-title-bar--dynamic--before');
    // .should('have.css', '--header-offset', '48px')
    // .should('have.css', '--scroll-transition-progress', '0');

    cy.scrollTo(0, 118);
    cy.findByTestId('page-title-bar')
      .should('have.class', 'page-title-bar--dynamic--during')
      .should('not.have.class', 'page-title-bar--dynamic--after')
      .should('not.have.class', 'page-title-bar--dynamic--before');
    // .should('have.css', '--scroll-transition-progress', '0.2');

    cy.scrollTo(0, 200);
    cy.findByTestId('page-title-bar')
      .should('not.have.class', 'page-title-bar--dynamic--during')
      .should('have.class', 'page-title-bar--dynamic--after')
      .should('not.have.class', 'page-title-bar--dynamic--before');
    // .should('have.css', '--scroll-transition-progress', '1');
  });
});
