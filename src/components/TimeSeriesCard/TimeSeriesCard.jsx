import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import C3Chart from 'react-c3js';
import isEmpty from 'lodash/isEmpty';

import 'c3/c3.css';
import { TimeSeriesCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';

const ContentWrapper = styled.div`
  margin: 0 16px 16px 16px;
  padding-bottom: 8px;
  width: 100%;
`;

const TimeSeriesCard = ({
  title,
  content: { series, timeDataSourceId },
  size,
  range,
  values,
  ...others
}) => {
  // TODO: need to i18n the format of the x-axis and y-axis labels
  const format =
    range === 'month'
      ? '%m/%d'
      : range === 'week'
      ? '%m/%d'
      : range === 'day'
      ? '%H:%M'
      : '%H:%M:%S';
  const min =
    range === undefined
      ? undefined
      : range === 'month'
      ? moment()
          .subtract(1, 'month')
          .toISOString()
      : range === 'week'
      ? moment()
          .subtract(7, 'days')
          .toISOString()
      : range === 'day'
      ? moment()
          .subtract(1, 'day')
          .toISOString()
      : range.min;
  const max = range === undefined ? undefined : range.max ? range.max : moment().toISOString();
  const chartData = !isEmpty(values)
    ? series.label === undefined
      ? {
          xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
          colors: series.reduce(
            (acc, curr) =>
              Object.assign({}, acc, curr.color ? { [curr.dataSourceId]: curr.color } : {}),
            {}
          ),
          names: series.reduce(
            (acc, curr) =>
              Object.assign({}, acc, curr.label ? { [curr.dataSourceId]: curr.label } : {}),
            {}
          ),
          json: values,
          keys: { value: series.map(line => line.dataSourceId), x: timeDataSourceId },
          type: 'line',
        }
      : {
          // a single dataset
          x: timeDataSourceId,
          xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
          colors: {
            [series.dataSourceId]: series.color,
          },
          names: {
            [series.dataSourceId]: series.label,
          },
          keys: { value: [series.dataSourceId], x: timeDataSourceId },
          json: values,
          type: 'line',
        }
    : [];
  const chart = {
    data: chartData,
    axis: {
      x: {
        min,
        max,
        type: 'timeseries',
        tick: {
          fit: false,
          format,
          rotate: 30,
        },
      },
    },
    padding: {
      top: 20,
      right: 50,
      left: 50,
    },
  };

  return (
    <Card title={title} size={size} {...others} isEmpty={isEmpty(values)}>
      {!others.isLoading ? (
        <ContentWrapper>
          <C3Chart
            {...chart}
            style={{
              height: '100%',
              width: '100%',
            }}
          />
        </ContentWrapper>
      ) : null}
    </Card>
  );
};

TimeSeriesCard.propTypes = { ...CardPropTypes, ...TimeSeriesCardPropTypes };

TimeSeriesCard.defaultProps = {
  size: CARD_SIZES.MEDIUM,
};

export default TimeSeriesCard;
