import React, {useCallback, useEffect} from 'react';
import {FC, useState} from 'react';
import {Dimensions, StatusBar, View} from 'react-native';
import Api from '../../../Api';
import {px} from '../../../constants/constants';
import {ResponseError} from '../../../types/models/common.model';
import {MHomeNavApi} from '../../../types/models/config.model';
import {useFetching, useShallowEqualSelector} from '../../../utils/hooks';
import AppModule from '../../../../AppModule';
import Empty from '../../common/Empty';
import BottomTabNew from '../../main/BottomTabNew';
import {HomePlaceHolder} from '../placeholder/HomePlaceHolder';
import HomeTopView from './HomeTopView';
import HomeSubjectView from './HomeSubjectView';
import HomeCategoryView from './HomeCategoryView';
import {TopTabPlaceHolder} from '../placeholder/TabPlaceHolder';
import {reportData} from '../../../constants/reportData';
import HomeTitleBar from './HomeTitleBar';
import {APPLY_COUPON_PAGE_ENUM} from '../../../constants/enum';
import {useMarketCouponCheck} from '../CheckCouponDialog';

// 当前界面navigation所有跳转页面及其参数
type NavigationParams = {
  Home: {};
};
type tabConfigProps = {
  name: string;
  component: any;
};
const HomeView: FC = () => {
  useMarketCouponCheck(APPLY_COUPON_PAGE_ENUM.HOME);
  const {width: screenWidth} = Dimensions.get('window');
  const {token} = useShallowEqualSelector(
    (state: any) => state.deprecatedPersist,
  );
  const [error, setError] = useState(false);
  const [prevToken] = useState(token);
  const [loading, setLoading] = useState(false);
  const [tabConfig, setTabConfig] = useState<Array<tabConfigProps>>([]);
  const [, homeNavFetch] = useFetching<MHomeNavApi.RootObject & ResponseError>(
    Api.mHomeNav,
  );

  const getHomeNavData = useCallback(async () => {
    setLoading(true);
    setError(false);
    let res = await homeNavFetch();
    if (res.code === 0) {
      let list = (res?.data || {list: []}).list;
      let _arr: any[] = [];
      _arr = list.map((item) => {
        return {
          name: item.item_name,
          component:
            item.item_type === 1
              ? HomeSubjectView
              : item.item_type === 2
              ? HomeCategoryView
              : HomeTopView,
          ...item,
        };
      });
      setTabConfig(_arr);
      setLoading(false);
    } else {
      setError(true);
      setLoading(false);
    }
  }, [homeNavFetch]);

  useEffect(() => {
    getHomeNavData();
  }, [getHomeNavData]);

  useEffect(() => {
    if (!prevToken && token) {
      // 刷新
      getHomeNavData();
    }
  }, [getHomeNavData, prevToken, token]);

  useEffect(() => {
    AppModule.reportShow(reportData.home, '9');
  }, []);

  if (loading) {
    return (
      <>
        <StatusBar
          barStyle="dark-content"
          translucent={false}
          backgroundColor={'#ffff0000'}
        />
        <HomeTitleBar />
        <HomePlaceHolder />
      </>
    );
  }

  if (error) {
    return (
      <Empty
        error={true}
        onRefresh={() => {
          homeNavFetch();
        }}
      />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        position: 'relative',
      }}>
      <StatusBar
        barStyle="dark-content"
        translucent={false}
        backgroundColor={'#ffff0000'}
      />
      {<HomeTitleBar />}
      {tabConfig.length > 0 ? (
        <BottomTabNew
          tabs={tabConfig}
          tabBarPosition={'top'}
          activeTintColor={'#000'}
          inactiveTintColor={'#747474'}
          scrollEnabled={true}
          lazyPlaceholder={TopTabPlaceHolder}
          tabStyle={{
            height: 42,
            paddingHorizontal: 20 * px,
            justifyContent: 'space-around',
            alignItems: 'center',
            width: 200 * px,
          }}
          indicatorStyle={{
            backgroundColor: '#000',
          }}
          style={{width: screenWidth}}
          labelStyle={{fontSize: 40 * px}}
        />
      ) : null}
    </View>
  );
};
export default HomeView;
