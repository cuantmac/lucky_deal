import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
import {Animated, Dimensions, Text, View} from 'react-native';
import AppModule from '../../../AppModule';
import Api from '../../Api';
import {PATH_DEEPLINK, px} from '../../constants/constants';
import Empty from '../common/Empty';
import AuctionListHolder from '../home/placeholder/AuctionListHolder';
import {WaterfallList} from 'react-native-largelist-v3';
import {WithLastDateHeader} from '../common/WithLastDateHeader';

import NewCard from './NewCard';

import {navigationRef} from '../../utils/refs';
import {reportData} from '../../constants/reportData';
import {MysteryRoute, ProductRoute} from '@src/routes';

export default function NewList({route, navigation}) {
  const [dataList, setDataList] = useState([]);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  // const pageRef = useRef(1);

  const dataListRef = useRef([]);
  const {ids, way} = route.params;
  const {token, appCheck} = useSelector((state) => state.deprecatedPersist);
  const [isRefreshing, setRefreshing] = useState(false);

  const [prevToken] = useState(token);
  const dispatch = useDispatch();

  const waterfallListRef = useRef();
  const focus = useIsFocused();

  const [scrollY] = useState(new Animated.Value(0));

  // const contentHeightRef = useRef(0);
  const loadingRef = useRef(false);
  // const allLoadedRef = useRef(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Picked for you',
    });
  }, [appCheck, navigation]);
  useEffect(() => {
    AppModule.reportShow('17', '162', {
      CategoryId: reportData.deepLinkCategoryId,
      AdsID: way,
      ProductId: ids,
    });
    AppModule.reportPv('DeeplinkAdsList', {way: way});
  }, [ids, way]);

  //竞拍列表
  const fetchList = useCallback(() => {
    setError(false);
    Api.newList(ids).then((res) => {
      if (res.error) {
        setRefreshing(false);
        waterfallListRef.current?.endRefresh();
        setError(true);
        dataListRef.current = [];
        setDataList(dataListRef.current);
        console.log('axios', 'newList/list', res);
        return;
      }
      console.log('newList count', res.data.list);
      let list = res.data.list || [];
      dataListRef.current = list;
      setEmpty(list.length === 0);

      setDataList([...dataListRef.current] || []);

      setRefreshing(false);
      waterfallListRef.current?.endRefresh();
      loadingRef.current = false;
      // pageRef.current += 1;
    });
  }, [ids]);

  useEffect(() => {
    if (isRefreshing && focus) {
      fetchList();
    }
  }, [fetchList, focus, isRefreshing]);

  useEffect(() => {
    if (!prevToken && token) {
      setRefreshing(true);
    }
  }, [prevToken, token]);

  useEffect(() => {
    if (focus && dataList.length === 0) {
      // pageRef.current = 1;
      setRefreshing(true);
    }
  }, [dataList.length, dispatch, focus]);

  //下拉刷新
  const onRefresh = () => {
    setRefreshing(true);
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
      <NewCard
        data={item}
        onPress={() => {
          AppModule.reportClick('17', '163', {
            CategoryId: reportData.deepLinkCategoryId,
            AdsID: way,
            ProductId: ids,
          });
          AppModule.reportTap('DeeplinkAdsList', 'ld_deeplink_product_click', {
            way: way,
          });
          if (item.product_id) {
            ProductRouter.navigate({
              productId: item.product_id,
            });
          } else {
            MysteryRouter.navigate({
              productId: item.bag_id,
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
            image={require('../../assets/empty.png')}
            title={'Nothing at all'}
          />
        </View>
      ) : null}
      <WaterfallList
        ref={waterfallListRef}
        // onScroll={({
        //   nativeEvent: {
        //     contentOffset: {y},
        //   },
        // }) => {
        //   onLoadMore(y);
        // }}
        // showsVerticalScrollIndicator={false}
        refreshHeader={WithLastDateHeader}
        onRefresh={onRefresh}
        onNativeContentOffsetExtract={{y: scrollY}}
        renderHeader={() => (
          <Text
            style={{
              fontSize: 30 * px,
              backgroundColor: '#000',
              fontWeight: 'bold',
              color: '#fff',
              paddingVertical: 30 * px,
              textAlign: 'center',
            }}>
            Only available for new user in 24 hours-don’t miss out!
          </Text>
        )}
        data={dataList}
        numColumns={2}
        heightForItem={(item, index) => {
          const itemSize = (Dimensions.get('window').width - 20) / 2;
          return itemSize + (item.base_tag?.length > 0 ? 25 : 0) + 66;
        }}
        renderItem={renderItem}
      />
    </View>
  );
}
