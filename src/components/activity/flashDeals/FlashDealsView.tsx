import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {ActivityIndicator, StatusBar, View} from 'react-native';
import Api from '../../../Api';
import {APPLY_COUPON_PAGE_ENUM} from '../../../constants/enum';
import {
  SalesCateInfoItem,
  SessionInfoItem,
} from '../../../types/models/activity.model';
import {useFetching} from '../../../utils/hooks';
import Empty from '../../common/Empty';
import {useMarketCouponCheck} from '../../home/CheckCouponDialog';
import TimeItemTabs from './TimeItemTabs';
import TimeTabs from './TimeTabs';

const FlashDealsView = () => {
  useMarketCouponCheck(APPLY_COUPON_PAGE_ENUM.ACTIVITY);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: '#fff',
      headerStyle: {backgroundColor: '#F13C3C'},
      headerTitleAlign: 'center',
      title: 'Flash Deals',
    });
  }, [navigation]);

  const [, configFetch] = useFetching(Api.flashSalesConfig);
  const [loading, setloading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeTabList, setTimeTabList] = useState<SessionInfoItem[]>([]);
  const [tabList, setTabList] = useState<SalesCateInfoItem[]>();

  const getConfig = useCallback(async () => {
    setloading(true);
    let res = await configFetch();
    if (res.code === 0) {
      let list = res.data.session_info || [];
      setTimeTabList(list);
      setTabList(list[0].sales_cate_info || []);
      // setActiveIndex(list[0].session_id);
    }
    setloading(false);
  }, [configFetch]);

  const setTimeTabs = useCallback(
    (i) => {
      setActiveIndex(i);
      setTabList(timeTabList[i].sales_cate_info || []);
    },
    [timeTabList],
  );

  useEffect(() => {
    getConfig();
  }, [getConfig]);

  if (!timeTabList || !timeTabList.length) {
    return (
      <Empty
        title={'Nothing at all'}
        image={require('../../../assets/empty.png')}
      />
    );
  }
  return loading ? (
    <ActivityIndicator style={{flex: 1}} color={'red'} />
  ) : (
    <View style={{flex: 1}}>
      <StatusBar
        barStyle="light-content"
        translucent={false}
        backgroundColor={'#F13C3C'}
      />
      <TimeTabs
        tabList={timeTabList || []}
        activeIndex={activeIndex}
        onPress={setTimeTabs}
      />
      <TimeItemTabs
        tabConfig={tabList || []}
        timeTabData={timeTabList[activeIndex]}
      />
    </View>
  );
};
export default FlashDealsView;
