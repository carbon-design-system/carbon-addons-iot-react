import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { EventSchedule16 } from '@carbon/icons-react';
import { ToolbarItem, OverflowMenu, OverflowMenuItem } from 'carbon-components-react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

export const CardRangePickerPropTypes = {
  /** Optional range to pass at the card level */
  timeRange: PropTypes.oneOf([
    'last24Hours',
    'last7Days',
    'lastMonth',
    'lastQuarter',
    'lastYear',
    'thisWeek',
    'thisMonth',
    'thisQuarter',
    'thisYear',
    '',
  ]),
  /** callback to handle interactions with the range picker */
  onCardAction: PropTypes.func.isRequired,
  /** set of internationalized labels */
  i18n: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element])
  ).isRequired,
  cardWidth: PropTypes.number,
};

const defaultProps = {
  timeRange: null,
  cardWidth: undefined,
};

const CardRangePicker = ({ i18n, timeRange: timeRangeProp, onCardAction, cardWidth }) => {
  const [timeRange, setTimeRange] = useState(timeRangeProp);
  // maps the timebox internal label to a translated string
  const timeBoxLabels = {
    last24Hours: i18n.last24HoursLabel,
    last7Days: i18n.last7DaysLabel,
    lastMonth: i18n.lastMonthLabel,
    lastQuarter: i18n.lastQuarterLabel,
    lastYear: i18n.lastYearLabel,
    thisWeek: i18n.thisWeekLabel,
    thisMonth: i18n.thisMonthLabel,
    thisQuarter: i18n.thisQuarterLabel,
    thisYear: i18n.thisYearLabel,
  };

  const handleTimeRange = useCallback(
    value => {
      onCardAction('CHANGE_TIME_RANGE', { range: value });
      setTimeRange(value);
    },
    [setTimeRange, onCardAction]
  );

  return (
    <div className={`${iotPrefix}--card--toolbar-date-range-wrapper`}>
      <ToolbarItem>
        {cardWidth > 400 ? (
          <div id="timeRange" className={`${iotPrefix}--card--toolbar-timerange-label`}>
            {timeBoxLabels[timeRange] || i18n.defaultLabel}
          </div>
        ) : null}

        <OverflowMenu
          className={classnames(`${iotPrefix}--card--toolbar-date-range-action`)}
          flipped
          title={i18n.selectTimeRangeLabel}
          iconDescription={i18n.selectTimeRangeLabel}
          menuOptionsClass={`${iotPrefix}--card--overflow`}
          renderIcon={EventSchedule16}
        >
          <OverflowMenuItem
            key="default"
            onClick={() => handleTimeRange('default')}
            itemText={i18n.defaultLabel}
            className={classnames({
              [`${iotPrefix}--card--overflow-menuitem-active`]:
                timeRange === '' || isNil(timeRange),
            })}
            primaryFocus
          />
          {Object.keys(timeBoxLabels)
            .filter(i => i.includes('last'))
            .map((i, index) => (
              <OverflowMenuItem
                key={i}
                hasDivider={index === 0}
                onClick={() => handleTimeRange(i)}
                itemText={timeBoxLabels[i]}
                className={classnames({
                  [`${iotPrefix}--card--overflow-menuitem-active`]: timeRange === i,
                })}
              />
            ))}
          {Object.keys(timeBoxLabels)
            .filter(i => i.includes('this'))
            .map((i, index) => (
              <OverflowMenuItem
                key={i}
                hasDivider={index === 0}
                onClick={() => handleTimeRange(i)}
                itemText={timeBoxLabels[i]}
                className={classnames({
                  [`${iotPrefix}--card--overflow-menuitem-active`]: timeRange === i,
                })}
              />
            ))}
        </OverflowMenu>
      </ToolbarItem>
    </div>
  );
};

CardRangePicker.propTypes = CardRangePickerPropTypes;
CardRangePicker.defaultProps = defaultProps;
export default CardRangePicker;
