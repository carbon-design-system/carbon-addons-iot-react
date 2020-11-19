import React from 'react';
import uuid from 'uuid';
import isNil from 'lodash/isNil';
import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import {
  purple70,
  cyan50,
  teal70,
  magenta70,
  red60,
  red50,
  orange40,
  green60,
  blue80,
  blue60,
  red90,
  green50,
  yellow30,
  magenta50,
  purple50,
  teal50,
  cyan90,
} from '@carbon/colors';
import {
  Checkmark24,
  CheckmarkFilled24,
  CheckmarkOutline24,
  Error24,
  ErrorFilled24,
  ErrorOutline24,
  Help24,
  HelpFilled24,
  Information24,
  InformationFilled24,
  Misuse24,
  MisuseOutline24,
  Undefined24,
  UndefinedFilled24,
  Unknown24,
  UnknownFilled24,
  Warning24,
  WarningAlt24,
  WarningAltFilled24,
  WarningAltInverted24,
  WarningAltInvertedFilled24,
  WarningFilled24,
  WarningSquare24,
  WarningSquareFilled24,
} from '@carbon/icons-react';

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
      };
    case DASHBOARD_EDITOR_CARD_TYPES.GROUPED_BAR:
      return {
        ...baseCardProps,
        content: {
          type: BAR_CHART_TYPES.GROUPED,
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          series: [],
        },
      };
    case DASHBOARD_EDITOR_CARD_TYPES.STACKED_BAR:
      return {
        ...baseCardProps,
        content: {
          type: BAR_CHART_TYPES.STACKED,
          layout: BAR_CHART_LAYOUTS.VERTICAL,
          series: [],
        },
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
      };
    case DASHBOARD_EDITOR_CARD_TYPES.IMAGE:
      return {
        ...baseCardProps,
        content: {
          hideMinimap: true,
          hideHotspots: false,
          hideZoomControls: false,
        },
      };

    default:
      return { ...baseCardProps };
  }
};

/**
 * Color options for dataItems
 */
export const DATAITEM_COLORS_OPTIONS = [
  purple70,
  cyan50,
  teal70,
  magenta70,
  red50,
  red90,
  green60,
  blue80,
  magenta50,
  purple50,
  teal50,
  cyan90,
];

/**
 * maps a selected time range to what is expected in the dashboardJSON
 */
export const timeRangeToJSON = {
  lastHour: { interval: 'hour', count: -1, type: 'rolling' },
  last2Hours: { interval: 'hour', count: -2, type: 'rolling' },
  last4Hours: { interval: 'hour', count: -4, type: 'rolling' },
  last8Hours: { interval: 'hour', count: -8, type: 'rolling' },
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

export const validThresholdIcons = [
  { carbonIcon: <Checkmark24 />, name: 'Checkmark' },
  { carbonIcon: <CheckmarkFilled24 />, name: 'Checkmark filled' },
  { carbonIcon: <CheckmarkOutline24 />, name: 'Checkmark outline' },
  { carbonIcon: <Error24 />, name: 'Error' },
  { carbonIcon: <ErrorFilled24 />, name: 'Error filled' },
  { carbonIcon: <ErrorOutline24 />, name: 'Error outline' },
  { carbonIcon: <Help24 />, name: 'Help' },
  { carbonIcon: <HelpFilled24 />, name: 'Help filled' },
  { carbonIcon: <Information24 />, name: 'Information' },
  { carbonIcon: <InformationFilled24 />, name: 'Information filled' },
  { carbonIcon: <Misuse24 />, name: 'Misuse' },
  { carbonIcon: <MisuseOutline24 />, name: 'Misuse outline' },
  { carbonIcon: <Undefined24 />, name: 'Undefined' },
  { carbonIcon: <UndefinedFilled24 />, name: 'Undefined filled' },
  { carbonIcon: <Unknown24 />, name: 'Unknown' },
  { carbonIcon: <UnknownFilled24 />, name: 'Unknown filled' },
  { carbonIcon: <Warning24 />, name: 'Warning' },
  { carbonIcon: <WarningAlt24 />, name: 'Warning alt' },
  { carbonIcon: <WarningAltFilled24 />, name: 'Warning alt filled' },
  { carbonIcon: <WarningAltInverted24 />, name: 'Warning alt inverted' },
  {
    carbonIcon: <WarningAltInvertedFilled24 />,
    name: 'Warning alt inverted filled',
  },
  { carbonIcon: <WarningFilled24 />, name: 'Warning filled' },
  { carbonIcon: <WarningSquare24 />, name: 'Warning square' },
  { carbonIcon: <WarningSquareFilled24 />, name: 'Warning square filled' },
];

export const validThresholdColors = [
  { carbonColor: red60, name: 'red60' },
  { carbonColor: green50, name: 'green50' },
  { carbonColor: orange40, name: 'orange40' },
  { carbonColor: yellow30, name: 'yellow30' },
  { carbonColor: blue60, name: 'blue60' },
];

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
  <ValueCard
    // render the icon in the right color in the card preview
    renderIconByName={(iconName, props) => {
      const iconToRender = validThresholdIcons.find(
        (icon) => icon.name === iconName
      )?.carbonIcon || <Warning24 />;
      // eslint-disable-next-line react/prop-types
      return <div style={{ color: props.fill }}>{iconToRender}</div>;
    }}
    isEditable
    {...cardConfig}
    {...commonProps}
  />
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
      {...commonProps}>
      {
        // If content is a function, this is a react component
        typeof cardConfig.content === 'function' ? (
          <cardConfig.content />
        ) : (
          cardConfig.content
        )
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

/**
 * Returns the correct string based off the currently selected breakpoint
 * @param {string} breakpoint One of the breakpoints we support with DashboardGrid
 * @param {Object<string>} i18n internationalization strings
 * @returns {string} translated info about the selected breakpoint
 */
export const renderBreakpointInfo = (breakpoint, i18n) => {
  switch (breakpoint) {
    case 'xl':
      return i18n.layoutInfoXl;
    case 'lg':
      return i18n.layoutInfoLg;
    case 'md':
      return i18n.layoutInfoMd;
    default:
      return i18n.layoutInfoXl;
  }
};

/**
 * returns a new series array with a generated color if needed, and in the format expected by the JSON payload
 * @param {array} selectedItems
 * @param {object} cardConfig
 */
export const formatSeries = (selectedItems, cardConfig) => {
  const cardSeries = cardConfig?.content?.series;
  const series = selectedItems.map(({ id }, i) => {
    const currentItem = cardSeries?.find(
      (dataItem) => dataItem.dataSourceId === id
    );
    const color =
      currentItem?.color ??
      DATAITEM_COLORS_OPTIONS[i % DATAITEM_COLORS_OPTIONS.length];
    return {
      dataSourceId: id,
      label: currentItem?.label || id,
      color,
    };
  });
  return series;
};

/**
 * returns a new attributes array in the format expected by the JSON payload
 * @param {array} selectedItems
 * @param {object} cardConfig
 */
export const formatAttributes = (selectedItems, cardConfig) => {
  const cardAttributes = cardConfig?.content?.attributes;
  const attributes = selectedItems.map(({ id }) => {
    const currentItem = cardAttributes?.find(
      (dataItem) => dataItem.dataSourceId === id
    );

    return {
      dataSourceId: id,
      label: currentItem?.label || id,
      ...(!isNil(currentItem?.precision)
        ? { precision: currentItem.precision }
        : {}),
      ...(currentItem?.thresholds && !isEmpty(currentItem?.thresholds)
        ? { thresholds: currentItem.thresholds }
        : {}),
      ...(currentItem?.dataFilter
        ? { dataFilter: currentItem.dataFilter }
        : {}),
    };
  });
  return attributes;
};

/**
 * determines how to format the dataSection based on card type
 * @param {array} selectedItems
 * @param {object} cardConfig
 */
export const handleDataSeriesChange = (selectedItems, cardConfig) => {
  const { type } = cardConfig;
  let series;
  let attributes;

  switch (type) {
    case CARD_TYPES.VALUE:
      attributes = formatAttributes(selectedItems, cardConfig);
      return {
        ...cardConfig,
        content: { ...cardConfig.content, attributes },
      };
    case CARD_TYPES.TIMESERIES:
      series = formatSeries(selectedItems, cardConfig);
      return {
        ...cardConfig,
        content: { ...cardConfig.content, series },
      };
    default:
      return cardConfig;
  }
};

/**
 * updates the dataSection on edit of a dataItem based on card type
 * @param {array} editDataItem
 * @param {object} cardConfig
 */
export const handleDataItemEdit = (editDataItem, cardConfig) => {
  const { type, content } = cardConfig;
  let dataSection;
  let editDataItemIndex;

  switch (type) {
    case CARD_TYPES.VALUE:
      dataSection = [...content.attributes];
      editDataItemIndex = dataSection.findIndex(
        (dataItem) => dataItem.dataSourceId === editDataItem.dataSourceId
      );
      dataSection[editDataItemIndex] = editDataItem;
      return {
        ...cardConfig,
        content: { ...content, attributes: dataSection },
      };
    case CARD_TYPES.TIMESERIES:
      dataSection = [...content.series];
      editDataItemIndex = dataSection.findIndex(
        (dataItem) => dataItem.dataSourceId === editDataItem.dataSourceId
      );
      dataSection[editDataItemIndex] = editDataItem;
      return {
        ...cardConfig,
        content: { ...content, series: dataSection },
      };
    default:
      return cardConfig;
  }
};
