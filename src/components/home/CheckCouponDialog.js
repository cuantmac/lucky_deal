import React, {useRef, useCallback, useEffect} from 'react';
import {AppState} from 'react-native';
import {dialogs, navigationRef} from '../../utils/refs';
import {globalModalQueue} from '../../utils/modalQueue';
import {useShallowEqualSelector, useFetching} from '../../utils/hooks';
import {useDispatch} from 'react-redux';
import Api from '../../Api';
import Utils from '../../utils/Utils';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

export const useCheckCouponDialog = () => {
  const dispatch = useDispatch();
  const {token, pushCouponCode} = useShallowEqualSelector(
    (state) => state.deprecatedPersist,
  );

  const byCodeCoupon = useCallback(() => {
    Api.couponDetail(pushCouponCode).then((res) => {
      if (res.code === 0 && res.data.coupon_list) {
        globalModalQueue.add(dialogs.getCouponRef, {
          data: res.data,
          handleCollect: rewardByCodeCoupon,
          closeCallBack: () => {},
        });
      }
      dispatch({
        type: 'updatePushCouponCode',
        payload: null,
      });
    });
  }, [dispatch, pushCouponCode, rewardByCodeCoupon]);

  const rewardByCodeCoupon = useCallback(() => {
    Api.rewardCouponByCode(pushCouponCode).then((res) => {
      if (res.error) {
        Utils.toastFun(res.error);
      }
      if (res.code === 0) {
        navigationRef.current?.navigate('CouponCenter');
      }
    });
  }, [pushCouponCode]);

  useEffect(() => {
    if (pushCouponCode && token) {
      byCodeCoupon();
    }
  }, [byCodeCoupon, dispatch, pushCouponCode, token]);
};

/**
 * 检查活动优惠券
 * @param {string} page 页面编号
 */
export const useMarketCouponCheck = (page) => {
  const {token} = useShallowEqualSelector((state) => state.deprecatedPersist);
  const [, getData] = useFetching(Api.dialogCouponList);
  const preFetch = useRef();
  const focus = useIsFocused();

  // 领取优惠券 更新弹窗
  const getCouponList = useCallback(
    (activityId) => {
      if (!token) {
        return;
      }
      dialogs.getCouponRef.current?.setLoading(true);
      Api.getCouponList({activity_id: activityId})
        .then((res) => {
          if (res.code === 0) {
            dialogs.getCouponRef.current?.updateData(res.data);
            if (res.data.toast) {
              Utils.toastFun(res.data.toast);
            }
          } else {
            Utils.toastFun(res.error);
          }
        })
        .finally(() => {
          dialogs.getCouponRef.current?.setLoading(false);
        });
    },
    [token],
  );

  const couponDialogFun = useCallback(async () => {
    preFetch.current && preFetch.current.cancel();
    preFetch.current = getData();
    const res = await preFetch.current;
    const _list = res.data?.coupon_list || [];
    // 判断当前的页面是否在限制中
    if (!res.data?.apply_page?.includes(page)) {
      return;
    }
    if (_list.length > 0) {
      globalModalQueue.add(dialogs.getCouponRef, {
        data: res.data,
        handleCollect: getCouponList,
      });
    }
    preFetch.current.catch(() => {});
  }, [getCouponList, getData, page]);

  useEffect(() => {
    if (focus) {
      couponDialogFun();
    }
  }, [couponDialogFun, focus]);
};
