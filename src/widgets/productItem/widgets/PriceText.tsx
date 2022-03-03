import React, {FC} from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';
import Utils from '../../../utils/Utils';

interface PriceTextProps {
  value?: number;
  style?: StyleProp<TextStyle>;
  isActivity?: boolean;
}
// 商品现价
export const MartketPriceText: FC<PriceTextProps> = ({
  style,
  value = 0,
  isActivity,
}) => {
  return (
    <Text
      style={[
        {
          color: isActivity ? '#E00404' : 'black',
          fontWeight: 'bold',
        },
        style,
      ]}>
      {Utils.convertAmountUS(value)}
    </Text>
  );
};

interface OriginPriceTextProps {
  value?: number;
  style?: StyleProp<TextStyle>;
  isActivity?: boolean;
}
// 商品活动前价格
export const OriginPriceText: FC<OriginPriceTextProps> = ({
  style,
  value = 0,
  isActivity,
}) => {
  if (!isActivity) {
    return null;
  }
  return (
    <Text
      style={[{color: '#8A8A8A', textDecorationLine: 'line-through'}, style]}>
      {Utils.convertAmountUS(value)}
    </Text>
  );
};
