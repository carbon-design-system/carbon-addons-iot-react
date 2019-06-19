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

const sStyledSideNav = styled(CarbonSideNav)`
  &&& {
    background-color: ${COLORS.gray100};
    border-top: 1px solid #3c4646;
    height: calc(100% - 3rem);

    .bx--side-nav__menu[role='menu'] .bx--side-nav__link[role='menuitem'] {
      height: 2rem;
      min-height: 2rem;
      padding-left: 3.5rem;
    }

    .bx--side-nav__link {
      position: relative;
      display: flex;
      align-items: center;
      text-decoration: none;
      min-height: 3rem;
      padding-right: 1rem;
      font-weight: 400;
    }

    button {
      appearance: none;
      width: 100%;
      background: transparent;

      &.bx--side-nav__toggle {
        background: ${COLORS.navToggle};

        :hover {
          background: ${COLORS.gray80};
        }
      }
    }

    button.bx--side-nav__link {
      border: none;
    }

    .bx--side-nav__link > .bx--side-nav__link-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: ${COLORS.gray10};
      font-size: 0.875rem;
      letter-spacing: 0.1px;
      line-height: 1.25rem;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    .bx--side-nav__link:focus {
      outline: 4px solid ${COLORS.blue60};
      outline-offset: -4px;
    }
  }
`;
const sStyledSideNavLink = styled(SideNavLink)`
  &&& {
    position: relative;
    display: flex;
    align-items: center;
    text-decoration: none;
    min-height: 3rem;
    padding-right: 1rem;
    font-weight: 400;

    &.bx--side-nav__link--current {
      background-color: ${COLORS.gray70};
    }

    :focus {
      outline: 4px solid ${COLORS.blue60};
      outline-offset: -4px;
    }

    :hover {
      background-color: ${COLORS.gray80};
    }

    > .bx--side-nav__link-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: ${COLORS.gray10};
      font-size: 0.875rem;
      letter-spacing: 0.1px;
      line-height: 1.25rem;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    > .bx--side-nav__icon {
      margin-right: 0.5rem;
    }
  }
`;

const StyledSideNavMenu = styled(SideNavMenu)`
  &&& {
    background-color: ${COLORS.gray100};

    :not(.bx--side-nav__item--active):hover {
      background-color: ${COLORS.gray100};
    }

    > button:hover {
      background-color: ${COLORS.gray80};
    }

    :hover {
      background-color: ${COLORS.gray80};
    }

    [aria-expanded='true'] {
      background-color: ${COLORS.gray80};

      :hover {
        background-color: ${COLORS.gray80hover};
      }

      + ul {
        background-color: ${COLORS.gray80};
      }

      + ul .bx--side-nav__link:hover {
        background-color: ${COLORS.gray80hover};
      }
    }
    /* We have to apply these styles when we switch out a tag for something else */
    .bx--side-nav__link--current::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 4px;
      background-color: ${COLORS.blue60};
    }
  }
`;

// new styles

const StyledSideNav = styled(CarbonSideNav)`
  && {
    width: 3rem;
    @media screen and (min-width: 1056px) {
      transform: translateX(0);
    }

    &.bx--side-nav--expanded {
      width: 16rem;
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
      background-color: #0062ff;
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
  onClickSideNavExpand: PropTypes.func,
};

const defaultProps = {
  defaultExpanded: false,
  isSideNavExpanded: false,
  onClickSideNavExpand: null,
};

/**
 * Side Navigation. part of UI shell
 */
const SideNav = ({ links, defaultExpanded, isSideNavExpanded, onClickSideNavExpand }) => {
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
    <StyledSideNav aria-label="Side navigation" defaultExpanded={defaultExpanded} isFixedNav>
      <SideNavItems>{nav}</SideNavItems>
    </StyledSideNav>
  );
};

SideNav.propTypes = propTypes;
SideNav.defaultProps = defaultProps;

export default SideNav;
