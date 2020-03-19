import delay from 'lodash/delay';
import moment from 'moment';
import { sortStates } from 'carbon-components-react/lib/components/DataTable/state/sorting';
import fileDownload from 'js-file-download';
import isNil from 'lodash/isNil';

import {
  GUTTER,
  DASHBOARD_BREAKPOINTS,
  CARD_DIMENSIONS,
  ROW_HEIGHT,
  DASHBOARD_COLUMNS,
} from '../constants/LayoutConstants';
import {
  reactAttributes,
  htmlAttributes,
  svgAttributes,
  eventHandlers,
} from '../constants/HTMLAttributes';

/**
 * Helper function to generate a CSV from an array of table cell data
 * Retrieve the column headers, then match and join the cell values
 * with each header
 * @param {Array<string | number>} data from table cells
 * @return {string} generated csv
 */
export const generateCsv = data => {
  let csv = '';
  // get all headers available and merge it
  let columnHeaders = [];
  data.forEach(item => {
    columnHeaders = [...columnHeaders, ...Object.keys(item.values)];
  });
  columnHeaders = [...new Set(columnHeaders)];
  csv += `${columnHeaders.join(',')}\n`;
  data.forEach(item => {
    columnHeaders.forEach(arrayHeader => {
      // if item is of arrayHeader, add value
      // else if, check if the value is integer 0 as 0 is treated as false.
      // Swap the 0 for a string literal 0 so that it displays in the csv
      // else, return empty string
      csv += `${!isNil(item.values[arrayHeader]) ? item.values[arrayHeader] : ''},`;
    });
    csv += `\n`;
  });

  return csv;
};

/**
 * Helper function to support downloading data as CSV
 * Retrieve the column headers, then match and join the cell values
 * with each header. When CSV is fully joined, download the file
 *
 * @param {Array<string | number>} data from table cells
 * @param {string} title file name to be saved as
 */
export const csvDownloadHandler = (data, title = 'export') => {
  const csv = generateCsv(data);
  const exportedFilename = `${title}.csv`;

  fileDownload(csv, exportedFilename);
};

export const tableTranslateWithId = (i18n, id, state) => {
  const { batchCancel, itemsSelected, itemSelected } = i18n;
  switch (id) {
    case 'carbon.table.batch.cancel':
      return batchCancel;
    case 'carbon.table.batch.items.selected':
      return `${state.totalSelected} ${itemsSelected}`;
    case 'carbon.table.batch.item.selected':
      return `${state.totalSelected} ${itemSelected}`;
    case 'carbon.table.toolbar.search.label':
      return i18n.searchLabel;
    case 'carbon.table.toolbar.search.placeholder':
      return i18n.searchPlaceholder;
    case 'carbon.table.header.icon.description':
      if (state.isSortHeader) {
        // When transitioning, we know that the sequence of states is as follows:
        // NONE -> ASC -> DESC -> NONE
        if (state.sortDirection === sortStates.NONE) {
          return i18n.filterAscending;
        }
        if (state.sortDirection === sortStates.ASC) {
          return i18n.filterDescending;
        }

        return i18n.filterNone;
      }
      return i18n.filterAscending;
    default:
      return '';
  }
};

/** This function assumes you're using carbon widgets */
export function scrollErrorIntoView(focus = true) {
  const invalidField = document.querySelector('[data-invalid="true"]');
  if (invalidField) {
    invalidField.scrollIntoView({ behavior: 'smooth' });
    if (focus) {
      delay(() => invalidField.focus(), 250);
    }
    return true;
  }
  return false;
}

export const handleEnterKeyDown = (evt, callback) => {
  if (evt.key === 'Enter') {
    callback(evt);
  }
};

export const defaultFunction = name => () => console.info(`${name} not implemented`); //eslint-disable-line

export const getSortedData = (inputData, columnId, direction, isTimestampColumn) => {
  // clone inputData because sort mutates the array
  const sortedData = inputData.map(i => i);

  return sortedData.sort((a, b) => {
    const val = direction === 'ASC' ? -1 : 1;
    if (isNil(a.values[columnId])) {
      return 1;
    }
    if (isNil(b.values[columnId])) {
      return -1;
    }
    if (isTimestampColumn) {
      // support the sort if we have column with timestamp
      const dateA = moment(a.values[columnId]);
      const dateB = moment(b.values[columnId]);

      if (dateA < dateB) {
        return val;
      }
      if (dateA > dateB) {
        return -val;
      }
    }
    if (typeof a.values[columnId] === 'string' && !Number(a.values[columnId])) {
      const compare = a.values[columnId].localeCompare(b.values[columnId]);
      return direction === 'ASC' ? compare : -compare;
    }
    if (Number(a.values[columnId]) < Number(b.values[columnId])) {
      return val;
    }
    if (Number(a.values[columnId]) > Number(b.values[columnId])) {
      return -val;
    }

    return 0;
  });
};

/**
 * A simple helper function that stops prop on an event before calling back the callback function
 * @param {*} evt  event to stop
 * @param {*} callback  callback to call
 * @param  {...any} args
 */
export const stopPropagationAndCallback = (evt, callback, ...args) => {
  evt.stopPropagation();
  callback(...args);
};

// Dashboard layout
const gridHeight = 200;

export const printGrid = grid => {
  let result = '';
  for (let j = 0; j < gridHeight; j += 1) {
    for (let i = 0; i < grid.length; i += 1) {
      result += `${grid[i][j]} `;
    }
    result += '\n';
  }
  console.log(result); // eslint-disable-line
};

/**
 *
 * @param {*} x  the current x location of a card
 * @param {*} y  the current y location of a card
 * @param {*} w  current width of a card
 * @param {*} h  current height of a card
 * @param {*} grid nested array of rows and columns with the current card index that is occupying them. for example, if the entire top row was taken by the first card it would look like this [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
 */
export const canFit = (x, y, w, h, grid) => {
  for (let i = x; i < x + w; i += 1) {
    for (let j = y; j < y + h; j += 1) {
      if (grid.length === i) return false;
      if (grid[i].length === j) return false;
      if (grid[i][j] !== 0) return false;
    }
  }
  return true;
};

/**
 * Generates a non overlapping layout given the cards and column/dimension configuration for a given layout
 * @param {*} layoutName
 * @param {*} cards
 * @param {*} dashboardColumns array of column counts for the different breakpoints (see DASHBOARD_COLUMNS)
 * @param {*} cardDimensions double object of card height and width keyed by card size and layout (see CARD_DIMENSIONS)
 * returns
 */
export const getLayout = (layoutName, cards, dashboardColumns, cardDimensions) => {
  let currX = 0;
  let currY = 0;
  const grid = Array(dashboardColumns[layoutName])
    .fill(0)
    .map(() => Array(gridHeight).fill(0));

  const placeCard = (x, y, w, h, num) => {
    for (let i = x; i < x + w; i += 1) {
      for (let j = y; j < y + h; j += 1) {
        grid[i][j] = num;
      }
    }
  };

  const layout = cards
    .map((card, index) => {
      const { w, h } = cardDimensions[card.size][layoutName];
      while (!canFit(currX, currY, w, h, grid)) {
        currX += 1;
        if (currX > dashboardColumns[layoutName]) {
          currX = 0;
          currY += 1;
          if (currY > gridHeight) {
            return null;
          }
        }
      }
      placeCard(currX, currY, w, h, index + 1);
      // printGrid(grid);
      const cardLayout = {
        i: card.id,
        x: currX,
        y: currY,
        w,
        h,
      };
      currX += w;
      return cardLayout;
    })
    .filter(i => i !== null);
  // printGrid(grid);
  return layout;
};

/**
 * Returns { x: width in pixels, y: height in pixels }
 * This is used to set min-width and min-height of the card based on the current breakpoint
 */
export const getCardMinSize = (
  breakpoint,
  size,
  dashboardBreakpoints = DASHBOARD_BREAKPOINTS,
  cardDimensions = CARD_DIMENSIONS,
  rowHeight = ROW_HEIGHT,
  dashboardColumns = DASHBOARD_COLUMNS
) => {
  const totalCol = dashboardColumns[breakpoint];
  const columnWidth = (dashboardBreakpoints[breakpoint] - (totalCol - 1) * GUTTER) / totalCol;
  const cardColumns = cardDimensions[size][breakpoint].w;
  const cardRows = cardDimensions[size][breakpoint].h;

  const cardSize = {
    x: cardColumns * columnWidth + (cardColumns - 1) * GUTTER,
    y: cardRows * rowHeight[breakpoint] + (cardRows - 1) * GUTTER,
  };
  return cardSize;
};

/**
 * Searches through an array of keys for a searchTerm match
 * @param {Array<string>} keys to be searched
 * @param {string} searchTerm
 * @returns {Boolean} found or not
 */
export const caseInsensitiveSearch = (keys, searchTerm) => {
  // eslint-disable-next-line
  return keys.some(key => key.toLowerCase().includes(searchTerm.toLowerCase()));
};

const data = '[Dd][Aa][Tt][Aa]';
const aria = '[Aa][Rr][Ii][Aa]';
const attributes = [...reactAttributes, ...htmlAttributes, ...svgAttributes, ...eventHandlers].join(
  '|'
);
const validAttributes = RegExp(`^((${attributes})|((${data}|${aria}|x)-.*))$`);
/**
 * Filter out props that are not valid HTML or react library props like 'ref'.
 * See HTMLAttributes.js for more info
 * @param {object} props the props (attributes) to filter
 */
export const filterValidAttributes = props =>
  Object.keys(props)
    .filter(prop => validAttributes.test(prop))
    .reduce((filteredProps, propName) => {
      // eslint-disable-next-line
      filteredProps[propName] = props[propName];
      return filteredProps;
    }, {});
