import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tabs, Tab, Button } from 'carbon-components-react';

import { COLORS, PADDING, SIZES } from '../../styles/styles';

const StyledNavigationContainer = styled.div`
  position: relative;
  background-color: ${COLORS.white};
  ul[role='tablist'] {
    padding-left: ${PADDING.horizontalWrapPadding};
    padding-right: ${PADDING.horizontalWrapPadding};
    border-bottom: 1px solid ${COLORS.lightGrey};
    align-items: center;
    ${props =>
      props.hasActions
        ? `@media screen and (min-width: 768px) {
          li {
            height: ${SIZES.navigationBarHeight};
            line-height: calc(${SIZES.navigationBarHeight} - 1.5rem);
      }
    }`
        : undefined}
    margin-left: 0rem;
  }
`;

const StyledOverlay = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: white;
  opacity: 0.5;
  z-index: 1000;
`;

const StyledTabToContent = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  .bx--tabs-trigger {
    background-color: ${COLORS.white};
  }
`;

const StyledTabContent = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const StyledTabChildren = styled.div`
  background: ${COLORS.superLightGray};
  padding-left: ${PADDING.horizontalWrapPadding};
  padding-right: ${PADDING.horizontalWrapPadding};
  min-height: 100vh;
`;

const StyledActions = styled.div`
  display: flex;
  flex-flow: row nowrap;
  display: none;
  @media screen and (min-width: 768px) {
    display: flex;
  }
  align-items: center;
  position: absolute;
  padding-left: ${PADDING.horizontalWrapPadding};
  padding-right: ${PADDING.horizontalWrapPadding};
  height: ${SIZES.navigationBarHeight};
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
  /** workarea renders directly above tabs if passed */
  workArea: PropTypes.node,
};

const defaultProps = {
  actions: [],
  /** by default I think we should hide any TabContent that's not selected */
  hidden: true,
  onSelectionChange: null,
  workArea: null,
};

/**
 * This component is just wrapping up the Carbon Tabs, adding some optional action buttons at the right side.  And for now automatically rendering a page hero component across all tabs
 */
const NavigationBar = ({ tabs, hero, actions, onSelectionChange, workArea, ...others }) => (
  <Fragment>
    {workArea || null}
    <StyledNavigationContainer hasActions={actions.length > 0}>
      {workArea ? <StyledOverlay /> : null}
      <StyledTabToContent>
        <Tabs
          {...others}
          onSelectionChange={index => onSelectionChange && onSelectionChange(tabs[index].id)}
        >
          {tabs.map(({ children, id, ...other }) => (
            <Tab key={id} {...other}>
              <StyledTabContent>
                {hero}
                <StyledTabChildren>{children}</StyledTabChildren>
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
  </Fragment>
);

NavigationBar.propTypes = propTypes;
NavigationBar.defaultProps = defaultProps;

export default NavigationBar;
