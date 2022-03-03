import {applyMiddleware, combineReducers, createStore} from 'redux';
import storage from '@react-native-community/async-storage';
import {persistReducer, persistStore} from 'redux-persist';
import thunk from 'redux-thunk';
import React, {FC, useEffect} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import persistReducerGroup from './persistReducer';
import standardReducerGroup from './standardReducer';
import deprecatedPersistReducers from '../persistReducers';
import deprecatedMemoryReducers from '../memoryReducers';

/**
 * @deprecated 旧redux持久化配置 将逐步移除
 */
const deprecatedPersist = persistReducer(
  {
    key: 'root',
    storage,
  },
  (deprecatedPersistReducers as unknown) as any,
);

const persist = persistReducer(
  {
    key: 'persist',
    storage,
  },
  combineReducers({...persistReducerGroup}),
);

// 所有的reducer在这进行组合
const rootReducer = combineReducers({
  /**
   * @deprecated 已经过时 将逐步移除
   */
  memory: deprecatedMemoryReducers,
  /**
   * @deprecated 已经过时 将逐步移除
   */
  deprecatedPersist: deprecatedPersist,
  ...standardReducerGroup,
  persist,
});

// ReducerRootState 为整个redux state的状态
export type ReducerRootState = ReturnType<typeof rootReducer>;

// 生成store
export const store = createStore(rootReducer, applyMiddleware(thunk));

// 持久化数据
export const persistor = persistStore(store);

// redux store provider
export const ReduxProvider: FC = ({children}) => {
  useEffect(() => {
    // 在微前端中react 发生 unmount 和 mount时需要重新同步 localstorage
    // 否则会出现 localstorage发生变化，但是redux数据未更新的问题
    if (window.__POWERED_BY_QIANKUN__) {
      store.getState().persist._persist = (null as unknown) as any;
      persistor.persist();
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default rootReducer;
