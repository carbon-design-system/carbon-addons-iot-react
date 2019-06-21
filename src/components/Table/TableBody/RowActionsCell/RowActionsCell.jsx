import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  DataTable,
  OverflowMenu,
  OverflowMenuItem,
  Icon,
  Loading,
} from 'carbon-components-react';
import styled from 'styled-components';

import { RowActionPropTypes, RowActionErrorPropTypes } from '../../TablePropTypes';
import { COLORS } from '../../../../styles/styles';

import RowActionsError from './RowActionsError';

const { TableCell } = DataTable;

const RowActionsContainer = styled.div`
  &&& {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    /* Need space between the buttons */
    > * {
      opacity: ${props => (props.visible ? 1 : 0)};
      margin-left: 0.75rem;
    }
    /* If the actions are focused on, they should show up */
    > *:focus {
      opacity: 1;
    }
    color: ${props => (props.isRowExpanded ? COLORS.white : '')};
    svg {
      stroke: ${props => (props.isRowExpanded ? COLORS.white : '')};
    }
    /* the spinner was a little too big and causing the row to scroll so need to scale down a bit */
    .bx--loading--small {
      width: 1.875rem;
      height: 1.875rem;
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
    color: ${props => (props.isRowExpanded ? COLORS.white : '')};
    svg {
      fill: ${props => (props.isRowExpanded ? COLORS.white : '')};
      margin-left: ${props => (props.hideLabel !== 'false' ? '0' : '')};
    }
    opacity: ${props => (props.isOpen || props.isRowExpanded ? 1 : 0)};
  }
  &&&:hover > svg {
    fill: ${COLORS.blue};
  }
`;

// Don't pass through the isRowExpanded or hideLabel prop to the button
const RowActionButton = styled(({ isRowExpanded, hideLabel, isOverflow, ...other }) => (
  <Button {...other} />
))`
  &&& {
    color: ${props => (props.isRowExpanded ? COLORS.white : '')};
    svg {
      fill: ${props => (props.isRowExpanded ? COLORS.white : '')};
      margin-left: ${props => (props.hideLabel !== 'false' ? '0' : '')};
    }
    :hover,
    :focus {
      color: ${props => (!props.isRowExpanded ? COLORS.white : '')};
      svg {
        fill: ${props => (!props.isRowExpanded ? COLORS.white : '')};
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
  overflowMenuAria: PropTypes.string,
  /** Is a row action actively running */
  isRowActionRunning: PropTypes.bool,
  /** row action error out */
  rowActionsError: RowActionErrorPropTypes,
  onClearError: PropTypes.func,
  /** I18N label for in progress */
  inProgressText: PropTypes.string,
  /** I18N label for action failed */
  actionFailedText: PropTypes.string, // eslint-disable-line
  /** I18N label for learn more */
  learnMoreText: PropTypes.string, // eslint-disable-line
  /** I18N label for dismiss */
  dismissText: PropTypes.string, // eslint-disable-line
};

const defaultProps = {
  isRowExpanded: false,
  actions: null,
  isRowActionRunning: false,
  rowActionsError: null,
  overflowMenuAria: 'More actions',
  inProgressText: 'In progress',
  onClearError: null,
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
    const {
      isRowExpanded,
      id,
      actions,
      onApplyRowAction,
      overflowMenuAria,
      actionFailedText,
      learnMoreText,
      dismissText,
      isRowActionRunning,
      rowActionsError,
      onClearError,
      inProgressText,
    } = this.props;
    const { isOpen } = this.state;
    const hasOverflow = actions && actions.filter(action => action.isOverflow).length > 0;
    return actions && actions.length > 0 ? (
      <TableCell key={`${id}-row-actions-cell`}>
        <RowActionsContainer
          visible={isRowExpanded || isRowActionRunning || rowActionsError}
          isRowExpanded={isRowExpanded}
        >
          {rowActionsError ? (
            <RowActionsError
              actionFailedText={actionFailedText}
              learnMoreText={learnMoreText}
              dismissText={dismissText}
              rowActionsError={rowActionsError}
              onClearError={onClearError}
            />
          ) : isRowActionRunning ? (
            <Fragment>
              <Loading small withOverlay={false} />
              {inProgressText}
            </Fragment>
          ) : (
            <Fragment>
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
                    isRowExpanded={isRowExpanded}
                  >
                    {labelText}
                  </RowActionButton>
                ))}
              {hasOverflow ? (
                <StyledOverflowMenu
                  floatingMenu
                  flipped
                  ariaLabel={overflowMenuAria}
                  onClick={event => event.stopPropagation()}
                  isRowExpanded={isRowExpanded}
                  iconDescription={overflowMenuAria}
                  isOpen={isOpen}
                  onOpen={this.handleOpen}
                  onClose={this.handleClose}
                >
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
                        disabled={action.disabled}
                      />
                    ))}
                </StyledOverflowMenu>
              ) : null}
            </Fragment>
          )}
        </RowActionsContainer>
      </TableCell>
    ) : null;
  }
}

RowActionsCell.propTypes = propTypes;
RowActionsCell.defaultProps = defaultProps;

export default RowActionsCell;
