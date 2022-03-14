import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { UserAvatar20, Settings20, Help20 } from '@carbon/icons-react';
import { ButtonSkeleton } from 'carbon-components-react';
import classnames from 'classnames';

import SideNav, { SideNavPropTypes } from '../SideNav/SideNav';
import { ToastNotification } from '../Notification';
import { Link } from '../Link';
import Header from '../Header/Header';
import { HeaderActionItemPropTypes, ChildContentPropTypes } from '../Header/HeaderPropTypes';
import { settings } from '../../constants/Settings';
import { SkeletonText } from '../SkeletonText';
import Walkme from '../Walkme/Walkme';
import useMerged from '../../hooks/useMerged';

import SuiteHeaderProfile from './SuiteHeaderProfile/SuiteHeaderProfile';
import SuiteHeaderAppSwitcher from './SuiteHeaderAppSwitcher/SuiteHeaderAppSwitcher';
import SuiteHeaderLogoutModal from './SuiteHeaderLogoutModal/SuiteHeaderLogoutModal';
import IdleLogoutConfirmationModal, {
  IdleLogoutConfirmationModalIdleTimeoutPropTypes,
} from './IdleLogoutConfirmationModal/IdleLogoutConfirmationModal';
import SuiteHeaderI18N from './i18n';
import { shouldOpenInNewWindow } from './suiteHeaderUtils';
import {
  SuiteHeaderApplicationPropTypes,
  SuiteHeaderI18NPropTypes,
  SuiteHeaderRoutePropTypes,
  SuiteHeaderSurveyDataPropTypes,
} from './SuiteHeaderPropTypes';
import { SUITE_HEADER_ROUTE_TYPES } from './suiteHeaderConstants';

const defaultProps = {
  className: null,
  appName: null,
  extraContent: null,
  userDisplayName: null,
  username: null,
  isAdminView: false,
  hasSideNav: false,
  routes: null,
  applications: null,
  sideNavProps: null,
  surveyData: null,
  idleTimeoutData: null,
  onStayLoggedIn: () => {},
  onSideNavToggled: async () => Promise.resolve(true),
  onRouteChange: async () => Promise.resolve(true),
  i18n: SuiteHeaderI18N.en,
  customActionItems: [],
  customHelpLinks: [],
  customProfileLinks: [],
  customApplications: [],
  walkmePath: null,
  walkmeLang: 'en',
  testId: 'suite-header',
  isActionItemVisible: () => true,
};

const propTypes = {
  /** Add class name to the rendered Header component */
  className: PropTypes.string,
  /** Name of suite (maps to appName in Header) */
  suiteName: PropTypes.string.isRequired,
  /** Application name in suite (maps to subtitle in Header) */
  appName: PropTypes.string,
  /** Extra content (a Tag, for example) */
  extraContent: PropTypes.element,
  /** Display name of current user */
  userDisplayName: PropTypes.string,
  /** Username of current user */
  username: PropTypes.string,
  /** If true, renders the admin button in Header as selected */
  isAdminView: PropTypes.bool,
  /** If true, will render the hamburger icon even if no sideNavProps are provided */
  hasSideNav: PropTypes.bool,
  /** URLs for various routes on Header buttons and submenus */
  routes: PropTypes.shape(SuiteHeaderRoutePropTypes),
  /** Applications to render in AppSwitcher */
  applications: PropTypes.arrayOf(PropTypes.shape(SuiteHeaderApplicationPropTypes)),
  /** side navigation component */
  sideNavProps: PropTypes.shape(SideNavPropTypes),
  /** If surveyData is present, show a ToastNotification */
  surveyData: PropTypes.shape(SuiteHeaderSurveyDataPropTypes),
  /** If idleTimeoutData is present, instantiate IdleLogoutConfirmationModal */
  idleTimeoutData: PropTypes.shape(IdleLogoutConfirmationModalIdleTimeoutPropTypes),
  /** Function called when idle timer is restarted */
  onStayLoggedIn: PropTypes.func,
  /** Function called when side nav button is toggled */
  onSideNavToggled: PropTypes.func,
  /** Function called before any route change. Returns a Promise<Boolean>. False means the redirect will not happen. This function should never throw an error. */
  onRouteChange: PropTypes.func,
  /** I18N strings */
  i18n: PropTypes.shape(SuiteHeaderI18NPropTypes),
  /** Array of custom header action items */
  customActionItems: PropTypes.arrayOf(PropTypes.shape(HeaderActionItemPropTypes)),
  /** Array of custom help menu links */
  customHelpLinks: PropTypes.arrayOf(PropTypes.shape(ChildContentPropTypes)),
  /** Array of custom profile menu links */
  customProfileLinks: PropTypes.arrayOf(PropTypes.shape(ChildContentPropTypes)),
  /** Array of custom applications */
  customApplications: PropTypes.arrayOf(PropTypes.shape(SuiteHeaderApplicationPropTypes)),
  /** Path to Walkme entry point */
  walkmePath: PropTypes.string,
  /** Walkme language code */
  walkmeLang: PropTypes.string,
  testId: PropTypes.string,

  /** a function that will be passed the actionItem object and returns a boolean to determine if that item should be shown */
  // eslint-disable-next-line react/forbid-foreign-prop-types
  isActionItemVisible: Header.propTypes.isActionItemVisible,
};

const SuiteHeader = ({
  className,
  suiteName,
  appName,
  extraContent,
  userDisplayName,
  username,
  hasSideNav,
  isAdminView,
  routes,
  applications,
  sideNavProps,
  surveyData,
  idleTimeoutData,
  onStayLoggedIn,
  onSideNavToggled,
  onRouteChange,
  i18n,
  customActionItems,
  customHelpLinks,
  customProfileLinks,
  customApplications,
  walkmePath,
  walkmeLang,
  testId,
  ...otherHeaderProps
}) => {
  const mergedI18n = useMerged(defaultProps.i18n, i18n);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showToast, setShowToast] = useState(surveyData !== null && surveyData !== undefined);
  const translate = useCallback(
    (string, substitutions) =>
      substitutions.reduce((acc, [key, val]) => acc.replace(key, val), string),
    []
  );

  // Make sure that the survey toast notification is displayed if surveyData is passed in future rerenders
  // not only at mount time
  useEffect(() => {
    if (surveyData !== null && surveyData !== undefined) {
      setShowToast(true);
    }
  }, [surveyData]);

  // State for expandable sidenav
  const [isSideNavExpandedState, setIsSideNavExpandedState] = useState(false);

  const handleSideNavButtonClick = useCallback(() => {
    setIsSideNavExpandedState((prevIsSideNavExpanded) => !prevIsSideNavExpanded);
  }, [setIsSideNavExpandedState]);

  const navigatorRoute = routes?.navigator || '#';
  const adminRoute = routes?.admin || '#';

  // If there are custom help links, include an extra child content entry for the separator
  const mergedCustomHelpLinks =
    customHelpLinks.length > 0
      ? [
          ...customHelpLinks,
          {
            metaData: {
              className: `${settings.iotPrefix}--suite-header-help--separator`,
              element: 'div',
            },
            content: '',
          },
        ]
      : [];

  const handleOnClick = (routeType, href, isExternal) => async (e) => {
    e.preventDefault();
    const newWindow = isExternal ? true : shouldOpenInNewWindow(e);
    const result = await onRouteChange(routeType, href);
    if (result) {
      if (newWindow) {
        window.open(href, '_blank', 'noopener noreferrer');
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <>
      {walkmePath ? <Walkme path={walkmePath} lang={walkmeLang} /> : null}
      {showToast ? (
        <ToastNotification
          data-testid={`${testId}-notification`}
          className={`${settings.iotPrefix}--suite-header-survey-toast`}
          kind="info"
          title={
            typeof mergedI18n.surveyTitle === 'function'
              ? mergedI18n.surveyTitle(appName || suiteName)
              : translate(mergedI18n.surveyTitle, [['{solutionName}', appName || suiteName]])
          }
          subtitle={
            <>
              <Link
                href={surveyData.surveyLink}
                rel="noopener noreferrer"
                onClick={handleOnClick(
                  SUITE_HEADER_ROUTE_TYPES.SURVEY,
                  surveyData.surveyLink,
                  true
                )}
              >
                {mergedI18n.surveyText}
              </Link>
              <div className={`${settings.iotPrefix}--suite-header-survey-policy-link`}>
                <Link
                  href={surveyData.privacyLink}
                  rel="noopener noreferrer"
                  onClick={handleOnClick(
                    SUITE_HEADER_ROUTE_TYPES.SURVEY,
                    surveyData.privacyLink,
                    true
                  )}
                >
                  {mergedI18n.surveyPrivacyPolicy}
                </Link>
              </div>
            </>
          }
          lowContrast
          caption=""
          onCloseButtonClick={() => setShowToast(false)}
        />
      ) : null}
      {idleTimeoutData ? (
        <IdleLogoutConfirmationModal
          idleTimeoutData={idleTimeoutData}
          routes={routes}
          onRouteChange={onRouteChange}
          onStayLoggedIn={onStayLoggedIn}
          i18n={i18n}
        />
      ) : null}
      <SuiteHeaderLogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={handleOnClick(SUITE_HEADER_ROUTE_TYPES.LOGOUT, routes?.logout)}
        i18n={{
          heading: mergedI18n.profileLogoutModalHeading,
          primaryButton: mergedI18n.profileLogoutModalPrimaryButton,
          secondaryButton: mergedI18n.profileLogoutModalSecondaryButton,
          body:
            typeof mergedI18n.profileLogoutModalBody === 'function'
              ? mergedI18n.profileLogoutModalBody(appName || suiteName, userDisplayName)
              : translate(mergedI18n.profileLogoutModalBody, [
                  ['{solutionName}', appName || suiteName],
                  ['{userName}', userDisplayName],
                ]),
        }}
        testId={`${testId}-logout-modal`}
      />
      {routes && (
        <>
          <span className={`${settings.iotPrefix}--suite-header-data`} data-type="workspaceId">
            {routes.workspaceId}
          </span>
          <span className={`${settings.iotPrefix}--suite-header-data`} data-type="domain">
            {routes.domain}
          </span>
        </>
      )}
      <Header
        testId={testId}
        className={classnames(`${settings.iotPrefix}--suite-header`, className)}
        url={navigatorRoute}
        hasSideNav={hasSideNav || sideNavProps !== null}
        onClickSideNavExpand={(evt) => {
          evt.preventDefault();
          onSideNavToggled(evt);
          handleSideNavButtonClick(evt);
        }}
        headerPanel={{
          // eslint-disable-next-line react/prop-types
          content: React.forwardRef(({ isExpanded }, ref) => (
            <SuiteHeaderAppSwitcher
              ref={ref}
              applications={applications}
              customApplications={customApplications}
              allApplicationsLink={routes?.navigator}
              noAccessLink={routes?.gettingStarted || '#'}
              onRouteChange={onRouteChange}
              i18n={{
                myApplications: mergedI18n.switcherMyApplications,
                allApplicationsLink: mergedI18n.switcherNavigatorLink,
                requestAccess: mergedI18n.switcherRequestAccess,
                learnMoreLink: mergedI18n.switcherLearnMoreLink,
              }}
              testId={`${testId}-app-switcher`}
              isExpanded={isExpanded}
            />
          )),
        }}
        appName={suiteName}
        subtitle={
          extraContent ? (
            <div>
              {appName}
              <span className={`${settings.iotPrefix}--suite-header-subtitle`}>{extraContent}</span>
            </div>
          ) : (
            appName
          )
        }
        actionItems={[
          ...customActionItems,
          {
            id: 'admin',
            label: mergedI18n.administrationIcon,
            className: [
              'admin-icon',
              !routes?.admin ? 'admin-icon__hidden' : null,
              isAdminView ? 'admin-icon__selected' : null,
            ]
              .filter((i) => i)
              .join(' '),
            btnContent: (
              <span id="suite-header-action-item-admin">
                <Settings20
                  fill="white"
                  data-testid="admin-icon"
                  description={mergedI18n.settingsIcon}
                />
              </span>
            ),
            onClick: async (e) => {
              e.preventDefault();
              let href = adminRoute;
              let routeType = SUITE_HEADER_ROUTE_TYPES.ADMIN;
              if (isAdminView) {
                href = navigatorRoute;
                routeType = SUITE_HEADER_ROUTE_TYPES.NAVIGATOR;
              }
              handleOnClick(routeType, href)(e);
            },
            href: isAdminView ? navigatorRoute : adminRoute,
          },
          {
            id: 'help',
            label: mergedI18n.help,
            onClick: () => {},
            btnContent: (
              <span id="suite-header-action-item-help">
                <Help20 fill="white" description={mergedI18n.help} />
              </span>
            ),
            childContent: routes
              ? [
                  ...mergedCustomHelpLinks,
                  ...[
                    'whatsNew',
                    'gettingStarted',
                    'documentation',
                    'requestEnhancement',
                    'support',
                  ].map((item) => ({
                    metaData: {
                      element: 'a',
                      'data-testid': `suite-header-help--${item}`,
                      href: routes[item],
                      rel: 'noopener noreferrer',
                      title: mergedI18n[item],
                      onClick: handleOnClick(
                        SUITE_HEADER_ROUTE_TYPES.DOCUMENTATION,
                        routes[item],
                        true
                      ),
                    },
                    content: <span id={`suite-header-help-menu-${item}`}>{mergedI18n[item]}</span>,
                  })),
                  {
                    metaData: {
                      element: 'a',
                      'data-testid': 'suite-header-help--about',
                      href: routes.about,
                      rel: 'noopener noreferrer',
                      title: mergedI18n.about,
                      onClick: handleOnClick(SUITE_HEADER_ROUTE_TYPES.ABOUT, routes.about),
                    },
                    content: <span id="suite-header-help-menu-about">{mergedI18n.about}</span>,
                  },
                ]
              : [
                  {
                    metaData: {
                      element: 'div',
                    },
                    content: (
                      <div
                        className={`${settings.iotPrefix}--suite-header-help--loading`}
                        data-testid="suite-header-help--loading"
                      >
                        <SkeletonText paragraph lineCount={6} />
                      </div>
                    ),
                  },
                ],
          },
          {
            id: 'user',
            label: 'user',
            btnContent: (
              <span id="suite-header-action-item-profile">
                <UserAvatar20
                  data-testid="user-icon"
                  fill="white"
                  description={mergedI18n.userIcon}
                />
              </span>
            ),
            childContent: [
              {
                metaData: {
                  element: 'div',
                },
                content: (
                  <span id="suite-header-profile-menu-profile" style={{ width: '100%' }}>
                    <SuiteHeaderProfile
                      displayName={userDisplayName}
                      username={username}
                      profileLink={routes?.profile}
                      onProfileClick={handleOnClick(
                        SUITE_HEADER_ROUTE_TYPES.PROFILE,
                        routes?.profile
                      )}
                      i18n={{
                        profileTitle: mergedI18n.profileTitle,
                        profileButton: mergedI18n.profileManageButton,
                      }}
                      testId={`${testId}-profile`}
                    />
                  </span>
                ),
              },
              ...customProfileLinks,
              username
                ? {
                    metaData: {
                      className: `${settings.iotPrefix}--suite-header--logout`,
                      element: 'a',
                      'data-testid': 'suite-header-profile--logout',
                      href: '#',
                      title: mergedI18n.logout,
                      onClick: (e) => {
                        e.preventDefault();
                        setShowLogoutModal(true);
                      },
                    },
                    content: <span id="suite-header-profile-menu-logout">{mergedI18n.logout}</span>,
                  }
                : {
                    metaData: {
                      element: 'div',
                    },
                    content: (
                      <div
                        className={`${settings.iotPrefix}--suite-header--logout--loading`}
                        data-testid="suite-header--logout--loading"
                      >
                        <ButtonSkeleton />
                      </div>
                    ),
                  },
            ],
          },
        ].filter((i) => i)}
        {...otherHeaderProps}
      />
      {sideNavProps ? (
        <SideNav
          {...sideNavProps}
          isSideNavExpanded={isSideNavExpandedState}
          testId={`${testId}-side-nav`}
        />
      ) : null}
    </>
  );
};

SuiteHeader.defaultProps = defaultProps;
SuiteHeader.propTypes = propTypes;

SuiteHeader.ROUTE_TYPES = SUITE_HEADER_ROUTE_TYPES;

export default SuiteHeader;
