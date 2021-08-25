import React from 'react';
import { mount } from '@cypress/react';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';

import TimeSeriesCard from './TimeSeriesCard';

const { prefix } = settings;
describe('TimeSeriesCard', () => {
  it('should show a tooltip on mouseover a point', () => {
    mount(
      <TimeSeriesCard
        id="facility-temperature"
        availableActions={{ range: true, expand: true }}
        title="Temperature, Humidity, eCount, and Pressure"
        content={{
          series: [
            {
              label: 'Temperature',
              dataSourceId: 'temperature',
            },
          ],
          xLabel: 'Time',
          yLabel: 'Temperature',
          includeZeroOnXaxis: true,
          includeZeroOnYaxis: true,
          timeDataSourceId: 'timestamp',
          addSpaceOnEdges: 1,
          showLegend: null,
        }}
        values={[
          {
            ENTITY_ID: 'Sensor2-1',
            temperature: 68,
            humidity: 4.04,
            ecount: 55,
            devname: '6ctgim0Qcq',
            pressure: 1.95,
            status: true,
            timestamp: 1629476394000,
          },
        ]}
        interval="day"
        breakpoint="lg"
        size={CARD_SIZES.LARGE}
        onCardAction={() => {}}
      />
    );

    cy.get(`.dot`).realHover().should('have.class', 'hovered');
    cy.get(`.${prefix}--cc--tooltip`).should('not.have.class', 'hidden');
    cy.get(`.${prefix}--cc--tooltip`).invoke('attr', 'aria-hidden').should('equal', 'false');
    cy.findByText('68').should('be.visible');
    // this is to get rid of the hover above, or else it has adverse effects on the next test...very weird.
    cy.get('body').realClick({ x: 100, y: 200 });
  });

  it('should show a tooltip on mouseover a ruler line', () => {
    mount(
      <TimeSeriesCard
        id="facility-temperature"
        availableActions={{ range: true, expand: true }}
        title="Temperature, Humidity, eCount, and Pressure"
        content={{
          series: [
            {
              label: 'Temperature',
              dataSourceId: 'temperature',
            },
          ],
          xLabel: 'Time',
          yLabel: 'Temperature',
          includeZeroOnXaxis: true,
          includeZeroOnYaxis: true,
          timeDataSourceId: 'timestamp',
          addSpaceOnEdges: 1,
          showLegend: null,
        }}
        values={[
          {
            ENTITY_ID: 'Sensor2-1',
            temperature: 46,
            humidity: 4.04,
            ecount: 55,
            devname: '6ctgim0Qcq',
            pressure: 1.95,
            status: true,
            timestamp: 1629476394000,
          },
          {
            ENTITY_ID: 'Sensor2-2',
            temperature: 56,
            humidity: 4.04,
            ecount: 55,
            devname: '6ctgim0Qcq',
            pressure: 1.95,
            status: true,
            timestamp: 1629476394000,
          },
        ]}
        interval="day"
        breakpoint="lg"
        size={CARD_SIZES.LARGE}
        onCardAction={() => {}}
      />
    );

    cy.get('.chart-grid-backdrop').first().trigger('mousemove', 797, 271, { which: 1 });
    cy.get('.chart-grid-backdrop').first().trigger('mouseover', 797, 271, { which: 1 });

    cy.get(`.${prefix}--cc--tooltip`).should('not.have.class', 'hidden');
    cy.get(`.${prefix}--cc--tooltip`).invoke('attr', 'aria-hidden').should('equal', 'false');
    cy.findByText('46').should('be.visible');
    cy.findByText('56').should('be.visible');
  });
});
