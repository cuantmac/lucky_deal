import {createStyleSheet} from '@src/helper/helper';
import {GlideImage} from '@src/widgets/glideImage';
import React, {FC} from 'react';
import {TextStyle, ViewStyle, TouchableOpacity, Text} from 'react-native';

interface PayInfoItemProps {
  title: string;
  text: string;
  onPress?: () => void;
  textStyle?: TextStyle;
  titleStyle?: TextStyle;
  containerStyle?: ViewStyle;
  showPressIcon?: boolean;
}

/**
 * 列表条目
 *
 * @param param0 PayInfoItemProps
 */
export const PayInfoItem: FC<PayInfoItemProps> = ({
  title,
  text,
  onPress,
  textStyle,
  titleStyle,
  containerStyle,
  showPressIcon = false,
}) => {
  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={onPress}
      activeOpacity={0.8}
      style={[PayInfoItemStyles.container, containerStyle]}>
      <Text style={[PayInfoItemStyles.titleText, titleStyle]}>{title}</Text>
      <Text style={[PayInfoItemStyles.subText, textStyle]}>{text}</Text>
      {(!!onPress || showPressIcon) && (
        <GlideImage
          style={PayInfoItemStyles.icon}
          resizeMode={'contain'}
          source={require('@src/assets/me_arrow.png')}
        />
      )}
    </TouchableOpacity>
  );
};

const PayInfoItemStyles = createStyleSheet({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
  },
  titleText: {
    fontSize: 12,
    color: '#222',
    flex: 1,
  },
  subText: {
    fontSize: 12,
    color: '#222',
  },
  icon: {
    width: 10,
    height: 10,
    marginLeft: 8,
  },
});
