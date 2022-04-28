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

/*
  FYI: the underlying Carbon Charts controls have been mocked.
  Check __mocks__/@carbon/charts-react/ for details
*/

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
  it('render xLabel/yLabel + title ', () => {
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
      />
    );
    expect(container.querySelectorAll('#mock-stacked-area-chart')).toHaveLength(1);
    expect(screen.getByText('Card title')).toBeDefined();
  });
  it('render yThresholds', () => {
    const { container } = render(
      <StackedAreaChartCard
        title="Card title"
        content={{
          xLabel: 'xlabel prop',
          yLabel: 'y label prop',
          xProperty: 'date',
          yProperty: 'value',
          yThresholds: [
            {
              value: 80000,
              label: 'Threshold',
            },
          ],
        }}
        values={mockValues}
        size="MEDIUM"
        breakpoint="md"
        isExpanded={false}
        locale="en"
        availableActions={{ expand: true }}
        onCardAction={() => {}}
      />
    );
    expect(container.querySelectorAll('#mock-stacked-area-chart')).toHaveLength(1);
  });
  it('render xThresholds', () => {
    const { container } = render(
      <StackedAreaChartCard
        title="Card title"
        content={{
          xLabel: 'xlabel prop',
          yLabel: 'y label prop',
          xProperty: 'date',
          yProperty: 'value',
          xThresholds: [
            {
              value: 80000,
              label: 'Threshold',
            },
          ],
        }}
        values={mockValues}
        size="MEDIUM"
        breakpoint="md"
        isExpanded={false}
        locale="en"
        availableActions={{ expand: true }}
        onCardAction={() => {}}
      />
    );
    expect(container.querySelectorAll('#mock-stacked-area-chart')).toHaveLength(1);
  });
  it('render custom color', () => {
    const { container } = render(
      <StackedAreaChartCard
        title="Card title"
        content={{
          xLabel: 'xlabel prop',
          yLabel: 'y label prop',
          xProperty: 'date',
          yProperty: 'value',
          color: {
            pairing: {
              option: 3,
            },
          },
        }}
        values={mockValues}
        size="MEDIUM"
        breakpoint="md"
        isExpanded={false}
        locale="en"
        availableActions={{ expand: true }}
        onCardAction={() => {}}
      />
    );
    expect(container.querySelectorAll('#mock-stacked-area-chart')).toHaveLength(1);
  });
  it('render legend position', () => {
    const { container } = render(
      <StackedAreaChartCard
        title="Card title"
        content={{
          xLabel: 'xlabel prop',
          yLabel: 'y label prop',
          xProperty: 'date',
          yProperty: 'value',
          legendPosition: 'top',
        }}
        values={mockValues}
        size="MEDIUM"
        breakpoint="md"
        isExpanded={false}
        locale="en"
        availableActions={{ expand: true }}
        onCardAction={() => {}}
      />
    );
    expect(container.querySelectorAll('#mock-stacked-area-chart')).toHaveLength(1);
  });
  it('render curve', () => {
    const { container } = render(
      <StackedAreaChartCard
        title="Card title"
        content={{
          xLabel: 'xlabel prop',
          yLabel: 'y label prop',
          xProperty: 'date',
          yProperty: 'value',
          curve: 'curveNatural',
        }}
        values={mockValues}
        size="MEDIUM"
        breakpoint="md"
        isExpanded={false}
        locale="en"
        availableActions={{ expand: true }}
        onCardAction={() => {}}
      />
    );
    expect(container.querySelectorAll('#mock-stacked-area-chart')).toHaveLength(1);
  });
  it('render footer content', () => {
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
        footerContent={() => <div>Occured on ... </div>}
        onCardAction={() => {}}
      />
    );
    expect(container.querySelectorAll('.iot--card--footer--wrapper')).toHaveLength(1);
  });
  it('not render footer content when expanded', () => {
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
        isExpanded
        locale="en"
        availableActions={{ expand: true }}
        footerContent={() => <div>Occured on ... </div>}
        onCardAction={() => {}}
      />
    );
    expect(container.querySelectorAll('.iot--card--footer--wrapper')).toHaveLength(0);
  });
});
