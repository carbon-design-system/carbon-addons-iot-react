import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const useDataLoader = ({
  onLoadData,
  data: initialData = [],
  pageSize = 25,
  start: initialStart = 0,
  pagination: initialPagination,
}) => {
  if (onLoadData && typeof onLoadData !== 'function') {
    throw new Error('onLoadData must be a function');
  }

  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [start, setStart] = useState(initialStart);
  const [pagination, setPagination] = useState(initialPagination);
  const retryRef = useRef(null);

  const onLoad = useCallback(
    async ({ page: pageOverride, pageSize: pageSizeOverride, start: startOverride } = {}) => {
      const onLoadPageSize = pageSizeOverride ?? pageSize;
      const onLoadPage = pageOverride ?? pagination?.page;
      const onLoadStart = onLoadPage ? (onLoadPage - 1) * onLoadPageSize : startOverride ?? start;

      setIsLoading(true);
      setHasMoreData(true);

      if (onLoadPage) {
        setData(() => []);
      }
      try {
        const results = await onLoadData({
          pageSize: onLoadPageSize,
          start: onLoadStart,
          retry: retryRef.current,
        });

        if (
          !['data', 'hasMoreData', 'loading'].every((key) => {
            return results?.hasOwnProperty(key);
          })
        ) {
          throw new Error(
            'INVALID_RETURN: onLoadData should return an object containing `data`, `hasMoreData`, and `loading` properties.'
          );
        }

        if (onLoadPage) {
          setData(() => [...results.data]);
        } else {
          setData((prev) => [...prev, ...results.data]);
        }
        setStart((prev) => prev + results.data.length);
        setHasMoreData(results.hasMoreData);
      } catch (error) {
        if (error.message.includes('INVALID_RETURN')) {
          throw error;
        }

        setHasMoreData(false);
        if (onLoadPage) {
          setData(() => []);
        }
      }
      setIsLoading(false);
    },
    [onLoadData, pageSize, pagination, start]
  );

  const onPage = useCallback(
    (page) => {
      setPagination({
        ...pagination,
        page,
      });
      retryRef.current = () => onLoad({ page });
      onLoad({ page });
    },
    [onLoad, pagination]
  );

  useEffect(() => {
    retryRef.current = onLoad;
  }, [onLoad]);

  useEffect(() => {
    if (onLoadData && typeof onLoadData === 'function' && !data?.length) {
      onLoad();
    }
    // only fire this effect when there is a onLoadData callback, but no data has been
    // loaded yet.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(() => {
    if (!onLoadData) {
      return {};
    }

    return {
      isLoading,
      data,
      hasMoreData,
      onLoad,
      pagination: pagination
        ? {
            ...pagination,
            onPage,
          }
        : pagination,
    };
  }, [data, hasMoreData, isLoading, onLoad, onLoadData, onPage, pagination]);
};

export default useDataLoader;
