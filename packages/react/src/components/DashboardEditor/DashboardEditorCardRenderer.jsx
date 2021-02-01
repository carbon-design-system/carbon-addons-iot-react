/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import omit from 'lodash/omit';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import { Warning24 } from '@carbon/icons-react';

import { CARD_TYPES } from '../../constants/LayoutConstants';
import {
  Card,
  ValueCard,
  TimeSeriesCard,
  BarChartCard,
  ImageCard,
  TableCard,
  ListCard,
} from '../../index';

import {
  validThresholdIcons,
  validHotspotIcons,
  timeRangeToJSON,
  isCardJsonValid,
} from './editorUtils';

/**
 * Renders a card and lists the JSON within
 * @param {Object} props
 * @returns {Node}
 */
const renderDefaultCard = (props) => (
  <Card isEditable {...props}>
    <div style={{ padding: '1rem' }}>{JSON.stringify(props.id, null, 4)}</div>
  </Card>
);

/**
 * @param {Object} props
 * @returns {Node}
 */
const renderValueCard = (props) => (
  <ValueCard
    // render the icon in the right color in the card preview
    renderIconByName={(iconName, iconProps) => {
      const iconToRender = validThresholdIcons.find((icon) => icon.name === iconName)
        ?.carbonIcon || <Warning24 />;
      // eslint-disable-next-line react/prop-types
      return (
        <div style={{ color: iconProps.fill }}>{React.cloneElement(iconToRender, iconProps)}</div>
      );
    }}
    isEditable
    {...props}
  />
);
/**
 * @param {Object} props
 * @returns {Node}
 */
const renderTimeSeriesCard = (props) => {
  // apply the timeRange for the card preview
  const timeRangeJSON = find(timeRangeToJSON, ({ range }) =>
    isEqual(range, props?.dataSource?.range)
  );
  return (
    <TimeSeriesCard isEditable values={[]} interval={timeRangeJSON?.interval || 'day'} {...props} />
  );
};

/**
 * @param {Object} props
 * @returns {Node}
 */
const EditorBarChartCard = ({ dataItems, availableDimensions, ...props }) => {
  // apply the timeRange for the card preview
  const timeRangeJSON = find(timeRangeToJSON, ({ range }) =>
    isEqual(range, props?.dataSource?.range)
  );

  return (
    <BarChartCard
      isEditable
      isDashboardPreview
      availableDimensions={availableDimensions}
      interval={timeRangeJSON?.interval || 'day'}
      {...props}
    />
  );
};

/**
 * @param {Object} props
 * @returns {Node}
 */
const renderTableCard = (props) => (
  <TableCard
    // TODO: workaround need to regen TableCard if columns change
    key={JSON.stringify(props?.content?.columns)}
    isEditable
    {...props}
  />
);

/**
 * @param {Object} props
 * @returns {Node}
 */
const renderImageCard = (props) => (
  <ImageCard
    renderIconByName={(iconName, iconProps) => {
      // first search the validHotspot Icons
      const matchingHotspotIcon = validHotspotIcons.find((icon) => icon.id === iconName);

      // then search the validThresholdIcons
      const matchingThresholdIcon = validThresholdIcons.find((icon) => icon.name === iconName);
      const iconToRender = matchingHotspotIcon ? (
        React.createElement(matchingHotspotIcon.icon, {
          ...iconProps,
          title: matchingHotspotIcon.text,
        })
      ) : matchingThresholdIcon ? (
        React.cloneElement(matchingThresholdIcon.carbonIcon, {
          ...iconProps,
          title: matchingThresholdIcon.name,
        })
      ) : (
        <Warning24 {...iconProps} />
      );

      // otherwise default to Warning24
      // eslint-disable-next-line react/prop-types
      return <div style={{ color: iconProps.fill }}>{iconToRender}</div>;
    }}
    {...props}
    isEditable // render the icon in the right color in the card preview
    values={{
      ...props.values,
      hotspots: props.values?.hotspots?.filter((hotspot) => hotspot.type !== 'dynamic') || [],
    }}
  />
);

/**
 * @param {Object} props
 * @returns {Node}
 */
const renderListCard = (props) => <ListCard isEditable {...props} />;

/**
 * @param {Object} props
 * @returns {Node}
 */
const renderCustomCard = (props) => {
  return (
    <Card
      // need to omit the content because its getting passed content to be rendered, which should not
      // get attached to the card wrapper
      {...omit(props, 'content')}
    >
      {props.content}
    </Card>
  );
};

/**
 * Returns a Card component for preview in the dashboard
 * @param {Array} dataItems list of dataItems available to the card
 * @param {Object} availableDimensions collection of dimensions where the key is the
 * dimension and the value is a list of values for that dimension
 * @returns {Node}
 */
const DashboardEditorCardRenderer = ({ dataItems, availableDimensions, ...others }) => {
  const [dynamicHotspots, setDynamicHotspots] = useState([]);

  useEffect(() => {
    const originalDynamicHotspot = others.values?.hotspots?.find(
      (hotspot) => hotspot.type === 'dynamic'
    );
    // if we have dynamic hotspots and a way to fetch them, fetch them
    if (originalDynamicHotspot && others.onFetchDynamicDemoHotspots) {
      others.onFetchDynamicDemoHotspots().then((hotspots) =>
        setDynamicHotspots(
          hotspots.map((hotspot) => ({
            ...hotspot,
            ...omit(originalDynamicHotspot, 'type', 'x', 'y'),
          }))
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [others.values?.hotspots?.length, others.onFetchDynamicDemoHotspots]);

  if (!isCardJsonValid(others)) {
    return renderDefaultCard(others);
  }

  switch (others.type) {
    case CARD_TYPES.VALUE:
      return renderValueCard(others);
    case CARD_TYPES.TIMESERIES:
      return renderTimeSeriesCard(others);
    case CARD_TYPES.BAR:
      return (
        <EditorBarChartCard
          {...others}
          dataItems={dataItems}
          availableDimensions={availableDimensions}
        />
      );
    case CARD_TYPES.TABLE:
      return renderTableCard(others);
    case CARD_TYPES.IMAGE:
      return renderImageCard({
        ...others,
        values: { ...others.values, hotspots: others.values?.hotspots?.concat(dynamicHotspots) },
      });
    case CARD_TYPES.LIST:
      return renderListCard(others);
    case CARD_TYPES.CUSTOM:
      return renderCustomCard(others);
    default:
      return renderDefaultCard(others);
  }
};

export default DashboardEditorCardRenderer;
