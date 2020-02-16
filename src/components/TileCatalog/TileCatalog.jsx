import React, { useState, useEffect } from 'react';
import { DataTable } from 'carbon-components-react';
import { Search, Link } from 'carbon-components-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TilePagination from './TilePagination/TilePagination';

const { TableToolbarSearch } = DataTable;

const renderColumns = tiles => {
  var cols = [];
  tiles.map((tile, idx, arr) => {
    cols[idx] = <div className="bx--col">{tile}</div>;
  });
  return cols;
};

const renderGrid = (columnSize, rowSize, tiles) => {
  let numberOfTiles = tiles.length;
  var numberOfRows = Math.ceil(numberOfTiles / columnSize);
  var rows = [];
  for (let i = 0; i < numberOfRows; i++) {
    let lower = i * columnSize;
    let upper = lower + columnSize;
    rows[i] = <div className="bx--row"> {renderColumns(tiles.slice(lower, upper))}</div>;
  }
  if (rows.length > rowSize) {
    return rows.slice(0, rowSize);
  } else {
    return rows;
  }
};

const propTypes = {};

const defaultPros = {};

const TileCatalog = ({
  title,
  search,
  tiles,
  featuredTileTitle,
  featuredTile,
  sort,
  persistentSearch,
  pagination,
  filter,
  numOfColumns,
  numOfRows,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
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
                <TableToolbarSearch {...search} className="tile-search" />
              </div>
            )}
            <select
              className="bx--select-input"
              id="bx-pagination-select-3"
              onChange={[Function]}
              value={1}
            >
              {sort.map(option => (
                <option
                  className="bx--select-option"
                  disabled={false}
                  hidden={false}
                  value={option}
                >
                  {option.option}
                </option>
              ))}
            </select>
          </div>

          <div className="tile-catalog--tile-canvas--content">
            <div className="bx--grid">{renderGrid(numOfColumns, numOfRows, tiles)}</div>
          </div>
          <div className="tile-catalog--tile-canvas--bottom">
            <TilePagination
              page={currentPage}
              numPages={6}
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

TileCatalog.PropTypes = propTypes;
TileCatalog.defaultPros = defaultPros;

export default TileCatalog;
