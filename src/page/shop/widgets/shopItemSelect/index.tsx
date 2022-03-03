import {createStyleSheet} from '@src/helper/helper';
import {GlideImage} from '@src/widgets/glideImage';
import React, {FC} from 'react';
import {View, TouchableOpacity, ViewStyle} from 'react-native';

export interface ShopItemSelectProps {
  style?: ViewStyle;
  disabled?: boolean;
  onChange?: (bool: boolean) => void;
  checked?: boolean;
}

export const ShopItemSelect: FC<ShopItemSelectProps> = ({
  children,
  checked,
  disabled,
  onChange,
  style,
}) => {
  return (
    <View style={[ShopItemSelectStyles.container, style]}>
      {children}
      <TouchableOpacity
        onPress={() => onChange && onChange(!checked)}
        activeOpacity={0.8}
        disabled={disabled}
        style={ShopItemSelectStyles.actionContainer}>
        <View
          style={[
            ShopItemSelectStyles.default,
            {
              opacity: disabled ? 0.5 : 1,
            },
            checked
              ? ShopItemSelectStyles.checked
              : ShopItemSelectStyles.unChecked,
          ]}>
          {checked && (
            <GlideImage
              source={require('@src/assets/shop_checked_icon.png')}
              style={ShopItemSelectStyles.checkedImg}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const ShopItemSelectStyles = createStyleSheet({
  container: {
    position: 'relative',
    paddingLeft: 48,
  },
  actionContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    width: 70,
    paddingLeft: 16,
  },
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
