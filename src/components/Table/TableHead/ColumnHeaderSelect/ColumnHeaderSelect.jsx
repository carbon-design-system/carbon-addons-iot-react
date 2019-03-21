import React from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import styled from 'styled-components';
import { Icon } from 'carbon-components-react';
import { iconDraggable } from 'carbon-icons';

const IconStyled = styled(Icon)`
   {
    margin-right: 12px;
    vertical-align: middle;
    margin-left: 18px;
  }
`;

const StyledColumnSelectContainer = styled.span`
  & {
    background: #fff;
    margin: 16px;
    padding: 10px 0px 12px 10px;
    border: solid 2px #3d70b2;
    borderradius: 2px;
    fontsize: 14px;
    cursor: move;
    color: #3d70b2;
    opacity: ${props => (props.isHidden ? 0.5 : 1)};
  }
`;

const ColumnHeaderSelect = ({
  connectDragSource,
  connectDropTarget,
  columnId,
  isHidden,
  children,
  onClick,
}) => (
  <StyledColumnSelectContainer
    key={columnId}
    onClick={() => onClick()}
    role="presentation"
    isHidden={isHidden}
    ref={instance => {
      connectDragSource(instance);
      connectDropTarget(instance);
    }}>
    {children}
    <IconStyled icon={iconDraggable} description="Dragable column" focusable="false" />
  </StyledColumnSelectContainer>
);

ColumnHeaderSelect.propTypes = {
  columnId: PropTypes.string.isRequired,
  isHidden: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
  onClick: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  /* these props come from react-dnd */
  index: PropTypes.number.isRequired, // eslint-disable-line
  isOver: PropTypes.bool.isRequired, // eslint-disable-line
  moveItem: PropTypes.func.isRequired, // eslint-disable-line
};

ColumnHeaderSelect.defaultProps = {
  isHidden: false,
  children: [],
};

const cardSource = {
  /**
   * Implements the drag source contract.
   */
  beginDrag(props) {
    return {
      id: props.columnId,
      index: props.index,
    };
  },
};

const cardTarget = {
  hover(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
    props.moveItem(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex; // eslint-disable-line no-param-reassign
  },
};

const ds = DragSource('ColumnHeaderSelect', cardSource, connect => ({
  connectDragSource: connect.dragSource(),
}));

const dt = DropTarget('ColumnHeaderSelect', cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}));

ColumnHeaderSelect.displayName = 'ColumnHeaderSelect';

export default ds(dt(ColumnHeaderSelect));
