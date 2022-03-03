import {
  ActivityInfoItem,
  BagProductDetailResponse,
  FlashSalesInfo,
  OfferProductDetailResponse,
  RegisterResponse,
  UserProfileResponse,
} from '@luckydeal/api-common';
import {createAction} from 'redux-actions';

// 设置token
export type AuthPayload = {
  tk?: string;
  anonymous?: boolean;
  email?: string;
} & RegisterResponse;
export const auth = createAction<AuthPayload>('AUTH');
// 退出登陆
export const signOut = createAction('SIGN_OUT');

export type UserProfilePayload = Partial<UserProfileResponse>;
// 添加用户配置信息
export const userProfile = createAction<UserProfilePayload>('USER_PROFILE');
// 获取购物车数量
export type CartNumPayLoad = number;
export const cartNum = createAction<CartNumPayLoad>('LD_CART_NUM');

// 设置用户选中的地址
export const setSelectedAddress = createAction<number>('SET_SELECTED_ADDRESS');

// 登陆完成 重定向页面
export type RedirectUrlPayload = string;
export const redirectUrl = createAction<RedirectUrlPayload>('REDIRECT_URL');

// 购物车 action
export type AddProduct2CartPayload = {
  id: string;
  // 商品id
  productId: number;
  // 商品类型
  productType: number;
  // 商品价格
  price: number;
  // 商品sku信息，福袋可能存在多个商品， 所以sku数据格式形如： [productId1-sku1-sku2, productId2-sku1-sku2]
  sku: string[];
  // 商品数量
  qty: number;
  // 1 选中 0 未勾选
  is_select?: number;
  // 商品详情
  productDetail: (OfferProductDetailResponse | BagProductDetailResponse) & {
    activity_info?: ActivityInfoItem[];
    flash_sales?: FlashSalesInfo;
  };
};
// 添加购物车
export const addProduct2Cart = createAction<AddProduct2CartPayload[]>(
  'ADD_PRODUCT_TO_CART',
);
// 清空购物车
export const clearCart = createAction('CLEAR_CART');
