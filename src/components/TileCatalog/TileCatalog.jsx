import React, { useState, useEffect } from 'react';
import { DataTable } from 'carbon-components-react';
import { Search } from 'carbon-components-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TilePagination from './TilePagination/TilePagination';
import { placeholder, rem } from 'polished';

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
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <div>
      {persistentSearch ? (
        <div className="tile-catalog--persistent-search">
          <Search placeHolderText="" onChange="'" size="sm" value="" labelText="" />
        </div>
      ) : null}
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
            <div className="bx--grid">
              {tiles.map((item, idx, arr) =>
                idx % 4 === 0 ? (
                  <div className="bx--row">
                    <div className="bx--col">{arr[idx]}</div>
                    <div className="bx--col">{idx + 1 < arr.length ? arr[idx + 1] : ''}</div>
                    <div className="bx--col">{idx + 2 < arr.length ? arr[idx + 2] : ''}</div>
                    <div className="bx--col">{idx + 3 < arr.length ? arr[idx + 3] : ''}</div>
                  </div>
                ) : null
              )}
            </div>
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
