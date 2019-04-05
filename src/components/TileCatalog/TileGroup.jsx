import React from 'react';
import PropTypes from 'prop-types';
import { Tile } from 'carbon-components-react';
import styled from 'styled-components';

import { MEDIA_QUERIES } from '../../styles/styles';

const StyledTiles = styled.div`
  display: flex;
  flex-flow: row wrap;
  > * {
    flex: 1 1 33.33%;
    min-width: 300px;
  }
  overflow-y: hidden;
`;

const StyledGreedyTile = styled(Tile)`
   {
    flex: 1 1 33.33%;
    display: none;
    min-height: 0px;
    padding: 0px;
    border-top: 0px;
    border-bottom: 0px;
    @media screen and (min-width: ${MEDIA_QUERIES.twoPane}) {
      display: flex;
    }
    @media screen and (min-width: ${MEDIA_QUERIES.threePane}) {
      flex: 1 1 66.66%;
      display: flex;
    }
  }
`;

const propTypes = {
  tiles: PropTypes.arrayOf(PropTypes.node),
  // totalTiles: PropTypes.number,
};

const defaultProps = {
  tiles: null,
  // totalTiles: 0,
};

/** this component just exists to make the last tile look good in a responsive flex container */
const TileGroup = ({ tiles }) => (
  <StyledTiles>
    {tiles}
    <StyledGreedyTile />
  </StyledTiles>
);

TileGroup.propTypes = propTypes;
TileGroup.defaultProps = defaultProps;

export default TileGroup;
