import React from 'react';
import moment from 'moment';
import { LineChart } from '@carbon/charts-react';
import '@carbon/charts/style.css';
import isEmpty from 'lodash/isEmpty';

import 'c3/c3.css';

import { TimeSeriesCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';

const TimeSeriesCard = ({
  title,
  content: { series, timeDataSourceId, xLabel, yLabel },
  size,
  range,
  interval,
  values,
  ...others
}) => {
  const format = timestamp => {
    const m = moment.unix(timestamp / 1000);
    return interval === 'day'
      ? m.format('YYYY-MM-DD')
      : interval === 'hour'
      ? m.format('MM-DD HH:00')
      : interval === 'minute'
      ? m.format('HH:mm')
      : m.format('YYYY-MM-DD');
  };

  return (
    <Card title={title} size={size} {...others} isEmpty={isEmpty(values)}>
      {!others.isLoading && !isEmpty(values) ? (
        <LineChart
          data={{
            labels: values.map(i => format(i[timeDataSourceId])),
            datasets: series.map(({ dataSourceId, label }) => ({
              label,
              data: values.map(i => i[dataSourceId]),
            })),
          }}
          options={{
            animations: false,
            accessibility: false,
            scales: {
              x: {
                title: xLabel,
              },
              y: {
                title: yLabel,
              },
            },
            legendClickable: true,
            containerResizable: true,
          }}
        />
      ) : null}
    </Card>
  );
};

TimeSeriesCard.propTypes = { ...CardPropTypes, ...TimeSeriesCardPropTypes };

TimeSeriesCard.defaultProps = {
  size: CARD_SIZES.MEDIUM,
};

export default TimeSeriesCard;
