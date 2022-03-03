import {createStyleSheet} from '@src/helper/helper';
import {GlideImage} from '@src/widgets/glideImage';
import React, {FC, useMemo} from 'react';
import {TouchableOpacity, Text, StyleProp, ViewStyle} from 'react-native';

export enum LOGIN_BUTTON_TYPE_ENUM {
  GOOGLE,
  FACEBOOK,
}

interface LoginButtonProps {
  type?: LOGIN_BUTTON_TYPE_ENUM;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const LoginButton: FC<LoginButtonProps> = ({
  type = LOGIN_BUTTON_TYPE_ENUM.GOOGLE,
  onPress,
  disabled,
  style,
}) => {
  const options = useMemo(() => {
    const google = {
      img: require('@src/assets/login_google_icon.png'),
      backgroundColor: 'white',
      borderColor: '#e5e5e5',
      textColor: '#222',
      text: 'Sign In With Google',
    };
    switch (type) {
      case LOGIN_BUTTON_TYPE_ENUM.FACEBOOK:
        return {
          img: require('@src/assets/login_facebook_icon.png'),
          backgroundColor: '#537BBC',
          borderColor: '#537BBC',
          textColor: '#fff',
          text: 'Sign In With Facebook',
        };
      case LOGIN_BUTTON_TYPE_ENUM.GOOGLE:
        return google;
      default:
        return google;
    }
  }, [type]);
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        LoginButtonStyles.container,
        {
          borderColor: options.borderColor,
          backgroundColor: options.backgroundColor,
        },
        style,
      ]}
      activeOpacity={0.8}>
      <GlideImage
        defaultSource={false}
        style={LoginButtonStyles.img}
        source={options.img}
      />
      <Text style={[LoginButtonStyles.text, {color: options.textColor}]}>
        {options.text}
      </Text>
    </TouchableOpacity>
  );
};

const LoginButtonStyles = createStyleSheet({
  container: {
    borderWidth: 1,
    height: 50,
    borderRadius: 50,
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 35,
    height: 35,
    position: 'absolute',
    left: 10,
  },
  text: {
    fontSize: 18,
  },
});
