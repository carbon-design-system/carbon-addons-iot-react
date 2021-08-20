import React from 'react';
import { mount } from '@cypress/react';

import { BAR_CHART_LAYOUTS, BAR_CHART_TYPES, CARD_SIZES } from '../../constants/LayoutConstants';
import { barChartData } from '../../utils/barChartDataSample';
import { settings } from '../../constants/Settings';

import BarChartCard from './BarChartCard';

const { prefix } = settings;
const commonProps = {
  title: 'Sample',
  id: 'sample-bar-chart',
  isLoading: false,
  content: {
    xLabel: 'Particles',
    yLabel: 'Cities',
    series: [
      {
        dataSourceId: 'particles',
      },
    ],
    unit: 'P',
    categoryDataSourceId: 'city',
    layout: BAR_CHART_LAYOUTS.HORIZONTAL,
    type: BAR_CHART_TYPES.SIMPLE,
    decimalPrecision: 3,
  },
  values: barChartData.quarters.filter((q) => q.quarter === '2020-Q1'),
  breakpoint: 'lg',
  size: 'LARGE',
  onCardAction: () => {},
};

describe('BarChartCard', () => {
  it('should show units on the x-axis on a horizontal chart with units', () => {
    mount(<BarChartCard {...commonProps} />);

    cy.findByLabelText('bottom axis').contains('Particles').should('have.text', 'Particles (P)');
  });

  it('should show a tooltip on mouseover a bar', () => {
    mount(
      <BarChartCard
        {...commonProps}
        content={{
          ...commonProps.content,
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          xLabel: 'Cities',
          yLabel: 'Particles',
        }}
      />
    );

    cy.get(`.${prefix}--cc--simple-bar > .bar`).eq(0).realHover().should('have.class', 'hovered');
    cy.findByLabelText('left axis').contains('Particles').should('have.text', 'Particles (P)');
    cy.get(`.${prefix}--cc--tooltip`).should('not.have.class', 'hidden');
    cy.get(`.${prefix}--cc--tooltip`).invoke('attr', 'aria-hidden').should('equal', 'false');
    cy.findByText('447.000 P').should('be.visible');
  });

  it('should show a zoombar on time series charts', () => {
    mount(
      <BarChartCard
        title="Particles over 4 days"
        id="simple-time-sample"
        breakpoint="lg"
        content={{
          xLabel: 'Date',
          yLabel: 'Particles',
          series: [
            {
              dataSourceId: 'particles',

              label: 'Particles really long label to check trunc',
            },
          ],
          timeDataSourceId: 'timestamp',
          type: 'SIMPLE',
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          zoomBar: {
            enabled: true,
            axes: 'top',
          },
        }}
        domainRange={[1581251825000, 1581524625000]}
        values={barChartData.timestamps.filter((t) => t.city === 'Amsterdam')}
        size={CARD_SIZES.LARGE}
        onCardAction={() => {}}
        availableActions={{ expand: true, range: true }}
      />
    );

    cy.get('.zoom-bar').should('be.visible');
  });

  it('should show a zoombar on small sizes time series charts that are expanded', () => {
    mount(
      <BarChartCard
        title="Particles over 4 days"
        id="simple-time-sample"
        breakpoint="lg"
        content={{
          xLabel: 'Date',
          yLabel: 'Particles',
          series: [
            {
              dataSourceId: 'particles',

              label: 'Particles really long label to check trunc',
            },
          ],
          timeDataSourceId: 'timestamp',
          type: 'SIMPLE',
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          zoomBar: {
            enabled: true,
            axes: 'top',
          },
        }}
        domainRange={[1581251825000, 1581524625000]}
        values={barChartData.timestamps.filter((t) => t.city === 'Amsterdam')}
        size={CARD_SIZES.MEDIUM}
        onCardAction={() => {}}
        availableActions={{ expand: true, range: true }}
        isExpanded
      />
    );

    cy.get('.zoom-bar').should('be.visible');
  });

  it('should show stacked bar charts in horizontal mode with time-series data', () => {
    mount(
      <BarChartCard
        title="Particles and temperature in cities"
        id="stacked-time-sample"
        breakpoint="lg"
        content={{
          type: BAR_CHART_TYPES.STACKED,
          xLabel: 'Total',
          yLabel: 'Dates',
          series: [
            {
              dataSourceId: 'particles',
              label: 'Particles',
            },
            {
              dataSourceId: 'emissions',
              label: 'Emissions',
            },
          ],
          timeDataSourceId: 'timestamp',
          layout: BAR_CHART_LAYOUTS.HORIZONTAL,
          zoomBar: {
            enabled: true,
            axes: 'top',
            view: 'graph_view',
          },
        }}
        values={barChartData.timestamps}
        size={CARD_SIZES.LARGE}
        onCardAction={() => {}}
        availableActions={{ expand: true, range: true }}
      />
    );

    cy.get(`.${prefix}--cc--stacked-bar`).should('be.visible');
    cy.get(`.${prefix}--cc--stacked-bar .bar`).eq(0).realHover();
    cy.get(`.${prefix}--cc--tooltip`).should('not.have.class', 'hidden');
    cy.get(`.${prefix}--cc--tooltip`).invoke('attr', 'aria-hidden').should('equal', 'false');
    cy.findByText('447').should('be.visible');
  });

  it('should show stacked bar charts in horizontal mode with time-series data in a domain range', () => {
    mount(
      <BarChartCard
        title="Particles and temperature in cities"
        id="stacked-time-sample"
        breakpoint="lg"
        content={{
          type: BAR_CHART_TYPES.STACKED,
          xLabel: 'Dates',
          yLabel: 'Total',
          series: [
            {
              dataSourceId: 'particles',
              label: 'Particles',
            },
            {
              dataSourceId: 'emissions',
              label: 'Emissions',
            },
          ],
          timeDataSourceId: 'timestamp',
          layout: BAR_CHART_LAYOUTS.HORIZONTAL,
          zoomBar: {
            enabled: true,
            axes: 'top',
            view: 'graph_view',
          },
        }}
        values={barChartData.timestamps.filter((t) => t.city === 'Amsterdam')}
        size={CARD_SIZES.LARGE}
        onCardAction={() => {}}
        domainRange={[1581251825000, 1581524625000]}
        availableActions={{ expand: true, range: true }}
      />
    );

    cy.get(`.${prefix}--cc--stacked-bar`).should('be.visible');
    cy.get(`.${prefix}--cc--stacked-bar .bar`).eq(0).realHover();
    cy.get(`.${prefix}--cc--tooltip`).should('not.have.class', 'hidden');
    cy.get(`.${prefix}--cc--tooltip`).invoke('attr', 'aria-hidden').should('equal', 'false');
    cy.findByText('447').should('be.visible');
  });
});
