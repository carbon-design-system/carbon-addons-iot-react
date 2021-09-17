import { useState, useEffect, useCallback } from 'react';

// eslint-disable-next-line import/extensions
import getSuiteHeaderData, {
  calcRoutes,
  calcSurveyStatus,
  calcI18N,
  defaultFetchApi,
} from '../util/suiteHeaderData';

/**
 * @deprecated use useUiResources instead
 */
const useSuiteHeaderData = ({
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
      workspaceId: null,
      domain: null,
    },
    applications: [],
    showSurvey: false,
  });

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const suiteHeaderData = await getSuiteHeaderData({
        baseApiUrl,
        domain,
        lang,
        calculateRoutes,
        calculateSurveyStatus,
        calculateI18N,
        fetchApi,
        surveyConfig,
        isTest,
      });
      setData(suiteHeaderData);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }, [baseApiUrl, domain, lang, isTest, setIsLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // load actual data
    refreshData();
  }, [refreshData]);

  return [data, isLoading, error, refreshData];
};

export default useSuiteHeaderData;
