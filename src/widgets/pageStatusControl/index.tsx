import {styleAdapter} from '@src/helper/helper';
import React, {FC, useEffect, useRef} from 'react';
import {Empty} from '../empty';
import {LoadingIndicator} from '../loadingIndicator';

export interface PageStatusControlProps {
  // 当前页面的加载状态
  loading: boolean;

  feachLoading?: boolean;
  // 当前页面是否已经有数据
  hasData: boolean;
  // 是否展示当前页面数据为空的状态
  showEmpty?: boolean;
  // 页面加载状态控件
  loadingComponent?: JSX.Element;
  // 页面数据为空显示的状态
  emptyComponent?: JSX.Element;
  // 点击刷新
  onRefresh?: () => void;
}

export const PageStatusControl: FC<PageStatusControlProps> = ({
  children,
  loading,
  hasData,
  showEmpty,
  loadingComponent = <LoadingIndicator style={styleAdapter({marginTop: 80})} />,
  emptyComponent = <Empty title={'Nothing at all'} />,
  feachLoading = false,
  onRefresh,
}) => {
  const dirtyRef = useRef(false);
  useEffect(() => {
    if (!dirtyRef.current) {
      dirtyRef.current = true;
    }
  }, [loading]);

  if (feachLoading) {
    return loadingComponent;
  }
  if (loading && !hasData) {
    return loadingComponent;
  }

  if (showEmpty && dirtyRef.current && !loading && !hasData) {
    return React.cloneElement(emptyComponent, {onRefresh});
  }

  if (!loading && !hasData) {
    return null;
  }

  return <>{children}</>;
};
