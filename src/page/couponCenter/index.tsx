import React, {FC, useCallback, useEffect, useState, useMemo} from 'react';
import {
  FlatList,
  StatusBar,
  useWindowDimensions,
  View,
  Text,
} from 'react-native';
import {COUPON_STATUS_ENUM} from '@src/constants/enum';
import {navigationRef} from '@src/utils/refs';
import {
  StandardCouponCard,
  StandardCouponCardUsedAction,
  StandardCouponCardExpiredAction,
} from '@src/widgets/coupons/Coupons';
import {useNavigationHeader} from '@src/widgets/navigationHeader';
import {CommonApi} from '@src/apis';
import {CouponDetail} from '@luckydeal/api-common';
import {PageStatusControl} from '@src/widgets/pageStatusControl';
import {useLoading} from '@src/utils/hooks';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {Props} from 'react-native-tab-view/lib/typescript/src/TabView';
import {ThemeRefreshControl} from '@src/widgets/themeRefreshControl';
import {Message} from '@src/helper/message';
import {createStyleSheet} from '@src/helper/helper';
import {CouponEmpty} from '@src/widgets/coupons/couponEmpty';

const CouponCenter: FC = () => {
  const [routes] = useState([
    {key: 'CouponListAvailable', title: 'Available'},
    {key: 'CouponListUsed', title: 'Used'},
    {key: 'CouponListExpire', title: 'Expired'},
  ]);
  const [index, setIndex] = useState(0);
  const layout = useWindowDimensions();

  const renderScene = useMemo(() => {
    return SceneMap({
      CouponListAvailable: () => (
        <CouponList couponType={COUPON_STATUS_ENUM.NOT_USE} />
      ),
      CouponListUsed: () => (
        <CouponList couponType={COUPON_STATUS_ENUM.HAS_USED} />
      ),
      CouponListExpire: () => (
        <CouponList couponType={COUPON_STATUS_ENUM.HAS_EXPIRED} />
      ),
    });
  }, []);

  const contentWidth = layout.width;
  const indicatorWidth = contentWidth * 0.3;
  const indicatorLeft = (contentWidth - indicatorWidth) / 6;

  const renderTabBar = useCallback<Props<any>['renderTabBar']>(
    (props) => {
      return (
        <TabBar
          {...props}
          indicatorStyle={[CouponCenterStyles.indicator]}
          style={CouponCenterStyles.tabBar}
          indicatorContainerStyle={{
            width: indicatorWidth,
            marginLeft: indicatorLeft,
          }}
          activeColor={'#222222'}
          inactiveColor={'#575757'}
          scrollEnabled={true}
          tabStyle={{width: contentWidth / 3}}
          renderLabel={({route, color}) => {
            return (
              <Text
                style={{
                  color,
                  fontWeight: '700',
                  fontSize: 13,
                }}>
                {route.title}
              </Text>
            );
          }}
        />
      );
    },
    [contentWidth, indicatorLeft, indicatorWidth],
  );

  useNavigationHeader({
    title: 'My Coupons',
  });

  return (
    <View style={CouponCenterStyles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor={'transparent'}
      />
      <TabView
        renderTabBar={renderTabBar}
        swipeEnabled={false}
        lazy
        navigationState={{index, routes}}
        onIndexChange={setIndex}
        renderScene={renderScene}
        initialLayout={{width: layout.width}}
      />
    </View>
  );
};

interface CouponListProps {
  couponType: COUPON_STATUS_ENUM;
}

const CouponList: FC<CouponListProps> = ({couponType}) => {
  const [isRefreshing, setRefreshing] = useState(false);
  const [couponList, setCouponList] = useState<CouponDetail[]>([]);
  const [loading, withLoading] = useLoading();

  const fetchCouponList = useCallback(() => {
    return CommonApi.userCouponGroupListUsingPOST({
      coupon_status: couponType,
    })
      .then((res) => {
        let listGroup = res.data?.list || [];
        setCouponList(
          listGroup
            .map(({list}) => list)
            .reduce(
              (previousValue, current) => previousValue.concat(current),
              [],
            ),
        );
      })
      .catch((e) => {
        Message.toast(e);
      });
  }, [couponType]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCouponList()
      .then(() => {})
      .finally(() => {
        setRefreshing(false);
      });
  }, [fetchCouponList]);

  useEffect(() => {
    withLoading(fetchCouponList());
  }, [fetchCouponList, withLoading]);

  const renderItem = useCallback(
    ({item}: {item: CouponDetail}) => (
      <StandardCouponCard
        disabled={
          couponType === COUPON_STATUS_ENUM.HAS_USED ||
          couponType === COUPON_STATUS_ENUM.HAS_EXPIRED
        }
        onPress={() => {
          navigationRef.current.navigate('Main');
        }}
        data={item}>
        {couponType === COUPON_STATUS_ENUM.HAS_USED && (
          <StandardCouponCardUsedAction />
        )}
        {couponType === COUPON_STATUS_ENUM.HAS_EXPIRED && (
          <StandardCouponCardExpiredAction />
        )}
      </StandardCouponCard>
    ),
    [couponType],
  );

  return (
    <PageStatusControl
      emptyComponent={<CouponEmpty style={{marginTop: 150}} />}
      hasData={!!couponList.length}
      showEmpty
      loading={loading}>
      {!!couponList.length && (
        <FlatList
          data={couponList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <ThemeRefreshControl
              onRefresh={handleRefresh}
              refreshing={isRefreshing}
            />
          }
          onEndReachedThreshold={0.4}
          contentContainerStyle={CouponCenterStyles.content}
        />
      )}
    </PageStatusControl>
  );
};

const CouponCenterStyles = createStyleSheet({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    shadowColor: 'white',
  },
  indicator: {
    height: 4,
    borderRadius: 4,
    backgroundColor: '#222',
  },
  content: {
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
});

export default CouponCenter;
