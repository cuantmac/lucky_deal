import {FreeFee, ProductDiscount} from '@luckydeal/api-common';
import React, {FC, useCallback} from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import AppModule from '../../../../AppModule';
import {px} from '../../../constants/constants';
import {ACTIVITY_ID_ENUM} from '../../../constants/enum';
import {reportData} from '../../../constants/reportData';
import {useShallowEqualSelector} from '../../../utils/hooks';
import {navigationRef} from '../../../utils/refs';
import Utils, {fetchOrderAddItemsConfig} from '../../../utils/Utils';
import {ButtonAction} from '../BottomFreeBanner';

interface DiscountItemProps {
  onPress?: () => void;
  icon?: number;
}

export const DiscountItem: FC<DiscountItemProps> = ({
  icon = require('../../../assets/free_ship.png'),
  children,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30 * px,
        backgroundColor: 'white',
      }}>
      <Image resizeMode="contain" source={icon} style={{width: 65 * px}} />
      <Text
        style={{
          color: '#528BFC',
          fontSize: 38 * px,
          marginLeft: 33 * px,
          lineHeight: 40 * px,
        }}>
        {children}
      </Text>
      <Image
        resizeMode="contain"
        style={{width: 20 * px, marginLeft: 'auto'}}
        source={require('../../../assets/me_arrow.png')}
      />
    </TouchableOpacity>
  );
};

interface ShippingDiscoutItemProps {
  data?: FreeFee;
}

export const ShippingDiscoutItem: FC<ShippingDiscoutItemProps> = ({data}) => {
  const {token} = useShallowEqualSelector(
    (state: any) => state.deprecatedPersist,
  );
  const buyMore = useCallback(() => {
    AppModule.reportClick('23', '340');
    fetchOrderAddItemsConfig(
      token,
      ButtonAction.BACKCART,
      reportData.cartGoAddItems,
      data?.free_need_amt || data?.free_need_amt || 0,
    );
  }, [data, token]);

  if (!data || data.status === 0) {
    return null;
  }
  return (
    <DiscountItem onPress={buyMore}>
      {data.free_need_amt <= 0
        ? 'Free shipping'
        : `${Utils.convertAmountUS(
            data?.free_need_amt || 0,
          )} MORE to enjoy Free shipping`}
    </DiscountItem>
  );
};

interface BundleSaleDiscoutItemProps {
  data?: ProductDiscount;
}

export const BundleSaleDiscoutItem: FC<BundleSaleDiscoutItemProps> = ({
  data,
}) => {
  const handleOnPress = useCallback(() => {
    navigationRef.current.navigate('DiscountList', {
      activity_id: ACTIVITY_ID_ENUM.BUNDLE_SALE,
    });
  }, []);
  if (!(data && data.next_discount > 0)) {
    return null;
  }
  return (
    <DiscountItem
      onPress={handleOnPress}
      icon={require('../../../assets/ic_discount.png')}>
      {data.next_more_discount_number} more item to enjoy {data.next_discount}%
      OFF
    </DiscountItem>
  );
};
