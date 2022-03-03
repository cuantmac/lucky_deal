import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
import {Animated, Dimensions, Image, View} from 'react-native';
import AppModule from '../../../AppModule';
import Api from '../../Api';
import {PATH_MYSTERY, px} from '../../constants/constants';
import Empty from '../common/Empty';
import AuctionListHolder from '../home/placeholder/AuctionListHolder';
import {WaterfallList} from 'react-native-largelist-v3';
import {WithLastDateHeader} from '../common/WithLastDateHeader';
import MysteryCard from './MysteryCard';
import {navigationRef} from '../../utils/refs';
import {MysteryRoute} from '../../routes';

export default function MysteryList({navigation}) {
  const [dataList, setDataList] = useState([]);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const pageRef = useRef(1);

  const dataListRef = useRef([]);

  const {token, appCheck} = useSelector((state) => state.deprecatedPersist);
  const [isRefreshing, setRefreshing] = useState(false);
  const [prevToken] = useState(token);
  const dispatch = useDispatch();

  const waterfallListRef = useRef();
  const focus = useIsFocused();

  const [scrollY] = useState(new Animated.Value(0));

  const contentHeightRef = useRef(0);
  const loadingRef = useRef(false);
  const allLoadedRef = useRef(false);

  const [top] = useState(132);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Mystery Prize',
    });
  }, [appCheck, navigation]);
  useEffect(() => {
    AppModule.reportPv('MysteryPrize');
  }, []);

  //竞拍列表
  const fetchAuctionList = useCallback(() => {
    setError(false);
    Api.luckyBagList(pageRef.current).then((res) => {
      if (res.error) {
        setRefreshing(false);
        waterfallListRef.current?.endRefresh();
        setError(true);
        dataListRef.current = [];
        setDataList(dataListRef.current);
        console.log('axios', 'auction/list', res);
        return;
      }
      console.log(
        'MysteryList count',
        res.data.list.length,
        'page',
        pageRef.current,
      );
      let list = res.data.list || [];
      if (pageRef.current === 1) {
        dataListRef.current = list;
        setEmpty(list.length === 0);
      } else if (list.length > 0) {
        list.forEach((item) => {
          if (!item.bag_id) {
            dataListRef.current.push(item);
            return;
          }
          let index = dataListRef.current.findIndex(
            (i) => i.bag_id === item.bag_id,
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
    setRefreshing(true);
  };

  const onLoadMore = (y) => {
    if (
      contentHeightRef.current > 0 &&
      y >= contentHeightRef.current &&
      !loadingRef.current &&
      !allLoadedRef.current
    ) {
      loadingRef.current = true;
      fetchAuctionList();
    }
  };

  const MysteryRouter = MysteryRoute.useRouteLink();

  if (error && focus) {
    return (
      <Empty
        error={true}
        onRefresh={() => {
          AppModule.reportTap('MysteryList', 'ld_loading_failed_refresh_click');
          setError(false);
          onRefresh();
        }}
      />
    );
  }

  if (isRefreshing && dataList.length === 0) {
    return (
      <>
        {/* <Header title={'Mystery Prize'} right={<Bids />} /> */}
        <AuctionListHolder headerShown={true} />
      </>
    );
  }
  const renderItem = (item, index) => (
    <View
      style={{
        margin: 5,
      }}>
      <MysteryCard
        data={item}
        onPress={() => {
          AppModule.reportTap('MysteryPrize', 'ld_mystery_product_click', {
            way: item.bag_id,
          });
          MysteryRouter.navigate({
            productId: item.bag_id,
          });
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
      {/* <Header title={'Mystery Prize'} right={<Bids />} /> */}
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
        // showsVerticalScrollIndicator={false}
        refreshHeader={WithLastDateHeader}
        onRefresh={onRefresh}
        onNativeContentOffsetExtract={{y: scrollY}}
        renderHeader={() => (
          <Image
            source={{
              uri: 'https://static.luckydeal.vip/images/mystery_banner.png',
            }}
            resizeMode={'stretch'}
            style={{
              width: '100%',
              height: 420 * px,
            }}
          />
        )}
        data={dataList}
        numColumns={2}
        heightForItem={(item, index) => {
          const itemSize = (Dimensions.get('window').width - 20) / 2;
          return itemSize + (item.base_tag?.length > 0 ? 25 : 0) + 66;
        }}
        renderItem={renderItem}
      />

      {/* <BiddingTip top={top} /> */}
    </View>
  );
}
