import cloneDeep from 'lodash/cloneDeep';

/**
 * Utility functions related to the measurement and calculation
 * of a table's column widths.
 */

// This width must be able to fit the elipsis of a truncated text + sort arrows
export const MIN_COLUMN_WIDTH = 62;

function isColumnVisible(ordering, columnId) {
  return !ordering.find(orderedCol => orderedCol.columnId === columnId).isHidden;
}

function getTotalWidth(cols) {
  return cols.reduce((width, col) => width + col.width, 0);
}

function createWidthsMap(ordering, currentColumnWidths, adjustedCols) {
  const newColumnWidths = {};
  ordering.forEach(orderedColumn => {
    const current = currentColumnWidths[orderedColumn.columnId];
    newColumnWidths[orderedColumn.columnId] = {
      width: current ? current.width : undefined,
      id: orderedColumn.columnId,
    };
  });

  adjustedCols.forEach(col => {
    newColumnWidths[col.id].width = col.width;
  });
  return newColumnWidths;
}

function addWidthForColHiddenOnInit(currentColumnWidths, colToShowId, origColumns) {
  // If the column to show was hidden on init it will not have a width
  // in currentColumnWidths since it has not been rendered and measured.
  // Therefore the width must be added from the original column definition.
  let modified;
  if (currentColumnWidths[colToShowId].width === undefined) {
    modified = cloneDeep(currentColumnWidths);
    const originalWidth = parseInt(origColumns.find(col => col.id === colToShowId).width, 10);
    modified[colToShowId].width = originalWidth;
  }
  return modified || currentColumnWidths;
}

function calculateWidthOnShow(curColumnWidths, ordering, colToShowId, origColumns) {
  const currentColumnWidths = addWidthForColHiddenOnInit(curColumnWidths, colToShowId, origColumns);
  const neededWidth = currentColumnWidths[colToShowId].width;
  const availableCols = Object.values(currentColumnWidths).filter(col => {
    return (
      col.width > MIN_COLUMN_WIDTH && isColumnVisible(ordering, col.id) && col.id !== colToShowId
    );
  });

  const availableWidth = getTotalWidth(availableCols);
  const adjustedCols = availableCols.map(col => {
    const newWidth = col.width - (col.width / availableWidth) * neededWidth;
    return { id: col.id, width: Math.round(newWidth) };
  });

  return createWidthsMap(ordering, currentColumnWidths, adjustedCols);
}

function calculateWidthOnHide(currentColumnWidths, ordering, colToHideId) {
  const widthToDistribute = currentColumnWidths[colToHideId].width;
  const visibleCols = Object.values(currentColumnWidths).filter(
    col => isColumnVisible(ordering, col.id) && col.id !== colToHideId
  );

  const availableWidth = getTotalWidth(visibleCols);
  const adjustedCols = visibleCols.map(col => {
    const newWidth = col.width + (col.width / availableWidth) * widthToDistribute;
    return { id: col.id, width: Math.round(newWidth) };
  });

  return createWidthsMap(ordering, currentColumnWidths, adjustedCols);
}

/**
 * If the table isn't wide enough for all columns that has a defined width
 * the browser will will shrink the last column instead of keeping its defined width.
 * This function adjusts the column width to the initial width if that one is larger.
 * @param {*} ordering
 * @param {*} columns
 * @param {*} measuredWidths
 */
export const adjustLastColumnWidth = (ordering, columns, measuredWidths) => {
  const visibleCols = ordering.filter(col => !col.isHidden);
  const lastIndex = visibleCols.length - 1;
  const lastColumn = columns.find(col => col.id === visibleCols[lastIndex].columnId);
  const fixedWidth = lastColumn.width ? parseInt(lastColumn.width, 10) : 0;
  const measuredWidth = measuredWidths[lastIndex].width;

  let result = measuredWidths;
  if (measuredWidth < fixedWidth) {
    result = cloneDeep(measuredWidths);
    result[lastIndex].width = fixedWidth;
  }
  return result;
};

/**
 * Creates a widths map based on current columns state + any changes in visibility or width
 * @param {array} ordering defining the order, via the index, and visiblity of columns
 * @param {object} currentColumnWidths map of the current column IDs and widths
 * @param {array} adjustedCols contains objects with ID and modified width
 */
export const createNewWidthsMap = (ordering, currentColumnWidths, adjustedCols) => {
  return createWidthsMap(ordering, currentColumnWidths, adjustedCols);
};

/**
 * Calculates the new width of all columns when a column is toggled.
 * @param {object} currentColumnWidths map of the current column IDs and widths
 * @param {array} newOrdering defining the order, via the index, and visiblity of columns
 * @param {string} columnId the id of the column to be hidden/shown
 * @param {array} columns the orginal column definitions
 */
export const calculateWidthsOnToggle = ({
  currentColumnWidths,
  newOrdering: ordering,
  columnId,
  columns,
}) => {
  const hideColumn = ordering.find(col => col.columnId === columnId).isHidden;
  return hideColumn
    ? calculateWidthOnHide(currentColumnWidths, ordering, columnId)
    : calculateWidthOnShow(currentColumnWidths, ordering, columnId, columns);
};
