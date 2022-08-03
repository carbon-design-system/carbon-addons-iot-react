import PropTypes from 'prop-types';

import { IdleLogoutConfirmationModalI18NPropTypes } from './IdleLogoutConfirmationModal/IdleLogoutConfirmationModal';

export const SuiteHeaderRoutePropTypes = {
  profile: PropTypes.string,
  navigator: PropTypes.string,
  admin: PropTypes.string,
  logout: PropTypes.string,
  logoutInactivity: PropTypes.string,
  whatsNew: PropTypes.string,
  gettingStarted: PropTypes.string,
  documentation: PropTypes.string,
  requestEnhancement: PropTypes.string,
  support: PropTypes.string,
  about: PropTypes.string,
  // properties rendered as data attributes
  workspaceId: PropTypes.string,
  domain: PropTypes.string,
};

export const SuiteHeaderApplicationPropTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  isExternal: PropTypes.bool,
};

export const SuiteHeaderWorkspacesPropTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  adminHref: PropTypes.string.isRequired,
  applications: PropTypes.arrayOf(SuiteHeaderApplicationPropTypes).isRequired,
  isCurrent: PropTypes.bool,
};

export const SuiteHeaderSurveyDataPropTypes = {
  surveyLink: PropTypes.string.isRequired,
  privacyLink: PropTypes.string.isRequired,
};

export const SuiteHeaderI18NPropTypes = {
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
  profileLogoutModalBody: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  switcherMyApplications: PropTypes.string,
  switcherNavigatorLink: PropTypes.string,
  whatsNew: PropTypes.string,
  documentation: PropTypes.string,
  requestEnhancement: PropTypes.string,
  about: PropTypes.string,
  support: PropTypes.string,
  gettingStarted: PropTypes.string,
  surveyTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  surveyText: PropTypes.string,
  surveyPrivacyPolicy: PropTypes.string,
  ...IdleLogoutConfirmationModalI18NPropTypes,
};
