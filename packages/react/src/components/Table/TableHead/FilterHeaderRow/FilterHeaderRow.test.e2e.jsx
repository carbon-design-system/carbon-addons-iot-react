import React from 'react';
import { mount } from '@cypress/react';

import FilterHeaderRow from './FilterHeaderRow';

const myProps = {
  hasFastFilter: false,
  onApplyFilter: () => null,
  ordering: [{ columnId: 'col1' }],
  columns: [{ id: 'col1', name: 'Column 1', tooltip: 'this is a tooltip' }],
  showExpanderColumn: true,
};

describe('FilterHeaderRow', () => {
  beforeEach(() => {
    cy.viewport(1680, 900);
  });

  it('should call handler only once if close button is clicked', () => {
    cy.spy(myProps, 'onApplyFilter');
    mount(<FilterHeaderRow {...myProps} />);
    cy.findByPlaceholderText('Type and hit enter to apply').type('mytext');
    cy.findByRole('button')
      .click()
      .then(() => {
        expect(myProps.onApplyFilter).to.be.calledOnce;
      });
  });
});
