import {PRIMARY} from '@src/constants/colors';
import {isWeb} from '@src/helper/helper';
import React, {
  forwardRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
  Ref,
} from 'react';
import {
  FlatListProps,
  FlatList,
  RefreshControl,
  ScrollViewProps,
} from 'react-native';
import {InfiniteLoadProps, useInfiniteLoad} from '../infiniteLoad';
import {
  LoadingIndicator as LoadingIndicatorComponent,
  LOADING_STATUS_ENUM,
} from '../loadingIndicator';

export type InfiniteFlatListProps<T> = ScrollViewProps &
  Omit<
    FlatListProps<T>,
    'data' | 'onEndReached' | 'onRefresh' | 'ListHeaderComponent'
  > &
  InfiniteLoadProps<T> & {
    LoadingIndicator?: typeof LoadingIndicatorComponent;
    pullDownRefresh?: boolean;
    onRefresh?: () => Promise<any>;
    children?: JSX.Element;
  };

type InfiniteFlatListRef<T> = Ref<FlatList<T>>;

export const InfiniteFlatList = forwardRef(function <T>(
  {
    horizontal,
    fetch,
    onError,
    onLoadData,
    onLoadDataComplete,
    pageNum = 10,
    defaultPage = 1,
    LoadingIndicator = LoadingIndicatorComponent,
    pullDownRefresh = false,
    onRefresh,
    children,
    ListFooterComponent,
    numColumns = 1,
    ...props
  }: InfiniteFlatListProps<T>,
  ref: InfiniteFlatListRef<T>,
) {
  const {
    infiniteLoadmore,
    page,
    data,
    refresh,
    status,
    tryAgain,
  } = useInfiniteLoad({
    fetch,
    onError,
    onLoadData,
    onLoadDataComplete,
    pageNum,
    defaultPage,
  });
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const FootComponent = useMemo(() => {
    return (
      <>
        <LoadingIndicator
          horizontal={!!horizontal}
          defaultPage={defaultPage}
          page={page}
          onPress={tryAgain}
          status={status}
          loadMore={infiniteLoadmore}
        />
        {ListFooterComponent}
      </>
    );
  }, [
    horizontal,
    defaultPage,
    page,
    tryAgain,
    status,
    infiniteLoadmore,
    ListFooterComponent,
  ]);

  const handleKeyExtractor = useCallback<
    NonNullable<FlatListProps<T>['keyExtractor']>
  >((item, index) => {
    return index + '';
  }, []);

  const handleOnRefresh = useCallback(() => {
    setIsRefreshing(true);
    if (onRefresh) {
      onRefresh().finally(() => {
        setIsRefreshing(false);
      });
    } else {
      refresh();
    }
  }, [onRefresh, refresh]);

  const closeRefresh = useCallback(() => {
    isRefreshing && setIsRefreshing(false);
  }, [isRefreshing]);

  const handleOnEndReached = useCallback(() => {
    if (!isWeb()) infiniteLoadmore();
  }, [infiniteLoadmore]);

  useEffect(() => {
    if (LOADING_STATUS_ENUM.LOADING !== status) {
      closeRefresh();
    }
  }, [closeRefresh, status]);

  return (
    <FlatList
      key={numColumns + ''}
      numColumns={numColumns}
      refreshControl={
        pullDownRefresh ? (
          <RefreshControl
            colors={[PRIMARY]}
            refreshing={isRefreshing}
            onRefresh={handleOnRefresh}
          />
        ) : undefined
      }
      keyExtractor={handleKeyExtractor}
      horizontal={horizontal}
      {...props}
      ref={ref}
      data={data}
      onEndReached={handleOnEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={FootComponent}
      ListHeaderComponent={children}
    />
  );
}) as <T>(
  p: InfiniteFlatListProps<T> & {ref?: InfiniteFlatListRef<T>},
) => JSX.Element;
