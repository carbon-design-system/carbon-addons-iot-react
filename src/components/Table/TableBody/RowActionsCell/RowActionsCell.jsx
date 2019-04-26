import React from 'react';
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
    > * {
      opacity: ${props => (props.visible ? 1 : 0)};
    }
  }
`;

const OverflowMenuContent = styled.div`
  & {
    display: flex;
    align-items: center;
  }
`;

const StyledIcon = styled(Icon)`
  & {
    margin-right: 0.5rem;
    width: 1rem;
  }
`;

const StyledOverflowMenu = styled(({ isRowExpanded, isOpen, ...other }) => (
  <OverflowMenu {...other} />
))`
  &&& {
    margin-left: 0.5rem;
    color: ${props => (props.isRowExpanded ? COLORS.white : COLORS.darkGray)};
    svg {
      fill: ${props => (props.isRowExpanded ? COLORS.white : COLORS.darkGray)};
      margin-left: ${props => (props.hideLabel !== 'false' ? '0' : '')};
    }
    opacity: ${props => (props.isOpen || props.isRowExpanded ? 1 : 0)};
  }
`;

// Don't pass through the isRowExpanded or hideLabel prop to the button
const RowActionButton = styled(({ isRowExpanded, hideLabel, isOverflow, ...other }) => (
  <Button {...other} />
))`
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
  overflowMenuText: PropTypes.string,
};

const defaultProps = {
  isRowExpanded: false,
  actions: null,
  overflowMenuText: 'More actions',
};

const onClick = (e, id, action, onApplyRowAction) => {
  onApplyRowAction(action, id);
  e.preventDefault();
  e.stopPropagation();
};

class RowActionsCell extends React.Component {
  state = {
    isOpen: false,
  };

  handleOpen = () => {
    const { isOpen } = this.state;
    if (!isOpen) {
      this.setState({ isOpen: true });
    }
  };

  handleClose = () => {
    const { isOpen } = this.state;
    if (isOpen) {
      this.setState({ isOpen: false });
    }
  };

  render() {
    const { isRowExpanded, id, actions, onApplyRowAction, overflowMenuText } = this.props;
    const { isOpen } = this.state;
    const hasOverflow = actions && actions.filter(action => action.isOverflow).length > 0;
    return actions && actions.length > 0 ? (
      <TableCell key={`${id}-row-actions-cell`}>
        <RowActionsContainer visible={isRowExpanded}>
          {actions
            .filter(action => !action.isOverflow)
            .map(({ id: actionId, labelText, ...others }) => (
              <RowActionButton
                {...others}
                key={`${id}-row-actions-button-${actionId}`}
                kind="ghost"
                onClick={e => onClick(e, id, actionId, onApplyRowAction)}
                small
                hideLabel={`${!labelText}`}
                isRowExpanded={isRowExpanded}>
                {labelText}
              </RowActionButton>
            ))}
          {hasOverflow ? (
            <StyledOverflowMenu
              floatingMenu
              flipped
              ariaLabel={overflowMenuText}
              onClick={event => event.stopPropagation()}
              isRowExpanded={isRowExpanded}
              iconDescription={overflowMenuText}
              isOpen={isOpen}
              onOpen={this.handleOpen}
              onClose={this.handleClose}>
              {actions
                .filter(action => action.isOverflow)
                .map(action => (
                  <OverflowMenuItem
                    key={`${id}-row-actions-button-${action.id}`}
                    onClick={e => onClick(e, id, action.id, onApplyRowAction)}
                    requireTitle
                    itemText={
                      action.icon ? (
                        <OverflowMenuContent>
                          <StyledIcon name={action.icon} iconTitle={action.labelText} />
                          {action.labelText}
                        </OverflowMenuContent>
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
  }
}

RowActionsCell.propTypes = propTypes;
RowActionsCell.defaultProps = defaultProps;

export default RowActionsCell;
