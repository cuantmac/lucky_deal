import {useCallback, useEffect} from 'react';
import AppModule from '../../../AppModule';
import Api from '../../Api';
import {useDispatch} from 'react-redux';
import {DeviceEventEmitter} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {dialogs} from '../../utils/refs';
import {PATH_DEEPLINK} from '../../constants/constants';

import {MysteryRoute, ProductRoute} from '../../routes';
// import {useShowOnly1List} from '../../hooks/useShowOnly1List';

export default function LoginOrGuide({navigation}) {
  const dispatch = useDispatch();
  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();

  const actionOnLaunch = useCallback(() => {
    Api.login().then((res) => {
      dispatch({
        type: 'setReview',
        payload: res.data && res.data.audit_version === 1,
      });
    });
  }, [dispatch]);

  // 接入deeplink
  const percentFun = (newPrice, oldPrice) => {
    let _percent = ((1 - newPrice / oldPrice) * 100).toFixed(0);
    _percent = _percent < 0 ? '0' : _percent > 99 ? 99 : _percent;
    return _percent + '%';
  };
  const getInitData = useCallback(() => {
    let _id = AppModule.getTargetItemId();
    let _type = AppModule.getTargetItemType();

    let data = {ids: _id, type: _type};
    DeviceEventEmitter.emit('setDeeplink', data);
    console.log('deeplink:' + _id + ',' + _type);
    dispatch({type: 'setDeeplink', payload: data});
    return data;
  }, [dispatch]);
  const goDirection = useCallback(
    (type, ids) => {
      if (type === 'list') {
        Api.newList(ids).then((res) => {
          if (res.code === 0 && res.data?.list?.length > 0) {
            let _list = res.data.list;
            let first = _list[0];
            let _percent = percentFun(first.mark_price, first.original_price);
            dialogs.deeplinkRef.current.show({
              type: 2,
              percent: _percent,
              ids: ids,
              way: type + '/' + ids,
              callBack: () => {
                // AppModule.reportTap('Homepage', '$1gift_bottompop_click');
                navigation.navigate('NewList', {
                  ids: ids,
                  way: type + '/' + ids,
                  path: PATH_DEEPLINK,
                });
              },
            });
          }
        });
      } else {
        ids = parseInt(ids);

        if (type === 'mystery') {
          Api.luckyBagDetail(ids).then((res) => {
            let _percent = percentFun(
              res.data.mark_price,
              res.data.original_price,
            );
            dialogs.deeplinkRef.current.show({
              type: 1,
              percent: _percent,
              price: res.data.mark_price,
              ids: ids,
              way: type + '/' + ids,
              callBack: () => {
                MysteryRouter.navigate({productId: ids});
              },
            });
          });
        } else if (type === 'offers') {
          Api.onlyOneDetail(ids).then((res) => {
            let _percent = percentFun(
              res.data.mark_price,
              res.data.original_price,
            );
            dialogs.deeplinkRef.current.show({
              type: 1,
              percent: _percent,
              price: res.data.mark_price,
              ids: ids,
              way: type + '/' + ids,
              callBack: () => {
                ProductRouter.navigate({productId: ids});
              },
            });
          });
        }
      }
    },
    [MysteryRouter, ProductRouter, navigation],
  );
  useEffect(() => {
    let {ids, type} = getInitData();
    goDirection(type, ids);
  }, [getInitData, goDirection]);

  useEffect(() => {
    // 进入首页前判断是否显示回购
    AppModule.hideSplash().then(actionOnLaunch);
    firstLoadReport().catch();
  }, [actionOnLaunch]);

  const firstLoadReport = async () => {
    if (await AsyncStorage.getItem('ld_app_first_load')) {
      return;
    }
    AppModule.reportGeneral('app_luckydeal', 'ld_app_first_load');
    await AsyncStorage.setItem('ld_app_first_load', 'true');
  };
  return null;
}
