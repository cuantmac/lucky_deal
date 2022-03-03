import {createStyleSheet} from '@src/helper/helper';
import {GlideImage} from '@src/widgets/glideImage';
import React, {FC} from 'react';
import {View, Text} from 'react-native';
import {LoginAction, LoginActionProps} from '../loginAction';
import {LOGIN_BUTTON_TYPE_ENUM, LoginButton} from '../loginButton';
import {LoginBottomContainer, LoginFooter} from '../widgets';

interface PlatformLoginProps {
  onSuccess: LoginActionProps['onSuccess'];
  onEmailSignInPress: () => void;
}

export const PlatformLogin: FC<PlatformLoginProps> = ({
  onSuccess,
  onEmailSignInPress,
}) => {
  return (
    <View style={LoginStyles.container}>
      <View style={LoginStyles.iconWrap}>
        <GlideImage
          style={LoginStyles.icon}
          source={require('@src/assets/gesleben_icon.png')}
        />
      </View>

      <LoginAction
        renderFacebookBtn={({onPress}) => {
          return (
            <LoginButton
              style={LoginStyles.facebookBtn}
              type={LOGIN_BUTTON_TYPE_ENUM.FACEBOOK}
              onPress={onPress}
            />
          );
        }}
        renderGoogleBtn={({onPress, disabled}) => {
          return (
            <LoginButton
              type={LOGIN_BUTTON_TYPE_ENUM.GOOGLE}
              onPress={onPress}
              disabled={disabled}
            />
          );
        }}
        onSuccess={onSuccess}
      />
      <Text style={LoginStyles.text} onPress={onEmailSignInPress}>
        Have an account? <Text style={LoginStyles.linkText}>Sign in</Text>
      </Text>
      <LoginBottomContainer>
        <LoginFooter />
      </LoginBottomContainer>
    </View>
  );
};

const LoginStyles = createStyleSheet({
  container: {
    paddingTop: 50,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    paddingBottom: 30,
    flex: 1,
  },
  iconWrap: {
    alignItems: 'center',
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 50,
  },
  facebookBtn: {
    marginTop: 20,
  },
  text: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: '#222',
  },
});
