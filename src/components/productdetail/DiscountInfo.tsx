import {ProductDetailFreeShippingInfo} from '@luckydeal/api-common';
import React, {FC, Fragment, useMemo, useCallback} from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {px} from '../../constants/constants';
import {AVILIABLE_COUPON_FROM_ENUM} from '../../constants/enum';
import {navigationRef} from '../../utils/refs';
import Utils from '../../utils/Utils';
import {parseCouponInfoItem} from '../../widgets/coupons/Coupons';
import {CouponDialogControl} from '../../widgets/dialogs/couponDialog/CouponDialogControl';
import {Space} from '../common/Space';

interface DiscountInfoProps {
  freeShipping?: ProductDetailFreeShippingInfo;
  productId: number;
}

export const DiscountInfo: FC<DiscountInfoProps> = ({
  freeShipping,
  productId,
}) => {
  const handleFreeShipingPress = useCallback(() => {
    if (!freeShipping) {
      return;
    }
    navigationRef.current.navigate('DiscountList', {
      activity_id: freeShipping.free_shipping_act_id,
    });
  }, [freeShipping]);

  const productIds = useMemo(() => {
    return [productId];
  }, [productId]);

  return (
    <CouponDialogControl
      title={'Discounts & Coupons'}
      productIds={productIds}
      from={AVILIABLE_COUPON_FROM_ENUM.PRODUCT_DETAIL}>
      {(avilibleCoupon, open) => {
        const hasValidCoupon = !!(
          avilibleCoupon?.activity_sale_info?.discount_info ||
          avilibleCoupon?.coupon_info?.length ||
          (avilibleCoupon?.promo_code_info &&
            avilibleCoupon.promo_code_info.id !== 0)
        );

        if (!freeShipping?.is_free_shipping_fee && !hasValidCoupon) {
          return null;
        }

        return (
          <>
            <View
              style={{paddingHorizontal: 20 * px, paddingVertical: 20 * px}}>
              <Text
                style={{
                  fontSize: 38 * px,
                  fontWeight: 'bold',
                  marginBottom: 10 * px,
                }}>
                Discounts & Coupons
              </Text>
              {avilibleCoupon?.activity_sale_info?.discount_info && (
                <DiscountListItem
                  icon={require('../../assets/discount_icon.png')}
                  onPress={open}>
                  <Text style={{fontSize: 30 * px}}>
                    {avilibleCoupon.activity_sale_info.discount_info.map(
                      (val, index) => {
                        return (
                          <Fragment key={val.discount}>
                            {index === 0 || ', '}Buy {val.number} for{' '}
                            <Text style={{color: '#E00404'}}>
                              {val.discount * 100}% off
                            </Text>
                          </Fragment>
                        );
                      },
                    )}
                  </Text>
                </DiscountListItem>
              )}
              {((avilibleCoupon?.coupon_info &&
                !!avilibleCoupon?.coupon_info.length) ||
                (avilibleCoupon?.promo_code_info &&
                  avilibleCoupon.promo_code_info.id !== 0)) && (
                <DiscountListItem
                  icon={require('../../assets/code_group_icon.png')}
                  onPress={open}>
                  <View style={{flexDirection: 'row'}}>
                    {avilibleCoupon.promo_code_info &&
                      avilibleCoupon.promo_code_info.id !== 0 && (
                        <Text
                          style={{
                            fontSize: 30 * px,
                            paddingHorizontal: 10 * px,
                            paddingVertical: 3 * px,
                            backgroundColor: '#F7F7F7',
                            borderRadius: 8 * px,
                          }}>
                          {Utils.convertAmountUS(
                            avilibleCoupon.promo_code_info.amount,
                          )}{' '}
                          off,use code{' '}
                          {avilibleCoupon.promo_code_info.promo_code}
                        </Text>
                      )}
                    {avilibleCoupon.coupon_info &&
                      !!avilibleCoupon?.coupon_info.length && (
                        <ImageBackground
                          style={{
                            width: 360 * px,
                            height: 45 * px,
                            justifyContent: 'center',
                          }}
                          resizeMode="stretch"
                          source={require('../../assets/code_discount_coupon_bg.png')}>
                          <Text
                            adjustsFontSizeToFit
                            style={{
                              width: 360 * px,
                              fontSize: 28 * px,
                              color: 'white',
                              textAlign: 'center',
                            }}>
                            {parseCouponInfoItem(
                              avilibleCoupon.coupon_info[0],
                            ).couponAmount.replace('\n', ' ')}{' '}
                            with coupon
                          </Text>
                        </ImageBackground>
                      )}
                  </View>
                </DiscountListItem>
              )}

              {freeShipping?.is_free_shipping_fee && (
                <DiscountListItem onPress={handleFreeShipingPress}>
                  <Text style={{fontSize: 30 * px}}>Free shipping</Text>
                </DiscountListItem>
              )}
            </View>
            <Space height={20} backgroundColor="#eee" />
          </>
        );
      }}
    </CouponDialogControl>
  );
};

interface DiscountListItemProps {
  icon?: number;
  onPress?: () => void;
}

export const DiscountListItem: FC<DiscountListItemProps> = ({
  icon = require('../../assets/free_ship.png'),
  children,
  onPress,
}) => {
  return (
    <TouchableOpacity
      disabled={!onPress}
      activeOpacity={0.6}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18 * px,
      }}>
      <Image
        style={{width: 65 * px, height: 44 * px}}
        resizeMode="contain"
        source={icon}
      />
      <View style={{flex: 1, marginLeft: 24 * px, justifyContent: 'center'}}>
        {children}
      </View>
      {onPress && (
        <Image
          resizeMode="contain"
          style={{marginLeft: 'auto', width: 19 * px, height: 33 * px}}
          source={require('../../assets/icon_right_black.png')}
        />
      )}
    </TouchableOpacity>
  );
};
