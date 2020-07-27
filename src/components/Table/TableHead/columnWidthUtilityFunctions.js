import cloneDeep from 'lodash/cloneDeep';

/**
 * Utility functions related to the measurement and calculation
 * of a table's column widths.
 */

// This width must be able to fit the elipsis of a truncated text + sort arrows
export const MIN_COLUMN_WIDTH = 62;

function isColumnVisible(ordering, columnId) {
  const orderedColumn = ordering.find(orderedCol => orderedCol.columnId === columnId);
  return orderedColumn && !orderedColumn.isHidden;
}

function getTotalWidth(cols) {
  return cols.reduce((width, col) => width + col.width, 0);
}

function createWidthsMap(ordering, columnWidths, adjustedCols) {
  const newColumnWidths = {};
  ordering.forEach(orderedColumn => {
    const current = Array.isArray(columnWidths)
      ? columnWidths.find(col => col.id === orderedColumn.columnId)
      : columnWidths[orderedColumn.columnId];
    newColumnWidths[orderedColumn.columnId] = {
      width: current && current.width !== undefined ? parseInt(current.width, 10) : undefined,
      id: orderedColumn.columnId,
    };
  });

  adjustedCols.forEach(col => {
    newColumnWidths[col.id].width = col.width;
  });
  return newColumnWidths;
}

function getVisibleColumns(currentColumnWidths, ordering, excludeIDs) {
  return Object.values(currentColumnWidths).filter(
    col =>
      col.width !== undefined && !excludeIDs.includes(col.id) && isColumnVisible(ordering, col.id)
  );
}

function getOriginalWidthOfColumn(origColumns, colId) {
  const orginalWidth = origColumns.find(col => col.id === colId).width;
  return orginalWidth ? parseInt(orginalWidth, 10) : undefined;
}

function getExistingColumnWidth(currentColumnWidths, origColumns, colId) {
  const currentColumnWidth = currentColumnWidths[colId]?.width;

  // If the column to show was hidden on init it will not have a current width
  // since it has not been rendered and measured. Then we try to get the original width.
  return currentColumnWidth || getOriginalWidthOfColumn(origColumns, colId);
}

function getAverageVisibleColumnWidth(visibleColumns) {
  const totalCurrentWidth = getTotalWidth(visibleColumns);
  return totalCurrentWidth / visibleColumns.length;
}

function shrinkColumns(shrinkableColumns, widthOfColumnToShow) {
  const availableWidth = getTotalWidth(shrinkableColumns);
  const shrunkenColumns = shrinkableColumns.map(col => {
    const preferredShrinkWidth = (col.width / availableWidth) * widthOfColumnToShow;
    const preferredNewWidth = col.width - preferredShrinkWidth;
    const newWidth = preferredNewWidth >= MIN_COLUMN_WIDTH ? preferredNewWidth : MIN_COLUMN_WIDTH;
    return { id: col.id, width: Math.round(newWidth) };
  });
  return shrunkenColumns;
}

/**
 * Returns an array of the IDs of all columns that exists in the
 * currentColumnWidths map but not in the ordering prop.
 * @param {array} ordering the table ordering prop that specifies the order and visibility of columns
 * @param {object} currentColumnWidths map of the current column IDs and widths
 */
export const getIDsOfRemovedColumns = (ordering, currentColumnWidths) => {
  return Object.values(currentColumnWidths)
    .filter(currCol => !ordering.find(orderCol => orderCol.columnId === currCol.id))
    .map(col => col.id);
};

/**
 * Returns an array of the IDs of all columns that exists in the
 * ordering prop but not in the currentColumnWidths map.
 * @param {array} ordering the table ordering prop that specifies the order and visibility of columns
 * @param {object} currentColumnWidths map of the current column IDs and widths
 */
export const getIDsOfAddedColumns = (ordering, currentColumnWidths) => {
  return ordering
    .filter(col => !col.isHidden)
    .filter(col => !currentColumnWidths.hasOwnProperty(col.columnId))
    .map(col => col.columnId);
};

/**
 * Returns true if all visible columns have a width.
 * @param {array} ordering the table ordering prop that specifies the order and visibility of columns
 * @param {array} columns The table column props
 */
export const visibleColumnsHaveWidth = (ordering, columns) => {
  return columns
    .filter(col => isColumnVisible(ordering, col.id))
    .every(col => col.hasOwnProperty('width') && col.width !== undefined);
};

/**
 * Returns the new column widths map when one or more columns are shown or added.
 * @param {object} currentColumnWidths map of the current column IDs and widths
 * @param {array} ordering the table ordering prop that specifies the order and visibility of columns
 * @param {array} colToShowIDs array of IDs of the columns to be shown/added
 * @param {array} columns The table column props
 */
export const calculateWidthOnShow = (currentColumnWidths, ordering, colToShowIDs, columns) => {
  const visibleColumns = getVisibleColumns(currentColumnWidths, ordering, colToShowIDs);
  const newColumnsToShow = colToShowIDs.reduce((accumulator, colToShowId) => {
    const widthOfColumnToShow =
      getExistingColumnWidth(currentColumnWidths, columns, colToShowId) ||
      getAverageVisibleColumnWidth(visibleColumns);
    return [...accumulator, { id: colToShowId, width: Math.round(widthOfColumnToShow) }];
  }, []);
  const totalWidthNeeded = newColumnsToShow.reduce((acc, col) => acc + col.width, 0);
  const shrinkableColumns = visibleColumns.filter(col => col.width > MIN_COLUMN_WIDTH);

  const adjustedCols = shrinkColumns(shrinkableColumns, totalWidthNeeded);
  adjustedCols.push(...newColumnsToShow);

  return createWidthsMap(ordering, currentColumnWidths, adjustedCols);
};

/**
 * Calculates the new column widths when one ore more columns are hidden or deleted.
 * @param {object} currentColumnWidths map of the current column IDs and widths
 * @param {array} ordering the table ordering prop that specifies the order and visibility of columns
 * @param {array} colToHideIDs Array with the IDs of one or more columns being hidden/deleted
 */
export const calculateWidthOnHide = (currentColumnWidths, ordering, colToHideIDs) => {
  const widthToDistribute = getTotalWidth(colToHideIDs.map(hideId => currentColumnWidths[hideId]));

  const visibleCols = Object.values(currentColumnWidths).filter(
    col => isColumnVisible(ordering, col.id) && !colToHideIDs.includes(col.id)
  );

  const availableWidth = getTotalWidth(visibleCols);
  const adjustedCols = visibleCols.map(col => {
    const newWidth = col.width + (col.width / availableWidth) * widthToDistribute;
    return { id: col.id, width: Math.round(newWidth) };
  });

  return createWidthsMap(ordering, currentColumnWidths, adjustedCols);
};

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
 * @param {object} currentColumnWidths map or object array of the current column IDs and widths
 * @param {array} adjustedCols contains objects with ID and modified width
 */
export const createNewWidthsMap = (ordering, currentColumnWidths, adjustedCols = []) => {
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
    ? calculateWidthOnHide(currentColumnWidths, ordering, [columnId])
    : calculateWidthOnShow(currentColumnWidths, ordering, [columnId], columns);
};
