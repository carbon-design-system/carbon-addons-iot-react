import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, object, boolean } from '@storybook/addon-knobs';

import { COLORS, CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import { chartData } from '../../utils/sample';

import BarChartCard from './BarChartCard';

storiesOf('BarChartCard (Experimental)', module).add('basic', () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.LARGE);
  const field = 'temperature';
  const timeOffset = new Date().getTime() - chartData.dataItemToMostRecentTimestamp[field];
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <BarChartCard
        title={text('title', 'Temperature')}
        id="facility-temperature"
        isLoading={boolean('isLoading', false)}
        content={object('content', {
          data: [
            {
              label: 'Temperature',
              values: chartData.events
                .filter((i, idx) => idx < 10)
                .map(i => ({
                  x: new Date(i.timestamp + timeOffset).toISOString(),
                  y: i[field],
                })),
              color: COLORS.RED,
            },
            {
              label: 'Pressure',
              values: chartData.events
                .filter((i, idx) => idx < 10)
                .map(i => ({
                  x: new Date(i.timestamp + timeOffset).toISOString(),
                  y: i[field],
                })),
              color: COLORS.BLUE,
            },
          ],
        })}
        breakpoint="lg"
        size={size}
      />
    </div>
  );
});
