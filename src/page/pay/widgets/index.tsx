import {
  AisaBillPayInfo,
  CouponDetail,
  PacyPayInfo,
} from '@luckydeal/api-common';
import {CommonApi} from '@src/apis';
import {px} from '@src/constants/constants';
import {SHIPPING_METHOD_ENUM, PAY_METHOD_ENUM} from '@src/constants/enum';
import React, {FC} from 'react';
import {View, Text} from 'react-native';

export const PayBottomContainer: FC = ({children}) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingBottom: 45 * px,
      }}>
      {children}
    </View>
  );
};

interface FinalAmountProps {
  finalPrice: string | number;
}

/**
 * 显示最终金额
 */
export const FinalAmount: FC<FinalAmountProps> = ({finalPrice}) => {
  return (
    <View
      style={{
        marginHorizontal: 40 * px,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30 * px,
      }}>
      <Text
        style={{
          marginLeft: 12,
          fontSize: 50 * px,
          flex: 1,
          fontWeight: 'bold',
        }}>
        Total
      </Text>
      <Text
        style={{
          color: '#000',
          marginRight: 12,
          fontSize: 50 * px,
          fontWeight: 'bold',
        }}>
        ${finalPrice}
      </Text>
    </View>
  );
};

/**
 * 创建直购订单
 */
export function createOfferOrder(
  productId: number,
  categoryId: number,
  addressId: number,
  skuList: string[],
  qty: number,
  shippingMethod: SHIPPING_METHOD_ENUM,
  orderNote: string,
  coupon?: CouponDetail,
  logisticsChannelId?: number,
) {
  const use_fast_expenses =
    shippingMethod === SHIPPING_METHOD_ENUM.FAST ? 1 : 0;
  return CommonApi.userNewOrderUsingPOST({
    product_id: productId,
    category_id: categoryId,
    auction_id: 0,
    buy_type: 4,
    wheel_reward: 0,
    user_address_id: addressId,
    sku_no: skuList[0] || '',
    qty,
    order_note: orderNote,
    use_fast_expenses,
    slot_record_id: 0,
    shipping_method: shippingMethod,
    coupon_id: coupon?.coupon_id || 0,
    logistics_channel_id: logisticsChannelId || 0,
  });
}

/**
 * 创建福袋订单
 */
export function createBagOrder(
  productId: number,
  categoryId: number,
  addressId: number,
  skuList: string[],
  qty: number,
  shippingMethod: SHIPPING_METHOD_ENUM,
  orderNote: string,
  coupon?: CouponDetail,
  logisticsChannelId?: number,
) {
  const use_fast_expenses =
    shippingMethod === SHIPPING_METHOD_ENUM.FAST ? 1 : 0;
  return CommonApi.userNewBagOrderUsingPOST({
    bag_id: productId,
    category_id: categoryId || 0,
    order_note: orderNote,
    qty,
    sku_no_list: skuList,
    slot_record_id: 0,
    use_fast_expenses,
    user_address_id: addressId,
    coupon_id: coupon?.coupon_id || 0,
    shipping_method: shippingMethod,
    logistics_channel_id: logisticsChannelId || 0,
  });
}

/**
 * 创建购物车订单
 */
export function createCartOrder(
  cartList: number[],
  addressId: number,
  shippingMethod: SHIPPING_METHOD_ENUM,
  orderNote: string,
  coupon?: CouponDetail,
  logisticsChannelId?: number,
) {
  return CommonApi.userNewCartOrderUsingPOST({
    cart_id_list: cartList,
    coupon_id: coupon?.coupon_id || 0,
    order_note: orderNote,
    shipping_method: shippingMethod,
    user_address_id: addressId,
    logistics_channel_id: logisticsChannelId || 0,
  });
}

/**
 *
 * 根据支付方式订单类型 返回支付跳转的数据
 *
 * {
 *  url: 根据支付方式 获取支付的地址
 * }
 *
 * @param {*} payMethod 支付方式
 * @param {*} orderId 订单id
 * @param {*} orderType 订单类型 ORDER_TYPE_ENUM
 */
export const orderPay = async (
  payMethod: PAY_METHOD_ENUM,
  orderId: string,
  returnUrl: string,
) => {
  const error = new Error('order error');
  const returnData: {
    payMethod: PAY_METHOD_ENUM;
    url?: string;
    orderId: string;
    body?: PacyPayInfo | AisaBillPayInfo;
  } = {
    payMethod,
    orderId,
  };

  if (
    payMethod === PAY_METHOD_ENUM.PAYPAL ||
    payMethod === PAY_METHOD_ENUM.PAY_BOARD
  ) {
    const charge = await CommonApi.userPreChargeUsingPOST({
      charge_type: 7,
      order_id: orderId,
      custom_url: returnUrl,
    });
    if (!(charge && charge.data)) {
      throw error;
    }
    if (payMethod === PAY_METHOD_ENUM.PAYPAL) {
      returnData.url = charge.data.pay_url;
      return returnData;
    }
    if (payMethod === PAY_METHOD_ENUM.PAY_BOARD) {
      returnData.url = charge.data.pay_board_url;
      return returnData;
    }
  }

  if (payMethod === PAY_METHOD_ENUM.CREDIT_CARD) {
    return returnData;
  }

  if (payMethod === PAY_METHOD_ENUM.PAY_PACY) {
    const charge = await CommonApi.pacyPayPreChargeUsingPOST({
      charge_type: 7,
      order_id: orderId,
      custom_url: returnUrl,
    });
    if (!(charge && charge.data)) {
      throw error;
    }
    returnData.url = charge.data.pay_url;
    returnData.orderId = orderId;
    returnData.body = charge.data.pay_info;
    return returnData;
  }

  if (payMethod === PAY_METHOD_ENUM.ASIA_BILL) {
    const charge = await CommonApi.asiabillPreChargeUsingPOST({
      charge_type: 7,
      order_id: orderId,
    });
    returnData.orderId = orderId;
    returnData.body = charge.data.pay_info;
    return returnData;
  }

  return returnData;
};
