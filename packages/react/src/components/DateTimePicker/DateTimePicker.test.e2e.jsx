import React from 'react';
import { mount } from '@cypress/react';

import { settings } from '../../constants/Settings';

import DateTimePicker, { PICKER_KINDS } from './DateTimePicker';

const { iotPrefix } = settings;

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

  it('should be able to navigate by keyboard', () => {
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

    cy.findByText('2021-08-01 12:34 to 2021-08-06 10:49').should('be.visible');
    cy.get('body').realPress('Tab');
    cy.findByRole('dialog').should('be.visible');
    cy.findByRole('button', { name: /2021-08-01 12:34 to 2021-08-06 10:49/ })
      .should('be.focused')
      .type('{enter}');
    cy.findByText('Custom range').should('be.visible');
    cy.findByText('August').should('be.visible');
    cy.findByLabelText('Year').should('have.value', '2021');
    // this _should_ tab from the input to the absolute label, but unfortunately it doesn't in the test
    // because the `tab()` call is still experimental, so manually focus it instead to mimic the
    // behavior in the browser.
    // cy.focused().realPress('Tab')
    cy.findByLabelText('Absolute').focus().should('be.focused').type('{leftarrow}');
    cy.findByText('Relative to').should('be.visible');
    cy.findByLabelText('Relative').focus().should('be.focused').type('{rightarrow}');
    cy.findByLabelText('Absolute').should('be.focused');
    cy.findByText('Custom range').should('be.visible');
    cy.findByLabelText('Absolute').should('be.focused').realPress('Tab');
    cy.focused().invoke('attr', 'id').should('eq', 'picker-test-date-picker-input-start');
    cy.focused().type('{downarrow}{downarrow}{enter}');
    cy.findByLabelText('August 6, 2021').should('have.class', 'selected');
    cy.findByLabelText('August 13, 2021').should('have.class', 'selected');
    cy.focused().realPress('Tab').realPress('Tab');
    cy.findByLabelText('Start time')
      .should('be.focused')
      .type('{backspace}{backspace}{backspace}{backspace}{backspace}11:35');
    cy.focused().realPress('Tab');
    cy.findAllByTitle('Increment hours').eq(0).should('be.focused');
    cy.focused().realPress('Tab');
    cy.findAllByTitle('Decrement hours').eq(0).should('be.focused');
    cy.focused().realPress('Tab');
    cy.findByLabelText('End time')
      .should('be.focused')
      .type('{backspace}{backspace}{backspace}{backspace}{backspace}12:39');
    cy.focused().realPress('Tab');
    cy.findAllByTitle('Increment hours').eq(1).should('be.focused');
    cy.focused().realPress('Tab');
    cy.findAllByTitle('Decrement hours').eq(1).should('be.focused');
    cy.focused().realPress('Tab');
    cy.focused().should('contain.text', 'Back');
    cy.focused().realPress('Tab');
    cy.focused().should('contain.text', 'Apply');
    cy.focused()
      .type('{enter}')
      .should(() => {
        expect(onApply).to.be.calledWith({
          timeRangeKind: 'ABSOLUTE',
          timeRangeValue: {
            end: Cypress.sinon.match.any,
            endDate: '08/13/2021',
            endTime: '12:39',
            start: Cypress.sinon.match.any,
            startDate: '08/06/2021',
            startTime: '11:35',
          },
        });
      });
  });

  it('should be able to navigate the preset list with a keyboard', () => {
    const onApply = cy.stub();
    const onCancel = cy.stub();
    mount(<DateTimePicker onApply={onApply} onCancel={onCancel} id="picker-test" />);

    cy.findAllByRole('button', { name: 'Last 30 minutes' }).eq(0).click();
    cy.findByText('Custom Range').should('be.visible');
    // add the focus() call because cypress loses it too easily
    // and the type command will call click to re-gain focus which
    // actually causes the picker to close. :-\
    cy.findAllByRole('button', { name: /Last 30 minutes/ })
      .focus()
      .type('{downarrow}', { force: true });
    cy.findByText('Custom Range').should('be.focused');
    cy.focused().type('{downarrow}');
    cy.findAllByText('Last 30 minutes').eq(1).should('be.focused');
    cy.focused().type('{downarrow}');
    cy.findByText('Last 1 hour').should('be.focused');
    cy.focused().type('{downarrow}');
    cy.findByText('Last 6 hours').should('be.focused');
    cy.focused().type('{downarrow}');
    cy.findByText('Last 12 hours').should('be.focused');
    cy.focused().type('{downarrow}');
    cy.findByText('Last 24 hours').should('be.focused');
    cy.focused().type('{downarrow}');
    cy.findByText('Custom Range').should('be.focused');
    cy.focused().type('{uparrow}');
    cy.findByText('Last 24 hours').should('be.focused');
    cy.focused().type('{uparrow}');
    cy.findByText('Last 12 hours').should('be.focused');
    cy.focused().type('{leftarrow}');
    cy.findByText('Last 12 hours').should('be.focused');
    cy.focused().type('{rightarrow}');
    cy.findByText('Last 12 hours').should('be.focused');
    cy.focused().type('{uparrow}');
    cy.findByText('Last 6 hours')
      .should('be.focused')
      .type('{enter}')
      .should('have.class', `${iotPrefix}--date-time-picker__listitem--preset-selected`);
    // tab to the apply button
    cy.focused().realPress('Tab').realPress('Tab').realPress('Tab').realPress('Tab');
    cy.focused()
      .type('{enter}')
      .should(() => {
        expect(onApply).to.be.calledWith({
          timeRangeKind: 'PRESET',
          timeRangeValue: {
            id: 'item-03',
            label: 'Last 6 hours',
            offset: 360,
          },
        });
      });
  });

  it('should close when `Escape` is pressed', () => {
    const onApply = cy.stub();
    const onCancel = cy.stub();
    mount(<DateTimePicker onApply={onApply} onCancel={onCancel} id="picker-test" />);

    cy.get('body').realPress('Tab');
    cy.focused().type('{enter}');
    cy.findByText('Last 12 hours').should('be.visible');
    cy.focused().type('{esc}');
    cy.findByText('Last 12 hours').should('not.be.visible');
  });

  it("should do nothing when `ArrowDown` is pressed if it isn't open.", () => {
    const onApply = cy.stub();
    const onCancel = cy.stub();
    mount(<DateTimePicker onApply={onApply} onCancel={onCancel} id="picker-test" />);

    cy.get('body').realPress('Tab');
    cy.focused().type('{downarrow}');
    cy.findByText('Last 12 hours').should('not.be.visible');
  });

  it("should do nothing when `ArrowDown` is pressed if it's not a custom range", () => {
    const onApply = cy.stub();
    const onCancel = cy.stub();
    mount(
      <DateTimePicker
        onApply={onApply}
        onCancel={onCancel}
        id="picker-test"
        defaultValue={{
          timeRangeKind: PICKER_KINDS.RELATIVE,
          timeRangeValue: {
            lastNumber: 20,
            lastInterval: 'MINUTES',
            relativeToWhen: 'TODAY',
            relativeToTime: '13:30',
          },
        }}
      />
    );

    cy.get('body').realPress('Tab');
    cy.focused().click().type('{downarrow}');
    cy.findAllByRole('button').eq(0).should('be.focused');
  });
});
