import isNil from 'lodash/isNil';

import { searchData } from '../Table/tableReducer';

export const TILE_ACTIONS = {
  PAGE_CHANGE: 'PAGE_CHANGE',
  SEARCH: 'SEARCH',
  SELECT: 'SELECT',
  RESET: 'RESET',
};

/** figures out the ending index of the array */
const determineEndingIndex = (page, pageSize, tiles) => {
  return (
    Math.min(
      (page - 1) * pageSize + pageSize,
      tiles && !isNil(tiles.length) ? tiles.length : Infinity // I'd like to pass undefined here, but Math.min isn't smart enough so I have to use Infinity
    ) - 1
  );
};

/** This figures out the initial state of the reducer from the props */
export const determineInitialState = ({ pagination, search, selectedTileId, tiles }) => {
  const page = pagination && pagination.page ? pagination.page : 1;
  const pageSize = pagination && pagination.pageSize ? pagination.pageSize : 10;
  const filteredTiles = search ? searchData(tiles, search.value) : tiles;
  const startingIndex = pagination ? (page - 1) * pageSize : 0;
  return {
    page,
    pageSize,
    searchState: search && search.value ? search.value : '',
    selectedTileId:
      selectedTileId ||
      (filteredTiles && filteredTiles[startingIndex] ? filteredTiles[startingIndex].id : null),
    tiles,
    // filtered tiles have any search applied
    filteredTiles,
    startingIndex,
    endingIndex: determineEndingIndex(page, pageSize, filteredTiles),
  };
};

/** here's what the state looks like
 * 
 *  { 
 *  page: PropTypes.number,
    pageSize: PropTypes.number,
    searchState: PropTypes.string,
    selectedTileId: PropTypes.string,
    // original tile data
    tiles: PropTypes.array,
    // filtered tiles have any search applied
    filteredTiles: PropTypes.array,
    startingIndex: PropTypes.number,
    endingIndex: PropTypes.number,
  }
 * 
 */
export const tileCatalogReducer = (state = {}, action) => {
  switch (action.type) {
    case TILE_ACTIONS.PAGE_CHANGE: {
      const { pageSize, filteredTiles } = state;
      const page = action.payload;
      const startingIndex = (page - 1) * pageSize;
      const endingIndex = determineEndingIndex(page, pageSize, filteredTiles);

      return {
        ...state,
        startingIndex,
        endingIndex,
        // set the selected tile id if the page changes
        // selectedTileId: null,
        page,
      };
    }
    case TILE_ACTIONS.SEARCH: {
      const searchState = action.payload;
      const { pageSize } = state;
      const filteredTiles = searchData(state.tiles, searchState);
      return {
        ...state,
        searchState,
        filteredTiles,
        // reset the page and indexes
        page: 1,
        startingIndex: 0,
        endingIndex: (pageSize || filteredTiles.length) - 1,
        // Set the selected tile id if the search changes the data
        // selectedTileId: null,
      };
    }
    case TILE_ACTIONS.SELECT:
      return {
        ...state,
        selectedTileId: action.payload,
      };
    case TILE_ACTIONS.RESET:
      return determineInitialState(action.payload);
    default:
      return state;
  }
};
