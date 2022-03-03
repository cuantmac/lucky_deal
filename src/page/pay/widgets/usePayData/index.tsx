/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import {
  BagProductDetailResponse,
  CouponDetail,
  FreeFee,
  OfferProductDetailResponse,
  OrderAddress,
  OrderDetailV2Response,
  ProductLogistics,
  UserCartConfirmResponse,
  UserOrderConfirmResponse,
} from '@luckydeal/api-common';
import {CommonApi} from '@src/apis';
import {
  PRODUCT_CATEGPRY_TYPE,
  SHIPPING_METHOD_ENUM,
  USE_COUPON_ENUM,
  USE_FAST_EXPENSES_ENUM,
} from '@src/constants/enum';
import {useLoading} from '@src/utils/hooks';
import {ErrorMsg} from '@src/helper/message';
import {flatSku, isMystery} from '@src/helper/helper';
import {ReduxRootState} from '@src/redux';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {navigate2Login} from '@src/routes';

export interface OrderProduct {
  productId: number; // 商品id
  productImage: string; // 商品图片
  title: string; // 标题
  productPrice: number; // 商品原价
  orderPrice: number; // 优惠后价格
  qty: number; // 商品数量
  skuInfo: string[]; // sku 信息
  productType: PRODUCT_CATEGPRY_TYPE; // 商品类型
  maxQty?: number; // 最大购买数量
  minQty?: number; // 最小购买数量
  status: number;
  stock: number;
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
  freeShippingFee?: FreeFee; // 免运费情况
  freeTaxFee?: FreeFee; // 免税费情况
  newUserCouponValue?: number;
  logisticsChannel?: ProductLogistics[]; // 物流方式
}

interface Order {
  newUserCouponValue?: number; // 一元购订单返券金额
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
  selectedAddress?: OrderAddress; // 订单过来会默认设置好 address
  orderId?: string; // 订单过来时需要orderId， 目前只在打点时用到
  freeShippingFee?: FreeFee; // 免运费情况
  freeTaxFee?: FreeFee; // 免税费情况
  order_note?: string; // 订单备注
  itemId?: string; // 商品在分类中的id
  logisticsChannel?: ProductLogistics[]; // 新物流方式
  productDiscountPrice: number; // 多件多折优惠金额
  pubCodeTips?: string;
}

export type UsePayDataParams = UseCartBuyParams &
  UseDirectBuyOrderParams &
  UseOrderDetailBuyParams;

export const usePayData = (params: UsePayDataParams) => {
  const [
    cartBuyloading,
    cartBuyData,
    cartBuyCoupons,
    cartIds,
    cartUpdate,
  ] = useCartBuy(params);
  const [
    directBuyloading,
    directBuyData,
    directBuyCoupons,
    directCartIds,
    dicectUpdate,
  ] = useDirectBuyOrder(params);
  const [
    orderDetailBuyloading,
    orderDetailBuyData,
    corderDetailBuyCoupons,
  ] = useOrderDetailBuy(params);
  const emptyCoupons = useRef({
    codeCouponList: [],
    couponList: [],
    notAvailableCouponList: [],
  }).current;
  if (cartBuyData) {
    return [
      cartBuyloading,
      cartBuyData,
      cartBuyCoupons,
      cartIds,
      cartUpdate,
    ] as const;
  }
  if (directBuyData) {
    return [
      directBuyloading,
      directBuyData,
      directBuyCoupons,
      directCartIds,
      dicectUpdate,
    ] as const;
  }
  if (orderDetailBuyData) {
    return [
      orderDetailBuyloading,
      orderDetailBuyData,
      corderDetailBuyCoupons,
    ] as const;
  }
  return [
    cartBuyloading || directBuyloading || orderDetailBuyloading,
    undefined,
    emptyCoupons,
  ] as const;
};

interface UseCartBuyParams {
  cartList?: number[];
  couponCode?: string;
  shippingMethod: SHIPPING_METHOD_ENUM;
  coupon?: CouponDetail | USE_COUPON_ENUM;
  logisticsChannelId: number;
  isCart?: boolean;
}

// 购物车购买
const useCartBuy = ({
  shippingMethod,
  coupon,
  logisticsChannelId,
  isCart = false,
  couponCode,
  cartList,
}: UseCartBuyParams) => {
  const {token} = useSelector(({persist}: ReduxRootState) => ({
    token: persist.persistAuth.token,
  }));
  const [data, setData] = useState<UserCartConfirmResponse>();
  const [loading, withLoading] = useLoading(true);

  const loginCartConfirm = useCallback(() => {
    if (!cartList?.length) {
      return;
    }
    withLoading(
      CommonApi.userCartConfirmUsingPOST({
        pub_code: couponCode,
        coupon_id:
          // eslint-disable-next-line no-nested-ternary
          coupon === USE_COUPON_ENUM.NOT_USE
            ? USE_COUPON_ENUM.NOT_USE
            : coupon
            ? coupon.coupon_id
            : USE_COUPON_ENUM.DEFAULT,
        cart_id_list: cartList,
        shipping_method: shippingMethod,
        logistics_channel_id: logisticsChannelId,
      }),
    ).then((res) => {
      setData(res.data);
    });
  }, [
    cartList,
    coupon,
    couponCode,
    logisticsChannelId,
    setData,
    shippingMethod,
    withLoading,
  ]);

  useEffect(() => {
    if (isCart) {
      if (token) {
        loginCartConfirm();
      } else {
        navigate2Login();
      }
    }
  }, [isCart, loginCartConfirm, token]);

  const orderData = useMemo<Order | undefined>(() => {
    if (!data) {
      return;
    }
    const totalOrderSubTotalPrice = data.total_price;
    const selectShippingMethod = data.logistics_channel?.find(
      (item) => item.is_select,
    );
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
    const orderList = data.package_list.map(
      ({
        tax_fee,
        standard_shipping_fee,
        express_shipping_fee,
        remission_fee,
        sub_total_price,
        cart_list,
        discount_price,
      }) => {
        const subTotalDeliveryFee =
          (selectShippingMethod && selectShippingMethod.price) || 0;
        const subTotalTaxFee = tax_fee;
        return {
          subTotalPrice: sub_total_price,
          subTotalTaxFee,
          subTotalDeliveryFee,
          expensesShippingFee: standard_shipping_fee,
          fastExpressShippingFee: express_shipping_fee,
          couponAmount: remission_fee,
          total:
            sub_total_price +
            subTotalTaxFee +
            subTotalDeliveryFee -
            (isSplit ? 0 : remission_fee) -
            (isSplit ? 0 : discount_price),
          productList: cart_list.map(
            ({
              product_id,
              image,
              title,
              price,
              original_price,
              qty,
              category_id,
              item_id,
              selected_sku_list,
              status,
              stock,
            }) => {
              item_id !== 0 && itemId.push(item_id);
              return {
                productId: product_id,
                productImage: image,
                title,
                productPrice: original_price,
                orderPrice: price,
                qty,
                skuInfo: flatSku(selected_sku_list),
                productType: category_id,
                status,
                stock,
              };
            },
          ),
        };
      },
    );
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
        amount: selectedCoupon?.remission_fee,
      },
      // orderTotal: totalOrderSubTotalPrice + totalOrderDeliveryFee + totalOrderTaxFee - data.total_remission_fee,
      freeShippingFee: data.free_shipping_fee,
      freeTaxFee: data.free_tax_fee,
      itemId: itemId.join(','),
      orderTotal: data.need_pay_price || 0,
      logisticsChannel: data.logistics_channel,
      productDiscountPrice: data?.product_discount?.discount_price || 0,
      pubCodeTips: data.pub_code_tips,
    };
  }, [data]);

  // 优化优惠券数据
  const couponLists = useMemo(() => {
    return {
      codeCouponList: data?.pub_code_coupon_info_list || [],
      couponList: data?.coupon_info_list || [],
      notAvailableCouponList:
        data?.not_available_coupon_list?.filter((item) => {
          return item.coupon_type_id !== 7;
        }) || [],
    };
  }, [data]);

  return [loading, orderData, couponLists, cartList, loginCartConfirm] as const;
};

type UseDirectBuyOrderParams = {
  couponCode?: string;
  shippingMethod?: SHIPPING_METHOD_ENUM;
  productType?: PRODUCT_CATEGPRY_TYPE;
  productId?: number;
  qty?: number;
  skuList?: string[];
  coupon?: CouponDetail | USE_COUPON_ENUM;
  logisticsChannelId?: number;
};

// 直接购买
export const useDirectBuyOrder = ({
  productId,
  qty,
  skuList,
  productType,
  shippingMethod,
  coupon,
  logisticsChannelId = 0,
  couponCode,
}: UseDirectBuyOrderParams) => {
  const [loading, detailData, confirmData, update] = useProductConfirmDetail({
    productId,
    productType,
    qty,
    skuList,
    shippingMethod,
    logisticsChannelId,
    coupon,
    couponCode,
  });

  const orderProduct = useMemo<OrderProduct | undefined>(() => {
    if (!productId || !productType || qty === undefined) {
      return;
    }

    if (!confirmData) {
      return;
    }
    const productData =
      confirmData?.package_list && confirmData.package_list[0].cart_list[0];
    if (productData && detailData) {
      return {
        maxQty: detailData.max_purchases_num,
        minQty: detailData.min_purchases_num,
        productId: productData.product_id,
        productImage: productData.image,
        title: productData.title,
        productPrice: productData.original_price,
        orderPrice: confirmData.product_price || 0,
        qty,
        skuInfo: flatSku(confirmData.selected_sku_list),
        productType,
        status: productData.status,
        stock: productData.stock,
        sku: productData.sku_no,
      };
    }
  }, [confirmData, detailData, productId, productType, qty]);

  // 无优惠券情况下的订单价格 切记 可能有首单优惠
  const orderItemDataOrigin = useMemo<OrderItem | undefined>(() => {
    // 未拿到商品基本数据 直接return
    if (!orderProduct || !confirmData || !detailData || qty === undefined) {
      return;
    }
    const {
      total_tax_fee,
      free_shipping_fee,
      free_tax_fee,
      new_user_coupon_value,
    } = confirmData;
    const subTotalPrice = orderProduct.orderPrice * qty;
    const selectShippingMethod = confirmData.logistics_channel?.find(
      (item) => item.is_select,
    );
    const subTotalDeliveryFee =
      (selectShippingMethod && selectShippingMethod.price) || 0;
    // 商品总金额大于或等于FREE_TAX_AMOUNT（29）则免税费
    const subTotalTaxFee = total_tax_fee || 0;
    const selectedCoupon = confirmData.selected_coupon;
    return {
      couponAmount: selectedCoupon?.remission_fee || 0,
      subTotalPrice,
      subTotalDeliveryFee,
      subTotalTaxFee,
      productList: [orderProduct],
      expensesShippingFee: detailData.expenses,
      fastExpressShippingFee: detailData.fast_expenses,
      total: confirmData.need_pay_price || 0,
      freeShippingFee: free_shipping_fee,
      freeTaxFee: free_tax_fee,
      newUserCouponValue: new_user_coupon_value || 0,
      logisticsChannel: confirmData.logistics_channel,
      coupon: selectedCoupon && {
        ...selectedCoupon,
        amount: selectedCoupon.remission_fee,
      },
    };
  }, [confirmData, detailData, orderProduct, qty]);

  // 优化优惠券数据
  const couponLists = useMemo(() => {
    const commonCoupon = confirmData?.coupon_info?.filter((item) => {
      return item.coupon_type_id !== 7;
    });
    const codeCoupon = confirmData?.coupon_info?.filter((item) => {
      return item.coupon_type_id === 7;
    });
    return {
      codeCouponList: codeCoupon || [],
      couponList: commonCoupon || [],
      notAvailableCouponList:
        confirmData?.not_available_coupon_list?.filter((item) => {
          return item.coupon_type_id !== 7;
        }) || [],
    };
  }, [confirmData]);

  // 生成完整订单展示数据
  const orderData = useMemo<Order | undefined>(() => {
    if (!orderItemDataOrigin) {
      return;
    }
    const {
      total,
      subTotalPrice,
      subTotalDeliveryFee,
      subTotalTaxFee,
      expensesShippingFee,
      fastExpressShippingFee,
      freeShippingFee,
      freeTaxFee,
      newUserCouponValue,
      logisticsChannel,
    } = orderItemDataOrigin;

    return {
      pubCodeTips: confirmData?.pub_code_tips,
      isSplit: false,
      orderTotal: total,
      totalOrderSubTotalPrice: subTotalPrice,
      totalOrderDeliveryFee: subTotalDeliveryFee,
      totalOrderTaxFee: subTotalTaxFee,
      totalExpensesShippingFee: expensesShippingFee,
      totalFastExpressShippingFee: fastExpressShippingFee,
      coupon: confirmData?.selected_coupon,
      orderList: [orderItemDataOrigin],
      freeShippingFee,
      freeTaxFee,
      newUserCouponValue,
      logisticsChannel,
      productDiscountPrice: confirmData?.product_discount?.discount_price || 0,
    };
  }, [confirmData, orderItemDataOrigin]);

  return [loading, orderData, couponLists, undefined, update] as const;
};

interface UseOrderDetailBuyParams {
  orderId?: string;
}

// 订单详情
const useOrderDetailBuy = ({orderId}: UseOrderDetailBuyParams) => {
  const couponLists = useRef({
    codeCouponList: [],
    couponList: [],
    notAvailableCouponList: [],
  }).current;
  const [data, setData] = useState<OrderDetailV2Response>();

  const [loading, withLoading] = useLoading(true);

  useEffect(() => {
    if (!orderId) {
      return;
    }
    withLoading(
      CommonApi.orderDetailV2UsingPOST({
        order_no: orderId,
      }),
    ).then((res) => {
      setData(res.data);
    });
  }, [orderId, setData, withLoading]);

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
    } = data;
    const itemId: number[] = [];

    const isSplit = data.order_items.length > 1;
    const orderList = order_items.map<OrderItem>(({order_id, detail}) => {
      let subTotalPrice = 0;
      let subTotalDeliveryFee = 0;
      let subTotalTaxFee = 0;
      let couponAmount = 0;
      let total = 0;
      const productList = detail.map<OrderProduct>(
        ({
          order_price, // 后台已经乘以 qty
          qty,
          order_delivery_fee,
          order_tax_fee, // 后台已经乘以 qty
          coupon,
          product_id,
          image,
          title,
          product_price, // 后台已经乘以 qty
          sku_list,
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
            skuInfo: sku_list || [],
            productType: category_id,
            status: 0,
            stock: qty,
          };
        },
      );

      total =
        subTotalPrice +
        subTotalDeliveryFee +
        subTotalTaxFee -
        (isSplit ? 0 : couponAmount) -
        (isSplit ? 0 : data.order_discount_price);
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
      logisticsChannel: [],
      productDiscountPrice: data.order_discount_price,
    };
  }, [data]);
  return [loading, orderData, couponLists] as const;
};

// 获取福袋或直购商品详情 和 价格确认数据
const useProductConfirmDetail = ({
  productId,
  productType,
  skuList,
  qty,
  shippingMethod,
  logisticsChannelId,
  coupon,
  couponCode,
}: UseDirectBuyOrderParams) => {
  const {token} = useSelector(({persist}: ReduxRootState) => ({
    token: persist.persistAuth.token,
  }));
  const [detailData, setDetailData] = useState<
    OfferProductDetailResponse | BagProductDetailResponse
  >();
  const [confirmData, setConfirmData] = useState<
    Partial<UserOrderConfirmResponse>
  >();
  const [detailLoadding, withDetailLoading] = useLoading(true);
  const [confirmLoadding, withConfirmLoading] = useLoading(true);
  const couponId =
    coupon === USE_COUPON_ENUM.NOT_USE
      ? USE_COUPON_ENUM.NOT_USE
      : coupon
      ? coupon.coupon_id
      : USE_COUPON_ENUM.DEFAULT;
  useEffect(() => {
    if (!productId) {
      return;
    }
    if (productType && isMystery(productType)) {
      withDetailLoading(
        CommonApi.luckyBagDetailUsingPOST({bag_id: productId}),
      ).then((res) => {
        setDetailData(res.data);
      });
    } else {
      withDetailLoading(
        CommonApi.luckyOfferDetailUsingPOST({product_id: productId}),
      ).then((res) => {
        setDetailData(res.data);
      });
    }
  }, [productId, productType, setDetailData, withDetailLoading]);

  const loginOrderConfirm = useCallback(() => {
    if (!productId || !productType || qty === undefined) {
      return;
    }
    withConfirmLoading(
      CommonApi.userOrderConfirmUsingPOST({
        product_id: productId,
        product_type:
          // 福袋: 1， 非福袋: 0
          productType === PRODUCT_CATEGPRY_TYPE.MYSTERY ||
          productType === PRODUCT_CATEGPRY_TYPE.SUPRE_BOX
            ? 1
            : 0,
        qty,
        sku_no_list: skuList,
        use_fast_expenses:
          shippingMethod === SHIPPING_METHOD_ENUM.FAST
            ? USE_FAST_EXPENSES_ENUM.USE
            : USE_FAST_EXPENSES_ENUM.NOT_USE,
        shipping_method: shippingMethod,
        logistics_channel_id: logisticsChannelId,
        coupon_id: couponId,
        pub_code: couponCode,
      }),
    ).then((res) => {
      setConfirmData(res.data);
    });
  }, [
    couponCode,
    couponId,
    logisticsChannelId,
    productId,
    productType,
    qty,
    setConfirmData,
    shippingMethod,
    skuList,
    withConfirmLoading,
  ]);

  useEffect(() => {
    if (token) {
      loginOrderConfirm();
    }
  }, [loginOrderConfirm, token]);

  return [
    detailLoadding || confirmLoadding,
    detailData,
    confirmData,
    loginOrderConfirm,
  ] as const;
};

export const applyCodeCheck = async ({
  isCart,
  couponCode,
  coupon,
  shippingMethod,
  logisticsChannelId,
  productId,
  productType,
  skuList,
  qty,
  cartList,
}: UsePayDataParams) => {
  const couponId =
    coupon === USE_COUPON_ENUM.NOT_USE
      ? USE_COUPON_ENUM.NOT_USE
      : coupon
      ? coupon.coupon_id
      : USE_COUPON_ENUM.DEFAULT;
  if (isCart) {
    if (cartList?.length) {
      const {
        data: {pub_code_tips},
      } = await CommonApi.userCartConfirmUsingPOST({
        pub_code: couponCode,
        coupon_id: couponId,
        cart_id_list: cartList,
        shipping_method: shippingMethod,
        logistics_channel_id: logisticsChannelId,
      });
      if (pub_code_tips) {
        throw new ErrorMsg(pub_code_tips);
      }
      return couponCode;
    }
    throw new ErrorMsg('no cart list');
  } else {
    const {
      data: {pub_code_tips},
    } = await CommonApi.userOrderConfirmUsingPOST({
      product_id: productId as number,
      product_type:
        // 福袋: 1， 非福袋: 0
        productType === PRODUCT_CATEGPRY_TYPE.MYSTERY ||
        productType === PRODUCT_CATEGPRY_TYPE.SUPRE_BOX
          ? 1
          : 0,
      qty: qty as number,
      sku_no_list: skuList,
      use_fast_expenses:
        shippingMethod === SHIPPING_METHOD_ENUM.FAST
          ? USE_FAST_EXPENSES_ENUM.USE
          : USE_FAST_EXPENSES_ENUM.NOT_USE,
      shipping_method: shippingMethod,
      logistics_channel_id: logisticsChannelId,
      coupon_id: couponId,
      pub_code: couponCode,
    });
    if (pub_code_tips) {
      throw new ErrorMsg(pub_code_tips);
    }
    return couponCode;
  }
};
