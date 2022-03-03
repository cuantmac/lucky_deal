import {handleActions} from 'redux-actions';
import {cartNum, CartNumPayLoad} from '../actions/standardAction';

// 处理购物车数量数据
export const cartNumReducer = handleActions<CartNumPayLoad, CartNumPayLoad>(
  {
    [cartNum.toString()]: (state, {payload}) => {
      return payload;
    },
  },
  0,
);

export default {
  cartNum: cartNumReducer,
};
