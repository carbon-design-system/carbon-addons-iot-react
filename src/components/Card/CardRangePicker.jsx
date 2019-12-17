import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import EventSchedule from '@carbon/icons-react/lib/event--schedule/20';

import { ToolbarItem, OverflowMenu, OverflowMenuItem } from '../..';

const TimeRangeLabel = styled.span`
  font-size: 0.875rem;
  font-weight: normal;
`;

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
  i18n: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.func])).isRequired,
};

const defaultProps = {
  timeRange: null,
};

const CardRangePicker = ({ i18n, timeRange: timeRangeProp, onCardAction }) => {
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
    <ToolbarItem>
      <TimeRangeLabel id="timeRange" className="card--toolbar-timerange-lable">
        {timeBoxLabels[timeRange]}
      </TimeRangeLabel>
      <OverflowMenu
        iconDescription={timeBoxLabels[timeRange]}
        className="card--toolbar-action"
        flipped
        title={i18n.overflowMenuDescription}
        menuOptionsClass="card--overflow"
        renderIcon={EventSchedule}
      >
        <OverflowMenuItem
          key="default"
          onClick={() => handleTimeRange('default')}
          itemText={i18n.defaultLabel}
        />
        {Object.keys(timeBoxLabels)
          .filter(i => i.includes('last'))
          .map((i, index) => (
            <OverflowMenuItem
              key={i}
              hasDivider={index === 0}
              onClick={() => handleTimeRange(i)}
              itemText={timeBoxLabels[i]}
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
            />
          ))}
      </OverflowMenu>
    </ToolbarItem>
  );
};

CardRangePicker.propTypes = CardRangePickerPropTypes;
CardRangePicker.defaultProps = defaultProps;
export default CardRangePicker;
