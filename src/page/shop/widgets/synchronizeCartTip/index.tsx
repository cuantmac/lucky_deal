import {createStyleSheet} from '@src/helper/helper';
import {ReduxRootState} from '@src/redux';
import {navigate2Login} from '@src/routes';
import {BUTTON_TYPE_ENUM, StandardButton} from '@src/widgets/button';
import React, {FC, useCallback} from 'react';
import {View, Text} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';

export const SynchronizeCartTip: FC = () => {
  const {token} = useSelector(
    (state: ReduxRootState) => ({
      token: state.persist.persistAuth.token,
    }),
    shallowEqual,
  );

  const handleSignInPress = useCallback(() => {
    navigate2Login();
  }, []);

  if (token) {
    return null;
  }
  return (
    <View style={SynchronizeCartTipStyles.container}>
      <Text style={SynchronizeCartTipStyles.text}>
        Login in to synchronize your shopping bag
      </Text>
      <StandardButton
        textStyle={SynchronizeCartTipStyles.buttonText}
        wrapStyle={SynchronizeCartTipStyles.buttonWrap}
        containerStyle={SynchronizeCartTipStyles.buttonContainer}
        type={BUTTON_TYPE_ENUM.HIGH_LIGHT}
        title={'SIGN IN'}
        onPress={handleSignInPress}
      />
    </View>
  );
};

const SynchronizeCartTipStyles = createStyleSheet({
  container: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 14,
    color: '#222',
  },
  buttonWrap: {
    height: 22,
  },
  buttonContainer: {
    paddingHorizontal: 6,
  },
  buttonText: {
    fontSize: 10,
  },
});
