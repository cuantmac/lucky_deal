import {createStyleSheet} from '@src/helper/helper';
import {GlideImage} from '@src/widgets/glideImage';
import React, {FC} from 'react';
import {View, Text, ViewStyle} from 'react-native';

interface CouponEmptyProps {
  style?: ViewStyle;
}

export const CouponEmpty: FC<CouponEmptyProps> = ({style}) => {
  return (
    <View style={[CouponEmptyStyles.emptyContainer, style]}>
      <GlideImage
        style={CouponEmptyStyles.emptyImage}
        defaultSource={false}
        source={require('@src/assets/coupon_empty_icon.png')}
      />
      <Text style={CouponEmptyStyles.emptyText}>It is empty here!</Text>
    </View>
  );
};

const CouponEmptyStyles = createStyleSheet({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyImage: {
    width: 41,
    height: 36,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 13,
    color: '#222',
    lineHeight: 18,
  },
});
