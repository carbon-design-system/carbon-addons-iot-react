import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { CARD_SIZES } from '../../constants/LayoutConstants';

import ComboChartCard from './ComboChartCard';

jest.unmock('@carbon/charts-react');

describe('ComboChartCard', () => {
  it('Renders card', () => {
    const title = 'ComboChartCard Test';

    render(
      <ComboChartCard
        id="combo-chart-1"
        size={CARD_SIZES.MEDIUMWIDE}
        title={title}
        content={{
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
        }}
      />
    );

    expect(screen.queryByText(title)).toBeDefined();
  });
});
