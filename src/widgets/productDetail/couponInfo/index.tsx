import {ProductDetailFreeShippingInfo} from '@luckydeal/api-common';
import React, {FC, Fragment, memo, useMemo} from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ViewStyle,
} from 'react-native';
import {AVILIABLE_COUPON_FROM_ENUM} from '@src/constants/enum';
import {parseCouponInfoItem} from '@src/widgets/coupons/Coupons';
import {CouponDialogControl} from '@src/widgets/dialogs/couponDialog/CouponDialogControl';
import {
  convertAmountUS,
  createStyleSheet,
  styleAdapter,
} from '@src/helper/helper';
import {ProductDetailModule} from '../widgets';

interface CouponInfoProps {
  freeShipping?: ProductDetailFreeShippingInfo;
  productId: number;
}

export const CouponInfo: FC<CouponInfoProps> = memo(({productId}) => {
  const productIds = useMemo(() => {
    return [productId];
  }, [productId]);

  return (
    <CouponDialogControl
      title={'Coupons'}
      productIds={productIds}
      from={AVILIABLE_COUPON_FROM_ENUM.PRODUCT_DETAIL}>
      {(avilibleCoupon, open) => {
        return (
          <ProductDetailModule>
            <View style={CouponInfoStyles.container}>
              <Text
                style={styleAdapter(
                  {
                    fontSize: 38,
                    fontWeight: 'bold',
                    marginBottom: 10,
                  },
                  true,
                )}>
                Coupons
              </Text>
              {((avilibleCoupon?.coupon_info &&
                !!avilibleCoupon?.coupon_info.length) ||
                (avilibleCoupon?.promo_code_info &&
                  avilibleCoupon.promo_code_info.id !== 0)) && (
                <DiscountListItem
                  icon={require('@src/assets/coupon_code_icon.png')}
                  onPress={open}>
                  <View style={{flexDirection: 'row'}}>
                    {avilibleCoupon.promo_code_info &&
                      avilibleCoupon.promo_code_info.id !== 0 && (
                        <DiscountCoupon>
                          {convertAmountUS(
                            avilibleCoupon.promo_code_info.amount,
                          )}
                          off,use code{' '}
                          {avilibleCoupon.promo_code_info.promo_code}
                        </DiscountCoupon>
                      )}
                    {avilibleCoupon.coupon_info &&
                      !!avilibleCoupon?.coupon_info.length && (
                        <DiscountCoupon style={styleAdapter({marginLeft: 8})}>
                          {parseCouponInfoItem(avilibleCoupon.coupon_info[0])
                            .couponAmount.replace('\n', ' ')
                            .replace('OFF', 'off')}
                        </DiscountCoupon>
                      )}
                  </View>
                </DiscountListItem>
              )}
            </View>
          </ProductDetailModule>
        );
      }}
    </CouponDialogControl>
  );
});

interface DiscountListItemProps {
  icon?: number;
  onPress?: () => void;
}

export const DiscountListItem: FC<DiscountListItemProps> = ({
  icon = require('@src/assets/free_ship.png'),
  children,
  onPress,
}) => {
  return (
    <TouchableOpacity
      disabled={!onPress}
      activeOpacity={0.6}
      onPress={onPress}
      style={styleAdapter(
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 18,
        },
        true,
      )}>
      <Image
        style={styleAdapter({width: 18, height: 15})}
        resizeMode="contain"
        source={icon}
      />
      <View
        style={styleAdapter(
          {flex: 1, marginLeft: 24, justifyContent: 'center'},
          true,
        )}>
        {children}
      </View>
      {onPress && (
        <Image
          resizeMode="contain"
          style={styleAdapter({marginLeft: 'auto', width: 10, height: 10})}
          source={require('@src/assets/me_arrow.png')}
        />
      )}
    </TouchableOpacity>
  );
};

const CouponInfoStyles = createStyleSheet({
  container: {
    paddingVertical: 13,
  },
});

interface DiscountCouponProps {
  children?: string | string[];
  style?: ViewStyle;
}

const DiscountCoupon: FC<DiscountCouponProps> = ({children, style}) => {
  return (
    <View style={[DiscountCouponStyles.container, style]}>
      <View
        style={[DiscountCouponStyles.circle, DiscountCouponStyles.leftCircle]}
      />
      <Text style={DiscountCouponStyles.text}>{children}</Text>
      <View
        style={[DiscountCouponStyles.circle, DiscountCouponStyles.rightCircle]}
      />
    </View>
  );
};

const DiscountCouponStyles = createStyleSheet({
  container: {
    height: 20,
    paddingHorizontal: 10,
    position: 'relative',
    backgroundColor: 'rgba(232,59,24,0.11)',
    overflow: 'hidden',
    borderRadius: 1,
    justifyContent: 'center',
  },
  circle: {
    width: 8,
    height: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    top: 6,
    position: 'absolute',
  },
  leftCircle: {
    left: -4,
  },
  rightCircle: {
    right: -4,
  },
  text: {
    color: '#E83B18',
    fontSize: 12,
  },
});
