import {createStyleSheet} from '@src/helper/helper';
import {Message} from '@src/helper/message';
import {ReduxRootState, standardAction} from '@src/redux';
import {navigate2Login} from '@src/routes';
import {StandardButton, BUTTON_TYPE_ENUM} from '@src/widgets/button';
import React, {useCallback} from 'react';
import {useGoogleLogout} from 'react-google-login';
import {useSelector, shallowEqual} from 'react-redux';

export const AuthButton = () => {
  const {token} = useSelector(
    (state: ReduxRootState) => ({
      token: state.persist.persistAuth.token,
    }),
    shallowEqual,
  );

  const handleGoogleLogout = useCallback(() => {}, []);

  const handleGoogleFailure = useCallback(() => {}, []);

  const {signOut, loaded} = useGoogleLogout({
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_KEY as string,
    onFailure: handleGoogleFailure,
    onLogoutSuccess: handleGoogleLogout,
  });

  const handleBtnPress = useCallback(() => {
    if (token) {
      Message.confirm({
        content: 'Are you sure want to Sign Out?',
        actions: [
          {
            text: 'YES',
            onPress: () => {
              if (loaded) {
                signOut();
              }
              standardAction.signOut();
            },
          },
          {
            text: 'NO',
            onPress: () => {},
            type: BUTTON_TYPE_ENUM.HIGH_LIGHT,
          },
        ],
      });
    } else {
      navigate2Login();
    }
  }, [loaded, signOut, token]);

  return (
    <StandardButton
      loading={!loaded}
      onPress={handleBtnPress}
      type={BUTTON_TYPE_ENUM.HIGH_LIGHT}
      wrapStyle={AuthButtonStyles.buttonContainer}
      title={token ? 'SIGN OUT' : 'SIGN IN / REGISTER'}
    />
  );
};

const AuthButtonStyles = createStyleSheet({
  buttonContainer: {
    marginHorizontal: 12,
    marginTop: 16,
  },
});
