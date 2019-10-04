import {
  SideNav as CarbonSideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
  // SideNavSwitcher,
} from 'carbon-components-react//lib/components/UIShell';
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

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
  /** An array of strings which will be options of switcher */
  // switcherProps: PropTypes.obj,
};

const defaultProps = {
  defaultExpanded: false,
  isSideNavExpanded: false,
  // switcherProps: null,
};

/**
 * Side Navigation. part of UI shell
 */
const SideNav = ({ links, defaultExpanded, isSideNavExpanded }) => {
  const nav = links
    .map(link => {
      const enabled = link.isEnabled ? link.isEnabled : false;
      if (!enabled) {
        return null;
      }
      if (link.hasOwnProperty('childContent')) {
        let parentActive = false;
        const children = link.childContent.map(childlink => {
          if (childlink.isActive) {
            parentActive = true;
          }
          return (
            <SideNavMenuItem
              key={`menu-link-${link.childContent.indexOf(childlink)}-child`}
              isActive={childlink.isActive}
              {...childlink.metaData}
            >
              {childlink.content}
            </SideNavMenuItem>
          );
        });
        return (
          <SideNavMenu
            isActive={parentActive}
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
          isActive={link.isActive}
          {...link.metaData}
        >
          {link.linkContent}
        </SideNavLink>
      );
    })
    .filter(i => i);

  return (
    <CarbonSideNav
      className={classnames({ 'bx--side-nav--expanded': isSideNavExpanded })}
      aria-label="Side navigation"
      defaultExpanded={defaultExpanded}
    >
      {/* {switcherProps && <SideNavSwitcher {...switcherProps} />} */}
      <SideNavItems>{nav}</SideNavItems>
    </CarbonSideNav>
  );
};

SideNav.propTypes = propTypes;
SideNav.defaultProps = defaultProps;

export default SideNav;
