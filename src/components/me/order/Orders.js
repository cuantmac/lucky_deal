import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  RefreshControl,
  StatusBar,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import OrderCard from './OrderCard';
import Api from '../../../Api';
import Empty from '../../common/Empty';
import AppModule from '../../../../AppModule';
import {PRIMARY} from '../../../constants/colors';
import {useDispatch} from 'react-redux';
import {TimerProvider} from '@src/widgets/timer';

export default function ({navigation, route}) {
  const orderStatus =
    route.params?.orderStatus === undefined ? -1 : route.params?.orderStatus;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Orders',
    });
  }, [navigation]);
  const [orderLit, setOrderList] = useState([]);
  const [isRefreshing, setRefreshing] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [isLoadComplete, setLoadComplete] = useState(false);
  const pageRef = useRef(1);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'setOrderCount',
      payload: 0,
    });
  }, [dispatch]);

  const fetchOrderList = useCallback(() => {
    let page = pageRef.current;
    Api.orderList(page, orderStatus).then((res) => {
      let list = res.data?.list || [];
      // console.log('list', list);
      if (list.length < 10) {
        setLoadComplete(true);
      }
      if (page > 1) {
        setOrderList((old) => old.concat(list));
      } else {
        setOrderList(list);
      }
      setRefreshing(false);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLoadComplete(false);
    pageRef.current = 1;
    fetchOrderList();
  }, [fetchOrderList]);
  // const showScratch2 = true;
  useEffect(() => {
    if (!navigation.isFocused()) {
      return;
    }
    AppModule.reportShow('11', '114');
    AppModule.reportPv('Orders');
    onRefresh();
    // checkoutCouponDialog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefresh, navigation]);

  useEffect(() => {
    if (!navigation.isFocused()) {
      return;
    }
    let sub = DeviceEventEmitter.addListener('updateOrdersList', () => {
      onRefresh();
    });
    return () => {
      sub.remove();
    };
  }, [navigation, onRefresh]);

  const loadMore = () => {
    if (isLoading || isLoadComplete) {
      return;
    }
    setLoading(true);
    pageRef.current = pageRef.current + 1;
    fetchOrderList();
    console.log('loadMore...');
  };

  if (orderLit.length === 0) {
    return isRefreshing ? (
      <ActivityIndicator color={PRIMARY} style={{flex: 1}} />
    ) : (
      <Empty
        image={require('../../../assets/empty.png')}
        title={'Nothing at all'}
      />
    );
  }
  const renderItem = ({item}) => (
    <OrderCard data={item} onRefresh={onRefresh} navigation={navigation} />
  );
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor={'transparent'}
      />
      <TimerProvider>
        <FlatList
          data={orderLit}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={() => {
            if (isLoadComplete) {
              return null;
            }
            return <ActivityIndicator color={PRIMARY} style={{padding: 10}} />;
          }}
          onEndReachedThreshold={0.4}
          onEndReached={loadMore}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </TimerProvider>
    </>
  );
}
