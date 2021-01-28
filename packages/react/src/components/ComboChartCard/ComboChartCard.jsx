/* istanbul ignore file */
// Ignoring until we resolve the issue with importing this component in jest
import React from 'react';
import { ComboChart } from '@carbon/charts-react';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import { CardPropTypes } from '../../constants/CardPropTypes';
import { settings } from '../../constants/Settings';
import StatefulTable from '../Table/StatefulTable';

const { iotPrefix } = settings;


const defaultProps = {
  size: CARD_SIZES.MEDIUMWIDE,
  locale: 'en',
  title: '',
  i18n: {
    noDataLabel: 'No data',
  },
};

const ComboChartCard = ({
  className,
  title,
  values,
  options,
  ...others
}) => {
  const { title: chartTitle, ...otherOptions } = options;

  return (
    <Card
      isEmpty={isEmpty(values)}
      className={classnames(className, `${iotPrefix}--combo-chart-card`)}
      title={`${title === '' ? chartTitle : title}`}
      {...others}
    >
      <div className={`${iotPrefix}--combo-chart-card__container`}>
        <ComboChart key="combo-chart" data={values} {...others} options={otherOptions} />
        {isExpanded ? (
            <StatefulTable
              id="BarChartCard-table"
              className={`${iotPrefix}--bar-chart-card--stateful-table`}
              columns={tableColumns}
              data={tableData}
              options={{
                hasPagination: true,
                hasSearch: true,
                hasFilter: true,
              }}
              actions={{
                toolbar: {
                  onDownloadCSV: (filteredData) => csvDownloadHandler(filteredData, title),
                },
              }}
              view={{
                pagination: {
                  pageSize: 10,
                  pageSizes: [10, 20, 30],
                },
                toolbar: {
                  activeBar: null,
                },
                filters: [],
                table: {
                  sort: {
                    columnId: timeDataSourceId,
                    direction: 'DESC',
                  },
                  emptyState: {
                    message: noDataLabel,
                  },
                },
              }}
              i18n={i18n}
            />
          ) : null}
      </div>
    </Card>
  );
};

ComboChartCard.propTypes = {
  ...propTypes,
  ...CardPropTypes,
};
ComboChartCard.defaultProps = defaultProps;
export default ComboChartCard;
