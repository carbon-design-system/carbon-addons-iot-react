import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fileDownload from 'js-file-download';

import { settings } from '../../constants/Settings';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import Table from '../Table/Table';

import PieChartCard, { formatColors } from './PieChartCard';

const { iotPrefix } = settings;

jest.unmock('@carbon/charts-react');
jest.mock('js-file-download');
const chartDataExample = [
  {
    group: '2V2N 9KYPM',
    category: 'cat A',
    value: 1,
  },
  {
    group: 'L22I P66EP L22I P66EP',
    category: 'cat B',
    value: 10,
  },
  {
    group: 'JQAI 2M4L1',
    category: 'cat C',
    value: 20,
  },
  {
    group: 'J9DZ F37AP',
    category: 'cat D',
    value: 50,
  },
  {
    group: 'YEL48 Q6XK YEL48',
    category: 'cat E',
    value: 15,
  },
  {
    group: 'Misc',
    category: 'cat F',
    value: 40,
  },
];

const pieChartCardProps = {
  availableActions: { expand: true },
  content: {
    groupDataSourceId: 'group',
    legendPosition: 'bottom',
  },
  id: 'pie-chart-card',
  isLoading: false,
  isExpanded: false,
  onCardAction: jest.fn(),
  size: CARD_SIZES.LARGE,
  title: 'Schools',
  testID: 'test-pie-chart-card',
  values: chartDataExample,
};

describe('utility functions', () => {
  it('formatColors with array', () => {
    const mockColors = {
      'cat A': 'purple',
    };
    const formattedColors = formatColors(chartDataExample, 'category', mockColors);
    expect(formattedColors.scale['cat A']).toEqual('purple');
    expect(formattedColors.scale['cat B']).toEqual('#1192e8');
  });
  it('formatColors with object', () => {
    const mockColors = {
      'cat A': 'purple',
    };
    const formattedColors = formatColors({ 'cat A': 124, 'cat B': 125 }, undefined, mockColors);
    expect(formattedColors.scale['cat A']).toEqual('purple');
    expect(formattedColors.scale['cat B']).toEqual('#1192e8');
  });
});

/*
  FYI: the underlying Carbon Charts controls have been mocked.
  Check __mocks__/@carbon/charts-react/ for details
*/

describe('PieChartCard', () => {
  const originalDev = global.__DEV__;
  const originalError = console.error;
  const error = jest.fn();
  beforeEach(() => {
    console.error = error;
    global.__DEV__ = true;
  });
  afterEach(() => {
    error.mockReset();
    console.error = originalError;
    global.__DEV__ = originalDev;
  });

  it('should be selectable by testId or testID', async () => {
    const { testID, ...props } = pieChartCardProps;
    const { rerender } = render(<PieChartCard {...props} isExpanded testId="pie_chart_card" />);
    expect(screen.getByTestId('pie_chart_card')).toBeDefined();
    expect(screen.getByTestId('pie_chart_card-table')).toBeDefined();

    rerender(<PieChartCard {...props} isExpanded testID="PIE_CHART_CARD" />);
    expect(screen.getByTestId('PIE_CHART_CARD')).toBeDefined();
    expect(screen.getByTestId('PIE_CHART_CARD-table')).toBeDefined();
  });

  it('shows loading skeleton for isLoading even for empty data  ', async () => {
    const loadingSkeletonQuery = `.${iotPrefix}--pie-chart-container svg.chart-skeleton`;
    const { container, rerender } = render(<PieChartCard {...pieChartCardProps} />);
    let svgLoadingIcon = container.querySelector(loadingSkeletonQuery);
    expect(svgLoadingIcon).toBeFalsy();

    rerender(<PieChartCard {...pieChartCardProps} isLoading />);
    svgLoadingIcon = container.querySelector(loadingSkeletonQuery);
    expect(svgLoadingIcon).toBeVisible();

    rerender(<PieChartCard {...pieChartCardProps} isLoading={false} />);
    svgLoadingIcon = container.querySelector(loadingSkeletonQuery);
    expect(svgLoadingIcon).toBeFalsy();

    rerender(<PieChartCard {...pieChartCardProps} values={[]} isLoading />);
    svgLoadingIcon = container.querySelector(loadingSkeletonQuery);
    expect(svgLoadingIcon).toBeVisible();

    await waitFor(() => {
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining('Missing CSS styles for Carbon Charts')
      );
    });
  });

  it('shows empty data message when there are no values', () => {
    const noDataMsg = 'No data for this card';
    render(<PieChartCard {...pieChartCardProps} i18n={{ noDataLabel: noDataMsg }} values={[]} />);
    expect(screen.queryByText(noDataMsg)).toBeVisible();
  });

  it('shows table when the card is expanded', async () => {
    render(<PieChartCard {...pieChartCardProps} isExpanded />);
    expect(screen.getByTestId('test-pie-chart-card-table')).toBeVisible();
    await waitFor(() => {
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining('Missing CSS styles for Carbon Charts')
      );
    });
  });

  it('shows uses labels based on groupDataSourceId', async () => {
    const groupBasedLabelExample = 'Misc';
    const categoryBasedLabelExample = 'cat A';
    const { rerender } = render(<PieChartCard {...pieChartCardProps} groupDataSourceId="group" />);
    expect(screen.getByText(groupBasedLabelExample)).toBeVisible();
    expect(screen.queryByText(categoryBasedLabelExample)).not.toBeInTheDocument();

    rerender(<PieChartCard {...pieChartCardProps} content={{ groupDataSourceId: 'category' }} />);
    expect(screen.getByText(categoryBasedLabelExample)).toBeVisible();
    expect(screen.queryByText(groupBasedLabelExample)).toBeFalsy();
    await waitFor(() => {
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining('Missing CSS styles for Carbon Charts')
      );
    });
  });

  it('supports card variables', async () => {
    const chartDataExampleWithVariable = [
      { ...chartDataExample[0], group: `{var1}` },
      ...chartDataExample.slice(1),
    ];
    const variableValue = 'Inserted Var';
    render(
      <PieChartCard
        {...pieChartCardProps}
        values={chartDataExampleWithVariable}
        cardVariables={{ var1: variableValue }}
      />
    );
    expect(screen.getByText(variableValue)).toBeInTheDocument();
    await waitFor(() => {
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining('Missing CSS styles for Carbon Charts')
      );
    });
  });

  it('supports custom colors', async () => {
    const colorsMap = {
      'cat A': 'red',
      'cat B': 'green',
      'cat C': 'blue',
      'cat D': 'yellow',
      'cat E': 'purple',
      'cat F': 'orange',
    };

    const { container } = render(
      <PieChartCard
        {...pieChartCardProps}
        content={{ colors: colorsMap, groupDataSourceId: 'category' }}
      />
    );

    const slices = container.querySelectorAll('.slice');
    const orderedColors = chartDataExample
      .sort((a, b) => b.value - a.value)
      .map((data) => colorsMap[data.category]);

    for (let index = 0; index < orderedColors.length; index += 1) {
      expect(slices.item(index)).toHaveStyle(`fill:${orderedColors[index]}`);
    }
    await waitFor(() => {
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining('Missing CSS styles for Carbon Charts')
      );
    });
  });

  it('supports custom labels', async () => {
    render(
      <PieChartCard
        {...pieChartCardProps}
        content={{
          labelsFormatter: (wrapper) => {
            return `test-label-${wrapper.value}`;
          },
        }}
      />
    );

    chartDataExample.forEach((sliceData) => {
      expect(screen.getByText(`test-label-${sliceData.value}`)).toBeVisible();
    });

    await waitFor(() => {
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining('Missing CSS styles for Carbon Charts')
      );
    });
  });

  it('shows sample data for isEditable', async () => {
    render(<PieChartCard {...pieChartCardProps} isEditable />);
    expect(screen.getByText('Sample 0')).toBeVisible();
    expect(screen.getByText('Sample 1')).toBeVisible();
    expect(screen.getByText('Sample 2')).toBeVisible();
    expect(screen.getByText('Sample 3')).toBeVisible();

    await waitFor(() => {
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining('Missing CSS styles for Carbon Charts')
      );
    });
  });

  it('uses custom colors for sample data slices', async () => {
    const colorsMap = {
      'cat A': 'red',
      'cat B': 'green',
    };
    const { container } = render(
      <PieChartCard
        {...pieChartCardProps}
        isEditable
        content={{ colors: colorsMap, groupDataSourceId: 'category' }}
      />
    );
    expect(screen.getByText('Sample 0')).toBeVisible();
    expect(screen.getByText('Sample 1')).toBeVisible();

    const slices = container.querySelectorAll('.slice');
    const firstSliceColor = slices.item(0).getAttribute('style');
    const secondSliceColor = slices.item(1).getAttribute('style');

    // The sample values are random and the pie chart orders the slices after
    // the value so we don't know the order of the colors in this test.
    expect([firstSliceColor, secondSliceColor]).toContain('fill: red;');
    expect([firstSliceColor, secondSliceColor]).toContain('fill: green;');

    await waitFor(() => {
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining('Missing CSS styles for Carbon Charts')
      );
    });
  });

  it('can be customised with component overrides', () => {
    const TestCard = (props) => {
      return <Card {...props} data-testid="custom-test-card" />;
    };
    const TestPieChart = () => {
      return <div>I am not a pie chart</div>;
    };
    const TestTable = (props) => {
      return <Table {...props} data-testid="custom-test-table" />;
    };

    render(
      <PieChartCard
        {...pieChartCardProps}
        isExpanded
        overrides={{
          card: { component: TestCard },
          pieChart: { component: TestPieChart },
          table: { component: TestTable },
        }}
      />
    );

    expect(screen.getByTestId('custom-test-card')).toBeInTheDocument();
    expect(screen.getByText('I am not a pie chart')).toBeInTheDocument();
    expect(screen.getByTestId('custom-test-table')).toBeInTheDocument();
  });

  it('can be customised with props overrides', async () => {
    render(
      <PieChartCard
        {...pieChartCardProps}
        isExpanded
        overrides={{
          card: { props: { 'data-testid': 'custom-test-card' } },
          pieChart: {
            props: (origProps) => {
              const propCopy = { ...origProps };
              propCopy.options.data.groupMapsTo = 'category';
              return propCopy;
            },
          },
          table: { props: { 'data-testid': 'custom-test-table' } },
        }}
      />
    );

    expect(screen.getByTestId('custom-test-card')).toBeInTheDocument();
    expect(screen.getByText('cat A')).toBeInTheDocument();
    expect(screen.getByTestId('custom-test-table')).toBeInTheDocument();

    await waitFor(() => {
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining('Missing CSS styles for Carbon Charts')
      );
    });
  });

  it('onCsvDownload should fire when download button is clicked', async () => {
    render(<PieChartCard {...pieChartCardProps} isExpanded />);
    // First check that the button appeared
    const downloadBtn = screen.getByTestId('download-button');
    expect(downloadBtn).toBeTruthy();
    // click the button
    userEvent.click(downloadBtn);
    // This means the csvDownloadHandler is firing
    expect(fileDownload).toHaveBeenCalledWith(
      `J9DZ F37AP,Misc,JQAI 2M4L1,YEL48 Q6XK YEL48,L22I P66EP L22I P66EP,2V2N 9KYPM\n50,40,20,15,10,1,\n`,
      'Schools.csv'
    );
  });

  it('should show custom tooltip even when editable', () => {
    const customTooltip = jest.fn().mockImplementation(() => 'custom-tooltip-test');
    const { container } = render(
      <PieChartCard
        {...pieChartCardProps}
        content={{
          ...pieChartCardProps.content,
          customTooltip,
        }}
        isExpanded
        isEditable
      />
    );
    const firstSlice = container.querySelectorAll('.slice')[0];
    userEvent.hover(firstSlice);
    expect(firstSlice).toHaveClass('hovered');
    expect(screen.getByText('custom-tooltip-test')).toBeVisible();
  });

  it('should throw a prop warnings with an unsupported size', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const { testID, ...props } = pieChartCardProps;
    const { rerender } = render(<PieChartCard {...props} size={CARD_SIZES.SMALL} />);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(`PieChartCard does not support card size ${CARD_SIZES.SMALL}`)
    );
    rerender(<PieChartCard {...props} size={CARD_SIZES.SMALLWIDE} />);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(`PieChartCard does not support card size ${CARD_SIZES.SMALLWIDE}`)
    );
    rerender(<PieChartCard {...props} size={CARD_SIZES.SMALLFULL} />);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(`PieChartCard does not support card size ${CARD_SIZES.SMALLFULL}`)
    );
    jest.resetAllMocks();
  });
});
