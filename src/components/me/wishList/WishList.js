import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import {useIsFocused} from '@react-navigation/core';
import {Animated, View, StatusBar} from 'react-native';
import Api from '../../../Api';
import {
  FROM_MYSTERY,
  FROM_SUPER_BOX,
  FROM_OFFERS,
  px,
} from '../../../constants/constants';
import Empty from '../../common/Empty';
import AuctionListHolder from '../../home/placeholder/AuctionListHolder';
import {WaterfallList} from 'react-native-largelist-v3';
import {WithLastDateHeader} from '../../common/WithLastDateHeader';
import {navigationRef} from '../../../utils/refs';
import {reportData} from '../../../constants/reportData';
import {
  getProductItemHeight,
  ProductListItem,
} from '../../../widgets/productItem/ProductListItem';
import {MysteryRoute, ProductRoute} from '@src/routes';

export default function ProductList({navigation}) {
  const [dataList, setDataList] = useState([]);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const pageRef = useRef(1);
  const dataListRef = useRef([]);
  const [isRefreshing, setRefreshing] = useState(false);
  const waterfallListRef = useRef();
  const focus = useIsFocused();

  const [scrollY] = useState(new Animated.Value(0));

  const contentHeightRef = useRef(0);
  const loadingRef = useRef(false);
  const allLoadedRef = useRef(false);
  const prodIndexRef = useRef(1);
  const showTypeRef = useRef(0);

  const fetchAuctionList = useCallback(() => {
    setError(false);
    Api.likeProductList(pageRef.current).then((res) => {
      if (res.error) {
        setRefreshing(false);
        waterfallListRef.current?.endRefresh();
        setError(true);
        dataListRef.current = [];
        setDataList(dataListRef.current);
        return;
      }
      let list = res.Data.list || [];
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
  }, []);

  useEffect(() => {
    if (isRefreshing && focus) {
      fetchAuctionList();
    }
  }, [fetchAuctionList, focus, isRefreshing]);

  useEffect(() => {
    if (focus) {
      pageRef.current = 1;
      setRefreshing(true);
    }
  }, [focus]);

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
      fetchAuctionList();
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Wish List',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();

  if (error && focus) {
    return (
      <Empty
        title={'Nothing at all'}
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
            MysteryRouter.navigate({productId: item.bag_id || item.product_id});
          } else if (
            item.product_category === 2 ||
            item.product_category === 4
          ) {
            ProductRouter.navigate({productId: item.bag_id || item.product_id});
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
      <StatusBar barStyle={'dark-content'} />
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
            image={require('../../../assets/empty.png')}
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
