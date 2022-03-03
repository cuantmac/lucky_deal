import React, {FC, ReactElement, useCallback, useEffect, useRef} from 'react';
import queryString from 'query-string';
import 'whatwg-fetch';
import {Message} from '@src/helper/message';
import {ReduxRootState, standardAction} from '@src/redux';
import {loginApi} from '@src/apis';
import {ResponseDataRegisterResponse} from '@luckydeal/api-common';
import {
  GoogleLogin,
  GoogleLoginProps,
  GoogleLoginResponse,
} from 'react-google-login';
import {useSelector} from 'react-redux';
import {BrowserTools} from '@src/helper/browserTools';
import {goback, LoginRoute, LoginRouteParams} from '@src/routes';
import {useNavigationParams} from '@src/hooks/useNavigationParams';
import {StyleProp, View, ViewStyle} from 'react-native';

type RenderFn = (params: {
  onPress: () => void;
  disabled?: boolean;
}) => ReactElement;

export interface LoginActionProps {
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
  const backUrl = useSelector(
    (state: ReduxRootState) => state.persist.persistRedirectUrl,
  );
  const {redirectUrl: loginRedirectUrl} = useNavigationParams<
    LoginRouteParams
  >();
  const facebookRedirect = window.location.origin + LoginRoute.path;
  const googleRedirect = facebookRedirect;
  const {fragmentIdentifier, query} = queryString.parseUrl(window.URL_CACHE, {
    parseFragmentIdentifier: true,
  });
  const facebookIdentifier =
    fragmentIdentifier && queryString.parse(fragmentIdentifier);
  const backUrlRef = useRef<string>();
  if (backUrl) {
    backUrlRef.current = backUrl;
  }
  const LoginRouter = LoginRoute.useRouteLink();

  const handleAuthRes = useCallback(
    async (res: ResponseDataRegisterResponse) => {
      await onSuccess(res);
      Message.hide();
      goback();
    },
    [onSuccess],
  );

  const handleFacebookBthClick = useCallback(() => {
    window.location.replace(
      `https://www.facebook.com/v10.0/dialog/oauth?client_id=${process.env.REACT_APP_FACEBOOK_CLIENT_KEY}&redirect_uri=${facebookRedirect}&response_type=code%20token&scope=email,public_profile`,
    );
  }, [facebookRedirect]);

  const responseGoogle = useCallback<
    NonNullable<GoogleLoginProps['onSuccess']>
  >(
    (googleRes) => {
      if (googleRes.code) {
        return;
      }
      Message.loading();
      const res = googleRes as GoogleLoginResponse;
      loginApi({
        email: res.profileObj.email,
        googleId: res.googleId,
        name: `${res.profileObj.givenName} ${res.profileObj.familyName}`,
        avatar: res.profileObj.imageUrl,
        googleToken: res.tokenId,
      })
        .then((authRes) => {
          return handleAuthRes(authRes);
        })
        .catch((e) => {
          LoginRouter.replace();
          Message.toast(e);
        });
    },
    [LoginRouter, handleAuthRes],
  );

  useEffect(() => {
    if (facebookIdentifier && facebookIdentifier.access_token) {
      Message.loading();
      facebookFetch(
        `https://graph.facebook.com/me?fields=id,name,picture,email&access_token=${facebookIdentifier.access_token}`,
      )
        .then((res) => {
          return loginApi({
            fbId: res.id,
            name: res.name,
            avatar: res.picture.data.url,
            facebookToken: facebookIdentifier.access_token as string,
          });
        })
        .then((res) => {
          return handleAuthRes(res);
        })
        .catch((e) => {
          LoginRouter.replace();
          Message.toast(e);
        });
    }
    if (query.error) {
      LoginRouter.replace();
    }
  }, [LoginRouter, facebookIdentifier, handleAuthRes, query.error]);

  useEffect(() => {
    loginRedirectUrl && standardAction.redirectUrl(loginRedirectUrl);
  }, [loginRedirectUrl]);

  return (
    <View style={style}>
      {!BrowserTools.isTiktok() && (
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_KEY as string}
          autoLoad={false}
          isSignedIn
          redirectUri={googleRedirect}
          uxMode={'popup'}
          onSuccess={responseGoogle}
          render={(renderProps) =>
            renderGoogleBtn({
              onPress: renderProps.onClick,
              disabled: renderProps.disabled,
            })
          }
        />
      )}
      {renderFacebookBtn({onPress: handleFacebookBthClick})}
    </View>
  );
};

/**
 *
 *
 * @param url
 * @returns
 */
function facebookFetch(url: string) {
  return fetch(url).then((response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    }
    throw response;
  });
}
