import {AppState, StatusBar, Text} from 'react-native';
import {BottomTabs} from '../../widgets/bottomTabs';
import HomeView from '../home/NewHome/HomeView';
import Me from '../me/Me';
import React, {useEffect, useCallback, memo, useMemo} from 'react';
import {useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
import AppModule from '../../../AppModule';
import ListenBackPress from './ListenBackPress';
import ListenDeviceEvent from './ListenDeviceEvent';
import LoginOrGuide from './LoginOrGuide';
import Rate from './Rate';
import {PRIMARY} from '../../constants/colors';
import Api from '../../Api';
import {useShallowEqualSelector} from '../../utils/hooks';
import Cart from '../cart/Cart';
import CategoryView from '../category/CategoryView';
import {px} from '../../constants/constants';
import {BottomTabPlaceHolder} from '../home/placeholder/TabPlaceHolder';
import {useCheckCouponDialog} from '../home/CheckCouponDialog';
import AppConfig from './AppConfig';

export default function ({navigation, route}) {
  const {tabIndex, token, appState} = useShallowEqualSelector((state) => ({
    ...state.deprecatedPersist,
    tabIndex: state.memory.tabIndex,
  }));
  const dispatch = useDispatch();
  const focus = useIsFocused();
  useCheckCouponDialog();
  AppConfig({app_id: 3});

  /**
   * 定时读取未读消息
   **/
  useEffect(() => {
    let _listener = setInterval(() => {
      AppModule.unreadMsgCount().then((unReadMsgCount) => {
        dispatch({type: 'updateUnreadMsgCount', payload: unReadMsgCount || 0});
      });
    }, 10 * 1000);
    return () => {
      clearInterval(_listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getTime();
    let internal = setInterval(getTime, 1000);
    return () => {
      clearInterval(internal);
    };
  }, [getTime]);

  const getTime = useCallback(() => {
    let time = new Date().getTime() / 1000;
    dispatch({type: 'updateTime', payload: time});
  }, [dispatch]);

  useEffect(() => {
    let listener = (nextAppState) => {
      if (nextAppState === 'active') {
        Api.appActiveState(0);
        // 后台进入前台，时间间隔大于15秒，进入首页、分类页面、会员页面、购物车页面、me 页面，页面自动刷新；
        // let now = new Date().getTime();
        // AppModule.log('-----appState', appState);
        // if (now - appState?.time > 15000) {
        //   // dispatch({type: 'setRefresh', payload: true});
        //   // dispatch({
        //   //   type: 'setAppState',
        //   //   payload: {state: nextAppState, time: 0},
        //   // });
        // }
      } else if (nextAppState === 'background') {
        // dispatch({
        //   type: 'setAppState',
        //   payload: {state: nextAppState, time: new Date().getTime()},
        // });
        Api.appActiveState(1);
      }
    };
    AppState.addEventListener('change', listener);
    return () => {
      AppState.removeEventListener('change', listener);
    };
  }, [appState, dispatch]);

  useEffect(() => {
    dispatch({type: 'setSearchKeyWords', payload: []});
    Api.searchKeys().then((res) => {
      if (res.code === 0) {
        dispatch({type: 'setSearchKeyWords', payload: res.data.key_words});
        dispatch({type: 'setSearchIndex', payload: 0});
      }
    });
    return () => {
      dispatch({type: 'setSearchKeyWords', payload: []});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (focus) {
      Api.commonParams().then((res) => {
        if (res.code !== 0) {
          return;
        }
        if (res.data) {
          dispatch({
            type: 'updateUserInBucket',
            payload: res.data?.is_in_bucket,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (token) {
      Api.cartNum().then((res) => {
        if (res.code === 0) {
          dispatch({type: 'updateCartNum', payload: res.data?.total_num});
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const tabsConfig = useMemo(() => {
    return [
      {
        name: 'Home',
        icon: require('../../assets/tab_home.png'),
        component: HomeView,
      },
      {
        name: 'Category',
        icon: require('../../assets/category/tab_category.png'),
        component: CategoryView,
      },
      {
        name: 'Bag',
        icon: require('../../assets/tab_cart.png'),
        // badge: <CartDotNum />,
        component: Cart,
      },
      {
        name: 'Me',
        icon: require('../../assets/tab_me.png'),
        // badge: <MeDotNum />,
        component: Me,
      },
    ];
  }, []);

  return (
    <>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={tabIndex === 3 ? PRIMARY : 'white'}
      />
      <LoginOrGuide navigation={navigation} />
      <ListenBackPress />
      <ListenDeviceEvent navigation={navigation} />
      <Rate />
      <BottomTabs config={tabsConfig} lazyPlaceholder={BottomTabPlaceHolder} />
    </>
  );
}

export const MeDotNum = () => {
  const unreadMsgCount = useShallowEqualSelector(
    (state) => state.deprecatedPersist.unreadMsgCount,
  );
  return <DotNum count={unreadMsgCount} />;
};

export const CartDotNum = () => {
  const cartNum = useShallowEqualSelector(
    (state) => state.deprecatedPersist.cartNum,
  );
  return <DotNum count={cartNum} />;
};

const DotNum = memo(({count}) => {
  return count ? (
    <Text
      style={{
        position: 'absolute',
        right: -8,
        top: -3,
        borderColor: '#FF4A1A',
        borderWidth: 4 * px,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        width: 16,
        height: 16,
        lineHeight: 15,
        color: '#FF4A1A',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: count > 99 ? 24 * px : count >= 10 ? 30 * px : 40 * px,
        padding: 5 * px,
        alignItems: 'center',
      }}>
      {count > 99 ? '99+' : count}
    </Text>
  ) : null;
});
