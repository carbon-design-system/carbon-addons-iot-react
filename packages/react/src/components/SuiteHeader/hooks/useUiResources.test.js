import { renderHook } from '@testing-library/react-hooks';

import testApiData from '../util/uiresources.fixture';

import useUiResources from './useUiResources';

describe('useUiResources', () => {
  it('initial state', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(testApiData['/uiresources']),
      })
    );
    const { result } = renderHook(() =>
      useUiResources({
        lang: 'en',
        surveyId: 'test',
        workspaceId: 'mockedworkspace',
        useCache: false,
      })
    );
    // Make sure that initial data is null, loading is true and error is undefined
    const [initialData, initialLoading, initialError] = result.current;
    expect(initialData.username).toEqual(null);
    expect(initialLoading).toEqual(true);
    expect(initialError).toEqual(undefined);
    global.fetch = undefined;
  });
  it('success state (cached and non-cached api requests)', async () => {
    // Mock fetch calls
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(testApiData['/uiresources']),
      })
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useUiResources({
        lang: 'en',
        surveyId: 'test',
        workspaceId: 'mockedworkspace',
      })
    );
    await waitForNextUpdate();
    const [data, loading, error] = result.current;
    // After data has been fetched, make sure that data is populated, loading is false and error is undefined
    expect(data).toEqual(testApiData['/uiresources']);
    expect(loading).toEqual(false);
    expect(error).toEqual(undefined);
    // Also, make sure that fetch has been called twice (one for the cached uiresources data and another for the non-cached data)
    expect(global.fetch).toHaveBeenCalledTimes(2);
    global.fetch = undefined;
  });
  it('Success state (non-cached api request only)', async () => {
    // Mock fetch call
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(testApiData['/uiresources']),
      })
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useUiResources({
        lang: 'en',
        surveyId: 'test',
        workspaceId: 'mockedworkspace',
        useCache: false,
      })
    );
    await waitForNextUpdate();
    // After data has been fetched, make sure that data is populated, loading is false and error is undefined
    const [data, loading, error] = result.current;
    expect(data).toEqual(testApiData['/uiresources']);
    expect(loading).toEqual(false);
    expect(error).toEqual(undefined);
    // Also, make sure that fetch has been called only once
    expect(global.fetch).toHaveBeenCalledTimes(1);
    global.fetch = undefined;
  });
  it('Error state', async () => {
    // Mock fetch call
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.reject(new Error('Boom!!!')),
      })
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useUiResources({
        lang: 'en',
        surveyId: 'test',
        workspaceId: 'mockedworkspace',
        useCache: false,
      })
    );
    await waitForNextUpdate();
    // After data fetching has errored out, make sure that data still null, loading is false and error is defined
    const [data, loading, error] = result.current;
    expect(data.username).toEqual(null);
    expect(loading).toEqual(false);
    expect(error.message).toEqual('Boom!!!');
    // Also, make sure that fetch has been called only once
    expect(global.fetch).toHaveBeenCalledTimes(1);
    global.fetch = undefined;
  });
});
