import React from 'react';
import { mount } from '@cypress/react';

import CardCodeEditor from './CardCodeEditor';

let onCopy;
describe('CardCodeEditor loaded editor test', () => {
  beforeEach(() => {
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
  });
  /* eslint-disable-next-line jest/expect-expect */
  it('renders the script tag', () => {
    cy.get('head')
      .find(
        '[src="https://cdn.jsdelivr.net/npm/monaco-editor@0.20.0/min/vs/editor/editor.main.js"]'
      )
      .should('exist');
  });
  /* eslint-disable-next-line jest/expect-expect */
  it('intial value is loaded into editor', () => {
    /* eslint-disable-next-line testing-library/prefer-screen-queries */
    cy.findByText(/\/\* write your code here \*\//).should('be.visible');
  });

  it('should call the onCopy function when icon is clicked', () => {
    cy.get(`.bx--snippet__icon`)
      .click()
      .then(() => {
        /* eslint-disable-next-line no-unused-expressions, jest/valid-expect */
        expect(onCopy).to.be.called;
      });
  });
});
