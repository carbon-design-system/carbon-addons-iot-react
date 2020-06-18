import {
  Header as CarbonHeader,
  HeaderMenuButton,
  HeaderName,
  SkipToContent,
} from 'carbon-components-react/es/components/UIShell';
import PropTypes from 'prop-types';
import React from 'react';
import { AppSwitcher20 } from '@carbon/icons-react';

import { settings } from '../../constants/Settings';

import HeaderActionGroup from './HeaderActionGroup';

const { prefix: carbonPrefix, iotPrefix } = settings;

/** common proptypes associated with child content for a header action */
export const ChildContentPropTypes = {
  metaData: PropTypes.shape({
    /** The specific type of element to render */
    element: PropTypes.string,
  }),
  content: PropTypes.node,
};

/** common proptypes associated with a header action */
export const HeaderActionItemPropTypes = {
  /** label for the menu button */
  label: PropTypes.string.isRequired,
  /** should the action render a panel or a submenu */
  hasHeaderPanel: PropTypes.bool,
  /** Menu button that pops out the action panel */
  btnContent: PropTypes.node.isRequired,
  /** content to render in the action panel */
  childContent: PropTypes.arrayOf(PropTypes.shape(ChildContentPropTypes)),
  onClick: PropTypes.func,
};

export const HeaderPanelPropTypes = {
  /** Optionally provide a custom class to apply to the underlying <li> node */
  className: PropTypes.string,
  /** the content of the header panel  */
  content: PropTypes.any,
};

const propTypes = {
  /** Add a prefix other than IBM */
  prefix: PropTypes.string,
  /** Name to follow the IBM prefix up top, left */
  appName: PropTypes.string.isRequired,
  /** Optional prop that provides additional app information */
  subtitle: PropTypes.string,
  /** Add a class name to Header */
  className: PropTypes.string,
  /** Provide ID for the skip to content functionality */
  skipto: PropTypes.string,
  /** href optional url to file if you click on title */
  url: PropTypes.string,
  /** Object of action items */
  actionItems: PropTypes.arrayOf(PropTypes.shape(HeaderActionItemPropTypes)).isRequired,
  /** Bit to flip that tells header to render the nav toggle button */
  hasSideNav: PropTypes.bool,
  onClickSideNavExpand: PropTypes.func,
  /** Main app switcher Header panel props */
  headerPanel: PropTypes.shape(HeaderPanelPropTypes),
  /** App switcher label */
  appSwitcherLabel: PropTypes.string,
};

export const APP_SWITCHER = 'AppSwitcher';

const defaultProps = {
  onClickSideNavExpand: null,
  hasSideNav: true,
  prefix: 'IBM',
  className: 'main-header',
  skipto: '#main-content',
  headerPanel: null,
  subtitle: null,
  url: '#',
  appSwitcherLabel: APP_SWITCHER,
};

/**
 * UI header with multiple side panels functionality and dropdowns
 */
const Header = ({
  appName,
  subtitle,
  className,
  actionItems: actionItemsProp,
  prefix,
  skipto,
  hasSideNav,
  onClickSideNavExpand,
  headerPanel,
  url,
  appSwitcherLabel,
}) => {
  const actionItems = !headerPanel
    ? actionItemsProp
    : [
        ...actionItemsProp,
        {
          label: appSwitcherLabel,
          hasHeaderPanel: true,
          btnContent: (
            <AppSwitcher20
              fill="white"
              className={`${carbonPrefix}--header__menu-item ${carbonPrefix}--header__menu-title`}
            />
          ),
          childContent: [
            {
              metaData: {
                className: `${carbonPrefix}--app-switcher ${headerPanel.className}`,
                element: 'a',
              },
              content: <headerPanel.content />,
            },
          ],
        },
      ];

  return (
    <CarbonHeader className={className} aria-label="main header">
      <SkipToContent href={skipto} />
      {hasSideNav && <HeaderMenuButton aria-label="Open menu" onClick={onClickSideNavExpand} />}
      <HeaderName href={url} prefix={prefix}>
        {appName}
        {subtitle ? <div className={`${iotPrefix}--header__subtitle`}>{subtitle}</div> : null}
      </HeaderName>
      <HeaderActionGroup actionItems={actionItems} />
    </CarbonHeader>
  );
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
