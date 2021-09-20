import { useState, useEffect, useCallback } from 'react';

// eslint-disable-next-line import/extensions
import getUiResourcesData, { defaultFetchApi } from '../util/uiresources';

const useUiResources = ({
  baseApiUrl,
  lang = 'en',
  surveyId = null,
  fetchApi = defaultFetchApi,
  isTest = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [data, setData] = useState({
    username: null,
    userDisplayName: null,
    routes: null,
    applications: null,
    i18n: null,
    surveyData: null,
    idleTimeoutData: null,
  });

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const uiResourcesData = await getUiResourcesData({
        baseApiUrl,
        lang,
        surveyId,
        fetchApi,
        isTest,
      });
      setData(uiResourcesData);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [baseApiUrl, lang, surveyId, isTest, setIsLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // load actual data
    refreshData();
  }, [refreshData]);

  return [data, isLoading, error, refreshData];
};

export default useUiResources;
