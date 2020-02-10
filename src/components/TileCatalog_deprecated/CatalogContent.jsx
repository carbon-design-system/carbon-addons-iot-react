import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { COLORS, TYPOGRAPHY, MEDIA_QUERIES } from '../../styles/styles';

const SampleTile = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  min-height: 6rem;
  height: 100%;
  overflow: hidden;
`;

const SampleTileIcon = styled.div`
  background-color: ${COLORS.lightGrey};
  height: 100px;
  width: 100px;
  min-height: 100px;
  min-width: 100px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
`;
const SampleTileTitle = styled.div`
  color: ${COLORS.blue};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  padding-bottom: 0.5rem;
  max-width: calc(100vw - 20rem);
  @media screen and (min-width: ${MEDIA_QUERIES.twoPane}) {
    max-width: calc(100vw / 2 - 15rem);
  }
  @media screen and (min-width: ${MEDIA_QUERIES.threePane}) {
    max-width: calc(100vw / 3 - 15rem);
  }
`;

const SampleTileContents = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding: 0 1rem;
  align-self: flex-start;
`;

const SampleTileDescription = styled.div`
  font-size: ${TYPOGRAPHY.details};
`;

const propTypes = {
  /** optional icon to visually describe catalog item */
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

const defaultProps = {
  icon: null,
  description: null,
};
/** Reusable widget to show Catalog contents in a tile catalog */
const CatalogContent = ({ icon, title, description }) => (
  <SampleTile>
    {icon ? <SampleTileIcon>{icon}</SampleTileIcon> : null}
    <SampleTileContents>
      <SampleTileTitle>
        <span title={title}>{title}</span>
      </SampleTileTitle>
      <SampleTileDescription>{description}</SampleTileDescription>
    </SampleTileContents>
  </SampleTile>
);

CatalogContent.propTypes = propTypes;
CatalogContent.defaultProps = defaultProps;
export default CatalogContent;
