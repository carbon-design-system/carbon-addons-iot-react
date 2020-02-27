import React, { useState } from 'react';
import { Select, SelectItem, DataTable } from 'carbon-components-react';
import PropTypes from 'prop-types';
import sizeMe from 'react-sizeme';

import { settings } from '../../constants/Settings';

import TilePagination from './TilePagination/TilePagination';

const { TableToolbarSearch } = DataTable;
const { iotPrefix } = settings;

const propTypes = {
  /** Title for the product */
  title: PropTypes.string.isRequired,
  /** Number of columns to be rendered per page */
  numColumns: PropTypes.number,
  /** Number of rows to be rendered per page */
  numRows: PropTypes.number,
  /** A collection of tiles to to rendered  */
  tiles: PropTypes.arrayOf.isRequired,
  /** Set to true if a search is needed */
  hasSearch: PropTypes.bool,
  /** Call back function of search */
  onSearch: PropTypes.func,
  /** Set to true if sorting is needed */
  hasSort: PropTypes.bool,
  /** Call back function of sort */
  onSort: PropTypes.func,
  /** Options in sort */
  sortOptions: PropTypes.arrayOf,
  /** Default option in sort */
  selectedSortOption: PropTypes.string,
  /** Set to true if filter is needed */
  i18n: PropTypes.shape({
    placeHolderText: PropTypes.string,
  }),
};

const defaultProps = {
  hasSort: false,
  hasSearch: false,
  onSearch: () => {},
  onSort: () => {},
  sortOptions: [],
  selectedSortOption: '',
  numColumns: 1,
  numRows: 1,
  i18n: { searchPlaceHolderText: 'Enter a value' },
};

const TileCatalog = ({
  title,
  numColumns,
  numRows,
  tiles,
  hasSearch,
  onSearch,
  hasSort,
  onSort,
  sortOptions,
  selectedSortOption,
  i18n,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tileHeight, setTileHeight] = useState(0);

  const onSize = ({ height }) => {
    setTileHeight(height);
  };

  const HeightMonitor = sizeMe({
    monitorHeight: true,
  })(({ content }) => <div>{content}</div>);

  const getTile = (rowIdx, colIdx) => {
    const numTilesPerPage = numRows * numColumns;
    const tileIndex = rowIdx * numColumns + colIdx + (currentPage - 1) * numTilesPerPage;

    if (tileIndex === 0) {
      return <HeightMonitor content={tiles[0]} onSize={onSize} />;
    }
    return tiles[tileIndex] !== undefined ? (
      tiles[tileIndex]
    ) : (
      <div style={{ height: tileHeight }} />
    );
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
        {/* {persistentSearch ? (
          <div className="tile-catalog--persistent-search">
            <Search placeHolderText="" onChange="'" size="sm" value="" labelText="" />
          </div>
        ) : null} */}
        <div />
      </div>

      <div className={`${iotPrefix}--tile-catalog--canvas-container`}>
        <div className={`${iotPrefix}--tile-catalog--tile-canvas`}>
          {/* {featuredTile ? (
            <div>
              <div className="tile-catalog--tile-canvas--featured-tile-title">
                {featuredTileTitle}
              </div>
              <div className="tile-catalog--tile-canvas--featured-tile">{featuredTile}</div>
            </div>
          ) : null} */}
          <div className={`${iotPrefix}--tile-catalog--tile-canvas--header`}>
            <div className={`${iotPrefix}--tile-catalog--tile-canvas--header--title`}> {title}</div>
            {hasSearch ? (
              <TableToolbarSearch
                placeHolderText={i18n.searchPlaceHolderText}
                onChange={onSearch}
                className={`${iotPrefix}--tile-catalog--tile-canvas--header--search`}
              />
            ) : null}
            <div className={`${iotPrefix}--tile-catalog--tile-canvas--header--select`}>
              {hasSort ? (
                <Select
                  onChange={evt => onSort(evt.target.value)}
                  defaultValue={selectedSortOption}
                  labelText=""
                >
                  {sortOptions.map(option => (
                    <SelectItem text={option.text} value={option.id} />
                  ))}
                </Select>
              ) : null}
            </div>
          </div>

          <div className={`${iotPrefix}--tile-catalog--tile-canvas--content`}>{renderGrid()}</div>
          <div className={`${iotPrefix}--tile-catalog--tile-canvas--bottom`}>
            <TilePagination
              page={currentPage}
              numPages={Math.ceil(tiles.length / (numRows * numColumns))}
              onChange={newPage => setCurrentPage(newPage)}
            />
          </div>
        </div>
        {/* {hasFilter ? (
          <div className="tile-catalog--filter">
            <div className="tile-catalog--filter--title">Refined results</div>
            <div className="tile-catalog--filter--content">
              {filter.selectFilter}
              {filter.checkboxFilter}
            </div>
          </div>
        ) : null} */}
      </div>
    </div>
  );
};

TileCatalog.propTypes = propTypes;
TileCatalog.defaultProps = defaultProps;

export default TileCatalog;
