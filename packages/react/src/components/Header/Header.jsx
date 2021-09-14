import {
  Header as CarbonHeader,
  HeaderMenuButton,
  HeaderName,
  SkipToContent,
} from 'carbon-components-react/es/components/UIShell';
import PropTypes from 'prop-types';
import React from 'react';
import { Switcher20 } from '@carbon/icons-react';

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
  /** Optionally provide a custom class to apply to the button */
  className: PropTypes.string,
  /** label for the menu button */
  label: PropTypes.string.isRequired,
  /** should the action render a panel or a submenu */
  hasHeaderPanel: PropTypes.bool,
  /** Menu button that pops out the action panel */
  btnContent: PropTypes.node.isRequired,
  /** content to render in the action panel */
  childContent: PropTypes.arrayOf(PropTypes.shape(ChildContentPropTypes)),
  onClick: PropTypes.func,
  /** a string id that can be used by the isActionItemVisible function to determine if an item should be shown */
  id: PropTypes.string,
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

  /** Short name to follow the IBM prefix at top, left on smaller breakpoints */
  // eslint-disable-next-line react/require-default-props, uses appName is none provided
  shortAppName: PropTypes.string,

  /** Optional prop that provides additional app information */
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
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
  i18n: PropTypes.shape({
    mainHeader: PropTypes.string,
    openMenu: PropTypes.string,
    closeMenu: PropTypes.string,
  }),
  testId: PropTypes.string,
  /** Returns true, if the icon should be shown. (actionItem) => {} */
  isActionItemVisible: PropTypes.func,
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
  i18n: {
    mainHeader: 'main header',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  testId: 'header',
  isActionItemVisible: () => true,
};

/**
 * UI header with multiple side panels functionality and dropdowns
 */
const Header = ({
  appName,
  shortAppName,
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
  i18n,
  testId,
  isActionItemVisible,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const theShortAppName = shortAppName || appName;
  const actionItems = !headerPanel
    ? actionItemsProp
    : [
        ...actionItemsProp,
        {
          id: 'app-switcher',
          label: appSwitcherLabel,
          hasHeaderPanel: true,
          btnContent: (
            <Switcher20
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
    <CarbonHeader data-testid={testId} className={className} aria-label={mergedI18n.mainHeader}>
      <SkipToContent href={skipto} />
      {hasSideNav && (
        <HeaderMenuButton
          data-testid={`${testId}-menu-button`}
          aria-label={mergedI18n.openMenu}
          onClick={onClickSideNavExpand}
        />
      )}
      <HeaderName data-testid={`${testId}-name`} href={url} prefix={prefix}>
        <span>{appName}</span>
        {theShortAppName ? (
          <span className={`${iotPrefix}--header__short-name`}>{theShortAppName}</span>
        ) : null}
        {subtitle ? <div className={`${iotPrefix}--header__subtitle`}>{subtitle}</div> : null}
      </HeaderName>
      <HeaderActionGroup
        actionItems={actionItems}
        i18n={mergedI18n}
        testId={`${testId}-action-group`}
        isActionItemVisible={isActionItemVisible}
      />
    </CarbonHeader>
  );
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
