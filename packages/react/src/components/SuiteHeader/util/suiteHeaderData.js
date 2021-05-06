import dayjs from '../../../utils/dayjs';
import SuiteHeaderI18N from '../i18n';

// eslint-disable-next-line import/extensions
import testApiData from './suiteHeaderData.fixture.js';

// default route calculation logic
export const calcRoutes = (domain, user, workspaces, applications) => {
  const workspaceId = Object.keys(user.workspaces)[0];
  const getApplicationUrl = (appId) => user.workspaces[workspaceId].applications[appId].href;
  const isAdmin = user.permissions.systemAdmin || user.permissions.userAdmin;
  const routeData = {
    profile: `https://home.${domain}/myaccount`,
    navigator: `https://${workspaceId}.home.${domain}`,
    admin: isAdmin ? `https://admin.${domain}` : null,
    logout: `https://home.${domain}/logout`,
    whatsNew:
      'https://www.ibm.com/support/knowledgecenter/SSRHPA_current/appsuite/overview/whats_new.html',
    gettingStarted:
      'https://www.ibm.com/support/knowledgecenter/SSRHPA_current/appsuite/overview/getting_started.html',
    documentation: 'https://www.ibm.com/support/knowledgecenter/SSRHPA_current',
    requestEnhancement: 'https://ibm-watson-iot.ideas.aha.io/',
    support: 'https://www.ibm.com/mysupport',
    about: `https://home.${domain}/about`,
    workspaceId,
    domain,
  };
  const appOrdering = ['monitor', 'health', 'predict', 'visualinspection'];
  const workspaceApplications = user.workspaces[workspaceId].applications || {};
  const applicationSyncStates = user.applications || {};
  const appData = Object.keys(workspaceApplications)
    .filter((appId) => workspaceApplications[appId].role !== 'NO_ACCESS')
    .filter((appId) => applicationSyncStates[appId]?.sync?.state === 'SUCCESS')
    .filter((appId) => (applications.find((i) => i.id === appId) || {}).category === 'application')
    .sort((a, b) => appOrdering.findIndex((i) => i === a) - appOrdering.findIndex((i) => i === b))
    .map((appId) => ({
      id: appId,
      name:
        (applications.find((i) => i.id === appId) || {}).name ||
        appId.charAt(0).toUpperCase() + appId.slice(1),
      href: getApplicationUrl(appId),
      isExternal: getApplicationUrl(appId).indexOf(domain) >= 0,
    }))
    .sort();
  return [routeData, appData];
};

// Default survey status calculation logic
export const calcSurveyStatus = async (userId, surveyConfig, apiFct) => {
  let showSurvey = false;

  // Check if it is time to show the survey
  const isTimeForSurvey = (surveyData) => {
    // If survey is not enabled, return false
    if (!surveyData.enabled) {
      return false;
    }
    // If lastPromptTimestamp is set and it is greater than initialInteractionTimestamp,
    // it means that at least one survey has already been prompted to the user,
    // so, we check if another survey prompt is due.
    if (
      surveyData.lastPromptTimestamp &&
      dayjs(surveyData.lastPromptTimestamp).isAfter(surveyData.initialInteractionTimestamp)
    ) {
      if (dayjs().diff(surveyData.lastPromptTimestamp, 'days') > surveyData.frequencyDays) {
        return true;
      }
    }
    // No survey has been prompted yet, so we check if it is time for the first one.
    else if (
      dayjs().diff(surveyData.initialInteractionTimestamp, 'days') > surveyData.delayIntervalDays
    ) {
      return true;
    }
    return false;
  };

  const surveyData = await apiFct('GET', `/users/${userId}/surveys/${surveyConfig.id}`);
  if (surveyData) {
    // Survey data found, check it some config props need to be updated on the backend
    const updateObject = {};
    ['delayIntervalDays', 'frequencyDays', 'enabled'].forEach((surveyProp) => {
      if (surveyConfig[surveyProp] && surveyConfig[surveyProp] !== surveyData[surveyProp]) {
        updateObject[surveyProp] = surveyConfig[surveyProp];
      }
    });
    // If at least one config prop is different than the one in the existing record, update it
    if (Object.keys(updateObject).length > 0) {
      await apiFct('PUT', `/users/${userId}/surveys/${surveyConfig.id}`, updateObject);
    }
    // Based on survey data and current timestamp, make the proper time comparisons to check if it is time to show a survey
    showSurvey = isTimeForSurvey(surveyData);
    if (showSurvey) {
      // Update lastPromptTimestamp to the current timestamp so that we need to wait another 'frequencyDays' days until the next survey
      await apiFct('PUT', `/users/${userId}/surveys/${surveyConfig.id}`, {
        lastPromptTimestamp: dayjs.utc().format(),
      });
    }
  } else {
    // Survey record not found, create it
    await apiFct('POST', `/users/${userId}/surveys`, {
      ...surveyConfig,
      delayIntervalDays: surveyConfig.delayIntervalDays ?? 30,
      frequencyDays: surveyConfig.frequencyDays ?? 90,
      enabled: surveyConfig.enabled ?? true,
      initialInteractionTimestamp: dayjs.utc().format(),
    });
  }
  return showSurvey;
};

// default i18n calculation logic
export const calcI18N = (i18nData) => ({
  ...i18nData,
  surveyTitle: (solutionName) => i18nData.surveyTitle.replace('{solutionName}', solutionName),
  profileLogoutModalBody: (solutionName, userName) =>
    i18nData.profileLogoutModalBody
      .replace('{solutionName}', solutionName)
      .replace('{userName}', userName),
});

export const defaultFetchApi = async (method, url, body, headers, testResponse) =>
  testResponse ||
  fetch(url, {
    method,
    credentials: 'include',
    headers: headers || {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((resJson) => {
      // Don't return any data if an error happened (401, 404, 409, etc)
      if (resJson.error || resJson.exception) {
        return null;
      }
      return resJson;
    });

const getSuiteHeaderData = async ({
  baseApiUrl,
  domain,
  lang = 'en',
  calculateRoutes = calcRoutes,
  calculateSurveyStatus = calcSurveyStatus,
  calculateI18N = calcI18N,
  fetchApi = defaultFetchApi,
  surveyConfig = null,
  isTest = false,
}) => {
  const api = (method, path, body, headers) =>
    fetchApi(method, `${baseApiUrl}${path}`, body, headers, isTest ? testApiData[path] : null);

  const profileData = await api('GET', '/profile');
  const appsData = await api('GET', '/applications');
  const eamData = await api('GET', '/config/eam');
  const mroioData = await api('GET', '/config/mroio');
  const apmData = await api('GET', '/config/apm');
  const appconnectData = await api('GET', '/config/appconnect');
  const i18nData = await api('GET', `/i18n/header/${isTest ? 'en' : lang}`);

  // Routes
  const [routes, applications] = calculateRoutes(
    domain,
    profileData.user,
    profileData.workspaces,
    appsData
  );

  // Survey
  const showSurvey = surveyConfig?.id
    ? await calculateSurveyStatus(profileData.user.username, surveyConfig, api)
    : false;

  // i18n
  const i18n = i18nData ? calculateI18N(i18nData) : SuiteHeaderI18N.en;

  // apps to open in a new window
  const externalApps = ['eam', 'mroio', 'digitaltwin', 'apm', 'visualinspection', 'appconnect'];

  return {
    username: profileData.user.username,
    userDisplayName: profileData.user.displayName,
    email: profileData.user.email,
    routes,
    applications: [
      ...(eamData?.url
        ? [
            {
              id: 'eam',
              name: 'Manage',
              href: eamData.url,
            },
          ]
        : []),
      ...applications,
      ...(mroioData?.url
        ? [
            {
              id: 'mroio',
              name: 'MRO Inventory Optimization',
              href: mroioData.url,
            },
          ]
        : []),
      ...((appconnectData?.users ?? []).includes(profileData?.user?.username)
        ? [
            {
              id: 'appconnect',
              name: 'App Connect',
              href: appconnectData?.dashboard,
            },
          ]
        : []),
      ...(apmData?.dashboard
        ? [
            {
              id: 'apm',
              name: 'APM for E&U',
              href: apmData.dashboard,
            },
          ]
        : []),
    ].map((app) => ({
      ...app,
      isExternal: externalApps.includes(app.id),
    })),
    i18n,
    showSurvey,
  };
};

export default getSuiteHeaderData;
