import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
import {Animated, View} from 'react-native';
import AppModule from '../../../AppModule';
import Api from '../../Api';
import {
  FROM_MYSTERY,
  FROM_SUPER_BOX,
  FROM_OFFERS,
  px,
} from '../../constants/constants';
import Empty from '../common/Empty';
import AuctionListHolder from '../home/placeholder/AuctionListHolder';
import {WaterfallList} from 'react-native-largelist-v3';
import {WithLastDateHeader} from '../common/WithLastDateHeader';
import {navigationRef} from '../../utils/refs';
import {reportData} from '../../constants/reportData';
import {categoryDetailPath} from '../../analysis/report';
import {
  getProductItemHeight,
  ProductListItem,
} from '../../widgets/productItem/ProductListItem';
import {MysteryRoute, ProductRoute} from '@src/routes';

export default function SearchResultList({keyWords}) {
  const [dataList, setDataList] = useState([]);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const pageRef = useRef(1);
  const dataListRef = useRef([]);
  const totalRef = useRef(0);
  const countDown = useRef();
  const {token} = useSelector((state) => state.deprecatedPersist);
  const [isRefreshing, setRefreshing] = useState(false);
  const [prevToken] = useState(token);
  const dispatch = useDispatch();
  const waterfallListRef = useRef();
  const focus = useIsFocused();

  const [scrollY] = useState(new Animated.Value(0));

  const contentHeightRef = useRef(0);
  const loadingRef = useRef(false);
  const allLoadedRef = useRef(false);
  const prodIndexRef = useRef(1);
  const showTypeRef = useRef(0);

  const fetchSearchList = useCallback(() => {
    setError(false);
    Api.searchResult(pageRef.current, keyWords, token).then((res) => {
      if (res.error) {
        setRefreshing(false);
        waterfallListRef.current?.endRefresh();
        setError(true);
        dataListRef.current = [];
        setDataList(dataListRef.current);
        console.log('axios', 'auction/list', res);
        return;
      }
      let list = res.data.list || [];
      countDown.current = res.data.count_down;
      totalRef.current = res.data.total;
      if (pageRef.current === 1) {
        prodIndexRef.current = 1;
        dataListRef.current = list;
        setEmpty(list.length === 0);
      } else if (list.length > 0) {
        list.forEach((item) => {
          dataListRef.current.push(item);
        });
      } else {
        allLoadedRef.current = true;
      }
      setDataList([...dataListRef.current] || []);
      //start 上报代码(非业务逻辑)
      let productIds = '';
      let prodStationIndex = '';
      list.forEach((item) => {
        productIds += (item.bag_id || item.product_id) + ',';
        prodStationIndex += prodIndexRef.current + ',';
        prodIndexRef.current += 1;
      });
      AppModule.reportShow('16', '149', {
        ProductId: productIds,
        PageStation: pageRef.current + '',
        ProdStation: prodStationIndex,
        ShowType: showTypeRef.current + '',
        ProductCat: categoryDetailPath.getData().ProductCat,
      });
      //end 上报代码(非业务逻辑)

      setRefreshing(false);
      waterfallListRef.current?.endRefresh();
      loadingRef.current = false;
      pageRef.current += 1;
    });
  }, [keyWords, token]);

  useEffect(() => {
    if (isRefreshing && focus) {
      fetchSearchList();
    }
  }, [fetchSearchList, focus, isRefreshing]);

  useEffect(() => {
    if (!prevToken && token) {
      setRefreshing(true);
    }
  }, [prevToken, token]);

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
    showTypeRef.current = 2;
    setRefreshing(true);
  };

  const onLoadMore = (y) => {
    if (
      contentHeightRef.current > 0 &&
      y >= contentHeightRef.current &&
      !loadingRef.current &&
      !allLoadedRef.current
    ) {
      showTypeRef.current = 1;
      loadingRef.current = true;
      fetchSearchList();
    }
  };

  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();

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
  const renderItem = (item, index) => (
    <View
      style={{
        margin: 5,
      }}>
      <ProductListItem
        data={item}
        onPress={() => {
          if (item.product_category === 1) {
            //1 --福袋，2--直购，3--大转盘
            MysteryRouter.navigate({
              productId: item.bag_id || item.product_id,
            });

            AppModule.reportClick('16', '149', {
              CategoryId: reportData.searchResultCategoryId,
              ProductId: item.bag_id || item.product_id,
              PageStation: pageRef.current + '',
              CateStation: index + 1,
              BoxId: item.bag_id || item.product_id,
              ProductCat: categoryDetailPath.getData().ProductCat,
            });
          } else if (
            item.product_category === 2 ||
            item.product_category === 4
          ) {
            ProductRouter.navigate({
              productId: item.product_id || item.bag_id,
            });
          }
        }}
      />
    </View>
  );

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
          <Empty
            title={'Nothing at all'}
            image={require('../../assets/empty.png')}
          />
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
        data={dataList}
        numColumns={2}
        heightForItem={getProductItemHeight}
        renderItem={renderItem}
      />
    </View>
  );
}
