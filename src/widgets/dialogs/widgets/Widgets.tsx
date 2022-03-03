import {createStyleSheet, styleAdapter} from '@src/helper/helper';
import React, {FC, useRef, useEffect} from 'react';
import {useWindowDimensions, Easing} from 'react-native';
import {
  Image,
  StyleProp,
  TextStyle,
  ViewStyle,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {View, Text} from 'react-native';
import {Space} from '../../../components/common/Space';

interface ActionSheetContainerProps {
  style?: StyleProp<ViewStyle>;
}
/**
 * @deprecated 待删除
 */
export const ActionSheetContainer: FC<ActionSheetContainerProps> = ({
  children,
  style,
}) => {
  return <View style={[ActionSheetStyles.container, style]}>{children}</View>;
};

interface ActionSheetContentProps {
  style?: StyleProp<ViewStyle>;
}
/**
 * @deprecated 待删除
 */
export const ActionSheetContent: FC<ActionSheetContentProps> = ({
  children,
  style,
}) => {
  const {height} = useWindowDimensions();
  const viewAnimate = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(viewAnimate, {
      duration: 300,
      toValue: 1,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [viewAnimate]);
  return (
    <Animated.View
      style={[
        ActionSheetStyles.content,
        {
          transform: [
            {
              translateY: viewAnimate.interpolate({
                inputRange: [0, 1],
                outputRange: [height, 0],
              }),
            },
          ],
        },
        style,
      ]}>
      {children}
    </Animated.View>
  );
};

export interface ActionSheetTitleProps {
  title?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}
/**
 * @deprecated 待删除
 */
export const ActionSheetTitle: FC<ActionSheetTitleProps> = ({
  title = 'title',
  style,
  textStyle,
  onPress,
}) => {
  return (
    <>
      <View style={[ActionSheetStyles.titleContainer, style]}>
        <Text style={[ActionSheetStyles.titleText, textStyle]}>{title}</Text>
        <TouchableOpacity
          style={ActionSheetStyles.closeImage}
          activeOpacity={0.8}
          onPress={onPress}>
          <Image
            style={ActionSheetStyles.closeImage}
            source={require('../../../assets/ic_sku_close.png')}
          />
        </TouchableOpacity>
      </View>
      <Space height={2} />
    </>
  );
};

interface ActionSheetScrollContentProps {
  style?: StyleProp<ViewStyle>;
}
/**
 * @deprecated 待删除
 */
export const ActionSheetScrollContent: FC<ActionSheetScrollContentProps> = ({
  children,
  style,
}) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styleAdapter({paddingBottom: 30}, true)}
      style={[{flex: 1}, style]}>
      {children}
    </ScrollView>
  );
};

const ActionSheetStyles = createStyleSheet(
  {
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: '#000000cc',
    },
    content: {
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 28,
      height: 1100,
    },
    titleContainer: {
      height: 121,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    titleText: {
      fontSize: 38,
    },
    closeImage: {
      width: 60,
      height: 60,
      position: 'absolute',
      right: 0,
    },
  },
  true,
);
