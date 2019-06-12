import React, { Component, Fragment } from 'react';
import ReactDOMServer from 'react-dom/server';
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
    .c3-axis .tick line {
      display: none;
    }
    .c3-tooltip-container {
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
      position: absolute;
      /* display: none; */
      ${'' /* min-width: 13rem; */}
      max-width: 18rem;
      background: #3d3d3d;
      margin-top: 0.25rem;
      padding: 1rem;
      border-radius: 0.125rem;
      z-index: 10000;
      word-wrap: break-word;
      color: #fff;
    }

    .c3-grid line {
      stroke: #3d3d3d;
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
  left: 1%;
  transform: translateX(-50%) translateY(-50%) rotate(-90deg);
  color: #565656;
  font-size: 12px;
  font-family: IBM Plex Sans Condensed;
`;

const StyledTooltipCaret = styled.span`
  left: -0.25rem;
  top: 50%;
  right: auto;
  transform: rotate(135deg) translate(-50%, 50%);
  position: absolute;
  background: #3d3d3d;
  width: 0.6rem;
  height: 0.6rem;
  margin: 0 auto;
  content: '';
`;

const StyledTooltipText = styled.p`
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: 0.16px;
  margin-top: 5px;
  color: #f3f3f3;
  font-size: 12px;
  font-family: IBM Plex Sans;
  font-weight: ${props => (props.color ? 'bold' : 'normal')};

  ::before {
    ${props => {
      const { color } = props;
      if (color) {
        return `
        border-color: ${color};
        margin-right: 5px;
        width: 5px;
        content: '';
        border-style: solid;
        display: inline-block;
        vertical-align: middle;
        height: 5px;
        background: ${color};`;
      }
      return null;
    }}
  }
`;

const StyledTooltipTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: 0.16px;
  margin-left: 16px;
  color: #f3f3f3;
  font-size: 12px;
  font-family: IBM Plex Sans;
`;

const StyledTooltipValue = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: 0.16px;
  margin-top: 5px;
  color: #f3f3f3;
  font-size: 12px;
  font-family: IBM Plex Sans;
`;

class TimeSeriesCard extends Component {
  constructor(props) {
    super(props);
    // Create the ref
    this.c3ChartComponent = React.createRef();
    this.state = {
      colors: {},
    };
  }

  // componentDidUpdate(prevProps) {
  //   // Typical usage (don't forget to compare props):
  //   console.log('size', this.props);
  //   if (this.props.size !== prevProps.size) {
  //     console.log('force resize?');
  //     this.c3ChartComponent.chart.flush();
  //   }
  // }

  componentDidMount() {
    this.setState({
      colors: this.c3ChartComponent.chart ? this.c3ChartComponent.chart.data.colors() : {},
    });
  }

  customTooltip = (d, defaultTitleFormat, defaultValueFormat, color) => {
    const content = (
      <Fragment>
        <StyledTooltipCaret />
        {d.map((item, index) => {
          const dateFormat = new Date(item.x);
          const titleX = dateFormat.toLocaleDateString('default', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          });
          const valueformat = defaultValueFormat(item.value, item.id, item.index);
          return (
            <Fragment>
              {d.length > 1 ? (
                <Fragment>
                  {index === 0 ? <StyledTooltipTitle>{titleX}</StyledTooltipTitle> : null}
                  <StyledTooltipText color={color(item.id)}>
                    {item.name}: <StyledTooltipValue>{valueformat}</StyledTooltipValue>
                  </StyledTooltipText>
                </Fragment>
              ) : (
                <Fragment>
                  <StyledTooltipText>{titleX}</StyledTooltipText>
                  <StyledTooltipValue>Value: {valueformat}</StyledTooltipValue>
                </Fragment>
              )}
            </Fragment>
          );
        })}
      </Fragment>
    );

    return ReactDOMServer.renderToString(content);
  };

  render() {
    const {
      title,
      content: { series, timeDataSourceId, xLabel, yLabel },
      size,
      range,
      values,
      ...others
    } = this.props;

    const { colors } = this.state;

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

    const maxY = values
      ? Array.isArray(series) && series.length
        ? series
            .map(item =>
              values
                .map(i => i[item.dataSourceId])
                .reduce((maxValue, current) => (current > maxValue ? current : maxValue))
            )
            .reduce((maxValue, current) => (current > maxValue ? current : maxValue))
        : values.length &&
          values
            .map(i => i[series.dataSourceId])
            .reduce((maxValue, current) => (current > maxValue ? current : maxValue))
      : undefined;

    const minY = values
      ? Array.isArray(series) && series.length
        ? series
            .map(item =>
              values
                .map(i => i[item.dataSourceId])
                .reduce((minValue, current) => (current < minValue ? current : minValue), maxY)
            )
            .reduce((minValue, current) => (current < minValue ? current : minValue))
        : values.length &&
          values
            .map(i => i[series.dataSourceId])
            .reduce((minValue, current) => (current < minValue ? current : minValue), maxY)
      : undefined;

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
            // rotate: 30,
            count: 8,
            outer: false,
            // culling: {
            //   max: 100, // the number of tick texts will be adjusted to less than this value
            // },
          },
          // padding: { top: 100, bottom: 100 },
        },
        y: {
          max: maxY,
          min: minY,
          tick: {
            outer: false,
          },
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
      // point: {
      //   // show: false,
      //   r: 1,
      // },
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
      tooltip: {
        contents: this.customTooltip,
      },
    };

    return (
      <Card title={title} size={size} {...others} isEmpty={isEmpty(values)}>
        {!others.isLoading && !isEmpty(values) ? (
          <ContentWrapper>
            <StyledLegend>
              {Object.keys(chartData.names).length > 1
                ? Object.keys(chartData.names).map(item => {
                    return (
                      <StyledSpan
                        key={`legend-${item}`}
                        data-id={item}
                        color={colors[item]}
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
                height: '95%',
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
        ) : null}
      </Card>
    );
  }
}

TimeSeriesCard.propTypes = { ...CardPropTypes, ...TimeSeriesCardPropTypes };

TimeSeriesCard.defaultProps = {
  size: CARD_SIZES.MEDIUM,
};

export default TimeSeriesCard;
