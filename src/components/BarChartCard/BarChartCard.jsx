import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import C3Chart from 'react-c3js';
import 'c3/c3.css';

import { BarChartCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';

const ContentWrapper = styled.div`
  margin: 0 16px 16px 16px;
  padding-bottom: 8px;
  width: 100%;
  background-color: rgb(243, 243, 243);
`;

const BarChartCard = ({ title, content: { data }, size, ...others }) => {
  const chartData = {
    columns: data.map(i => ([i.label].concat(i.values.map(j => j.y)))),
    colors: data.reduce((acc, curr) => Object.assign({}, acc, curr.color ? { [curr.label]: curr.color } : {}), {}),
    type: 'bar',
    axis: {
      x: {
        type: 'category',
        categories: data[0].values.map(i => i.x),
      },
    },
    groups: [data.map(i => i.label)],
  };
  console.log(chartData);
  const chart = {
    data: chartData,
    padding: {
      top: 10,
      right: 20,
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

BarChartCard.propTypes = { ...CardPropTypes, ...BarChartCardPropTypes };

BarChartCard.defaultProps = {
  size: CARD_SIZES.MEDIUM,
};

export default BarChartCard;
