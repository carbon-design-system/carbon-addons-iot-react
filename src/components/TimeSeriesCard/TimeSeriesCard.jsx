import React from 'react';
import moment from 'moment';
import withSize from 'react-sizeme';
import { LineChart } from '@carbon/charts-react';
import '@carbon/charts/style.css';
import isEmpty from 'lodash/isEmpty';
import 'c3/c3.css';
import styled from 'styled-components';

import { TimeSeriesCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';

const LineChartWrapper = styled.div`
  padding-left: 16px;
  width: 100%;
  height: 100%;
  &&& {
    .chart-wrapper g.tick text {
      ${props =>
        props.size === CARD_SIZES.MEDIUM &&
        `
          transform: initial !important;
          text-anchor: initial !important;
        `}
    }
    .legend-wrapper {
      display: ${props => (props.isLegendHidden ? 'none' : 'block')};
    }
    .chart-holder {
      width: 100%;
      height: 100%;
    }
  }
`;

const TimeSeriesCard = ({
  title,
  content: { series, timeDataSourceId, xLabel, yLabel },
  size,
  interval,
  values,
  ...others
}) => {
  const formatInterval = (timestamp, sameDay, index) => {
    const m = moment.unix(timestamp / 1000);

    return sameDay && interval === 'hour'
      ? m.format('HH:mm')
      : interval === 'hour' && !sameDay
      ? m.format('Do HH:00')
      : interval === 'day' && size === CARD_SIZES.MEDIUM && index === 0
      ? m.format('DD MMM YYYY')
      : interval === 'month'
      ? m.format('MMM YYYY')
      : interval === 'minute'
      ? m.format('HH:mm')
      : m.format('DD MMM');

    // return interval === 'day'
    //   ? m.format('MM DD')
    //   : interval === 'hour'
    //   ? m.format('MM-DD HH:00')
    //   : interval === 'minute'
    //   ? m.format('HH:mm')
    //   : m.format('YYYY-MM-DD');
  };

  const maxTicksPerSize = () => {
    switch (size) {
      case CARD_SIZES.MEDIUM:
        return 6;
      case CARD_SIZES.LARGE:
        return 12;
      case CARD_SIZES.XLARGE:
        return 20;
      default:
        return 10;
    }
  };

  const sameDay =
    moment(moment.unix(values[0].timestamp / 1000)).isSame(moment(), 'day') &&
    moment(moment.unix(values[values.length - 1].timestamp / 1000)).isSame(moment(), 'day');

  return (
    <withSize.SizeMe monitorHeight>
      {() => {
        const ticksInterval = Math.round(values.length / maxTicksPerSize(size));
        const labels = values
          .sort((left, right) => moment.utc(left.timestamp).diff(moment.utc(right.timestamp)))
          .map((i, idx) => {
            return idx % ticksInterval === 0
              ? formatInterval(i[timeDataSourceId], sameDay, idx)
              : ' '.repeat(idx);
          });
        return (
          <Card title={title} size={size} {...others} isEmpty={isEmpty(values)}>
            {!others.isLoading && !isEmpty(values) ? (
              <LineChartWrapper size={size} isLegendHidden={series.length === 1}>
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
                      },
                      y: {
                        title: yLabel,
                        // numberOfTicks: 8,
                      },
                    },
                    legendClickable: true,
                    containerResizable: true,
                  }}
                  height={size === CARD_SIZES.MEDIUM ? 200 : null}
                />
              </LineChartWrapper>
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
