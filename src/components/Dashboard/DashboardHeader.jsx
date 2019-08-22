import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { SkeletonText, Icon } from 'carbon-components-react';

import { handleEnterKeyDown } from '../../utils/componentUtilityFunctions';
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
  /** If the component should render the last updated section */
  hasLastUpdated: PropTypes.bool,
  /** optional actions that will be rendered in the Dashboard header and used in onDashboardAction */
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      /** Unique id of the action */
      id: PropTypes.string.isRequired,
      /** icon ultimately gets passed through all the way to <Button>, which has this same copied proptype definition for icon */
      icon: PropTypes.oneOfType([
        PropTypes.shape({
          width: PropTypes.string,
          height: PropTypes.string,
          viewBox: PropTypes.string.isRequired,
          svgData: PropTypes.object.isRequired,
        }),
        PropTypes.string,
        PropTypes.node,
      ]),
      labelText: PropTypes.string,
    })
  ),
  /** callback invoked if a dashboard action is clicked */
  onDashboardAction: PropTypes.func,
};

const defaultProps = {
  description: null,
  lastUpdated: null,
  lastUpdatedLabel: 'Last updated:',
  filter: null,
  actions: [],
  onDashboardAction: null,
  hasLastUpdated: true,
};

const StyledDashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const StyledLeft = styled.div`
  display: flex;
  flex-flow: column;
  > p {
    padding-bottom: 1rem;
    margin-bottom: 0rem;
  }
  > h2 {
    font-size: 1.75rem;
    font-weight: 400;
    margin-bottom: 0rem;
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
const StyledRight = styled.div`
  display: flex;
  flex-flow: row;
  flex-grow: 0;
  > div + div {
    margin-left: 1rem;
  }
`;
const StyledActions = styled.div`
  display: flex;
  flex-flow: row;
  flex-grow: 0;
  align-items: center;
  > div + div {
    margin-left: 1rem;
  }
`;

/** Renders the dashboard header at the top of the dashboard */
const DashboardHeader = ({
  title,
  description,
  lastUpdated,
  lastUpdatedLabel,
  filter,
  hasLastUpdated,
  actions,
  onDashboardAction,
}) => {
  return (
    <StyledDashboardHeader>
      <StyledLeft>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
        {hasLastUpdated && lastUpdatedLabel ? (
          <LastUpdated>
            {lastUpdatedLabel} {lastUpdated || <SkeletonText />}
          </LastUpdated>
        ) : null}
      </StyledLeft>
      <StyledRight>
        {filter}
        <StyledActions>
          {actions.map(action => (
            <div
              key={action.id}
              tabIndex={0}
              role="button"
              onClick={() => onDashboardAction(action.id)}
              onKeyDown={event => handleEnterKeyDown(event, () => onDashboardAction(action.id))}
            >
              {typeof action.icon === 'string' ? (
                <Icon name={action.icon} title={action.label} />
              ) : (
                <Icon {...action.icon} title={action.label} />
              )}
            </div>
          ))}
        </StyledActions>
      </StyledRight>
    </StyledDashboardHeader>
  );
};

DashboardHeader.propTypes = propTypes;
DashboardHeader.defaultProps = defaultProps;

export default DashboardHeader;
