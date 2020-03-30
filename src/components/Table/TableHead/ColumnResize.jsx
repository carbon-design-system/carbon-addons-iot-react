import React, { useState, useImperativeHandle } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { settings } from '../../../constants/Settings';

import { MIN_COLUMN_WIDTH } from './columnWidthUtilityFunctions';

const propTypes = {
  currentColumnWidths: PropTypes.objectOf(
    PropTypes.shape({
      width: PropTypes.number,
      id: PropTypes.string,
    })
  ).isRequired,
  columnId: PropTypes.string.isRequired,
  onResize: PropTypes.func.isRequired,
  ordering: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const dragHandleWidth = 4;
const { iotPrefix } = settings;

const getColumnDragBounds = (myColumn, siblingColumn) => {
  return {
    MIN_COLUMN_WIDTH,
    left: document.dir === 'rtl' ? MIN_COLUMN_WIDTH - siblingColumn.width : MIN_COLUMN_WIDTH,
    right:
      document.dir === 'rtl'
        ? myColumn.width - MIN_COLUMN_WIDTH
        : myColumn.width + siblingColumn.width - MIN_COLUMN_WIDTH,
  };
};

const getUpdatedColumnWidths = (dropXPos, myColumn, affectedSiblingColumn) => {
  const myColumnNewWidth = document.dir === 'rtl' ? myColumn.width - dropXPos : dropXPos;
  const newAffectedSiblingColumnWidth =
    document.dir === 'rtl'
      ? affectedSiblingColumn.width + dropXPos
      : affectedSiblingColumn.width + myColumn.width - dropXPos;

  return [
    { id: myColumn.id, width: myColumnNewWidth },
    { id: affectedSiblingColumn.id, width: newAffectedSiblingColumnWidth },
  ];
};

const findNextVisibleSibling = (ordering, myColIndex, currentColumnWidths) => {
  const nextColIndex = ordering.findIndex((col, i) => i > myColIndex && !col.isHidden);
  const nextColId = ordering[nextColIndex].columnId;
  return currentColumnWidths[nextColId];
};

const ColumnResize = React.forwardRef((props, ref) => {
  const { currentColumnWidths, columnId, ordering } = props;
  const [startX, setStartX] = useState(0);
  const [leftPosition, setLeftPosition] = useState(0);
  const [columnIsBeingResized, setColumnIsBeingResized] = useState(false);
  const [myColumn, setMyColumn] = useState();
  const [affectedSiblingColumn, setAffectedSiblingColumn] = useState();

  const setAffectedColumns = () => {
    const myCol = currentColumnWidths[columnId];
    const myColIndex = ordering.findIndex(col => col.columnId === columnId);
    const siblingColumn = findNextVisibleSibling(ordering, myColIndex, currentColumnWidths);
    setMyColumn(myCol);
    setAffectedSiblingColumn(siblingColumn);
  };

  const onMouseDown = e => {
    const startingX = e.target.offsetLeft - e.clientX;
    setStartX(startingX);
    setLeftPosition(e.target.offsetLeft);
    setColumnIsBeingResized(true);
    setAffectedColumns();
  };

  const onMouseMove = e => {
    if (columnIsBeingResized) {
      const mousePosition = e.clientX + startX;
      const bounds = getColumnDragBounds(myColumn, affectedSiblingColumn);
      if (mousePosition > bounds.left && mousePosition < bounds.right) {
        setLeftPosition(mousePosition);
      }
    }
  };

  const onMouseUp = () => {
    if (columnIsBeingResized) {
      const resizePosition = leftPosition + (document.dir === 'rtl' ? 0 : dragHandleWidth);
      const colWidths = getUpdatedColumnWidths(resizePosition, myColumn, affectedSiblingColumn);
      props.onResize(colWidths);
      setColumnIsBeingResized(false);
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

export default ColumnResize;
