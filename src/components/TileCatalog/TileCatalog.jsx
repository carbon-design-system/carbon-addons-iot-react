import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TilePagination from './TilePagination/TilePagination';

const propTypes = {};

const defaultPros = {};

const TileCatalog = ({ title, search, tiles, featuredTile, sort, pagination, filter }) => {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <div>
      <div className=""> {title}</div>
      <div>{tiles}</div>
      <TilePagination
        page={currentPage}
        numPages={6}
        onChange={newPage => setCurrentPage(newPage)}
      />
    </div>
  );
};

TileCatalog.PropTypes = propTypes;
TileCatalog.defaultPros = defaultPros;

export default TileCatalog;
