import {isWeb} from '@src/helper/helper';
import {handleAction, handleActions} from 'redux-actions';
import {
  addProduct2Cart,
  AddProduct2CartPayload,
  auth,
  AuthPayload,
  clearCart,
  redirectUrl,
  RedirectUrlPayload,
  setSelectedAddress,
  signOut,
  userProfile,
  UserProfilePayload,
} from '../actions/standardAction';

// 处理选中的地址
const persistSelectedAddressReducer = handleAction<number, number>(
  setSelectedAddress.toString(),
  (state, {payload}) => {
    return payload;
  },
  -1,
);

/**
 * 登录权限
 */
export const persistAuthReducer = handleActions<AuthPayload, AuthPayload>(
  {
    [auth.toString()]: (state, {payload}) => {
      return {...state, ...payload};
    },
    // 退出登陆清理数据
    [signOut.toString()]: (state) => {
      return {
        tk: state.tk,
      };
    },
  },
  {
    token: '',
    tk: isWeb() ? window.tk : '',
  },
);

// 登陆完成重定向url
const persistRedirectUrlReducer = handleAction<
  RedirectUrlPayload,
  RedirectUrlPayload
>(
  redirectUrl.toString(),
  (state, {payload}) => {
    return payload;
  },
  '',
);

/**
 * 购物车
 */
type PersistCartReducerState = (AddProduct2CartPayload & {
  updateTime: number;
})[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const persistCartReducer = handleActions<PersistCartReducerState>(
  {
    // 添加购物车
    [addProduct2Cart.toString()]: (state, {payload}) => {
      return payload;
    },
    // 清空购物车
    [clearCart.toString()]: () => {
      return [];
    },
  },
  [],
);

/**
 * 用户配置信息
 */

export const persistUserProfileReducer = handleActions<UserProfilePayload>(
  {
    [userProfile.toString()]: (state, {payload}) => {
      return payload;
    },
    // 退出登陆清理数据
    [signOut.toString()]: () => {
      return {};
    },
  },
  {},
);

export default {
  persistSelectedAddress: persistSelectedAddressReducer,
  persistAuth: persistAuthReducer,
  persistCart: persistCartReducer,
  persistUserProfile: persistUserProfileReducer,
  persistRedirectUrl: persistRedirectUrlReducer,
};
