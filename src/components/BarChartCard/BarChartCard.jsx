import React, { Fragment } from 'react';
import SimpleBarChart from '@carbon/charts-react/bar-chart-simple';
import StackedBarChart from '@carbon/charts-react/bar-chart-stacked';
import GroupedBarChart from '@carbon/charts-react/bar-chart-grouped';
import classnames from 'classnames';
import every from 'lodash/every';
import isNil from 'lodash/isNil';

import { BarChartCardPropTypes, CardPropTypes } from '../../constants/PropTypes';
import {
  CARD_SIZES,
  BAR_CHART_TYPES,
  BAR_CHART_ORIENTATION,
} from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const BarChartCard = ({
  title,
  content: {
    xLabel,
    yLabel,
    orientation = BAR_CHART_ORIENTATION.VERTICAL,
    chartType = BAR_CHART_TYPES.SIMPLE,
    data,
    isTimeSeries = false,
  },
  size,
  locale,
  i18n,
  isExpanded,
  isLazyLoading,
  className,
  ...others
}) => {
  const isAllValuesEmpty = every(data && data.datasets, set =>
    every(set.data, value => isNil(value))
  );

  let ChartComponent = SimpleBarChart;

  if (chartType === BAR_CHART_TYPES.GROUPED) {
    ChartComponent = GroupedBarChart;
  } else if (chartType === BAR_CHART_TYPES.STACKED) {
    ChartComponent = StackedBarChart;
  }

  const scaleType = isTimeSeries ? 'time' : 'labels';

  return (
    <Card
      title={title}
      className={`${iotPrefix}--bar-chart-card`}
      size={size}
      i18n={i18n}
      {...others}
      isExpanded={isExpanded}
      isEmpty={isAllValuesEmpty}
      isLazyLoading={isLazyLoading}
    >
      {!others.isLoading && !isAllValuesEmpty ? (
        <Fragment>
          <div className={classnames(`${iotPrefix}--bar-chart-container`, className)}>
            <ChartComponent
              data={data}
              options={{
                animations: false,
                accessibility: true,
                axes: {
                  bottom: {
                    title: xLabel,
                    scaleType: orientation === BAR_CHART_ORIENTATION.VERTICAL ? scaleType : null,
                    primary: true,
                    stacked:
                      chartType === BAR_CHART_TYPES.STACKED &&
                      orientation === BAR_CHART_ORIENTATION.HORIZONTAL,
                  },
                  left: {
                    title: yLabel,
                    scaleType: orientation === BAR_CHART_ORIENTATION.HORIZONTAL ? scaleType : null,
                    secondary: true,
                    stacked:
                      chartType === BAR_CHART_TYPES.STACKED &&
                      orientation === BAR_CHART_ORIENTATION.VERTICAL,
                  },
                },
                legend: { position: 'bottom', enabled: data.datasets.length > 1 },
                containerResizable: true,
                tooltip: {
                  gridline: {
                    enabled: false,
                  },
                },
              }}
              width="100%"
              height="100%"
            />
          </div>
        </Fragment>
      ) : null}
    </Card>
  );
};

BarChartCard.propTypes = { ...CardPropTypes, ...BarChartCardPropTypes };

BarChartCard.defaultProps = {
  size: CARD_SIZES.MEDIUM,
};

export default BarChartCard;
