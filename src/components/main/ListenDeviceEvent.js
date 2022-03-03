import {useEffect, useCallback} from 'react';
import {DeviceEventEmitter, Linking} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useBranchDeepLink} from '../../hooks/useBranchDeepLink';
import {useCouponDeeplink} from '../../hooks/useCouponDeepLink';
import {MysteryRoute, ProductRoute} from '../../routes';

export default function ListenDeviceEvent({navigation}) {
  const token = useSelector((state) => state.deprecatedPersist.token);
  const dispatch = useDispatch();
  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();

  const goToProductDetail = useCallback(
    (productId, productType) => {
      if (productType === 2) {
        //1 --福袋，2--直购，3--大转盘
        MysteryRouter.navigate({productId});
      } else if (productType === 1) {
        ProductRouter.navigate({productId});
      }
    },
    [MysteryRouter, ProductRouter],
  );

  // useShowOnly1List();
  useBranchDeepLink();
  useCouponDeeplink();

  useEffect(() => {
    let messageTypeListener = DeviceEventEmitter.addListener(
      'messageType',
      (msg) => {
        console.log('msgJson', msg);
        let msgJson;
        try {
          msgJson = JSON.parse(JSON.parse(msg));
        } catch (e) {}
        if (!msgJson) {
          return;
        }
        //默认主页时，不需要强制登陆页面
        if (!msgJson.push_type || msgJson.push_type === '0') {
          navigation.navigate('Home');
          return;
        }
        if (!token && msgJson.push_type !== '0') {
          navigation.navigate('FBLogin');
          return;
        }
        switch (msgJson.push_type) {
          case '0':
            navigation.navigate('Home');
            break;
          //product detail,虚拟竞拍币详情页面也是这个页面
          case '1':
            console.log('msgJsonauctionDetailStatus' + msg);
            if (msgJson.auction_id) {
              navigation.navigate('AuctionScreen', {
                way: 'push',
                auctionId: parseInt(msgJson.auction_id),
              });
              return;
            }
            navigation.navigate('Home');
            break;
          //order list
          case '2':
            navigation.navigate('Orders');
            break;
          //评价页面
          case '3':
            msgJson.order_id &&
              navigation.navigate('AddComent', {data: msgJson});
            break;
          case '5':
            navigation.navigate('Main');
            break;
          case '6':
            navigation.navigate('CouponCenter');
            break;
          case '100':
            Linking.openURL(msgJson.push_url).catch(console.log);
            break;
          case '1000': //全量/昨日/三日/七日未登录
            navigation.navigate('Main');
            break;
          case '61':
            goToProductDetail(
              parseInt(msgJson.source_id),
              parseInt(msgJson.source),
            );
            break;
          case '62':
            goToProductDetail(
              parseInt(msgJson.source_id),
              parseInt(msgJson.source),
            );
            break;
          case '64':
            navigation.navigate('Main');
            break;
          case '65':
            navigation.navigate('OrderDetail', {
              data: {
                order_id: msgJson.order_no,
                order_type: parseInt(msgJson.order_type),
              },
              refreshCallBack: () => {},
            });
            break;
          case '66':
            dispatch({
              type: 'updatePushCouponCode',
              payload: msgJson.coupon_code,
            });
            navigation.navigate('Main');
            break;
        }
      },
    );
    return () => {
      messageTypeListener && messageTypeListener.remove();
    };
  }, [dispatch, goToProductDetail, navigation, token]);

  return null;
}
