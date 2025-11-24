import React, { useState, useImperativeHandle } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { settings } from '../../../constants/Settings';

import { MIN_COLUMN_WIDTH } from './columnWidthUtilityFunctions';

const propTypes = {
  currentColumnWidths: PropTypes.objectOf(
    PropTypes.shape({
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      id: PropTypes.string,
    })
  ).isRequired,
  columnId: PropTypes.string.isRequired,
  onResize: PropTypes.func.isRequired,
  ordering: PropTypes.arrayOf(PropTypes.object).isRequired,
  paddingExtra: PropTypes.number.isRequired,
  preserveColumnWidths: PropTypes.bool.isRequired,
  showExpanderColumn: PropTypes.bool.isRequired,
  resizeColumnText: PropTypes.string,
};

const defaultProps = {
  resizeColumnText: 'Resize column',
};

const dragHandleWidth = 4;
const { iotPrefix } = settings;

export const getColumnDragBounds = ({
  myColumn,
  affectedSiblingColumn,
  paddingExtra,
  preserveColumnWidths,
}) => {
  const minWidth = MIN_COLUMN_WIDTH + paddingExtra;

  return {
    minWidth,
    left:
      document.dir === 'rtl'
        ? preserveColumnWidths
          ? -Infinity
          : minWidth - affectedSiblingColumn.width
        : minWidth,
    right:
      document.dir === 'rtl'
        ? myColumn.width - minWidth
        : preserveColumnWidths
        ? Infinity
        : myColumn.width + affectedSiblingColumn.width - minWidth,
  };
};

export const getUpdatedColumnWidths = ({
  dropXPos,
  myColumn,
  affectedSiblingColumn,
  preserveColumnWidths,
}) => {
  const myColumnNewWidth = document.dir === 'rtl' ? myColumn.width - dropXPos : dropXPos;
  const updatedColumns = [{ id: myColumn.id, width: myColumnNewWidth }];

  if (!affectedSiblingColumn.isExpanderColumn && !preserveColumnWidths) {
    const newAffectedSiblingColumnWidth =
      document.dir === 'rtl'
        ? affectedSiblingColumn.width + dropXPos
        : affectedSiblingColumn.width + myColumn.width - dropXPos;
    updatedColumns.push({ id: affectedSiblingColumn.id, width: newAffectedSiblingColumnWidth });
  }

  return updatedColumns;
};

const findNextVisibleSibling = ({
  ordering,
  myColIndex,
  currentColumnWidths,
  showExpanderColumn,
}) => {
  const nextColIndex = ordering.findIndex((col, i) => i > myColIndex && !col.isHidden);
  const nextColId = ordering[nextColIndex]?.columnId;

  return nextColIndex === -1 && showExpanderColumn
    ? { width: Infinity, isExpanderColumn: true }
    : currentColumnWidths[nextColId];
};

const ColumnResize = React.forwardRef((props, ref) => {
  const {
    currentColumnWidths,
    columnId,
    ordering,
    paddingExtra,
    showExpanderColumn,
    preserveColumnWidths,
    resizeColumnText,
  } = props;
  const [startX, setStartX] = useState(0);
  const [leftPosition, setLeftPosition] = useState(0);
  const [columnIsBeingResized, setColumnIsBeingResized] = useState(false);
  const [myColumn, setMyColumn] = useState();
  const [affectedSiblingColumn, setAffectedSiblingColumn] = useState();
  const [currentWidth, setCurrentWidth] = useState(0);

  const setAffectedColumns = () => {
    const myCol = currentColumnWidths[columnId];
    setMyColumn(myCol);

    const myColIndex = ordering.findIndex((col) => col.columnId === columnId);
    const siblingColumn = findNextVisibleSibling({
      ordering,
      myColIndex,
      currentColumnWidths,
      showExpanderColumn,
    });
    setAffectedSiblingColumn(siblingColumn);
    setCurrentWidth(myCol?.width || 0);
  };

  const onMouseDown = (e) => {
    const startingX = e.target.offsetLeft - e.clientX;
    setStartX(startingX);
    setLeftPosition(e.target.offsetLeft);
    setColumnIsBeingResized(true);
    setAffectedColumns();
  };

  const onMouseMove = (e) => {
    if (columnIsBeingResized) {
      const mousePosition = e.clientX + startX;
      const bounds = getColumnDragBounds({
        myColumn,
        affectedSiblingColumn,
        paddingExtra,
        preserveColumnWidths,
      });
      if (mousePosition > bounds.left && mousePosition < bounds.right) {
        setLeftPosition(mousePosition);
      }
    }
  };

  const onMouseUp = () => {
    if (columnIsBeingResized) {
      const dropXPos = leftPosition + (document.dir === 'rtl' ? 0 : dragHandleWidth);
      const colWidths = getUpdatedColumnWidths({
        dropXPos,
        myColumn,
        affectedSiblingColumn,
        preserveColumnWidths,
      });
      props.onResize(colWidths);
      setColumnIsBeingResized(false);
      setLeftPosition(0);
    }
  };

  const onKeyDown = (e) => {
    // Handle keyboard resize with arrow keys
    const step = e.shiftKey ? 10 : 1; // Shift key for larger steps

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();

      if (!myColumn || !affectedSiblingColumn) {
        setAffectedColumns();
        return;
      }

      const isRTL = document.dir === 'rtl';
      // In RTL, arrow keys should work in reverse: left increases, right decreases
      const direction = e.key === 'ArrowLeft' ? (isRTL ? 1 : -1) : isRTL ? -1 : 1;

      const currentColWidth = currentWidth || myColumn.width;
      const changeAmount = direction * step;
      const newWidth = currentColWidth + changeAmount;

      const bounds = getColumnDragBounds({
        myColumn: { ...myColumn, width: currentColWidth },
        affectedSiblingColumn,
        paddingExtra,
        preserveColumnWidths,
      });

      // Check if new width is within bounds
      if (newWidth >= bounds.minWidth && (preserveColumnWidths || newWidth <= bounds.right)) {
        setCurrentWidth(newWidth);

        // For keyboard resize, directly set the column widths without using getUpdatedColumnWidths
        // to avoid the complex RTL position calculations meant for mouse dragging
        const updatedColumns = [{ id: myColumn.id, width: newWidth }];

        if (!affectedSiblingColumn.isExpanderColumn && !preserveColumnWidths) {
          const newAffectedSiblingColumnWidth = affectedSiblingColumn.width - changeAmount;
          updatedColumns.push({
            id: affectedSiblingColumn.id,
            width: newAffectedSiblingColumnWidth,
          });
        }

        props.onResize(updatedColumns);
      }
    }
  };

  // We extend this instance with mouse move/up event forward functions which the parent
  // component must call using forward referencing. We do this since the mouse move/up
  // logic belongs to this component, but the events have to be captured by the parent
  // component (with the larger HTML element surface). An alternative to this solution
  // would have been to pass down the mouse coordinates via props, but that resulted in
  // a sluggish rendering since the parent component would have to render for all events
  // during the mouse move.
  useImperativeHandle(ref, () => ({
    forwardMouseEvent(e) {
      if (e.nativeEvent.type === 'mousemove') {
        onMouseMove(e);
        /* istanbul ignore else */
      } else if (e.nativeEvent.type === 'mouseup') {
        onMouseUp();
      }
    },
  }));

  const minWidth = MIN_COLUMN_WIDTH + paddingExtra;
  const maxWidth = preserveColumnWidths
    ? 1000
    : (myColumn?.width || 0) + (affectedSiblingColumn?.width || 0);
  const currentValue = currentWidth || myColumn?.width || minWidth;

  return (
    <div
      tabIndex={0}
      //role="separator"
      //aria-label={resizeColumnText}
      //aria-orientation="vertical"
      // aria-valuemin={minWidth}
      // aria-valuemax={maxWidth}
      //aria-valuenow={Math.round(currentValue)}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => onMouseDown(e)}
      onKeyDown={onKeyDown}
      style={{
        width: dragHandleWidth,
        left: leftPosition || (document.dir === 'rtl' ? 0 : 'auto'),
      }}
      className={classnames(`${iotPrefix}--column-resize-handle`, {
        [`${iotPrefix}--column-resize-handle--dragging`]: columnIsBeingResized,
      })}
    />
  );
});

ColumnResize.propTypes = propTypes;
ColumnResize.defaultProps = defaultProps;

export default ColumnResize;
