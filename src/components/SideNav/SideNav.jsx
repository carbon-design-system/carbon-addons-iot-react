import {
  SideNav as CarbonSideNav,
  // SideNavHeader,
  // SideNavDetails,
  // SideNavSwitcher,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
  // SideNavFooter,
} from 'carbon-components-react//lib/components/UIShell';
import { Icon } from 'carbon-components-react';
// import { rem } from 'polished';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';

// import HeaderMenu from '../HeaderMenu';
import { COLORS } from '../../styles/styles';

const StyledSideNav = styled(CarbonSideNav)`
   {
    background-color: ${COLORS.darkGray};
    border-top: 1px solid #3c4646;
    height: calc(100% - 3rem);
  }
`;
const StyledSideNavLink = styled(SideNavLink)`
   {
    :hover {
      background-color: ${COLORS.darkGrayHover};
    }
  }
`;

const StyledSideNavMenu = styled(SideNavMenu)`
   {
    background-color: ${COLORS.darkGray};

    :not(.bx--side-nav__item--active):hover {
      background-color: ${COLORS.darkGray};
    }
    :not(.bx--side-nav__item--active):hover button {
      background-color: ${COLORS.darkGrayHover};
    }
    .bx--side-nav__menu[role='menu']
      a.bx--side-nav__link[role='menuitem']:not(.bx--side-nav__link--current):not([aria-current='page']):hover {
      background-color: ${COLORS.darkGrayHover};
    }

    :hover {
      background-color: ${COLORS.darkGrayHover};
    }
  }
`;

const StyledIcon = styled(Icon)`
   {
    width: 25px;
    height: 25px;
  }
`;

const propTypes = {
  /** array of link item objectss */
  links: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      linkContent: PropTypes.any.isRequired,
      childContent: PropTypes.arrayOf(
        PropTypes.shape({
          onClick: PropTypes.func,
          content: PropTypes.any.isRequired,
        })
      ),
    })
  ).isRequired,
};

const links = [{}];
/**
 * Clickable card that shows "Add" button
 */
const SideNav = ({ links }) => {
  const nav = links.map(link => {
    if (link.hasOwnProperty('childContent')) {
      const children = link.childContent.map(childlink => (
        <SideNavMenuItem
          key={`menu-link-${link.label + link.childContent.indexOf(childlink)}-child`}
          onClick={childlink.onClick}>
          {childlink.content}
        </SideNavMenuItem>
      ));
      return (
        <StyledSideNavMenu aria-label="dropdown" key={`menu-link-${link.label}-dropdown`}>
          {children}
        </StyledSideNavMenu>
      );
    }
    return (
      <StyledSideNavLink
        key={`menu-link-${link.label}-global`}
        aria-label={link.label}
        onClick={link.onClick}
        icon={
          <StyledIcon
            name="header--help"
            fill="white"
            description="Icon"
            className="bx--header__menu-item bx--header__menu-title"
          />
        }>
        {link.btnContent}
      </StyledSideNavLink>
    );
  });

  return (
    <StyledSideNav aria-label="Side navigation" isExpanded={false}>
      <SideNavItems>
        <StyledSideNavLink
          icon={
            <StyledIcon
              name="header--help"
              fill="white"
              description="Icon"
              className="bx--header__menu-item bx--header__menu-title"
            />
          }
          href="javascript:void(0)">
          Link
        </StyledSideNavLink>
        <StyledSideNavMenu
          defaultExpanded
          icon={
            <StyledIcon
              name="header--help"
              fill="white"
              description="Icon"
              className="bx--header__menu-item bx--header__menu-title"
            />
          }
          title="Category title">
          <SideNavMenuItem href="javascript:void(0)">Link</SideNavMenuItem>
          <SideNavMenuItem href="javascript:void(0)">Link</SideNavMenuItem>
          <SideNavMenuItem href="javascript:void(0)">Link</SideNavMenuItem>
        </StyledSideNavMenu>
      </SideNavItems>
    </StyledSideNav>
  );
};

SideNav.propTypes = propTypes;

export default SideNav;
