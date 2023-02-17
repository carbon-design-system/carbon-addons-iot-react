import { render, screen } from '@testing-library/react';

import {
  createColumnsWithFormattedLinks,
  determinePrecisionAndValue,
  handleExpandedItemLinks,
  determineFilterFunction,
  timeStampFilterFunction,
} from './tableCardUtils';

describe('tableCardUtils', () => {
  describe('createColumnsWithFormattedLinks', () => {
    it('skip encoding', () => {
      const columns = createColumnsWithFormattedLinks([{ linkTemplate: { href: '{myurl}' } }]);
      render(
        columns[0].renderDataFunction({ value: 'Link', row: { myurl: 'https://www.ibm.com' } })
      );
      expect(screen.getByText('Link').parentNode.innerHTML).toEqual(
        expect.stringContaining('https://www.ibm.com')
      );
    });

    it('encode value', () => {
      const columns = createColumnsWithFormattedLinks([
        { linkTemplate: { href: 'https://www.ibm.com?{asset}' } },
      ]);
      render(columns[0].renderDataFunction({ value: 'Link', row: { asset: 'asset with spaces' } }));
      expect(screen.getByText('Link').parentNode.innerHTML).toEqual(
        expect.stringContaining('https://www.ibm.com?asset%20with%20spaces')
      );
    });

    it('encode timestamp value', () => {
      const columns = createColumnsWithFormattedLinks([
        { linkTemplate: { href: 'https://www.ibm.com?{time}' } },
        { dataSourceId: 'time', type: 'TIMESTAMP' },
      ]);
      render(columns[0].renderDataFunction({ value: 'Link', row: { time: 1618431426000 } }));
      expect(screen.getByText('Link')).toHaveAttribute(
        'href',
        expect.stringContaining('https://www.ibm.com?04%2F14%2F2021%2015%3A17')
      );
    });
    it('should fallback to empty variables array if no linkTemplate.href given', () => {
      const columns = createColumnsWithFormattedLinks([
        { linkTemplate: { target: '_blank' } },
        { dataSourceId: 'time', type: 'TIMESTAMP' },
      ]);
      render(columns[0].renderDataFunction({ value: 'Link', row: { time: 1618431426000 } }));
      expect(screen.getByText('Link')).not.toHaveAttribute('href');
      expect(screen.getByText('Link')).toHaveAttribute('target', '_blank');
    });
  });

  describe('handleExpandedItemLinks', () => {
    it('handleExpandedItemLinks correctly applies linkTemplates and variables', () => {
      const row = {
        alert: 'some-alert',
        count: 6,
        hour: 126432112000,
        pressure: 3,
        deviceId: 73000,
      };
      const expandedRow = [
        {
          id: 'count',
          label: 'Count',
        },
        {
          id: 'deviceId',
          label: 'Device link',
          linkTemplate: {
            href: 'http://ibm.com/{deviceId}',
          },
        },
        {
          id: 'alert',
          label: 'Alert Description',
          linkTemplate: {
            href: 'http://ibm.com/',
          },
        },
      ];
      const cardVariables = {
        variable: 'variable-value',
      };

      // with row specific variables
      const updatedRowSpecificExpandedItems = handleExpandedItemLinks(row, expandedRow);
      expect(updatedRowSpecificExpandedItems).toEqual([
        {
          id: 'count',
          label: 'Count',
        },
        {
          id: 'deviceId',
          label: 'Device link',
          linkTemplate: {
            href: 'http://ibm.com/73000',
          },
        },
        {
          id: 'alert',
          label: 'Alert Description',
          linkTemplate: {
            href: 'http://ibm.com/',
          },
        },
      ]);
      // if cardVariables are given, then this function should return its original data
      const updatedExpandedItems = handleExpandedItemLinks(row, expandedRow, cardVariables);
      expect(updatedExpandedItems).toEqual(expandedRow);
    });
  });
  describe('determinePrecisionAndValue', () => {
    it('should use 0 precision if none given', () => {
      expect(determinePrecisionAndValue(undefined, 90, 'en')).toBe('90');
    });

    it('return `--` if value isNil', () => {
      expect(determinePrecisionAndValue(undefined, null, 'en')).toBe('--');
      expect(determinePrecisionAndValue(undefined, undefined, 'en')).toBe('--');
    });
    it("return `--` if value is not nil, but isn't a number", () => {
      expect(determinePrecisionAndValue(undefined, true, 'en')).toBe('--');
      expect(determinePrecisionAndValue(undefined, false, 'en')).toBe('--');
      expect(determinePrecisionAndValue(undefined, 'ibm', 'en')).toBe('--');
      expect(determinePrecisionAndValue(undefined, {}, 'en')).toBe('--');
    });
  });
});

describe('determineFilterFunction', () => {
  it('determaine filter columns', () => {
    const mockPlaceholderText = 'filter text';
    const customFilterFunction = jest.fn();
    const customPlaceholderText = 'customPlaceholdertext';
    const mockColumns = [
      // no filter on timestamp
      { type: 'TIMESTAMP', name: 'columnName' },
      {
        // a filter on timestamp
        type: 'TIMESTAMP',
        name: 'columnNameWithFilter',
        filter: { name: 'my existing filter' },
      },
      // no filter on LITERAL
      { type: 'LITERAL', name: 'columnName' },
      {
        // a filter on LITERAL
        type: 'LITERAL',
        name: 'columnNameWithFilter',
        filter: { name: 'my existing filter' },
      },
      {
        // a filter on timestamp
        type: 'TIMESTAMP',
        name: 'columnNameWithFilter',
        filter: { name: 'my existing filter', filterFunction: customFilterFunction },
      },
      {
        // a custom placeholder text
        type: 'TIMESTAMP',
        name: 'columnNameWithFilter',
        filter: {
          name: 'my existing filter',
          filterFunction: customFilterFunction,
          placeholderText: customPlaceholderText,
        },
      },
    ];

    const timestampColumnHasNoFilter = determineFilterFunction(
      mockColumns[0],
      mockPlaceholderText,
      'L HH:mm:ss'
    );
    expect(JSON.stringify(timestampColumnHasNoFilter)).toEqual(
      JSON.stringify({
        filterFunction: timeStampFilterFunction,
        placeholderText: mockPlaceholderText,
      })
    );

    const timestampColumnHasFilter = determineFilterFunction(mockColumns[1], mockPlaceholderText);
    expect(JSON.stringify(timestampColumnHasFilter)).toEqual(
      JSON.stringify({
        filterFunction: timeStampFilterFunction,
        placeholderText: mockPlaceholderText,
        name: 'my existing filter',
      })
    );
    const literalColumnHasNoFilter = determineFilterFunction(mockColumns[2], mockPlaceholderText);
    expect(literalColumnHasNoFilter).toEqual({
      placeholderText: mockPlaceholderText,
    });

    const literalColumnHasFilter = determineFilterFunction(mockColumns[3], mockPlaceholderText);
    expect(literalColumnHasFilter).toEqual({
      name: 'my existing filter',
      placeholderText: mockPlaceholderText,
    });

    const timestampColumnHasFilterWithCustomFilterFunction = determineFilterFunction(
      mockColumns[4],
      mockPlaceholderText
    );
    expect(timestampColumnHasFilterWithCustomFilterFunction).toEqual({
      filterFunction: customFilterFunction,
      name: 'my existing filter',
      placeholderText: mockPlaceholderText,
    });

    const timestampColumnHasFilterWithCustomPlaceholderText = determineFilterFunction(
      mockColumns[5],
      mockPlaceholderText
    );
    expect(timestampColumnHasFilterWithCustomPlaceholderText).toEqual({
      filterFunction: customFilterFunction,
      name: 'my existing filter',
      placeholderText: customPlaceholderText,
    });
  });
});
