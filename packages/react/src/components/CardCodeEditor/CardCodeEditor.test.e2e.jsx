import React from 'react';
import { mount } from '@cypress/react';
import { onlyOn } from '@cypress/skip-test';

import { VISUAL_REGRESSION_TEST_THRESHOLD } from '../../internal/constants';

import CardCodeEditor from './CardCodeEditor';

let onCopy;
describe('CardCodeEditor loaded editor test', () => {
  it('renders the script tag', () => {
    mount(
      <CardCodeEditor
        open
        onSubmit={() => {}}
        onClose={() => {}}
        language="json"
        onCopy={() => {}}
        initialValue="/* write your code here */"
      />
    );
    cy.get('head')
      .find(
        '[src="https://cdn.jsdelivr.net/npm/monaco-editor@0.20.0/min/vs/editor/editor.main.js"]'
      )
      .should('exist');
  });

  it('should call the onCopy function when icon is clicked', () => {
    onCopy = cy.stub();
    mount(
      <CardCodeEditor
        open
        onSubmit={() => {}}
        onClose={() => {}}
        language="json"
        onCopy={onCopy}
        initialValue="/* write your code here */"
      />
    );
    cy.findByTitle(/Copy to clipboard/)
      .should('be.visible')
      .click()
      .then(() => {
        expect(onCopy).to.be.called;
      });
  });

  it('should load intial value into editor', () => {
    cy.viewport(1680, 900);
    mount(
      <CardCodeEditor
        open
        onSubmit={() => {}}
        onClose={() => {}}
        language="json"
        onCopy={() => {}}
        initialValue="/* write your code here */"
      />
    );
    // wait for script to load. fails intermittently without
    /* eslint-disable-next-line cypress/no-unnecessary-waiting */
    cy.wait(200);
    cy.findByText(/\/\* write your code here \*\//).should('be.visible');

    // This component throws a network error with too many calls to the cdn script it loads so adding snapshot to existing instance
    onlyOn('headless', () => {
      cy.findByTestId('ComposedModal').compareSnapshot(
        'CardCodeEditor',
        VISUAL_REGRESSION_TEST_THRESHOLD
      );
    });
  });
});
