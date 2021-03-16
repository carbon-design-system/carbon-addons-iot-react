import React from 'react';
import { mount } from 'enzyme';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { comboHealthData } from '../../utils/comboChartDataSample';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

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
  addSpaceOnEdges: false,
  timeDataSourceId: 'date',
};

const commonOptions = {
  id: 'combo-chart',
  size: CARD_SIZES.MEDIUMWIDE,
  title: 'ComboChartCard Test',
  content: commonContent,
  values: comboHealthData,
};
// jest.unmock('@carbon/charts-react');

describe('ComboChartCard', () => {
  const originalCreateObjectURL = global.URL.createObjectURL;
  const originalRevokeObjectURL = global.URL.revokeObjectURL;

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
  });

  afterAll(() => {
    global.URL.createObjectURL = originalCreateObjectURL;
    global.URL.revokeObjectURL = originalRevokeObjectURL;
  });

  it('Renders another card ', () => {
    render(<ComboChartCard {...commonOptions} isExpanded />);
    expect(screen.queryByText(commonOptions.title)).toBeDefined();
  });

  it('Renders card ', () => {
    render(<ComboChartCard {...commonOptions} />);
    expect(screen.queryByText(commonOptions.title)).toBeDefined();
  });
});
