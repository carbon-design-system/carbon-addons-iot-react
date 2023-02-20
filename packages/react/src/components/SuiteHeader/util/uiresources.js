// eslint-disable-next-line import/extensions
import testApiData from './uiresources.fixture.js';

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
      // istanbul ignore next
      if (resJson.error || resJson.exception) {
        return null;
      }
      return resJson;
    });

const getUiResourcesData = async ({
  baseApiUrl,
  lang,
  surveyId,
  appId,
  workspaceId,
  useCache,
  fetchApi,
  isTest,
}) => {
  // istanbul ignore next
  const fetcher = fetchApi ?? defaultFetchApi;
  const api = (method, path, body, headers) =>
    fetcher(
      method,
      `${baseApiUrl}${path}`,
      body,
      headers,
      // istanbul ignore next
      isTest ? testApiData[path.split('?')[0]] : null
    );

  const langParam = `&lang=${encodeURIComponent(lang ?? 'en')}`;
  const surveyIdParam = surveyId ? `&surveyId=${encodeURIComponent(surveyId)}` : '';
  const appIdParam = appId ? `&appId=${encodeURIComponent(appId)}` : '';
  const workspaceIdParam = workspaceId ? `&workspaceId=${encodeURIComponent(workspaceId)}` : '';
  const cacheParam = useCache ? `&cache=${true}` : '';
  return api(
    'GET',
    `/uiresources?id=masthead${langParam}${surveyIdParam}${appIdParam}${workspaceIdParam}${cacheParam}`
  );
};

export default getUiResourcesData;
