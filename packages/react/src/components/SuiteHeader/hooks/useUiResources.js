import { useState, useEffect, useCallback } from 'react';

// eslint-disable-next-line import/extensions
import getUiResourcesData, { defaultFetchApi } from '../util/uiresources';
import getCachedUiResourcesData from '../util/cacheduiresources';

const useUiResources = ({
  baseApiUrl,
  lang = 'en',
  surveyId = null,
  appId = null,
  workspaceId = null,
  fetchApi = defaultFetchApi,
  isTest = false,
  useCache = true,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [data, setData] = useState({
    username: null,
    userDisplayName: null,
    routes: null,
    applications: null,
    workspaces: null,
    globalApplications: null,
    i18n: null,
    surveyData: null,
    idleTimeoutData: null,
  });

  const refreshData = useCallback(async () => {
    const options = {
      baseApiUrl,
      lang,
      surveyId,
      appId,
      workspaceId,
      fetchApi,
      isTest,
    };
    try {
      setIsLoading(true);
      if (useCache) {
        // Set cached and then non-cached data
        getCachedUiResourcesData(
          { ...options },
          (cachedData) => {
            setData(cachedData);
            setIsLoading(false);
          },
          (err) => {
            setError(err);
          }
        );
      } else {
        // Set non-cached data only
        const uiResourcesData = await getUiResourcesData({ ...options });
        setData(uiResourcesData);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [baseApiUrl, lang, surveyId, appId, workspaceId, isTest, setIsLoading, useCache]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // load actual data
    refreshData();
  }, [refreshData]);

  return [data, isLoading, error, refreshData];
};

export default useUiResources;
