import {
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
} from 'carbon-components-react//lib/components/UIShell';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';

import { COLORS } from '../../styles/styles';

import CarbonSideNav from './CarbonSideNav';

const StyledSideNav = styled(CarbonSideNav)`
  &&& {
    background-color: ${COLORS.darkGray};
    border-top: 1px solid #3c4646;
    height: calc(100% - 3rem);
  }
`;
const StyledSideNavLink = styled(SideNavLink)`
  &&& {
    :hover {
      background-color: ${COLORS.darkGrayHover};
    }
  }
`;

const StyledSideNavMenu = styled(SideNavMenu)`
  &&& {
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

const propTypes = {
  /** Specify whether the side navigation is expanded or collapsed */
  defaultExpanded: PropTypes.bool,
  /** array of link item objects */
  links: PropTypes.arrayOf(
    PropTypes.shape({
      /** is current link active */
      current: PropTypes.bool,
      /** aria-label */
      label: PropTypes.string,
      /** the icon component to render */
      icon: PropTypes.any.isRequired,
      /** itrigger something instead of follow link */
      onClick: PropTypes.func,
      /** url to link to */
      href: PropTypes.string,
      /** string for the title of overall submenu */
      linkContent: PropTypes.string,
      /** array of child links to render in a subnav */
      childContent: PropTypes.arrayOf(
        PropTypes.shape({
          /** trigger something instead of follow link */
          onClick: PropTypes.func,
          /** url to link to */
          href: PropTypes.string,
          /** content to render inside sub menu link */
          content: PropTypes.any.isRequired,
        })
      ),
    })
  ).isRequired,
};

const defaultProps = {
  defaultExpanded: false,
};

/**
 * Side Navigation. part of UI shell
 */
const SideNav = ({ links, defaultExpanded }) => {
  const nav = links.map(link => {
    if (link.hasOwnProperty('childContent')) {
      const children = link.childContent.map(childlink => (
        <SideNavMenuItem
          key={`menu-link-${link.childContent.indexOf(childlink)}-child`}
          onClick={childlink.onClick}
          href={link.href}>
          {childlink.content}
        </SideNavMenuItem>
      ));
      return (
        <StyledSideNavMenu
          icon={link.icon}
          aria-label="dropdown"
          key={`menu-link-${links.indexOf(link)}-dropdown`}
          title={link.linkContent}>
          {children}
        </StyledSideNavMenu>
      );
    }
    return (
      <StyledSideNavLink
        key={`menu-link-${link.label.replace(/\s/g, '')}-global`}
        aria-label={link.label}
        onClick={link.onClick}
        href={link.href}
        icon={link.icon}
        isActive={link.current}>
        {link.linkContent}
      </StyledSideNavLink>
    );
  });

  return (
    <StyledSideNav aria-label="Side navigation" defaultExpanded={defaultExpanded}>
      <SideNavItems>{nav}</SideNavItems>
    </StyledSideNav>
  );
};

SideNav.propTypes = propTypes;
SideNav.defaultProps = defaultProps;

export default SideNav;
