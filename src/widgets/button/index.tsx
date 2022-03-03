import {createStyleSheet} from '@src/helper/helper';
import React, {FC} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import {LoadingIndicator} from '../loadingIndicator';

export enum BUTTON_TYPE_ENUM {
  STANDARD,
  HIGH_LIGHT,
}

export interface StandardButtonProps {
  title?: string;
  disabledTitle?: string;
  disabled?: boolean;
  onPress?: () => void;
  type?: BUTTON_TYPE_ENUM;
  wrapStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
}

export const StandardButton: FC<StandardButtonProps> = ({
  title = 'button',
  disabledTitle,
  disabled,
  onPress,
  type,
  wrapStyle,
  containerStyle,
  textStyle,
  loading,
}) => {
  return (
    <TouchableOpacity
      disabled={loading || disabled}
      activeOpacity={0.8}
      style={[StandardButtonStyles.containerWrap, wrapStyle]}
      onPress={onPress}>
      <View
        style={[
          StandardButtonStyles.container,
          type === BUTTON_TYPE_ENUM.HIGH_LIGHT
            ? StandardButtonStyles.buyNowContainer
            : undefined,
          {opacity: disabled ? 0.5 : 1},
          containerStyle,
        ]}>
        {loading ? (
          <LoadingIndicator
            size={20}
            color={type === BUTTON_TYPE_ENUM.HIGH_LIGHT ? 'white' : '#222'}
          />
        ) : (
          <Text
            style={[
              StandardButtonStyles.text,
              type === BUTTON_TYPE_ENUM.HIGH_LIGHT
                ? StandardButtonStyles.buyNowText
                : undefined,
              textStyle,
            ]}>
            {disabled ? disabledTitle || title : title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const StandardButtonStyles = createStyleSheet({
  containerWrap: {
    height: 40,
  },
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#222',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222',
  },
  buyNowContainer: {
    backgroundColor: '#222',
  },
  buyNowText: {
    color: 'white',
  },
});
