import React from 'react';
import PropTypes from 'prop-types';
import { Tile } from 'carbon-components-react';
import classNames from 'classnames';

import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  tiles: PropTypes.arrayOf(PropTypes.node),
};

const defaultProps = {
  tiles: null,
};

/** this component just exists to make the last tile look good in a responsive flex container */
const TileGroup = ({ tiles, className }) => (
  <div className={classNames(className, `${iotPrefix}--tile-group`)}>
    {tiles}
    <Tile className={`${iotPrefix}--greedy-tile`} />
  </div>
);

TileGroup.propTypes = propTypes;
TileGroup.defaultProps = defaultProps;

export default TileGroup;
