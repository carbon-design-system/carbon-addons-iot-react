import React, { Component } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import C3Chart from 'react-c3js';
import isEmpty from 'lodash/isEmpty';

import 'c3/c3.css';

import { TimeSeriesCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import { COLORS, CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';

const ContentWrapper = styled.div`
  margin: 0 16px 16px 16px;
  width: 100%;
  position: relative;
  &&& {
    .c3-axis {
      fill: #565656;
      font-size: 12px;
      font-family: IBM Plex Sans;
    }
    .c3-axis-x path,
    .c3-axis-x line,
    .c3-axis-y path,
    .c3-axis-y line {
      stroke: #565656;
    }
  }
`;

const StyledLegend = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-evenly;
  align-items: center;
`;

const StyledSpan = styled.span`
  cursor: pointer;
  color: #565656;
  font-size: 14px;
  font-family: IBM Plex Sans;

  ::before {
    border-color: ${props => props.color};
    margin-right: 5px;
    width: 5px;
    content: '';
    border-style: solid;
    display: inline-block;
    vertical-align: middle;
    height: 5px;
    background: ${props => props.color};
  }
`;

const StyledXDiv = styled.div`
  text-align: center;
  color: #565656;
  font-size: 12px;
  font-family: IBM Plex Sans Condensed;
`;

const StyledYDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 2%;
  transform: translateX(-50%) translateY(-50%) rotate(-90deg);
  color: #565656;
  font-size: 12px;
  font-family: IBM Plex Sans Condensed;
`;

class TimeSeriesCard extends Component {
  constructor(props) {
    super(props);
    // Create the ref
    this.c3ChartComponent = React.createRef();
  }

  componentDidMount() {
    console.log('Chart:::', this.c3ChartComponent);
  }

  render() {
    const {
      title,
      content: { series, timeDataSourceId, labelsDescription, xLabel, yLabel },
      size,
      range,
      values,
      ...others
    } = this.props;

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

    const maxY = series
      .map(item =>
        values
          .map(i => i[item.dataSourceId])
          .reduce((maxValue, current) => (current > maxValue ? current : maxValue))
      )
      .reduce((maxValue, current) => (current > maxValue ? current : maxValue));

    const minY = series
      .map(item =>
        values
          .map(i => i[item.dataSourceId])
          .reduce((minValue, current) => (current < minValue ? current : minValue), maxY)
      )
      .reduce((maxValue, current) => (current < maxValue ? current : maxValue));
    console.log('Max Y value:::', maxY);
    console.log('Min Y value:::', minY);

    const chartData = !isEmpty(values)
      ? series.label === undefined
        ? {
            // an array of datasets with multiple x axeså
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
            x: 'timeDataSourceId',
            xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
            colors: {
              [series.dataSourceId]: series.color,
            },
            names: {
              [series.dataSourceId]: series.label,
            },
            json: values,
            keys: { value: [series.dataSourceId], x: timeDataSourceId },

            type: 'line',
          }
      : [];

    console.log('Data::', chartData);

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
            count: 10,
            // culling: {
            //   max: 4, // the number of tick texts will be adjusted to less than this value
            // },
          },
          // padding: { top: 100, bottom: 100 },
        },
        y: {
          max: maxY,
          min: minY,
          // Range includes padding, set 0 if no padding needed
          // padding: { top: 100, bottom: 100 },
        },
      },
      padding: {
        top: 20,
        right: 20,
        left: 50,
      },
      // if color is not provided as prop we have default pattern colors.
      color: {
        pattern: [COLORS.PURPLE, COLORS.TEAL, COLORS.MAGENTA, COLORS.CYAN],
      },
      // grid: {
      //   x: {
      //     show: true,
      //   },
      //   y: {
      //     show: true,
      //   },
      // },
      // zoom: {
      //   enabled: true,
      // },
      legend: {
        show: false,
      },
    };

    return (
      <Card title={title} size={size} {...others} isEmpty={isEmpty(values)}>
        {/* {others.isLoading ? ( */}
        <ContentWrapper>
          <StyledLegend>
            {Object.keys(chartData.names).length > 1
              ? Object.keys(chartData.names).map(item => {
                  return (
                    <StyledSpan
                      key={`legend-${item}`}
                      data-id={item}
                      color={chartData.colors[item]}
                      onMouseOver={() => this.c3ChartComponent.chart.focus(item)}
                      onfocus={() => this.c3ChartComponent.chart.focus(item)}
                      onMouseOut={() => this.c3ChartComponent.chart.revert()}
                      onBlur={() => this.c3ChartComponent.chart.revert()}
                      onClick={() => this.c3ChartComponent.chart.toggle(item)}
                    >
                      {chartData.names[item]}
                    </StyledSpan>
                  );
                })
              : null}
          </StyledLegend>
          <C3Chart
            {...chart}
            style={{
              height: '93%',
              width: '100%',
            }}
            ref={chartRef => {
              this.c3ChartComponent = chartRef;
            }}
          />
          <div>
            {xLabel ? <StyledXDiv>{xLabel}</StyledXDiv> : null}
            {yLabel ? <StyledYDiv>{yLabel}</StyledYDiv> : null}
          </div>
        </ContentWrapper>
        {/* ) : null} */}
      </Card>
    );
  }
}

TimeSeriesCard.propTypes = { ...CardPropTypes, ...TimeSeriesCardPropTypes };

TimeSeriesCard.defaultProps = {
  size: CARD_SIZES.MEDIUM,
};

export default TimeSeriesCard;
