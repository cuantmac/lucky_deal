import React, {useEffect} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import {px, SCREEN_WIDTH} from '../../constants/constants';
import AppModule from '../../../AppModule';
export default function GoodsBottomButtons({
  style,
  goodsDetail,
  leftLoading,
  leftOnPress,
  rightOnPress,
  buttonContent,
  rightButtonStyle,
}) {
  const half = leftOnPress && rightOnPress;
  return (
    <View
      style={[
        style,
        {
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 30 * px,
        },
      ]}>
      {leftOnPress && (
        <AddToBagButton
          half={half}
          onPress={leftOnPress}
          leftLoading={leftLoading}
        />
      )}
      {rightOnPress && (
        <BuyNowButton
          half={half}
          onPress={rightOnPress}
          buttonContent={buttonContent}
          style={rightButtonStyle}
        />
      )}
    </View>
  );
}

/**
 * 加入购物车按钮
 * @param half 是否占一行，
 * @param onPress 点击触发操作。
 * @returns {*}
 * @constructor
 */
export const AddToBagButton = ({half, onPress, leftLoading}) => {
  useEffect(() => {
    AppModule.reportShow('3', '296');
  }, []);
  return (
    <TouchableOpacity
      onPress={() => {
        if (!leftLoading) {
          onPress();
        }
      }}
      activeOpacity={0.6}
      style={{
        width: half ? (SCREEN_WIDTH - 106 * px) / 2 : SCREEN_WIDTH - 60 * px,
        height: 136 * px,
        borderRadius: 20 * px,
        backgroundColor: '#FFA336',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
      }}>
      {leftLoading ? (
        <ActivityIndicator color={'white'} style={{flex: 1}} />
      ) : (
        <Text style={{fontSize: 54 * px, color: '#fff'}} numberOfLines={1}>
          Add to Bag
        </Text>
      )}
    </TouchableOpacity>
  );
};

/**
 * buy now 按钮
 * @param half 是否占一行。
 * @param onPress 点击触发操作。
 * @param buttonContent 按钮显示文本。
 * @returns {*}
 * @constructor
 */
export const BuyNowButton = ({half, onPress, buttonContent, style}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={{
        width: half ? (SCREEN_WIDTH - 106 * px) / 2 : SCREEN_WIDTH - 60 * px,
        height: 136 * px,
        borderRadius: 20 * px,
        backgroundColor: style?.backgroundColor
          ? style?.backgroundColor
          : '#F04A33',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontSize: buttonContent?.length > 16 ? 50 * px : 54 * px,
          color: style?.textColor ? style?.textColor : '#fff',
        }}
        numberOfLines={1}>
        {buttonContent}
      </Text>
    </TouchableOpacity>
  );
};
