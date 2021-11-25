import React from 'react';
import { mount } from '@cypress/react';

import dayjs from '../../utils/dayjs';
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
    cy.findAllByLabelText('Increment hours').eq(0).click();
    cy.findByLabelText('End time').type('12:34');
    cy.findByText('Apply')
      .click()
      .should(() => {
        expect(onApply).to.be.calledWith({
          timeRangeKind: 'ABSOLUTE',
          timeRangeValue: {
            end: Cypress.sinon.match.any,
            endDate: '08/08/2021',
            endTime: '12:34',
            start: Cypress.sinon.match.any,
            startDate: '08/06/2021',
            startTime: '01:00',
            humanValue: '2021-08-06 01:00 to 2021-08-08 12:34',
            tooltipValue: '',
          },
        });
      });
  });

  it('should disable apply button when relative TimePickerSpinner input is invalid ', () => {
    const { i18n } = DateTimePickerV2.defaultProps;
    const onApply = cy.stub();
    const onCancel = cy.stub();
    mount(<DateTimePickerV2 onApply={onApply} onCancel={onCancel} id="picker-test" hasTimeInput />);

    cy.findAllByLabelText('Calendar').eq(0).click();
    cy.findByText('Custom Range').click();

    cy.findByPlaceholderText('hh:mm').type('91:35');

    cy.findByText(i18n.applyBtnLabel).should('be.disabled');

    cy.findByPlaceholderText('hh:mm').type(
      '{backspace}{backspace}{backspace}{backspace}{backspace}11:35'
    );
    cy.findByText(i18n.applyBtnLabel).should('not.be.disabled');
  });

  it('should disable apply button when absolute TimePickerSpinner inputs are invalid ', () => {
    const { i18n } = DateTimePickerV2.defaultProps;
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
            startDate: '2021-08-01',
            startTime: '12:34',
            endDate: '2021-08-06',
            endTime: '10:49',
          },
        }}
      />
    );

    cy.findByText('2021-08-01 12:34 to 2021-08-06 10:49').should('be.visible').click();

    cy.findByLabelText(i18n.startTimeLabel).type(
      '{backspace}{backspace}{backspace}{backspace}{backspace}91:35'
    );
    cy.findByText(i18n.applyBtnLabel).should('be.disabled');

    cy.findByLabelText(i18n.startTimeLabel).type(
      '{backspace}{backspace}{backspace}{backspace}{backspace}11:35'
    );
    cy.findByText(i18n.applyBtnLabel).should('not.be.disabled');

    cy.findByLabelText(i18n.endTimeLabel).type(
      '{backspace}{backspace}{backspace}{backspace}{backspace}11:61'
    );
    cy.findByText(i18n.applyBtnLabel).should('be.disabled');

    // set time to 11:00
    cy.findByLabelText(i18n.endTimeLabel).type('{backspace}{backspace}00');
    cy.findByText(i18n.applyBtnLabel).should('not.be.disabled');
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
            humanValue: '',
            tooltipValue: '',
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
            humanValue: Cypress.sinon.match((value) => {
              return value.includes('Invalid Date') && value.includes('12:04');
            }),
            tooltipValue: '',
          },
        });
      });
  });

  it('should pick ranges across months', () => {
    const onApply = cy.stub();
    const onCancel = cy.stub();
    // the calendar in Flatpickr does not respect MockDate or cy.clock, so we must resort to using
    // the current date, but picking specific days to test and format the dynamic output as expected
    const now = dayjs();
    const thisMonthLabel = now.format(`MMMM [12], YYYY`);
    const lastMonth = now.subtract(1, 'month');
    const lastMonthLabel = lastMonth.format(`MMMM [20], YYYY`);
    mount(
      <DateTimePickerV2
        onApply={onApply}
        onCancel={onCancel}
        id="picker-test"
        hasTimeInput={false}
      />
    );

    cy.findByRole('button', { name: 'Last 30 minutes' }).should('be.visible').click();
    cy.findByText('Custom Range').should('be.visible').click();
    cy.findByText('Absolute').should('be.visible').click();
    cy.get(`.flatpickr-prev-month`).click();
    cy.findByLabelText(lastMonthLabel).click();
    cy.findByLabelText(lastMonthLabel).should('have.class', 'selected');
    cy.get(`.flatpickr-next-month`).click();
    cy.findByLabelText(thisMonthLabel).click();
    cy.findByLabelText(thisMonthLabel).should('have.class', 'selected');
    cy.findByRole('button', { name: 'Apply' })
      .click()
      .should(() => {
        expect(onApply).to.be.calledWith({
          timeRangeKind: 'ABSOLUTE',
          timeRangeValue: {
            end: Cypress.sinon.match.any,
            endDate: now.format(`MM/[12]/YYYY`),
            endTime: '00:00',
            start: Cypress.sinon.match.any,
            startDate: lastMonth.format(`MM/[20]/YYYY`),
            startTime: '00:00',
            humanValue: `${lastMonth.format('YYYY-MM-[20]')} 00:00 to ${now.format(
              'YYYY-MM-[12]'
            )} 00:00`,
            tooltipValue: '',
          },
        });
      });
  });
});
