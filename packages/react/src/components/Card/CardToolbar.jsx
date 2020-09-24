import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import { Close16, Popup16 } from '@carbon/icons-react';
import { OverflowMenu, OverflowMenuItem, Button } from 'carbon-components-react';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';
import { TimeRangeOptionsPropTypes } from '../../constants/CardPropTypes';
import { CARD_ACTIONS } from '../../constants/LayoutConstants';

import CardRangePicker, { CardRangePickerPropTypes } from './CardRangePicker';

const { iotPrefix, prefix } = settings;

const ToolbarSVGWrapper = props => {
  return (
    <Button
      kind="ghost"
      className={classnames(
        `${iotPrefix}--card--toolbar-action`,
        `${iotPrefix}--card--toolbar-svg-wrapper`,
        `${prefix}--btn--icon-only` // can't actually use the hasIconOnly prop because we don't want the tooltip
      )}
      {...props}
    />
  );
};

const propTypes = {
  /** set of available actions for the card */
  availableActions: PropTypes.objectOf(PropTypes.bool).isRequired,
  /** is the card editable */
  isEditable: PropTypes.bool,
  /** is the card expanded */
  isExpanded: PropTypes.bool,
  /**
   * Define the icon render to be rendered.
   * Can be a React component class
   */
  renderExpandIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  className: PropTypes.string,
  ...omit(CardRangePickerPropTypes, 'onClose'),
  /** Generates the available time range selection options. Each option should include 'this' or 'last'.
   * i.e. { thisWeek: 'This week', lastWeek: 'Last week'}
   */
  timeRangeOptions: TimeRangeOptionsPropTypes, // eslint-disable-line react/require-default-props
};

const defaultProps = {
  isEditable: false,
  isExpanded: false,
  renderExpandIcon: Popup16,
  className: null,
  timeRangeOptions: null,
};

const CardToolbar = ({
  i18n,
  width,
  isEditable,
  isExpanded,
  renderExpandIcon,
  availableActions,
  timeRange,
  timeRangeOptions: timeRangeOptionsProp,
  onCardAction,
  className,
}) => {
  // maps the timebox internal label to a translated string
  // Need the default here in case that the CardToolbar is used by multiple different components
  // Also needs to reassign itself if i18n changes
  const timeRangeOptions = useMemo(
    () =>
      timeRangeOptionsProp || {
        last24Hours: i18n.last24HoursLabel,
        last7Days: i18n.last7DaysLabel,
        lastMonth: i18n.lastMonthLabel,
        lastQuarter: i18n.lastQuarterLabel,
        lastYear: i18n.lastYearLabel,
        thisWeek: i18n.thisWeekLabel,
        thisMonth: i18n.thisMonthLabel,
        thisQuarter: i18n.thisQuarterLabel,
        thisYear: i18n.thisYearLabel,
      },
    [
      i18n.last24HoursLabel,
      i18n.last7DaysLabel,
      i18n.lastMonthLabel,
      i18n.lastQuarterLabel,
      i18n.lastYearLabel,
      i18n.thisMonthLabel,
      i18n.thisQuarterLabel,
      i18n.thisWeekLabel,
      i18n.thisYearLabel,
      timeRangeOptionsProp,
    ]
  );

  return isEditable ? (
    <div className={classnames(className, `${iotPrefix}--card--toolbar`)}>
      {(availableActions.edit || availableActions.clone || availableActions.delete) && (
        <OverflowMenu flipped title={i18n.overflowMenuDescription}>
          {availableActions.edit && (
            <OverflowMenuItem
              onClick={() => {
                onCardAction(CARD_ACTIONS.EDIT_CARD);
              }}
              itemText={i18n.editCardLabel}
            />
          )}
          {availableActions.clone && (
            <OverflowMenuItem
              onClick={() => {
                onCardAction(CARD_ACTIONS.CLONE_CARD);
              }}
              itemText={i18n.cloneCardLabel}
            />
          )}
          {availableActions.delete && (
            <OverflowMenuItem
              isDelete
              onClick={() => {
                onCardAction(CARD_ACTIONS.DELETE_CARD);
              }}
              itemText={i18n.deleteCardLabel}
            />
          )}
        </OverflowMenu>
      )}
    </div>
  ) : (
    <div className={classnames(className, `${iotPrefix}--card--toolbar`)}>
      {availableActions.range ? (
        <CardRangePicker
          width={width}
          i18n={i18n}
          timeRange={timeRange}
          timeRangeOptions={timeRangeOptions}
          onCardAction={onCardAction}
          cardWidth={width}
        />
      ) : null}
      {availableActions.expand ? (
        <>
          {isExpanded ? (
            <ToolbarSVGWrapper
              title={i18n.closeLabel}
              onClick={() => onCardAction(CARD_ACTIONS.CLOSE_EXPANDED_CARD)}
              iconDescription={i18n.closeLabel}
              renderIcon={Close16}
            />
          ) : (
            <ToolbarSVGWrapper
              title={i18n.expandLabel}
              onClick={() => {
                onCardAction(CARD_ACTIONS.OPEN_EXPANDED_CARD);
              }}
              iconDescription={i18n.expandLabel}
              renderIcon={renderExpandIcon}
            />
          )}
        </>
      ) : null}
    </div>
  );
};

CardToolbar.propTypes = propTypes;
CardToolbar.defaultProps = defaultProps;
export default CardToolbar;
