import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { RadioTile, Search } from 'carbon-components-react';

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

const propTypes = {
  pagination: PropTypes.shape({ pageSize: PropTypes.number, onPage: PropTypes.func }),
  /** We will callback with the search value, but it's up to the parent to actually filter the tiles */
  search: PropTypes.shape({ placeHolderText: PropTypes.string, onSearch: PropTypes.func }),

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
 * Renders a searchable and pageable catalog of RadioTiles from carbon. Couldn't reuse the TileGroup component from Carbon due to this limitation
 * https://github.com/IBM/carbon-components-react/issues/1999
 */
const TileCatalog = ({ id, className, title, search, tiles, onChange }) => {
  const [selectedTile, setSelectedTile] = useState(tiles && tiles.length ? tiles[0].id : null);
  const [searchState, setSearch] = useState();

  const handleChange = (newSelectedTile, ...args) => {
    setSelectedTile(newSelectedTile);
    onChange(newSelectedTile, ...args);
  };

  const handleSearch = (event, ...args) => {
    const { onSearch } = search;
    const newSearch = event.currentTarget.value || '';
    setSearch(newSearch);
    onSearch(newSearch, ...args);
  };

  return (
    <StyledContainerDiv className={className}>
      <StyledCatalogHeader>
        {title}
        {search ? (
          <Search
            value={searchState}
            labelText={search.placeHolderText}
            hideLabel
            placeHolderText={search.placeHolderText}
            onChange={handleSearch}
            id={`${id}-searchbox`}
          />
        ) : null}
      </StyledCatalogHeader>
      <StyledTiles>
        {tiles.map(tile => (
          <RadioTile
            className={tile.className}
            key={tile.id}
            value={tile.id}
            name={id}
            checked={selectedTile === tile.id}
            onChange={handleChange}>
            {tile.content}
          </RadioTile>
        ))}
      </StyledTiles>
    </StyledContainerDiv>
  );
};
TileCatalog.propTypes = propTypes;
TileCatalog.defaultProps = defaultProps;

export default TileCatalog;
