import React from 'react';
import PropTypes from 'prop-types';
import { Button, DataTable } from 'carbon-components-react';
import styled from 'styled-components';

import { RowActionPropTypes } from '../TablePropTypes';
import { COLORS } from '../../../styles/styles';

const { TableCell } = DataTable;

const RowActionsContainer = styled.div`
  & {
    display: flex;
    justify-content: flex-end;
    opacity: ${props => (props.visible ? 1 : 0)};
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
  children: RowActionPropTypes,
  /** Callback called if a row action is clicked */
  onApplyRowAction: PropTypes.func.isRequired,
};

const defaultProps = {
  isRowExpanded: true,
  children: null,
};

const RowActionsCell = ({ isRowExpanded, id, children, onApplyRowAction }) =>
  children && children.length > 0 ? (
    <TableCell key={`${id}-row-actions-cell`}>
      <RowActionsContainer visible={isRowExpanded}>
        {children
          .filter(action => !action.isOverflow)
          .map(action => (
            <RowActionButton
              key={`${id}-row-actions-button-${action.id}`}
              kind="ghost"
              icon={action.icon}
              disabled={action.disabled}
              onClick={e => {
                onApplyRowAction(id, action.id);
                e.preventDefault();
                e.stopPropagation();
              }}
              small
              hideLabel={`${!action.labelText}`}
              isRowExpanded={isRowExpanded}>
              {action.labelText}
            </RowActionButton>
          ))}
      </RowActionsContainer>
    </TableCell>
  ) : null;

RowActionsCell.propTypes = propTypes;
RowActionsCell.defaultProps = defaultProps;

export default RowActionsCell;
