import { SideNavMenu as CarbonSideNavMenu } from 'carbon-components-react/es/components/UIShell';

import PropTypes from 'prop-types';
import React, { useRef, useEffect } from 'react';

const propTypes = {
  /**
   * Provide <SideNavMenuItem>'s inside of the `SideNavMenu`
   */
  children: PropTypes.node.isRequired,

  /**
   * Pass in a custom icon to render next to the `SideNavMenu` title
   */
  renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

  /**
   * Specify whether the `SideNavMenu` is "active". `SideNavMenu` should be
   * considered active if one of its menu items are a link for the current
   * page.
   */
  isActive: PropTypes.bool,

  /**
   * Provide the text for the overall menu name
   */
  title: PropTypes.string.isRequired,

  /**
   * Specify if this is a large variation of the SideNavMenu
   */
  large: PropTypes.bool,

  index: PropTypes.number.isRequired,

  callback: PropTypes.func.isRequired,
};

const defaultProps = {
  isActive: false,
  large: false,
  renderIcon: null
};

const SideNavMenu = ({ children, renderIcon, isActive, title, large, index, callback }) => {
  const buttonref = useRef(null);
  useEffect(() => {
    console.log(`use effect executed for ${title}`);
    const currentRef = buttonref.current;
    currentRef.addEventListener('click', callback);
    return function cleanup() {
      currentRef.removeEventListener('click', callback);
    };
  }, [callback, title]);

  return (
    <CarbonSideNavMenu
      isActive={isActive}
      renderIcon={renderIcon}
      aria-label="dropdown"
      key={`menu-link-${index}-dropdown`}
      title={title}
      large={large}
      ref={buttonref}
    >
      {children}
    </CarbonSideNavMenu>
  );
};

SideNavMenu.propTypes = propTypes;
SideNavMenu.defaultProps = defaultProps;

export default SideNavMenu;
