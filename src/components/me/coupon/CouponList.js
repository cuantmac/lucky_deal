import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, RefreshControl, ActivityIndicator, FlatList} from 'react-native';
import {useDispatch} from 'react-redux';
import {PRIMARY} from '../../../constants/colors';
import Api from '../../../Api';
import AppModule from '../../../../AppModule';
import {navigationRef} from '../../../utils/refs';
import Empty from '../../common/Empty';
import {px} from '../../../constants/constants';
import {
  StandardCouponCard,
  StandardCouponCardExpiredAction,
  StandardCouponCardUsedAction,
} from '../../../widgets/coupons/Coupons';
import {COUPON_STATUS_ENUM} from '../../../constants/enum';
import {ProductRoute} from '@src/routes';
let _listener;

function CouponList({route}) {
  const couponType = route?.params.couponType;
  const [isRefreshing, setRefreshing] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [isLoadComplete, setLoadComplete] = useState(false);
  const [couponList, setCouponList] = useState([]);
  const dispatch = useDispatch();

  const listData = useMemo(() => {
    return couponList
      .map(({data}) => data)
      .reduce((res, item) => res.concat(item), []);
  }, [couponList]);

  const fetchCouponList = useCallback(() => {
    Api.couponCenterList(couponType).then((res) => {
      let list = res.data?.list || [];
      setLoadComplete(true);
      let groupItems = [];
      list.map((item) => {
        groupItems.push({
          title: item.group_name,
          data: item.list,
        });
      });
      setCouponList(groupItems);
      setRefreshing(false);
      setLoading(false);
    });
  }, [couponType]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLoadComplete(false);
    fetchCouponList();
  }, [fetchCouponList]);

  useEffect(() => {
    AppModule.reportClick('10', '214');
  }, []);

  useEffect(() => {
    AppModule.reportPv('Orders');
    onRefresh();
    return () => {
      if (_listener) {
        clearInterval(_listener);
      }
    };
  }, [onRefresh]);

  const loadMore = () => {
    if (isLoading || isLoadComplete) {
      return;
    }
    setLoading(true);
    fetchCouponList();
  };

  const ProductRouter = ProductRoute.useRouteLink();

  const renderItem = ({item}) => (
    <StandardCouponCard
      disabled={
        couponType === COUPON_STATUS_ENUM.HAS_USED ||
        couponType === COUPON_STATUS_ENUM.HAS_EXPIRED
      }
      onPress={() => {
        if (couponType === 0) {
          AppModule.reportClick('10', '215', {CopuonStatus: couponType});
          if (item.route === 0) {
            dispatch({type: 'setTabIndex', payload: 0});
            _listener = setInterval(() => {
              navigationRef.current.navigate('Main');
            }, 300);
          } else if (item.route === 2) {
            ProductRouter.navigate({productId: item.route_id});
          }
        }
      }}
      data={item}>
      {couponType === COUPON_STATUS_ENUM.HAS_USED && (
        <StandardCouponCardUsedAction />
      )}
      {couponType === COUPON_STATUS_ENUM.HAS_EXPIRED && (
        <StandardCouponCardExpiredAction />
      )}
    </StandardCouponCard>
  );

  if (couponList.length === 0) {
    return isRefreshing ? (
      <ActivityIndicator color={PRIMARY} style={{flex: 1}} />
    ) : (
      <Empty
        image={require('../../../assets/coupon_empty.png')}
        title={'It is empty here!'}
      />
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'center'}}>
      {couponList.length > 0 && (
        <FlatList
          data={listData}
          onEndReached={loadMore}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
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
          contentContainerStyle={{
            paddingBottom: 30 * px,
          }}
        />
      )}
    </View>
  );
}

export default CouponList;
