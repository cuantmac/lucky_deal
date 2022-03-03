import {createStyleSheet} from '@src/helper/helper';
import {Message} from '@src/helper/message';
import {ReduxRootState, standardAction} from '@src/redux';
import {navigate2Login} from '@src/routes';
import {StandardButton, BUTTON_TYPE_ENUM} from '@src/widgets/button';
import React, {useCallback} from 'react';
import {useSelector, shallowEqual} from 'react-redux';

export const AuthButton = () => {
  const {token} = useSelector(
    (state: ReduxRootState) => ({
      token: state.persist.persistAuth.token,
    }),
    shallowEqual,
  );

  const handleBtnPress = useCallback(() => {
    if (token) {
      Message.confirm({
        content: 'Are you sure want to Sign Out?',
        actions: [
          {
            text: 'YES',
            onPress: () => {
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
  }, [token]);

  return (
    <StandardButton
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
