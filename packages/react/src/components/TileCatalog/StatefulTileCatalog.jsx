import React, { useReducer, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { omit, isEqual } from 'lodash-es';

import { usePrevious } from '../../hooks/usePrevious';

import { tileCatalogReducer, determineInitialState, TILE_ACTIONS } from './tileCatalogReducer';
import TileCatalog, { propTypes } from './TileCatalog';

/**
 * Paging and searching happens on local state within the component
 */

const StatefulTileCatalog = ({
  isSelectedByDefault,
  onSelection,
  pagination,
  search,
  selectedTileId: selectedTileIdProp,
  tiles: tilesProp,
  ...props
}) => {
  const initialState = determineInitialState({
    ...props,
    selectedTileId: selectedTileIdProp,
    isSelectedByDefault,
    tiles: tilesProp,
    search,
    pagination,
  });
  const onPage = pagination && pagination.onPage;
  const onSearch = search && search.onSearch;

  const [state, dispatch] = useReducer(tileCatalogReducer, initialState);

  const tilesWithoutRenderContent = useMemo(
    () => tilesProp.map((tile) => omit(tile, 'renderContent')),
    [tilesProp]
  );

  const previousTiles = usePrevious(tilesWithoutRenderContent);

  useEffect(
    () => {
      if (!isEqual(tilesWithoutRenderContent, previousTiles)) {
        // If we get passed a new set of tiles reset!
        dispatch({
          type: TILE_ACTIONS.RESET,
          payload: {
            ...props,
            selectedTileId: selectedTileIdProp,
            isSelectedByDefault,
            tiles: tilesProp,
            search,
            pagination,
          },
        });
        // If we totally change the tiles data, we should generate a selection event for the initial default selection
        if (isSelectedByDefault && onSelection && tilesProp.length > 0 && !selectedTileIdProp) {
          onSelection(tilesProp[0].id);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tilesWithoutRenderContent, previousTiles]
  );

  useEffect(() => {
    if (selectedTileIdProp) {
      dispatch({ type: TILE_ACTIONS.SELECT, payload: selectedTileIdProp });
    }
  }, [selectedTileIdProp]);

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

  const handleSelection = (newSelectedTile) => {
    dispatch({ type: TILE_ACTIONS.SELECT, payload: newSelectedTile });
    if (onSelection) {
      onSelection(newSelectedTile);
    }
  };

  const handleSearch = (event, ...args) => {
    const newSearch = event.target.value || '';
    dispatch({ type: TILE_ACTIONS.SEARCH, payload: newSearch });
    if (onSearch) {
      onSearch(newSearch, ...args);
    }
  };

  const isFiltered = searchState !== '';

  return (
    <TileCatalog
      {...props}
      selectedTileId={selectedTileId}
      // slice doesn't include the last index!
      tiles={
        isFiltered // if the tiles aren't filtered just show the raw prop so that there's no repaint
          ? filteredTiles.slice(startingIndex, endingIndex + 1)
          : tilesProp.slice(startingIndex, endingIndex + 1)
      }
      search={{ ...search, onSearch: handleSearch, value: searchState }}
      pagination={{
        ...pagination,
        page,
        onPage: handlePage,
        totalItems: isFiltered ? filteredTiles.length : tiles ? tiles.length : 0,
      }}
      onSelection={handleSelection}
    />
  );
};

StatefulTileCatalog.defaultProps = {
  isSelectedByDefault: true,
};

StatefulTileCatalog.propTypes = {
  ...propTypes,
  /** Will always select the first entry if set true */
  isSelectedByDefault: PropTypes.bool,
};

export default StatefulTileCatalog;
