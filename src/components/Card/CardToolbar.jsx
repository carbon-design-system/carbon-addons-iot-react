import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import { Close16, Popup16 } from '@carbon/icons-react';
import { OverflowMenu, OverflowMenuItem } from 'carbon-components-react';
import classNames from 'classnames';

import { settings } from '../../constants/Settings';
import { CARD_ACTIONS } from '../../constants/LayoutConstants';

import CardRangePicker, { CardRangePickerPropTypes } from './CardRangePicker';

const { iotPrefix } = settings;

const ToolbarSVGWrapper = props => {
  const { children, onClick } = props;
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        `${iotPrefix}--card--toolbar-action`,
        `${iotPrefix}--card--toolbar-svg-wrapper`
      )}
    >
      {children}
    </button>
  );
};
ToolbarSVGWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

const propTypes = {
  /** set of available actions for the card */
  availableActions: PropTypes.objectOf(PropTypes.bool).isRequired,
  /** is the card editable */
  isEditable: PropTypes.bool,
  /** is the card expanded */
  isExpanded: PropTypes.bool,
  className: PropTypes.string,
  ...omit(CardRangePickerPropTypes, 'onClose'),
};
const defaultProps = {
  isEditable: false,
  isExpanded: false,
  className: null,
};
const CardToolbar = ({
  i18n,
  width,
  isEditable,
  isExpanded,
  availableActions,
  timeRange,
  onCardAction,
  className,
}) => {
  return isEditable ? (
    <div className={classNames(className, `${iotPrefix}--card--toolbar`)}>
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
    <div className={classNames(className, `${iotPrefix}--card--toolbar`)}>
      {availableActions.range ? (
        <CardRangePicker
          width={width}
          i18n={i18n}
          timeRange={timeRange}
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
            >
              <Close16 title={i18n.closeLabel} description={i18n.closeLabel} />
            </ToolbarSVGWrapper>
          ) : (
            <ToolbarSVGWrapper
              title={i18n.expandLabel}
              onClick={() => {
                onCardAction(CARD_ACTIONS.OPEN_EXPANDED_CARD);
              }}
            >
              <Popup16 title={i18n.expandLabel} description={i18n.expandLabel} />
            </ToolbarSVGWrapper>
          )}
        </>
      ) : null}
    </div>
  );
};

CardToolbar.propTypes = propTypes;
CardToolbar.defaultProps = defaultProps;
export default CardToolbar;
