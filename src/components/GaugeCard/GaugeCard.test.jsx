import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ui03, support01, support02, support03 } from '@carbon/colors';

import GaugeCard, { getColor } from './GaugeCard';

const content = {
  gauges: [
    {
      dataSourceId: 'usage',
      units: '%',
      minimumValue: 0,
      maximumValue: 100,
      color: 'orange',
      backgroundColor: ui03,
      shape: 'circle',
      trend: {
        /** the key to load the trend value from the values object. */
        dataSourceId: 'usageTrend',
        color: '',
        trend: 'up',
      },
      thresholds: [
        {
          comparison: '>',
          value: 0,
          color: support01, // red
          label: 'Poor',
        },
        {
          comparison: '>',
          value: 60,
          color: support03, // yellow
          label: 'Fair',
        },
        {
          comparison: '>',
          value: 80,
          color: support02, // green
          label: 'Good',
        },
      ],
    },
    {
      dataSourceId: 'usage',
      units: '%',
      minimumValue: 0,
      color: 'orange',
      backgroundColor: ui03,
      shape: 'circle',
      trend: {
        /** the key to load the trend value from the values object. */
        dataSourceId: 'usageTrend',
        color: '',
        trend: 'up',
      },
    },
    {
      dataSourceId: 'usage',
      units: '%',
      minimumValue: 0,
      maximumValue: 100,
      color: 'orange',
      backgroundColor: ui03,
      shape: 'circle',
      trend: {
        /** the key to load the trend value from the values object. */
        dataSourceId: 'usageTrend',
        color: '',
        trend: 'up',
      },
      thresholds: [
        {
          comparison: '=',
          value: 90,
          color: support01, // red
          label: 'Poor',
        },
        {
          comparison: '<',
          value: 3,
          color: support03, // yellow
          label: 'Fair',
        },
        {
          comparison: '<=',
          value: 4,
          color: support02, // green
          label: 'Good',
        },
        {
          comparison: '>=',
          value: 101,
          color: support02, // green
          label: 'Good',
        },
      ],
    },
  ],
};

describe('GaugeCard', () => {
  it('Threshold color should be green', () => {
    expect(getColor(content.gauges[2], 90).color).toEqual('green');
  });

  it('Threshold color should be red', () => {
    expect(getColor(content.gauges[2], 4).color).toEqual('red');
  });

  it('value should be zero', async () => {
    jest.useFakeTimers();
    const { container } = render(<GaugeCard content={content} />);
    await waitFor(() => container.querySelector('.iot--gauge-trend'));
    expect(container.querySelector('.iot--gauge-trend')).toEqual(null);
  });
});
