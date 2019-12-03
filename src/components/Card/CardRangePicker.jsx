import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChevronDown16 from '@carbon/icons-react/lib/chevron--down/16';
import { ToolbarItem, OverflowMenu, OverflowMenuItem } from 'carbon-components-react';

const StyledOverflowMenu = styled(OverflowMenu)`
  & svg.bx--overflow-menu__icon {
    padding: 0;
  }
`;

const TimeRangeLabel = styled.span`
  font-size: 0.875rem;
  font-weight: normal;
`;

export const CardRangePickerPropTypes = {
  /** width of the card in pixels */
  width: PropTypes.number,
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
  width: 0,
};

const CardRangePicker = ({ i18n, width, timeRange: timeRangeProp, onCardAction }) => {
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

  return (
    <ToolbarItem>
      <TimeRangeLabel id="timeRange">{timeBoxLabels[timeRange]}</TimeRangeLabel>
      <StyledOverflowMenu
        floatingMenu
        renderIcon={ChevronDown16}
        iconDescription={width < 230 ? timeBoxLabels[timeRange] : i18n.overflowMenuDescription}
      >
        <OverflowMenuItem
          key="default"
          onClick={() => {
            onCardAction('CHANGE_TIME_RANGE', { range: 'default' });
            setTimeRange('default');
          }}
          itemText={i18n.defaultLabel}
        />
        {Object.keys(timeBoxLabels)
          .filter(i => i.includes('last'))
          .map((i, index) => (
            <OverflowMenuItem
              key={i}
              hasDivider={index === 0}
              onClick={() => {
                onCardAction('CHANGE_TIME_RANGE', { range: i });
                setTimeRange(i);
              }}
              itemText={timeBoxLabels[i]}
            />
          ))}
        {Object.keys(timeBoxLabels)
          .filter(i => i.includes('this'))
          .map((i, index) => (
            <OverflowMenuItem
              key={i}
              hasDivider={index === 0}
              onClick={() => {
                onCardAction('CHANGE_TIME_RANGE', { range: i });
                setTimeRange(i);
              }}
              itemText={timeBoxLabels[i]}
            />
          ))}
      </StyledOverflowMenu>
    </ToolbarItem>
  );
};

CardRangePicker.propTypes = CardRangePickerPropTypes;
CardRangePicker.defaultProps = defaultProps;
export default CardRangePicker;
