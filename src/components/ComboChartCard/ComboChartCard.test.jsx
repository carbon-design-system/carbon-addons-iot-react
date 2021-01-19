import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { comboData, comboDataOptions } from '../../utils/comboChartDataSample';

import ComboChartCard from './ComboChartCard';

jest.unmock('@carbon/charts-react');

describe('ComboChartCard', () => {
  it('Renders card title', () => {
    const title = 'ComboChartCard Test';

    const { rerender } = render(
      <ComboChartCard
        id="combo-chart-1"
        values={comboData}
        options={comboDataOptions}
        size={CARD_SIZES.MEDIUMWIDE}
      />
    );

    expect(screen.queryByText(title)).toBeNull();
    expect(screen.queryByText(comboDataOptions.title)).toBeDefined();

    rerender(
      <ComboChartCard
        id="combo-chart-1"
        values={comboData}
        options={comboDataOptions}
        size={CARD_SIZES.MEDIUMWIDE}
        title={title}
      />
    );

    expect(screen.queryByText(title)).toBeDefined();
    expect(screen.queryByText(comboDataOptions.title)).toBeNull();
  });
});
