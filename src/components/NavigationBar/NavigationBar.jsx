import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tabs, Tab } from 'carbon-components-react';

const StyledNavigationContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const StyledTabContent = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.node,
      children: PropTypes.node,
    })
  ).isRequired,
  /* actions: PropTypes.arrayOf(
    PropTypes.shape({ kind: PropTypes.string, children: PropTypes.node, onClick: PropTypes.func })
  ), */
  /** should I place anything into the work area above the tabs */
  workArea: PropTypes.node,
  /** TEMP: component to render Hero within Nav Bar across all tab content */
  hero: PropTypes.node.isRequired,
};

const defaultProps = {
  workArea: null,
  // actions: [],
};

const NavigationBar = ({ tabs, hero, workArea }) => (
  <StyledNavigationContainer>
    {workArea || null}
    <Tabs>
      {tabs.map(({ children, id, ...other }) => (
        <Tab key={id} {...other}>
          <StyledTabContent>
            <div>{hero}</div>
            <div>{children}</div>
          </StyledTabContent>
        </Tab>
      ))}
    </Tabs>
  </StyledNavigationContainer>
);

NavigationBar.propTypes = propTypes;
NavigationBar.defaultProps = defaultProps;

export default NavigationBar;
