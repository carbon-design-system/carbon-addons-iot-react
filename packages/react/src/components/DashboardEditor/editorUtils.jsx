import React from 'react';
import uuid from 'uuid';
import isNil from 'lodash/isNil';
import omit from 'lodash/omit';

import {
  CARD_SIZES,
  CARD_TYPES,
  BAR_CHART_TYPES,
  BAR_CHART_LAYOUTS,
  DASHBOARD_EDITOR_CARD_TYPES,
} from '../../constants/LayoutConstants';
import {
  Card,
  ValueCard,
  TimeSeriesCard,
  BarChartCard,
  ImageCard,
  TableCard,
  ListCard,
} from '../../index';
import { ImageIcon } from '../../icons/components';

/**
 * Returns a duplicate card configuration
 * @param {Object} cardConfig, card JSON configuration
 * @returns {Object} duplicated card JSON
 */
export const getDuplicateCard = (cardConfig) => ({
  ...cardConfig,
  id: uuid.v4(),
});

/**
 * Returns a default card configuration
 * @param {string} type, card type
 * @returns {Object} default card JSON
 */
export const getDefaultCard = (type, i18n) => {
  const defaultSizeForType = {
    [DASHBOARD_EDITOR_CARD_TYPES.VALUE]: CARD_SIZES.SMALLWIDE,
    [DASHBOARD_EDITOR_CARD_TYPES.SIMPLE_BAR]: CARD_SIZES.MEDIUMWIDE,
    [DASHBOARD_EDITOR_CARD_TYPES.GROUPED_BAR]: CARD_SIZES.MEDIUMWIDE,
    [DASHBOARD_EDITOR_CARD_TYPES.STACKED_BAR]: CARD_SIZES.MEDIUMWIDE,
    [DASHBOARD_EDITOR_CARD_TYPES.TIMESERIES]: CARD_SIZES.MEDIUMWIDE,
    [DASHBOARD_EDITOR_CARD_TYPES.IMAGE]: CARD_SIZES.MEDIUMWIDE,
    [DASHBOARD_EDITOR_CARD_TYPES.TABLE]: CARD_SIZES.LARGE,
  };

  const baseCardProps = {
    id: uuid.v4(),
    title: i18n.defaultCardTitle,
    size: defaultSizeForType[type] ?? CARD_SIZES.MEDIUM,
    ...(type.includes(CARD_TYPES.BAR) ? { type: CARD_TYPES.BAR } : { type }),
  };

  switch (type) {
    case DASHBOARD_EDITOR_CARD_TYPES.VALUE:
      return {
        ...baseCardProps,
        content: {
          attributes: [],
        },
        i18n,
      };
    case DASHBOARD_EDITOR_CARD_TYPES.TIMESERIES:
      return {
        ...baseCardProps,
        content: {
          series: [],
          xLabel: 'Time',
          yLabel: 'Temperature',
          unit: '˚F',
          includeZeroOnXaxis: true,
          includeZeroOnYaxis: true,
          timeDataSourceId: 'timestamp',
        },
        interval: 'day',
        showLegend: true,
      };
    case DASHBOARD_EDITOR_CARD_TYPES.SIMPLE_BAR:
      return {
        ...baseCardProps,
        content: {
          type: BAR_CHART_TYPES.SIMPLE,
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          series: [],
        },
        i18n,
      };
    case DASHBOARD_EDITOR_CARD_TYPES.GROUPED_BAR:
      return {
        ...baseCardProps,
        content: {
          type: BAR_CHART_TYPES.GROUPED,
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          series: [],
        },
        i18n,
      };
    case DASHBOARD_EDITOR_CARD_TYPES.STACKED_BAR:
      return {
        ...baseCardProps,
        content: {
          type: BAR_CHART_TYPES.STACKED,
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          series: [],
        },
        i18n,
      };
    case DASHBOARD_EDITOR_CARD_TYPES.TABLE:
      return {
        ...baseCardProps,
        content: {
          columns: [
            {
              dataSourceId: 'undefined',
              label: '--',
            },
            {
              dataSourceId: 'undefined2',
              label: '--',
            },
          ],
        },
        i18n,
      };
    case DASHBOARD_EDITOR_CARD_TYPES.IMAGE:
      return {
        ...baseCardProps,
        content: {
          alt: 'Sample image',
          src: ImageIcon,
          hideMinimap: true,
          hideHotspots: false,
          hideZoomControls: false,
        },
        i18n,
      };

    default:
      return { ...baseCardProps, i18n };
  }
};

/**
 * maps a selected time range to what is expected in the dashboardJSON
 */
export const timeRangeToJSON = {
  last24Hours: {
    range: { interval: 'day', count: -1, type: 'rolling' },
    interval: 'hour',
  },
  last7Days: {
    range: { interval: 'week', count: -1, type: 'rolling' },
    interval: 'day',
  },
  lastMonth: {
    range: { interval: 'month', count: -1, type: 'rolling' },
    interval: 'week',
  },
  lastQuarter: {
    range: {
      interval: 'quarter',
      count: -1,
      type: 'rolling',
    },
    interval: 'month',
  },
  lastYear: {
    range: {
      interval: 'year',
      count: -1,
      type: 'rolling',
    },
    interval: 'month',
  },
  thisWeek: {
    range: {
      interval: 'week',
      count: -1,
      type: 'periodToDate',
    },
    interval: 'day',
  },
  thisMonth: {
    range: {
      interval: 'month',
      count: -1,
      type: 'periodToDate',
    },
    interval: 'week',
  },
  thisQuarter: {
    range: {
      interval: 'quarter',
      count: -1,
      type: 'periodToDate',
    },
    interval: 'month',
  },
  thisYear: {
    range: {
      interval: 'year',
      count: -1,
      type: 'periodToDate',
    },
    interval: 'month',
  },
};

/**
 * determines if a card JSON is valid depending on its card type
 * @param {Object} cardConfig
 * @returns {Boolean}
 */
export const isCardJsonValid = (cardConfig) => {
  switch (cardConfig.type) {
    case CARD_TYPES.VALUE:
      return !isNil(cardConfig?.content?.attributes);
    case CARD_TYPES.TIMESERIES:
      return !isNil(cardConfig?.content);
    case CARD_TYPES.BAR:
      return !isNil(cardConfig?.content);
    case CARD_TYPES.TABLE:
      return !isNil(cardConfig?.content);
    default:
      return true;
  }
};

/**
 * Renders a card and lists the JSON within
 * @param {Object} cardConfig
 * @param {Object} commonProps
 * @returns {Node}
 */
const renderDefaultCard = (cardConfig, commonProps) => (
  <Card isEditable {...cardConfig} {...commonProps}>
    <div style={{ padding: '1rem' }}>{JSON.stringify(cardConfig, null, 4)}</div>
  </Card>
);

/**
 * @param {Object} cardConfig
 * @param {Object} commonProps
 * @returns {Node}
 */
const renderValueCard = (cardConfig, commonProps) => (
  <ValueCard isEditable {...cardConfig} {...commonProps} />
);

/**
 * @param {Object} cardConfig
 * @param {Object} commonProps
 * @returns {Node}
 */
const renderTimeSeriesCard = (cardConfig, commonProps) => (
  <TimeSeriesCard
    isEditable
    values={[]}
    showLegend
    timeRange={cardConfig?.dataSource?.range}
    {...cardConfig}
    {...commonProps}
  />
);

/**
 * @param {Object} cardConfig
 * @param {Object} commonProps
 * @returns {Node}
 */
const renderBarChartCard = (cardConfig, commonProps) => (
  <BarChartCard isEditable {...cardConfig} {...commonProps} />
);

/**
 * @param {Object} cardConfig
 * @param {Object} commonProps
 * @returns {Node}
 */
const renderTableCard = (cardConfig, commonProps) => (
  <TableCard isEditable {...cardConfig} {...commonProps} />
);

/**
 * @param {Object} cardConfig
 * @param {Object} commonProps
 * @returns {Node}
 */
const renderImageCard = (cardConfig, commonProps) => (
  <ImageCard isEditable {...cardConfig} {...commonProps} />
);

/**
 * @param {Object} cardConfig
 * @param {Object} commonProps
 * @returns {Node}
 */
const renderListCard = (cardConfig, commonProps) => (
  <ListCard isEditable {...cardConfig} {...commonProps} />
);

/**
 * @param {Object} cardConfig
 * @param {Object} commonProps
 * @returns {Node}
 */
const renderCustomCard = (cardConfig, commonProps) => {
  return (
    <Card
      hideHeader={isNil(cardConfig.title)}
      // need to omit the content because its getting passed content to be rendered, which should not
      // get attached to the card wrapper
      {...omit(cardConfig, 'content')}
      {...commonProps}
    >
      {
        // If content is a function, this is a react component
        typeof cardConfig.content === 'function' ? <cardConfig.content /> : cardConfig.content
      }
    </Card>
  );
};

/**
 * Selects the card if the key is 'enter' or 'space'
 * @param {Event} evt
 * @param {Function} onSelectCard
 * @param {string} id
 */
export const handleKeyDown = (evt, onSelectCard, id) => {
  if (evt.key === 'Enter' || evt.key === 'Space') {
    onSelectCard(id);
  }
};

/**
 * Selects the card
 * @param {Function} onSelectCard
 * @param {string} id
 */
export const handleOnClick = (onSelectCard, id) => {
  onSelectCard(id);
};

/**
 * Returns a Card component for preview in the dashboard
 * @param {Object} cardConfig, the JSON configuration of the card
 * @param {Object} commonProps basic card config props
 * @returns {Node}
 */
export const getCardPreview = (cardConfig, commonProps) => {
  if (!isCardJsonValid(cardConfig)) {
    return renderDefaultCard(cardConfig, commonProps);
  }

  switch (cardConfig.type) {
    case CARD_TYPES.VALUE:
      return renderValueCard(cardConfig, commonProps);
    case CARD_TYPES.TIMESERIES:
      return renderTimeSeriesCard(cardConfig, commonProps);
    case CARD_TYPES.BAR:
      return renderBarChartCard(cardConfig, commonProps);
    case CARD_TYPES.TABLE:
      return renderTableCard(cardConfig, commonProps);
    case CARD_TYPES.IMAGE:
      return renderImageCard(cardConfig, commonProps);
    case CARD_TYPES.LIST:
      return renderListCard(cardConfig, commonProps);
    case CARD_TYPES.CUSTOM:
      return renderCustomCard(cardConfig, commonProps);
    default:
      return renderDefaultCard(cardConfig, commonProps);
  }
};
