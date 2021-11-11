import React, { useMemo } from 'react';
import omit from 'lodash/omit';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';

import { CARD_TYPES } from '../../constants/LayoutConstants';
import ValueCard from '../ValueCard/ValueCard';
import TimeSeriesCard from '../TimeSeriesCard/TimeSeriesCard';
import BarChartCard from '../BarChartCard/BarChartCard';
import ImageCard from '../ImageCard/ImageCard';
import TableCard from '../TableCard/TableCard';
import ListCard from '../ListCard/ListCard';
import Card from '../Card/Card';

import { timeRangeToJSON, isCardJsonValid } from './editorUtils';

/**
 * Renders a card and lists the JSON within
 * @param {Object} props
 * @returns {Node}
 */
// eslint-disable-next-line react/prop-types
const renderDefaultCard = ({ id, children, ...others }) => (
  <Card isEditable {...others}>
    <div style={{ padding: '1rem' }}>{JSON.stringify(id, null, 4)}</div>
    {children}
  </Card>
);

/**
 * This component renders our default representation of a card in the editor based on the card type
 */
const DashboardEditorDefaultCardRenderer = ({ card: cardProps, availableDimensions }) => {
  // For time based cards, we need to deduce the correct interval
  const timeRangeJSON = find(timeRangeToJSON, ({ range }) =>
    isEqual(range, cardProps?.dataSource?.range)
  );
  const interval = useMemo(() => timeRangeJSON?.interval || 'day', [timeRangeJSON]);

  // if our card isn't valid render the default
  if (!isCardJsonValid(cardProps)) {
    // eslint-disable-next-line no-console
    console.warn(`Warning: The card JSON for ${cardProps.id} is invalid.`);
    return renderDefaultCard(cardProps);
  }

  // otherwise we can check the type to decide which card to render
  switch (cardProps.type) {
    case CARD_TYPES.VALUE:
      return <ValueCard isEditable {...cardProps} />;
    case CARD_TYPES.TIMESERIES: {
      return <TimeSeriesCard isEditable interval={interval} {...cardProps} />;
    }
    case CARD_TYPES.BAR:
      return (
        <BarChartCard
          isEditable
          isDashboardPreview
          availableDimensions={availableDimensions}
          interval={interval}
          {...cardProps}
        />
      );
    case CARD_TYPES.TABLE:
      return (
        <TableCard
          // workaround needed to regen TableCard if columns change
          key={JSON.stringify(cardProps?.content?.columns)}
          isEditable
          {...cardProps}
        />
      );
    case CARD_TYPES.IMAGE:
      return (
        <ImageCard
          {...cardProps}
          isEditable // render the icon in the right color in the card preview
        />
      );
    case CARD_TYPES.LIST:
      return <ListCard isEditable {...cardProps} />;
    default:
      // if the user passes an element for a custom card type, render it
      return React.isValidElement(cardProps.content) || typeof cardProps.content === 'function' ? (
        <Card
          isEditable
          // need to omit the content because its getting passed content to be rendered, which should not
          // get attached to the card wrapper
          {...omit(cardProps, 'content')}
        >
          {cardProps.content}
          {
            cardProps.children // children is the resizable element attached by react-grid-layout which must be rendered to support resizing
          }
        </Card>
      ) : (
        // all else fails render the default card
        renderDefaultCard(cardProps)
      );
  }
};

DashboardEditorDefaultCardRenderer.propTypes = {
  card: PropTypes.oneOfType([PropTypes.object]),
  availableDimensions: PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  ),
};

DashboardEditorDefaultCardRenderer.defaultProps = {
  card: undefined,
  availableDimensions: undefined,
};

export default DashboardEditorDefaultCardRenderer;
