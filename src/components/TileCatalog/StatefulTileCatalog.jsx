import React, { useState, useEffect } from 'react';

import { searchData } from '../Table/tableReducer';

import TileCatalog, { propTypes } from './TileCatalog';

/**
 * Paging and searching happens on local state within the component
 */

const StatefulTileCatalog = ({
  tiles,
  onSelection,
  selectedTileId,
  search,
  pagination,
  ...props
}) => {
  const pageProp = pagination && pagination.page ? pagination.page : 1;
  const [page, setPage] = useState(pageProp);
  const pageSize = pagination && pagination.pageSize ? pagination.pageSize : 10;
  const [searchState, setSearch] = useState('');

  const startingIndex = pagination ? (page - 1) * pageSize : 0;
  const endingIndex = pagination ? (page - 1) * pageSize + pageSize : pageSize;

  const filteredTiles = search ? searchData(tiles, searchState) : tiles;

  const [selectedTile, setSelectedTile] = useState(
    // Default to the passed id
    selectedTileId || (filteredTiles && filteredTiles[startingIndex])
      ? filteredTiles[startingIndex].id
      : null
  );

  // If the filter tiles change (due to a search), I need to reset the page
  useEffect(
    () => {
      setPage(1);
    },
    [filteredTiles]
  );

  // If the tiles page changes, reset to the first
  useEffect(
    () => {
      // new first tile on the page
      setSelectedTile(filteredTiles[startingIndex] ? filteredTiles[startingIndex].id : null);
    },
    [page, filteredTiles, pageSize, startingIndex]
  );

  // TODO: should really refactor this as a reducer but for now
  useEffect(
    () => {
      // if we're passed a selectedTileId use it!
      if (selectedTileId) {
        setSelectedTile(selectedTileId);
      }
    },
    [selectedTileId]
  );

  const handlePage = (...args) => {
    const { onPage } = pagination;
    setPage(...args);
    if (onPage) {
      onPage(...args);
    }
  };

  const handleSelection = (newSelectedTile, ...args) => {
    setSelectedTile(newSelectedTile);
    if (onSelection) {
      onSelection(newSelectedTile, ...args);
    }
  };

  const handleSearch = (event, ...args) => {
    const { onSearch } = search;
    const newSearch = event.target.value || '';
    setSearch(newSearch);
    if (onSearch) {
      onSearch(newSearch, ...args);
    }
  };

  return (
    <TileCatalog
      {...props}
      selectedTileId={selectedTile}
      tiles={filteredTiles.slice(startingIndex, endingIndex)}
      search={{ ...search, onSearch: handleSearch, value: searchState }}
      pagination={{ ...pagination, page, onPage: handlePage, totalItems: tiles ? tiles.length : 0 }}
      onSelection={handleSelection}
    />
  );
};

StatefulTileCatalog.propTypes = propTypes;

export default StatefulTileCatalog;
