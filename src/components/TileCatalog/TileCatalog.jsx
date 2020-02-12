import React, { useState, useEffect } from 'react';
import { DataTable } from 'carbon-components-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TilePagination from './TilePagination/TilePagination';
import { placeholder, rem } from 'polished';

const { TableToolbarSearch } = DataTable;

const propTypes = {};

const defaultPros = {};

const sampleTiles = [
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--placeholder-tile" />,
  <div className="tile-catalog--placeholder-tile" />,
];

const TileCatalog = ({ title, search, tiles, featuredTile, sort, pagination, filter }) => {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <div>
      <div className="tile-catalog--header">
        <div className="tile-catalog--header--title"> {title}</div>
        <div className="search">
          <TableToolbarSearch {...search} className="tile-search" />
        </div>
        <select
          className="bx--select-input"
          id="bx-pagination-select-3"
          onChange={[Function]}
          value={1}
        >
          {sort.map(option => (
            <option className="bx--select-option" disabled={false} hidden={false} value={option}>
              {option.option}
            </option>
          ))}
        </select>
      </div>

      <div className="tile-catalog--content">
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
      <div className="tile-catalog--bottom">
        <TilePagination
          page={currentPage}
          numPages={6}
          onChange={newPage => setCurrentPage(newPage)}
        />
      </div>
    </div>
  );
};

TileCatalog.PropTypes = propTypes;
TileCatalog.defaultPros = defaultPros;

export default TileCatalog;
