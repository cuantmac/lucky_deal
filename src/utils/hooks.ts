import {useRef, useState} from 'react';
import {useSelector, shallowEqual} from 'react-redux';

type ResultBox<T> = {v: T};

export function useConstant<T>(fn: () => T): T {
  const ref = useRef<ResultBox<T>>();

  if (!ref.current) {
    ref.current = {v: fn()};
  }

  return ref.current.v;
}

export const wait = (time: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

type FetchFunc<T> = (...params: any[]) => Promise<T>;
interface CancellablePromise<T> extends Promise<T> {
  cancel: () => void;
}
type CancelError = {
  code: number;
  error: string;
  type: string;
};
export const useFetching = <T>(
  fetch: FetchFunc<T>,
  defaultData?: T,
  deaultLoading: boolean = false,
): [
  boolean,
  (...params: any[]) => CancellablePromise<T>,
  T | undefined,
  CancelError | undefined,
] => {
  const [loading, setLoading] = useState(deaultLoading);
  const [data, setData] = useState<T | undefined>(defaultData);
  const [error, setError] = useState<CancelError>();
  const fetchFn = useConstant(() => (...params: any[]) => {
    setLoading(true);
    setError(undefined);
    let cancel: (reason?: any) => void;
    let hasCancel = false;
    const promise = new Promise<T>((resolve, reject) => {
      cancel = reject;
      fetch(...params)
        .then((res) => {
          !hasCancel && setData(res);
          resolve(res);
        })
        .catch((error) => {
          setError(error);
          reject(error);
        })
        .finally(() => {
          setLoading(false);
        });
    });
    (promise as CancellablePromise<T>).cancel = () => {
      const cancelError = {type: 'cancel', code: -10000, error: 'cancel'};
      cancel(cancelError);
      setError(cancelError);
      hasCancel = true;
    };
    return promise as CancellablePromise<T>;
  });
  return [loading, fetchFn, data, error];
};

export const useShallowEqualSelector = <T>(selector: any) => {
  return useSelector<any, T>(selector, shallowEqual);
};

type WithLoading = {
  <T>(args: Promise<T>): Promise<T>;
  <T, T1>(args: Promise<T>, args1: Promise<T1>): Promise<[T, T1]>;
  <T, T1, T2>(
    args: Promise<T>,
    args1: Promise<T1>,
    args2: Promise<T2>,
  ): Promise<[T, T1, T2]>;
  <T, T1, T2, T3>(
    args: Promise<T>,
    args1: Promise<T1>,
    args2: Promise<T2>,
    args3: Promise<T3>,
  ): Promise<[T, T1, T2, T3]>;
  <T, T1, T2, T3, T4>(
    args: Promise<T>,
    args1: Promise<T1>,
    args2: Promise<T2>,
    args3: Promise<T3>,
    args4: Promise<T4>,
  ): Promise<[T, T1, T2, T3, T4]>;
};

/**
 *
 * 处理loading状态， 可以有效防止忘记关闭loading的情况
 * 如果您使用的是class组件， 那么您自行控制loading ...
 *
 * @example
 *
 * ```
 *  const [loading, withLoading] = useLoading();
 *  withLoading(promise).then((res) => {
 *
 *  });
 *
 *  withLoading(promise1, promise2).then(([res1, res2]) => {
 *
 *  });
 * ```
 *
 */
export function useLoading(defaultStatus: boolean = false) {
  const [loading, setLoading] = useState(defaultStatus);
  const withLoading = useConstant(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (...args: Promise<any>[]): Promise<any> => {
      setLoading(true);
      let res: unknown;
      if (args.length === 1) {
        try {
          res = await args[0];
        } finally {
          setLoading(false);
        }
        return res;
      }
      try {
        res = await Promise.all(args);
      } finally {
        setLoading(false);
      }
      return res;
    };
  });
  return [loading, withLoading as WithLoading, setLoading] as const;
}
