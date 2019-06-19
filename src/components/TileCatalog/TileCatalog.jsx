import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { RadioTile, Tile, SkeletonText, DataTable } from 'carbon-components-react';
import Bee32 from '@carbon/icons-react/lib/bee/32';

import SimplePagination from '../SimplePagination/SimplePagination';
import { COLORS } from '../../styles/styles';

import TileGroup from './TileGroup';

const { TableToolbarSearch } = DataTable;

const StyledContainerDiv = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const StyledCatalogHeader = styled.div`
  background: ${COLORS.gray10};

  display: flex;
  height: 3rem;

  .bx--toolbar-action:active:not([disabled]) {
    outline-color: transparent;
  }

  .bx--toolbar-search-container-expandable {
    max-width: 40%;
    padding: 0;
    width: auto;
  }

  .bx--search-input:focus {
    width: 100%;
  }
`;

const StyledEmptyTile = styled(Tile)`
  &&& {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    > * {
      padding-bottom: 0.5rem;
    }
  }
`;

export const propTypes = {
  /** Is the data actively loading? */
  isLoading: PropTypes.bool,
  /** error loading the tile catalog */
  error: PropTypes.string,
  pagination: PropTypes.shape({
    pageSize: PropTypes.number,
    pageText: PropTypes.string,
    /** Gets called back with arguments (page, maxPage) */
    pageOfPagesText: PropTypes.func,
    nextPageText: PropTypes.string,
    prevPageText: PropTypes.string,
    onPage: PropTypes.func,
    /** current page number */
    page: PropTypes.number,
    totalItems: PropTypes.number,
  }),

  /** We will callback with the search value */
  search: PropTypes.shape({
    placeHolderText: PropTypes.string,
    noMatchesFoundText: PropTypes.string,
    /** current search value */
    value: PropTypes.string,
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
      /**  the values field is searched by the search widget */
      values: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
      /** renderContent is called back with the full value object and id to render */
      renderContent: PropTypes.func,
      className: PropTypes.string,
    })
  ).isRequired,
  /** Callbacks */
  onSelection: PropTypes.func.isRequired,
  /** currently selected tile id */
  selectedTileId: PropTypes.string,
};

const defaultProps = {
  isLoading: false,
  title: null,
  error: null,
  pagination: null,
  search: null,
  selectedTileId: null,
};

/**
 * Renders a searchable and pageable catalog of RadioTiles from carbon. Couldn't reuse the TileGroup component from Carbon due to this limitation.
 * https://github.com/IBM/carbon-components-react/issues/1999
 *
 */
const TileCatalog = ({
  id,
  className,
  isLoading,
  error,
  search,
  pagination,
  tiles,
  onSelection,
  selectedTileId,
}) => {
  const searchState = search ? search.value : '';
  const handleSearch = search && search.onSearch;
  const pageSize = pagination && pagination.pageSize ? pagination.pageSize : 10;
  const totalTiles = pagination && pagination.totalItems ? pagination.totalItems : 10;

  return (
    <StyledContainerDiv className={className}>
      <StyledCatalogHeader>
        {search && search.placeHolderText ? (
          <TableToolbarSearch
            small
            value={searchState}
            labelText={search.placeHolderText}
            placeHolderText={search.placeHolderText}
            onChange={handleSearch}
            id={`${id}-searchbox`}
          />
        ) : null}
      </StyledCatalogHeader>
      {isLoading ? ( // generate empty tiles for first page
        <TileGroup
          tiles={[...Array(pageSize)].map((val, index) => (
            <StyledEmptyTile key={`emptytile-${index}`}>
              <SkeletonText />
            </StyledEmptyTile>
          ))}
          totalTiles={totalTiles}
        />
      ) : tiles.length > 0 ? (
        <TileGroup
          tiles={tiles.map(tile => (
            <RadioTile
              className={tile.className}
              key={tile.id}
              id={tile.id}
              value={tile.id}
              name={id}
              checked={selectedTileId === tile.id}
              onChange={onSelection}
            >
              {tile.renderContent
                ? tile.renderContent({ values: tile.values, id: tile.id })
                : tile.value}
            </RadioTile>
          ))}
        />
      ) : (
        <StyledEmptyTile>
          {error || (
            <Fragment>
              <Bee32 />
              <p>{(search && search.noMatchesFoundText) || 'No matches found'}</p>
            </Fragment>
          )}
        </StyledEmptyTile>
      )}
      {!isLoading && tiles.length > 0 && !error && pagination ? (
        <SimplePagination {...pagination} maxPage={Math.ceil(totalTiles / pageSize)} />
      ) : null}
    </StyledContainerDiv>
  );
};
TileCatalog.propTypes = propTypes;
TileCatalog.defaultProps = defaultProps;

export default TileCatalog;
