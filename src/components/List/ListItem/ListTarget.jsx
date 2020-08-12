import React from 'react';
import { DropTarget } from 'react-dnd';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { settings } from '../../../constants/Settings';

import { ItemType } from './ListItem';

const { iotPrefix } = settings;

const ListTargetPropTypes = {
  id: PropTypes.string.isRequired,
  targetPosition: PropTypes.string.isRequired,
  onItemMoved: PropTypes.func.isRequired,
  itemWillMove: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
};

const ListTarget = ({ connectDropTarget, targetPosition, isOver }) => {
  return (
    <div
      className={classnames(`${iotPrefix}--list-item-editable--drop-target-${targetPosition}`, {
        [`${iotPrefix}--list-item-editable--drop-target-${targetPosition}__over`]: isOver,
      })}
      ref={instance => {
        if (connectDropTarget) {
          connectDropTarget(instance);
        }
      }}
    />
  );
};

const rowTarget = {
  drop(hoverProps, monitor) {
    const hoverId = hoverProps.id;
    const dragId = monitor.getItem().props.id;
    const target = hoverProps.targetPosition;

    // Check if drop is allowed
    if (hoverProps.itemWillMove(dragId, hoverId, target)) {
      hoverProps.onItemMoved(dragId, hoverId, target);
    }
  },
};

const dt = DropTarget('ListItem', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true }),
  isMovingUp: monitor.getDifferenceFromInitialOffset()?.y <= 0,
}));

ListTarget.propTypes = ListTargetPropTypes;

export default dt(ListTarget);
