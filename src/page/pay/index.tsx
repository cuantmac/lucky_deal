import {
  AisaBillPayInfo,
  CouponDetail,
  PacyPayInfo,
} from '@luckydeal/api-common';
import {CommonApi} from '@src/apis';
import {OUT_DELIVERY_ADDRESS} from '@src/constants/constants';
import {
  ORDER_TYPE_ENUM,
  PAY_METHOD_ENUM,
  PRODUCT_CATEGPRY_TYPE,
  SHIPPING_METHOD_ENUM,
  USE_COUPON_ENUM,
} from '@src/constants/enum';
import {ErrorMsg, Message} from '@src/helper/message';
import {ReduxRootState} from '@src/redux';
import React, {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {unstable_batchedUpdates} from 'react-dom';
import {useSelector} from 'react-redux';
import {useAddress} from './widgets/useAddress';
import {usePayData} from './widgets/usePayData';
import {
  createBagOrder,
  createCartOrder,
  createOfferOrder,
  orderPay,
} from './widgets';
import {useNavigationParams} from '@src/hooks/useNavigationParams';
import {
  goback,
  OrderStatusCheckRoute,
  PacypayRoute,
  PayRoute,
  PayRouteParams,
  ProxyOrderListRoute,
} from '@src/routes';
import {
  ScrollView,
  AppStateStatus,
  AppState,
  DeviceEventEmitter,
  StatusBar,
} from 'react-native';
import {ShippingMethod} from './widgets/shippingMethod';
import {PayMethod} from './widgets/payMethod';
import {ApplyCoupon} from './widgets/applyCoupon';
import {ProductDisplay} from './widgets/productDisplay';
import {convertAmountUS, createStyleSheet, isWeb} from '@src/helper/helper';
import {PayInfoItem} from './widgets/payInfoItem';
import {AddressSelect} from './widgets/addressSelect';
import {useNavigationHeader} from '@src/widgets/navigationHeader';
import {PageStatusControl} from '@src/widgets/pageStatusControl';
import {PayModuleContainer} from './widgets/payModuleContainer';
import {Space} from '@src/widgets/space';
import {OrderNote, OrderNoteRef} from './widgets/orderNote';
import {PayInfoFooter} from './widgets/payInfoFooter';
import {PayBottomAction} from './widgets/payBottomAction';
import {TimerProvider} from '@src/widgets/timer';
import {SubmitForm, SubmitFormRef} from '@src/widgets/submitForm';
import {openAisaBillPay, openPayPalUrl} from '@src/helper/nativeBridge';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/core';
import {PayInfoOrderTimer} from './widgets/payInfoOrderTimer';
import {
  CheckProductDialog,
  CheckProductDialogProps,
  CheckProductDialogRef,
} from '@src/widgets/dialogs/checkProductDialog';

const isOrder = (params: ValueString<PayRouteParams>) => {
  return !!params.orderId;
};

const isCart = (params: ValueString<PayRouteParams>) => {
  return !params.productId && !params.orderId;
};

const isOffersOrMystery = (params: ValueString<PayRouteParams>) => {
  return !!params.productId;
};

const isOffers = (params: ValueString<PayRouteParams>) => {
  if (params.productType) {
    const type = +params.productType;
    return (
      type === PRODUCT_CATEGPRY_TYPE.OFFERS ||
      type === PRODUCT_CATEGPRY_TYPE.VIP
    );
  }
  return false;
};

const isMystery = (params: ValueString<PayRouteParams>) => {
  if (isOffersOrMystery(params)) {
    return !isOffers(params);
  }
  return false;
};

/**
 * 该页面处理选择paypal 支付的时候，用户可以无需登录即可支付，支付完成后填写收货地址信息；
 * pacypay 支付的时候必须先登录填地址（pacypay 支付需要邮箱）。
 * @returns
 */
const Pay: FC = () => {
  const {token} = useSelector(({persist}: ReduxRootState) => ({
    token: persist.persistAuth.token,
  }));

  const query = useNavigationParams<PayRouteParams>();
  const productId = query.productId ? +query.productId : undefined;
  // sku参数可能为string ｜ string[]
  const skuList = useMemo(() => {
    if (query.sku) {
      return [query.sku];
    }
    return [];
  }, [query.sku]);
  // 处理商品类型的数据类型
  const productType = query.productType ? +query.productType : undefined;
  // 记录orderId
  const orderCacheData = useRef({orderId: ''}).current;

  // 记录直购的商品数量
  const [qty, setQty] = useState(query.qty ? +query.qty : 1);
  // 记录寄送方式 使用了新的物流方式，新版本固定使用NEW_SHIP;
  const shippingMethod = SHIPPING_METHOD_ENUM.NEW_SHIP;
  const [logisticsChannelId, setLogisticsChannelId] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PAY_METHOD_ENUM>(
    PAY_METHOD_ENUM.PAYPAL,
  );
  // 优惠券 仅仅是用来触发 useOrderData 数据更新
  // 存在 coupon 值为空但使用优惠券的情况， 例如购物车过来 会默认使用优惠券
  // 当值为 USE_COUPON_ENUM.NOT_USE 表示不使用优惠券
  const [coupon, setCoupon] = useState<CouponDetail | USE_COUPON_ENUM>(
    USE_COUPON_ENUM.DEFAULT,
  );
  const [couponCode, setCouponCode] = useState<string>();
  const cartList = useMemo(() => {
    return query.cartIds?.split('-').map((val) => +val) || [];
  }, [query.cartIds]);
  const usePayDataParams = {
    productId,
    productType,
    qty,
    shippingMethod,
    skuList,
    orderId: query.orderId,
    coupon,
    logisticsChannelId,
    isCart: isCart(query),
    cartList,
    couponCode,
  };

  // 获取页面的渲染数据 内部处理了直购、购物车购买、订单付款数据
  const [loading, orderData, couponLists, cartIds, update] = usePayData(
    usePayDataParams,
  );
  // 获取用户的寄送地址
  const [addressLoading, address] = useAddress(
    orderData?.selectedAddress?.user_address_id,
  );

  const textareaRef = useRef<OrderNoteRef>(null);
  const submitFormRef = useRef<SubmitFormRef>(null);
  const asiaBillSuccessRef = useRef(false);
  const checkProductDialogRef = useRef<CheckProductDialogRef>(null);

  const navigation = useNavigation();
  const ProxyOrderListRouter = ProxyOrderListRoute.useExtraProxyRouteLink();
  const PacypayRouter = PacypayRoute.useRouteLink();
  const PayRouter = PayRoute.useRouteLink();

  const goCardPay = useCallback(() => {
    // console.log('goCardPay');
  }, []);

  const goPacyPay = useCallback(
    (url: string, body: PacyPayInfo) => {
      if (isWeb()) {
        submitFormRef.current?.submit(url, body as Record<string, string>, {
          replace: true,
        });
      } else {
        PacypayRouter.navigate({...body, pay_url: url});
      }
    },
    [PacypayRouter],
  );

  const standardPay = useCallback(
    (url: string) => {
      if (isWeb()) {
        window.location.replace(url);
      } else {
        address && openPayPalUrl(url, address);
      }
    },
    [address],
  );

  // 根据支付方式 和 订单id 自动跳转相应的支付方式
  const paySelector = useCallback(
    // eslint-disable-next-line no-shadow
    async (payMethod: PAY_METHOD_ENUM, orderId: string, returnUrl: string) => {
      const orderPayData = await orderPay(
        payMethod,
        orderId,
        encodeURIComponent(returnUrl),
      );
      if (orderPayData?.payMethod === PAY_METHOD_ENUM.CREDIT_CARD) {
        goCardPay();
        return;
      }
      if (orderPayData?.payMethod === PAY_METHOD_ENUM.PAY_PACY) {
        if (orderPayData.url && orderPayData.body) {
          goPacyPay(orderPayData.url, orderPayData.body as PacyPayInfo);
        }
        return;
      }
      if (orderPayData?.payMethod === PAY_METHOD_ENUM.ASIA_BILL) {
        openAisaBillPay(
          orderPayData.body as AisaBillPayInfo,
          (status: boolean) => {
            asiaBillSuccessRef.current = status;
          },
        );
        return;
      }

      if (orderPayData.url) {
        standardPay(orderPayData.url);
      }
    },
    [goCardPay, goPacyPay, standardPay],
  );

  const createReturnUrl = useCallback((orderId: string) => {
    return isWeb()
      ? window.location.origin +
          OrderStatusCheckRoute.path +
          '?orderId=' +
          orderId
      : '';
  }, []);

  const handleLoginPay = useCallback(
    async (addressId: number, orderNote: string) => {
      Message.loading();
      // 直购创建订单
      if (
        isOffers(query) &&
        productId !== undefined &&
        productType !== undefined
      ) {
        try {
          const res = await createOfferOrder(
            productId,
            productType,
            addressId,
            skuList,
            qty,
            shippingMethod,
            orderNote,
            orderData?.coupon,
            logisticsChannelId,
          );
          orderCacheData.orderId = res.data.order_info.order_id;
          await paySelector(
            payMethod,
            orderCacheData.orderId,
            createReturnUrl(orderCacheData.orderId),
          );
        } catch (e) {
          if (e instanceof ErrorMsg) {
            if (e.code === 9043) {
              await Message.toast('Buy too much');
              return;
            }
          }
          await Message.toast(e);
        }
        return;
      }

      // 福袋创建订单
      if (
        isMystery(query) &&
        productId !== undefined &&
        productType !== undefined
      ) {
        try {
          const res = await createBagOrder(
            productId,
            productType,
            addressId,
            skuList,
            qty,
            shippingMethod,
            orderNote,
            orderData?.coupon,
            logisticsChannelId,
          );
          orderCacheData.orderId = res.data.order_info.order_id;
          await paySelector(
            payMethod,
            orderCacheData.orderId,
            createReturnUrl(orderCacheData.orderId),
          );
        } catch (e) {
          if (e instanceof ErrorMsg) {
            if (e.code === 9043) {
              await Message.toast('Buy too much');
              return;
            }
          }
          await Message.toast(e);
        }
        return;
      }

      // 购物车创建订单
      if (isCart(query) && cartIds) {
        try {
          const res = await createCartOrder(
            cartIds,
            addressId,
            shippingMethod,
            orderNote,
            orderData?.coupon,
            logisticsChannelId,
          );
          if (res.data.order_no) {
            orderCacheData.orderId = res.data.order_no;
            await paySelector(
              payMethod,
              orderCacheData.orderId,
              createReturnUrl(orderCacheData.orderId),
            );
          }
        } catch (e) {
          await Message.toast(e);
        }
        return;
      }

      // 订单支付
      if (isOrder(query) && query.orderId) {
        const {orderId} = query;
        orderCacheData.orderId = orderId;
        try {
          await CommonApi.orderAddressUpdateUsingPOST({
            order_note: orderNote,
            order_id: orderId,
            order_type: 0,
            user_address_id: addressId,
          });
          await paySelector(
            payMethod,
            orderCacheData.orderId,
            createReturnUrl(orderCacheData.orderId),
          );
        } catch (e) {
          await Message.toast(e);
        }
      }
    },
    [
      cartIds,
      createReturnUrl,
      logisticsChannelId,
      orderCacheData.orderId,
      orderData,
      payMethod,
      paySelector,
      productId,
      productType,
      qty,
      query,
      shippingMethod,
      skuList,
    ],
  );

  const handleContinuePay = useCallback(async () => {
    const orderNote = textareaRef.current?.getContent() || '';
    if (!address) {
      Message.toast('Please fill in the address');
      return;
    }
    if (!payMethod) {
      Message.toast('Please select pay method');
      return;
    }
    if (!isOrder(query)) {
      if (OUT_DELIVERY_ADDRESS.includes(address.state.toUpperCase().trim())) {
        Message.toast('Your address cannot be shipped.');
        return;
      }
    }
    try {
      if (isCart(query)) {
        await checkProductDialogRef.current?.checkCarts(
          cartList,
          orderData?.coupon?.coupon_id,
        );
      }
      if (isOffersOrMystery(query)) {
        await checkProductDialogRef.current?.checkProduct(
          orderData?.orderList[0]?.productList[0],
          orderData?.coupon?.coupon_id,
        );
      }
      await handleLoginPay(address.address_id, orderNote);
    } catch (e) {
    } finally {
      Message.hide();
    }
  }, [address, cartList, handleLoginPay, orderData, payMethod, query]);

  const handleCartDeleteSuccess = useCallback<
    NonNullable<CheckProductDialogProps['onCartDeleteSuccess']>
  >(
    (ids) => {
      if (ids.length) {
        PayRouter.replace({cartIds: ids.join('-')});
      } else {
        goback();
      }
    },
    [PayRouter],
  );

  const handleProductDeleteSuccess = useCallback(() => {
    goback();
  }, []);

  const handleCouponExpire = useCallback(() => {
    unstable_batchedUpdates(() => {
      setCoupon(USE_COUPON_ENUM.NOT_USE);
      setCouponCode(undefined);
    });
  }, []);

  const handlePriceExpire = useCallback(() => {
    update && update();
  }, [update]);

  // 取消订单
  const handleOrderCancelPress = useCallback(async () => {
    if (isOrder(query) && query.orderId) {
      try {
        Message.loading();
        await CommonApi.orderCancelUsingPOST({
          order_id: query.orderId,
          order_type: 0,
        });
        Message.hide();
        goback();
      } catch (e) {
        Message.toast(e);
      }
    }
  }, [query]);

  const handleChangeLogisticsChannelWay = (channleId: number) => {
    setLogisticsChannelId(channleId);
  };

  const handleOnRemoveCoupon = useCallback(() => {
    unstable_batchedUpdates(() => {
      setCoupon(USE_COUPON_ENUM.NOT_USE);
      setCouponCode(undefined);
    });
  }, [setCoupon, setCouponCode]);

  const handleOnApplyCoupon = useCallback(
    (val: CouponDetail) => {
      unstable_batchedUpdates(() => {
        setCouponCode(undefined);
        setCoupon(val);
      });
    },
    [setCoupon],
  );

  const handleOnApplyCode = useCallback(
    (code: string) => {
      unstable_batchedUpdates(() => {
        setCoupon(USE_COUPON_ENUM.DEFAULT);
        setCouponCode(code);
      });
    },
    [setCoupon, setCouponCode],
  );

  useNavigationHeader({
    title: 'Order Confirmation',
  });

  useEffect(() => {
    if (orderData && loading) {
      Message.loading();
    }
    if (orderData && !loading) {
      Message.hide();
    }
    return () => {
      Message.hide();
    };
  }, [loading, orderData]);

  // 设置默认选中的物流方式
  useEffect(() => {
    if (
      orderData?.logisticsChannel &&
      orderData?.logisticsChannel?.length > 0
    ) {
      const selectLogisticsChannel = orderData.logisticsChannel.find(
        (item) => item.is_select,
      );
      setLogisticsChannelId(selectLogisticsChannel?.id || 0);
    }
  }, [orderData, setLogisticsChannelId]);

  // 检查订单状态
  let maxRetryCount = 5;
  let retryCount = 1;
  const interval = 2 * 1000;
  const checkOrderStatus = useCallback(async () => {
    const orderId = orderCacheData.orderId;
    if (!orderId) {
      return;
    }
    Message.loading();
    try {
      const res = await CommonApi.orderDetailV2UsingPOST({
        order_no: orderId,
      });
      if (res.data) {
        const detailData = res.data;

        if (detailData.order_status === 1) {
          // 支付成功后 确保栈中不存在订单确认页 和 重复的 Orders
          if (replaceCurrentPage(navigation as any)) {
            ProxyOrderListRouter.replace(
              {
                orderStatus: ORDER_TYPE_ENUM.ALL,
              },
              {
                type: ORDER_TYPE_ENUM.ALL,
              },
            );
          } else {
            ProxyOrderListRouter.navigate(
              {
                orderStatus: ORDER_TYPE_ENUM.ALL,
              },
              {
                type: ORDER_TYPE_ENUM.ALL,
              },
            );
          }
        } else {
          if (
            payMethod === PAY_METHOD_ENUM.ASIA_BILL &&
            asiaBillSuccessRef.current
          ) {
            if (retryCount < maxRetryCount) {
              retryCount++;
              setTimeout(() => {
                checkOrderStatus();
              }, interval);
              return;
            }
          }
          PayRouter.replace({
            orderId: orderId,
          });
        }
      }
    } finally {
      Message.hide();
    }
  }, [
    PayRouter,
    ProxyOrderListRouter,
    interval,
    maxRetryCount,
    navigation,
    orderCacheData.orderId,
    payMethod,
    retryCount,
  ]);

  //【APP】检查订单状态 修改当前页面状态或跳转订单列表
  useEffect(() => {
    if (isWeb()) {
      return;
    }
    // 信用卡支付完成后检查
    const subscriber = DeviceEventEmitter.addListener(
      'CHECK_ORDER_STATUS',
      checkOrderStatus,
    );
    // paypal支付完成后检查---ios
    const paypalBackActionFun = DeviceEventEmitter.addListener(
      'PaypalBackAction',
      checkOrderStatus,
    );
    // paypal支付完成后检查---android
    const listener = (status: AppStateStatus) => {
      if (status === 'active') {
        if (
          payMethod === PAY_METHOD_ENUM.ASIA_BILL &&
          asiaBillSuccessRef.current
        ) {
          Message.loading();
          setTimeout(() => {
            checkOrderStatus();
          }, interval);
        } else {
          checkOrderStatus();
        }
      }
    };
    AppState.addEventListener('change', listener);
    return () => {
      AppState.removeEventListener('change', listener);
      subscriber.remove();
      paypalBackActionFun.remove();
    };
  }, [checkOrderStatus, interval, payMethod]);

  // 是否是拆单情况
  const isSplit = orderData ? orderData.isSplit : false;
  const shippingDiscount =
    orderData?.logisticsChannel?.find(({id}) => id === logisticsChannelId)
      ?.free_price || 0;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={'white'} />
      <TimerProvider>
        <PageStatusControl hasData={!!orderData} loading={loading}>
          {orderData && (
            <>
              <ScrollView>
                <PayInfoOrderTimer expireTime={orderData.expireTime} />
                <AddressSelect
                  disabled={isOrder(query)}
                  address={address}
                  loading={addressLoading}
                />
                {isOrder(query) || (
                  <ShippingMethod
                    logisticsChannel={orderData.logisticsChannel}
                    onChange={handleChangeLogisticsChannelWay}
                  />
                )}
                <PayMethod method={payMethod} onChange={setPayMethod} />
                {!isOrder(query) && token && (
                  <ApplyCoupon
                    onRefresh={() => {
                      update && update();
                    }}
                    params={usePayDataParams}
                    onApplyCode={handleOnApplyCode}
                    onApplyCoupon={handleOnApplyCoupon}
                    onRemoveCoupon={handleOnRemoveCoupon}
                    coupon={orderData.coupon}
                    avalidCouponList={couponLists.couponList}
                    notAvalidCouponList={couponLists.notAvailableCouponList}
                  />
                )}
                {orderData.orderList.map((order, index) => {
                  return (
                    <Fragment key={index}>
                      <ProductDisplay
                        productList={order.productList}
                        onQtyChange={setQty}
                        enableEditQty={isOffersOrMystery(query)}
                      />
                      <PayModuleContainer>
                        <PayInfoItem
                          title={'Subtotal'}
                          text={convertAmountUS(order.subTotalPrice)}
                        />
                        <PayInfoItem
                          textStyle={{
                            color:
                              order.subTotalDeliveryFee <= 0
                                ? '#D0011A'
                                : '#222',
                          }}
                          title={'Shipping fee'}
                          text={convertAmountUS(
                            order.subTotalDeliveryFee <= 0
                              ? order.subTotalDeliveryFee
                              : order.subTotalDeliveryFee + shippingDiscount,
                          )}
                        />
                        <PayInfoItem
                          title={'Tax fee'}
                          textStyle={{
                            color:
                              order.subTotalTaxFee <= 0 ? '#D0011A' : '#222',
                          }}
                          text={convertAmountUS(order.subTotalTaxFee)}
                        />

                        {order.subTotalDeliveryFee > 0 &&
                          shippingDiscount > 0 && (
                            <PayInfoItem
                              textStyle={PayStyles.discountText}
                              title="Shipping discount"
                              text={convertAmountUS(shippingDiscount, true)}
                            />
                          )}

                        {!!orderData.productDiscountPrice && (
                          <PayInfoItem
                            textStyle={PayStyles.discountText}
                            title={'Promo discount'}
                            text={convertAmountUS(
                              orderData.productDiscountPrice,
                              true,
                            )}
                          />
                        )}

                        {order.couponAmount > 0 && (
                          <PayInfoItem
                            title="Coupon"
                            textStyle={PayStyles.discountText}
                            text={convertAmountUS(order.couponAmount, true)}
                          />
                        )}
                        <Space height={1} backgroundColor="#e5e5e5" />
                        <PayInfoItem
                          titleStyle={PayStyles.totalText}
                          textStyle={PayStyles.totalText}
                          title={'Total'}
                          text={`${convertAmountUS(order.total)}`}
                        />
                      </PayModuleContainer>
                    </Fragment>
                  );
                })}
                <OrderNote value={orderData.order_note} ref={textareaRef} />
                <PayInfoFooter />
              </ScrollView>
              <PayBottomAction
                onCancelPress={handleOrderCancelPress}
                onPayPress={handleContinuePay}
                total={orderData.orderTotal}
                expireTime={orderData.expireTime}
              />
            </>
          )}
        </PageStatusControl>
        <SubmitForm ref={submitFormRef} />
        {/* 当有商品变动或优惠券失效的时候 刷新当前页面数据  */}
        <CheckProductDialog
          onCartDeleteSuccess={handleCartDeleteSuccess}
          onProductDeleteSuccess={handleProductDeleteSuccess}
          ref={checkProductDialogRef}
          onCouponExpire={handleCouponExpire}
          onPriceExpire={handlePriceExpire}
          onRefresh={update}
        />
      </TimerProvider>
    </>
  );
};

const PayStyles = createStyleSheet({
  discountText: {
    color: '#D0011A',
  },
  totalText: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 12,
  },
});

type PayStackNavigationProp = StackNavigationProp<any, 'Pay'>;

/**
 *
 * 确保栈中不存在订单确认页 和 重复的 Orders
 *
 * 如果栈里面已经有 Orders 则使用 navigate 方式跳转
 * 如果栈里面没有 Orders 则使用 replace 将订单确认页替换成 Orders
 */
export function replaceCurrentPage(
  navigarion: PayStackNavigationProp,
): boolean {
  const routeStack = navigarion.dangerouslyGetState();
  const routes = routeStack.routes;
  let replace = true;
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].name === 'Orders') {
      replace = false;
      break;
    }
  }
  return replace;
}

export default Pay;
