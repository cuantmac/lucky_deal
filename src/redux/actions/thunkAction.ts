import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import {
  addProduct2Cart,
  AddProduct2CartPayload,
  auth,
  AuthPayload,
  clearCart,
  userProfile,
  UserProfilePayload,
} from './standardAction';
import {ReducerRootState} from '../reducers';
import {
  CartItem,
  CartListParam,
  CartSelectEditRequest,
  NoLoginOrderConfirmProductRequestItem,
  UnLoginCartDataRequestItem,
  UserCartAddResponse,
  UserCartEditResponse,
  UserCartListRequest,
  UserCartListResponse,
} from '@luckydeal/api-common';
import {CommonApi} from '@src/apis';
import {ErrorMsg} from '@src/helper/message';
import {CART_ITEM_ACTION_ENUM} from '@src/constants/enum';
import {async} from 'q';

/**
 * 该文件中不可引用 src/store/index里面的 ReduxRootState，会造成循环引用
 * 同样也不可以引用 src/store/index 中的 standardAction
 * 请使用thunk返回函数的 dispatch 参数
 */

// 如果定义了thunk extraArgument参数类型，请响应的修改这个类型
type ThunkExtraARG = unknown;

/**
 * 方便生成thunkAction 返回参数
 *
 * @param R 返回函数的返回参数类型
 * @param E thunk extraArgument 参数类型，在这暂时没有使用，如需使用请修改上面的类型定义
 */
type ThunkActionResult<R, E = ThunkExtraARG> = ThunkAction<
  R,
  ReducerRootState,
  E,
  Action<string>
>;

// 添加购物车
export const addProduct2CartAsync = (
  params: Omit<AddProduct2CartPayload, 'id'>,
): ThunkActionResult<Promise<UserCartAddResponse>> => {
  return async (dispatch, getState) => {
    const state = JSON.parse(JSON.stringify(getState())) as ReturnType<
      typeof getState
    >;
    if (state.persist.persistAuth.token) {
      const res = await CommonApi.userCartAddUsingPOST({
        category_id: 0,
        item_id: 0,
        product_id: params.productId,
        product_type: params.productType,
        sku_no_list: params.sku,
        qty: params.qty,
        price: params.price,
      });
      return res.data;
    }
    let {sku} = params;
    if (!sku.length) {
      sku = [`${params.productId}`];
    }

    const preCartState = state.persist.persistCart;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const calcId = sku.sort((a: any, b: any) => a - b).join(',');
    const cartItemIndex = preCartState.findIndex(({id}) => id === calcId);
    if (cartItemIndex !== -1) {
      const cartItem = preCartState[cartItemIndex];
      cartItem.qty += 1;
      cartItem.updateTime = Date.now();
      preCartState.splice(cartItemIndex, 1);
      cartItem.is_select = 1;
      const max = cartItem.productDetail.max_purchases_num;
      if (cartItem.qty > max) {
        throw new ErrorMsg(
          `Sorry, the product add to the shopping bag has reached the maximum limit ${max}`,
          -9999,
        );
      }
      dispatch(addProduct2Cart([cartItem, ...preCartState]));
    } else {
      const result = [
        {...params, updateTime: Date.now(), id: calcId, is_select: 1},
        ...preCartState,
      ];
      // 购物车最多10个
      if (result.length > 10) {
        result.splice(-1, 1);
      }
      dispatch(addProduct2Cart(result));
    }

    let totalNum = 0;
    const cartState = getState().persist.persistCart;
    cartState.forEach(({qty}) => {
      totalNum += qty;
    });
    return {
      id: 0,
      image: params.productDetail.image[0],
      is_success: true,
      price: params.price,
      title: params.productDetail.title,
      total_num: totalNum,
    };
  };
};

// 获取本地购物车商品
export const localCartListProductAsync = (): ThunkActionResult<
  Promise<CartListParam[]>
> => {
  return async (dispatch, getState) => {
    const cartState = getState().persist.persistCart;
    return cartState.map(({productId, productType, qty, sku, is_select}) => {
      return {
        product_id: productId,
        product_type: productType,
        qty,
        sku_no: sku[0] || '',
        is_select: is_select || 0,
      };
    });
  };
};

// 获取购物车数据
export const cartListDataAsync = (
  params: UserCartListRequest,
): ThunkActionResult<Promise<UserCartListResponse>> => {
  return async (dispatch, getState) => {
    const state = getState();
    if (state.persist.persistAuth.token) {
      const res = await CommonApi.userCartListUsingPOST(params);
      return res.data;
    }
    const cartListParams = await dispatch(localCartListProductAsync());
    const res = await CommonApi.unLoginUserCartListUsingPOST({
      cart_list: cartListParams,
    });
    const preCartState = getState().persist.persistCart;
    res.data.list = res.data.list?.map((value) => {
      const {sku_no, product_id, qty} = value;
      const item = preCartState?.find((val) => {
        return (
          val.productId === product_id &&
          (val.sku[0] || '') === sku_no &&
          val.qty === qty
        );
      });
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return {
        ...value,
        id: (item!.id as unknown) as number,
        is_select: item?.is_select || 0,
        stock: 10,
      };
    });
    return res.data;
  };
};

export type EditCartItemNumPayload = {
  id: number | string;
  num: number;
};

// 修改购物车商品数量
export const editCartItemNumAsync = (
  params: EditCartItemNumPayload,
): ThunkActionResult<Promise<UserCartEditResponse>> => {
  return async (dispatch, getState) => {
    const {token} = getState().persist.persistAuth;
    if (token) {
      const res = await CommonApi.userCartEditUsingPOST({
        cart_id: +params.id,
        operation_type: CART_ITEM_ACTION_ENUM.CHANGE_QTY,
        qty: params.num,
      });
      return res.data;
    }
    const preState = JSON.parse(JSON.stringify(getState())) as ReturnType<
      typeof getState
    >;
    const preCartState = preState.persist.persistCart;
    const cartItemIndex = preCartState.findIndex(({id}) => id === params.id);
    if (cartItemIndex !== -1) {
      const item = preCartState[cartItemIndex];
      item.qty = params.num;
      const max = item.productDetail.max_purchases_num;
      if (item.qty > max) {
        throw new ErrorMsg(
          `Sorry, the product add to the shopping bag has reached the maximum limit ${max}`,
          -9999,
        );
      }
      dispatch(addProduct2Cart(preCartState));
    }
    const cartState = getState().persist.persistCart;
    let totalNum = 0;
    cartState.forEach(({qty}) => {
      totalNum += qty;
    });
    return {
      is_success: true,
      total_num: totalNum,
    };
  };
};

// 修改购物车商品勾选状态
export const editCartSelectAsync = (
  params: CartSelectEditRequest,
): ThunkActionResult<Promise<void>> => {
  return async (dispatch, getState) => {
    const {token} = getState().persist.persistAuth;
    if (token) {
      const res = await CommonApi.cartSelectEditUsingPOST(params);
      return res.data;
    }
    const preState = JSON.parse(JSON.stringify(getState())) as ReturnType<
      typeof getState
    >;
    const preCartState = preState.persist.persistCart;
    params.list.forEach((item) => {
      const cartItem = preCartState.find(({id}) => id === item.id + '');
      if (cartItem) {
        cartItem.is_select = item.type;
      }
    });
    dispatch(addProduct2Cart(preCartState));
  };
};

export type DeleteCartItemPayload = {
  id: number | string;
};

// 删除购物车商品
export const deleteCartItemAsync = (
  params: DeleteCartItemPayload,
): ThunkActionResult<Promise<UserCartEditResponse>> => {
  return async (dispatch, getState) => {
    const {token} = getState().persist.persistAuth;
    if (token) {
      const res = await CommonApi.userCartEditUsingPOST({
        cart_id: +params.id,
        operation_type: CART_ITEM_ACTION_ENUM.REMOVE_ITEM,
        qty: 0,
      });
      return res.data;
    }
    const preState = JSON.parse(JSON.stringify(getState())) as ReturnType<
      typeof getState
    >;
    const preCartState = preState.persist.persistCart;
    const cartItemIndex = preCartState.findIndex(({id}) => id === params.id);
    if (cartItemIndex !== -1) {
      preCartState.splice(cartItemIndex, 1);
      dispatch(addProduct2Cart(preCartState));
    }
    const cartState = getState().persist.persistCart;
    let totalNum = 0;
    cartState.forEach(({qty}) => {
      totalNum += qty;
    });
    return {
      is_success: true,
      total_num: totalNum,
    };
  };
};

// 删除购物车下架商品
export const deleteCartExpireAsync = (
  params?: CartItem[],
): ThunkActionResult<Promise<UserCartEditResponse>> => {
  return async (dispatch, getState) => {
    const {token} = getState().persist.persistAuth;
    if (token) {
      const res = await CommonApi.userCartEditUsingPOST({
        operation_type: CART_ITEM_ACTION_ENUM.REMOVE_ALL_EXPIRE,
      });
      return res.data;
    }
    const preState = JSON.parse(JSON.stringify(getState())) as ReturnType<
      typeof getState
    >;
    const cartList = preState.persist.persistCart.filter(({productId, sku}) => {
      const item = params?.find((val) => {
        return val.product_id === productId && (sku[0] || '') === val.sku_no;
      });
      if (item) {
        return item.status === 0;
      }
      return true;
    });
    dispatch(addProduct2Cart(cartList));
    return {
      is_success: true,
      total_num: cartList.length,
    };
  };
};

/**
 * 未登录购物车订单请求参数
 * @returns
 */
export const cartOrderConfirmRequestDataAsync = (): ThunkActionResult<
  Promise<NoLoginOrderConfirmProductRequestItem[]>
> => {
  return async (_dispatch, getState) => {
    // 本地获取购物车数据
    const cartState = getState().persist.persistCart;
    // 构建未登录订单确认接口传参
    const list: NoLoginOrderConfirmProductRequestItem[] = cartState.map(
      ({productId, productType, qty, sku}) => {
        return {
          product_id: productId,
          product_type: productType,
          qty,
          sku_no: sku,
        };
      },
    );

    return list;
  };
};

// 数据同步
export const syncData = ({
  token,
  user_id,
  anonymous = false,
  email = '',
}: AuthPayload): ThunkActionResult<Promise<void>> => {
  return async (dispatch, getState) => {
    // 本地获取购物车数据
    const cartState = getState().persist.persistCart;
    // 构建未登录订单确认接口传参
    const list: UnLoginCartDataRequestItem[] = cartState.map(
      ({productId, productType, qty, sku, is_select}) => {
        return {
          product_id: productId,
          product_type: productType,
          qty,
          sku_no: sku,
          is_select: is_select || 0,
        };
      },
    );
    try {
      if (list.length) {
        await CommonApi.unLoginCartDataUsingPOST(
          {
            product_info: list,
          },
          {headers: {Authorization: token}},
        );
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}

    dispatch(clearCart());

    dispatch(auth({token, user_id, anonymous, email}));
  };
};

export const userProfileAsync = (): ThunkActionResult<
  Promise<UserProfilePayload>
> => {
  return async (dispatch) => {
    const res = await CommonApi.userProfileUsingPOST();
    dispatch(userProfile(res.data));
    return res.data;
  };
};
