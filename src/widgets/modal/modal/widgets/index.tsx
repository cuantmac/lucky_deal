import {SCREEN_HEIGHT} from '@src/constants/constants';
import {createStyleSheet, px2dp} from '@src/helper/helper';
import {GlideImage} from '@src/widgets/glideImage';
import {Space} from '@src/widgets/space';
import React, {FC} from 'react';
import {
  StyleProp,
  TextStyle,
  ViewStyle,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {View, Text} from 'react-native';

interface ActionSheetContentProps {
  style?: StyleProp<ViewStyle>;
}
export const ActionSheetContent: FC<ActionSheetContentProps> = ({
  children,
  style,
}) => {
  return <View style={[ActionSheetStyles.content, style]}>{children}</View>;
};

export interface ActionSheetTitleProps {
  title?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}
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
          style={ActionSheetStyles.closeImageWrap}
          activeOpacity={0.8}
          onPress={onPress}>
          <GlideImage
            tintColor="#000"
            style={ActionSheetStyles.closeImage}
            source={require('@src/assets/close.png')}
          />
        </TouchableOpacity>
      </View>
      <Space height={1} backgroundColor="#e5e5e5" />
    </>
  );
};

interface ActionSheetScrollContentProps {
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}
export const ActionSheetScrollContent: FC<ActionSheetScrollContentProps> = ({
  children,
  style,
  contentContainerStyle,
}) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        {paddingBottom: px2dp(10), flexGrow: 0},
        contentContainerStyle,
      ]}
      style={[style]}>
      {children}
    </ScrollView>
  );
};

export const ACTION_SHEET_CONTENT_PADDING_HORIZONTAL = 16;

const ActionSheetStyles = createStyleSheet({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#000000cc',
  },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    paddingHorizontal: ACTION_SHEET_CONTENT_PADDING_HORIZONTAL,
    maxHeight: SCREEN_HEIGHT * 0.8,
    minHeight: SCREEN_HEIGHT * 0.4,
  },
  titleContainer: {
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  titleText: {
    fontSize: 14,
    color: '#222',
    fontWeight: '700',
  },
  closeImageWrap: {
    padding: 10,
    position: 'absolute',
    right: -10,
  },
  closeImage: {
    width: 14,
    height: 14,
  },
});
