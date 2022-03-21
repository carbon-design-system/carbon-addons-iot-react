import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import StackedAreaChartCard from './StackedAreaChartCard';

const mockValues = [
  {
    group: 'Dummy',
    date: '2019-01-01T02:00:00.000Z',
    value: 10000,
  },

  {
    group: 'Dummy 2',
    date: '2019-01-05T02:00:00.000Z',
    value: 65000,
  },
  {
    group: 'Dummy 3',
    date: '2019-01-05T02:00:00.000Z',
    value: 65000,
  },
  {
    group: 'Dummy',
    date: '2019-01-02T02:00:00.000Z',
    value: 50400,
  },

  {
    group: 'Dummy 2',
    date: '2019-01-03T02:00:00.000Z',
    value: 32200,
  },
  {
    group: 'Dummy 3',
    date: '2019-01-07T02:00:00.000Z',
    value: 59293,
  },
];
describe('StackedAreaChartCard', () => {
  it('should be selectable with testId', () => {
    const { container } = render(
      <StackedAreaChartCard
        title="Title card"
        content={{
          xLabel: 'xlabel prop',
          yLabel: 'y label prop',
          xProperty: 'date',
          yProperty: 'value',
        }}
        values={mockValues}
        size="MEDIUM"
        breakpoint="md"
        isExpanded={false}
        locale="en"
        availableActions={{ expand: true }}
        onCardAction={() => {}}
        testId="STACKED_AREA_CHART_CARD_TEST"
      />
    );

    expect(screen.getByTestId('STACKED_AREA_CHART_CARD_TEST')).toBeDefined();
    expect(container.querySelectorAll('#mock-stacked-area-chart')).toHaveLength(1);
  });

  it('does not show stacked area chart when loading', () => {
    const { container } = render(
      <StackedAreaChartCard
        title="Card title"
        content={{
          xLabel: 'xlabel prop',
          yLabel: 'y label prop',
          xProperty: 'date',
          yProperty: 'value',
        }}
        values={mockValues}
        size="MEDIUM"
        breakpoint="md"
        isExpanded={false}
        locale="en"
        availableActions={{ expand: true }}
        onCardAction={() => {}}
        testId="STACKED_AREA_CHART_CARD_TEST"
        isLoading
      />
    );
    expect(container.querySelectorAll('#mock-stacked-area-chart')).toHaveLength(0);
  });

  it('does not show stacked area  chart when empty data', () => {
    const { container } = render(
      <StackedAreaChartCard
        title="Card title"
        content={{
          xLabel: 'xlabel prop',
          yLabel: 'y label prop',
          xProperty: 'date',
          yProperty: 'value',
        }}
        values={[]}
        size="MEDIUM"
        breakpoint="md"
        isExpanded={false}
        locale="en"
        availableActions={{ expand: true }}
        onCardAction={() => {}}
        testId="STACKED_AREA_CHART_CARD_TEST"
        isLoading
      />
    );
    expect(container.querySelectorAll('#mock-stacked-area-chart')).toHaveLength(0);
  });

  it('i18n string test', () => {
    const i18nTest = {
      noDataLabel: 'no-data-label',
    };

    const i18nDefault = StackedAreaChartCard.defaultProps.i18n;

    render(
      <StackedAreaChartCard
        title="Card title"
        content={{
          xLabel: 'xlabel prop',
          yLabel: 'y label prop',
          xProperty: 'date',
          yProperty: 'value',
        }}
        values={[]}
        size="MEDIUM"
        breakpoint="md"
        isExpanded={false}
        locale="en"
        availableActions={{ expand: true }}
        onCardAction={() => {}}
        testId="STACKED_AREA_CHART_CARD_TEST"
        i18n={i18nTest}
      />
    );
    expect(screen.getByText(i18nTest.noDataLabel)).toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.noDataLabel)).not.toBeInTheDocument();
  });
});
