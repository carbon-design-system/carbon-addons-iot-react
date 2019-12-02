import React from 'react';
import { text, boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Application32, Group32 } from '@carbon/icons-react';
import { ClickableTile } from 'carbon-components-react';

import FullWidthWrapper from '../../internal/FullWidthWrapper';
import { getIntervalChartData, tableColumns, tableData } from '../../utils/sample';
import { CARD_SIZES, CARD_TYPES } from '../../constants/LayoutConstants';
import imageFile from '../ImageCard/landscape.jpg';

import iconViewDashboards from './dashboard.svg';
import iconMonitorEntities from './data-scientist-illustration.svg';
import iconConnectDevices from './computer-chip.svg';
import Dashboard from './Dashboard';

const originalCards = [
  {
    title: 'Facility Metrics',
    id: 'facilitycard',
    size: CARD_SIZES.SMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: {
      attributes: [
        { label: 'Comfort Level', dataSourceId: 'comfortLevel', unit: '%' },
        { label: 'Utilization', dataSourceId: 'utilization', unit: '%' },
        { label: 'Pressure', dataSourceId: 'pressure', unit: 'mb' },
      ],
    },
    values: {
      comfortLevel: 89,
      utilization: 76,
      pressure: 21.4,
    },
  },
  {
    title: 'Humidity',
    id: 'facilitycard-xs',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: {
      attributes: [
        {
          dataSourceId: 'humidity',
          unit: '%',
          thresholds: [
            { comparison: '<', value: '40', color: 'red' },
            { comparison: '<', value: '70', color: 'green' },
            { comparison: '>=', value: '70', color: 'red' },
          ],
        },
      ],
    },
    values: {
      humidity: 62.1,
    },
  },
  {
    title: 'Utilization',
    id: 'facilitycard-xs2',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: {
      attributes: [{ dataSourceId: 'utilization', label: 'Average', unit: '%' }],
    },
    values: {
      utilization: 76,
    },
  },
  {
    title: 'Alert Count',
    id: 'facilitycard-xs3',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: {
      attributes: [
        {
          label: 'weekly',
          dataSourceId: 'alertCount',
          secondaryValue: { dataSourceId: 'alertCountTrend', trend: 'up', color: 'green' },
        },
      ],
    },
    values: { alertCount: 35, alertCountTrend: 13 },
  },
  {
    title: 'Comfort Level',
    id: 'facilitycard-comfort-level',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: {
      attributes: [
        {
          dataSourceId: 'comfortLevel',
          thresholds: [
            { comparison: '=', value: 'Good', icon: 'checkmark', color: 'green' },
            { comparison: '=', value: 'Bad', icon: 'close', color: 'red' },
          ],
        },
      ],
    },
    values: { comfortLevel: 'Bad' },
  },
  {
    title: 'Foot Traffic',
    id: 'facilitycard-xs4',
    size: CARD_SIZES.XSMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: {
      attributes: [
        {
          title: 'weekly',
          dataSourceId: 'footTraffic',
          secondaryValue: { dataSourceId: 'footTrafficTrend', trend: 'down', color: 'red' },
        },
      ],
    },
    values: { footTraffic: 13572, footTrafficTrend: '22%' },
  },
  {
    title: 'Health',
    id: 'facilitycard-health',
    size: CARD_SIZES.XSMALLWIDE,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: {
      attributes: [
        {
          dataSourceId: 'health',
          thresholds: [
            { comparison: '=', value: 'Healthy', icon: 'checkmark', color: 'green' },
            { comparison: '=', value: 'Unhealthy', icon: 'close', color: 'red' },
          ],
        },
      ],
    },
    values: { health: 'Healthy' },
  },
  {
    title: 'Temperature',
    id: 'facility-temperature-timeseries',
    size: CARD_SIZES.MEDIUM,
    type: CARD_TYPES.TIMESERIES,
    content: {
      series: [
        {
          label: 'Temperature',
          dataSourceId: 'temperature',
        },
      ],
      xLabel: 'Time',
      yLabel: 'Temperature (˚F)',
      timeDataSourceId: 'timestamp',
    },
    values: getIntervalChartData('day', 7, { min: 10, max: 100 }, 100),
    interval: 'hour',
    timeRange: 'last7Days',
    availableActions: { range: true },
    dataSource: {
      attributes: [
        {
          aggregator: 'last',
          attribute: 'speed',
          id: 'speed_Claudia_Sample_Robot_Type_last',
        },
      ],
      groupBy: ['deviceid'],
      range: {
        count: -7,
        interval: 'day',
      },
      timeGrain: 'day',
    },
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
    title: 'Environment',
    id: 'facility-multi-timeseries',
    size: CARD_SIZES.LARGE,
    type: CARD_TYPES.TIMESERIES,
    content: {
      series: [
        {
          label: 'Temperature',
          dataSourceId: 'temperature',
          // color: text('color', COLORS.PURPLE),
        },
        {
          label: 'Pressure',
          dataSourceId: 'pressure',
          // color: text('color', COLORS.PURPLE),
        },
      ],
      xLabel: 'Time',
      yLabel: 'Temperature (˚F)',
      timeDataSourceId: 'timestamp',
    },
    values: getIntervalChartData('month', 12, { min: 10, max: 100 }, 100),
    interval: 'month',
    timeRange: 'lastYear',
    availableActions: { range: true },
    dataSource: {
      attributes: [
        {
          aggregator: 'last',
          attribute: 'speed',
          id: 'speed_Claudia_Sample_Robot_Type_last',
        },
      ],
      groupBy: ['deviceid'],
      range: {
        count: -7,
        interval: 'day',
      },
      timeGrain: 'day',
    },
  },
  {
    title: 'Floor Map',
    id: 'floor map picture',
    size: CARD_SIZES.MEDIUM,
    type: CARD_TYPES.IMAGE,
    content: {
      alt: 'Floor Map',
      image: 'firstfloor',
      src: imageFile,
    },
    values: {
      hotspots: [
        {
          x: 35,
          y: 65,
          icon: 'arrowDown',
          content: <span style={{ padding: '10px' }}>Elevators</span>,
        },
        {
          x: 45,
          y: 25,
          color: '#0f0',
          content: <span style={{ padding: '10px' }}>Stairs</span>,
        },
        {
          x: 45,
          y: 50,
          color: '#00f',
          content: <span style={{ padding: '10px' }}>Vent Fan</span>,
        },
        {
          x: 45,
          y: 75,
          icon: 'arrowUp',
          content: <span style={{ padding: '10px' }}>Humidity Sensor</span>,
        },
      ],
    },
  },
];

const commonDashboardProps = {
  title: text('title', 'Munich Building'),
  cards: originalCards,
  onFetchData: (card, isTimeseriesData) => {
    action('onFetchData')(card, isTimeseriesData);
    return Promise.resolve({ ...card, values: [] });
  },
  lastUpdated: new Date('2019-10-22T00:00:00').toUTCString(),
  isEditable: boolean('isEditable', false),
  isLoading: boolean('isLoading', false),
  onBreakpointChange: action('onBreakpointChange'),
  onLayoutChange: action('onLayoutChange'),
};

storiesOf('Watson IoT|Dashboard', module)
  .add(
    'basic dashboard',
    () => {
      return (
        <FullWidthWrapper>
          <Dashboard {...commonDashboardProps} />
        </FullWidthWrapper>
      );
    },
    {
      info: {
        text: `
        ## Data Fetching
        To wire this dashboard to your own backend, implement the onFetchData callback to retrieve data for each card.  
        You will be passed an object containing all of the card props (including the currently selected range of the card) and can use these to determine which data to fetch.
        
        Return a promise that will resolve into an updated card object with data values
        For instance you could return {...card, values: [{timestamp: 1234123123,temperature: 35.5}]}

        If you want to trigger all the cards of the dashboard to load from an outside event (like a change in the data range that the dashboard is displaying), set the isLoading bit to true.
        Once all the cards have finished loading the setIsLoading(false) will be called from the Dashboard.
        
        # Component Overview
        `,
      },
    }
  )
  .add('basic - without last updated header', () => {
    return (
      <FullWidthWrapper>
        <Dashboard {...commonDashboardProps} hasLastUpdated={false} />
      </FullWidthWrapper>
    );
  })
  .add('custom actions', () => {
    return (
      <FullWidthWrapper>
        <Dashboard
          {...commonDashboardProps}
          actions={[{ id: 'edit', labelText: 'Edit', icon: 'edit' }]}
          onDashboardAction={action('onDashboardAction')}
        />
      </FullWidthWrapper>
    );
  })
  .add('sidebar', () => {
    return (
      <FullWidthWrapper>
        <Dashboard
          {...commonDashboardProps}
          sidebar={
            <div style={{ width: 300 }}>
              <h1>Sidebar content</h1>
              <h4>goes</h4>
              <p>here</p>
            </div>
          }
        />
      </FullWidthWrapper>
    );
  })
  .add('i18n labels', () => {
    return (
      <FullWidthWrapper>
        <Dashboard
          {...commonDashboardProps}
          i18n={{
            lastUpdatedLabel: text('lastUpdatedLabel', 'Last updated: '),
            noDataLabel: text('noDataLabel', 'No data is available for this time range.'),
            noDataShortLabel: text('noDataShortLabel', 'No data'),
            rollingPeriodLabel: text('rollingPeriodLabel', 'Rolling period'),
            last24HoursLabel: text('last24HoursLabel', 'Last 24 hrs'),
            last7DaysLabel: text('last7DaysLabel', 'Last 7 days'),
            lastMonthLabel: text('lastMonthLabel', 'Last month'),
            lastQuarterLabel: text('lastQuarterLabel', 'Last quarter'),
            lastYearLabel: text('lastYearLabel', 'Last year'),
            periodToDateLabel: text('periodToDateLabel', 'Period to date'),
            thisWeekLabel: text('thisWeekLabel', 'This week'),
            thisMonthLabel: text('thisMonthLabel', 'This month'),
            thisQuarterLabel: text('thisQuarterLabel', 'This quarter'),
            thisYearLabel: text('thisYearLabel', 'This year'),
            hourlyLabel: text('hourlyLabel', 'Hourly'),
            dailyLabel: text('dailyLabel', 'Daily'),
            weeklyLabel: text('weeklyLabel', 'Weekly'),
            monthlyLabel: text('monthlyLabel', 'Monthly'),
            overflowMenuDescription: text(
              'overflowMenuDescription',
              'open and close list of options'
            ),
            editCardLabel: text('editCardLabel', 'Edit card'),
            cloneCardLabel: text('cloneCardLabel', 'Clone card'),
            deleteCardLabel: text('deleteCardLabel', 'Delete card'),
            criticalLabel: text('criticalLabel', 'Critical'),
            moderateLabel: text('moderateLabel', 'Moderate'),
            lowLabel: text('lowLabel', 'Low'),
            selectSeverityPlaceholder: text('selectSeverityPlaceholder', 'Select a severity'),
            severityLabel: text('selectSeverityPlaceholder', '__Severity__'),

            // table i18n
            searchPlaceholder: text('searchPlaceholder', 'Search'),
            filterButtonAria: text('filterButtonAria', 'Filters'),
            defaultFilterStringPlaceholdText: text(
              'defaultFilterStringPlaceholdText',
              'Type and hit enter to apply'
            ),
            /** pagination */
            pageBackwardAria: text('i18n.pageBackwardAria', '__Previous page__'),
            pageForwardAria: text('i18n.pageForwardAria', '__Next page__'),
            pageNumberAria: text('i18n.pageNumberAria', '__Page Number__'),
            itemsPerPage: text('i18n.itemsPerPage', '__Items per page:__'),
            itemsRange: (min, max) => `__${min}–${max} items__`,
            currentPage: page => `__page ${page}__`,
            itemsRangeWithTotal: (min, max, total) => `__${min}–${max} of ${total} items__`,
            pageRange: (current, total) => `__${current} of ${total} pages__`,
            /** table body */
            overflowMenuAria: text('i18n.overflowMenuAria', '__More actions__'),
            clickToExpandAria: text('i18n.clickToExpandAria', '__Click to expand content__'),
            clickToCollapseAria: text('i18n.clickToCollapseAria', '__Click to collapse content__'),
            selectAllAria: text('i18n.selectAllAria', '__Select all items__'),
            selectRowAria: text('i18n.selectRowAria', '__Select row__'),
            /** toolbar */
            clearAllFilters: text('i18n.clearAllFilters', '__Clear all filters__'),
            columnSelectionButtonAria: text(
              'i18n.columnSelectionButtonAria',
              '__Column Selection__'
            ),
            clearFilterAria: text('i18n.clearFilterAria', '__Clear filter__'),
            filterAria: text('i18n.filterAria', '__Filter__'),
            openMenuAria: text('i18n.openMenuAria', '__Open menu__'),
            closeMenuAria: text('i18n.closeMenuAria', '__Close menu__'),
            clearSelectionAria: text('i18n.clearSelectionAria', '__Clear selection__'),
            /** empty state */
            emptyMessage: text('i18n.emptyMessage', '__There is no data__'),
            emptyMessageWithFilters: text(
              'i18n.emptyMessageWithFilters',
              '__No results match the current filters__'
            ),
            emptyButtonLabelWithFilters: text('i18n.emptyButtonLabel', '__Clear all filters__'),
            inProgressText: text('i18n.inProgressText', '__In Progress__'),
            actionFailedText: text('i18n.actionFailedText', '__Action Failed__'),
            learnMoreText: text('i18n.learnMoreText', '__Learn More__'),
            dismissText: text('i18n.dismissText', '__Dismiss__'),
            downloadIconDescription: text('downloadIconDescription', 'Download table content'),
          }}
        />
      </FullWidthWrapper>
    );
  })
  .add('full screen table card', () => {
    const data = [...Array(35)].map((id, index) => ({
      id: `row-${index}`,
      values: {
        timestamp: 1569819600000,
        deviceid: 'Campus_EGL',
        peopleCount_EnterpriseBuilding_mean: 150.5335383714,
        headCount_EnterpriseBuilding_mean: 240,
        capacity_EnterpriseBuilding_mean: 300,
        allocatedSeats_EnterpriseBuilding_mean: 240,
      },
    }));
    return (
      <FullWidthWrapper>
        {' '}
        <Dashboard
          title="Expandable card, click expand to expand table"
          cards={[
            {
              title: 'Expanded card',
              id: `expandedcard`,
              size: CARD_SIZES.LARGE,
              type: CARD_TYPES.TABLE,
              content: {
                columns: [
                  { dataSourceId: 'timestamp', label: 'Timestamp' },
                  { dataSourceId: 'Campus_EGL', label: 'Campus' },
                  { dataSourceId: 'peopleCount_EnterpriseBuilding_mean', label: 'People' },
                  { dataSourceId: 'headCount_EnterpriseBuilding_mean', label: 'Headcount' },
                  { dataSourceId: 'capacity_EnterpriseBuilding_mean', label: 'capacity' },
                ],
              },
              values: data,
            },
          ]}
        />
      </FullWidthWrapper>
    );
  })
  .add('full screen line card', () => {
    const data = getIntervalChartData('day', 7, { min: 10, max: 100 }, 100);
    return (
      <Dashboard
        title="Expandable card, click expand to expand line"
        cards={[
          {
            title: 'Expanded card',
            id: `expandedcard`,
            size: CARD_SIZES.LARGE,
            type: CARD_TYPES.TIMESERIES,
            content: {
              series: [
                { dataSourceId: 'temperature', label: 'Temperature' },
                { dataSourceId: 'pressure', label: 'Pressure' },
              ],
            },
            values: data,
          },
        ]}
      />
    );
  })
  .add('full screen image card', () => {
    const content = {
      src: imageFile,
      alt: 'Sample image',
      zoomMax: 10,
    };
    return (
      <FullWidthWrapper>
        <Dashboard
          title="Expandable card, click expand to expand image"
          cards={[
            {
              title: 'Expanded card',
              id: `expandedcard`,
              size: CARD_SIZES.LARGE,
              type: CARD_TYPES.IMAGE,
              content,
            },
          ]}
        />
      </FullWidthWrapper>
    );
  })
  .add('only value cards', () => {
    const numberThresholds = [
      { comparison: '<', value: '40', color: 'red', icon: 'close' },
      { comparison: '<', value: '70', color: 'green', icon: 'checkmark' },
      { comparison: '<', value: '80', color: 'orange', icon: 'warning' },
      { comparison: '>=', value: '90', color: 'red', icon: 'close' },
    ];
    const stringThresholds = [
      { comparison: '=', value: 'Low', color: 'green' },
      { comparison: '=', value: 'Guarded', color: 'blue' },
      { comparison: '=', value: 'Elevated', color: 'gold' },
      { comparison: '=', value: 'High', color: 'orange' },
      { comparison: '=', value: 'Severe', color: 'red' },
    ];
    const stringThresholdsWithIcons = [
      { comparison: '=', value: 'Low', color: 'green', icon: 'checkmark' },
      { comparison: '=', value: 'Elevated', color: 'gold', icon: 'warning' },
      { comparison: '=', value: 'High', color: 'orange', icon: 'warning' },
      { comparison: '=', value: 'Severe', color: 'red', icon: 'close' },
    ];
    const extraProps = {
      lastUpdated: 'Now',
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
          content: {
            attributes: [{ dataSourceId: 'v', unit: v[2] }],
          },
          values: { v: v[1] },
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
          content: {
            attributes: [
              {
                dataSourceId: 'v',
                secondaryValue:
                  idx === 2
                    ? { dataSourceId: 'v2', trend: 'up', color: 'green' }
                    : idx === 3
                    ? { dataSourceId: 'v2', trend: 'down', color: 'red' }
                    : undefined,
                label:
                  idx === 1
                    ? 'Weekly Avg'
                    : idx === 3
                    ? 'Long label that might not fit'
                    : undefined,
                unit: '˚F',
              },
            ],
          },
          values: { v, v2: '3.2' },
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
          content: {
            attributes: [{ dataSourceId: 'v', unit: '%', thresholds: numberThresholds }],
          },
          values: { v },
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
            content: {
              attributes: [{ dataSourceId: 'v', thresholds: stringThresholds }],
            },
            values: { v },
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
            content: {
              attributes: [{ dataSourceId: 'v', unit: v[2] }],
            },
            values: { v: v[1] },
          }))
          .concat(
            [65.3, 48.7, 88.1, 103.2].map((v, idx) => ({
              title: 'Temperature',
              id: `xsmallwide-number-trend-${idx}`,
              size: CARD_SIZES.XSMALLWIDE,
              type: CARD_TYPES.VALUE,
              content: {
                attributes: [
                  {
                    dataSourceId: 'v',
                    secondaryValue:
                      idx === 2
                        ? { dataSourceId: 'v2', trend: 'up', color: 'green' }
                        : idx === 3
                        ? { dataSourceId: 'v2', trend: 'down', color: 'red' }
                        : undefined,
                    label:
                      idx === 1
                        ? 'Weekly Avg'
                        : idx === 3
                        ? 'Long label that might not fit'
                        : undefined,
                    unit: '˚F',
                  },
                ],
              },
              values: { v, v2: 3.2 },
            }))
          )
          .concat(
            [38.2, 65.3, 77.7, 91].map((v, idx) => ({
              title: 'Humidity',
              id: `xsmallwide-number-threshold-${idx}`,
              size: CARD_SIZES.XSMALLWIDE,
              type: CARD_TYPES.VALUE,
              content: {
                attributes: [{ dataSourceId: 'v', unit: '%', thresholds: numberThresholds }],
              },
              values: { v },
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
                content: {
                  attributes: [{ dataSourceId: 'v', thresholds: stringThresholds }],
                },
                values: { v },
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
            1709384.1,
            'people',
            'Foot Traffic',
          ],
        ].map((v, idx) => ({
          title: v[0],
          id: `xsmallwide-multi-${idx}`,
          size: CARD_SIZES.XSMALLWIDE,
          type: CARD_TYPES.VALUE,
          content: {
            attributes: [
              {
                dataSourceId: 'v1',
                unit: v[2],
                label: v[3],
              },
              {
                dataSourceId: 'v2',
                unit: v[5],
                label: v[6],
              },
            ],
          },
          values: { v1: v[1], v2: v[4] },
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
            1709384.1,
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
          content: {
            attributes: [
              {
                dataSourceId: 'v1',
                unit: v[2],
                label: v[3],
                secondaryValue:
                  v[5] !== null
                    ? {
                        dataSourceId: 'v1trend',
                        trend: v[5],
                        color: v[6],
                      }
                    : undefined,
              },
              {
                dataSourceId: 'v2',
                unit: v[8],
                label: v[9],
                secondaryValue:
                  v[11] !== null
                    ? {
                        dataSourceId: 'v2trend',
                        trend: v[11],
                        color: v[12],
                      }
                    : undefined,
              },
            ],
          },
          values: { v1: v[1], v1trend: v[4], v2: v[7], v2trend: v[10] },
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
          content: {
            attributes: [
              { dataSourceId: 'v1', unit: v[1], label: v[2], thresholds: numberThresholds },
              { dataSourceId: 'v2', unit: v[4], label: v[5], thresholds: numberThresholds },
            ],
          },
          values: { v1: v[0], v2: v[3] },
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
          content: {
            attributes: [
              {
                dataSourceId: 'v1',
                unit: v[2],
                label: v[3],
                thresholds:
                  idx === 1 ? stringThresholds : idx === 2 ? stringThresholdsWithIcons : undefined,
                secondaryValue:
                  v[4] !== null
                    ? {
                        dataSourceId: 'v1trend',
                        trend: v[4],
                        color: v[4] === 'down' ? 'red' : 'green',
                      }
                    : undefined,
              },
              {
                dataSourceId: 'v2',
                unit: v[6],
                label: v[7],
                thresholds:
                  idx === 1 ? stringThresholds : idx === 2 ? stringThresholdsWithIcons : undefined,
                secondaryValue:
                  v[8] !== null
                    ? {
                        dataSourceId: 'v2trend',
                        trend: v[8],
                        color: v[8] === 'down' ? 'red' : 'green',
                      }
                    : undefined,
              },
              {
                dataSourceId: 'v3',
                unit: v[10],
                label: v[11],
                thresholds:
                  idx === 1 ? stringThresholds : idx === 2 ? stringThresholdsWithIcons : undefined,
                secondaryValue:
                  v[12] !== null
                    ? {
                        dataSourceId: 'v2',
                        trend: v[12],
                        color: v[12] === 'down' ? 'red' : 'green',
                      }
                    : undefined,
              },
            ],
          },
          values: {
            v1: v[1],
            v1trend: v[1] / 5,
            v2: v[5],
            v2trend: v[5] / 5,
            v3: v[9],
          },
        }))}
      />,
    ];

    return (
      <FullWidthWrapper>
        {dashboards.map((dashboard, index) => [
          <div
            style={{ width: 1056, paddingBottom: 50 }}
            key={`${dashboard.props.title}-${index}-1056`}
          >
            <h1>&quot;Largest&quot; Rendering (1056px width)</h1>
            <hr />
            {dashboard}
          </div>,
          <div
            style={{ width: 1057, paddingBottom: 50 }}
            key={`${dashboard.props.title}-${index}-1057`}
          >
            <h1>&quot;Tightest&quot; Rendering (1057px width)</h1>
            <hr />
            {dashboard}
          </div>,
        ])}
      </FullWidthWrapper>
    );
  })
  .add('with custom cards', () => {
    return (
      <FullWidthWrapper>
        <div>
          <Dashboard
            cards={[
              {
                content: (
                  <ClickableTile
                    href="https://internetofthings.ibmcloud.com"
                    style={{ height: '100%', padding: '0 0 0 0' }}
                  >
                    <div style={{ padding: '12px' }}>
                      <h4>View Dashboards</h4>
                      <br />
                      <p>View pinned dashboards to keep track of your world in IoT.</p>
                      <div
                        style={{
                          textAlign: 'right',
                          position: 'absolute',
                          bottom: '0',
                          width: '100%',
                          padding: '0 36px 16px 0',
                        }}
                      >
                        <img
                          style={{ width: '50%' }}
                          src={iconViewDashboards}
                          alt="View Dashboards"
                        />
                      </div>
                    </div>
                  </ClickableTile>
                ),
                id: 'viewDashboards',
                size: 'SMALL',
                type: 'CUSTOM',
              },
              {
                content: (
                  <ClickableTile
                    href="https://internetofthings.ibmcloud.com"
                    style={{ height: '100%', padding: '0 0 0 0' }}
                  >
                    <div style={{ padding: '12px' }}>
                      <h4>Connect Devices</h4>
                      <br />
                      <p>
                        Connect devices and collect data by using the Watson IoT Platform Service.
                      </p>
                      <div
                        style={{
                          textAlign: 'right',
                          position: 'absolute',
                          bottom: '0',
                          width: '100%',
                          padding: '0 36px 16px 0',
                        }}
                      >
                        <img
                          style={{ width: '50%' }}
                          src={iconConnectDevices}
                          alt="Connect Devices"
                        />
                      </div>
                    </div>
                  </ClickableTile>
                ),
                id: 'connectDevices',
                size: 'SMALL',
                type: 'CUSTOM',
              },
              {
                content: (
                  <div style={{ padding: '12px' }}>
                    <h4>Monitor Entities</h4>
                    <br />
                    <p>Expore your entities and analyze their associated data.</p>
                    <div
                      style={{
                        textAlign: 'right',
                        position: 'absolute',
                        bottom: '0',
                        width: '100%',
                        padding: '0 36px 16px 0',
                      }}
                    >
                      <img
                        style={{ width: '50%' }}
                        src={iconMonitorEntities}
                        alt="Monitor Entities"
                      />
                    </div>
                  </div>
                ),
                id: 'monitorEntities',
                size: 'SMALL',
                type: 'CUSTOM',
              },
              {
                content: (
                  <div style={{ padding: '12px' }}>
                    <h4>Track Usage</h4>
                    <br />
                    <div
                      style={{
                        textAlign: 'right',
                        position: 'absolute',
                        bottom: '0',
                        width: '100%',
                        padding: '0 36px 16px 0',
                      }}
                    >
                      <Application32 aria-label="Track Usage" />
                    </div>
                  </div>
                ),
                id: 'trackUsage',
                size: 'XSMALLWIDE',
                type: 'CUSTOM',
              },
              {
                content: (
                  <div style={{ padding: '12px' }}>
                    <h4>Administer Users</h4>
                    <br />
                    <div
                      style={{
                        textAlign: 'right',
                        position: 'absolute',
                        bottom: '0',
                        width: '100%',
                        padding: '0 36px 16px 0',
                      }}
                    >
                      <Group32 aria-label="Track Usage" />
                    </div>
                  </div>
                ),
                id: 'administerUsers',
                size: 'XSMALLWIDE',
                type: 'CUSTOM',
              },
              {
                content: {
                  data: [
                    {
                      id: 'row-9',
                      value: 'Explore entity metrics in the data lake',
                      link:
                        'https://www.ibm.com/support/knowledgecenter/SSQP8H/iot/guides/micro-explore.html',
                      rightContent: (
                        <span>
                          View your device data in the entity view of the main Watson IoT Platform
                          dashboard. If your plan includes Watson IoT Platform Analytics, the data
                          is stored in the data lake for later retrieval and processing.
                        </span>
                      ),
                    },
                    {
                      id: 'row-10',
                      value: 'Perform simple calculations on your entity metrics',
                      link:
                        'https://www.ibm.com/support/knowledgecenter/SSQP8H/iot/guides/micro-calculate.html',
                      rightContent: (
                        <span>
                          Process your entity metrics by running simple or complex calculations to
                          create calculated metrics.
                        </span>
                      ),
                    },
                    {
                      id: 'row-11',
                      value: 'View entity metrics in a monitoring dashboard',
                      link:
                        'https://www.ibm.com/support/knowledgecenter/SSQP8H/iot/guides/micro-monitor.html',
                      rightContent: (
                        <span>
                          Visualize your entity metrics in monitoring dashboards to get an overview
                          of your data.
                        </span>
                      ),
                    },
                  ],
                  loadData: () => {},
                },
                id: 'tutorials',
                size: 'WIDE',
                title: 'Tutorials',
                type: 'LIST',
              },
              {
                content: {
                  data: [
                    {
                      id: 'row-9',
                      value:
                        'Notice - IBM Watson IoT Platform support for IBM Cloud resource groups',
                      link: 'https://internetofthings.ibmcloud.com',
                    },
                    {
                      id: 'row-10',
                      value: 'New Connectivity Status API now available on IBM Watson IoT Platform',
                      link: 'https://internetofthings.ibmcloud.com',
                    },
                    {
                      id: 'row-11',
                      value: 'Advanced Notice - Sunset of SPAPI support',
                      link: 'https://internetofthings.ibmcloud.com',
                    },
                    {
                      id: 'row-12',
                      value:
                        'Advanced Notice - Withdrawal of RTI features from Watson IoT Platform',
                      link: 'https://internetofthings.ibmcloud.com',
                    },
                  ],
                  loadData: () => {},
                },
                id: 'announcements',
                size: 'WIDE',
                title: 'Announcements',
                type: 'LIST',
              },
            ]}
            hasLastUpdated={false}
          />
        </div>
      </FullWidthWrapper>
    );
  });
