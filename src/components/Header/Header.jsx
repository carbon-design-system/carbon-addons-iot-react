import {
  Header as CarbonHeader,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  HeaderMenuItem,
  HeaderNavigation,
} from 'carbon-components-react//lib/components/UIShell';
import { rem } from 'polished';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';

import HeaderMenu from '../HeaderMenu';
import { COLORS } from '../../styles/styles';

const StyledHeader = styled(CarbonHeader)`
   {
    background-color: ${COLORS.darkGray};
    margin-top: 2rem;
  }
`;
const StyledGlobalAction = styled(HeaderGlobalAction)`
   {
    align-items: center;
    display: flex;
    justify-content: center;
    min-width: 3rem;
    padding: 0 ${rem(15)};
    position: relative;
    width: auto;
    :hover {
      background-color: ${COLORS.darkGrayHover};
    }
    span {
      display: flex;
    }
  }
`;

const propTypes = {
  /** Name ot follow the IBM prefix up top, left */
  appName: PropTypes.string.isRequired,
  /** Object of action items */
  actionItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      btnContent: PropTypes.any.isRequired,
      childContent: PropTypes.arrayOf(
        PropTypes.shape({
          onClick: PropTypes.func,
          content: PropTypes.any.isRequired,
        })
      ),
    })
  ).isRequired,
};

/**
 * Clickable card that shows "Add" button
 */
const Header = ({ appName, className, actionItems }) => {
  const actionBtnContent = actionItems.map(item => {
    if (item.hasOwnProperty('childContent')) {
      const children = item.childContent.map(childItem => (
        <HeaderMenuItem
          key={`menu-item-${item.label + item.childContent.indexOf(childItem)}-child`}
          /* eslint-disable */
          href="javascript:void(0)"
          /* eslint-enable */
          onClick={() => childItem.onClick}>
          {childItem.content}
        </HeaderMenuItem>
      ));
      return (
        <HeaderNavigation aria-label="dropdown" key={`menu-item-${item.label}-dropdown`}>
          <HeaderMenu
            key={`menu-item-${item.label}`}
            aria-label={item.label}
            content={item.btnContent}>
            {children}
          </HeaderMenu>
        </HeaderNavigation>
      );
    }
    return (
      <StyledGlobalAction
        key={`menu-item-${item.label}-global`}
        aria-label={item.label}
        onClick={item.onClick}>
        {item.btnContent}
      </StyledGlobalAction>
    );
  });

  return (
    <StyledHeader className={className} aria-label="main header">
      <SkipToContent />
      <HeaderName href="#" prefix="IBM">
        {appName}
      </HeaderName>
      <HeaderGlobalBar>{actionBtnContent}</HeaderGlobalBar>
    </StyledHeader>
  );
};

Header.propTypes = propTypes;

export default Header;
