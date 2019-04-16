import React, { useReducer } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import omit from 'lodash/omit';

import { tileCatalogReducer, determineInitialState, TILE_ACTIONS } from './tileCatalogReducer';
import TileCatalog, { propTypes } from './TileCatalog';

/**
 * Paging and searching happens on local state within the component
 */

const StatefulTileCatalog = ({ onSelection, pagination, search, tiles: tilesProp, ...props }) => {
  const initialState = determineInitialState({ ...props, tiles: tilesProp, search, pagination });
  const onPage = pagination && pagination.onPage;
  const onSearch = search && search.onSearch;

  const [state, dispatch] = useReducer(tileCatalogReducer, initialState);

  useDeepCompareEffect(
    () => {
      // If we get passed a new set of tiles reset!
      dispatch({
        type: TILE_ACTIONS.RESET,
        payload: { ...props, tiles: tilesProp, search, pagination },
      });
    },
    [tilesProp.map(tile => omit(tile, 'renderContent'))]
  );

  const {
    page,
    startingIndex,
    endingIndex,
    searchState,
    tiles,
    filteredTiles,
    selectedTileId,
  } = state;

  const handlePage = (...args) => {
    dispatch({ type: TILE_ACTIONS.PAGE_CHANGE, payload: args && args[0] });
    if (onPage) {
      onPage(...args);
    }
  };

  const handleSelection = newSelectedTile => {
    dispatch({ type: TILE_ACTIONS.SELECT, payload: newSelectedTile });
    if (onSelection) {
      onSelection(newSelectedTile);
    }
  };

  /* I couldn't really get the reselect logic to work correctly
  useDeepCompareEffect(
    () => {
      dispatch({
        type: TILE_ACTIONS.SELECT,
        payload:
          selectedTileId ||
          (filteredTiles && filteredTiles[startingIndex] ? filteredTiles[startingIndex].id : null),
      });
    },
    [filteredTiles.map(tile => omit(tile, 'renderContent')), searchState, startingIndex, page]
  );

  useEffect(
    () => {
      onSelection(selectedTileId);
    },
    [selectedTileId] // eslint-disable-line
  );
  */

  const handleSearch = (event, ...args) => {
    const newSearch = event.target.value || '';
    dispatch({ type: TILE_ACTIONS.SEARCH, payload: newSearch });
    if (onSearch) {
      onSearch(newSearch, ...args);
    }
  };

  return (
    <TileCatalog
      {...props}
      selectedTileId={selectedTileId}
      // slice doesn't include the last index!
      tiles={filteredTiles.slice(startingIndex, endingIndex + 1)}
      search={{ ...search, onSearch: handleSearch, value: searchState }}
      pagination={{ ...pagination, page, onPage: handlePage, totalItems: tiles ? tiles.length : 0 }}
      onSelection={handleSelection}
    />
  );
};

StatefulTileCatalog.propTypes = propTypes;

export default StatefulTileCatalog;
