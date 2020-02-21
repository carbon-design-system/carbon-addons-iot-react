import React, { useState } from 'react';
import { Select, SelectItem, DataTable } from 'carbon-components-react';
import { Search, Link } from 'carbon-components-react';
import TilePagination from './TilePagination/TilePagination';
import PropTypes from 'prop-types';

const { TableToolbarSearch } = DataTable;

const propTypes = {
  title: PropTypes.string,
  onSearch: PropTypes.func,
  onSort: PropTypes.func,
  numColumns: PropTypes.number,
  i18n: PropTypes.shape({
    placeHolderText: PropTypes.string,
  }),
};

const defaultProps = {
  onSearch: () => {},
  onSort: () => {},
  sortOptions: [],
  numColumns: 1,
  numRows: 1,
  i18n: { placeHolderText: '' },
};

const TileCatalog = ({
  title,
  onSearch,
  expandSearch,
  tiles,
  featuredTileTitle,
  featuredTile,
  onSort,
  sortOptions,
  persistentSearch,
  filter,
  numColumns,
  numRows,
  i18n,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSearch, setExpandedSearch] = useState(false);

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
          <div
            className="tile-catalog--tile-canvas--header"
            onClick={() => {
              setExpandedSearch(!expandedSearch);
            }}
          >
            {expandedSearch ? null : (
              <div className="tile-catalog--tile-canvas--header--title"> {title}</div>
            )}
            {persistentSearch ? null : (
              <TableToolbarSearch
                placeHolderText={i18n.placeHolderText}
                onChange={onSearch}
                className="tile-catalog--tile-canvas--header--search"
              />
            )}
            <div className="tile-catalog--tile-canvas--header--select">
              {sortOptions.length !== 0 ? (
                <Select
                  onChange={evt => onSort(evt.target.value)}
                  defaultValue={sortOptions[0].id}
                  labelText=""
                >
                  {sortOptions.map(option => (
                    <SelectItem text={option.text} value={option.id} />
                  ))}
                </Select>
              ) : null}
            </div>
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
