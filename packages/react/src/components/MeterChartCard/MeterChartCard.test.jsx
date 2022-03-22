import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';

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
  it('show correctly card title + chart total and unit', () => {
    render(<MeterChartCard {...meterChartCardProps} testId="meterchart-card" />);
    expect(
      screen.getByText(
        `${meterChartCardProps.content.meterTotal} ${meterChartCardProps.content.meterUnit} total`
      )
    ).toBeTruthy();
    expect(screen.getByText(`450 AppPoints used (550 AppPoints available)`)).toBeTruthy();
    expect(screen.getByText(meterChartCardProps.title)).toBeTruthy();
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
  it('colors - pairing option', () => {
    const { container } = render(
      <MeterChartCard
        {...meterChartCardProps}
        content={{
          ...meterChartCardProps.content,
          color: {
            pairing: {
              option: 2,
            },
          },
        }}
      />
    );
    expect(container.querySelectorAll('.fill-4-2-1')).toBeTruthy();
  });
  it('render legend props', () => {
    const { container } = render(
      <MeterChartCard
        {...meterChartCardProps}
        content={{
          ...meterChartCardProps.content,
          legendPosition: 'top',
          truncation: {
            type: 'end_line',
            threshold: 20,
            numCharacter: 20,
          },
        }}
      />
    );
    expect(container.querySelectorAll('.bx--chart-holder')).toHaveLength(1);
  });
  it('render footer content', () => {
    const { container } = render(
      <MeterChartCard {...meterChartCardProps} footerContent={() => <div>Occured on ... </div>} />
    );
    expect(container.querySelectorAll('.iot--card--footer--wrapper')).toHaveLength(1);
  });
  it('not render footer content when expanded', () => {
    const { container } = render(
      <MeterChartCard
        {...meterChartCardProps}
        footerContent={() => <div>Occured on ... </div>}
        isExpanded
      />
    );
    expect(container.querySelectorAll('.iot--card--footer--wrapper')).toHaveLength(0);
  });
  it('click on expand expanded', () => {
    const mockOnClickAction = jest.fn();
    render(
      <MeterChartCard
        {...meterChartCardProps}
        footerContent={() => <div>Occured on ... </div>}
        onCardAction={mockOnClickAction}
        availableActions={{ expand: true }}
      />
    );
    const expandButton = screen.getByTestId('Card-toolbar-expand-button');
    fireEvent.click(expandButton);
    expect(mockOnClickAction).toHaveBeenCalled();
  });
  it('empty status', () => {
    const mockOnClickAction = jest.fn();
    const { container } = render(
      <MeterChartCard
        {...meterChartCardProps}
        content={{ ...meterChartCardProps, status: null }}
        footerContent={() => <div>Occured on ... </div>}
        onCardAction={mockOnClickAction}
        availableActions={{ expand: true }}
      />
    );
    expect(container.querySelectorAll('.bx--chart-holder')).toHaveLength(1);
  });
});
