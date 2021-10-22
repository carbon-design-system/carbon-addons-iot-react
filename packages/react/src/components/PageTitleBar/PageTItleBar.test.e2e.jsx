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
          testId="page-title-bar"
        />
      </div>
    );

    cy.findByTestId('page-title-bar')
      .should('not.have.class', 'page-title-bar--dynamic--during')
      .should('not.have.class', 'page-title-bar--dynamic--after')
      .should('not.have.class', 'page-title-bar--dynamic--before')
      .should('have.attr', 'style', '--header-offset:48px; --scroll-transition-progress:0;');

    cy.scrollTo(0, 114);
    cy.findByTestId('page-title-bar')
      .should('have.class', 'page-title-bar--dynamic--during')
      .should('not.have.class', 'page-title-bar--dynamic--after')
      .should('not.have.class', 'page-title-bar--dynamic--before')
      .should(($el) => {
        const scrollProgress = Number.parseFloat(
          $el[0].style.getPropertyValue('--scroll-transition-progress')
        ).toPrecision(1);

        expect(scrollProgress).to.equal('0.2');
      });

    cy.scrollTo(0, 200);
    cy.findByTestId('page-title-bar')
      .should('not.have.class', 'page-title-bar--dynamic--during')
      .should('have.class', 'page-title-bar--dynamic--after')
      .should('not.have.class', 'page-title-bar--dynamic--before')
      .should('have.attr', 'style', '--header-offset:48px; --scroll-transition-progress:1;');
  });
});
