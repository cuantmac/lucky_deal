import {ResponseDataRegisterResponse} from '@luckydeal/api-common';
import React, {FC, ReactElement, useCallback} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';
import {Message} from '@src/helper/message';
import {loginApi} from '@src/apis';
import {goback} from '@src/routes';

type RenderFn = (params: {
  onPress: () => void;
  disabled?: boolean;
}) => ReactElement;

interface LoginActionProps {
  renderFacebookBtn: RenderFn;
  renderGoogleBtn: RenderFn;
  style?: StyleProp<ViewStyle>;
  onSuccess: (res: ResponseDataRegisterResponse) => Promise<void>;
}

export const LoginAction: FC<LoginActionProps> = ({
  style,
  renderFacebookBtn,
  renderGoogleBtn,
  onSuccess,
}) => {
  // google 登陆
  const handleGoogleLogin = useCallback(async () => {
    Message.loading();
    try {
      await GoogleSignin.hasPlayServices();
      const googleData = await GoogleSignin.signIn();
      if (googleData && googleData.idToken) {
        try {
          const res = await loginApi({
            googleId: googleData.user.id,
            googleToken: googleData.idToken,
            avatar: googleData.user.photo as string,
            name: googleData.user.name as string,
            email: googleData.user.email,
          });
          await onSuccess(res);
          Message.hide();
          goback();
        } catch (error) {
          Message.toast(error);
        }
        return;
      }
      Message.hide();
    } catch (error) {
      if ((error as any).code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Message.toast(error);
        return;
      }
      Message.hide();
    }
  }, [onSuccess]);

  // facebook 登陆
  const handleFacebookLogin = useCallback(async () => {
    Message.loading();
    const facebookData = await LoginManager.logInWithPermissions([
      'email',
      'public_profile',
    ]);
    if (facebookData.isCancelled) {
      Message.hide();
      return;
    }
    const facebookAccessToken = await AccessToken.getCurrentAccessToken();
    if (!facebookAccessToken) {
      Message.hide();
      return;
    }
    const graphRequest = new GraphRequest(
      '/me',
      {
        accessToken: facebookAccessToken.accessToken,
        parameters: {
          fields: {
            string: 'email,name,picture',
          },
        },
      },
      async (graphError, result: any) => {
        if (graphError) {
          Message.toast('Login error');
        }
        try {
          rlog('graphRequest', graphRequest);
          let res = await loginApi({
            fbId: result.id,
            facebookToken: facebookAccessToken.accessToken,
            name: result.name,
            avatar: result.picture.data.url,
          });
          await onSuccess(res);
          Message.hide();
          goback();
        } catch (error) {
          Message.toast(error);
        }
      },
    );
    new GraphRequestManager().addRequest(graphRequest).start();
  }, [onSuccess]);

  return (
    <View style={style}>
      {renderGoogleBtn({onPress: handleGoogleLogin})}
      {renderFacebookBtn({onPress: handleFacebookLogin})}
    </View>
  );
};
