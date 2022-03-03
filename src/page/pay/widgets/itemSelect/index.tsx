import {createStyleSheet} from '@src/helper/helper';
import {GlideImage} from '@src/widgets/glideImage';
import React, {FC, ReactNode} from 'react';
import {View, TouchableOpacity, ViewStyle} from 'react-native';

export interface ItemSelectProps {
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  extraContentStyle?: ViewStyle;
  disabled?: boolean;
  onChange?: (bool: boolean) => void;
  checked?: boolean;
  extraChildren?: ReactNode;
}

export const ItemSelect: FC<ItemSelectProps> = ({
  style,
  onChange,
  checked,
  disabled,
  children,
  extraChildren,
  contentStyle,
  extraContentStyle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={style}
      disabled={disabled}
      onPress={() => onChange && onChange(!checked)}>
      <View style={{opacity: disabled ? 0.5 : 1}}>
        <View style={ItemSelectStyles.topContainer}>
          <View
            style={[
              ItemSelectStyles.default,
              {
                opacity: disabled ? 0.5 : 1,
              },
              checked ? ItemSelectStyles.checked : ItemSelectStyles.unChecked,
            ]}>
            {checked && (
              <GlideImage
                source={require('@src/assets/shop_checked_icon.png')}
                style={ItemSelectStyles.checkedImg}
              />
            )}
          </View>
          <View style={[ItemSelectStyles.topContent, contentStyle]}>
            {children}
          </View>
        </View>
        <View style={[ItemSelectStyles.extraContent, extraContentStyle]}>
          {extraChildren}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ItemSelectStyles = createStyleSheet({
  container: {},
  default: {
    width: 16,
    height: 16,
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
    borderWidth: 0,
    borderColor: 'transparent',
  },
  checkedImg: {
    width: '100%',
    height: '100%',
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topContent: {
    flex: 1,
    marginLeft: 12,
  },
  extraContent: {
    marginLeft: 28,
  },
});
