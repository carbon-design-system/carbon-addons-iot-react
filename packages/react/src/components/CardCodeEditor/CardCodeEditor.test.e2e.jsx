import React from 'react';
import { mount } from '@cypress/react';
import { onlyOn } from '@cypress/skip-test';

import CardCodeEditor from './CardCodeEditor';

let onCopy;
describe('CardCodeEditor loaded editor test', () => {
  /* eslint-disable  jest/expect-expect, testing-library/prefer-screen-queries */

  it('renders the script tag', () => {
    onCopy = cy.stub();
    mount(
      <CardCodeEditor
        open
        onSubmit={() => {}}
        onClose={() => {}}
        language="json"
        onCopy={(value) => onCopy(value)}
        initialValue="/* write your code here */"
      />
    );
    cy.get('head')
      .find(
        '[src="https://cdn.jsdelivr.net/npm/monaco-editor@0.20.0/min/vs/editor/editor.main.js"]'
      )
      .should('exist');
  });

  it('intial value is loaded into editor', () => {
    onCopy = cy.stub();
    mount(
      <CardCodeEditor
        open
        onSubmit={() => {}}
        onClose={() => {}}
        language="json"
        onCopy={(value) => onCopy(value)}
        initialValue="/* write your code here */"
      />
    );

    cy.findByText(/\/\* write your code here \*\//).should('be.visible');
  });

  it('should call the onCopy function when icon is clicked', () => {
    onCopy = cy.stub();
    mount(
      <CardCodeEditor
        open
        onSubmit={() => {}}
        onClose={() => {}}
        language="json"
        onCopy={(value) => onCopy(value)}
        initialValue="/* write your code here */"
      />
    );
    // increase timeout for loading of 3rd party script (monaco)
    cy.findByTitle(/Copy to clipboard/, { timeout: 10000 })
      .click()
      .then(() => {
        /* eslint-disable-next-line no-unused-expressions, jest/valid-expect */
        expect(onCopy).to.be.called;
      });
  });

  onlyOn('headless', () => {
    it('matches image snapshot', () => {
      onCopy = cy.stub();
      mount(
        <CardCodeEditor
          open
          onSubmit={() => {}}
          onClose={() => {}}
          language="json"
          onCopy={(value) => onCopy(value)}
          initialValue="/* write your code here */"
        />
      );
      /* eslint-disable-next-line jest/valid-expect-in-promise */
      cy.findByText(/\/\* write your code here \*\//) // wait for script to load before screen shot
        .should('be.visible')
        .then(() => cy.get('.iot--editor-copy-wrapper').compareSnapshot('CardCodeEditor'));
    });
  });
});
