import React, { useState } from 'react';
/*
import uuidv1 from 'uuid/v1';
*/
import { text, boolean, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
/*
import { Button } from 'carbon-components-react';
import moment from 'moment';
*/

import { chartData, tableColumns, tableData } from '../../utils/sample';
import {
  COLORS,
  DASHBOARD_BREAKPOINTS,
  DASHBOARD_COLUMNS,
  CARD_DIMENSIONS,
  ROW_HEIGHT,
  CARD_SIZES,
  CARD_TYPES,
} from '../../constants/LayoutConstants';

import Dashboard from './Dashboard';

const timeOffset = new Date().getTime() - chartData.dataItemToMostRecentTimestamp.temperature;

const originalCards = [
  {
    title: 'SMALL',
    id: 'facilitycard',
    size: CARD_SIZES.SMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: [
      { title: 'Comfort Level', value: 89, unit: '%' },
      { title: 'Utilization', value: 76, unit: '%' },
      { title: 'Pressure', value: 21.4, unit: 'mb' },
    ],
  },
  {
    title: 'Humidity',
    id: 'facilitycard-xs',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: [
      {
        value: 62.1,
        unit: '%',
        thresholds: [
          { comparison: '<', value: '40', color: 'red' },
          { comparison: '<', value: '70', color: 'green' },
          { comparison: '>=', value: '70', color: 'red' },
        ],
      },
    ],
  },
  {
    title: 'Utilization',
    id: 'facilitycard-xs2',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: [{ value: 76, title: 'Average', unit: '%' }],
  },
  {
    title: 'Alert Count',
    id: 'facilitycard-xs3',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: [
      {
        title: 'weekly',
        value: 35,
        secondaryValue: { value: 13, trend: 'up', color: 'green' },
      },
    ],
  },
  {
    title: 'Comfort Level',
    id: 'facilitycard-comfort-level',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: [
      {
        value: 'Bad',
        thresholds: [
          { comparison: '=', value: 'Good', icon: 'icon--checkmark--solid', color: 'green' },
          { comparison: '=', value: 'Bad', icon: 'icon--close--solid', color: 'red' },
        ],
      },
    ],
  },
  {
    title: 'Alerts (Section 2)',
    tooltip: 'This view showcases the variety of alert severities present in your context.',
    id: 'facilitycard-pie',
    size: CARD_SIZES.SMALL,
    type: CARD_TYPES.PIE,
    availableActions: {
      delete: true,
    },
    content: {
      title: 'Alerts',
      data: [
        { label: 'Sev 3', value: 2, color: COLORS.RED },
        { label: 'Sev 2', value: 7, color: COLORS.YELLOW },
        { label: 'Sev 1', value: 32, color: COLORS.BLUE },
      ],
    },
  },
  {
    title: 'Foot Traffic',
    id: 'facilitycard-xs4',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: [
      {
        title: 'weekly',
        value: 13572,
        secondaryValue: { value: '22%', trend: 'down', color: 'red' },
      },
    ],
  },
  {
    title: 'Health',
    id: 'facilitycard-health',
    size: CARD_SIZES.XSMALLWIDE,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: [
      {
        value: 'Healthy',
        thresholds: [
          { comparison: '=', value: 'Healthy', icon: 'icon--checkmark--solid', color: 'green' },
          { comparison: '=', value: 'Unhealthy', icon: 'icon--close--solid', color: 'red' },
        ],
      },
    ],
  },
  {
    title: 'Alerts',
    id: 'alert-table1',
    size: CARD_SIZES.LARGE,
    type: CARD_TYPES.TABLE,
    availableActions: {
      expand: true,
    },
    content: {
      data: tableData,
      columns: tableColumns,
    },
  },
  {
    title: 'Atmospheric Conditions (Section 2)',
    id: 'facilitycard3',
    size: CARD_SIZES.MEDIUM,
    type: CARD_TYPES.TIMESERIES,
    availableActions: {
      delete: true,
      expand: true,
    },
    content: {
      data: [
        {
          label: 'Temperature',
          values: chartData.events
            .filter((i, idx) => idx < 15)
            .map(i => ({
              t: new Date(i.timestamp + timeOffset).toISOString(),
              v: i.temperature,
            })),
          color: COLORS.RED,
        },
        {
          label: 'Pressure',
          values: chartData.events
            .filter((i, idx) => idx < 10)
            .map(i => ({
              t: new Date(i.timestamp + timeOffset).toISOString(),
              v: i.pressure,
            })),
          color: COLORS.BLUE,
        },
      ],
    },
  },
  {
    title: 'Alerts (Weekly)',
    id: 'xlarge-bar-alerts',
    size: CARD_SIZES.LARGE,
    type: CARD_TYPES.BAR,
    availableActions: {
      delete: true,
      expand: true,
    },
    content: {
      data: [
        {
          label: 'Sev 1',
          values: chartData.events
            .filter((i, idx) => idx < 7)
            .map(i => ({
              x: new Date(i.timestamp + timeOffset).toISOString(),
              y: Math.ceil(i.pressure / 10),
            })),
          color: COLORS.BLUE,
        },
        {
          label: 'Sev 2',
          values: chartData.events
            .filter((i, idx) => idx < 7)
            .map(i => ({
              x: new Date(i.timestamp + timeOffset).toISOString(),
              y: Math.ceil(i.humidity / 10),
            })),
          color: COLORS.YELLOW,
        },
        {
          label: 'Sev 3',
          values: chartData.events
            .filter((i, idx) => idx < 7)
            .map(i => ({
              x: new Date(i.timestamp + timeOffset).toISOString(),
              y: Math.ceil(i.temperature / 10),
            })),
          color: COLORS.RED,
        },
      ],
    },
  },
  {
    title: 'Alerts (Section 1)',
    id: 'facilitycard-donut',
    size: CARD_SIZES.SMALL,
    type: CARD_TYPES.DONUT,
    availableActions: {
      delete: true,
    },
    content: {
      title: 'Alerts',
      data: [
        { label: 'Sev 3', value: 6, color: COLORS.RED },
        { label: 'Sev 2', value: 9, color: COLORS.YELLOW },
        { label: 'Sev 1', value: 18, color: COLORS.BLUE },
      ],
    },
  },
  {
    title: 'Atmospheric Conditions (Section 1)',
    id: 'xlarge-timeseries-pressure',
    size: CARD_SIZES.XLARGE,
    type: CARD_TYPES.TIMESERIES,
    availableActions: {
      delete: true,
      expand: true,
    },
    content: {
      data: [
        {
          label: 'Temperature',
          values: chartData.events
            .filter((i, idx) => idx < 15)
            .map(i => ({
              t: new Date(i.timestamp + timeOffset).toISOString(),
              v: i.temperature,
            })),
          color: COLORS.RED,
        },
        {
          label: 'Pressure',
          values: chartData.events
            .filter((i, idx) => idx < 10)
            .map(i => ({
              t: new Date(i.timestamp + timeOffset).toISOString(),
              v: i.pressure,
            })),
          color: COLORS.BLUE,
        },
        {
          label: 'Humidity',
          values: chartData.events
            .filter((i, idx) => idx < 13)
            .map(i => ({
              t: new Date(i.timestamp + timeOffset).toISOString(),
              v: i.humidity,
            })),
          color: COLORS.YELLOW,
        },
      ],
    },
  },
];

export const DASHBOARD_SIZES_16_COL = {
  MAX: 'max',
  XLARGE: 'xl',
  LARGE: 'lg',
  MEDIUM: 'md',
  SMALL: 'sm',
  XSMALL: 'xs',
};

export const DASHBOARD_COLUMNS_16_COL = {
  max: 16,
  xl: 16,
  lg: 16,
  md: 8,
  sm: 4,
  xs: 4,
};

export const DASHBOARD_BREAKPOINTS_16_COL = {
  max: 1800,
  xl: 1312,
  lg: 1056,
  md: 672,
  sm: 480,
  xs: 320,
};

const CARD_DIMENSIONS_16_COL = {
  XSMALL: {
    max: { w: 2, h: 1 },
    xl: { w: 2, h: 1 },
    lg: { w: 2, h: 1 },
    md: { w: 2, h: 1 },
    sm: { w: 2, h: 1 },
    xs: { w: 2, h: 1 },
  },
  XSMALLWIDE: {
    max: { w: 3, h: 1 },
    xl: { w: 4, h: 1 },
    lg: { w: 4, h: 1 },
    md: { w: 4, h: 1 },
    sm: { w: 2, h: 1 },
    xs: { w: 4, h: 1 },
  },
  SMALL: {
    max: { w: 2, h: 2 },
    xl: { w: 4, h: 2 },
    lg: { w: 4, h: 2 },
    md: { w: 4, h: 2 },
    sm: { w: 2, h: 2 },
    xs: { w: 4, h: 2 },
  },
  TALL: {
    max: { w: 2, h: 4 },
    xl: { w: 4, h: 4 },
    lg: { w: 4, h: 4 },
    md: { w: 4, h: 4 },
    sm: { w: 2, h: 4 },
    xs: { w: 4, h: 4 },
  },
  MEDIUM: {
    max: { w: 6, h: 2 },
    xl: { w: 8, h: 2 },
    lg: { w: 8, h: 2 },
    md: { w: 8, h: 2 },
    sm: { w: 4, h: 2 },
    xs: { w: 4, h: 2 },
  },
  WIDE: {
    max: { w: 8, h: 2 },
    xl: { w: 8, h: 2 },
    lg: { w: 12, h: 2 },
    md: { w: 8, h: 2 },
    sm: { w: 4, h: 2 },
    xs: { w: 4, h: 2 },
  },
  LARGE: {
    max: { w: 6, h: 4 },
    xl: { w: 8, h: 4 },
    lg: { w: 8, h: 4 },
    md: { w: 8, h: 4 },
    sm: { w: 4, h: 4 },
    xs: { w: 4, h: 4 },
  },
  XLARGE: {
    max: { w: 8, h: 4 },
    xl: { w: 12, h: 4 },
    lg: { w: 16, h: 4 },
    md: { w: 8, h: 4 },
    sm: { w: 4, h: 4 },
    xs: { w: 4, h: 4 },
  },
};

const StatefulDashboard = ({ ...props }) => {
  const [cards, setCards] = useState(originalCards);

  /*
  const handleAdd = () => {
    setCards([
      ...cards,
      {
        title: 'SMALL', // faker.company.companyName(),
        id: uuidv1(),
        size: CARD_SIZES.SMALL,
        type: CARD_TYPES.VALUE,
        content: [
          { title: 'Comfort Level', value: 89, unit: '%' },
          { title: 'Utilization', value: 76, unit: '%' },
          { title: 'Number of Alerts', value: 17 },
        ],
      },
    ]);
  };
  */

  const handleCardAction = (id, type, payload) => {
    console.log(id, type, payload);
    if (type === 'DELETE_CARD') {
      setCards(cards.filter(i => i.id !== id));
    }
    if (type === 'OPEN_EXPANDED_CARD') {
      setCards(cards.map(i => (i.id === id ? { ...i, isExpanded: true } : i)));
    }
    if (type === 'CLOSE_EXPANDED_CARD') {
      setCards(cards.map(i => (i.id === id ? { ...i, isExpanded: false } : i)));
    }
    if (type === 'TABLE_CARD_ROW_ACTION') {
      console.log(id, type, payload);
    }
  };

  /*
  return (
    <div>
      <Button style={{ margin: '20px 0 0 20px' }} onClick={handleAdd}>
        Add card
      </Button>
      <Dashboard cards={cards} onCardAction={handleCardAction} {...props} />
    </div>
  );
  */
  return <Dashboard cards={cards} onCardAction={handleCardAction} {...props} />;
};

storiesOf('Dashboard (Experimental)', module)
  .add('basic - 12 col', () => {
    return (
      <StatefulDashboard
        title={text('title', 'Munich Building')}
        isEditable={boolean('isEditable', false)}
        isLoading={boolean('isLoading', false)}
        dashboardBreakpoints={object('breakpoints', DASHBOARD_BREAKPOINTS)}
        dashboardColumns={object('columns', DASHBOARD_COLUMNS)}
        cardDimensions={object('card dimensions', CARD_DIMENSIONS)}
        rowHeight={object('row height', ROW_HEIGHT)}
      />
    );
  })
  .add('basic - 16 col', () => {
    return (
      <StatefulDashboard
        title={text('title', 'Munich Building')}
        isEditable={boolean('isEditable', false)}
        isLoading={boolean('isLoading', false)}
        dashboardBreakpoints={object('breakpoints', DASHBOARD_BREAKPOINTS_16_COL)}
        dashboardColumns={object('columns', DASHBOARD_COLUMNS_16_COL)}
        cardDimensions={object('card dimensions', CARD_DIMENSIONS_16_COL)}
        rowHeight={object('row height', ROW_HEIGHT)}
      />
    );
  })
  .add('loading', () => {
    return (
      <StatefulDashboard
        title={text('title', 'Munich Building')}
        isEditable={boolean('isEditable', false)}
        isLoading={boolean('isLoading', true)}
        dashboardBreakpoints={object('breakpoints', DASHBOARD_BREAKPOINTS)}
        dashboardColumns={object('columns', DASHBOARD_COLUMNS)}
        cardDimensions={object('card dimensions', CARD_DIMENSIONS)}
        rowHeight={object('row height', ROW_HEIGHT)}
      />
    );
  })
  .add('only value cards', () => {
    const numberThresholds = [
      { comparison: '<', value: '40', color: 'red', icon: 'icon--close--solid' },
      { comparison: '<', value: '70', color: 'green', icon: 'icon--checkmark--solid' },
      { comparison: '<', value: '80', color: 'orange', icon: 'icon--warning--solid' },
      { comparison: '>=', value: '90', color: 'red', icon: 'icon--close--solid' },
    ];
    const stringThresholds = [
      { comparison: '=', value: 'Low', color: 'green' },
      { comparison: '=', value: 'Guarded', color: 'blue' },
      { comparison: '=', value: 'Elevated', color: 'gold' },
      { comparison: '=', value: 'High', color: 'orange' },
      { comparison: '=', value: 'Severe', color: 'red' },
    ];
    const stringThresholdsWithIcons = [
      { comparison: '=', value: 'Low', color: 'green', icon: 'icon--checkmark--solid' },
      { comparison: '=', value: 'Guarded', color: 'blue', icon: 'icon--checkmark--solid' },
      { comparison: '=', value: 'Elevated', color: 'gold', icon: 'icon--warning--solid' },
      { comparison: '=', value: 'High', color: 'orange', icon: 'icon--warning--solid' },
      { comparison: '=', value: 'Severe', color: 'red', icon: 'icon--close--solid' },
    ];
    const extraProps = {
      lastUpdated: 'Now',
      dashboardBreakpoints: DASHBOARD_BREAKPOINTS_16_COL,
      dashboardColumns: DASHBOARD_COLUMNS_16_COL,
      cardDimensions: CARD_DIMENSIONS_16_COL,
      rowHeight: ROW_HEIGHT,
    };
    const dashboards = [
      <Dashboard
        title="Single value / xsmall / units and precision"
        {...extraProps}
        cards={[
          ['value: 13', 13, null],
          ['value: 1352', 1352, 'steps'],
          ['value: 103.2', 103.2, '˚F'],
          ['value: 107324.3', 107324.3, 'kJ'],
          ['value: 1709384.1', 1709384.1, 'people'],
          ['value: false', false, null],
          ['value: true', true, null],
        ].map((v, idx) => ({
          title: `${v[0]} ${v[2] || ''}`,
          id: `xsmall-number-${idx}`,
          size: CARD_SIZES.XSMALL,
          type: CARD_TYPES.VALUE,
          content: [{ value: v[1], unit: v[2] }],
        }))}
      />,
      <Dashboard
        title="Single value / xsmall / trend and label"
        {...extraProps}
        cards={[65.3, 48.7, 88.1, 103.2].map((v, idx) => ({
          title: 'Temperature',
          id: `xsmall-number-${idx}`,
          size: CARD_SIZES.XSMALL,
          type: CARD_TYPES.VALUE,
          content: [
            {
              value: v,
              secondaryValue:
                idx === 2
                  ? { value: 3.2, trend: 'up', color: 'green' }
                  : idx === 3
                  ? { trend: 'down', color: 'red' }
                  : undefined,
              title:
                idx === 1 ? 'Weekly Avg' : idx === 3 ? 'Long label that might not fit' : undefined,
              unit: '˚F',
            },
          ],
        }))}
      />,
      <Dashboard
        title="Single value / xsmall / numerical thresholds w/ icons"
        {...extraProps}
        cards={[38.2, 65.3, 77.7, 91].map((v, idx) => ({
          title: 'Humidity',
          id: `xsmall-number-threshold-${idx}`,
          size: CARD_SIZES.XSMALL,
          type: CARD_TYPES.VALUE,
          content: [{ value: v, unit: '%', thresholds: numberThresholds }],
        }))}
      />,
      <Dashboard
        title="Single value / xsmall / string thresholds without icons"
        {...extraProps}
        cards={stringThresholds
          .map(i => i.value)
          .map((v, idx) => ({
            title: 'Danger Level',
            id: `xsmall-string-threshold-${idx}`,
            size: CARD_SIZES.XSMALL,
            type: CARD_TYPES.VALUE,
            content: [{ value: v, thresholds: stringThresholds }],
          }))}
      />,
      <Dashboard
        title="Single value / xsmallwide / varied"
        {...extraProps}
        cards={[
          ['value: 13', 13, null],
          ['value: 1352', 1352, 'steps'],
          ['value: 103.2', 103.2, '˚F'],
          ['value: 107324.3', 107324.3, 'kJ'],
          ['value: 1709384.1', 1709384.1, 'people'],
          ['value: false', false, null],
          ['value: true', true, null],
        ]
          .map((v, idx) => ({
            title: `${v[0]} ${v[2] || ''}`,
            id: `xsmallwide-number-${idx}`,
            size: CARD_SIZES.XSMALLWIDE,
            type: CARD_TYPES.VALUE,
            content: [{ value: v[1], unit: v[2] }],
          }))
          .concat(
            [65.3, 48.7, 88.1, 103.2].map((v, idx) => ({
              title: 'Temperature',
              id: `xsmallwide-number-trend-${idx}`,
              size: CARD_SIZES.XSMALLWIDE,
              type: CARD_TYPES.VALUE,
              content: [
                {
                  value: v,
                  secondaryValue:
                    idx === 2
                      ? { value: 3.2, trend: 'up', color: 'green' }
                      : idx === 3
                      ? { trend: 'down', color: 'red' }
                      : undefined,
                  title:
                    idx === 1
                      ? 'Weekly Avg'
                      : idx === 3
                      ? 'Long label that might not fit'
                      : undefined,
                  unit: '˚F',
                },
              ],
            }))
          )
          .concat(
            [38.2, 65.3, 77.7, 91].map((v, idx) => ({
              title: 'Humidity',
              id: `xsmallwide-number-threshold-${idx}`,
              size: CARD_SIZES.XSMALLWIDE,
              type: CARD_TYPES.VALUE,
              content: [{ value: v, unit: '%', thresholds: numberThresholds }],
            }))
          )
          .concat(
            stringThresholds
              .map(i => i.value)
              .map((v, idx) => ({
                title: 'Danger Level',
                id: `xsmallwide-string-threshold-${idx}`,
                size: CARD_SIZES.XSMALLWIDE,
                type: CARD_TYPES.VALUE,
                content: [{ value: v, thresholds: stringThresholds }],
              }))
          )}
      />,
      <Dashboard
        title="Multi-value / xsmallwide / units and precision"
        {...extraProps}
        cards={[
          ['values: 89.2%, 76 mb', 89.2, '%', 'Comfort Level', 21.3, 'mb', 'Pressure'],
          ['values: 88.3˚F, Elevated', 88.3, '˚F', 'Temperature', 'Elevated', null, 'Danger Level'],
          [
            'values: 88.3˚F, Elevated',
            103.7,
            '˚F',
            'Temperature',
            '1709384.1',
            'people',
            'Foot Traffic',
          ],
        ].map((v, idx) => ({
          title: v[0],
          id: `xsmallwide-multi-${idx}`,
          size: CARD_SIZES.XSMALLWIDE,
          type: CARD_TYPES.VALUE,
          content: [
            {
              value: v[1],
              unit: v[2],
              title: v[3],
            },
            {
              value: v[4],
              unit: v[5],
              title: v[6],
            },
          ],
        }))}
      />,
      <Dashboard
        title="Multi-value / xsmallwide / trend"
        {...extraProps}
        cards={[
          [
            'values: 89.2%, 76 mb',
            89.2,
            '%',
            'Comfort Level',
            2,
            'down',
            'red',
            21.3,
            'mb',
            'Pressure',
            215.2,
            'down',
            'red',
          ],
          [
            'values: 88.3˚F, Elevated',
            88.3,
            '˚F',
            'Temperature',
            4.1,
            'up',
            'green',
            'Elevated',
            null,
            'Danger Level',
            null,
            null,
            null,
          ],
          [
            'values: 88.3˚F, Elevated',
            103.7,
            '˚F',
            'Temperature',
            null,
            'up',
            'green',
            '1709384.1',
            'people',
            'Foot Traffic',
            137982.2,
            'down',
            'red',
          ],
        ].map((v, idx) => ({
          title: v[0],
          id: `xsmallwide-multi-${idx}`,
          size: CARD_SIZES.XSMALLWIDE,
          type: CARD_TYPES.VALUE,
          content: [
            {
              value: v[1],
              unit: v[2],
              title: v[3],
              secondaryValue:
                v[5] !== null
                  ? {
                      value: v[4],
                      trend: v[5],
                      color: v[6],
                    }
                  : undefined,
            },
            {
              value: v[7],
              unit: v[8],
              title: v[9],
              secondaryValue:
                v[11] !== null
                  ? {
                      value: v[10],
                      trend: v[11],
                      color: v[12],
                    }
                  : undefined,
            },
          ],
        }))}
      />,
      <Dashboard
        title="Multi-value / xsmallwide / threshold"
        {...extraProps}
        cards={[
          [38.2, '%', 'Average', 65.3, '%', 'Max'],
          [77.2, '˚F', 'Average', 91.3, '˚F', 'Max'],
        ].map((v, idx) => ({
          title: 'Humidity',
          id: `xsmallwide-multi-number-threshold-${idx}`,
          size: CARD_SIZES.XSMALLWIDE,
          type: CARD_TYPES.VALUE,
          content: [
            { value: v[0], unit: v[1], title: v[2], thresholds: numberThresholds },
            { value: v[3], unit: v[4], title: v[5], thresholds: numberThresholds },
          ],
        }))}
      />,
      <Dashboard
        title="Multi-value / small"
        {...extraProps}
        cards={[
          [
            'Humidity',
            13634.56,
            'MWh',
            'YTD',
            null,
            1047.2,
            'MWh',
            'MTD',
            'up',
            314.5,
            'MWh',
            'Last Week',
            'down',
          ],
          [
            'Danger Level',
            'Severe',
            null,
            'Current',
            null,
            'Low',
            null,
            'Last Week',
            null,
            'High',
            null,
            'Last Month',
            null,
          ],
          [
            'Danger Level',
            'Low',
            null,
            'Current',
            null,
            'Severe',
            null,
            'Last Week',
            null,
            'Elevated',
            null,
            'Last Month',
            null,
          ],
        ].map((v, idx) => ({
          title: v[0],
          id: `xsmallwide-multi-number-threshold-${idx}`,
          size: CARD_SIZES.SMALL,
          type: CARD_TYPES.VALUE,
          content: [
            {
              value: v[1],
              unit: v[2],
              title: v[3],
              thresholds:
                idx === 1 ? stringThresholds : idx === 2 ? stringThresholdsWithIcons : undefined,
              secondaryValue:
                v[4] !== null
                  ? { value: v[1] / 5, trend: v[4], color: v[4] === 'down' ? 'red' : 'green' }
                  : undefined,
            },
            {
              value: v[5],
              unit: v[6],
              title: v[7],
              thresholds:
                idx === 1 ? stringThresholds : idx === 2 ? stringThresholdsWithIcons : undefined,
              secondaryValue:
                v[8] !== null
                  ? { value: v[5] / 5, trend: v[8], color: v[8] === 'down' ? 'red' : 'green' }
                  : undefined,
            },
            {
              value: v[9],
              unit: v[10],
              title: v[11],
              thresholds:
                idx === 1 ? stringThresholds : idx === 2 ? stringThresholdsWithIcons : undefined,
              secondaryValue:
                v[12] !== null
                  ? { trend: v[12], color: v[12] === 'down' ? 'red' : 'green' }
                  : undefined,
            },
          ],
        }))}
      />,
    ];

    return (
      <div>
        {dashboards.map(i => [
          <div style={{ width: 1056, paddingBottom: 50 }}>
            <h1>&quot;Largest&quot; Rendering (1056px width)</h1>
            <hr />
            {i}
          </div>,
          <div style={{ width: 1057, paddingBottom: 50 }}>
            <h1>&quot;Tightest&quot; Rendering (1057px width)</h1>
            <hr />
            {i}
          </div>,
        ])}
      </div>
    );
  });
