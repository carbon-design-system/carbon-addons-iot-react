import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tabs, Tab, Button } from 'carbon-components-react';

import { COLORS, PADDING, SIZES } from '../../styles/styles';

const StyledNavigationContainer = styled.div`
  position: relative;
  background-color: ${COLORS.white};
  padding-top: 3rem;

  ul[role='tablist'] {
    padding-left: ${PADDING.horizontalWrapPadding};
    padding-right: ${PADDING.horizontalWrapPadding};
    align-items: center;
    height: 100%;
    li {
      height: 100%;
      align-items: flex-end;

      @media (min-width: 42em) {
        a.bx--tabs__nav-link {
          height: 100%;
          line-height: calc(3rem - 1.125rem);
        }
      }
    }

    margin-left: 0rem;
  }
  @media (min-width: 42em) {
    padding-top: 0;

    nav::after {
      background: ${COLORS.lightGrey};
      content: '';
      height: 1px;
      left: 0;
      position: absolute;
      bottom: -1px;
      width: 100%;
    }
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
`;

const StyledActions = styled.div`
  display: flex;
  flex-flow: row nowrap;
  display: flex;
  align-items: center;
  position: absolute;
  padding-left: ${PADDING.horizontalWrapPadding};
  padding-right: 0;
  height: ${SIZES.navigationBarHeight};
  top: 0px;
  right: 0px;
  z-index: 2;
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
  hero: PropTypes.node,
  /** workarea renders directly above tabs if passed */
  workArea: PropTypes.node,
};

const defaultProps = {
  actions: [],
  /** by default I think we should hide any TabContent that's not selected */
  hidden: false,
  hero: null,
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
      {hero}
      <StyledTabToContent>
        <Tabs
          {...others}
          onSelectionChange={index => onSelectionChange && onSelectionChange(tabs[index].id)}
        >
          {tabs.map(({ children, id, ...other }) => (
            <Tab key={id} {...other}>
              <StyledTabContent>
                <StyledTabChildren>{children}</StyledTabChildren>
              </StyledTabContent>
            </Tab>
          ))}
        </Tabs>
      </StyledTabToContent>
      {actions && actions.length > 0 ? (
        <StyledActions>
          {actions.map(({ id, ...other }) => (
            <Button key={id} {...other} />
          ))}
        </StyledActions>
      ) : null}
    </StyledNavigationContainer>
  </Fragment>
);

NavigationBar.propTypes = propTypes;
NavigationBar.defaultProps = defaultProps;

export default NavigationBar;
