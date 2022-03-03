import React, {FC} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {AVILIABLE_COUPON_FROM_ENUM} from '@src/constants/enum';
import {CouponDialogControl} from '@src/widgets/dialogs/couponDialog/CouponDialogControl';
import {GlideImage} from '@src/widgets/glideImage';
import {createStyleSheet} from '@src/helper/helper';

interface CouponWidgetsProps {
  productIds: number[];
  onRefresh?: () => void;
}

export const CouponWidgets: FC<CouponWidgetsProps> = ({
  productIds,
  onRefresh,
}) => {
  return (
    <CouponDialogControl
      onRefresh={onRefresh}
      from={AVILIABLE_COUPON_FROM_ENUM.SHOP_CART}
      title={'Coupons'}
      productIds={productIds}>
      {(data, open) => {
        if (!data) {
          return null;
        }
        return (
          <TouchableOpacity
            style={CouponWidgetsStyles.btn}
            activeOpacity={0.8}
            onPress={open}>
            <GlideImage
              style={CouponWidgetsStyles.image}
              source={require('@src/assets/cart_coupon_icon.png')}
            />
            <Text style={CouponWidgetsStyles.text}>Get coupons</Text>
          </TouchableOpacity>
        );
      }}
    </CouponDialogControl>
  );
};

const CouponWidgetsStyles = createStyleSheet({
  btn: {
    height: 40,
    width: 131,
    borderRadius: 40,
    backgroundColor: '#FCF0D4',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    right: 16,
  },
  image: {
    height: 18,
    width: 21,
  },
  text: {
    fontSize: 14,
    color: '#FC7F37',
    marginLeft: 10,
  },
});
