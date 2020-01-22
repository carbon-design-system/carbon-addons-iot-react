import {
  Header as CarbonHeader,
  HeaderMenuButton,
  HeaderName,
  SkipToContent,
} from 'carbon-components-react/lib/components/UIShell';
import PropTypes from 'prop-types';
import React from 'react';
import AppSwitcher from '@carbon/icons-react/lib/app-switcher/20';

import HeaderBar from './HeaderBar';

/** common proptypes associated with child content for a header action */
export const ChildContentPropTypes = PropTypes.arrayOf(
  PropTypes.shape({
    metaData: PropTypes.shape({
      /** The specific type of element to render */
      element: PropTypes.string,
    }),
    content: PropTypes.node,
  })
);

/** common proptypes associated with a header action */
export const HeaderActionItemPropTypes = PropTypes.shape({
  /** label for the menu button */
  label: PropTypes.string.isRequired,
  /** should the action render a panel or a submenu */
  hasHeaderPanel: PropTypes.bool,
  /** Menu button that pops out the action panel */
  btnContent: PropTypes.node.isRequired,
  /** content to render in the action panel */
  childContent: ChildContentPropTypes.isRequired,
  onClick: PropTypes.func,
});

export const HeaderPanelPropTypes = PropTypes.shape({
  /** Optionally provide a custom class to apply to the underlying <li> node */
  className: PropTypes.string,
  /** the content of the header panel  */
  content: PropTypes.any,
});

const propTypes = {
  /** Add a prefix other than IBM */
  prefix: PropTypes.string,
  /** Name to follow the IBM prefix up top, left */
  appName: PropTypes.string.isRequired,
  /** Add a class name to Header */
  className: PropTypes.string,
  /** Provide ID for the skip to content functionality */
  skipto: PropTypes.string,
  /** href optional url to file if you click on title */
  url: PropTypes.string,
  /** Object of action items */
  actionItems: PropTypes.arrayOf(HeaderActionItemPropTypes).isRequired,
  /** Bit to flip that tells header to render the nav toggle button */
  hasSideNav: PropTypes.bool,
  onClickSideNavExpand: PropTypes.func,
  /** Main app switcher Header panel props */
  headerPanel: HeaderPanelPropTypes,
};

const defaultProps = {
  onClickSideNavExpand: null,
  hasSideNav: true,
  prefix: 'IBM',
  className: 'main-header',
  skipto: '#main-content',
  headerPanel: null,
  url: '#',
};

export const appSwitcher = 'AppSwitcher';

/**
 * UI header with multiple side panels functionality and dropdowns
 */
const Header = ({
  appName,
  className,
  actionItems,
  prefix,
  skipto,
  hasSideNav,
  onClickSideNavExpand,
  headerPanel,
  url,
}) => {
  if (headerPanel) {
    // Add AppSwitcher
    actionItems.push({
      label: appSwitcher,
      hasHeaderPanel: true,
      btnContent: (
        <AppSwitcher
          fill="white"
          description="Icon"
          className="bx--header__menu-item bx--header__menu-title"
        />
      ),
      childContent: [
        {
          metaData: {
            className: headerPanel.className,
            element: 'a',
          },
          content: headerPanel.content,
        },
      ],
    });
  }
  return (
    <CarbonHeader className={className} aria-label="main header">
      <SkipToContent href={skipto} />
      {hasSideNav && <HeaderMenuButton aria-label="Open menu" onClick={onClickSideNavExpand} />}
      <HeaderName href={url} prefix={prefix}>
        {appName}
      </HeaderName>
      <HeaderBar actionItems={actionItems} headerPanel={headerPanel} />
    </CarbonHeader>
  );
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
