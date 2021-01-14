import React from 'react';
import PropTypes from 'prop-types';
import ComboChart from '@carbon/charts-react/combo-chart';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import { CardPropTypes } from '../../constants/CardPropTypes';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  id: PropTypes.string.isRequired,
  i18n: PropTypes.shape({
    noData: PropTypes.string,
  }),
};

const defaultProps = {
  size: CARD_SIZES.MEDIUMWIDE,
  title: '',
  i18n: {
    noDataLabel: 'No data',
  },
};

const ComboChartCard = ({ className, title, values, options, ...others }) => {
  const { title: chartTitle, ...otherOptions } = options;

  return (
    <Card
      isEmpty={isEmpty(values)}
      className={classnames(className, `${iotPrefix}--combo-chart-card`)}
      title={`${title === '' ? chartTitle : title}`}
      {...others}>
      <div className={`${iotPrefix}--combo-chart-card__container`}>
        <ComboChart
          key="combo-chart"
          data={values}
          {...others}
          options={otherOptions}
        />
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
