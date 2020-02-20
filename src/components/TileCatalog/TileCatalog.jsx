import React, { useState } from 'react';
import { DataTable } from 'carbon-components-react';
import { Search, Link } from 'carbon-components-react';
import TilePagination from './TilePagination/TilePagination';
import SampleTile from './SampleTile';

const { TableToolbarSearch } = DataTable;

const propTypes = {};
const defaultProps = {
  onSearch: () => {},
  onSort: () => {},
  numColumns: 1,
  numRows: 1,
  i18n: { sortOptions: {}, placeHolderText: '' },
};

const TileCatalog = ({
  title,
  onSearch,
  tiles,
  featuredTileTitle,
  featuredTile,
  onSort,
  persistentSearch,
  filter,
  numColumns,
  numRows,
  i18n,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const getTile = (rowIdx, colIdx) => {
    var tileIndex = rowIdx * numColumns + colIdx;
    return <div>{tiles[tileIndex]}</div>;
  };

  const renderGrid = () => (
    <div className="bx--grid">
      {Array(numRows)
        .fill(null)
        .map((i, rowIdx) => (
          <div className="bx--row">
            {Array(numColumns)
              .fill(null)
              .map((j, colIdx) => (
                <div className="bx--col">{getTile(rowIdx, colIdx)}</div>
              ))}
          </div>
        ))}
    </div>
  );

  return (
    <div>
      <div>
        {persistentSearch ? (
          <div className="tile-catalog--persistent-search">
            <Search placeHolderText="" onChange="'" size="sm" value="" labelText="" />
          </div>
        ) : null}
        <div />
      </div>

      <div className="tile-catalog--canvas-container ">
        <div className="tile-catalog--tile-canvas">
          {featuredTile ? (
            <div>
              <div className="tile-catalog--tile-canvas--featured-tile-title">
                {featuredTileTitle}
              </div>
              <div className="tile-catalog--tile-canvas--featured-tile">{featuredTile}</div>
            </div>
          ) : null}
          <div className="tile-catalog--tile-canvas--header">
            <div className="tile-catalog--tile-canvas--header--title"> {title}</div>
            {persistentSearch ? null : (
              <div className="search">
                <TableToolbarSearch
                  placeHolderText={i18n.placeHolderText}
                  className="tile-search"
                  onChange={onSearch}
                />
              </div>
            )}
            {i18n.sortOptions.length == 0 ? (
              <select
                className="bx--select-input"
                id="bx-pagination-select-3"
                onChange={onSort}
                value={1}
              >
                {i18n.sortOptions.map(option => (
                  <option
                    className="bx--select-option"
                    disabled={option.disabled}
                    hidden={option.hidden}
                    value={option.value}
                  >
                    {option.value}
                  </option>
                ))}
              </select>
            ) : null}
          </div>

          <div className="tile-catalog--tile-canvas--content">{renderGrid()}</div>
          <div className="tile-catalog--tile-canvas--bottom">
            <TilePagination
              page={currentPage}
              numPages={Math.ceil(tiles.length / (numRows * numColumns))}
              onChange={newPage => setCurrentPage(newPage)}
            />
          </div>
        </div>
        {filter ? (
          <div className="tile-catalog--filter">
            <div className="tile-catalog--filter--title">Refined results</div>
            <div className="tile-catalog--filter--content">
              {filter.selectFilter}
              {filter.checkboxFilter}
              <Link className="bx--link">Reset All</Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

TileCatalog.propTypes = propTypes;
TileCatalog.defaultProps = defaultProps;

export default TileCatalog;
