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
import useMerged from '../../hooks/useMerged';

import HeaderActionGroup from './HeaderActionGroup';
import { HeaderActionItemPropTypes, HeaderPanelPropTypes } from './HeaderPropTypes';
import { APP_SWITCHER } from './headerConstants';

const { prefix: carbonPrefix, iotPrefix } = settings;

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
  /** allows setting aria-label on side-nav menu button correctly */
  isSideNavExpanded: PropTypes.bool,
};

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
  isSideNavExpanded: false,
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
  isSideNavExpanded,
}) => {
  const mergedI18n = useMerged(defaultProps.i18n, i18n);
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
          aria-label={isSideNavExpanded ? mergedI18n.closeMenu : mergedI18n.openMenu}
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
