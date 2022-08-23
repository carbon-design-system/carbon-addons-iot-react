import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CardEditFormContent, { handleTranslationCallback } from './CardEditFormContent';

const cardConfig = {
  id: 'Timeseries',
  title: 'Untitled',
  size: 'MEDIUMWIDE',
  type: 'TIMESERIES',
  content: {
    series: [
      {
        label: 'Temperature',
        dataSourceId: 'temperature',
        color: 'red',
      },
      {
        label: 'Pressure',
        dataSourceId: 'pressure',
        color: 'blue',
      },
    ],
    xLabel: 'Time',
    yLabel: 'Temperature (˚F)',
    includeZeroOnXaxis: true,
    includeZeroOnYaxis: true,
    timeDataSourceId: 'timestamp',
    addSpaceOnEdges: 1,
  },
  interval: 'day',
};

const mockOnChange = jest.fn();
const mockGetValidTimeRanges = jest.fn(() => ['last2Hours']);
const mockGetValidTimeRangesWithEmptyArray = jest.fn(() => []);

afterEach(() => {
  jest.clearAllMocks();
});
describe('CardEditFormContent', () => {
  describe('Form fields', () => {
    it('should update JSON for the x axis label', () => {
      render(
        <CardEditFormContent
          cardConfig={cardConfig}
          onChange={mockOnChange}
          getValidTimeRanges={mockGetValidTimeRanges}
        />
      );
      userEvent.type(screen.getByRole('textbox', { name: 'Card title' }), 'changed title');
      expect(mockOnChange).toHaveBeenCalled();
      expect(mockGetValidTimeRanges).toHaveBeenCalled();
      // Time range selector should start unselected
      const timeRangeSelector = screen.getAllByLabelText('Time range');
      expect(timeRangeSelector[0].innerHTML).not.toEqual(expect.stringContaining('last2Hours'));
    });
    it('Should select timeRange if passed', () => {
      render(
        <CardEditFormContent
          cardConfig={{ ...cardConfig, timeRange: 'last2Hours' }}
          onChange={mockOnChange}
          getValidTimeRanges={mockGetValidTimeRanges}
        />
      );
      const timeRangeSelector = screen.getAllByLabelText('Time range');
      expect(timeRangeSelector[0].innerHTML).toEqual(expect.stringContaining('last2Hours'));
    });
    it('Should hide the timerange selector', () => {
      render(
        <CardEditFormContent
          cardConfig={{ ...cardConfig }}
          onChange={mockOnChange}
          getValidTimeRanges={mockGetValidTimeRangesWithEmptyArray}
        />
      );
      const timeRangeSelector = screen.queryByLabelText('Time range');
      expect(timeRangeSelector).not.toBeInTheDocument();
    });
  });
  describe('handleTranslationCallback', () => {
    it('should return the proper translations', () => {
      const i18n = {
        openMenuText: 'Open menu',
        closeMenuText: 'Close menu',
        clearAllText: 'Clear all',
      };
      const bogusTranslation = handleTranslationCallback('bogus', i18n);
      expect(bogusTranslation).toEqual('');

      const clearTranslation = handleTranslationCallback('clear.all', i18n);
      expect(clearTranslation).toEqual('Clear all');

      const openTranslation = handleTranslationCallback('open.menu', i18n);
      expect(openTranslation).toEqual('Open menu');

      const closeTranslation = handleTranslationCallback('close.menu', i18n);
      expect(closeTranslation).toEqual('Close menu');
    });
  });
});
