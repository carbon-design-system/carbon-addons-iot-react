import { useState, useEffect, useCallback } from 'react';

// eslint-disable-next-line import/extensions
import testApiData from './suiteHeaderData.fixture.js';

// default route calculation logic
const calcRoutes = (domain, user, workspaces, applications) => {
  const workspaceId = Object.keys(user.workspaces)[0];
  const getApplicationUrl = appId => user.workspaces[workspaceId].applications[appId].href;
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
  };
  const appOrdering = ['monitor', 'health', 'predict'];
  const appData = Object.keys(user.workspaces[workspaceId].applications)
    .filter(appId => user.workspaces[workspaceId].applications[appId].role !== 'NO_ACCESS')
    .filter(appId => (applications.find(i => i.id === appId) || {}).category === 'application')
    .sort((a, b) => appOrdering.findIndex(i => i === a) - appOrdering.findIndex(i => i === b))
    .map(appId => ({
      id: appId,
      name: appId.charAt(0).toUpperCase() + appId.slice(1),
      href: getApplicationUrl(appId),
      isExternal: getApplicationUrl(appId).indexOf(domain) >= 0,
    }))
    .sort();
  return [routeData, appData];
};

const useSuiteHeaderData = ({
  baseApiUrl,
  domain,
  isTest = false,
  calculateRoutes = calcRoutes,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [data, setData] = useState({
    username: null,
    userDisplayName: null,
    email: null,
    routes: {
      profile: null,
      navigator: null,
      admin: null,
      logout: null,
      about: null,
      documentation: null,
      whatsNew: null,
      requestEnhancement: null,
      support: null,
      gettingStarted: null,
    },
    applications: [],
  });

  const refreshData = useCallback(
    async () => {
      const fetchData = async path =>
        isTest ? testApiData[path] : fetch(`${baseApiUrl}${path}`).then(res => res.json());

      try {
        setIsLoading(true);
        const profileData = await fetchData('/profile');
        const appsData = await fetchData('/applications');
        const eamData = await fetchData('/config/eam');
        const [routes, applications] = calculateRoutes(
          domain,
          profileData.user,
          profileData.workspaces,
          appsData
        );
        setData({
          username: profileData.user.username,
          userDisplayName: profileData.user.displayName,
          email: profileData.user.email,
          routes,
          applications: [
            ...(eamData.url
              ? [{ id: 'eam', name: 'Manage', href: eamData.url, isExternal: true }]
              : []),
            ...applications,
          ],
        });
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    },
    [baseApiUrl, domain, isTest, setIsLoading, calculateRoutes]
  );

  useEffect(
    () => {
      // load actual data
      refreshData();
    },
    [refreshData]
  );

  return [data, isLoading, error, refreshData];
};

export default useSuiteHeaderData;
