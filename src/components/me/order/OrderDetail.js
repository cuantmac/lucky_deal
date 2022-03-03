import {
  ActivityIndicator,
  DeviceEventEmitter,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {px} from '../../../constants/constants';
import {useIsFocused} from '@react-navigation/core';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import Utils from '../../../utils/Utils';
import AppModule from '../../../../AppModule';
import {PRIMARY} from '../../../constants/colors';
import Api from '../../../Api';
import DeliveryTimeLineInfo from './DeliveryTimeLineInfo';
import {navigationRef, dialogs} from '../../../utils/refs';

import {
  OrderNoteComponent,
  PayInfoHeader,
  PayInfoListItem,
} from '../../pay/PayComponent';
import {useShallowEqualSelector} from '../../../utils/hooks';

import {
  BuyAgainDialog,
  OrderIdComponent,
  PackageComponent,
  OrderStatusRightRender,
  PackageDiaRender,
} from './OrderComponent';
import AlertDialog from '../../dialog/AlertDialog';
import {Space} from '../../common/Space';
import {
  EditAddressRoute,
  EDIT_ADDRESS_TYPE_ENUM,
  MysteryRoute,
  ProductRoute,
  ShopPushRoute,
} from '@src/routes';
import {convertAmountUS} from '@src/helper/helper';

const orderImages = [
  require('../../../assets/order_0.png'),
  require('../../../assets/order_2.png'),
  require('../../../assets/order_2.png'),
  require('../../../assets/order_2.png'),
  require('../../../assets/order_4.png'),
  require('../../../assets/order_5.png'),
  require('../../../assets/order_6.png'),
  require('../../../assets/order_7.png'),
  require('../../../assets/order_8.png'),
  require('../../../assets/order_9.png'),
  require('../../../assets/order_10.png'),
  require('../../../assets/order_11.png'),
  require('../../../assets/order_12.png'),
  require('../../../assets/order_2.png'),
  require('../../../assets/order_5.png'),
];

const orderImageColors = [
  '#D23A52',
  '#A9A9A9',
  '#E37145',
  '#E37145',
  '#64CE5F',
  '#D23A52',
  '#A9A9A9',
  '#E37145',
  '#E37145',
  '#E37145',
  '#64CE5F',
  '#D23A52',
  '#64CE5F',
  '#E37145',
  '#D23A52',
];

export default function ({navigation, route}) {
  const {
    profile: {is_vip},
  } = useShallowEqualSelector((state) => state.deprecatedPersist);
  const focus = useIsFocused();
  const order_id = route.params?.order_id;
  const [goodsData, setGoodsData] = useState({});
  const refreshCallBack = route.params.refreshCallBack;
  const [address, setAddress] = useState({});
  // 打点数据OrderState：采用OrderID+OrderState形式，多个子订单情况下将传递多组
  const [reportOrderStateData, setReportOrderStateData] = useState('');
  const [itemId, setItemId] = useState('');
  const onRefresh = () => {
    refreshCallBack();
  };
  const [loading, setLoading] = useState(false);
  const ProductRouter = ProductRoute.useRouteLink();
  const MysteryRouter = MysteryRoute.useRouteLink();
  const ShopPushRouter = ShopPushRoute.useRouteLink();
  const EditAddressRouter = EditAddressRoute.useRouteLink();

  const goProductDetail = (detail) => {
    AppModule.reportClick('14', '241', {
      ProductID: detail.product_id,
    });
    if (detail.product_status === 0) {
      //下架
      Utils.toastFun('Sorry, this product is out of stock');
    } else if (detail.product_status === 1) {
      //上架 //1 --福袋，2--直购，3--大转盘 4---vip商品
      if (detail.product_type === 1) {
        MysteryRouter.navigate({
          productId: detail.product_id,
        });
      } else if (detail.product_type === 2 || detail.product_type === 4) {
        ProductRouter.navigate({
          productId: detail.product_id,
        });
      }
    }
  };

  // 再次购买
  const goPayComponent = (childId) => {
    AppModule.reportClick('14', '242', {
      OrderID: order_id,
      ChildOrderID: childId,
      OrderType: goodsData.order_type,
    });
    const onCancel = () => {
      AlertDialog.hide();
    };
    const onOk = () => {
      AlertDialog.hide();
      Api.buyAgain(goodsData.order_no, childId).then((res) => {
        if (res.code === 0) {
          AlertDialog.show(
            '',
            'Items added to shopping bag successfully (except sold-out items and super box items)\nPlease check your shopping bag',
            'Yes',
            () => {
              ShopPushRouter.navigate({behavior: 'back'});
            },
            () => {},
            'small',
          );
        } else {
          Utils.toastFun(res.error);
        }
      });
    };
    AlertDialog.showLayout(
      BuyAgainDialog({
        content:
          'Are you sure want to add these items from this order to your shopping bag again?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: onOk,
        onCancel: onCancel,
      }),
    );
  };

  useEffect(() => {
    let sub = DeviceEventEmitter.addListener(
      'CHANGE_ORDER_ADDRESS',
      (user_address_id) => {
        dialogs.loadingDialog.current?.show();
        Api.updateOrder(
          order_id,
          goodsData?.order_type,
          user_address_id,
          goodsData?.order_note,
        ).then((res) => {
          dialogs.loadingDialog.current?.hide();
          if (res.code === 0) {
            fetchOrderDetail();
          }
        });
      },
    );
    return () => {
      sub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus, goodsData, order_id]);

  useEffect(() => {
    if (!focus) {
      dialogs.moreActionRef.current?.hide();
    }
  }, [focus]);
  useEffect(() => {
    fetchOrderDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrderDetail = () => {
    setLoading(true);
    Api.orderDetailV2(order_id).then((res) => {
      if (res.code === 0) {
        if (res.data) {
          setLoading(false);
          setGoodsData(res.data);
          let status = '';
          res.data?.order_items.forEach((item) => {
            let _a = item.order_id || order_id + ':' + item.order_status;
            status += _a.toString();
          });
          // eslint-disable-next-line no-shadow
          const itemId = [];
          res.data?.order_items.forEach(({detail}) => {
            detail.forEach(({item_id}) => {
              item_id !== 0 && itemId.push(itemId);
            });
          });
          setItemId(itemId.join(','));
          setReportOrderStateData(status);
          AppModule.reportShow('14', '137', {
            OrderId: order_id,
            OrderState: status,
            FromPage: 5,
            ProductCat: itemId.join(','),
          });
        }
        if (res.data?.address) {
          setAddress(res.data.address);
        }
      } else {
        setLoading(false);
        Utils.toastFun(res.error);
      }
    });
  };

  const goSelProduct = (sub_order_id) => {
    Api.refundChooseProduct(sub_order_id).then((res) => {
      const list = res.data?.list || [];
      const listRefundable = list.filter((item) => {
        return item.is_allow_refund;
      });
      if (listRefundable.length > 1) {
        navigationRef.current.navigate('ChooseRefundProductList', {
          product_list: list,
          orderCancel: goOrderCancel,
        });
      } else if (listRefundable.length > 0) {
        goOrderCancel(list);
      } else {
        Utils.toastFun('No items could be refunded.');
      }
    });
  };
  const goOrderCancel = (productList) => {
    AppModule.reportClick('14', '330');
    navigationRef.current.navigate('OrderCancel', {
      product_list: productList,
      refresh: fetchOrderDetail,
    });
  };
  // more点击退款按钮
  const onPress = () => {
    AppModule.reportClick('14', '327', {
      FromPage: 5,
      OrderId: order_id,
      OrderState: reportOrderStateData,
      ProductCat: itemId,
    });
    dialogs.moreActionRef?.current?.hide();
    let _list = goodsData.order_items.filter((item) => {
      return item.is_allow_refund;
    });
    let _list2 = _list.map((res, i) => {
      return {
        label: 'Package' + (i + 1) + ':\n' + (res.order_id || order_id),
        value: res.order_id || order_id,
      };
    });

    if (_list2.length > 1) {
      AppModule.reportShow('14', '329');
      AlertDialog.showLayout(
        <PackageDiaRender list={_list2} goOrderCancel={goSelProduct} />,
      );
    } else if (_list2.length > 0) {
      goSelProduct(_list2[0].value);
    } else {
      Utils.toastFun('No items could be refunded.');
    }
  };
  const contact = () => {
    AppModule.reportClick('14', '328');
    dialogs.moreActionRef?.current?.hide();
    navigationRef.current.navigate('CustomerHelp');
  };
  const showMoreFun = () => {
    AppModule.reportClick('14', '326');
    if (dialogs.moreActionRef.current?.isShow()) {
      dialogs.moreActionRef.current?.hide();
    } else {
      dialogs.moreActionRef.current?.showCartMoreAction({
        onPress: onPress,
        contact: contact,
      });
    }
  };

  const changeAddress = () => {
    AlertDialog.hide();
    EditAddressRouter.navigate({
      id: address.user_address_id,
      type: EDIT_ADDRESS_TYPE_ENUM.UPDATE_ORDER,
    });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTintColor: 'black',
      headerStyle: {backgroundColor: 'white'},
      headerTitleAlign: 'center',
      title: 'Order Status',
      headerRight: () => {
        return <OrderStatusRightRender showMore={showMoreFun} />;
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, order_id, goodsData.is_allow_refund, goodsData.order_items]);
  const DisplayDeliveryInfos = ({deliveryInfo}) => {
    return (
      <View>
        {deliveryInfo?.length
          ? deliveryInfo.map(function (item, index) {
              return (
                <DeliveryTimeLineInfo
                  title={'Delivery Info'}
                  address={address}
                  _deliveryInfos={item.list}
                  showTimeLine={true}
                  deliveryOrder={Utils.filterSpecialWords(item.tracking_number)}
                  key={'Delivery' + index}
                  updateAddressCallBack={changeAddress}
                  enableChangeAddress={
                    goodsData?.order_status === 0 ||
                    goodsData?.order_status === 1
                  }
                />
              );
            })
          : null}
      </View>
    );
  };

  const OrderStatusImage = ({order_status}) => {
    let image;
    let color;
    if (order_status < 0 || order_status > 14) {
      image = require('../../../assets/ph.png');
      color = 'red';
    } else {
      image = orderImages[order_status];
      color = orderImageColors[order_status];
    }
    return (
      <View
        style={{
          width: 140 * px,
          height: 140 * px,
          marginLeft: 30 * px,
          marginEnd: 20 * px,
          marginVertical: 45 * px,
          overflow: 'hidden',
          borderRadius: 70 * px,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={image}
          resizeMode={'contain'}
          style={{
            width: 100 * px,
            height: 100 * px,
          }}
        />
      </View>
    );
  };

  const BuyAgain = ({childId}) => {
    return (
      <View style={{backgroundColor: 'white'}}>
        <View
          style={{
            borderRadius: 10 * px,
            borderColor: '#F04A33',
            borderWidth: 2 * px,
            marginHorizontal: 30 * px,
            height: 140 * px,
            marginVertical: 80 * px,
          }}>
          {loading ? (
            <ActivityIndicator color={PRIMARY} />
          ) : (
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                goPayComponent(childId);
              }}>
              <Text
                style={{
                  color: '#F04A33',
                  fontSize: 50 * px,
                  textAlign: 'center',
                  lineHeight: 140 * px,
                }}>
                Buy Again
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const DetailComponent = ({fenbao, data, shipping_method}) => {
    const {logistic, detail} = data;
    let total = {
      order_tax_fee: 0,
      order_delivery_fee: 0,
      subtotal: 0,
      coupon: 0,
      total: 0,
    };
    if (fenbao) {
      detail?.length
        ? detail.forEach((res, i) => {
            total.order_tax_fee += res.order_tax_fee;
            total.order_delivery_fee += res.order_delivery_fee;
            total.subtotal += res.order_price;
            total.coupon += res.coupon;
          })
        : null;
      total.total =
        total.order_tax_fee +
        total.order_delivery_fee +
        total.subtotal -
        total.coupon;
      total.order_discount_price = goodsData.order_discount_price;
    } else {
      total = {
        order_tax_fee: goodsData.order_tax_fee,
        order_delivery_fee: goodsData.order_delivery_fee,
        subtotal: goodsData.subtotal,
        coupon: goodsData.coupon,
        total: goodsData.total,
        order_discount_price: goodsData.order_discount_price,
      };
    }

    const goTrackDetail = () => {
      AppModule.reportClick('14', '339', {
        OrderId: goodsData.order_no,
        ChildOrderId: data.order_id,
        ProductCat: itemId,
      });
      navigationRef.current?.navigate('TrackWebView', {
        trackNumber: logistic[0]?.tracking_number,
      });
    };

    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            marginTop: 30 * px,
          }}>
          <OrderStatusImage order_status={data.order_status} />
          <View style={{flexDirection: 'column', flex: 1}}>
            <Text style={{paddingRight: 20 * px}}>
              {Utils.orderStateText(data.order_status, shipping_method)}
            </Text>
          </View>
        </View>
        <View style={{paddingHorizontal: 20 * px, backgroundColor: 'white'}}>
          <Space height={2} backgroundColor={'#d6d6d6'} />
        </View>
        <DisplayDeliveryInfos deliveryInfo={logistic} />
        <View
          style={{
            backgroundColor: 'white',
            marginTop: 20 * px,
            marginBottom: 20 * px,
            paddingBottom: 10 * px,
          }}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginTop: 20 * px,
              marginLeft: 10,
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#5D5D5D',
                marginLeft: 20 * px,
                fontSize: 36 * px,
              }}>
              Order Items:
            </Text>
            {logistic?.length > 0 && logistic[0].tracking_number?.length > 0 && (
              <TouchableOpacity
                onPress={goTrackDetail}
                style={{
                  height: 60 * px,
                  paddingRight: 30 * px,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 36 * px,
                    textDecorationLine: 'underline',
                    textDecorationStyle: 'solid',
                    textDecorationColor: '#000',
                    marginRight: 15 * px,
                    includeFontPadding: false,
                  }}>
                  Track
                </Text>
                <Image
                  style={{width: 15 * px, height: 25 * px}}
                  resizeMode={'contain'}
                  source={require('../../../assets/icon_right_black.png')}
                />
              </TouchableOpacity>
            )}
          </View>

          {detail?.length > 0
            ? detail.map((item, index) => {
                return (
                  <PayInfoHeader
                    isVip={is_vip && item.product_type === 4}
                    showSaved={false}
                    onPress={() => {
                      goProductDetail(item);
                    }}
                    img={Utils.getImageUri(item.image)}
                    title={item.title}
                    sku={item.sku_info}
                    price={(item.order_price / item.qty / 100.0).toFixed(2)}
                    hideBeforePrice
                    priceBefore={(
                      item.product_price /
                      item.qty /
                      100.0
                    ).toFixed(2)}
                    count={item.qty}
                    showReview={
                      data.order_status === 3 || data.order_status === 4
                    }
                    refund_status={item.refund_status}
                    goReview={() => {
                      goReview(item);
                    }}
                    key={index}
                  />
                );
              })
            : null}
          <PayInfoListItem
            title={'Subtotal'}
            text={convertAmountUS(total.subtotal)}
          />
          <PayInfoListItem
            title={'Shipping fee'}
            text={convertAmountUS(total.order_delivery_fee)}
          />
          <PayInfoListItem
            title={'Tax Fee'}
            text={convertAmountUS(total.order_tax_fee)}
          />
          {total.order_discount_price > 0 ? (
            <PayInfoListItem
              title={'Bundle sale'}
              text={convertAmountUS(total.order_discount_price, true)}
            />
          ) : null}
          {total.coupon > 0 ? (
            <PayInfoListItem
              titleStyle={{color: 'black'}}
              title={'Coupon'}
              text={convertAmountUS(total.coupon, true)}
            />
          ) : null}
          {goodsData.can_user_score > 0 ? (
            <PayInfoListItem
              titleStyle={{color: 'black'}}
              title={'Credits Offset'}
              text={`-US $${(
                goodsData.can_user_score / goodsData.score_rate
              ).toFixed(2)}`}
            />
          ) : null}
          <PayInfoListItem
            titleStyle={{color: 'black'}}
            title={'Total'}
            text={convertAmountUS(total.total)}
          />
        </View>
        {data.buy_again ? <BuyAgain childId={data.order_id} /> : null}
      </>
    );
  };
  const OrderSummaryComponent = () => {
    const {
      subtotal,
      order_delivery_fee,
      order_tax_fee,
      coupon,
      total,
    } = goodsData;
    return (
      <View
        style={{
          backgroundColor: 'white',
          marginBottom: 40 * px,
          paddingBottom: 20 * px,
        }}>
        <Text
          style={{
            fontSize: 40 * px,
            marginHorizontal: 12,
            fontWeight: 'bold',
            height: 100 * px,
            lineHeight: 100 * px,
            borderBottomWidth: 2 * px,
            borderBottomColor: '#F2F2F2',
          }}>
          Order Summary
        </Text>
        <PayInfoListItem
          title={'Subtotal'}
          text={`$${(subtotal / 100.0).toFixed(2)}`}
        />
        <PayInfoListItem
          title={'Delivery Fee'}
          text={`$${(order_delivery_fee / 100.0).toFixed(2)}`}
        />
        <PayInfoListItem
          title={'Tax Fee'}
          text={`$${(order_tax_fee / 100.0).toFixed(2)}`}
        />
        <PayInfoListItem
          titleStyle={{color: 'black'}}
          title={'Coupons'}
          text={`$${(coupon / 100.0).toFixed(2)}`}
          // onPress={goCouponCenter}
        />
        <PayInfoListItem
          titleStyle={{color: 'black'}}
          title={'Total'}
          text={`$${(total / 100.0).toFixed(2)}`}
          // onPress={goCouponCenter}
        />
      </View>
    );
  };

  const goReview = (detail) => {
    AppModule.reportShow('14', '144', {
      OrderId: order_id,
      OrderState: reportOrderStateData,
      FromPage: 5,
      // ChildOrderID: ChildOrderID,
    });
    navigationRef.current.navigate('AddComent', {
      data: detail,
      onGoBack: () => onRefresh(),
      order_id: order_id,
    });
  };
  const fenbao = goodsData?.order_items?.length > 1;

  return loading ? (
    <ActivityIndicator color={PRIMARY} style={{flex: 1}} />
  ) : (
    <ScrollView>
      <OrderIdComponent order_id={goodsData.order_no} />
      {goodsData?.order_items?.length > 0 ? (
        fenbao ? (
          <View>
            {goodsData?.order_items.map((item, i) => {
              return (
                <View key={i}>
                  <PackageComponent package_id={item.order_id} index={i + 1} />
                  <DetailComponent
                    fenbao={fenbao}
                    data={item}
                    shipping_method={goodsData?.shipping_method}
                  />
                </View>
              );
            })}
            <OrderSummaryComponent />
            {goodsData?.order_note ? (
              <OrderNoteComponent
                style={{
                  marginTop: 0,
                  marginHorizontal: 30 * px,
                  marginBottom: 20 * px,
                }}
                noteContent={goodsData?.order_note}
                editable={false}
              />
            ) : null}
          </View>
        ) : (
          <View>
            <DetailComponent
              fenbao={fenbao}
              data={goodsData?.order_items[0]}
              shipping_method={goodsData?.shipping_method}
            />
            {goodsData?.order_note ? (
              <OrderNoteComponent
                style={{
                  marginTop: 0,
                  marginHorizontal: 30 * px,
                  marginBottom: 20 * px,
                }}
                noteContent={goodsData?.order_note}
                editable={false}
              />
            ) : null}
          </View>
        )
      ) : null}
    </ScrollView>
  );
}
