import React from 'react';
import { DropTarget } from 'react-dnd';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { settings } from '../../../constants/Settings';

const { iotPrefix } = settings;

export const TargetSize = {
  Third: 'third',
  Half: 'half',
  Full: 'full',
};

const ListTargetPropTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool,
  targetPosition: PropTypes.string.isRequired,
  targetSize: PropTypes.oneOf([TargetSize.Third, TargetSize.Half, TargetSize.Full]),
  // eslint-disable-next-line react/no-unused-prop-types
  targetOverride: PropTypes.string,
};

const ListTargetDefaultProps = {
  isOver: false,
  targetSize: TargetSize.Third,
  targetOverride: null,
};

const ListTarget = ({ connectDropTarget, targetPosition, targetSize, isOver }) => {
  let height = 33; // defaults to TargetSize.Third

  if (targetSize === TargetSize.Full) {
    height = 100;
  } else if (targetSize === TargetSize.Half) {
    height = 50;
  }

  return (
    <div
      data-testid="list-target"
      className={classnames(`${iotPrefix}--list-item-editable--drop-target-${targetPosition}`, {
        [`${iotPrefix}--list-item-editable--drop-target-${targetPosition}__over`]: isOver,
      })}
      style={{
        height: `${height}%`,
      }}
      ref={instance => {
        if (connectDropTarget) {
          connectDropTarget(instance);
        }
      }}
    />
  );
};

/* istanbul ignore next */
const rowTarget = {
  drop(hoverProps, monitor) {
    const hoverId = hoverProps.id;
    const dragId = monitor.getItem().props.id;
    const target = hoverProps.targetOverride ?? hoverProps.targetPosition;

    // Check if drop is allowed
    if (hoverProps.itemWillMove(dragId, hoverId, target)) {
      hoverProps.onItemMoved(dragId, hoverId, target);
    }
  },
};

/* istanbul ignore next */
const dt = DropTarget('ListItem', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true }),
  isMovingUp: monitor.getDifferenceFromInitialOffset()?.y <= 0,
}));

ListTarget.propTypes = ListTargetPropTypes;
ListTarget.defaultProps = ListTargetDefaultProps;

export default dt(ListTarget);
