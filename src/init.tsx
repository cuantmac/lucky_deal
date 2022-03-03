import React, {FC, useEffect} from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {ReduxRootState, thunkAction} from './redux';

export const Init: FC = () => {
  const {token} = useSelector(
    (state: ReduxRootState) => ({
      token: state.persist.persistAuth.token,
    }),
    shallowEqual,
  );
  useEffect(() => {
    if (token) {
      thunkAction.userProfileAsync();
    }
  }, [token]);
  return null;
};
