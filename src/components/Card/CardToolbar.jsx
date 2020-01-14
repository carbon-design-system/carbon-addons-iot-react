import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import styled from 'styled-components';
import Close16 from '@carbon/icons-react/lib/close/16';
import Popup16 from '@carbon/icons-react/lib/popup/16';
import { OverflowMenu, OverflowMenuItem } from 'carbon-components-react';

import CardRangePicker, { CardRangePickerPropTypes } from './CardRangePicker';

export const ToolbarSVGWrapper = styled.button`
  &&& {
    background: transparent;
    border: none;
    display: flex;
    cursor: pointer;
    height: 3rem;
    width: 3rem;
    padding: 1rem;
    outline: 2px solid transparent;

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
  ...omit(CardRangePickerPropTypes, 'onClose'),
};
const defaultProps = {
  isEditable: false,
  isExpanded: false,
};
const CardToolbar = ({
  i18n,
  width,
  isEditable,
  isExpanded,
  availableActions,
  timeRange,
  onCardAction,
}) => {
  return isEditable ? (
    <div className="card--toolbar">
      {(availableActions.edit || availableActions.clone || availableActions.delete) && (
        <ToolbarDateRangeWrapper>
          <OverflowMenu flipped title={i18n.overflowMenuDescription}>
            {availableActions.edit && (
              <OverflowMenuItem
                onClick={() => {
                  onCardAction('EDIT_CARD');
                }}
                itemText={i18n.editCardLabel}
              />
            )}
            {availableActions.clone && (
              <OverflowMenuItem
                onClick={() => {
                  onCardAction('CLONE_CARD');
                }}
                itemText={i18n.cloneCardLabel}
              />
            )}
            {availableActions.delete && (
              <OverflowMenuItem
                isDelete
                onClick={() => {
                  onCardAction('DELETE_CARD');
                }}
                itemText={i18n.deleteCardLabel}
              />
            )}
          </OverflowMenu>
        </ToolbarDateRangeWrapper>
      )}
    </div>
  ) : (
    <div className="card--toolbar">
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
            <ToolbarSVGWrapper onClick={() => onCardAction('CLOSE_EXPANDED_CARD')}>
              <Close16 title={i18n.closeLabel} description={i18n.closeLabel} />
            </ToolbarSVGWrapper>
          ) : (
            <ToolbarSVGWrapper
              onClick={() => {
                onCardAction('OPEN_EXPANDED_CARD');
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
