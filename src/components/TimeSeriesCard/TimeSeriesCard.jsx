import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import C3Chart from 'react-c3js';
import 'c3/c3.css';

import { TimeSeriesCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';

const ContentWrapper = styled.div`
  margin: 0 16px 16px 16px;
  width: 100%;
  background-color: rgb(243, 243, 243);
`;

const TimeSeriesCard = ({ title, content: { range, data }, size, ...others }) => {
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
  const chart = {
    data: {
      x: 'timestamps',
      xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
      json: {
        [data.label]: data.values.map(i => i.v),
        timestamps: data.values.map(i => i.t),
      },
      type: 'line',
    },
    axis: {
      x: {
        min,
        max,
        type: 'timeseries',
        tick: {
          fit: false,
          format,
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
    <Card title={title} size={size} {...others}>
      <ContentWrapper>
        <C3Chart
          {...chart}
          style={{
            height: '100%',
            width: '100%',
          }}
        />
      </ContentWrapper>
    </Card>
  );
};

TimeSeriesCard.propTypes = { ...CardPropTypes, ...TimeSeriesCardPropTypes };

TimeSeriesCard.defaultProps = {
  size: CARD_SIZES.MEDIUM,
};

export default TimeSeriesCard;
