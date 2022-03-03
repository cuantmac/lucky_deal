import {createStyleSheet} from '@src/helper/helper';
import React, {FC, ReactNode} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import {GlideImage} from '../glideImage';
import {Space} from '../space';

/**
 * 建议
 * 在 containerStyle 自定义左右边距
 * 在 wrapStyle 自定义高度
 */

interface ListItemProps {
  containerStyle?: ViewStyle;
  wrapStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  leftContainerStyle?: ViewStyle;
  rightContainerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  valueStyle?: TextStyle;
  pressIconStyle?: ImageStyle;
  onPress?: () => void;
  title?: string;
  value?: string;
  // 在左侧插入组件（会插在title的左侧）
  leftInsert?: ReactNode;
  // 在右侧插入组件 （会插在value的左侧）
  rightInsert?: ReactNode;
  showBottomLine?: boolean;
  // 强制隐藏点击icon
  forceHidePressIcon?: boolean;
}

export const ListItem: FC<ListItemProps> = ({
  containerStyle,
  contentStyle,
  wrapStyle,
  leftContainerStyle,
  rightContainerStyle,
  titleStyle,
  valueStyle,
  pressIconStyle,
  onPress,
  title = 'title',
  value,
  leftInsert,
  rightInsert,
  showBottomLine = false,
  forceHidePressIcon = false,
}) => {
  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={onPress}
      activeOpacity={0.8}
      style={[ListItemStyles.containerStyle, containerStyle]}>
      <View style={[ListItemStyles.wrap, wrapStyle]}>
        <View style={[ListItemStyles.content, contentStyle]}>
          <View style={[ListItemStyles.leftContainer, leftContainerStyle]}>
            {leftInsert}
            <Text style={[ListItemStyles.title, titleStyle]}>{title}</Text>
          </View>
          <View style={[ListItemStyles.rightContainer, rightContainerStyle]}>
            {rightInsert}
            {!!value && (
              <Text style={[ListItemStyles.value, valueStyle]}>{value}</Text>
            )}
            {!forceHidePressIcon && !!onPress && (
              <GlideImage
                defaultSource={false}
                tintColor={'#999'}
                style={[ListItemStyles.pressIcon, pressIconStyle]}
                source={require('@src/assets/thiny_black_icon.png')}
              />
            )}
          </View>
        </View>
        <View style={{position: 'absolute', bottom: 0, left: 0, width: '100%'}}>
          {showBottomLine && <Space height={1} backgroundColor={'#e5e5e5'} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ListItemStyles = createStyleSheet({
  containerStyle: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  wrap: {
    minHeight: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  content: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    color: '#222',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 12,
    color: '#222',
  },
  pressIcon: {
    width: 10,
    height: 10,
    marginLeft: 6,
  },
});
