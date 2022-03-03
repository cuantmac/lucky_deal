import {CouponDetail} from '@luckydeal/api-common';
import {StackNavigationProp} from '@react-navigation/stack';
import Api from '../../Api';
import {OrderDetailData} from '../../types/models/order.model';

// 商品类型枚举
export enum PRODUCT_TYPE_ENUM {
  AUCTION = 0, // 竞拍商品（非竞拍币）
  MYSTERY = 1, // 福袋
  OFFERS = 2, // 直购
  SUPRE_BOX = 3, // 超级福袋
  VIP = 4, // vip 商品
  FEATURES = 5, // 专题
  SPECIAL = 6, // 特殊板块
}

// 支付页来源枚举
export enum PAGE_FORM_ENUM {
  MYSTERY = 'mystery',
  AUCTION = 'auction',
  OFFERS = 'offers',
  ORDER = 'order',
  CART = 'cart',
}

// 支付类型
export enum PAY_TYPE_ENUM {
  DIALOG_PAY = 1,
  BUTTON_PAY = 2,
}

// 物流方式
export enum SHOPPING_METHOD_ENUM {
  NORMAL = 2, //普货
  FAST = 1, //特货
  SENSITIVE = 0, //敏感货
}

// 更新订单列表页价格只区分 0 直购，竞拍 商品 1 福袋
export enum UPDATE_PAY_CONFIRM_INFO {
  MYSTERY = 1,
  OFFER_OR_OTHER = 0,
}

// 是够使用快速物流
export enum USE_FAST_EXPENSES_ENUM {
  USE = 1, // 使用
  NOT_USE = 0, // 不使用
}

// 优惠券类型
export enum COUPON_TYPE_ENUM {
  REGISTER_USER_COUPON = 1, // 注册优惠券
  LOTTERY_COUPON = 2, // 笔笔抽优惠券
  FREIGHT_COUPON = 3, // 运费券
  TAX_COUPON = 4, // 税费券
  FULL_REDUCTION_COUPON = 5, // 满减优惠券
}

// 订单状态
export enum ORDER_STATUS_ENUM {
  SUCCESS = 1,
}

// 是否使用优惠券
export enum USE_COUPON_ENUM {
  // 使用默认优惠券
  DEFAULT = 0,
  // 不使用
  NOT_USE = -1,
}

type PayStackNavigationProp = StackNavigationProp<any, 'Pay'>;

/**
 *
 * 确保栈中不存在订单确认页 和 重复的 Orders
 *
 * 如果栈里面已经有 Orders 则使用 navigate 方式跳转
 * 如果栈里面没有 Orders 则使用 replace 将订单确认页替换成 Orders
 */
export function payNavigateToOrders(
  navigarion: PayStackNavigationProp,
): PayStackNavigationProp['replace'] | PayStackNavigationProp['navigate'] {
  const routeStack = navigarion.dangerouslyGetState();
  const routes = routeStack.routes;
  let replace = true;
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].name === 'Orders') {
      replace = false;
      break;
    }
  }
  if (replace) {
    return navigarion.replace;
  }
  return navigarion.navigate;
}

export function isOffersOrBag(from: PAGE_FORM_ENUM): boolean {
  if (from === PAGE_FORM_ENUM.OFFERS) {
    return true;
  }
  if (from === PAGE_FORM_ENUM.MYSTERY) {
    return true;
  }
  if (from === PAGE_FORM_ENUM.AUCTION) {
    return true;
  }
  return false;
}

export function createOfferOrder(
  productId: number,
  categoryId: number,
  addressId: number,
  skuInfo: OrderDetailData.Skuinfo[] | undefined,
  qty: number,
  coupon: CouponDetail | undefined,
  recordId: number | undefined,
  shoppingMethod: SHOPPING_METHOD_ENUM,
  orderNote: string,
  useScores: number,
  buyType: number = 4,
  selectProductId: number,
) {
  const use_fast_expenses =
    shoppingMethod === SHOPPING_METHOD_ENUM.FAST ? 1 : 0;

  return Api.newOrder(
    productId,
    addressId,
    buyType,
    0,
    0,
    skuInfo as any,
    qty,
    coupon?.coupon_id || 0,
    categoryId || 0,
    recordId || 0,
    use_fast_expenses,
    orderNote,
    useScores,
    shoppingMethod,
    selectProductId,
  );
}

export function createBagOrder(
  productId: number,
  categoryId: number,
  addressId: number,
  skuInfo: OrderDetailData.Skuinfo[] | undefined,
  qty: number,
  coupon: CouponDetail | undefined,
  recordId: number | undefined,
  shoppingMethod: SHOPPING_METHOD_ENUM,
  orderNote: string,
  selectProductId: number,
  gift_id?: number,
  useScores?: number,
) {
  const use_fast_expenses =
    shoppingMethod === SHOPPING_METHOD_ENUM.FAST ? 1 : 0;
  return Api.luckyBagOrder(
    productId,
    addressId,
    skuInfo,
    qty,
    coupon?.coupon_id || 0,
    categoryId || 0,
    recordId || 0,
    use_fast_expenses,
    shoppingMethod,
    orderNote,
    gift_id,
    useScores,
    selectProductId,
  );
}

export function createCartOrder(
  cartList: number[],
  addressId: number,
  coupon: CouponDetail | undefined,
  shoppingMethod: SHOPPING_METHOD_ENUM,
  useScores: number,
  selectProductId: number,
  orderNote?: string,
  gift_id?: number,
) {
  return Api.createCartOrder(
    cartList,
    addressId,
    coupon?.coupon_id || 0,
    shoppingMethod,
    useScores,
    selectProductId,
    orderNote,
    gift_id,
  );
}
