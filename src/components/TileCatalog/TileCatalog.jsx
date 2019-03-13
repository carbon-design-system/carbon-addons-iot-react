import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { RadioTile, Tile, Search } from 'carbon-components-react';

import SimplePagination from '../SimplePagination/SimplePagination';

const StyledContainerDiv = styled.div`
  &&& {
    display: flex;
    flex-flow: column nowrap;
  }
`;

const StyledCatalogHeader = styled.div`
  &&& {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    height: 40px;
    margin-bottom: 0.5rem;
    align-items: center;
    .bx--search {
      max-width: 250px;
    }
  }
`;

const StyledTiles = styled.div`
  &&& {
    display: flex;
    flex-flow: row wrap;
    > * {
      flex: 1 1 30%;
      min-width: 250px;
    }
  }
`;

const StyledTitle = styled.span`
  font-weight: bold;
`;

const propTypes = {
  pagination: PropTypes.shape({
    pageSize: PropTypes.number,
    pageText: PropTypes.string,
    nextPageText: PropTypes.string,
    prevPageText: PropTypes.string,
  }),
  /** We will callback with the search value, but it's up to the parent to actually filter the tiles */
  search: PropTypes.shape({
    placeHolderText: PropTypes.string,
    noMatchesFoundText: PropTypes.string,
    onSearch: PropTypes.func,
  }),

  /** form id */
  id: PropTypes.string.isRequired,
  /** title displayed above the catalog */
  title: PropTypes.node,
  /** tiles describes what to render */
  tiles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.node,
      className: PropTypes.string,
    })
  ).isRequired,
  /** Callbacks */
  onChange: PropTypes.func.isRequired,
};

const defaultProps = {
  title: null,
  pagination: null,
  search: null,
};

/**
 * Renders a searchable and pageable catalog of RadioTiles from carbon. Couldn't reuse the TileGroup component from Carbon due to this limitation.
 * Paging happens on local state within the component, but we expect search to be done outside the component on callback
 * and for the parent to update the inbound tiles prop with only the matching results.
 * https://github.com/IBM/carbon-components-react/issues/1999
 */
const TileCatalog = ({ id, className, title, search, pagination, tiles, onChange }) => {
  const [selectedTile, setSelectedTile] = useState(tiles && tiles.length ? tiles[0].id : null);
  const [searchState, setSearch] = useState();
  const [page, setPage] = useState(1);
  // If the tiles change (due to a search), I need to reset the page
  useEffect(
    () => {
      setPage(1);
    },
    [tiles]
  );
  const pageSize = pagination ? pagination.pageSize : 10;

  const handleChange = (newSelectedTile, ...args) => {
    setSelectedTile(newSelectedTile);
    onChange(newSelectedTile, ...args);
  };

  const handleSearch = (event, ...args) => {
    const { onSearch } = search;
    const newSearch = event.target.value || '';
    setSearch(newSearch);
    onSearch(newSearch, ...args);
  };

  const startingIndex = pagination ? (page - 1) * pageSize : 0;
  const endingIndex = pagination ? (page - 1) * pageSize + pageSize : tiles.length;
  return (
    <StyledContainerDiv className={className}>
      <StyledCatalogHeader>
        <StyledTitle>{title}</StyledTitle>
        {search ? (
          <Search
            value={searchState || ''}
            labelText={search.placeHolderText}
            placeHolderText={search.placeHolderText}
            onChange={handleSearch}
            id={`${id}-searchbox`}
          />
        ) : null}
      </StyledCatalogHeader>
      <StyledTiles>
        {tiles.length > 0 ? (
          tiles.slice(startingIndex, endingIndex).map(tile => (
            <RadioTile
              className={tile.className}
              key={tile.id}
              id={tile.id}
              value={tile.id}
              name={id}
              checked={selectedTile === tile.id}
              onChange={handleChange}>
              {tile.content}
            </RadioTile>
          ))
        ) : (
          <Tile>{(search && search.noMatchesFoundText) || 'No matches found'}</Tile>
        )}
      </StyledTiles>
      {pagination ? (
        <SimplePagination
          {...pagination}
          page={page}
          maxPage={Math.ceil(tiles.length / pageSize)}
          onPage={setPage}
        />
      ) : null}
    </StyledContainerDiv>
  );
};
TileCatalog.propTypes = propTypes;
TileCatalog.defaultProps = defaultProps;

export default TileCatalog;
