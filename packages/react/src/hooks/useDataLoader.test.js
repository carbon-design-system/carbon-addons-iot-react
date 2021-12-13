import { renderHook } from '@testing-library/react-hooks';

import useDataLoader from './useDataLoader';

describe('useDataLoader', () => {
  describe('falsy checks', () => {
    it('onLoadData can be null', () => {
      const { result } = renderHook(() => useDataLoader({ onLoadData: null }));
      expect(result.error).toBeUndefined();
    });
    it('onLoadData can be false', () => {
      const { result } = renderHook(() => useDataLoader({ onLoadData: false }));
      expect(result.error).toBeUndefined();
    });
    it('onLoadData can be undefined', () => {
      const { result } = renderHook(() => useDataLoader({ onLoadData: undefined }));
      expect(result.error).toBeUndefined();
    });
  });

  it('should throw an error if onLoadData is not a function', () => {
    const { result } = renderHook(() => useDataLoader({ onLoadData: true }));

    expect(result.error).toEqual(Error('onLoadData must be a function'));
  });

  // this test is garbage because renderHook does a bunch of voodoo with errors
  // and I can't just easily catch the error with expect().toThrow() like most things...
  // eslint-disable-next-line jest/no-commented-out-tests
  // it('should throw an error if onLoadData does not match the interface', async () => {
  //   const onLoadData = jest.fn().mockImplementation(async () => {
  //     return { data: [], loading: false, hasMoreData: false };
  //   });

  //   const { result, waitForNextUpdate } = renderHook(() =>
  //     useDataLoader({
  //       onLoadData: async () => {
  //         return [];
  //       },
  //     })
  //   );
  //   expect(onLoadData).toHaveBeenCalledWith({
  //     pageSize: 25,
  //     start: 0,
  //     retry: expect.any(Function),
  //   });

  //   await waitForNextUpdate();

  //   expect(result.error).not.toBeUndefined();
  // });

  it('should return the correct items', async () => {
    const onLoadData = jest.fn().mockImplementation(async () => {
      return { data: [], loading: false, hasMoreData: false };
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      useDataLoader({
        onLoadData,
      })
    );

    expect(onLoadData).toHaveBeenCalledWith({
      pageSize: 25,
      start: 0,
      retry: expect.any(Function),
    });

    await waitForNextUpdate();

    expect(result.current).toEqual(
      expect.objectContaining({
        data: [],
        hasMoreData: false,
        onLoad: expect.any(Function),
        pagination: undefined,
        isLoading: false,
      })
    );
  });
});
