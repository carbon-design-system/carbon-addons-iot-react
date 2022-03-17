import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

import SparklineChartCard from './SparklineChartCard';

jest.unmock('@carbon/charts-react');

const mockValues = [
  {
    group: 'Dataset 1',
    date: 1558453860000,
    value: 5,
  },
  {
    group: 'Dataset 1',
    date: 1558453920000,
    value: 5,
  },
  {
    group: 'Dataset 1',
    date: 1558453980000,
    value: 6,
  },
  {
    group: 'Dataset 1',
    date: 1558454040000,
    value: 2,
  },
  {
    group: 'Dataset 1',
    date: 1558454100000,
    value: 3,
  },
  {
    group: 'Dataset 1',
    date: 1558454160000,
    value: 6,
  },
  {
    group: 'Dataset 1',
    date: 1558454280000,
    value: 2,
  },
  {
    group: 'Dataset 1',
    date: 1558454340000,
    value: 6,
  },
  {
    group: 'Dataset 1',
    date: 1558454460000,
    value: 3,
  },
  {
    group: 'Dataset 1',
    date: 1558454520000,
    value: 2,
  },
  {
    group: 'Dataset 1',
    date: 1558454580000,
    value: 4,
  },
  {
    group: 'Dataset 1',
    date: 1558454640000,
    value: 3,
  },
  {
    group: 'Dataset 1',
    date: 1558454700000,
    value: 4,
  },
  {
    group: 'Dataset 1',
    date: 1558454760000,
    value: 2,
  },
  {
    group: 'Dataset 1',
    date: 1558454820000,
    value: 4,
  },
  {
    group: 'Dataset 1',
    date: 1558454880000,
    value: 1,
  },
  {
    group: 'Dataset 1',
    date: 1558454940000,
    value: 1,
  },
  {
    group: 'Dataset 1',
    date: 1558455000000,
    value: 3,
  },
  {
    group: 'Dataset 1',
    date: 1558455060000,
    value: 2,
  },
];
describe('SparklineChartCard', () => {
  it('should be selectable with testId', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(
      <SparklineChartCard
        title="Manage"
        content={{
          xLabel: 'xlabel prop',
          yLabel: 'y label prop',
          xProperty: 'date',
          yProperty: 'value',
          color: {
            pairing: {
              option: 4,
            },
            gradient: {
              enabled: true,
            },
          },
          listContent: [
            { label: 'Target', value: 1000 },
            { label: 'Mean', value: 756 },
            { label: 'Peak', value: 1045 },
          ],
        }}
        values={mockValues}
        size="MEDIUM"
        breakpoint="md"
        footerContent={() => <div>Occured on ... </div>}
        isExpanded={false}
        locale="en"
        availableActions={{ expand: true }}
        onCardAction={() => {}}
        testId="SPARKLINE_CHART_CARD_TEST"
      />
    );

    expect(screen.getByTestId('SPARKLINE_CHART_CARD_TEST')).toBeDefined();
    expect(container.querySelectorAll('.bx--chart-holder')).toHaveLength(1);
  });
  it('should be render list content', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <SparklineChartCard
        title="Manage"
        content={{
          xLabel: 'xlabel prop',
          yLabel: 'y label prop',
          xProperty: 'date',
          yProperty: 'value',
          color: {
            pairing: {
              option: 4,
            },
            gradient: {
              enabled: true,
            },
          },
          listContent: [
            { label: 'Target', value: 1000 },
            { label: 'Mean', value: 756 },
            { label: 'Peak', value: 1045 },
          ],
        }}
        values={mockValues}
        size="MEDIUM"
        breakpoint="md"
        footerContent={() => <div>Occured on ... </div>}
        isExpanded={false}
        locale="en"
        availableActions={{ expand: true }}
        onCardAction={() => {}}
        testId="SPARKLINE_CHART_CARD_TEST"
      />
    );

    expect(screen.getByTestId('SPARKLINE_CHART_CARD_TEST-list')).toBeDefined();
    expect(screen.getByText('Target')).toBeDefined();
    expect(screen.getByText('Mean')).toBeDefined();
    expect(screen.getByText('Peak')).toBeDefined();
  });
  it('does not show bar chart when loading', () => {
    const { container } = render(
      <SparklineChartCard
        title="Manage"
        content={{
          xLabel: 'xlabel prop',
          yLabel: 'y label prop',
          xProperty: 'date',
          yProperty: 'value',
          color: {
            pairing: {
              option: 4,
            },
            gradient: {
              enabled: true,
            },
          },
          listContent: [
            { label: 'Target', value: 1000 },
            { label: 'Mean', value: 756 },
            { label: 'Peak', value: 1045 },
          ],
        }}
        values={mockValues}
        size="MEDIUM"
        breakpoint="md"
        footerContent={() => <div>Occured on ... </div>}
        isExpanded={false}
        locale="en"
        availableActions={{ expand: true }}
        onCardAction={() => {}}
        testId="SPARKLINE_CHART_CARD_TEST"
        isLoading
      />
    );
    expect(container.querySelectorAll('.bx--chart-holder')).toHaveLength(0);
  });

  it('does not show bar chart when empty data', () => {
    const { container } = render(
      <SparklineChartCard
        title="Manage"
        content={{
          xLabel: 'xlabel prop',
          yLabel: 'y label prop',
          xProperty: 'date',
          yProperty: 'value',
          color: {
            pairing: {
              option: 4,
            },
            gradient: {
              enabled: true,
            },
          },
          listContent: [
            { label: 'Target', value: 1000 },
            { label: 'Mean', value: 756 },
            { label: 'Peak', value: 1045 },
          ],
        }}
        values={[]}
        size="MEDIUM"
        breakpoint="md"
        footerContent={() => <div>Occured on ... </div>}
        isExpanded={false}
        locale="en"
        availableActions={{ expand: true }}
        onCardAction={() => {}}
        testId="SPARKLINE_CHART_CARD_TEST"
        isLoading
      />
    );
    expect(container.querySelectorAll('.bx--chart-holder')).toHaveLength(0);
  });
  it('i18n string test', () => {
    const i18nTest = {
      noDataLabel: 'no-data-label',
    };

    const i18nDefault = SparklineChartCard.defaultProps.i18n;

    render(
      <SparklineChartCard
        title="Manage"
        content={{
          xLabel: 'xlabel prop',
          yLabel: 'y label prop',
          xProperty: 'date',
          yProperty: 'value',
          color: {
            pairing: {
              option: 4,
            },
            gradient: {
              enabled: true,
            },
          },
          listContent: [
            { label: 'Target', value: 1000 },
            { label: 'Mean', value: 756 },
            { label: 'Peak', value: 1045 },
          ],
        }}
        values={[]}
        size="MEDIUM"
        breakpoint="md"
        footerContent={() => <div>Occured on ... </div>}
        isExpanded={false}
        locale="en"
        availableActions={{ expand: true }}
        onCardAction={() => {}}
        testId="SPARKLINE_CHART_CARD_TEST"
        i18n={i18nTest}
      />
    );
    expect(screen.getByText(i18nTest.noDataLabel)).toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.noDataLabel)).not.toBeInTheDocument();
  });
});
