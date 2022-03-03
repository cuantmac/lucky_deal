import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  DeviceEventEmitter,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import {
  CartOrderConfirm,
  LogisticsChannelItemProps,
  OrderDetailData,
  ProductDiscountProps,
  UserAddressList,
  UserOrderConfirm,
} from '../../types/models/order.model';
import {
  AddPurchaseList,
  BagDetail,
  OffersDetail,
} from '../../types/models/product.model';
import {useFetching, useShallowEqualSelector} from '../../utils/hooks';
import Api from '../../Api';
import {useDispatch} from 'react-redux';
import {
  FinalAmount,
  OneDollerReturnCoupon,
  OrderCancelBtn,
  OrderNoteComponent,
  PayBottomButton,
  ScoreUseComponent,
  PayFixedBottomContainer,
  PayInfoFooter,
  PayInfoListItem,
  PayInfoOrderTimer,
  LogisticsMethod,
  usePayHeader,
  usePayInfoChange,
  PayMethod,
} from './PayComponent';
import {
  blackFridayOpen,
  OUT_DELIVERY_ADDRESS,
  px,
} from '../../constants/constants';
import DeliveryInfo from '../common/DeliveryInfo';
import {
  createBagOrder,
  createCartOrder,
  createOfferOrder,
  ORDER_STATUS_ENUM,
  PAGE_FORM_ENUM,
  payNavigateToOrders,
  PRODUCT_TYPE_ENUM,
  USE_COUPON_ENUM,
} from './utils';
import {PAY_METHOD_ENUM, PAY_STYLE_ENUM} from '../../constants/enum';
import {Timer} from '../common/Timer';
import Utils, {orderPay} from '../../utils/Utils';
import {StackNavigationProp} from '@react-navigation/stack';
import {dialogs} from '../../utils/refs';
import AppConfig from '../main/AppConfig';
import AppModule from '../../../AppModule';
import {PRIMARY} from '../../constants/colors';
import {
  REPORT_BRANCH_PAY_STATUS_ENUM,
  REPORT_PAY_ORDER_SOURCE_ENUM,
  REPORT_PAY_STATUS_ENUM,
  REPORT_RECOMMEND_TYPE_ENUM,
} from '../../analysis/reportEnum';
import {
  branchMarketPath,
  branchOrderConfirmShow,
  branchOrderConfirmStatusGeneral,
  branchOrderConfirmStatusGeneralFail,
  branchOrderConfirmStatusGeneralSuccess,
  branchPaySuccessStatus,
  categoryDetailPath,
  oneDollerReportPath,
  payDeliverClick,
  payContinueClick,
  payPath,
  payProductCountClick,
  paySelectPayMethodClick,
  payShow,
  payStatusGeneral,
} from '../../analysis/report';
import {PacyPay} from '../../types/models/pacypay.model';
import {reportData} from '../../constants/reportData';
import {updateProfile} from '../../redux/persistThunkReduces';
import {ApplyCoupon} from './widgets/ApplyCoupon';
import {CouponDetail} from '@luckydeal/api-common';
import {ApplyCouponDialogProps} from '../../widgets/dialogs/applyCouponDialog/ApplyCouponDialog';
import {ProductDisplay} from './widgets/ProductDisplay';
import {
  SoldoutAction,
  SoldoutActionRef,
} from '../../widgets/shopCart/soldoutAction/SoldoutAction';

type ExtraData = {
  category_id: number;
  product_from_page?: string; // 打点
  cate_station?: number; // 打点
  RecommendType?: REPORT_RECOMMEND_TYPE_ENUM; // 打点
  gift_id?: number; //明牌福袋抽奖
  product_type?: number; //产品类型，8为明牌福袋
};
type OrderDataType = {
  orderId: string;
};
type OffersDetailType = OffersDetail.Data & ExtraData;
type BagDetailType = BagDetail.Data & ExtraData;
type ShoppingBagType = {
  ids: number[];
};
type PayComponentProps = {
  shoppingBag?: ShoppingBagType;
  order?: OrderDataType;
  data?: OffersDetailType | BagDetailType;
  selectedAddress?: UserAddressList.List;
  skuInfo?: OrderDetailData.Skuinfo[];
  quantity?: number; // 商品数量
  path?: string;
  wheelIndex?: number;
  from: PAGE_FORM_ENUM;
  way?: string;
  recordId?: number;
  scores?: number;
};
type DiscountListProps = {
  activity_id: number;
  type: string;
};
// ts 类型守卫 判断当前data是直购类型
const isOffers = (
  data: PayComponentProps['data'],
  from: PAGE_FORM_ENUM,
): data is OffersDetailType => {
  if (from === PAGE_FORM_ENUM.OFFERS) {
    return true;
  }
  return false;
};

// ts 类型守卫 判断当前data是福袋类型
const isBag = (
  data: PayComponentProps['data'],
  from: PAGE_FORM_ENUM,
): data is BagDetailType => {
  if (from === PAGE_FORM_ENUM.MYSTERY) {
    return true;
  }
  return false;
};

// ts 类型守卫 判断当前 shoppingBag 有值， 同时说明是购物车过来的
const isCart = (
  shoppingBag: PayComponentProps['shoppingBag'],
): shoppingBag is ShoppingBagType => {
  if (shoppingBag?.ids) {
    return true;
  }
  return false;
};

// ts 类型守卫 判断当前 order 有值， 同时说明是订单过来的
const isOrder = (
  order: PayComponentProps['order'],
  from?: PAGE_FORM_ENUM,
): order is OrderDataType => {
  if (from === PAGE_FORM_ENUM.ORDER) {
    return true;
  }
  if (order?.orderId) {
    return true;
  }
  return false;
};

// 当前界面navigation所有跳转页面及其参数
type NavigationParams = {
  Pay: PayComponentProps;
  ApplyCodeCoupon: undefined;
  Orders: undefined;
  MyWebview: {
    pay_url: string;
    title: string;
    from: string;
  };
  OrderDetail: {
    data: {order_type: number; order_id: string};
  };
  PacyPayWebView: {
    url: string;
    body: PacyPay.PayInfo;
    from: string;
  };
  OneDollarProduct: {
    product_id: number;
    category_id: number;
    cate_station: number;
    path: string;
    product_from_page: number;
    RecommendType: number;
  };
  AddProductList: {
    selectProduct: AddPurchaseList.ProductItem | undefined;
  };
  DiscountList: DiscountListProps;
};

const Pay: FC = () => {
  // 重置首页banner数据
  AppConfig({app_id: 3});

  const navigation = useNavigation<
    StackNavigationProp<NavigationParams, 'Pay'>
  >();
  const dispatch = useDispatch();
  const orderCacheData = useRef({orderId: ''}).current;
  const hasReportShow = useRef(false);
  const soldoutRef = useRef<SoldoutActionRef>(null);
  const route = useRoute<RouteProp<NavigationParams, 'Pay'>>();
  const {oldUser} = useShallowEqualSelector(
    (state: any) => state.deprecatedPersist,
  );

  const payProps = route.params;
  const data = payProps.data;
  const gift_id = 0;
  let {from, path, way, recordId, skuInfo} = payProps;
  // const addProductRef = useRef<ScrollView>();
  // 支付的加载状态
  const [paying, setPaying] = useState(false);
  //是否用积分抵扣
  const [useScores, setUseScores] = useState(0);
  // 取消订单的加载状态
  const [canceling, setCanceling] = useState(false);

  // 寄送方式
  const [shoppingMethod, setShoppingMethod] = useState(0);

  // 支付方式
  const [payMethod, setPayMethod] = useState<PAY_METHOD_ENUM>(
    PAY_METHOD_ENUM.PAY_PACY,
  );

  // 优惠券 仅仅是用来触发 useOrderData 数据更新
  // 存在 coupon 值为空但使用优惠券的情况， 例如购物车过来 会默认使用优惠券
  // 当值为 USE_COUPON_ENUM.NOT_USE 表示不使用优惠券
  const [coupon, setCoupon] = useState<CouponDetail | USE_COUPON_ENUM>(
    USE_COUPON_ENUM.DEFAULT,
  );

  const [couponCode, setCouponCode] = useState<string>();

  let maxRetryCount = 5;
  let retryCount = 1;
  const interval = 2 * 1000;
  const [asiaBillSuccess, setAsiaBillSuccess] = useState<boolean>(false);

  // 直购福袋商品数量
  const [qty, setQty] = useState(payProps.quantity || 1);
  //加价购选定商品
  const [selectProduct, setSelectProduct] = useState<
    AddPurchaseList.ProductItem
  >();

  // 目前将 直购 福袋 订单详情的数据 最终抽象成 Order 数据
  // 分别由 useDirectBuyOrder useOrderDetailBuy useCartBuy 三个hook生成相应的数据
  // useDirectBuyOrder 负责计算 直接购买的相关数据
  // useOrderDetailBuy 负责获取订单详情数据的转换
  // useCartBuy 负责购物车过来相关数据的转换
  const [, orderData, couponLists] = useOrderData(
    payProps,
    qty,
    shoppingMethod,
    gift_id,
    useScores,
    coupon,
    selectProduct?.product_id,
    couponCode,
  );

  const ApplyCouponParams: any = useMemo(
    () => ({
      isCart: isCart(payProps.shoppingBag),
      couponCode,
      coupon,
      shippingMethod: shoppingMethod,
      logisticsChannelId: shoppingMethod,
      productId: isBag(payProps.data, from)
        ? payProps.data.bag_id
        : payProps.data?.product_id,
      productType: payProps.data?.product_type,
      skuList: skuInfo,
      qty,
    }),
    [
      coupon,
      couponCode,
      from,
      payProps.data,
      payProps.shoppingBag,
      qty,
      shoppingMethod,
      skuInfo,
    ],
  );

  const scrollViewRef = useRef<ScrollView>(null);
  const [addressHighLight, setAddressHighLight] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  // 设置订单地址
  // 只有在订单过来时才会有 selectedAddress
  const address = useOrderAddress(
    payProps.selectedAddress || orderData?.selectedAddress,
  );

  // 打点 记录基本数据
  const branchData = branchMarketPath.getData();
  useMemo(() => {
    if (!orderData) {
      return;
    }

    // 收集分类的数据
    payPath.mergeData({
      ProductCat: orderData.itemId || categoryDetailPath.getData().ProductCat,
    });
    //收集app版本号
    payPath.mergeData({
      Version: AppModule.versionCode,
    });
    // 统计基本数据
    if (isBag(payProps.data, from) || isOffers(payProps.data, from)) {
      // eslint-disable-next-line no-shadow
      const {data} = payProps;
      payPath.mergeData({
        CategoryId: data.category_id,
        CateStation: data.cate_station,
        RecommendType: data.RecommendType,
        FromPage:
          data.product_from_page ||
          oneDollerReportPath.getData().product_from_page,
        OrderSource: REPORT_PAY_ORDER_SOURCE_ENUM.BUY_NOW,
      });
    }

    // 购物车 标记 订单来源
    if (isCart(payProps.shoppingBag)) {
      payPath.mergeData({
        OrderSource: REPORT_PAY_ORDER_SOURCE_ENUM.SHOPPING_BAG,
      });
    }

    // 订单 设置订单号 和子订单号
    if (isOrder(payProps.order, from)) {
      const orderId = orderData?.orderId;
      const childOrderIds = orderData.orderList.map(({childOrderId}) => {
        return childOrderId;
      });
      payPath.mergeData({
        OrderId: orderId,
        ChildOrderID: childOrderIds.join(','),
      });
    }

    // 设置product id
    const productIds: number[] = [];
    orderData.orderList.forEach(({productList}) => {
      productList.forEach(({productId}) => {
        productIds.push(productId);
      });
    });
    payPath.mergeData({
      ProductId: productIds.join(','),
    });
  }, [from, orderData, payProps]);

  // 打点 记录支付方式
  useEffect(() => {
    if (payMethod === PAY_METHOD_ENUM.PAYPAL) {
      payPath.mergeData({PayMethod: 0});
    }
    if (payMethod === PAY_METHOD_ENUM.ASIA_BILL) {
      payPath.mergeData({PayMethod: 5});
    }
    if (payMethod === PAY_METHOD_ENUM.PAY_PACY) {
      payPath.mergeData({PayMethod: 4});
    }
    if (payMethod === PAY_METHOD_ENUM.PAY_BOARD) {
      payPath.mergeData({PayMethod: 2});
    }
  }, [payMethod]);
  // 打点 记录物流方式
  useEffect(() => {
    payPath.mergeData({ShippingId: shoppingMethod});
  }, [shoppingMethod]);

  useEffect(() => {
    if (!orderData) {
      return;
    }
    let show =
      orderData &&
      orderData.orderTotal - (selectProduct?.min_price || 0) > 1500;
    if (!show) {
      setSelectProduct(undefined);
    }
  }, [orderData, selectProduct]);

  // 打点 branch
  useEffect(() => {
    branchData.H5PageID &&
      branchOrderConfirmShow.setDataAndReport({
        H5PageID: branchData.H5PageID,
        H5ProductID: branchData.H5ProductID,
      });
  }, [branchData]);

  useEffect(() => {
    if (orderData && !hasReportShow.current) {
      hasReportShow.current = true;
      payShow.pathReporter();
    }
  }, [orderData]);
  useEffect(() => {
    useScores && AppModule.reportClick('28', '475');
  }, [useScores]);

  useEffect(() => {
    if (address?.email) {
      setAddressHighLight(false);
    }
  }, [address]);

  // 设置app header
  usePayHeader();

  // change 寄送方式
  const handleChangeShoppingMethod = useCallback(
    (method: number) => {
      payPath.mergeData({
        ShippingId: shoppingMethod,
      });
      payDeliverClick.pathReporter();
      setShoppingMethod(method);
    },
    [shoppingMethod],
  );

  // change 支付方式
  const handleChangePayMethod = useCallback((method: PAY_METHOD_ENUM) => {
    if (method === PAY_METHOD_ENUM.PAYPAL) {
      payPath.mergeData({PayMethod: 0});
    }
    if (method === PAY_METHOD_ENUM.PAY_BOARD) {
      payPath.mergeData({PayMethod: 2});
    }
    if (method === PAY_METHOD_ENUM.PAY_PACY) {
      payPath.mergeData({PayMethod: 3});
    }
    if (method === PAY_METHOD_ENUM.ASIA_BILL) {
      payPath.mergeData({PayMethod: 5});
    }
    if (method !== PAY_METHOD_ENUM.PAY_PACY) {
      setAddressHighLight(false);
    }
    paySelectPayMethodClick.pathReporter();
    setPayMethod(method);
  }, []);
  //change score使用情况
  const selectCoinFun = () => {
    if (useScores) {
      setUseScores(0);
      payPath.mergeData({UseCredit: 0});
    } else {
      setUseScores(1);
      payPath.mergeData({UseCredit: 1});
    }
  };
  // change 商品数量
  const handleQtyChange = useCallback((num: number) => {
    payProductCountClick.pathReporter();
    setQty(num);
  }, []);

  // 取消订单
  const handleOrderCancelPress = useCallback(async () => {
    if (isOrder(payProps.order, from)) {
      try {
        setCanceling(true);
        const res = await Api.cancelOrder(payProps.order?.orderId, 0);
        if (res.data?.success === 1) {
          //取消订单成功
          DeviceEventEmitter.emit('updateOrdersList');
          orderData?.scoreFree.can_user_score && dispatch(updateProfile());
          navigation.goBack();
        }
      } finally {
        setCanceling(false);
      }
    }
  }, [from, navigation, payProps.order, orderData, dispatch]);

  // 跳转paypal支付
  const paypalPay = useCallback(
    (url) => {
      if (recordId) {
        DeviceEventEmitter.emit('updateSlotList');
      }
      AppModule.openPayPalUrl(url, address);
      dispatch({type: 'bidSucceedOnce', payload: true});
    },
    [address, dispatch, recordId],
  );

  const goPacyPayWebView = useCallback(
    (url: any, body: any) => {
      if (recordId) {
        DeviceEventEmitter.emit('updateSlotList');
      }

      navigation.navigate('PacyPayWebView', {
        url: url,
        body: body,
        from: 'pay',
      });
    },
    [recordId, navigation],
  );
  // 根据支付方式 和 订单id 自动跳转相应的支付方式
  const paySelector = useCallback(
    async (
      // eslint-disable-next-line no-shadow
      payMethod: PAY_METHOD_ENUM,
      orderId: string,
    ) => {
      const orderPayData = await orderPay(payMethod, orderId);
      if (orderPayData?.payMethod === PAY_METHOD_ENUM.PAY_PACY) {
        goPacyPayWebView(orderPayData?.url, orderPayData?.body);
        return;
      } else if (orderPayData?.payMethod === PAY_METHOD_ENUM.ASIA_BILL) {
        AppModule.aisaBillPay(orderPayData.body, (status: boolean) => {
          setAsiaBillSuccess(status);
        });
        return;
      }
      paypalPay(orderPayData?.url);
    },
    [paypalPay, goPacyPayWebView],
  );

  // 支付
  const pay = useCallback(async () => {
    try {
      setPaying(true);
      if (!address) {
        Utils.toastFun('Please fill in the address');
        return;
      }

      if (!payMethod) {
        Utils.toastFun('Please select pay method');
        return;
      }

      if (payMethod === PAY_METHOD_ENUM.PAY_PACY && !address.email) {
        setAddressHighLight(true);
        scrollViewRef.current?.scrollTo({x: 0, y: 0, animated: true});
        return;
      }
      if (from !== 'order') {
        let _address = address.state.toUpperCase().trim();
        if (OUT_DELIVERY_ADDRESS.includes(_address)) {
          Utils.toastFun('Your address cannot be shipped.');
          return;
        }
      }
      //product_type === 8为明牌福袋，product_id需要传gift_id
      // 直购支付
      if (isOffers(data, from)) {
        const res = await createOfferOrder(
          data.product_type === 8 ? data.gift_id || 0 : data.product_id,
          data.category_id,
          address.address_id,
          skuInfo,
          qty,
          orderData?.coupon,
          recordId,
          shoppingMethod,
          orderNote,
          useScores,
          data.product_type === 8 ? data.product_type : 4,
          selectProduct?.product_id || 0,
        );
        if (res.code === 9064) {
          if (oldUser === 1) {
            Utils.toastFun('For new users only');
            navigation.popToTop();
            return;
          }
          return;
        }

        if (res.code === 9043) {
          Utils.toastFun('Buy too much');
          //购买太多
          payNavigateToOrders(navigation)('Orders');
          return;
        }

        if (res.error) {
          Utils.toastFun(res.error);
          return;
        }
        const offerOrderData = res.data;
        orderCacheData.orderId = offerOrderData.order_info.order_id;
        await paySelector(payMethod, orderCacheData.orderId);
        return;
      }

      // 福袋支付
      if (isBag(data, from)) {
        const res = await createBagOrder(
          data.bag_id,
          data.category_id,
          address.address_id,
          skuInfo,
          qty,
          orderData?.coupon,
          recordId,
          shoppingMethod,
          orderNote,
          selectProduct?.product_id || 0,
          gift_id,
          useScores,
        );
        if (res.code === 9043) {
          Utils.toastFun('Buy too much');
          //购买太多
          payNavigateToOrders(navigation)('Orders');
          return;
        }
        if (res.error) {
          Utils.toastFun(res.error);
          return;
        }
        const bagOrderData = res.data;
        orderCacheData.orderId = bagOrderData.order_info.order_id;
        // 记录打点订单id数据
        payPath.mergeData({OrderId: orderCacheData.orderId});
        await paySelector(payMethod, orderCacheData.orderId);
        return;
      }

      // 购物车支付
      if (isCart(payProps.shoppingBag)) {
        const ids = payProps.shoppingBag.ids;
        const res = await createCartOrder(
          ids,
          address.address_id,
          orderData?.coupon,
          shoppingMethod,
          useScores,
          selectProduct?.product_id || 0,
          orderNote,
          gift_id,
        );
        if (res.error) {
          Utils.toastFun(res.error);
          return;
        }
        if (res.data.order_no) {
          orderCacheData.orderId = res.data.order_no;
          // 记录打点订单id数据
          payPath.mergeData({OrderId: orderCacheData.orderId});
          await paySelector(payMethod, orderCacheData.orderId);
          DeviceEventEmitter.emit('updateCartList', {
            needToast: false,
            type: '',
          });
        }
        return;
      }

      // 订单支付
      if (isOrder(payProps.order)) {
        const orderId = payProps.order.orderId;
        orderCacheData.orderId = orderId;
        // 打点 记录订单id数据
        payPath.mergeData({OrderId: orderCacheData.orderId});
        await Api.updateOrder(orderId, 0, address.address_id, orderNote);
        await paySelector(payMethod, orderCacheData.orderId);
      }
    } finally {
      setPaying(false);
      useScores && dispatch(updateProfile());
    }
  }, [
    address,
    payMethod,
    from,
    data,
    payProps.shoppingBag,
    payProps.order,
    skuInfo,
    qty,
    orderData,
    recordId,
    shoppingMethod,
    orderNote,
    orderCacheData.orderId,
    paySelector,
    oldUser,
    navigation,
    gift_id,
    dispatch,
    useScores,
    selectProduct,
  ]);

  // 首单买1元购商品后返券弹框
  const checkoutCouponDialog = useCallback(async () => {
    let couponListRes = await Api.couponList(0, 9);
    if (couponListRes.code === 0) {
      let list = couponListRes?.data?.list || [];
      if (list.length > 0) {
        let _total = 0;
        list.forEach((item) => {
          _total += item.amount;
        });
        DeviceEventEmitter.emit('showCouponDialog', {
          list: list,
          total: _total,
        });
      }
    }
  }, []);

  // 检查订单状态
  const checkOrderStatus = useCallback(async () => {
    const orderId = orderCacheData.orderId;
    if (!orderId) {
      return;
    }
    dialogs.loadingDialog?.current.show();
    try {
      const res = await Api.orderDetailV2(orderId);
      if (res.data) {
        const detailData = res.data;

        if (detailData.order_status === ORDER_STATUS_ENUM.SUCCESS) {
          payPath.mergeData({PayState: REPORT_PAY_STATUS_ENUM.SUCCESS});
          payStatusGeneral.pathReporter();
          if (payMethod === PAY_METHOD_ENUM.ASIA_BILL) {
            let diff = new Date().getTime() - reportData.asiaBillReturnTime;
            AppModule.reportGeneral('101', '1001', {asiaBillResultTime: diff});
          }
          // 打点 branch 支付成功
          if (branchData.H5PageID) {
            branchOrderConfirmStatusGeneral.setDataAndReport({
              OrderID: orderCacheData.orderId,
              PayState: REPORT_BRANCH_PAY_STATUS_ENUM.SUCCESS,
              H5ProductID: branchData.H5ProductID,
              H5PageID: branchData.H5PageID,
            });

            branchOrderConfirmStatusGeneralSuccess.setDataAndReport({
              OrderID: orderCacheData.orderId,
              PayState: REPORT_BRANCH_PAY_STATUS_ENUM.SUCCESS,
              H5ProductID: branchData.H5ProductID,
              H5PageID: branchData.H5PageID,
            });

            branchPaySuccessStatus.setDataAndReport({
              transaction_id: orderCacheData.orderId,
              tax: convertAmount(detailData.order_tax_fee),
              shipping: convertAmount(detailData.order_delivery_fee),
              revenue: convertAmount(detailData.total),
            });
          }

          if (recordId) {
            DeviceEventEmitter.emit('updateSlotList');
          }
          dispatch({
            type: 'setOneDollerCategory',
            payload: null,
          });
          checkoutCouponDialog();
          // 支付成功后 确保栈中不存在订单确认页 和 重复的 Orders
          payNavigateToOrders(navigation)('Orders', {
            showBoxTip: !blackFridayOpen,
            showScratch: blackFridayOpen && detailData.total >= 5,
            orderId: orderId,
            is_pop_vip_copy_writer: detailData.is_pop_vip_copy_writer,
          });
        } else {
          payPath.mergeData({PayState: REPORT_PAY_STATUS_ENUM.FAIL});
          payStatusGeneral.pathReporter();
          if (payMethod === PAY_METHOD_ENUM.ASIA_BILL && asiaBillSuccess) {
            if (retryCount < maxRetryCount) {
              retryCount++;
              setTimeout(() => {
                checkOrderStatus();
              }, interval);
              return;
            }
          }

          // 打点 branch 支付未成功
          if (branchData.H5ProductID) {
            branchOrderConfirmStatusGeneral.setDataAndReport({
              OrderID: orderCacheData.orderId,
              PayState: REPORT_BRANCH_PAY_STATUS_ENUM.FAIL,
              H5ProductID: branchData.H5ProductID,
              H5PageID: branchData.H5PageID,
            });
            branchOrderConfirmStatusGeneralFail.setDataAndReport({
              OrderID: orderCacheData.orderId,
              PayState: REPORT_BRANCH_PAY_STATUS_ENUM.FAIL,
              H5ProductID: branchData.H5ProductID,
              H5PageID: branchData.H5PageID,
            });
          }
        }
      }
    } finally {
      dialogs.loadingDialog?.current.hide();
    }
  }, [
    asiaBillSuccess,
    branchData.H5PageID,
    branchData.H5ProductID,
    checkoutCouponDialog,
    dispatch,
    interval,
    maxRetryCount,
    navigation,
    orderCacheData.orderId,
    payMethod,
    recordId,
    retryCount,
  ]);

  // 支付按钮点击
  const handleContinuePress = useCallback(async () => {
    payContinueClick.pathReporter();
    try {
      setPaying(true);
      if (isCart(payProps.shoppingBag)) {
        await soldoutRef.current?.check();
      }
      pay();
    } catch (error) {
      setPaying(false);
    }
  }, [pay, payProps.shoppingBag]);

  const handleDeleteSuccess = useCallback(() => {
    Api.cartList().then((res) => {
      if (res.data.list?.length) {
      } else {
        navigation.goBack();
      }
    });
  }, [navigation]);

  // 移除优惠码或优惠券
  const handleOnRemoveCoupon = useCallback(() => {
    setCoupon(USE_COUPON_ENUM.NOT_USE);
    setCouponCode(undefined);
  }, [setCoupon]);

  // 使用优惠券
  const handleOnApplyCoupon = useCallback((val: CouponDetail) => {
    setCoupon(val);
  }, []);

  // 使用优惠码
  const handleOnApplyCode = useCallback((code: string) => {
    setCoupon(USE_COUPON_ENUM.DEFAULT);
    setCouponCode(code);
  }, []);

  // 页面聚集检查订单状态
  useEffect(() => {
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
        if (payMethod === PAY_METHOD_ENUM.ASIA_BILL && asiaBillSuccess) {
          dialogs.loadingDialog?.current.show();
          reportData.asiaBillReturnTime = new Date().getTime();
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
  }, [asiaBillSuccess, checkOrderStatus, interval, payMethod]);

  useEffect(() => {
    // 订单过来的付款不限时免运费，免税费提示
    if (orderData && !isOrder(payProps.order, from)) {
      AppModule.reportShow('5', '344', {
        OptionalStatus: orderData.freeShippingFee?.is_free ? 1 : 0,
      });
      if (orderData.logisticsChannel && orderData.logisticsChannel.length > 0) {
        let _selectShippingMethod = orderData.logisticsChannel.find(
          (item) => item.is_select,
        );
        setShoppingMethod(_selectShippingMethod?.id || 0);
      }
    }
  }, [from, orderData, payProps.order]);

  if (!orderData) {
    return <ActivityIndicator color={PRIMARY} style={{flex: 1}} />;
  }

  const shippingDiscount =
    orderData.logisticsChannel?.find((element) => element.is_select)
      ?.free_price || 0;

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle={'dark-content'} />

      <ScrollView style={{flex: 1}} ref={scrollViewRef}>
        <View
          style={{
            marginTop: 30 * px,
            marginBottom: 30,
          }}>
          {/* 订单倒计时 */}
          {from === PAGE_FORM_ENUM.ORDER && (
            <PayInfoOrderTimer expireTime={orderData.expireTime || 0} />
          )}

          {/* 显示地址 */}
          <DeliveryInfo
            address={address}
            showAdd={true}
            page={from}
            path={path}
            data={data}
            way={way}
            highlight={addressHighLight}
          />
          {/* 寄送方式 */}
          {from !== PAGE_FORM_ENUM.ORDER && (
            <LogisticsMethod
              logistic={orderData.logisticsChannel?.find(
                (element) => element.is_select,
              )}
              onChange={handleChangeShoppingMethod}
              method={shoppingMethod}
              logisticsChannel={orderData.logisticsChannel || []}
            />
          )}

          {/* 支付方式 */}
          <PayMethod
            defaultMethod={PAY_METHOD_ENUM.PAY_PACY}
            onChange={handleChangePayMethod}
            payAmount={0}
            payUIStyle={PAY_STYLE_ENUM.CHECK_RIGHT}
            method={payMethod}
          />
          {/* 领取公码优惠券,运费免费则不显示 */}
          {from !== PAGE_FORM_ENUM.ORDER && (
            <ApplyCoupon
              params={ApplyCouponParams}
              onApplyCode={handleOnApplyCode}
              onApplyCoupon={handleOnApplyCoupon}
              onRemoveCoupon={handleOnRemoveCoupon}
              avalidCouponList={couponLists.couponList}
              notAvalidCouponList={couponLists.notAvailableCouponList}
              coupon={orderData.coupon}
            />
          )}
          {/* 积分兑换抵扣现金 */}
          {from !== PAGE_FORM_ENUM.ORDER &&
          orderData?.scoreFree?.can_user_score > 0 ? (
            <ScoreUseComponent
              selectCoinFun={selectCoinFun}
              scores={orderData?.scoreFree}
              useScores={useScores}
            />
          ) : null}
          {orderData.orderList.map((item, index) => {
            return (
              <ProductDisplay
                productList={item.productList}
                onQtyChange={handleQtyChange}
                enableEditQty={
                  from === PAGE_FORM_ENUM.MYSTERY ||
                  from === PAGE_FORM_ENUM.OFFERS
                }
                key={index}>
                <PayInfoListItem
                  title={'Subtotal'}
                  text={Utils.convertAmountUS(item.subTotalPrice)}
                />
                <PayInfoListItem
                  textStyle={{
                    color:
                      item.subTotalDeliveryFee <= 0 ? '#E00404' : '#727272',
                  }}
                  title={'Shipping fee'}
                  text={Utils.convertAmountUS(
                    item.subTotalDeliveryFee <= 0
                      ? item.subTotalDeliveryFee
                      : item.subTotalDeliveryFee + shippingDiscount,
                  )}
                />
                <PayInfoListItem
                  title={'Tax fee'}
                  textStyle={{
                    color: item.subTotalTaxFee <= 0 ? '#E00404' : '#727272',
                  }}
                  text={Utils.convertAmountUS(item.subTotalTaxFee)}
                />

                {item.subTotalDeliveryFee > 0 && shippingDiscount > 0 && (
                  <PayInfoListItem
                    textStyle={{
                      color: '#E00404',
                    }}
                    title="Shipping discount"
                    text={Utils.convertAmountUS(shippingDiscount, true)}
                  />
                )}

                {orderData.product_discount.is_discount ? (
                  <PayInfoListItem
                    textStyle={{
                      color: '#E00404',
                    }}
                    title={'Promo discount'}
                    text={Utils.convertAmountUS(
                      orderData.product_discount.discount_price,
                      true,
                    )}
                  />
                ) : null}

                {item.couponAmount > 0 && (
                  <PayInfoListItem
                    title="Coupon"
                    textStyle={{
                      color: '#E00404',
                    }}
                    text={Utils.convertAmountUS(item.couponAmount, true)}
                  />
                )}

                {useScores ||
                (from === PAGE_FORM_ENUM.ORDER &&
                  orderData.scoreFree.can_user_score > 0) ? (
                  <PayInfoListItem
                    title={'Credits Offset'}
                    text={`-$${
                      orderData?.scoreFree?.can_user_score /
                      orderData?.scoreFree?.score_rate
                    }`}
                  />
                ) : null}
                <PayInfoListItem
                  titleStyle={{
                    fontWeight: 'bold',
                    color: 'black',
                    fontSize: 40 * px,
                  }}
                  textStyle={{
                    fontWeight: 'bold',
                    color: 'black',
                    fontSize: 40 * px,
                  }}
                  title={'Total'}
                  text={`$${convertAmount(item.total)}`}
                />
              </ProductDisplay>
            );
          })}

          <OrderNoteComponent
            editable={true}
            noteContent={orderData?.order_note}
            onChangeText={(value) => {
              setOrderNote(value);
            }}
          />
          {/* footer */}
          <PayInfoFooter />
        </View>
      </ScrollView>
      <PayFixedBottomContainer>
        {orderData?.newUserCouponValue ? (
          <OneDollerReturnCoupon
            amount={orderData.newUserCouponValue / 100.0}
          />
        ) : null}
        <FinalAmount finalPrice={convertAmount(orderData.orderTotal)} />
        {/* 订单界面进来后需要显示订单有效期倒计时 和 订单取消按钮 */}
        {from === PAGE_FORM_ENUM.ORDER && (
          <>
            <Timer targetTime={orderData.expireTime || 0}>
              {(time, hasEnd) => {
                return (
                  <PayBottomButton
                    loading={paying}
                    disabled={hasEnd}
                    onPress={handleContinuePress}
                    text={'PLACE ORDER'}
                  />
                );
              }}
            </Timer>
            <OrderCancelBtn
              loading={canceling}
              onPress={handleOrderCancelPress}
            />
          </>
        )}
        {from !== PAGE_FORM_ENUM.ORDER && (
          <PayBottomButton
            loading={paying}
            onPress={handleContinuePress}
            text={'PLACE ORDER'}
          />
        )}
      </PayFixedBottomContainer>
      <SoldoutAction ref={soldoutRef} onDeleteSuccess={handleDeleteSuccess} />
    </SafeAreaView>
  );
};

// 获取寄送地址
const useOrderAddress = (selectedAddress?: UserAddressList.List) => {
  const [address, setAddress] = useState<UserAddressList.List>();
  const focuse = useIsFocused();
  const {mainAddress} = useShallowEqualSelector<{
    mainAddress: Partial<UserAddressList.List>;
  }>((state: any) => state.deprecatedPersist);
  const [, addressAsyncFunc] = useFetching<UserAddressList.RootObject>(
    Api.addressList,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (focuse) {
      (async () => {
        const selectedAddressItem =
          selectedAddress || ({} as UserAddressList.List);
        const mainAddressItem = mainAddress || {};
        try {
          const res = await addressAsyncFunc();
          if (res.code === 0) {
            const list = res.data?.list || [];
            if (list.length > 0) {
              // 当本地缓存用户地址 仍然需要看本地的地址是否在线上地址列表中
              const findSelectItem = list.find(
                ({address_id}) => address_id === selectedAddressItem.address_id,
              );

              if (findSelectItem) {
                setAddress(findSelectItem);
                return;
              }

              const findMainItem = list.find(
                ({address_id}) => address_id === mainAddressItem.address_id,
              );

              if (findMainItem) {
                setAddress(findMainItem);
                return;
              }

              const preferredAddr = list.find((item) => {
                return item.preferred;
              });
              setAddress(preferredAddr || list[0]);
            } else {
              setAddress(undefined);
            }
          } else {
            setAddress(undefined);
          }
        } catch (error) {
          setAddress(undefined);
        }
      })();
    }
  }, [addressAsyncFunc, dispatch, mainAddress, selectedAddress, focuse]);
  return address;
};
type FreeFeeProps = {
  is_free: boolean;
  free_low_amt: number;
  free_need_amt: number;
};

export interface OrderProduct {
  productId: number; // 商品id
  productImage: string; // 商品图片
  title: string; // 标题
  productPrice: number; // 商品原价
  orderPrice: number; // 优惠后价格
  qty: number; // 商品数量
  skuInfo: OrderDetailData.Skuinfo[]; // sku 信息
  productType?: PRODUCT_TYPE_ENUM; // 商品类型
  maxQty?: number; // 最大购买数量
  minQty?: number; // 最小购买数量
  sku?: string;
}

interface OrderItem {
  subTotalPrice: number; // 子订单 商品总价
  subTotalDeliveryFee: number; // 子订单总运费
  subTotalTaxFee: number; // 子订单总税费
  productList: OrderProduct[]; // 子订单商品列表
  expensesShippingFee: number; // 子订单 普通快递运费
  fastExpressShippingFee: number; // 子订单 速递 运费
  couponAmount: number; // 优惠金额
  total: number; // 子订单总价
  childOrderId?: string; // 订单过来时需要childOrderId, 目前只在打点时用到
  freeShippingFee?: FreeFeeProps; //免运费情况
  freeTaxFee?: FreeFeeProps; //免税费情况
  newUserCouponValue?: number;
  // scoreFree: scoreProps;
}
type scoreProps = {
  can_user_score: number;
  score_rate: number;
};
interface Order {
  product_discount: ProductDiscountProps;
  // selectedCoupon: CouponDetail;
  scoreFree: scoreProps;
  newUserCouponValue: number; //一元购订单返券金额
  orderTotal: number; // 订单总价
  totalOrderSubTotalPrice: number; // 订单商品总价
  totalOrderDeliveryFee: number; // 订单总运费
  totalOrderTaxFee: number; // 总订单税费
  totalExpensesShippingFee: number; // 普通快递 总运费
  totalFastExpressShippingFee: number; // 速递 总运费
  coupon?: CouponDetail; // 优惠信息 订单过来时 无优惠券详细信息
  orderList: OrderItem[]; // 订单列表
  isSplit: boolean; // 是否是拆单
  expireTime?: number; // 订单过来时需要
  totalCouponAmount?: number; // 订单详情页时只有优惠金额
  selectedAddress?: UserAddressList.List; // 订单过来会默认设置好 address
  orderId?: string; // 订单过来时需要orderId， 目前只在打点时用到
  freeShippingFee?: FreeFeeProps | any; //免运费情况
  freeTaxFee?: FreeFeeProps | any; //免税费情况
  order_note?: string; //订单备注
  itemId?: string; // 商品在分类中的id
  logisticsChannel?: LogisticsChannelItemProps[];
}

// 生成订单确认的数据
const useOrderData = (
  payProps: PayComponentProps,
  count: number,
  shoppingMethod: number,
  gift_id: number,
  useScores: number,
  coupon?: CouponDetail | USE_COUPON_ENUM,
  selectProductId?: number,
  couponCode?: string,
) => {
  const [
    directLoading,
    directOrderData,
    directCouponLists,
    directUpdateDirectBuyInfo,
  ] = useDirectBuyOrder(
    payProps,
    count,
    shoppingMethod,
    gift_id,
    useScores,
    coupon,
    selectProductId,
    couponCode,
  );
  const [
    orderDetailLoading,
    orderDetailOrderData,
    orderDetailCouponLists,
    orderDetailUpdateOrderDetailBuyInfo,
  ] = useOrderDetailBuy(payProps);
  const [
    cartLoading,
    cartOrderData,
    cartCouponLists,
    cartUpdateCartBuyInfo,
  ] = useCartBuy(
    payProps,
    shoppingMethod,
    gift_id,
    useScores,
    coupon,
    selectProductId,
    couponCode,
  );
  const emptyCoupons = useRef({
    codeCouponList: [],
    couponList: [],
    notAvailableCouponList: [],
  }).current;
  const emptyCallback = useCallback(async () => {}, []);
  if (directOrderData) {
    return [
      directLoading,
      directOrderData,
      directCouponLists,
      directUpdateDirectBuyInfo,
    ] as const;
  }

  if (orderDetailOrderData) {
    return [
      orderDetailLoading,
      orderDetailOrderData,
      orderDetailCouponLists,
      orderDetailUpdateOrderDetailBuyInfo,
    ] as const;
  }

  if (cartOrderData) {
    return [
      cartLoading,
      cartOrderData,
      cartCouponLists,
      cartUpdateCartBuyInfo,
    ] as const;
  }
  return [
    directLoading || orderDetailLoading || cartLoading,
    undefined,
    emptyCoupons,
    emptyCallback,
    undefined,
  ] as const;
};

// 订单详情
const useOrderDetailBuy = (payProps: PayComponentProps) => {
  const [loading, getOrderDetail, res] = useFetching<
    OrderDetailData.RootObject
  >(Api.orderDetailV2);
  const couponLists = useRef({
    codeCouponList: [],
    couponList: [],
    notAvailableCouponList: [],
  }).current;

  const updateOrderDetailBuyInfo = useCallback(async () => {
    const orderId = payProps.order?.orderId;
    if (!orderId) {
      return;
    }
    await getOrderDetail(orderId);
  }, [getOrderDetail, payProps]);
  useEffect(() => {
    updateOrderDetailBuyInfo();
  }, [updateOrderDetailBuyInfo]);

  const data = useMemo(() => {
    if (res && res.data) {
      return res.data;
    }
  }, [res]);

  const orderData = useMemo<Order | undefined>(() => {
    if (!data) {
      return;
    }
    const {
      total,
      subtotal,
      order_delivery_fee,
      order_tax_fee,
      expire_time,
      order_items,
      new_user_coupon_value,
      can_user_score,
    } = data;
    const itemId: number[] = [];

    const isSplit = data.order_items.length > 1;
    const orderList = order_items.map<OrderItem>(({order_id, detail}) => {
      // AppModule.log('-----item', detail);
      let subTotalPrice = 0;
      let subTotalDeliveryFee = 0;
      let subTotalTaxFee = 0;
      let couponAmount = 0;
      // eslint-disable-next-line no-shadow
      let total = 0;
      const productList = detail.map<OrderProduct>(
        ({
          order_price, // 后台已经乘以 qty
          qty,
          // eslint-disable-next-line no-shadow
          order_delivery_fee,
          // eslint-disable-next-line no-shadow
          order_tax_fee, // 后台已经乘以 qty
          coupon,
          product_id,
          image,
          title,
          product_price, // 后台已经乘以 qty
          sku_info,
          category_id,
          item_id,
        }) => {
          subTotalPrice += order_price;
          subTotalDeliveryFee += order_delivery_fee;
          subTotalTaxFee += order_tax_fee;
          couponAmount += coupon;
          item_id !== 0 && itemId.push(item_id);
          return {
            productId: product_id,
            productImage: image,
            title,
            productPrice: product_price / qty,
            orderPrice: order_price / qty,
            qty,
            skuInfo: sku_info || [],
            productType: category_id,
          };
        },
      );

      total =
        subTotalPrice +
        subTotalDeliveryFee +
        subTotalTaxFee -
        couponAmount -
        data.order_discount_price -
        can_user_score;
      // (isSplit ? 0 : couponAmount);
      return {
        childOrderId: order_id,
        productList,
        subTotalPrice,
        couponAmount,
        subTotalTaxFee,
        subTotalDeliveryFee,
        fastExpressShippingFee: 0,
        expensesShippingFee: 0,
        total,
      };
    });
    return {
      orderId: data.order_no,
      totalCouponAmount: data.coupon,
      orderTotal: total,
      totalOrderSubTotalPrice: subtotal,
      totalOrderDeliveryFee: order_delivery_fee,
      totalOrderTaxFee: order_tax_fee,
      totalExpensesShippingFee: 0,
      totalFastExpressShippingFee: 0,
      orderList,
      isSplit,
      expireTime: expire_time,
      // address_line_1, address_line_2, phone_numer, preferred
      selectedAddress: {
        address_id: data.address.user_address_id,
        full_name: data.address.nick_name,
        address_line_1: data.address.address_line_one,
        address_line_2: data.address.address_line_two,
        phone_numer: data.address.phone_number,
        ...data.address,
      },
      order_note: data.order_note,
      itemId: itemId.join(','),
      newUserCouponValue: new_user_coupon_value,
      scoreFree: {
        can_user_score: data.can_user_score,
        score_rate: data.score_rate,
      },

      product_discount:
        data.order_discount_price > 0
          ? {
              is_discount: true,
              discount: 0,
              discount_price: data.order_discount_price,
              next_discount: 0,
              next_more_discount_number: 0,
            }
          : {
              is_discount: false,
              discount: 0,
              discount_price: data.order_discount_price,
              next_discount: 0,
              next_more_discount_number: 0,
            },
    };
  }, [data]);
  return [loading, orderData, couponLists, updateOrderDetailBuyInfo] as const;
};

// 购物车购买
const useCartBuy = (
  payProps: PayComponentProps,
  shoppingMethod: number,
  gift_id: number,
  useScores: number,
  coupon?: CouponDetail | USE_COUPON_ENUM,
  selectProductId?: number,
  couponCode?: string,
) => {
  const [loading, updateCartConfirmInfo, res] = useFetching<
    CartOrderConfirm.RootObject
  >(Api.updateCartConfirmInfo);

  const updateCartBuyInfo = useCallback(async () => {
    const shoppingBag = payProps.shoppingBag;
    if (!shoppingBag) {
      return;
    }
    // shoppingMethod：0:敏感货，1：特货，2：普货
    await updateCartConfirmInfo(
      shoppingBag.ids,
      coupon === USE_COUPON_ENUM.NOT_USE
        ? USE_COUPON_ENUM.NOT_USE
        : coupon
        ? coupon.coupon_id
        : USE_COUPON_ENUM.DEFAULT,

      shoppingMethod,
      gift_id,
      useScores,
      selectProductId,
      couponCode,
    );
  }, [
    payProps.shoppingBag,
    updateCartConfirmInfo,
    coupon,
    shoppingMethod,
    gift_id,
    useScores,
    selectProductId,
    couponCode,
  ]);

  useEffect(() => {
    updateCartBuyInfo();
  }, [updateCartBuyInfo]);

  const data = useMemo(() => {
    if (res && res.data) {
      return res.data;
    }
  }, [res]);

  const orderData = useMemo<Order | undefined>(() => {
    if (!data) {
      return;
    }
    const totalOrderSubTotalPrice = data.total_price;
    const {
      can_user_score,
      score_rate,
      logistics_channel,
      need_pay_price,
      product_discount,
    } = data;

    let selectShippingMethod = logistics_channel.find((item) => item.is_select);

    const totalOrderDeliveryFee =
      (selectShippingMethod && selectShippingMethod.price) || 0;
    const totalOrderTaxFee = data.free_tax_fee.is_free
      ? data.free_tax_fee.after_free_amt
      : data.total_tax_fee;
    const totalExpensesShippingFee = data.standard_shipping_total_fee;
    const totalFastExpressShippingFee = data.express_shipping_total_fee;
    const isSplit = data.is_split_order === 1;
    const selectedCoupon = data.selected_coupon;
    const itemId: number[] = [];
    // console.log('-----package_list', data.package_list);
    const orderList = data.package_list.map(
      ({
        tax_fee,
        standard_shipping_fee,
        express_shipping_fee,
        remission_fee,
        sub_total_price,
        cart_list,
      }) => {
        const subTotalDeliveryFee = totalOrderDeliveryFee || 0;
        const subTotalTaxFee =
          // data.total_price > FREE_TAX_AMOUNT ||
          // data.total_price === FREE_TAX_AMOUNT
          //   ? data.free_tax_fee.after_free_amt
          //   : tax_fee;
          data.free_tax_fee.is_free
            ? data.free_tax_fee.after_free_amt
            : tax_fee;
        return {
          subTotalPrice: sub_total_price,
          subTotalTaxFee: subTotalTaxFee,
          subTotalDeliveryFee: subTotalDeliveryFee,
          expensesShippingFee: standard_shipping_fee,
          fastExpressShippingFee: express_shipping_fee,
          couponAmount: remission_fee,
          total: need_pay_price,
          productList: cart_list.map(
            ({
              product_id,
              image,
              title,
              price,
              original_price,
              qty,
              sku_info,
              category_id,
              item_id,
            }) => {
              item_id !== 0 && itemId.push(item_id);
              return {
                productId: product_id,
                productImage: image,
                title,
                productPrice: original_price,
                orderPrice: price,
                qty,
                skuInfo: sku_info || [],
                productType: category_id,
              };
            },
          ),
        };
      },
    );
    if (data?.free_gift_detail) {
      const giftData = {
        productId: data?.free_gift_detail?.gift_id,
        productImage: data?.free_gift_detail?.image,
        title: data?.free_gift_detail?.title,
        productPrice: 0,
        orderPrice: 0,
        qty: 1,
        skuInfo: [],
        productType: 0,
      };
      orderList[0].productList.push(giftData);
    }

    return {
      isSplit,
      totalOrderDeliveryFee,
      totalOrderSubTotalPrice,
      totalOrderTaxFee,
      totalExpensesShippingFee,
      totalFastExpressShippingFee,
      orderList,
      coupon: selectedCoupon && {
        ...selectedCoupon,
        amount: data.total_remission_fee,
      },
      orderTotal: need_pay_price,
      freeShippingFee: data.free_shipping_fee,
      freeTaxFee: data.free_tax_fee,
      itemId: itemId.join(','),
      newUserCouponValue: 0,
      scoreFree: {
        can_user_score: can_user_score,
        score_rate: score_rate,
      },
      logisticsChannel: logistics_channel,
      product_discount: product_discount,
    };
  }, [data]);

  const couponLists = useMemo(() => {
    // eslint-disable-next-line no-shadow
    const coupon = {
      codeCouponList: [],
      couponList: [],
      notAvailableCouponList: [],
    };
    if (!data) {
      return coupon;
    }
    return {
      codeCouponList: data.pub_code_coupon_info_list || [],
      couponList: data.coupon_info_list || [],
      notAvailableCouponList:
        data?.not_available_coupon_list?.filter((item) => {
          return item.coupon_type_id !== 7;
        }) || [],
    };
  }, [data]);
  return [loading, orderData, couponLists, updateCartBuyInfo] as const;
};

// 直接购买
const useDirectBuyOrder = (
  payProps: PayComponentProps,
  count: number,
  shoppingMethod: number,
  gift_id: number,
  useScores: number,
  coupon?: CouponDetail | USE_COUPON_ENUM,
  selectProductId?: number,
  couponCode?: string,
) => {
  const {from, data} = payProps;
  const productId = isBag(data, from) ? data.bag_id : data?.product_id;
  const qty = count || payProps.quantity || 1;
  const productType = data?.product_type;
  const mysteryGiftId = data?.gift_id;
  const [loading, payInfo, updateDirectBuyInfo] = usePayInfoChange(
    productId,
    from,
    qty,
    payProps.skuInfo,
    shoppingMethod,
    gift_id,
    useScores,
    coupon === USE_COUPON_ENUM.NOT_USE
      ? USE_COUPON_ENUM.NOT_USE
      : coupon
      ? coupon.coupon_id
      : USE_COUPON_ENUM.DEFAULT,
    productType ? productType : 0,
    mysteryGiftId ? mysteryGiftId : 0,
    shoppingMethod,
    selectProductId || 0,
    couponCode,
  );
  const {
    can_user_score,
    score_rate,
    selected_coupon,
    logistics_channel,
    need_pay_price,
    product_discount,
  } = payInfo;
  let selectShippingMethod = logistics_channel.find((item) => item.is_select);

  // 获取商品的基本数据
  const orderProduct = useMemo<OrderProduct | undefined>(() => {
    // 如果是订单进来 直接return
    if (from === PAGE_FORM_ENUM.ORDER) {
      return;
    }

    const {product_price} = payInfo;
    // 未拿到 商品确认信息 直接return
    if (product_price === null) {
      return;
    }

    // eslint-disable-next-line no-shadow
    const data = payProps.data as Exclude<PayComponentProps['data'], undefined>;
    // eslint-disable-next-line no-shadow
    const productId = isBag(data, from) ? data.bag_id : data.product_id;

    const productImage = Array.isArray(data.image) ? data.image[0] : data.image;
    return {
      maxQty: data.max_purchases_num || 1,
      minQty:
        data.force_min_purchases_num === 1
          ? data.min_purchases_num === 0
            ? 1
            : data.min_purchases_num
          : 1,
      productId,
      productImage,
      title: data.title,
      productPrice: data.original_price,
      orderPrice: product_price,
      qty,
      skuInfo: payProps.skuInfo || [],
      productType: isOffers(data, from) ? data.product_type : undefined,
    };
  }, [from, payInfo, payProps.data, payProps.skuInfo, qty]);
  // 获取赠送商品的基本数据
  const giftData = useMemo<OrderProduct | undefined>(() => {
    // 如果是订单进来 直接return
    if (from === PAGE_FORM_ENUM.ORDER) {
      return;
    }
    // 未拿到 商品确认信息 直接return
    if (!payInfo.free_gift_detail) {
      return;
    }
    const {free_gift_detail} = payInfo;
    return {
      maxQty: 1,
      minQty: 1,
      productId: free_gift_detail?.gift_id,
      productImage: free_gift_detail?.image,
      title: free_gift_detail?.title,
      productPrice: 0,
      orderPrice: 0,
      qty: 1,
      skuInfo: [],
      productType: undefined,
    };
  }, [from, payInfo]);

  const orderItemDataOrigin = useMemo<OrderItem | undefined>(() => {
    // 未拿到商品基本数据 直接return
    if (!orderProduct) {
      return;
    }
    // eslint-disable-next-line no-shadow
    const data = payProps.data as Exclude<PayComponentProps['data'], undefined>;
    const {
      tax_price,
      free_shipping_fee,
      free_tax_fee,
      new_user_coupon_value,
    } = payInfo as UserOrderConfirm.Data;
    const subTotalPrice = orderProduct.orderPrice * qty;

    const subTotalDeliveryFee =
      (selectShippingMethod && selectShippingMethod.price) || 0;
    // 商品总金额大于或等于FREE_TAX_AMOUNT（29）则免税费
    const subTotalTaxFee = free_tax_fee.is_free
      ? free_tax_fee?.after_free_amt
      : tax_price * qty;

    const productList = giftData ? [orderProduct, giftData] : [orderProduct];
    return {
      couponAmount: payInfo.selected_coupon?.remission_fee || 0,
      subTotalPrice,
      subTotalDeliveryFee,
      subTotalTaxFee,
      productList: productList,
      expensesShippingFee: data.expenses || payInfo.expenses_price || 0,
      fastExpressShippingFee: data.fast_expenses,
      total: need_pay_price,
      freeShippingFee: free_shipping_fee,
      freeTaxFee: free_tax_fee,
      newUserCouponValue: new_user_coupon_value || 0,
    };
  }, [
    orderProduct,
    payInfo,
    payProps.data,
    qty,
    giftData,
    selectShippingMethod,
    need_pay_price,
  ]);

  // 生成完整订单展示数据;
  const orderData = useMemo<Order | undefined>(() => {
    if (!orderItemDataOrigin) {
      return;
    }
    const {
      subTotalPrice,
      subTotalDeliveryFee,
      subTotalTaxFee,
      expensesShippingFee,
      fastExpressShippingFee,
      freeShippingFee,
      freeTaxFee,
      newUserCouponValue,
    } = orderItemDataOrigin;

    return {
      isSplit: false,
      orderTotal: need_pay_price,
      totalOrderSubTotalPrice: subTotalPrice,
      totalOrderDeliveryFee: subTotalDeliveryFee,
      totalOrderTaxFee: subTotalTaxFee,
      totalExpensesShippingFee: expensesShippingFee,
      totalFastExpressShippingFee: fastExpressShippingFee,
      coupon: selected_coupon
        ? {
            ...selected_coupon,
            amount: selected_coupon?.remission_fee,
          }
        : undefined,
      orderList: [orderItemDataOrigin],
      freeShippingFee,
      freeTaxFee,
      newUserCouponValue: newUserCouponValue || 0,
      scoreFree: {
        can_user_score: can_user_score,
        score_rate: score_rate,
      },
      logisticsChannel: logistics_channel,
      product_discount: product_discount as ProductDiscountProps,
    };
  }, [
    can_user_score,
    score_rate,
    orderItemDataOrigin,
    selected_coupon,
    logistics_channel,
    need_pay_price,
    product_discount,
  ]);

  const {code_coupon, common_coupon} = payInfo;
  // 优化优惠券数据
  const couponLists = useMemo(() => {
    return {
      codeCouponList: code_coupon || [],
      couponList: common_coupon || [],
      notAvailableCouponList:
        payInfo?.not_available_coupon_list?.filter((item) => {
          return item.coupon_type_id !== 7;
        }) || [],
    };
  }, [code_coupon, common_coupon, payInfo]);
  return [loading, orderData, couponLists, updateDirectBuyInfo] as const;
};

interface CouponSelectProps {
  codeCoupon: CouponDetail[];
  commonCoupon: CouponDetail[];
  coupon?: CouponDetail;
  onCouponChange: (coupon: CouponDetail) => void;
  onVipCouponPress: () => void;
  vip: {
    is_vip: boolean;
    total_save_amount: number;
  };
}

// 将后台返回数据转成真实金额
function convertAmount(amount?: number): number {
  if (!amount) {
    return 0;
  }
  return amount / 100;
}

export default Pay;
