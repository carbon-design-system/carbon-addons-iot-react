import React from 'react';
import { mount } from '@cypress/react';

import { INTERVAL_VALUES, PICKER_KINDS } from '../../constants/DateConstants';

import DateTimePickerV2 from './DateTimePickerV2';

describe('DateTimePickerV2', () => {
  it('should pick a new absolute ranges', () => {
    const onApply = cy.stub();
    const onCancel = cy.stub();
    mount(
      <DateTimePickerV2
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

    cy.findByText('2021-08-01 12:34 to 2021-08-06 10:49').should('be.visible').click();

    cy.findByText('Custom range').should('be.visible');
    cy.findByText('August').should('be.visible');
    cy.findByLabelText('Year').should('have.value', '2021');
    cy.findByLabelText('August 8, 2021').click();
    cy.findByLabelText('August 8, 2021').should('have.class', 'selected');
    cy.findByLabelText('August 6, 2021').should('have.class', 'selected');
    cy.findByText('Apply')
      .click()
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

  it('should open the flyout when hitting enter', () => {
    const onApply = cy.stub();
    const onCancel = cy.stub();
    mount(
      <div style={{ width: '600px', padding: '3rem', marginLeft: '300px' }}>
        <DateTimePickerV2
          onApply={onApply}
          onCancel={onCancel}
          id="picker-test"
          hasTimeInput
          hasIconOnly
          defaultValue={{
            timeRangeKind: PICKER_KINDS.ABSOLUTE,
            timeRangeValue: {
              start: new Date(2021, 7, 1, 12, 34, 0),
              end: new Date(2021, 7, 6, 10, 49, 0),
            },
          }}
        />
      </div>
    );

    cy.findByTestId('date-time-picker-datepicker-flyout-button').trigger('keydown', {
      key: 'Home',
    });
    cy.findByText('Custom range').should('not.exist');
    cy.findByTestId('date-time-picker-datepicker-flyout-button').trigger('keydown', {
      key: 'Enter',
    });
    cy.findByText('Custom range').should('be.visible');
  });

  it('should not parse when relativeToWhen is empty', () => {
    const onApply = cy.stub();
    const onCancel = cy.stub();
    mount(
      <DateTimePickerV2
        onApply={onApply}
        onCancel={onCancel}
        id="picker-test"
        hasTimeInput
        defaultValue={{
          timeRangeKind: PICKER_KINDS.RELATIVE,
          timeRangeValue: {
            relativeToWhen: '',
          },
        }}
      />
    );

    cy.findAllByLabelText('Calendar').eq(0).click();
    cy.findByPlaceholderText('hh:mm').should('be.visible').type('12:04');
    cy.findByRole('button', { name: 'Apply' })
      .click()
      .should(() => {
        expect(onApply).to.have.been.calledWith({
          timeRangeKind: PICKER_KINDS.RELATIVE,
          timeRangeValue: {
            relativeToWhen: '',
            relativeToTime: '12:04',
          },
        });
      });
    cy.findByTestId('date-time-picker__field').should('contain.text', '');
  });

  it('should parse time after 5 characters have been typed', () => {
    const onApply = cy.stub();
    const onCancel = cy.stub();
    mount(
      <DateTimePickerV2
        onApply={onApply}
        onCancel={onCancel}
        id="picker-test"
        hasTimeInput
        defaultValue={{
          timeRangeKind: PICKER_KINDS.RELATIVE,
          timeRangeValue: {
            relativeToWhen: INTERVAL_VALUES.MINUTES,
            relativeToTime: '',
          },
        }}
      />
    );

    cy.findAllByLabelText('Calendar').eq(0).click();
    cy.findByPlaceholderText('hh:mm').should('be.visible').type('12:04');
    cy.findByRole('button', { name: 'Apply' })
      .click()
      .should(() => {
        expect(onApply).to.have.been.calledWith({
          timeRangeKind: PICKER_KINDS.RELATIVE,
          timeRangeValue: {
            relativeToWhen: INTERVAL_VALUES.MINUTES,
            relativeToTime: '12:04',
            end: Cypress.sinon.match.any,
            start: Cypress.sinon.match.any,
          },
        });
      });
  });
});
