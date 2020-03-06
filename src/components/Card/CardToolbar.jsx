import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import styled from 'styled-components';
import { Close20, Popup20 } from '@carbon/icons-react';
import { OverflowMenu, OverflowMenuItem } from 'carbon-components-react';
import classNames from 'classnames';

import { CARD_ACTIONS } from '../../constants/LayoutConstants';

import CardRangePicker, { CardRangePickerPropTypes } from './CardRangePicker';

export const ToolbarSVGWrapper = styled.button`
  &&& {
    align-items: center;
    background: transparent;
    border: none;
    display: flex;
    cursor: pointer;
    height: 3rem;
    width: 3rem;
    outline: 2px solid transparent;
    margin: 0;

    :hover {
      background: #e5e5e5;
    }

    &:active,
    &:focus {
      outline: 2px solid #0062ff;
      outline-offset: -2px;
    }
  }
`;

// We need a special div to handle the date label
const ToolbarDateRangeWrapper = styled.div`
  &&& {
    background: transparent;
    border: none;
    display: flex;
    outline: 2px solid transparent;

    .card--toolbar-timerange-label {
      white-space: nowrap;
      min-height: 3rem;
      min-width: 3rem;
      padding: 1rem;
    }

    .card--toolbar-action {
      min-height: 3rem;
      min-width: 3rem;
      cursor: pointer;
      &:active,
      &:focus {
        outline: 2px solid #0062ff;
        outline-offset: -2px;
      }
      &:hover {
        background: #e5e5e5;
      }
    }
  }
`;

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
    <div className={classNames(className, 'card--toolbar')}>
      {(availableActions.edit || availableActions.clone || availableActions.delete) && (
        <ToolbarDateRangeWrapper>
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
        </ToolbarDateRangeWrapper>
      )}
    </div>
  ) : (
    <div className={classNames(className, 'card--toolbar')}>
      {availableActions.range ? (
        <ToolbarDateRangeWrapper>
          <CardRangePicker
            width={width}
            i18n={i18n}
            timeRange={timeRange}
            onCardAction={onCardAction}
          />
        </ToolbarDateRangeWrapper>
      ) : null}
      {availableActions.expand ? (
        <>
          {isExpanded ? (
            <ToolbarSVGWrapper
              className="card--toolbar-action"
              onClick={() => onCardAction(CARD_ACTIONS.CLOSE_EXPANDED_CARD)}
            >
              <Close20 title={i18n.closeLabel} description={i18n.closeLabel} />
            </ToolbarSVGWrapper>
          ) : (
            <ToolbarSVGWrapper
              className="card--toolbar-action"
              onClick={() => {
                onCardAction(CARD_ACTIONS.OPEN_EXPANDED_CARD);
              }}
            >
              <Popup20 title={i18n.expandLabel} description={i18n.expandLabel} />
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
