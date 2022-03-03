import React, {FC} from 'react';
import {Text, TouchableOpacity, Image, useWindowDimensions} from 'react-native';
import {px} from '../../../constants/constants';
import {AVILIABLE_COUPON_FROM_ENUM} from '../../../constants/enum';
import {CouponDialogControl} from '../../../widgets/dialogs/couponDialog/CouponDialogControl';
import {GestureDrag} from '../../../widgets/gestureDrag/GestureDrag';

interface CouponWidgetsProps {
  productIds: number[];
}

export const CouponWidgets: FC<CouponWidgetsProps> = ({productIds}) => {
  const {height} = useWindowDimensions();
  return (
    <CouponDialogControl
      from={AVILIABLE_COUPON_FROM_ENUM.SHOP_CART}
      title={'Coupons'}
      productIds={productIds}>
      {(data, open) => {
        if (!data) {
          return null;
        }
        return (
          <GestureDrag boxWidth={244 * px} distance={0} top={height * 0.6}>
            {({left, moving}) => {
              return (
                <TouchableOpacity
                  style={{
                    width: 244 * px,
                    height: 110 * px,
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 2,
                    borderTopLeftRadius: !left || moving ? 20 * px : 0,
                    borderBottomLeftRadius: !left || moving ? 20 * px : 0,
                    borderTopRightRadius: left || moving ? 20 * px : 0,
                    borderBottomRightRadius: left || moving ? 20 * px : 0,
                  }}
                  activeOpacity={0.8}
                  onPress={open}>
                  <Image
                    resizeMode="contain"
                    style={{
                      height: 60 * px,
                    }}
                    source={require('../../../assets/shop_drag.png')}
                  />
                  <Text
                    style={{
                      fontSize: 30 * px,
                      color: '#E26000',
                    }}>
                    Get coupons
                  </Text>
                </TouchableOpacity>
              );
            }}
          </GestureDrag>
        );
      }}
    </CouponDialogControl>
  );
};
