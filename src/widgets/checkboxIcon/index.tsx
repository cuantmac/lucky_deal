import {createStyleSheet} from '@src/helper/helper';
import React, {FC} from 'react';
import {ImageStyle, StyleProp, View, ViewStyle} from 'react-native';
import {GlideImage} from '../glideImage';

interface CheckBoxIconProps {
  disabled?: boolean;
  checked?: boolean;
  style?: StyleProp<ViewStyle>;
  unCheckedStyle?: StyleProp<ViewStyle>;
  checkedStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

export const CheckBoxIcon: FC<CheckBoxIconProps> = ({
  disabled = false,
  checked = false,
  style,
  checkedStyle,
  unCheckedStyle,
  imageStyle,
}) => {
  return (
    <View
      style={[
        CheckBoxIconStyles.default,
        {
          opacity: disabled ? 0.5 : 1,
        },
        checked ? CheckBoxIconStyles.checked : CheckBoxIconStyles.unChecked,
        style,
        checked ? checkedStyle : unCheckedStyle,
      ]}>
      {checked && (
        <GlideImage
          source={require('@src/assets/shop_checked_icon.png')}
          style={[CheckBoxIconStyles.checkedImg, imageStyle]}
        />
      )}
    </View>
  );
};

const CheckBoxIconStyles = createStyleSheet({
  default: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unChecked: {
    borderColor: '#979797',
  },
  checked: {
    width: 20,
    height: 20,
    borderColor: 'transparent',
  },
  checkedImg: {
    width: '100%',
    height: '100%',
  },
});
