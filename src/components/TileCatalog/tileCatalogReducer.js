import { searchData } from '../Table/tableReducer';

export const TILE_ACTIONS = {
  PAGE_CHANGE: 'PAGE_CHANGE',
  SEARCH: 'SEARCH',
  SELECT: 'SELECT',
  RESET: 'RESET',
};

/** figures out the ending index of the array */
const determineEndingIndex = (page, pageSize) => {
  return (page - 1) * pageSize + pageSize - 1;
};

/** This figures out the initial state of the reducer from the props */
export const determineInitialState = ({ pagination, search, selectedTileId, tiles }) => {
  const page = pagination && pagination.page ? pagination.page : 1;
  const pageSize = pagination && pagination.pageSize ? pagination.pageSize : 10;
  const filteredTiles = search ? searchData(tiles, search.value) : tiles;
  const startingIndex = pagination ? (page - 1) * pageSize : 0;
  const selectedTileIdState =
    selectedTileId ||
    (filteredTiles && filteredTiles[startingIndex] ? filteredTiles[startingIndex].id : null);
  let selectedPage;
  let selectedStartingIndex;
  // If a selected tile id is passed, we should page to it
  if (selectedTileId) {
    const selectedTileIndex = filteredTiles.findIndex(tile => tile.id === selectedTileId);
    selectedPage = Math.floor(selectedTileIndex / pageSize) + 1;
    selectedStartingIndex = pagination ? (selectedPage - 1) * pageSize : 0;
  }

  return {
    page: selectedPage || page,
    pageSize,
    searchState: search && search.value ? search.value : '',
    selectedTileId: selectedTileIdState,
    tiles,
    // filtered tiles have any search applied
    filteredTiles,
    startingIndex: selectedStartingIndex || startingIndex,
    endingIndex: determineEndingIndex(selectedPage || page, pageSize),
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
      const { pageSize } = state;
      const page = action.payload;
      const startingIndex = (page - 1) * pageSize;
      const endingIndex = determineEndingIndex(page, pageSize);

      return {
        ...state,
        startingIndex,
        endingIndex,
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
      };
    }
    case TILE_ACTIONS.SELECT: {
      const { filteredTiles, pageSize } = state;
      const tileIndex = filteredTiles.findIndex(tile => tile.id === action.payload);
      const page = Math.floor(tileIndex / pageSize) + 1;
      return {
        ...state,
        page,
        startingIndex: (page - 1) * pageSize,
        endingIndex: determineEndingIndex(page, pageSize),
        selectedTileId: action.payload,
      };
    }
    case TILE_ACTIONS.RESET:
      return determineInitialState(action.payload);
    default:
      return state;
  }
};
