import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tabs, Tab, Button } from 'carbon-components-react';

const StyledNavigationContainer = styled.div`
  position: relative;
`;

const StyledTabToContent = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
`;

const StyledTabContent = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const StyledActions = styled.div`
  display: flex;
  flex-flow: row nowrap;
  position: absolute;
  top: 0px;
  right: 0px;
  button + button {
    margin-left: 1rem;
  }
`;

const propTypes = {
  /** Array of props to pass through to the tabs */
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node,
      children: PropTypes.node,
    })
  ).isRequired,
  /** Array of props to pass through to the action buttons */
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      kind: PropTypes.string,
      children: PropTypes.node,
      onClick: PropTypes.func,
    })
  ),
  /** If a tab isn't selected, should that tabs contents be removed from the DOM? */
  hidden: PropTypes.bool,
  /** listen to tab change if you want to trigger something on change, not fired on the initial render.  Sends the selected tab id */
  onSelectionChange: PropTypes.func,
  /** TEMP: component to render Hero within Nav Bar across all tab content, we think the tabs will move down over the table and different content will show for each */
  hero: PropTypes.node.isRequired,
};

const defaultProps = {
  actions: [],
  /** by default I think we should hide any TabContent that's not selected */
  hidden: true,
  onSelectionChange: null,
};

/**
 * This component is just wrapping up the Carbon Tabs, adding some optional action buttons at the right side.  And for now automatically rendering a page hero component across all tabs
 */
const NavigationBar = ({ tabs, hero, actions, onSelectionChange, ...others }) => (
  <StyledNavigationContainer>
    <StyledTabToContent>
      <Tabs {...others} onSelectionChange={index => onSelectionChange(tabs[index].id)}>
        {tabs.map(({ children, id, ...other }) => (
          <Tab key={id} {...other}>
            <StyledTabContent>
              <div>{hero}</div>
              <div>{children}</div>
            </StyledTabContent>
          </Tab>
        ))}
      </Tabs>
    </StyledTabToContent>
    <StyledActions>
      {actions.map(({ id, ...other }) => (
        <Button key={id} {...other} />
      ))}
    </StyledActions>
  </StyledNavigationContainer>
);

NavigationBar.propTypes = propTypes;
NavigationBar.defaultProps = defaultProps;

export default NavigationBar;
