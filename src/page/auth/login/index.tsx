import React, {FC, useCallback, useState} from 'react';
import 'whatwg-fetch';
import {LoginButton, LOGIN_BUTTON_TYPE_ENUM} from './widgets/loginButton';
import {createStyleSheet, isWeb} from '@src/helper/helper';
import {View} from 'react-native';
import {useNavigationHeader} from '@src/widgets/navigationHeader';
import {LoginAction, LoginActionProps} from './widgets/loginAction';
import {thunkAction} from '@src/redux';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {PlatformLogin} from './widgets/platformLogin';
import {GlideImage} from '@src/widgets/glideImage';
import {EmailLogin} from './widgets/emailLogin';

declare const getChannelId: () => string;

const Login: FC = () => {
  const dispatch = useDispatch();
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  useNavigationHeader({
    title: 'Sign In',
    backIcon: (
      <GlideImage
        tintColor="black"
        defaultSource={false}
        source={require('@src/assets/close.png')}
        style={LoginStyles.closeIcon}
      />
    ),
  });

  const handleSuccess = useCallback<LoginActionProps['onSuccess']>(
    async (res) => {
      if (!isWeb()) {
        // 兼容旧版APP
        dispatch({
          type: 'setToken',
          payload: res.data,
        });
        AsyncStorage.setItem('token', res.data.token as string);
        AsyncStorage.setItem(
          'user_id',
          (res.data.user_id as number).toString(),
        );
      }
      try {
        await thunkAction.userProfileAsync();
      } catch (error) {}
      return thunkAction.syncData(res.data);
    },
    [dispatch],
  );

  return showEmailLogin ? (
    <EmailLogin onSuccess={handleSuccess} />
  ) : (
    <PlatformLogin
      onSuccess={handleSuccess}
      onEmailSignInPress={() => {
        setShowEmailLogin(true);
      }}
    />
  );
};

const LoginStyles = createStyleSheet({
  closeIcon: {
    width: 16,
    height: 16,
  },
});

export default Login;
