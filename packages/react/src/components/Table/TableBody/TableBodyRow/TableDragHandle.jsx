import { Draggable } from '@carbon/react/icons';
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@carbon/react';

import { settings } from '../../../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  /**
   * Callback when a user mouse downs on the handle. That can start a DnD operation. The
   * `useTableDnd` does the real work of tracking the drag.
   */
  onStartDrag: PropTypes.func.isRequired,

  /**
   * The ID of the table row this handle is it. This is the row that will be dragged by this handle.
   */
  rowId: PropTypes.string.isRequired,

  /**
   * If a drag operation is currently in progress. When true, the tooltip is hidden.
   */
  isDragging: PropTypes.bool.isRequired,

  /**
   * Tooltip text to display on hover.
   */
  tooltipText: PropTypes.string.isRequired,
};

/**
 * Drag handle image the user needs to click and drag to start a drag and drop operation.
 */
const TableDragHandle = forwardRef(function TableDragHandle(
  { onStartDrag, rowId, isDragging, tooltipText },
  ref
) {
  return (
    <div
      className={`${iotPrefix}--table-drag-handle`}
      ref={ref}
      role="presentation"
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onStartDrag(e, rowId);
      }}
    >
      {isDragging ? (
        // During drag, render icon without tooltip
        <div className={`${iotPrefix}--table-drag-handle-icon`}>
          <Draggable />
        </div>
      ) : (
        // When not dragging, render with tooltip
        <Tooltip label={tooltipText} autoAlign>
          <Draggable />
        </Tooltip>
      )}
    </div>
  );
});

TableDragHandle.propTypes = propTypes;

export { TableDragHandle };
