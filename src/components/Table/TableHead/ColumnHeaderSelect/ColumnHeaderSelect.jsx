import React from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { Button } from 'carbon-components-react';
import Draggable from '@carbon/icons-react/es/draggable/16';
import classNames from 'classnames';

const ColumnHeaderSelect = ({
  connectDragSource,
  connectDropTarget,
  columnId,
  isHidden,
  children,
  onClick,
  isOver,
}) => {
  return (
    <Button
      className={classNames('column-header__btn', 'column-header__select', {
        'column-header__select--hidden': isHidden,
        'column-header__select--isOver': isOver,
      })}
      kind="secondary"
      key={columnId}
      onClick={() => onClick()}
      role="presentation"
      data-ishidden={isHidden}
      renderIcon={Draggable}
      size="small"
      ref={instance => {
        connectDragSource(instance);
        connectDropTarget(instance);
      }}
    >
      {children}
    </Button>
  );
};

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
  drop(props, monitor) {
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
