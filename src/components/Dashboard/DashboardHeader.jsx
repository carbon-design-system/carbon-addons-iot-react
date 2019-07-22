import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { SkeletonText } from 'carbon-components-react';

import { COLORS } from '../../styles/styles';

const propTypes = {
  /** title of the dashboard */
  title: PropTypes.string.isRequired,
  /** Optional description of the dashboard */
  description: PropTypes.string,
  /** string that represents the last updated date */
  lastUpdated: PropTypes.string,
  /** i18n label for last updated text */
  lastUpdatedLabel: PropTypes.string,
  /** Optional filter component that might be used to filter this dashboard */
  filter: PropTypes.node,
};

const defaultProps = {
  description: null,
  lastUpdated: null,
  lastUpdatedLabel: 'Last updated:',
  filter: null,
};

const StyledDashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const StyledLeft = styled.div`
  display: flex;
  flex-flow: column;
  > h2,
  > p {
    padding-bottom: 1rem;
    margin-bottom: 0rem;
  }
  > h2 {
    font-size: 1.75rem;
    font-weight: 400;
  }
  > p,
  div {
    color: ${COLORS.gray};
  }
`;
const LastUpdated = styled.div`
  display: flex;
  white-space: nowrap;
  align-items: center;
  > p {
    margin-left: 1rem;
    margin-bottom: 0rem;
  }
`;

/** Renders the dashboard header at the top of the dashboard */
const DashboardHeader = ({ title, description, lastUpdated, lastUpdatedLabel, filter }) => {
  return (
    <StyledDashboardHeader>
      <StyledLeft>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
        {lastUpdatedLabel ? (
          <LastUpdated>
            {lastUpdatedLabel} {lastUpdated || <SkeletonText />}
          </LastUpdated>
        ) : null}
      </StyledLeft>
      <div>{filter}</div>
    </StyledDashboardHeader>
  );
};

DashboardHeader.propTypes = propTypes;
DashboardHeader.defaultProps = defaultProps;

export default DashboardHeader;
