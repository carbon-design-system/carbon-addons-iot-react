import React, { useState, useEffect } from 'react';
import { DataTable } from 'carbon-components-react';
import { Search, Link } from 'carbon-components-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TilePagination from './TilePagination/TilePagination';
import SampleTile from './SampleTile';

const { TableToolbarSearch } = DataTable;

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
  numOfColumns = 0,
  numOfRows = 0,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [tilesOnPage, setTilesOnPage] = useState([]);

  const placeHolderTile = <div className="tile-catalog--tile-canvas--no-placeholder-tile" />;
  const renderColumns = tiles => {
    var cols = [];
    tiles.map((tile, idx, arr) => {
      cols[idx] = <div className="bx--col">{tile}</div>;
    });

    if (cols.length < numOfColumns) {
      console.log(cols.length + 'this is render col length');
      for (let i = cols.length; i < numOfColumns; i++) {
        cols[i] = <div className="tile-catalog--tile-canvas--no-placeholder-tile" />;
        console.log(cols[i]);
      }
    }
    console.log(cols + 'this is returned cols');
    return cols;
  };

  const renderGrid = () => {
    var numberOfTiles = tiles.length;
    var totalRows = 0;
    var rows = [];

    if (numOfColumns !== 0 && numberOfTiles !== 0) {
      totalRows = Math.ceil(numberOfTiles / numOfColumns);
    }

    for (let i = 0; i < totalRows; i++) {
      let lower = i * numOfColumns;
      let upper = lower + numOfColumns;
      rows[i] = <div className="bx--row"> {renderColumns(tiles.slice(lower, upper))}</div>;
    }
    if (rows.length > numOfRows) {
      return rows.slice(0, numOfRows);
    } else {
      if (numberOfTiles < numOfColumns * numOfRows) {
      }
      return rows;
    }
  };
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
            <div className="bx--grid">{renderGrid()}</div>
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
