import React from 'react';
import {FC} from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {PRIMARY} from '../../constants/colors';
import {px} from '../../constants/constants';

interface ButtonProps {
  loading?: boolean;
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

export const Button: FC<ButtonProps> = ({
  loading,
  title = 'Button',
  onPress,
  disabled,
  textStyle,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      style={[
        {
          backgroundColor: PRIMARY,
          width: '100%',
          height: 120 * px,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20 * px,
        },
        style,
      ]}
      onPress={onPress}>
      {loading ? (
        <ActivityIndicator color={'white'} />
      ) : (
        <Text
          style={[
            {
              color: 'white',
              fontSize: 50 * px,
            },
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
