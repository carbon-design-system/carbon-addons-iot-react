import React, { useState, useEffect } from 'react';

import { searchData } from '../Table/tableReducer';

import TileCatalog, { propTypes } from './TileCatalog';

/**
 * Paging and searching happens on local state within the component
 */
const StatefulTileCatalog = ({ tiles, onSelection, search, pagination, ...props }) => {
  const [page, setPage] = useState(1);
  const [searchState, setSearch] = useState('');

  const filteredTiles = search ? searchData(tiles, searchState) : tiles;

  // If the tiles change (due to a search), I need to reset the page
  useEffect(() => {
    setPage(1);
  }, [filteredTiles]);

  const [selectedTile, setSelectedTile] = useState(
    filteredTiles && filteredTiles.length ? filteredTiles[0].id : null
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
      tiles={filteredTiles}
      search={{ ...search, onSearch: handleSearch, value: searchState }}
      pagination={{ ...pagination, page, onPage: handlePage }}
      onSelection={handleSelection}
    />
  );
};

StatefulTileCatalog.propTypes = propTypes;

export default StatefulTileCatalog;
