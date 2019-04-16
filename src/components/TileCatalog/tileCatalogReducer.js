import { searchData } from '../Table/tableReducer';

export const TILE_ACTIONS = {
  PAGE_CHANGE: 'PAGE_CHANGE',
  SEARCH: 'SEARCH',
  SELECT: 'SELECT',
  RESET: 'RESET',
};

export const determineInitialState = ({ pagination, search, selectedTileId, tiles }) => {
  const page = pagination && pagination.page ? pagination.page : 1;
  const pageSize = pagination && pagination.pageSize ? pagination.pageSize : 10;
  return {
    page,
    pageSize,
    searchState: search && search.value ? search.value : '',
    selectedTileId: selectedTileId || (tiles && tiles[0] ? tiles[0].id : null),
    tiles,
    // filtered tiles have any search applied
    filteredTiles: search ? searchData(tiles, search.value) : tiles,
    startingIndex: pagination ? (page - 1) * pageSize : 0,
    endingIndex: (pagination ? (page - 1) * pageSize + pageSize : pageSize) - 1,
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
      const endingIndex =
        Math.min(
          (page - 1) * pageSize + pageSize,
          filteredTiles && filteredTiles.length ? filteredTiles.length : Infinity
        ) - 1;

      return {
        ...state,
        startingIndex,
        endingIndex,
        // set the selected tile id if the page changes
        selectedTileId: filteredTiles[startingIndex] ? filteredTiles[startingIndex].id : null,
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
        selectedTileId: filteredTiles && filteredTiles[0] ? filteredTiles[0].id : null,
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
