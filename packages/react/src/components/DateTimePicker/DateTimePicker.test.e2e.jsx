import React from 'react';
import { mount } from '@cypress/react';

import DateTimePicker, { PICKER_KINDS } from './DateTimePicker';

describe('DateTimePicker', () => {
  it('should pick a new absolute ranges', () => {
    const onApply = cy.stub();
    const onCancel = cy.stub();
    mount(
      <DateTimePicker
        onApply={onApply}
        onCancel={onCancel}
        id="picker-test"
        hasTimeInput
        defaultValue={{
          timeRangeKind: PICKER_KINDS.ABSOLUTE,
          timeRangeValue: {
            start: new Date(2021, 7, 1, 12, 34, 0),
            end: new Date(2021, 7, 6, 10, 49, 0),
          },
        }}
      />
    );

    cy.findByText('2021-08-01 12:34 to 2021-08-06 10:49').should('be.visible').realClick();

    cy.findByText('Custom range').should('be.visible');
    cy.findByText('August').should('be.visible');
    cy.findByLabelText('Year').should('have.value', '2021');
    cy.findByLabelText('August 8, 2021').realClick();
    cy.findByLabelText('August 8, 2021').should('have.class', 'selected');
    cy.findByLabelText('August 6, 2021').should('have.class', 'selected');
    cy.findByText('Apply')
      .realClick()
      .should(() => {
        expect(onApply).to.be.calledWith({
          timeRangeKind: 'ABSOLUTE',
          timeRangeValue: {
            end: Cypress.sinon.match.any,
            endDate: '08/08/2021',
            start: Cypress.sinon.match.any,
            startDate: '08/06/2021',
          },
        });
      });
  });
});
