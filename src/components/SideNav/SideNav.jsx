import {
  SideNav as CarbonSideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
} from 'carbon-components-react//lib/components/UIShell';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import { COLORS, PADDING } from '../../styles/styles';

// import CarbonSideNav from './CarbonSideNav';

const StyledSideNav = styled(CarbonSideNav)`
  && {
    width: 3rem;
    @media screen and (min-width: 1056px) {
      transform: translateX(0);
    }

    &.bx--side-nav--expanded {
      width: 16rem;
      transform: translateX(0);
    }

    .bx--side-nav__link {
      font-weight: 600;
      outline: 2px solid transparent;
      outline-offset: -2px;
      font-size: 0.875rem;
      line-height: 1.125rem;
      letter-spacing: 0.16px;
      position: relative;
      display: flex;
      align-items: center;
      text-decoration: none;
      min-height: 2rem;
      padding: 0 ${PADDING.horizontalWrapPadding};
      transition: color 110ms, background-color 110ms, outline 110ms;

      :focus {
        outline: 2px solid ${COLORS.blue60};
        outline-offset: -2px;
      }

      :hover {
        background-color: ${COLORS.gray10hover};
        color: ${COLORS.gray100};
      }
    }

    button.bx--side-nav__link {
      appearance: none;
      border: none;
      width: 100%;
    }

    .bx--side-nav__link[aria-current='page']::before,
    .bx--side-nav__link--current::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 4px;
      background-color: ${COLORS.blue60};
    }

    .bx--side-nav__menu[role='menu'] .bx--side-nav__link[role='menuitem'] {
      height: 2rem;
      min-height: 2rem;
      padding-left: 2rem;
    }

    .bx--side-nav__link--current {
      background: ${COLORS.gray20};
    }

    .bx--side-nav__item.bx--side-nav__item--icon .bx--side-nav__link[role='menuitem'] {
      padding-left: 4.5rem;
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
      /** bot show/hide link */
      isEnabled: PropTypes.bool,
      /** extra props to pass to link component */
      /** Example:
          // What to render for link
          element: PropTypes.any,
          // trigger something instead of follow link
          onClick: PropTypes.func,
          // url to link to
          href: PropTypes.string,
      */
      metaData: PropTypes.object,
      /** the icon component to render */
      icon: PropTypes.any.isRequired,
      /** string for the title of overall submenu */
      linkContent: PropTypes.string,
      /** array of child links to render in a subnav */
      childContent: PropTypes.arrayOf(
        PropTypes.shape({
          /** props to pass to link component */
          /** Example:
            // What to render for link
            element: PropTypes.any,
            // trigger something instead of follow link
            onClick: PropTypes.func,
            // url to link to
            href: PropTypes.string,
          */
          metaData: PropTypes.object,
          /** content to render inside sub menu link */
          content: PropTypes.any.isRequired,
        })
      ),
    })
  ).isRequired,
  isSideNavExpanded: PropTypes.bool,
};

const defaultProps = {
  defaultExpanded: false,
  isSideNavExpanded: false,
};

/**
 * Side Navigation. part of UI shell
 */
const SideNav = ({ links, defaultExpanded, isSideNavExpanded }) => {
  const nav = links.map(link => {
    const enabled = link.isEnabled ? link.isEnabled : false;
    if (!enabled) {
      return null;
    }
    if (link.hasOwnProperty('childContent')) {
      const children = link.childContent.map(childlink => (
        <SideNavMenuItem
          key={`menu-link-${link.childContent.indexOf(childlink)}-child`}
          isActive={childlink.current}
          {...childlink.metaData}
        >
          {childlink.content}
        </SideNavMenuItem>
      ));
      return (
        <SideNavMenu
          className={classnames({ disabled: link.isEnabled })}
          renderIcon={link.icon}
          aria-label="dropdown"
          key={`menu-link-${links.indexOf(link)}-dropdown`}
          title={link.linkContent}
        >
          {children}
        </SideNavMenu>
      );
    }
    return (
      <SideNavLink
        className={classnames({ disabled: link.isEnabled })}
        key={`menu-link-${link.metaData.label.replace(/\s/g, '')}-global`}
        aria-label={link.metaData.label}
        onClick={link.metaData.onClick}
        href={link.metaData.href}
        renderIcon={link.icon}
        isActive={link.current}
        {...link.metaData}
      >
        {link.linkContent}
      </SideNavLink>
    );
  });

  return (
    <StyledSideNav
      className={classnames({ 'bx--side-nav--expanded': isSideNavExpanded })}
      aria-label="Side navigation"
      defaultExpanded={defaultExpanded}
      isFixedNav
    >
      <SideNavItems>{nav}</SideNavItems>
    </StyledSideNav>
  );
};

SideNav.propTypes = propTypes;
SideNav.defaultProps = defaultProps;

export default SideNav;
