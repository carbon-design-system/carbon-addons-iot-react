import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import styled from 'styled-components';
import Close16 from '@carbon/icons-react/lib/close/16';
import Popup20 from '@carbon/icons-react/lib/popup/20';
import {
  Toolbar,
  ToolbarItem,
  OverflowMenu,
  OverflowMenuItem,
  Button,
} from 'carbon-components-react';

import CardRangePicker, { CardRangePickerPropTypes } from './CardRangePicker';

const TinyButton = styled(Button)`
  &.bx--btn > svg {
    margin: 0;
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
    <Toolbar className="card--toolbar">
      {(availableActions.edit || availableActions.clone || availableActions.delete) && (
        <ToolbarItem>
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
        </ToolbarItem>
      )}
    </Toolbar>
  ) : (
    <Toolbar className="card--toolbar">
      {availableActions.range ? (
        <CardRangePicker
          width={width}
          i18n={i18n}
          timeRange={timeRange}
          onCardAction={onCardAction}
        />
      ) : null}
      {availableActions.expand ? (
        <ToolbarItem>
          {isExpanded ? (
            <TinyButton
              kind="ghost"
              small
              renderIcon={Close16}
              className="card--toolbar-action"
              iconDescription={i18n.closeLabel}
              title={i18n.closeLabel}
              onClick={() => onCardAction('CLOSE_EXPANDED_CARD')}
            />
          ) : (
            <TinyButton
              kind="ghost"
              small
              renderIcon={Popup20}
              className="card--toolbar-action"
              iconDescription={i18n.expandLabel}
              title={i18n.expandLabel}
              onClick={() => {
                onCardAction('OPEN_EXPANDED_CARD');
              }}
            />
          )}
        </ToolbarItem>
      ) : null}
    </Toolbar>
  );
};

CardToolbar.propTypes = propTypes;
CardToolbar.defaultProps = defaultProps;
export default CardToolbar;
