/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */

import React, { Fragment, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { UserAvatar20, Settings20, Help20 } from '@carbon/icons-react';

import { HeaderContainer, SideNav, Header } from '../../index';
import { SideNavPropTypes } from '../SideNav/SideNav';
import { ToastNotification } from '../Notification';
import { Link } from '../Link';
import { HeaderActionItemPropTypes } from '../Header/Header';
import { settings } from '../../constants/Settings';

import SuiteHeaderProfile from './SuiteHeaderProfile/SuiteHeaderProfile';
import SuiteHeaderAppSwitcher from './SuiteHeaderAppSwitcher/SuiteHeaderAppSwitcher';
import SuiteHeaderLogoutModal from './SuiteHeaderLogoutModal/SuiteHeaderLogoutModal';
import SuiteHeaderI18N from './i18n';

const ROUTE_TYPES = {
  ADMIN: 'ADMIN',
  NAVIGATOR: 'NAVIGATOR',
  REFERRER: 'REFERRER',
  APPLICATION: 'APPLICATION',
  PROFILE: 'PROFILE',
  ABOUT: 'ABOUT',
  LOGOUT: 'LOGOUT',
  DOCUMENTATION: 'DOCUMENTATION',
  SURVEY: 'SURVEY',
};

export const SuiteHeaderRoutePropTypes = PropTypes.shape({
  profile: PropTypes.string,
  navigator: PropTypes.string,
  admin: PropTypes.string,
  logout: PropTypes.string,
  whatsNew: PropTypes.string,
  gettingStarted: PropTypes.string,
  documentation: PropTypes.string,
  requestEnhancement: PropTypes.string,
  support: PropTypes.string,
  about: PropTypes.string,
  // properties rendered as data attributes
  workspaceId: PropTypes.string,
  domain: PropTypes.string,
});

export const SuiteHeaderApplicationPropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  isExternal: PropTypes.bool,
});

export const SuiteHeaderSurveyDataPropTypes = PropTypes.shape({
  surveyLink: PropTypes.string.isRequired,
  privacyLink: PropTypes.string.isRequired,
});

export const SuiteHeaderI18NPropTypes = PropTypes.shape({
  help: PropTypes.string,
  profileTitle: PropTypes.string,
  profileManageButton: PropTypes.string,
  profileLogoutButton: PropTypes.string,
  logout: PropTypes.string,
  userIcon: PropTypes.string,
  administrationIcon: PropTypes.string,
  settingsIcon: PropTypes.string,
  profileLogoutModalHeading: PropTypes.string,
  profileLogoutModalSecondaryButton: PropTypes.string,
  profileLogoutModalPrimaryButton: PropTypes.string,
  profileLogoutModalBody: PropTypes.func,
  switcherNavigatorLink: PropTypes.string,
  whatsNew: PropTypes.string,
  documentation: PropTypes.string,
  requestEnhancement: PropTypes.string,
  about: PropTypes.string,
  support: PropTypes.string,
  gettingStarted: PropTypes.string,
  surveyTitle: PropTypes.func,
  surveyText: PropTypes.string,
  surveyPrivacyPolicy: PropTypes.string,
});

const defaultProps = {
  className: null,
  appName: null,
  isAdminView: false,
  sideNavProps: null,
  customActionItems: [],
  surveyData: null,
  onRouteChange: async () => Promise.resolve(true),
  i18n: SuiteHeaderI18N.en,
};

const propTypes = {
  /** Add class name to the rendered Header component */
  className: PropTypes.string,
  /** Name of suite (maps to appName in Header) */
  suiteName: PropTypes.string.isRequired,
  /** Application name in suite (maps to subtitle in Header) */
  appName: PropTypes.string,
  /** Display name of current user */
  userDisplayName: PropTypes.string.isRequired,
  /** Username of current user */
  username: PropTypes.string.isRequired,
  /** If true, renders the admin button in Header as selected */
  isAdminView: PropTypes.bool,
  /** URLs for various routes on Header buttons and submenus */
  routes: SuiteHeaderRoutePropTypes.isRequired,
  /** Applications to render in AppSwitcher */
  applications: PropTypes.arrayOf(SuiteHeaderApplicationPropTypes).isRequired,
  /** side navigation component */
  sideNavProps: PropTypes.shape(SideNavPropTypes),
  /** Array of custom action items */
  customActionItems: PropTypes.arrayOf(PropTypes.shape(HeaderActionItemPropTypes)),
  /** If surveyData is present, show a ToastNotification */
  surveyData: SuiteHeaderSurveyDataPropTypes,
  /** Function called before any route change. Returns a Promise<Boolean>. False means the redirect will not happen. This function should never throw an error. */
  onRouteChange: PropTypes.func,
  /** I18N strings */
  i18n: SuiteHeaderI18NPropTypes,
};

const SuiteHeader = ({
  className,
  suiteName,
  appName,
  userDisplayName,
  username,
  isAdminView,
  routes,
  applications,
  sideNavProps,
  customActionItems,
  surveyData,
  onRouteChange,
  i18n,
  ...otherHeaderProps
}) => {
  const mergedI18N = { ...defaultProps.i18n, ...i18n };
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

  return (
    <>
      {showToast ? (
        <ToastNotification
          className={`${settings.iotPrefix}--suite-header-survey-toast`}
          kind="info"
          title={
            typeof mergedI18N.surveyTitle === 'function'
              ? mergedI18N.surveyTitle(appName || suiteName)
              : translate(mergedI18N.surveyTitle, [['{solutionName}', appName || suiteName]])
          }
          subtitle={
            <>
              <Link
                href="javascript:void(0)"
                onClick={async () => {
                  const result = await onRouteChange(ROUTE_TYPES.SURVEY, surveyData.surveyLink);
                  if (result) {
                    window.open(surveyData.surveyLink, 'blank');
                  }
                }}
              >
                {mergedI18N.surveyText}
              </Link>
              <div className={`${settings.iotPrefix}--suite-header-survey-policy-link`}>
                <Link
                  href="javascript:void(0)"
                  onClick={async () => {
                    const result = await onRouteChange(ROUTE_TYPES.SURVEY, surveyData.surveyLink);
                    if (result) {
                      window.open(surveyData.privacyLink, 'blank');
                    }
                  }}
                >
                  {mergedI18N.surveyPrivacyPolicy}
                </Link>
              </div>
            </>
          }
          lowContrast
          caption=""
          onCloseButtonClick={() => setShowToast(false)}
        />
      ) : null}
      <SuiteHeaderLogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={async () => {
          const result = await onRouteChange(ROUTE_TYPES.LOGOUT, routes.logout);
          if (result) {
            window.location.href = routes.logout;
          }
        }}
        i18n={{
          heading: mergedI18N.profileLogoutModalHeading,
          primaryButton: mergedI18N.profileLogoutModalPrimaryButton,
          secondaryButton: mergedI18N.profileLogoutModalSecondaryButton,
          body:
            typeof mergedI18N.profileLogoutModalBody === 'function'
              ? mergedI18N.profileLogoutModalBody(appName || suiteName, userDisplayName)
              : translate(mergedI18N.profileLogoutModalBody, [
                  ['{solutionName}', appName || suiteName],
                  ['{userName}', userDisplayName],
                ]),
        }}
      />
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <>
            <span className={`${settings.iotPrefix}--suite-header-data`} data-type="workspaceId">
              {routes.workspaceId}
            </span>
            <span className={`${settings.iotPrefix}--suite-header-data`} data-type="domain">
              {routes.domain}
            </span>
            <Header
              className={[`${settings.iotPrefix}--suite-header`, className]
                .filter((i) => i)
                .join(' ')}
              url={routes.navigator}
              hasSideNav={sideNavProps !== null}
              onClickSideNavExpand={onClickSideNavExpand}
              headerPanel={{
                content: React.forwardRef(() => (
                  <SuiteHeaderAppSwitcher
                    applications={applications}
                    allApplicationsLink={routes.navigator}
                    noAccessLink={routes.gettingStarted}
                    onRouteChange={onRouteChange}
                    i18n={{
                      allApplicationsLink: mergedI18N.switcherNavigatorLink,
                      requestAccess: mergedI18N.switcherRequestAccess,
                      learnMoreLink: mergedI18N.switcherLearnMoreLink,
                    }}
                  />
                )),
              }}
              appName={suiteName}
              subtitle={appName}
              actionItems={[
                ...customActionItems,
                routes.admin !== null
                  ? {
                      label: mergedI18N.administrationIcon,
                      className: ['admin-icon', isAdminView ? 'admin-icon__selected' : null]
                        .filter((i) => i)
                        .join(' '),
                      btnContent: (
                        <>
                          <Settings20
                            fill="white"
                            data-testid="admin-icon"
                            description={mergedI18N.settingsIcon}
                          />
                        </>
                      ),
                      onClick: async () => {
                        let href = routes.admin;
                        let routeType = ROUTE_TYPES.ADMIN;
                        if (isAdminView) {
                          // Only use referrer URL if it is not the login screen.
                          if (document.referrer !== '' && document.referrer.indexOf('auth') < 0) {
                            href = document.referrer;
                            routeType = ROUTE_TYPES.REFERRER;
                          } else {
                            href = routes.navigator;
                            routeType = ROUTE_TYPES.NAVIGATOR;
                          }
                        }
                        const result = await onRouteChange(routeType, href);
                        if (result) {
                          window.location.href = href;
                        }
                      },
                    }
                  : null,
                {
                  label: mergedI18N.help,
                  onClick: () => {},
                  btnContent: (
                    <Fragment>
                      <Help20 fill="white" description={mergedI18N.help} />
                    </Fragment>
                  ),
                  childContent: [
                    'whatsNew',
                    'gettingStarted',
                    'documentation',
                    'requestEnhancement',
                    'support',
                  ]
                    .map((item) => ({
                      metaData: {
                        element: 'a',
                        'data-testid': `suite-header-help--${item}`,
                        href: 'javascript:void(0)',
                        title: mergedI18N[item],
                        onClick: async () => {
                          const result = await onRouteChange(
                            ROUTE_TYPES.DOCUMENTATION,
                            routes[item]
                          );
                          if (result) {
                            window.open(routes[item], 'blank');
                          }
                        },
                      },
                      content: mergedI18N[item],
                    }))
                    .concat({
                      metaData: {
                        element: 'a',
                        'data-testid': `suite-header-help--about`,
                        href: 'javascript:void(0)',
                        title: mergedI18N.about,
                        onClick: async () => {
                          const result = await onRouteChange(ROUTE_TYPES.ABOUT, routes.about);
                          if (result) {
                            window.location.href = routes.about;
                          }
                        },
                      },
                      content: mergedI18N.about,
                    }),
                },
                {
                  label: 'user',
                  btnContent: (
                    <Fragment>
                      <UserAvatar20
                        data-testid="user-icon"
                        fill="white"
                        description={mergedI18N.userIcon}
                      />
                    </Fragment>
                  ),
                  childContent: [
                    {
                      metaData: {
                        element: 'div',
                      },
                      content: (
                        <SuiteHeaderProfile
                          displayName={userDisplayName}
                          username={username}
                          onProfileClick={async () => {
                            const result = await onRouteChange(ROUTE_TYPES.PROFILE, routes.profile);
                            if (result) {
                              window.location.href = routes.profile;
                            }
                          }}
                          onRequestLogout={() => setShowLogoutModal(true)}
                          i18n={{
                            profileTitle: mergedI18N.profileTitle,
                            profileButton: mergedI18N.profileManageButton,
                            logoutButton: mergedI18N.profileLogoutButton,
                          }}
                        />
                      ),
                    },
                  ],
                },
              ].filter((i) => i)}
              {...otherHeaderProps}
            />
            {sideNavProps ? (
              <SideNav {...sideNavProps} isSideNavExpanded={isSideNavExpanded} />
            ) : null}
          </>
        )}
      />
    </>
  );
};

SuiteHeader.defaultProps = defaultProps;
SuiteHeader.propTypes = propTypes;

SuiteHeader.ROUTE_TYPES = ROUTE_TYPES;

export default SuiteHeader;
