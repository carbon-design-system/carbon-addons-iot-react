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
      if (resJson.error || resJson.exception) {
        return null;
      }
      return resJson;
    });

const getUiResourcesData = async ({
  baseApiUrl,
  lang = 'en',
  surveyId = null,
  workspaceId = null,
  fetchApi = defaultFetchApi,
  isTest = false,
}) => {
  const api = (method, path, body, headers) =>
    fetchApi(
      method,
      `${baseApiUrl}${path}`,
      body,
      headers,
      isTest ? testApiData[path.split('?')[0]] : null
    );

  const langParam = `&lang=${lang}`;
  const surveyIdParam = surveyId ? `&surveyId=${surveyId}` : '';
  const workspaceIdParam = workspaceId ? `&workspaceId=${workspaceId}` : '';
  return api('GET', `/uiresources?id=masthead${langParam}${surveyIdParam}${workspaceIdParam}`);
};

export default getUiResourcesData;
