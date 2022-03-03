import {ErrorMsg} from '@src/helper/message';
import {useCallback, useEffect, useRef, useState} from 'react';
import {unstable_batchedUpdates} from 'react-dom';
import {LOADING_STATUS_ENUM} from '../loadingIndicator';

export type InfiniteLoadProps<T> = {
  fetch: (page: number, num: number) => Promise<{list?: T[]}>;
  pageNum?: number;
  defaultPage?: number;
  onError?: (e: ErrorMsg) => void;
  onLoadData?: (params: {data: T[]; page: number}) => void;
  onLoadDataComplete?: (params: {data: T[]; page: number}) => void;
};

/**
 * 上拉加载数据处理hook
 *
 * @param param0 InfiniteLoadProps
 */
export const useInfiniteLoad = function <T>({
  fetch,
  pageNum = 10,
  defaultPage = 1,
  onError,
  onLoadData,
  onLoadDataComplete,
}: InfiniteLoadProps<T>) {
  const [status, setStatus] = useState(LOADING_STATUS_ENUM.LOADING);
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(defaultPage);
  const [canLoad, setCanLoad] = useState<boolean>(false);
  const prePageRef = useRef(defaultPage - 1);
  const timeRef = useRef<number>(0);
  const fetchRef = useRef<typeof fetch>(fetch);
  fetchRef.current = fetch;
  const onErrorRef = useRef<typeof onError>(onError);
  onErrorRef.current = onError;
  const onLoadDataRef = useRef<typeof onLoadData>(onLoadData);
  onLoadDataRef.current = onLoadData;
  const onLoadDataCompleteRef = useRef<typeof onLoadDataComplete>(
    onLoadDataComplete,
  );
  onLoadDataCompleteRef.current = onLoadDataComplete;

  const loadData = useCallback(() => {
    setCanLoad(false);
    setStatus(LOADING_STATUS_ENUM.LOADING);
    fetchRef
      .current(page, pageNum)
      .then((res) => {
        // 当下拉刷新后 不在处理刷新之前的数据
        if (Date.now() > timeRef.current) {
          unstable_batchedUpdates(() => {
            const list = res.list || [];
            onLoadDataRef.current && onLoadDataRef.current({data: list, page});
            if (list.length) {
              setData((old) => {
                if (page === defaultPage) {
                  return list;
                }
                return [...old, ...list];
              });
            }
            if (list.length === 0 && page === defaultPage) {
              setData([]);
              setStatus(LOADING_STATUS_ENUM.EMPTY);
            } else if (list.length === 0) {
              setStatus(LOADING_STATUS_ENUM.COMPLETE);
              onLoadDataCompleteRef.current &&
                onLoadDataCompleteRef.current({data: list, page});
            } else {
              setStatus(LOADING_STATUS_ENUM.LOAD_MORE);
            }
          });
        }
      })
      .catch((e: ErrorMsg) => {
        // 当下拉刷新后 不在处理刷新之前的异常
        if (Date.now() > timeRef.current) {
          unstable_batchedUpdates(() => {
            if (page === defaultPage) {
              setData([]);
            }
            setStatus(LOADING_STATUS_ENUM.ERROR);
            onErrorRef.current && onErrorRef.current(e);
          });
        }
      });
  }, [defaultPage, page, pageNum]);

  const tryAgain = useCallback(() => {
    loadData();
  }, [loadData]);

  const infiniteLoadmore = useCallback(() => {
    if (status === LOADING_STATUS_ENUM.LOAD_MORE) {
      setCanLoad(true);
    }
  }, [status]);

  const refresh = useCallback(() => {
    timeRef.current = Date.now();
    setPage(defaultPage);
  }, [defaultPage]);

  useEffect(() => {
    if (canLoad) {
      setPage((old) => {
        return old + 1;
      });
    }
  }, [canLoad]);

  useEffect(() => {
    if (prePageRef.current === page) {
      return;
    }
    loadData();
    prePageRef.current = page;
  }, [loadData, page]);

  return {
    // 上拉加载触发时调用此方法
    infiniteLoadmore,
    // 上拉加载完成后的数据
    data,

    page,

    refresh,

    status,

    tryAgain,
  };
};
