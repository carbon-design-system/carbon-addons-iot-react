/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
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
      const iconToRender = validThresholdIcons.find(
        (icon) => icon.name === iconName
      )?.carbonIcon || <Warning24 />;
      // eslint-disable-next-line react/prop-types
      return (
        <div style={{ color: iconProps.fill }}>
          {React.cloneElement(iconToRender, iconProps)}
        </div>
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
    <TimeSeriesCard
      isEditable
      values={[]}
      interval={timeRangeJSON?.interval || 'day'}
      {...props}
    />
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
    isEditable // render the icon in the right color in the card preview
    renderIconByName={(iconName, iconProps) => {
      // first search the validHotspot Icons
      const matchingHotspotIcon = validHotspotIcons.find(
        (icon) => icon.id === iconName
      );

      // then search the validThresholdIcons
      const matchingThresholdIcon = validThresholdIcons.find(
        (icon) => icon.name === iconName
      );
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
        // otherwise default to Warning24
        <Warning24 {...iconProps} />
      );
      // eslint-disable-next-line react/prop-types
      return <div style={{ color: iconProps.fill }}>{iconToRender}</div>;
    }}
    {...props}
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
      {...omit(props, 'content')}>
      {
        // If content is a function, this is a react component
        typeof props.content === 'function' ? <props.content /> : props.content
      }
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
const DashboardEditorCardRenderer = ({
  dataItems,
  availableDimensions,
  ...others
}) => {
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
      return renderImageCard(others);
    case CARD_TYPES.LIST:
      return renderListCard(others);
    case CARD_TYPES.CUSTOM:
      return renderCustomCard(others);
    default:
      return renderDefaultCard(others);
  }
};

export default DashboardEditorCardRenderer;
