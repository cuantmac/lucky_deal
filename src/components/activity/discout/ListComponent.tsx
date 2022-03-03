import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
import {Animated, DeviceEventEmitter, View} from 'react-native';

import Api from '../../../Api';
import {FROM_OFFERS, px, SCREEN_WIDTH} from '../../../constants/constants';
import Empty from '../../common/Empty';
import AuctionListHolder from '../../home/placeholder/AuctionListHolder';
import {WaterfallList} from 'react-native-largelist-v3';
import {WithLastDateHeader} from '../../common/WithLastDateHeader';
import {navigationRef} from '../../../utils/refs';
import GlideImage from '../../native/GlideImage';
import Utils from '../../../utils/Utils';
import {reportData} from '../../../constants/reportData';

import {
  getProductItemHeight,
  ProductListItem,
} from '../../../widgets/productItem/ProductListItem';
import {ProductSimpleItem} from '@luckydeal/api-common';
import {ProductRoute} from '@src/routes';

const GlideImageEl = GlideImage as any;
interface ListComponentProps {
  activity_id: number;
  onTitleChange?: (t: string) => void;
}

const ListComponent: FC<ListComponentProps> = ({
  activity_id,
  onTitleChange,
}) => {
  const [dataList, setDataList] = useState<ProductSimpleItem[]>([]);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  // const [showToast, setShowToast] = useState(false);
  const pageRef = useRef(1);

  const dataListRef = useRef<ProductSimpleItem[]>([] as ProductSimpleItem[]);
  const {token} = useSelector((state: any) => state.deprecatedPersist);
  const [isRefreshing, setRefreshing] = useState(false);
  const [prevToken] = useState(token);
  const dispatch = useDispatch();
  const bannerImage = useRef<string>();
  const waterfallListRef = useRef<WaterfallList<ProductSimpleItem>>(null);
  const focus = useIsFocused();

  const [scrollY] = useState(new Animated.Value(0));

  const contentHeightRef = useRef(0);
  const loadingRef = useRef(false);
  const allLoadedRef = useRef(false);
  const prodIndexRef = useRef(1);
  const fetchDataList = useCallback(() => {
    setError(false);
    Api.activityProductList(activity_id, pageRef.current).then((res) => {
      if (res.error) {
        setRefreshing(false);
        waterfallListRef.current?.endRefresh();
        setError(true);
        dataListRef.current = [];
        setDataList(dataListRef.current);
        return;
      }
      onTitleChange && onTitleChange(res.data.title);
      let list = res.data.list || [];
      bannerImage.current = res.data.activity_picture;
      if (pageRef.current === 1) {
        prodIndexRef.current = 1;
        dataListRef.current = list;
        setEmpty(list.length === 0);
      } else if (list.length > 0) {
        list.forEach((item) => {
          if (!item.bag_id || !item.product_id) {
            dataListRef.current.push(item);
            return;
          }
          let index = dataListRef.current.findIndex(
            (i) => i.bag_id === item.bag_id || i.product_id === item.product_id,
          );
          if (index === -1) {
            dataListRef.current.push(item);
          } else {
            dataListRef.current[index] = item;
          }
        });
      } else {
        allLoadedRef.current = true;
      }
      setDataList([...dataListRef.current] || []);
      setRefreshing(false);
      waterfallListRef.current?.endRefresh();
      loadingRef.current = false;
      pageRef.current += 1;
    });
  }, [activity_id, onTitleChange]);

  useEffect(() => {
    if (isRefreshing && focus) {
      fetchDataList();
    }
  }, [fetchDataList, focus, isRefreshing]);
  useEffect(() => {
    if (!focus) {
      return;
    }
    let sub = DeviceEventEmitter.addListener(
      'showDiscountToast',
      (productDiscountInfo) => {
        Utils.toastFun(
          `${productDiscountInfo.next_more_discount_number} more ${
            productDiscountInfo.next_more_discount_number > 1 ? 'items' : 'item'
          } to enjoy ${productDiscountInfo.next_discount}% off`,
        );
      },
    );
    return () => {
      sub.remove();
    };
  }, [focus]);
  useEffect(() => {
    if (!prevToken && token) {
      setRefreshing(true);
    }
  }, [prevToken, token]);

  const ProductRouter = ProductRoute.useRouteLink();

  useEffect(() => {
    if (focus && dataList.length === 0) {
      pageRef.current = 1;
      setRefreshing(true);
    }
  }, [dataList.length, dispatch, focus]);

  //下拉刷新
  const onRefresh = () => {
    pageRef.current = 1;
    allLoadedRef.current = false;
    setRefreshing(true);
  };

  const goDetail = useCallback(
    (item, index) => {
      ProductRouter.navigate({
        productId: item.bag_id || item.product_id,
      });
    },
    [ProductRouter],
  );

  const onLoadMore = (y: number) => {
    if (
      contentHeightRef.current > 0 &&
      y >= contentHeightRef.current &&
      !loadingRef.current &&
      !allLoadedRef.current
    ) {
      // showTypeRef.current = 1;
      loadingRef.current = true;
      fetchDataList();
    }
  };
  if (error && focus) {
    return (
      <Empty
        error={true}
        onRefresh={() => {
          setError(false);
          onRefresh();
        }}
      />
    );
  }

  if (isRefreshing && dataList.length === 0) {
    return (
      <>
        <AuctionListHolder headerShown={true} />
      </>
    );
  }
  const renderItem = (item: ProductSimpleItem, index: number) => (
    <View
      style={{
        margin: 5,
      }}>
      <ProductListItem data={item} onPress={() => goDetail(item, index)} />
    </View>
  );
  const _headerView = () => {
    return (
      <View>
        {bannerImage.current ? (
          <GlideImageEl
            source={Utils.getImageUri(bannerImage.current)}
            resizeMode={'stretch'}
            style={{
              width: SCREEN_WIDTH - 20 * px,
              marginTop: 25 * px,
              marginBottom: 15 * px,
              height: (260 / 510) * (SCREEN_WIDTH - 20 * px),
              alignSelf: 'center',
            }}
          />
        ) : null}
      </View>
    );
  };
  return (
    <View
      style={{
        flex: 1,
      }}>
      {empty ? (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}>
          <Empty image={require('../../../assets/empty.png')} />
        </View>
      ) : null}
      <WaterfallList
        ref={waterfallListRef}
        onLayout={({nativeEvent}) => {
          contentHeightRef.current = nativeEvent.layout.height;
        }}
        onScroll={({
          nativeEvent: {
            contentOffset: {y},
          },
        }) => {
          onLoadMore(y);
        }}
        refreshHeader={WithLastDateHeader}
        onRefresh={onRefresh}
        onNativeContentOffsetExtract={{y: scrollY}}
        renderHeader={_headerView}
        data={dataList}
        numColumns={2}
        heightForItem={getProductItemHeight}
        renderItem={renderItem}
      />
    </View>
  );
};
export default ListComponent;
