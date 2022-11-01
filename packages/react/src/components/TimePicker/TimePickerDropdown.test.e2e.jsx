import React from 'react';
import { mount } from '@cypress/react';

import TimePickerDropdown from './TimePickerDropdown';

describe('TimePickerDropdown', () => {
  it('renders dropdown above when on bottom of page', () => {
    const onClick = cy.stub().as('my-cb');
    const timePickerProps = {
      readOnly: false,
      hideLabel: false,
      hideSecondaryLabel: false,
      id: 'time-picker-test',
      testId: 'time-picker-test',
      i18n: {
        labelText: 'Start',
        secondaryLabelText: 'End',
        helperText: 'This is some helper text',
        warnText: 'You have been warned',
      },
      type: 'single',
      invalid: [false, false],
      warn: [false, false],
      onChange: onClick,
    };
    mount(
      <div style={{ paddingTop: `calc(90vh - 100px)` }}>
        <TimePickerDropdown {...timePickerProps} />
      </div>
    );
    cy.findByTestId('time-picker-test-input').then((pos) => {
      cy.findByTestId('time-picker-test-input')
        .trigger('focus')
        .then(() => {
          cy.findByTestId('time-picker-test-spinner').then((pos2) => {
            expect(pos[0].getBoundingClientRect().top).to.be.equal(
              pos2[0].getBoundingClientRect().bottom
            );
          });
        });
    });
  });

  it('closes dropdown when you press escape key', () => {
    const onClick = cy.stub().as('my-cb');
    const timePickerProps = {
      readOnly: false,
      hideLabel: false,
      hideSecondaryLabel: false,
      id: 'time-picker-test',
      testId: 'time-picker-test',
      i18n: {
        labelText: 'Start',
        secondaryLabelText: 'End',
        helperText: 'This is some helper text',
        warnText: 'You have been warned',
      },
      type: 'single',
      invalid: [false, false],
      warn: [false, false],
      onChange: onClick,
    };
    mount(<TimePickerDropdown {...timePickerProps} />);
    cy.findByTestId('time-picker-test-input').then(() => {
      cy.findByTestId('time-picker-test-input')
        .trigger('focus')
        .then(() => {
          cy.findByTestId('time-picker-test-spinner').should('exist');
        })
        .then(() => {
          cy.findByTestId('time-picker-test-input')
            .type('{esc}')
            .then(() => {
              cy.findByTestId('time-picker-test-spinner').should('not.exist');
            });
        });
    });
  });
});
