// import AlertDialog from '../components/dialog/AlertDialog';
import {navigationRef} from '../utils/refs';
import {Image, Text, View} from 'react-native';
import React from 'react';
import {px} from '../constants/constants';
import {CommonApi} from '../apis';

export const updateProfile = () => {
  return (dispatch) => {
    return CommonApi.userProfileUsingPOST().then((res) => {
      //用户信息
      res.data?.profle &&
        dispatch({type: 'setProfile', payload: res.data.profle});
      //更细新用户倒计时
      if (res.data?.only_one_category?.is_new_user) {
        dispatch({
          type: 'setOneDollerCategory',
          payload: {
            only_one_category: res.data?.only_one_category,
          },
        });
      } else {
        dispatch({
          type: 'setOneDollerCategory',
          payload: null,
        });
      }
      //订单数量信息
      res.data?.order &&
        dispatch({type: 'setMeOrderCount', payload: res.data.order});
      //未读消息
      dispatch({
        type: 'setMessageCount',
        payload: res.data?.message_count || 0,
      });
      dispatch({
        type: 'setOrderFeedBack',
        payload: res.data?.pay_fail_feed || 0,
      });
      //礼品卡
      dispatch({
        type: 'setRedPoint',
        payload: res.data?.red_point || 0,
      });

      //订单状态更新
      if (res.data?.order?.change) {
        dispatch({
          type: 'setOrderCount',
          payload: res.data.order.order_count,
        });
        // AlertDialog.show(
        //   <View style={{alignItems: 'center'}}>
        //     <Image
        //       source={{uri: res.data.order.image}}
        //       style={{width: 405 * px, height: 237 * px, marginTop: 58 * px}}
        //       resizeMode={'contain'}
        //     />
        //     <Text
        //       style={{
        //         marginTop: 52 * px,
        //         fontSize: 60 * px,
        //         color: 'black',
        //         textAlign: 'center',
        //       }}>
        //       Order status updated
        //     </Text>
        //   </View>,
        //   'You can track the shipping status in order page: Me > My orders.',
        //   'OK',
        //   () => {
        //     navigationRef.current?.navigate('Orders');
        //   },
        //   () => {},
        // );
      }
      return res.data?.profle ? res.data?.profle : {};
    });
  };
};

export const updateBackMessageCount = (preLen) => {
  return (dispatch) => {
    return CommonApi.userFeedbackListUsingPOST().then((res) => {
      let list = res.data?.list || [];
      const showList = list.filter((item) => {
        return item.back.content;
      });
      let curLen = showList.length;
      if (preLen < curLen) {
        dispatch({
          type: 'setFeedBackMessageCount',
          payload: curLen - preLen,
        });
        dispatch({
          type: 'setFeedBackList',
          payload: showList,
        });
      }
      return showList.length;
    });
  };
};

export const updateLatestUnpaidOrderThunk = () => {
  return (dispatch) => {
    return CommonApi.orderListV2UsingPOST({
      page: 1,
      type: -2,
      page_size: 1,
    }).then((res) => {
      if (res.data) {
        const data = res.data.list || [];
        const order = data[0];
        dispatch({
          type: 'updateLatestUnpaidOrder',
          payload: order,
        });
        return Promise.resolve(order);
      }
      return Promise.reject();
    });
  };
};
