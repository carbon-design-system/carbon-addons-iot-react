import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { comboHealthData } from '../../utils/comboChartDataSample';

import ComboChartCard from './ComboChartCard';

const commonContent = {
  xLabel: 'Date',
  yLabel: 'Score',
  series: [
    {
      dataSourceId: 'health',
      label: 'Health',
    },
    {
      dataSourceId: 'age',
      label: 'Age',
    },
    {
      dataSourceId: 'condition',
      label: 'Condition',
    },
    {
      dataSourceId: 'rul',
      label: 'RUL',
    },
  ],
  comboChartTypes: [
    {
      type: 'area',
      correspondingDatasets: ['Health'],
    },
    {
      type: 'line',
      correspondingDatasets: ['Age', 'Condition', 'RUL'],
    },
  ],
  includeZeroOnXaxis: true,
  includeZeroOnYaxis: true,
  addSpaceOnEdges: 0,
  timeDataSourceId: 'date',
};

const commonOptions = {
  id: 'combo-chart',
  size: CARD_SIZES.MEDIUMWIDE,
  title: 'ComboChartCard Test',
  content: commonContent,
  values: comboHealthData,
};

jest.mock('@carbon/charts-react/combo-chart', () => () => (
  <div id="mock-combo-chart">mock combo chart</div>
));

describe('ComboChartCard', () => {
  it('Renders basic card ', () => {
    render(<ComboChartCard {...commonOptions} />);
    expect(screen.queryByText(commonOptions.title)).toBeDefined();
    expect(screen.queryAllByText('data table toolbar')).toHaveLength(0);
  });

  it('Renders table when expanded', () => {
    render(<ComboChartCard {...commonOptions} isExpanded />);
    expect(screen.getByLabelText('data table toolbar')).toBeDefined();
  });

  it('When expanded and loading it does not show the table', () => {
    render(<ComboChartCard {...commonOptions} isExpanded isLoading />);
    expect(screen.queryAllByText('data table toolbar')).toHaveLength(0);
  });
});
