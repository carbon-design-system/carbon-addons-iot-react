import {
  SideNav as CarbonSideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
  // SideNavSwitcher,
} from 'carbon-components-react/es/components/UIShell';
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';

const { iotPrefix, prefix } = settings;

export const SideNavPropTypes = {
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
  i18n: PropTypes.shape({
    closeText: PropTypes.string,
    openText: PropTypes.string,
    sideNavLabelText: PropTypes.string,
    submenuLabel: PropTypes.string,
  }),

  testId: PropTypes.string,
};

const defaultProps = {
  defaultExpanded: false,
  isSideNavExpanded: false,
  i18n: {
    closeText: 'Close',
    openText: 'Open',
    sideNavLabelText: 'Side navigation',
    submenuLabel: 'dropdown',
  },
  testId: 'side-nav',
};

/**
 * Simply recursive check for active children, so that a grandparent
 * can also be marked as active when necessary.
 *
 * @param {Object} link
 * @returns boolean
 */
const isAnyChildActive = (link) => {
  if (link.isActive) {
    return true;
  }

  if (link.hasOwnProperty('childContent')) {
    return link.childContent.some((childLink) => {
      return isAnyChildActive(childLink);
    });
  }

  return false;
};
/**
 * Side Navigation. part of UI shell
 */
const SideNav = ({ links, defaultExpanded, isSideNavExpanded, i18n, testId, ...props }) => {
  /**
   * Recursive function for rendering all the nested children nav items
   *
   * @param {Object} link a single link object
   * @param {Number} index The index of the item in the array
   * @param {Number} level The number of levels deep this link is
   * @returns ReactElement
   */
  const renderLinkMenu = (link, index, level = 0) => {
    let parentActive = false;
    const children = link.childContent.map((childLink, childIndex) => {
      if (isAnyChildActive(childLink)) {
        parentActive = true;
      }

      if (childLink.hasOwnProperty('childContent')) {
        return renderLinkMenu(childLink, childIndex, level + 1);
      }

      return (
        <SideNavMenuItem
          key={`menu-link-${link.childContent.indexOf(childLink)}-child`}
          isActive={childLink.isActive}
          data-testid={`${testId}-menu-item-${index}`}
          {...childLink.metaData}
        >
          {childLink.content}
        </SideNavMenuItem>
      );
    });

    return (
      <SideNavMenu
        isActive={parentActive}
        renderIcon={link.icon}
        aria-label={i18n.submenuLabel}
        key={`menu-link-${links.indexOf(link)}-dropdown`}
        title={link.linkContent}
        data-testid={`${testId}-menu-${index}`}
        className={`${iotPrefix}--side-nav__item--depth-${level}`}
      >
        {children}
      </SideNavMenu>
    );
  };

  const nav = links
    .map((link, index) => {
      const enabled = link.isEnabled ? link.isEnabled : false;
      if (!enabled) {
        return null;
      }

      if (link.hasOwnProperty('childContent')) {
        return renderLinkMenu(link, index, 0);
      }

      return (
        <SideNavLink
          key={`menu-link-${link.metaData.label.replace(/\s/g, '')}-global`}
          aria-label={link.metaData.label}
          onClick={link.metaData.onClick}
          href={link.metaData.href}
          renderIcon={link.icon}
          isActive={link.isActive}
          data-testid={`${testId}-link-${index}`}
          {...link.metaData}
        >
          {link.linkContent}
        </SideNavLink>
      );
    })
    .filter((i) => i);

  // TODO: Will be added back in when footer is added for rails.
  // see: https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/UIShell/SideNav.js#L143
  // const translateById = (id) =>
  //   id !== 'carbon.sidenav.state.closed' ? i18n.closeText : i18n.openText;

  return (
    <CarbonSideNav
      data-testid={testId}
      className={classnames(`${iotPrefix}--side-nav`, {
        [`${iotPrefix}--side-nav--expanded`]: isSideNavExpanded,
        [`${prefix}--side-nav--expanded`]: isSideNavExpanded,
      })}
      expanded={isSideNavExpanded}
      // TODO: Will be added back in when footer is added for rails.
      // see: https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/UIShell/SideNav.js#L143
      // translateById={translateById}
      aria-label={i18n.sideNavLabelText}
      defaultExpanded={defaultExpanded}
      isRail
      {...props} // spreading here as base component does not pass to DOM element.
    >
      <SideNavItems>{nav}</SideNavItems>
    </CarbonSideNav>
  );
};

SideNav.propTypes = SideNavPropTypes;
SideNav.defaultProps = defaultProps;

export default SideNav;
