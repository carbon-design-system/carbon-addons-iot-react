import React from 'react';
import { mount } from '@cypress/react';

import TableHead from './TableHead';

const myProps = {
  tableId: 'tablehead-test',
  /** List of columns */
  columns: [
    { id: 'col1', name: 'Column 1', tooltip: 'this is a tooltip', width: 40 },
    { id: 'col2', name: 'Column 2', tooltip: 'this is a tooltip', isSortable: true },
    { id: 'col3', name: 'Column 3', tooltip: 'this is a tooltip' },
  ],
  tableState: {
    selection: {},
    sort: {
      columnId: 'col3',
      direction: 'ASC',
    },
    ordering: [
      { columnId: 'col1', isHidden: false },
      { columnId: 'col2', isHidden: false },
      { columnId: 'col3', isHidden: false },
    ],
  },
  actions: {},
  options: {
    wrapCellText: 'auto',
    truncateCellText: false,
    preserveColumnWidths: false,
    hasMultiSort: true,
  },
};

describe('TableHead', () => {
  beforeEach(() => {
    cy.viewport(300, 200);
  });

  it('should show overflow if tooltips width is less than scrollwidth', () => {
    mount(<TableHead {...myProps} />);
    const isEclipseActive = (e) => e.scrollWidth > e.clientWidth;
    cy.contains(myProps.columns[0].name)
      .children('span')
      .then(($el) => {
        expect(isEclipseActive($el[0])).to.be.true;
      });
    cy.contains(myProps.columns[1].name)
      .children('span')
      .then(($el) => {
        expect(isEclipseActive($el[0])).to.be.false;
      });
  });

  it('should show tooltips on top of overflow menu', () => {
    mount(<TableHead {...myProps} />);
    cy.findByRole('img', { name: /list of options/i }).click();
    cy.contains(myProps.columns[1].name).trigger('mouseover');
    cy.contains(myProps.columns[1].name)
      .parent()
      .findByRole('tooltip', { name: myProps.columns[1].tooltip })
      .should('be.visible');
  });
});
