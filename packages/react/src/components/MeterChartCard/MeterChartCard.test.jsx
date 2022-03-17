import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

import MeterChartCard from './MeterChartCard';

jest.unmock('@carbon/charts-react');

const meterChartCardProps = {
  title: 'Sample',
  id: 'sample-bar-chart',
  isLoading: false,
  content: {
    peak: 2000,
    meterTotal: 1000,
    meterUnit: 'AppPoints',
    color: {
      pairing: {
        option: 5,
      },
    },
    status: {
      success: [0, 300],
      warning: [300, 900],
      danger: [900, 2000],
    },
  },
  values: [
    {
      group: 'Install',
      value: 100,
    },
    {
      group: 'Limited users',
      value: 200,
    },
    {
      group: 'Reports',
      value: 150,
    },
  ],
  breakpoint: 'md',
  size: 'MEDIUM',
  onCardAction: () => {},
};

describe('MeterChartCard', () => {
  it('is selectable with testId', () => {
    render(<MeterChartCard {...meterChartCardProps} testId="meterchart-card" />);
    expect(screen.getByTestId('meterchart-card')).toBeTruthy();
  });

  it('does not show bar chart when loading', () => {
    const { container } = render(<MeterChartCard {...meterChartCardProps} isLoading />);
    expect(container.querySelectorAll('.bx--chart-holder')).toHaveLength(0);
  });

  it('does not show bar chart when empty data', () => {
    const { container } = render(<MeterChartCard {...meterChartCardProps} values={[]} />);
    expect(container.querySelectorAll('.bx--chart-holder')).toHaveLength(0);
  });

  it('i18n string test', () => {
    const i18nTest = {
      noDataLabel: 'no-data-label',
    };

    const i18nDefault = MeterChartCard.defaultProps.i18n;

    render(<MeterChartCard {...meterChartCardProps} values={[]} i18n={i18nTest} />);
    expect(screen.getByText(i18nTest.noDataLabel)).toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.noDataLabel)).not.toBeInTheDocument();
  });
  it('show correctly total and unit ', () => {
    render(<MeterChartCard {...meterChartCardProps} testId="meterchart-card" />);
    expect(
      screen.getByText(
        `${meterChartCardProps.content.meterTotal} ${meterChartCardProps.content.meterUnit} total`
      )
    ).toBeTruthy();
  });
  it('show warning status', () => {
    const { container } = render(
      <MeterChartCard
        {...meterChartCardProps}
        content={{
          ...meterChartCardProps.content,
          status: {
            success: [0, 300],
            warning: [300, 2000],
          },
        }}
      />
    );

    expect(container.querySelectorAll('.status--warning')).toBeTruthy();
  });
  it('show danger status', () => {
    const { container } = render(
      <MeterChartCard {...meterChartCardProps} testId="meterchart-card" />
    );
    expect(container.querySelectorAll('.status--danger')).toBeTruthy();
  });
});
