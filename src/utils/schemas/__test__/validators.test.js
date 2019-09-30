/**
 * IBM Confidential
 * OCO Source Materials
 * 5900-A0N
 * © Copyright IBM Corp. 2018
 * The source code for this program is not published or otherwise divested of its
 * trade secrets, irrespective of what has been deposited with the U.S. Copyright
 * Office.
 */

import omit from 'lodash/omit';

import { CARD_TYPES, CARD_SIZES } from '../../../constants/LayoutConstants';
import {
  findMissingDataSource,
  validateDashboardJSON,
  validateValueCard,
  validateTimeSeriesCard,
  validateCard,
  validateAggregators,
} from '../validators';
import dashboardExample from '../dashboard.example';

const mockTimeSeriesCard = {
  type: CARD_TYPES.TIMESERIES,
  id: 'timeSeriesID',
  size: CARD_SIZES.LARGE,
  title: 'My Line Chart',
  dataSource: {
    attributes: [
      {
        id: 'tempMax',
        attribute: 'temperature',
        aggregator: 'max',
      },
    ],
    range: {
      type: 'periodToDate',
      count: -1,
      interval: 'month',
    },
    timeGrain: 'day',
  },
  content: {
    series: [
      {
        label: 'max temperature',
        dataSourceId: 'tempMax',
        color: '#ff0000',
      },
    ],
    xLabel: 'My XAxis',
    yLabel: 'My YAxis',
    unit: 'C',
  },
};
const dataAttributes = [
  { name: 'status', columnType: 'LITERAL' },
  { name: 'comfort', columnType: 'NUMBER' },
  { name: 'isUncomfortable', columnType: 'BOOLEAN' },
  { name: 'alerts', columnType: 'NUMBER' },
  { name: 'temperature', columnType: 'NUMBER' },
];

describe('validators', () => {
  test('findMissingDataSource', () => {
    const mockAttributes = [{ dataSourceId: 'pressure' }, { dataSourceId: 'firmware' }];
    // These two attributes exist that are being referenced
    expect(
      findMissingDataSource(mockAttributes, [{ id: 'pressure' }], ['firmware'])
    ).toBeUndefined();
    expect(findMissingDataSource(mockAttributes, [], ['firmware'])).toBeDefined();
    expect(findMissingDataSource(mockAttributes, [{ id: 'pressure' }])).toBeDefined();
  });
  test('validateDashboardJSON', () => {
    const validate = validateDashboardJSON({}, dataAttributes);
    expect(validate.isValid).toEqual(false);
    expect(validate.errors).toBeDefined();
    expect(validate.errors.length).toBeGreaterThan(0);

    const validate2 = validateDashboardJSON(dashboardExample, dataAttributes);
    expect(validate2.isValid).toEqual(true);
    expect(validate2.errors).toBeNull();
  });
  test('validateValueCard', () => {
    dashboardExample.cards
      .filter(card => card.type === CARD_TYPES.VALUE)
      .forEach(card => {
        const validateCard = validateValueCard(card);
        expect(validateCard.errors).toHaveLength(0);
        expect(validateCard.isValid).toEqual(true);
      });
    const validateCard2 = validateValueCard({ content: {} });
    expect(validateCard2.errors).not.toHaveLength(0);
    expect(validateCard2.isValid).toEqual(false);
  });
  test('validateValueCard missing attribute', () => {
    const validateCard2 = validateValueCard({
      ...dashboardExample.cards[0],
      dataSource: {
        ...dashboardExample.cards[0].dataSource,
        attributes: dashboardExample.cards[0].dataSource.attributes.slice(0, 1),
      }, // remove one of the attributes from the datasource
    });

    expect(validateCard2.errors).not.toHaveLength(0);
    expect(validateCard2.isValid).toEqual(false);
  });
  test('validateValueCard determine maxAttributeCount', () => {
    const cardErrors = validateValueCard({ ...dashboardExample.cards[0], size: CARD_SIZES.XSMALL });
    expect(cardErrors.errors).toHaveLength(1);
  });
  test('validateCardIdUniqueness', () => {
    const validate = validateDashboardJSON(
      {
        ...dashboardExample,
        cards: dashboardExample.cards.map(card => ({ ...card, id: 'nonunique' })),
      },
      dataAttributes
    );
    expect(validate.errors).toBeDefined();
    expect(validate.isValid).toEqual(false);
  });
  test('validateCard', () => {
    const cardErrors = validateCard(
      {
        ...dashboardExample.cards[0],
        dataSource: {
          ...dashboardExample.cards[0].dataSource,
          attributes: dashboardExample.cards[0].dataSource.attributes.map(attribute => ({
            ...attribute,
            id: 'nonunique',
          })),
        },
      },
      dataAttributes
    );
    expect(cardErrors).toHaveLength(1);
  });
  test('validateCard missing dataAttribute', () => {
    const cardErrors = validateCard(dashboardExample.cards[0], dataAttributes.slice(0, 1));
    expect(cardErrors).toHaveLength(1);
  });
  test('validateTimeSeriesCard good', () => {
    const validateCard = validateTimeSeriesCard(mockTimeSeriesCard);
    expect(validateCard.errors).toHaveLength(0);
    expect(validateCard.isValid).toEqual(true);
  });
  test('validateTimeSeriesCard bad', () => {
    const validateCard = validateTimeSeriesCard({ ...mockTimeSeriesCard, content: {} });
    expect(validateCard.errors).not.toHaveLength(0);
    expect(validateCard.isValid).toEqual(false);
  });
  test('validateTimeSeriesCard in dashboard missing series', () => {
    const mockDashboard = {
      ...dashboardExample,
      cards: [
        { ...mockTimeSeriesCard, content: { ...omit(mockTimeSeriesCard.content, 'series') } },
      ],
    };
    const validateDashboard = validateDashboardJSON(mockDashboard, dataAttributes);
    expect(validateDashboard.errors).toHaveLength(1);
    expect(validateDashboard.isValid).toEqual(false);
  });
  test('validateTimeSeriesCard in dashboard missing attributes', () => {
    const mockDashboard = {
      ...dashboardExample,
      cards: [mockTimeSeriesCard],
    };
    const validateDashboard = validateDashboardJSON(mockDashboard, dataAttributes.slice(0, 1));
    expect(validateDashboard.errors).toHaveLength(1);
    expect(validateDashboard.isValid).toEqual(false);
  });
  test('validateTimeSeriesCard bad sizes', () => {
    const validateCard = validateTimeSeriesCard({ ...mockTimeSeriesCard, size: CARD_SIZES.XSMALL });
    expect(validateCard.errors).not.toHaveLength(0);
    expect(validateCard.isValid).toEqual(false);
    const validateCard2 = validateTimeSeriesCard({
      ...mockTimeSeriesCard,
      size: CARD_SIZES.XSMALLWIDE,
    });
    expect(validateCard2.errors).not.toHaveLength(0);
    expect(validateCard2.isValid).toEqual(false);
    const validateCard3 = validateTimeSeriesCard({ ...mockTimeSeriesCard, size: CARD_SIZES.TALL });
    expect(validateCard3.errors).not.toHaveLength(0);
    expect(validateCard3.isValid).toEqual(false);
  });
  test('validateTimeSeriesCard good sizes', () => {
    const validateCard = validateTimeSeriesCard({ ...mockTimeSeriesCard, size: CARD_SIZES.SMALL });
    expect(validateCard.errors).toHaveLength(0);
    expect(validateCard.isValid).toEqual(true);
    const validateCard2 = validateTimeSeriesCard({
      ...mockTimeSeriesCard,
      size: CARD_SIZES.MEDIUM,
    });
    expect(validateCard2.errors).toHaveLength(0);
    expect(validateCard2.isValid).toEqual(true);
    const validateCard3 = validateTimeSeriesCard({ ...mockTimeSeriesCard, size: CARD_SIZES.LARGE });
    expect(validateCard3.errors).toHaveLength(0);
    expect(validateCard3.isValid).toEqual(true);
    const validateCard4 = validateTimeSeriesCard({
      ...mockTimeSeriesCard,
      size: CARD_SIZES.XLARGE,
    });
    expect(validateCard4.errors).toHaveLength(0);
    expect(validateCard4.isValid).toEqual(true);
  });
  test('validateAggregators', () => {
    const mockDataSource = [{ attribute: 'status', aggregator: 'mean' }];
    const aggregatorErrors = validateAggregators(mockDataSource, dataAttributes);
    expect(aggregatorErrors).toHaveLength(1);

    const mockDataSource2 = [{ attribute: 'status', aggregator: 'last' }];
    const aggregatorErrors2 = validateAggregators(mockDataSource2, dataAttributes);
    expect(aggregatorErrors2).toHaveLength(0);
    const mockDataSource3 = [{ attribute: 'comfort', aggregator: 'mean' }];
    const aggregatorErrors3 = validateAggregators(mockDataSource3, dataAttributes);
    expect(aggregatorErrors3).toHaveLength(0);
  });
});
