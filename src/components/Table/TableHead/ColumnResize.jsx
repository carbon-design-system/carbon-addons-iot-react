import React, { useState, useImperativeHandle } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  columnWidths: PropTypes.any.isRequired,
  columnIndex: PropTypes.number.isRequired,
  setNewWidths: PropTypes.func.isRequired,
};

const dragHandleWidth = 4;

const getColumnDragBounds = (direction, colWidths, index) => {
  const minColumnWidth = 64;
  return {
    direction,
    minColumnWidth,
    rightBound: colWidths[index],
    leftBound: colWidths[index + 1] - minColumnWidth,
  };
};

const dragIsValidLtr = (mousePosition, bounds) => {
  const { minColumnWidth, rightBound, leftBound, direction } = bounds;
  return (
    (direction === 'left' && mousePosition >= minColumnWidth) ||
    (direction === 'right' && mousePosition <= rightBound + leftBound)
  );
};

const dragIsValidRtl = (mousePosition, bounds) => {
  const { minColumnWidth, rightBound, leftBound, direction } = bounds;
  return (
    (direction === 'left' && mousePosition > -leftBound) ||
    (direction === 'right' && mousePosition < rightBound - minColumnWidth)
  );
};

const getUpdatedColumnWidths = (dropXPos, columnWidth, leftSideIndex) => {
  const origLeftSideColWidth = columnWidth[leftSideIndex];
  const leftSideColWidth = document.dir === 'rtl' ? origLeftSideColWidth - dropXPos : dropXPos;

  const rightSideIndex = leftSideIndex + 1;
  const origRightSideColWidth = columnWidth[rightSideIndex];
  const rightSideColWidth =
    document.dir === 'rtl'
      ? origRightSideColWidth + dropXPos
      : origRightSideColWidth + origLeftSideColWidth - dropXPos;

  return {
    [leftSideIndex]: leftSideColWidth,
    [rightSideIndex]: rightSideColWidth,
  };
};

const ColumnResize = React.forwardRef((props, ref) => {
  const { columnWidths, columnIndex, setNewWidths } = props;
  const [startX, setStartX] = useState(0);
  const [leftPosition, setLeftPosition] = useState(0);
  const [move, setMove] = useState(0);
  const [valid, setValid] = useState(true);
  const [columnIsBeingResized, setColumnIsBeingResized] = useState(false);

  const onMouseDown = e => {
    const startingX = e.target.offsetLeft - e.clientX;
    const mousePosition = e.clientX + startingX;

    setStartX(startingX);
    setLeftPosition(mousePosition);
    setMove(e.clientX);
    setValid(true);
    setColumnIsBeingResized(true);
  };

  const onMouseMove = e => {
    if (columnIsBeingResized) {
      const mousePosition = e.clientX + startX;
      const direction = e.clientX > move ? 'right' : 'left';
      const dragBounds = getColumnDragBounds(direction, columnWidths, columnIndex);
      const isValid =
        document.dir === 'rtl'
          ? dragIsValidRtl(mousePosition, dragBounds)
          : dragIsValidLtr(mousePosition, dragBounds);

      setValid(isValid);
      setLeftPosition(mousePosition);
    }
  };

  const onMouseUp = () => {
    if (columnIsBeingResized) {
      if (valid) {
        const resizePosition = leftPosition + dragHandleWidth;
        const colWidths = getUpdatedColumnWidths(resizePosition, columnWidths, columnIndex);
        setNewWidths(colWidths);
      }

      setColumnIsBeingResized(false);
      setValid(true);
      setLeftPosition(0);
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
      } else if (e.nativeEvent.type === 'mouseup') {
        onMouseUp();
      }
    },
  }));

  return (
    // eslint-disable-next-line
    <div
      onClick={e => e.stopPropagation()}
      onMouseDown={e => onMouseDown(e)}
      style={{ width: dragHandleWidth, left: leftPosition || 'auto' }}
      className={classnames('column-resize-handle', {
        'column-resize-handle--invalid': !valid,
        'column-resize-handle--dragging': columnIsBeingResized,
      })}
    />
  );
});

ColumnResize.propTypes = propTypes;

export default ColumnResize;
