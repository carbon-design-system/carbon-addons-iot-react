import React from 'react';
import moment from 'moment';
import withSize from 'react-sizeme';
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
  interval,
  values,
  ...others
}) => {
  const formatInterval = timestamp => {
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
    <withSize.SizeMe monitorHeight>
      {({ size: measuredSize }) => {
        const labels = values
          .sort((left, right) => moment.utc(left.timeStamp).diff(moment.utc(right.timeStamp)))
          .map((i, idx) => (idx % 2 === 0 ? formatInterval(i[timeDataSourceId]) : ' '.repeat(idx)));

        return (
          <Card title={title} size={size} {...others} isEmpty={isEmpty(values)}>
            {!others.isLoading && !isEmpty(values) ? (
              <LineChart
                data={{
                  labels,
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
                      // ticks: 6,
                    },
                    y: {
                      title: yLabel,
                      // ticks: 3,
                      // numberOfTicks: 3,
                    },
                  },
                  legendClickable: true,
                  containerResizable: true,
                }}
              />
            ) : null}
          </Card>
        );
      }}
    </withSize.SizeMe>
  );
};

TimeSeriesCard.propTypes = { ...CardPropTypes, ...TimeSeriesCardPropTypes };

TimeSeriesCard.defaultProps = {
  size: CARD_SIZES.MEDIUM,
};

export default TimeSeriesCard;
