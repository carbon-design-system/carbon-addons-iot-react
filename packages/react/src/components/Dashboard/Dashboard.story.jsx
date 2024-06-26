import React from 'react';
import { text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { Application, Group } from '@carbon/react/icons';
import { spacing05, spacing04, spacing09 } from '@carbon/layout';
import { gray20, red60, green50, yellow } from '@carbon/colors';
import { ClickableTile } from '@carbon/react';

import StoryNotice, { deprecatedStoryTitle } from '../../internal/StoryNotice';
import FullWidthWrapper from '../../internal/FullWidthWrapper';
import { getIntervalChartData, tableColumns, tableData } from '../../utils/sample';
import {
  CARD_SIZES,
  CARD_TYPES,
  BAR_CHART_TYPES,
  BAR_CHART_LAYOUTS,
} from '../../constants/LayoutConstants';
import imageFile from '../ImageCard/landscape.jpg';
import { DashboardIcon, DataScientistIcon, ComputerChipIcon } from '../../icons/components';

import Dashboard from './Dashboard';

export const originalCards = [
  {
    title:
      'Facility Metrics with a very long title that should be truncated and have a tooltip for the full text ',
    id: 'facilitycard',
    size: CARD_SIZES.MEDIUM,
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
    title: 'Bar chart',
    id: 'barchartcard',
    size: CARD_SIZES.MEDIUMWIDE,
    type: CARD_TYPES.BAR,
    content: {
      type: BAR_CHART_TYPES.SIMPLE,
      categoryDataSourceId: 'city',
      layout: BAR_CHART_TYPES.VERTICAL,
      series: [
        {
          color: ['blue', 'red', 'green', 'yellow'],
          dataSourceId: 'particles',
        },
      ],
      xLabel: 'Cities',
      yLabel: 'Particles',
    },
    values: [
      {
        city: 'Amsterdam',
        emissions: 120,
        particles: 447,
        quarter: '2020-Q1',
        temperature: 44,
      },
      {
        city: 'New York',
        emissions: 130,
        particles: 528,
        quarter: '2020-Q1',
        temperature: 11,
      },
      {
        city: 'Bangkok',
        emissions: 30,
        particles: 435,
        quarter: '2020-Q1',
        temperature: 32,
      },
      {
        city: 'San Francisco',
        emissions: 312,
        particles: 388,
        quarter: '2020-Q1',
        temperature: 120,
      },
    ],
  },
  {
    title: 'Humidity',
    id: 'facilitycard-xs',
    size: CARD_SIZES.SMALL,
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
    title: 'Show tooltip when the card title has ellipsis ',
    id: 'facilitycard-tooltip',
    size: CARD_SIZES.SMALL,
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
    id: 'section-card',
    size: CARD_SIZES.SMALLWIDE,
    type: CARD_TYPES.CUSTOM,
    availableActions: {
      delete: true,
    },
    content: <h2 style={{ padding: spacing05 }}>Section Header</h2>,
  },
  {
    title: 'Utilization',
    id: 'facilitycard-xs2',
    size: CARD_SIZES.SMALL,
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
    size: CARD_SIZES.SMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: {
      attributes: [
        {
          label: 'weekly',
          dataSourceId: 'alertCount',
          secondaryValue: {
            dataSourceId: 'alertCountTrend',
            trend: 'up',
            color: 'green',
          },
        },
      ],
    },
    values: { alertCount: 35, alertCountTrend: 13 },
  },
  {
    title: 'Comfort Level',
    id: 'facilitycard-comfort-level',
    size: CARD_SIZES.SMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: {
      attributes: [
        {
          dataSourceId: 'comfortLevel',
          thresholds: [
            {
              comparison: '=',
              value: 'Good',
              icon: 'checkmark',
              color: 'green',
            },
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
    size: CARD_SIZES.SMALL,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: {
      attributes: [
        {
          title: 'weekly',
          dataSourceId: 'footTraffic',
          secondaryValue: {
            dataSourceId: 'footTrafficTrend',
            trend: 'down',
            color: 'red',
          },
        },
      ],
    },
    values: { footTraffic: 13572, footTrafficTrend: '22%' },
  },
  {
    tooltip: <p>Health - of floor 8</p>,
    id: 'GaugeCard',
    title: 'Health',
    size: CARD_SIZES.SMALL,
    type: CARD_TYPES.GAUGE,
    values: {
      usage: 73,
      usageTrend: '5%',
    },
    content: {
      gauges: [
        {
          dataSourceId: 'usage',
          units: '%',
          minimumValue: 0,
          maximumValue: 100,
          color: 'orange',
          backgroundColor: gray20,
          shape: 'circle',
          trend: {
            dataSourceId: 'usageTrend',
            trend: 'up',
          },
          thresholds: [
            {
              comparison: '>',
              value: 0,
              color: red60, // red
              label: 'Poor',
            },
            {
              comparison: '>',
              value: 60,
              color: yellow, // yellow
              label: 'Fair',
            },
            {
              comparison: '>',
              value: 80,
              color: green50, // green
              label: 'Good',
            },
          ],
        },
      ],
    },
  },
  {
    title: 'Health',
    id: 'facilitycard-health',
    size: CARD_SIZES.SMALLWIDE,
    type: CARD_TYPES.VALUE,
    availableActions: {
      delete: true,
    },
    content: {
      attributes: [
        {
          dataSourceId: 'health',
          thresholds: [
            {
              comparison: '=',
              value: 'Healthy',
              icon: 'checkmark',
              color: 'green',
            },
            {
              comparison: '=',
              value: 'Unhealthy',
              icon: 'close',
              color: 'red',
            },
          ],
        },
      ],
    },
    values: { health: 'Healthy' },
  },
  {
    title:
      'Temperature with a very long title that should be truncated and have a tooltip for the full text ',
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
          content: <span style={{ padding: spacing04 }}>Elevators</span>,
        },
        {
          x: 45,
          y: 25,
          color: '#0f0',
          content: <span style={{ padding: spacing04 }}>Stairs</span>,
        },
        {
          x: 45,
          y: 50,
          color: '#00f',
          content: <span style={{ padding: spacing04 }}>Vent Fan</span>,
        },
        {
          x: 45,
          y: 75,
          icon: 'arrowUp',
          content: <span style={{ padding: spacing04 }}>Humidity Sensor</span>,
        },
      ],
    },
  },
];

const getCommonDashboardProps = () => ({
  title: text('title', 'Munich Building'),
  cards: originalCards,
  lastUpdated: new Date('2019-10-22T00:00:00').toUTCString(),
  isEditable: boolean('isEditable', false),
  isLoading: boolean('isLoading', false),
  onBreakpointChange: action('onBreakpointChange'),
  onLayoutChange: action('onLayoutChange'),
  onSetRefresh: action('onSetRefresh'),
  setIsLoading: action('setIsLoading'),
  onFetchData: (card) => {
    return new Promise((resolve) => setTimeout(() => resolve(card), 5000));
  },
});

export default {
  title: '1 - Watson IoT/Deprecated/🚫 Dashboard',
  excludeStories: ['originalCards'],
};

export const Deprecated = () => <StoryNotice componentName="Dashboard" />;
Deprecated.storyName = deprecatedStoryTitle;

export const BasicDashboard = () => {
  return (
    <FullWidthWrapper>
      <Dashboard {...getCommonDashboardProps()} isLoading={boolean('isLoading', false)} />
    </FullWidthWrapper>
  );
};

BasicDashboard.storyName = 'basic dashboard';

BasicDashboard.parameters = {
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
};

export const BasicWithoutLastUpdatedHeader = () => {
  return (
    <FullWidthWrapper>
      <Dashboard {...getCommonDashboardProps()} hasLastUpdated={false} />
    </FullWidthWrapper>
  );
};

BasicWithoutLastUpdatedHeader.storyName = 'basic - without last updated header';

export const CustomActions = () => {
  return (
    <FullWidthWrapper>
      <Dashboard
        {...getCommonDashboardProps()}
        actions={[{ id: 'edit', labelText: 'Edit', icon: 'edit' }]}
        onDashboardAction={action('onDashboardAction')}
      />
    </FullWidthWrapper>
  );
};

CustomActions.storyName = 'custom actions';

export const Sidebar = () => {
  return (
    <FullWidthWrapper>
      <Dashboard
        {...getCommonDashboardProps()}
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
};

Sidebar.storyName = 'sidebar';

export const I18NLabels = () => {
  return (
    <FullWidthWrapper>
      <Dashboard
        {...getCommonDashboardProps()}
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
          defaultLabel: text('default', 'Default'),
          weeklyLabel: text('weeklyLabel', 'Weekly'),
          monthlyLabel: text('monthlyLabel', 'Monthly'),
          overflowMenuDescription: text(
            'overflowMenuDescription',
            'open and close list of options'
          ),
          // card actions
          expandLabel: text('expandLabel', 'Expand to fullscreen'),
          closeLabel: text('closeLabel', 'Close'),
          editCardLabel: text('editCardLabel', 'Edit card'),
          cloneCardLabel: text('cloneCardLabel', 'Clone card'),
          deleteCardLabel: text('deleteCardLabel', 'Delete card'),
          selectTimeRangeLabel: text('selectTimeRangeLabel', 'Select time range'),
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
          currentPage: (page) => `__page ${page}__`,
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
          columnSelectionButtonAria: text('i18n.columnSelectionButtonAria', '__Column Selection__'),
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
};

I18NLabels.storyName = 'i18n labels';

export const FullScreenTableCard = () => {
  const data = [...Array(35)].map((id, index) => ({
    id: `row-${index}`,
    values: {
      timestamp: 1569819600000,
      campus: 'Campus_EGL',
      peopleCount_EnterpriseBuilding_mean: 150.5335383714,
      headCount_EnterpriseBuilding_mean: 240,
      capacity_EnterpriseBuilding_mean: 300,
      allocatedSeats_EnterpriseBuilding_mean: 240,
    },
  }));
  return (
    <FullWidthWrapper>
      <Dashboard
        title="Expandable card, click expand to expand table"
        cards={[
          {
            title: 'Expanded card',
            id: `expandedcard`,
            size: CARD_SIZES.LARGEWIDE,
            type: CARD_TYPES.TABLE,
            content: {
              columns: [
                { dataSourceId: 'timestamp', label: 'Timestamp', type: 'TIMESTAMP' },
                { dataSourceId: 'Campus_EGL', label: 'Campus' },
                {
                  dataSourceId: 'peopleCount_EnterpriseBuilding_mean',
                  label: 'People',
                },
                {
                  dataSourceId: 'headCount_EnterpriseBuilding_mean',
                  label: 'Headcount',
                },
                {
                  dataSourceId: 'capacity_EnterpriseBuilding_mean',
                  label: 'capacity',
                },
              ],
            },
            values: data,
          },
        ]}
      />
    </FullWidthWrapper>
  );
};

FullScreenTableCard.storyName = 'full screen table card';

export const FullScreenLineCard = () => {
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
};

FullScreenLineCard.storyName = 'full screen line card';

export const LineCardWithNoOptions = () => {
  const data = getIntervalChartData('day', 7, { min: 10, max: 100 }, 100);
  return (
    <Dashboard
      title="No options card, no range or expand options"
      cards={[
        {
          title: 'No options card',
          id: `nooptionscard`,
          availableActions: {
            range: false,
            expand: false,
          },
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
};

LineCardWithNoOptions.storyName = 'line card with no options';

export const FullScreenBarChartCard = () => {
  const data = getIntervalChartData('day', 7, { min: 10, max: 100 }, 100);
  return (
    <Dashboard
      title="Expandable card, click expand to expand line"
      cards={[
        {
          title: 'Expanded card',
          id: `expandedcard`,
          size: CARD_SIZES.LARGE,
          type: CARD_TYPES.BAR,
          content: {
            series: [
              {
                dataSourceId: 'temperature',
                label: 'Temperature Device 1',
              },
              {
                dataSourceId: 'temperature',
                label: 'Temperature Device 2',
              },
            ],
            type: BAR_CHART_TYPES.GROUPED,
            layout: BAR_CHART_LAYOUTS.VERTICAL,
            categoryDataSourceId: 'ENTITY_ID',
          },
          values: data.reduce((acc, dataPoint) => {
            acc.push(dataPoint);
            acc.push({
              ...dataPoint,
              temperature: dataPoint.temperature / 2,
              ENTITY_ID: 'Sensor2-2',
            });
            return acc;
          }, []),
        },
      ]}
    />
  );
};

FullScreenBarChartCard.storyName = 'full screen bar chart card';

export const FullScreenImageCard = () => {
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
};

FullScreenImageCard.storyName = 'full screen image card';

export const OnlyValueCards = () => {
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
        size: CARD_SIZES.SMALL,
        type: CARD_TYPES.VALUE,
        content: {
          attributes: [{ dataSourceId: 'v', unit: v[2] }],
        },
        values: { v: v[1] },
        dataState:
          idx === 5
            ? {
                type: 'NO_DATA',
                label: 'No data available for this score at this time',
                description: 'The last successful score was 68',
              }
            : undefined,
      }))}
    />,
    <Dashboard
      title="Single value / xsmall / trend and label"
      {...extraProps}
      cards={[65.3, 48.7, 88.1, 103.2].map((v, idx) => ({
        title: 'Temperature',
        id: `xsmall-number-${idx}`,
        size: CARD_SIZES.SMALL,
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
                idx === 1 ? 'Weekly Avg' : idx === 3 ? 'Long label that might not fit' : undefined,
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
        size: CARD_SIZES.SMALL,
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
        .map((i) => i.value)
        .map((v, idx) => ({
          title: 'Danger Level',
          id: `xsmall-string-threshold-${idx}`,
          size: CARD_SIZES.SMALL,
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
          size: CARD_SIZES.SMALLWIDE,
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
            size: CARD_SIZES.SMALLWIDE,
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
            size: CARD_SIZES.SMALLWIDE,
            type: CARD_TYPES.VALUE,
            content: {
              attributes: [
                {
                  dataSourceId: 'v',
                  unit: '%',
                  thresholds: numberThresholds,
                },
              ],
            },
            values: { v },
          }))
        )
        .concat(
          stringThresholds
            .map((i) => i.value)
            .map((v, idx) => ({
              title: 'Danger Level',
              id: `xsmallwide-string-threshold-${idx}`,
              size: CARD_SIZES.SMALLWIDE,
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
        size: CARD_SIZES.SMALLWIDE,
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
        size: CARD_SIZES.SMALLWIDE,
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
        size: CARD_SIZES.SMALLWIDE,
        type: CARD_TYPES.VALUE,
        content: {
          attributes: [
            {
              dataSourceId: 'v1',
              unit: v[1],
              label: v[2],
              thresholds: numberThresholds,
            },
            {
              dataSourceId: 'v2',
              unit: v[4],
              label: v[5],
              thresholds: numberThresholds,
            },
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
        size: CARD_SIZES.MEDIUM,
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
          style={{ width: 1056, paddingBottom: spacing09 }}
          key={`${dashboard.props.title}-${index}-1056`}
        >
          <h1>&quot;Largest&quot; Rendering (1056px width)</h1>
          <hr />
          {dashboard}
        </div>,
        <div
          style={{ width: 1057, paddingBottom: spacing09 }}
          key={`${dashboard.props.title}-${index}-1057`}
        >
          <h1>&quot;Tightest&quot; Rendering (1057px width)</h1>
          <hr />
          {dashboard}
        </div>,
      ])}
    </FullWidthWrapper>
  );
};

OnlyValueCards.storyName = 'only value cards';

export const WithCustomCards = () => {
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
                  <div style={{ padding: spacing04 }}>
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
                      <DashboardIcon width="50%" />
                    </div>
                  </div>
                </ClickableTile>
              ),
              id: 'viewDashboards',
              size: CARD_SIZES.MEDIUM,
              type: 'CUSTOM',
            },
            {
              content: (
                <ClickableTile
                  href="https://internetofthings.ibmcloud.com"
                  style={{ height: '100%', padding: '0 0 0 0' }}
                >
                  <div style={{ padding: spacing04 }}>
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
                      <ComputerChipIcon width="50%" />
                    </div>
                  </div>
                </ClickableTile>
              ),
              id: 'connectDevices',
              size: CARD_SIZES.MEDIUM,
              type: 'CUSTOM',
            },
            {
              content: (
                <div style={{ padding: spacing04 }}>
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
                    <DataScientistIcon width="50%" />
                  </div>
                </div>
              ),
              id: 'monitorEntities',
              size: CARD_SIZES.MEDIUM,
              type: 'CUSTOM',
            },
            {
              content: (
                <div style={{ padding: spacing04 }}>
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
                    <Application size={32} aria-label="Track Usage" />
                  </div>
                </div>
              ),
              id: 'trackUsage',
              size: CARD_SIZES.SMALLWIDE,
              type: 'CUSTOM',
            },
            {
              content: (
                <div style={{ padding: spacing04 }}>
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
                    <Group size={32} aria-label="Track Usage" />
                  </div>
                </div>
              ),
              id: 'administerUsers',
              size: CARD_SIZES.SMALLWIDE,
              type: 'CUSTOM',
            },
            {
              content: {
                data: [
                  {
                    id: 'row-9',
                    value: 'Explore entity metrics in the data lake',
                    link: 'https://www.ibm.com/support/knowledgecenter/SSQP8H/iot/guides/micro-explore.html',
                    extraContent: (
                      <span>
                        View your device data in the entity view of the main Watson IoT Platform
                        dashboard. If your plan includes Watson IoT Platform Analytics, the data is
                        stored in the data lake for later retrieval and processing.
                      </span>
                    ),
                  },
                  {
                    id: 'row-10',
                    value: 'Perform simple calculations on your entity metrics',
                    link: 'https://www.ibm.com/support/knowledgecenter/SSQP8H/iot/guides/micro-calculate.html',
                    extraContent: (
                      <span>
                        Process your entity metrics by running simple or complex calculations to
                        create calculated metrics.
                      </span>
                    ),
                  },
                  {
                    id: 'row-11',
                    value: 'View entity metrics in a monitoring dashboard',
                    link: 'https://www.ibm.com/support/knowledgecenter/SSQP8H/iot/guides/micro-monitor.html',
                    extraContent: (
                      <span>
                        Visualize your entity metrics in monitoring dashboards to get an overview of
                        your data.
                      </span>
                    ),
                  },
                ],
                loadData: () => {},
              },
              id: 'tutorials',
              size: CARD_SIZES.MEDIUMWIDE,
              title: 'Tutorials',
              type: 'LIST',
            },
            {
              content: {
                data: [
                  {
                    id: 'row-9',
                    value: 'Notice - IBM Watson IoT Platform support for IBM Cloud resource groups',
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
                    value: 'Advanced Notice - Withdrawal of RTI features from Watson IoT Platform',
                    link: 'https://internetofthings.ibmcloud.com',
                  },
                ],
                loadData: () => {},
              },
              id: 'announcements',
              size: CARD_SIZES.MEDIUMWIDE,
              title: 'Announcements',
              type: 'LIST',
            },
          ]}
          hasLastUpdated={false}
        />
      </div>
    </FullWidthWrapper>
  );
};

WithCustomCards.storyName = 'with custom cards';
