/* eslint-disable @typescript-eslint/no-explicit-any */
import {bindActionCreators as reduxBindActionCreators, AnyAction} from 'redux';
import {ThunkAction} from 'redux-thunk';
import {ReducerRootState, store} from './reducers';
import * as thunkActions from './actions/thunkAction';
import * as standardActions from './actions/standardAction';

export {store, ReduxProvider} from './reducers';

// 参考链接 https://github.com/reduxjs/redux-thunk/blob/master/test/typescript.ts
declare module 'redux' {
  /**
   * Overload for bindActionCreators redux function, returns expects responses
   * from thunk actions
   */
  function bindActionCreators<
    TActionCreators extends ActionCreatorsMapObject<any>
  >(
    actionCreators: TActionCreators,
    dispatch: Dispatch,
  ): {
    [TActionCreatorName in keyof TActionCreators]: ReturnType<
      TActionCreators[TActionCreatorName]
    > extends ThunkAction<any, any, any, any>
      ? (
          ...args: Parameters<TActionCreators[TActionCreatorName]>
        ) => ReturnType<ReturnType<TActionCreators[TActionCreatorName]>>
      : TActionCreators[TActionCreatorName];
  };

  /*
   * Overload to add thunk support to Redux's dispatch() function.
   * Useful for react-redux or any other library which could use this type.
   */
  export interface Dispatch<A extends Action = AnyAction> {
    <TReturnType = any, TState = any, TExtraThunkArg = any>(
      thunkAction: ThunkAction<TReturnType, TState, TExtraThunkArg, A>,
    ): TReturnType;
  }
}

type ThunkActionType = (
  ...args: any[]
) => ThunkAction<any, any, any, AnyAction>;

type ThunkActionDispatch<TActionCreator extends ThunkActionType> = (
  ...args: Parameters<TActionCreator>
) => ReturnType<ReturnType<TActionCreator>>;

type AsyncActionDispatch<T extends Record<string, ThunkActionType>> = {
  [K in keyof T]: ThunkActionDispatch<T[K]>;
};

/**
 * 将redux-thunk 的action和 正常的action和diapatch直接绑定。
 * 当您需要使用的时候调用action里面的方法即可
 * asyncAction支持返回值
 *
 * 方便之处
 * 1、如果您使用class组件， 在connect时您将省略mapDispatchToProps方法
 * 2、如果您使用函数式组件，您将省略useDispatch
 * 3、方便action在任何地方使用dui
 *
 */

// redux-thunk 异步 action
export const thunkAction: AsyncActionDispatch<typeof thunkActions> = reduxBindActionCreators(
  thunkActions,
  store.dispatch,
);

// 正常的 action
export const standardAction: typeof standardActions = reduxBindActionCreators(
  standardActions,
  store.dispatch,
);

export type ReduxRootState = ReducerRootState;
