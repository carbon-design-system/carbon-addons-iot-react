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

const ColumnHeaderSelect = ({
  connectDragSource,
  connectDropTarget,
  columnId,
  isHidden,
  children,
  onClick,
}) => {
  const item = (
    <span
      style={{
        background: '#ffffff',
        margin: '16px',
        padding: '10px 0px 12px 10px',
        border: 'solid 2px #3D70B2',
        borderRadius: '2px',
        fontSize: '14px',
        cursor: 'move',
        color: '#3D70B2',
        opacity: isHidden ? '.5' : '1',
      }}
      key={columnId}
      onClick={() => onClick()}
      role="presentation">
      {children}
      <IconStyled icon={iconDraggable} description="Dragable column" focusable="false" />
    </span>
  );
  return connectDragSource(connectDropTarget(item));
};

ColumnHeaderSelect.propTypes = {
  columnId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  moveItem: PropTypes.func.isRequired,
};

ColumnHeaderSelect.defaultProps = {
  isHidden: false,
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
