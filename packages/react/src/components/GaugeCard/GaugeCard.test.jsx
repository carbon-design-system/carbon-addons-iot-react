import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { settings } from '../../constants/Settings';

import GaugeCard, { getColor } from './GaugeCard';

const { iotPrefix } = settings;

const content = {
  gauges: [
    {
      dataSourceId: 'usage',
      units: '%',
      minimumValue: 0,
      maximumValue: 100,
      color: 'orange',
      backgroundColor: '#e0e',
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
          color: 'red', // red
          label: 'Poor',
        },
        {
          comparison: '>',
          value: 60,
          color: 'yellow', // yellow
          label: 'Fair',
        },
        {
          comparison: '>',
          value: 80,
          color: 'green', // green
          label: 'Good',
        },
      ],
    },
    {
      dataSourceId: 'usage',
      units: '%',
      minimumValue: 0,
      color: 'orange',
      backgroundColor: '#e0e',
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
      backgroundColor: '#e0e',
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
          color: 'green', // red
          label: 'Poor',
        },
        {
          comparison: '<',
          value: 3,
          color: 'yellow', // yellow
          label: 'Fair',
        },
        {
          comparison: '<=',
          value: 4,
          color: 'red', // green
          label: 'Good',
        },
        {
          comparison: '>=',
          value: 101,
          color: '#42be65', // green
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
    await waitFor(() => container.querySelector(`.${iotPrefix}--gauge-trend`));
    expect(container.querySelector(`.${iotPrefix}--gauge-trend`)).toEqual(null);
  });
});
