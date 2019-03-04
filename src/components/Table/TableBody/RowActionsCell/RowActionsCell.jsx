import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, DataTable, OverflowMenu, OverflowMenuItem, Icon } from 'carbon-components-react';
import styled from 'styled-components';

import { RowActionPropTypes } from '../../TablePropTypes';
import { COLORS } from '../../../../styles/styles';

const { TableCell } = DataTable;

const RowActionsContainer = styled.div`
  & {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    opacity: ${props => (props.visible ? 1 : 0)};
  }
`;

const StyledIcon = styled(Icon)`
  & {
    margin-right: 0.5rem;
  }
`;

const StyledOverflowMenu = styled(({ isRowExpanded, ...other }) => <OverflowMenu {...other} />)`
  &&& {
    margin-left: 0.5rem;
    color: ${props => (props.isRowExpanded ? COLORS.white : COLORS.darkGray)};
    svg {
      fill: ${props => (props.isRowExpanded ? COLORS.white : COLORS.darkGray)};
      margin-left: ${props => (props.hideLabel !== 'false' ? '0' : '')};
    }
  }
`;

// Don't pass through the isRowExpanded or hideLabel prop to the button
const RowActionButton = styled(({ isRowExpanded, hideLabel, ...other }) => <Button {...other} />)`
  &&& {
    color: ${props => (props.isRowExpanded ? COLORS.white : COLORS.darkGray)};
    svg {
      fill: ${props => (props.isRowExpanded ? COLORS.white : COLORS.darkGray)};
      margin-left: ${props => (props.hideLabel !== 'false' ? '0' : '')};
    }
    :hover {
      color: ${props => (!props.isRowExpanded ? COLORS.white : COLORS.darkGray)};
      svg {
        fill: ${props => (!props.isRowExpanded ? COLORS.white : COLORS.darkGray)};
      }
    }
  }
`;

const propTypes = {
  /** Need to render different styles if expanded */
  isRowExpanded: PropTypes.bool,
  /** Unique id for each row, passed back for each click */
  id: PropTypes.string.isRequired,
  /** Array with all the actions to render */
  actions: RowActionPropTypes,
  /** Callback called if a row action is clicked */
  onApplyRowAction: PropTypes.func.isRequired,
  /** translated text for more actions */
  moreActionsLabel: PropTypes.string,
};

const defaultProps = {
  isRowExpanded: false,
  actions: null,
  moreActionsLabel: 'More actions',
};

const onClick = (e, id, action, onApplyRowAction) => {
  onApplyRowAction(id, action);
  e.preventDefault();
  e.stopPropagation();
};

const RowActionsCell = ({ isRowExpanded, id, actions, onApplyRowAction, moreActionsLabel }) => {
  const hasOverflow = actions && actions.filter(action => action.isOverflow).length > 0;
  return actions && actions.length > 0 ? (
    <TableCell key={`${id}-row-actions-cell`}>
      <RowActionsContainer visible={isRowExpanded}>
        {actions
          .filter(action => !action.isOverflow)
          .map(action => (
            <RowActionButton
              key={`${id}-row-actions-button-${action.id}`}
              kind="ghost"
              icon={action.icon}
              disabled={action.disabled}
              onClick={e => onClick(e, id, action.id, onApplyRowAction)}
              small
              hideLabel={`${!action.labelText}`}
              isRowExpanded={isRowExpanded}>
              {action.labelText}
            </RowActionButton>
          ))}
        {hasOverflow ? (
          <StyledOverflowMenu
            floatingMenu
            ariaLabel={moreActionsLabel}
            onClick={event => event.stopPropagation()}
            isRowExpanded={isRowExpanded}
            iconDescription={moreActionsLabel}>
            {actions
              .filter(action => action.isOverflow)
              .map(action => (
                <OverflowMenuItem
                  key={`${id}-row-actions-button-${action.id}`}
                  onClick={e => onClick(e, id, action.id, onApplyRowAction)}
                  requireTitle
                  itemText={
                    action.icon ? (
                      <Fragment>
                        <StyledIcon name={action.icon} iconTitle={action.labelText} />
                        {action.labelText}
                      </Fragment>
                    ) : (
                      action.labelText
                    )
                  }
                  floatingMenu
                />
              ))}
          </StyledOverflowMenu>
        ) : null}
      </RowActionsContainer>
    </TableCell>
  ) : null;
};
RowActionsCell.propTypes = propTypes;
RowActionsCell.defaultProps = defaultProps;

export default RowActionsCell;
