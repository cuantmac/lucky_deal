import {PRIMARY} from '@src/constants/colors';
import {isWeb, px2dp, styleAdapter} from '@src/helper/helper';
import {Empty as EmptyComponent} from '@src/widgets/empty';
import React, {FC} from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {LoadingIndicator as LoadingComponent} from '@src/widgets/loadingIndicator';
import {VisibleAction} from '@src/widgets/visibleAction';

// 加载状态
export enum LOADING_STATUS_ENUM {
  LOADING,
  LOAD_MORE,
  COMPLETE,
  EMPTY,
  ERROR,
}

interface LoadMoreIndicatorProps {
  onPress: () => void;
  loadMore?: () => void;
  horizontal?: boolean;
}

type ErrorIndicatorProps = LoadMoreIndicatorProps & {
  page: number;
  defaultPage: number;
};

export type CreateLoadingIndicatorParams = {
  Empty?: typeof EmptyIndicator;
  Loading?: typeof LoadIndicator;
  LoadMore?: typeof LoadMoreIndicator;
  Complete?: typeof CompleteIndicator;
  Error?: typeof ErrorIndicator;
};

export type IndicatorRef = {
  setLoadEnd: () => void;
  setComplete: () => void;
  setError: () => void;
  setEmpty: () => void;
  setLoading: () => void;
};

export type IndicatorProps = {
  page: number;
  onPress: () => void;
  defaultPage: number;
  status?: LOADING_STATUS_ENUM;
  loadMore?: () => void;
  horizontal?: boolean;
};

interface IndicatorContainerProps {
  onPress?: () => void;
  style?: ViewStyle;
  horizontal?: boolean;
}

const IndicatorContainer: FC<IndicatorContainerProps> = ({
  children,
  onPress,
  style,
  horizontal,
}) => {
  if (horizontal) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={!onPress}
        onPress={onPress}
        style={[
          {
            width: px2dp(40),
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
          style,
        ]}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={!onPress}
      onPress={onPress}
      style={[
        {
          height: px2dp(40),
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}>
      {children}
    </TouchableOpacity>
  );
};

const EmptyIndicator: FC<LoadMoreIndicatorProps> = () => {
  return (
    <EmptyComponent
      image={require('@src/assets/empty.png')}
      title={'Nothing at all'}
    />
  );
};

interface LoadIndicatorProps {
  page?: number;
  horizontal?: boolean;
}

const LoadIndicator: FC<LoadIndicatorProps> = ({page, horizontal}) => {
  return (
    <IndicatorContainer
      horizontal={horizontal}
      style={styleAdapter(
        horizontal
          ? {marginLeft: page === 1 ? 150 : 0}
          : {marginTop: page === 1 ? 100 : 0},
      )}>
      <LoadingComponent />
    </IndicatorContainer>
  );
};

const LoadMoreIndicator: FC<LoadMoreIndicatorProps> = ({
  loadMore,
  horizontal,
}) => {
  if (isWeb()) {
    return (
      <VisibleAction
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onVisible={loadMore}>
        <IndicatorContainer horizontal={horizontal} />
      </VisibleAction>
    );
  }
  return <IndicatorContainer horizontal={horizontal} />;
};

interface CompleteIndicatorProps {
  horizontal?: boolean;
}

const CompleteIndicator: FC<CompleteIndicatorProps> = ({horizontal}) => {
  return (
    <IndicatorContainer horizontal={horizontal}>
      <Text style={{color: '#a8a8a8', fontSize: 14, lineHeight: 14}}>
        No more data
      </Text>
    </IndicatorContainer>
  );
};

const ErrorIndicator: FC<ErrorIndicatorProps> = ({
  onPress,
  page,
  defaultPage,
  horizontal,
}) => {
  if (page === defaultPage) {
    return <EmptyComponent onRefresh={onPress} />;
  }
  return (
    <IndicatorContainer horizontal={horizontal} onPress={onPress}>
      <Text
        style={{
          color: '#a8a8a8',
          fontSize: 14,
          lineHeight: 14,
          textAlign: 'center',
        }}>
        Try Again
      </Text>
    </IndicatorContainer>
  );
};

export const defaultCreateLoadingIndicatorParams = {
  Empty: EmptyIndicator,
  Loading: LoadIndicator,
  LoadMore: LoadMoreIndicator,
  Complete: CompleteIndicator,
  Error: ErrorIndicator,
};

export const createLoadingIndicator = ({
  Empty = EmptyIndicator,
  Loading = LoadIndicator,
  LoadMore = LoadMoreIndicator,
  Complete = CompleteIndicator,
  Error = ErrorIndicator,
}: CreateLoadingIndicatorParams = {}) => {
  return ({
    onPress,
    page,
    defaultPage,
    loadMore,
    status = LOADING_STATUS_ENUM.LOADING,
    horizontal,
  }: IndicatorProps) => {
    switch (status) {
      case LOADING_STATUS_ENUM.EMPTY:
        return <Empty horizontal={horizontal} onPress={onPress} />;
      case LOADING_STATUS_ENUM.LOADING:
        return <Loading horizontal={horizontal} page={page} />;
      case LOADING_STATUS_ENUM.LOAD_MORE:
        return (
          <LoadMore
            horizontal={horizontal}
            onPress={onPress}
            loadMore={loadMore}
          />
        );
      case LOADING_STATUS_ENUM.COMPLETE:
        return <Complete horizontal={horizontal} />;
      case LOADING_STATUS_ENUM.ERROR:
        return (
          <Error
            horizontal={horizontal}
            onPress={onPress}
            page={page}
            defaultPage={defaultPage}
          />
        );
      default:
        return null;
    }
  };
};

export const LoadingIndicator = createLoadingIndicator();
